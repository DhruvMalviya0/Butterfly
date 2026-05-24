from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from .database import Application, Project, get_db, init_db
from .schemas import ApplicationCreate, ApplicationRead, ApplicationUpdate, ProjectCreate, ProjectRead
from .sheets_sync import sync_application_to_sheets

app = FastAPI(title="Butterfly Phase 1 API")


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


def _serialize_application(application: Application) -> dict:
    return {
        "id": application.id,
        "company_name": application.company_name,
        "job_title": application.job_title,
        "status": application.status,
        "date_applied": application.date_applied,
    }
