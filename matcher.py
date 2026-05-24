import os

from google import genai


def get_best_matching_projects(job_description: str, project_list: list) -> str:
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    prompt = f"""
    You are an expert technical recruiter. Analyze this Job Description and select exactly the
    top 2 or 3 projects from the Candidate Project Pool that best match the required technical skills.

    Job Description:
    {job_description}

    Candidate Project Pool:
    {project_list}

    Output your selection strictly as a JSON list of project IDs, ordered by relevance.
    Example output format: [2, 5]
    Do not return any markdown formatting, thoughts, or prose. Just the raw array.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return response.text.strip()