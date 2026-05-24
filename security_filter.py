import re

COMPANY_BLACKLIST = [
    "Unpaid Growth Agencies",
    "Global Marketing Solutions LLC",
    "Anonymous Recruitment Firm",
    "Dream Career Placement",
]

SCAM_REGEX_PATTERNS = [
    r"unpaid\s+security\s+deposit",
    r"pay\s+for\s+training",
    r"crypto\s+wallet\s+required",
    r"telegram\s+interview",
    r"application\s+fee",
    r"send\s+money",
]


def evaluate_listing_security(company_name: str, job_description: str) -> str:
    """
    Evaluates the security and legitimacy of a scraped job listing.
    Returns 'Scam' if any red flags trigger, otherwise returns 'Scanned'.
    """
    if company_name.strip() in COMPANY_BLACKLIST:
        return "Scam"

    combined_text = job_description.lower()
    for pattern in SCAM_REGEX_PATTERNS:
        if re.search(pattern, combined_text):
            return "Scam"

    return "Scanned"