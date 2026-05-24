import asyncio
import ast
import json
import os
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from jinja2 import Environment, FileSystemLoader, select_autoescape
from sqlalchemy.orm import Session

from .database import Application, Project, SessionLocal, get_db, init_db
from .schemas import ApplicationCreate, ApplicationRead, ApplicationUpdate, ProjectCreate, ProjectRead
from .sheets_sync import sync_application_to_sheets
from matcher import get_best_matching_projects
from scraper import harvest_job_listings

try:
    from weasyprint import HTML
except Exception:  # pragma: no cover - depends on native system libraries
    HTML = None

app = FastAPI(title="Butterfly Phase 1 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parents[1]
TEMPLATE_DIR = BASE_DIR / "templates"
PDF_OUTPUT_PATH = BASE_DIR / "tailored_resume.pdf"
CANDIDATE_NAME = "Your Name"
CANDIDATE_CONTACT = "Email | GitHub | LinkedIn"
jinja_env = Environment(
    loader=FileSystemLoader(str(TEMPLATE_DIR)),
    autoescape=select_autoescape(["html", "xml"]),
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.post("/projects", response_model=ProjectRead)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@app.get("/projects", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.id.desc()).all()


@app.post("/applications", response_model=ApplicationRead)
def create_application(
    payload: ApplicationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    application = Application(**payload.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    background_tasks.add_task(sync_application_to_sheets, _serialize_application(application), "append")
    return application


@app.get("/applications", response_model=list[ApplicationRead])
def list_applications(db: Session = Depends(get_db)):
    return db.query(Application).order_by(Application.id.desc()).all()


@app.put("/applications/{application_id}", response_model=ApplicationRead)
def update_application(
    application_id: int,
    payload: ApplicationUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    application = db.get(Application, application_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    updates = payload.model_dump(exclude_unset=True)
    for field_name, field_value in updates.items():
        setattr(application, field_name, field_value)

    db.commit()
    db.refresh(application)
    background_tasks.add_task(sync_application_to_sheets, _serialize_application(application), "update")
    return application


@app.post("/automation/trigger-ingestion")
def trigger_pipeline_ingestion(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_scraper_background_task)
    return {"message": "Autonomous job harvesting pipeline initialized in background."}


@app.post("/applications/generate-resume/{app_id}")
def generate_resume(app_id: int, db: Session = Depends(get_db)):
    application = db.get(Application, app_id)
    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    projects = db.query(Project).all()
    if not projects:
        raise HTTPException(status_code=400, detail="No projects available for resume generation")

    job_description = application.job_description or application.job_title
    project_pool = [
        {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "tech_stack": project.tech_stack,
        }
        for project in projects
    ]

    selected_project_ids = _rank_project_ids(job_description, project_pool)
    selected_projects = [project for project in projects if project.id in selected_project_ids]
    if not selected_projects:
        selected_projects = projects[:3]

    selected_projects = selected_projects[:3]
    template = jinja_env.get_template("resume_blueprint.html")
    rendered_html = template.render(
        candidate_name=CANDIDATE_NAME,
        candidate_contact=CANDIDATE_CONTACT,
        company_name=application.company_name,
        job_title=application.job_title,
        job_description=job_description,
        selected_projects=selected_projects,
    )

    rendered_with_weasyprint = False
    if HTML is not None:
        try:
            HTML(string=rendered_html, base_url=str(BASE_DIR)).write_pdf(str(PDF_OUTPUT_PATH))
            rendered_with_weasyprint = True
        except Exception:
            rendered_with_weasyprint = False

    if not rendered_with_weasyprint:
        _write_pdf_fallback(selected_projects, application.company_name, application.job_title, job_description)

    return FileResponse(
        path=str(PDF_OUTPUT_PATH),
        media_type="application/pdf",
        filename="tailored_resume.pdf",
    )


def _serialize_application(application: Application) -> dict:
    return {
        "id": application.id,
        "company_name": application.company_name,
        "job_title": application.job_title,
        "job_description": application.job_description,
        "application_link": application.application_link,
        "status": application.status,
        "date_applied": application.date_applied,
    }


def _rank_project_ids(job_description: str, project_pool: list[dict]) -> list[int]:
    response_text = get_best_matching_projects(job_description, project_pool)
    try:
        parsed = json.loads(response_text)
    except json.JSONDecodeError:
        parsed = ast.literal_eval(response_text)

    if not isinstance(parsed, list):
        raise HTTPException(status_code=502, detail="Gemini did not return a project list")

    project_ids: list[int] = []
    for item in parsed:
        try:
            project_id = int(item)
        except (TypeError, ValueError):
            continue
        if project_id not in project_ids:
            project_ids.append(project_id)

    return project_ids[:3]


def _write_pdf_fallback(selected_projects: list[Project], company_name: str, job_title: str, job_description: str) -> None:
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.lib.units import inch
    from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "ResumeTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor="#1d2433",
        spaceAfter=6,
    )
    meta_style = ParagraphStyle(
        "ResumeMeta",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor="#5d667a",
        spaceAfter=10,
    )
    section_style = ParagraphStyle(
        "ResumeSection",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor="#0f766e",
        spaceBefore=10,
        spaceAfter=8,
    )
    project_title_style = ParagraphStyle(
        "ProjectTitle",
        parent=styles["BodyText"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor="#1d2433",
        spaceAfter=3,
    )
    body_style = ParagraphStyle(
        "ProjectBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor="#5d667a",
        spaceAfter=6,
    )

    story = [
        Paragraph(xml_escape(CANDIDATE_NAME), title_style),
        Paragraph(xml_escape(CANDIDATE_CONTACT), meta_style),
        Paragraph(xml_escape(f"Tailored for {company_name} · {job_title}"), meta_style),
        Paragraph("SELECTED TECHNICAL PROJECTS", section_style),
        Paragraph(xml_escape(job_description), body_style),
        Spacer(1, 0.1 * inch),
    ]

    for project in selected_projects:
        story.append(Paragraph(xml_escape(f"{project.title} — {project.tech_stack}"), project_title_style))
        story.append(Paragraph(xml_escape(project.description), body_style))
        story.append(Paragraph(xml_escape(project.github_link), body_style))

    doc = SimpleDocTemplate(
        str(PDF_OUTPUT_PATH),
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        title="Tailored Resume",
        author=CANDIDATE_NAME,
    )
    doc.build(story)


def run_scraper_background_task() -> None:
    target_portal_url = os.getenv("JOB_PORTAL_URL", "https://example-internship-portal.com/jobs?q=python")
    harvested_data = asyncio.run(harvest_job_listings(target_portal_url))

    db = SessionLocal()
    try:
        for job in harvested_data:
            if job["status"] == "Scam":
                continue

            db_app = Application(
                company_name=job["company_name"],
                job_title=job["job_title"],
                job_description=job.get("job_description"),
                application_link=job.get("application_link"),
                status=job["status"],
            )
            db.add(db_app)
            db.commit()
            db.refresh(db_app)
            try:
                sync_application_to_sheets(_serialize_application(db_app), "append")
            except Exception:
                pass
    finally:
        db.close()
