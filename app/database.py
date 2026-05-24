from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text, create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./butterfly.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(String, nullable=False)
    github_link = Column(String, nullable=False)


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    job_description = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="Scanned", server_default="Scanned")
    date_applied = Column(DateTime, nullable=False, default=datetime.utcnow)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    _ensure_application_job_description_column()


def _ensure_application_job_description_column() -> None:
    inspector = inspect(engine)
    if "applications" not in inspector.get_table_names():
        return

    column_names = {column["name"] for column in inspector.get_columns("applications")}
    if "job_description" in column_names:
        return

    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE applications ADD COLUMN job_description TEXT"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
