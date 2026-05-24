from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: str
    github_link: str


class ProjectRead(ProjectCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int


class ApplicationCreate(BaseModel):
    company_name: str
    job_title: str
    status: Optional[str] = "Scanned"


class ApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    status: Optional[str] = None


class ApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_name: str
    job_title: str
    status: str
    date_applied: datetime
