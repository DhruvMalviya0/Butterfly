import os
from datetime import datetime
from typing import Iterable, Sequence

from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
DEFAULT_CREDENTIALS_FILE = "credentials.json"
DEFAULT_RANGE = "Applications!A:E"


def get_sheets_service(credentials_file: str | None = None):
    credentials_path = credentials_file or os.getenv("GOOGLE_APPLICATION_CREDENTIALS", DEFAULT_CREDENTIALS_FILE)
    sheet_id = os.getenv("GOOGLE_SHEET_ID")
    if not sheet_id:
        raise RuntimeError("GOOGLE_SHEET_ID is required for Google Sheets sync")

    credentials = service_account.Credentials.from_service_account_file(credentials_path, scopes=SCOPES)
    return build("sheets", "v4", credentials=credentials, cache_discovery=False), sheet_id


def _format_row(app_data: dict) -> list[str]:
    date_applied = app_data.get("date_applied")
    if isinstance(date_applied, datetime):
        date_applied = date_applied.isoformat()
    elif date_applied is None:
        date_applied = ""

    return [
        str(app_data.get("id", "")),
        str(app_data.get("company_name", "")),
        str(app_data.get("job_title", "")),
        str(app_data.get("status", "Scanned")),
        str(date_applied),
    ]


def _find_row_by_application_id(service, sheet_id: str, application_id: int) -> int | None:
    response = service.spreadsheets().values().get(spreadsheetId=sheet_id, range=DEFAULT_RANGE).execute()
    values = response.get("values", [])
    for index, row in enumerate(values, start=1):
        if row and row[0] == str(application_id):
            return index
    return None


def sync_application_to_sheets(app_data: dict, operation: str = "append") -> None:
    service, sheet_id = get_sheets_service()
    row_values = _format_row(app_data)

    if operation == "append":
        service.spreadsheets().values().append(
            spreadsheetId=sheet_id,
            range=DEFAULT_RANGE,
            valueInputOption="USER_ENTERED",
            insertDataOption="INSERT_ROWS",
            body={"values": [row_values]},
        ).execute()
        return

    row_number = _find_row_by_application_id(service, sheet_id, int(app_data["id"]))
    if row_number is None:
        service.spreadsheets().values().append(
            spreadsheetId=sheet_id,
            range=DEFAULT_RANGE,
            valueInputOption="USER_ENTERED",
            insertDataOption="INSERT_ROWS",
            body={"values": [row_values]},
        ).execute()
        return

    service.spreadsheets().values().update(
        spreadsheetId=sheet_id,
        range=f"Applications!A{row_number}:E{row_number}",
        valueInputOption="USER_ENTERED",
        body={"values": [row_values]},
    ).execute()
