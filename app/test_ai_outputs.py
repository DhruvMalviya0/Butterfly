import os
import json
from google import genai

# Ensure your GEMINI_API_KEY environment variable is set before running
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Mock Data Structures mimicking your SQLite Database setup
BASE_PROFILE = {
    "name": "Dhruv Malviya",
    "skills": "Python, FastAPI, JavaScript, Next.js, Playwright, Machine Learning, DevOps",
    "education": "B.Tech in Computer Science & Engineering (2027)"
}

PROJECT_POOL = [
    {
        "id": 1,
        "title": "Cloud Automation Janitor",
        "tech_stack": "Python, Terraform, LocalStack, Docker",
        "description": "An automated infrastructure cleanup tool that scans staging environments for orphaned resources and safely terminates them to save costs."
    },
    {
        "id": 2,
        "title": "Predictive Time-Series Forecast Tool",
        "tech_stack": "Python, Pandas, Scikit-Learn, ARIMA",
        "description": "An analytical data engine mapping market historical values to forecast demand metrics, calculating risk parameters like Sharpe Ratio."
    },
    {
        "id": 3,
        "title": "Desktop AI Automation Suite",
        "tech_stack": "Python, Playwright, LLM Tool-Calling",
        "description": "A headless execution assistant utilizing custom scripting hooks to autonomously handle routine administration and fetch target listings."
    }
]

UNFINISHED_PROJECTS = [
    {
        "title": "Project Cascade / Butterfly Bot",
        "tech_stack": "FastAPI, Next.js, SQLite, Playwright",
        "description": "Building an automated job hunter with integrated multi-site scraping and AI resume generation. Currently working out how to handle secure user storage tokens for social api endpoints."
    }
]

MOCK_COMPANY_JD = """
We are looking for a DevOps & Cloud Automation Intern. The ideal candidate will write clean Python automation scripts, 
work with Docker containers, maintain local testing pipelines, and optimize infrastructure orchestration tasks.
"""

MOCK_DAILY_NOTES = "Fixed a weird fetch error caused by mismatched local loopback addresses between Nextjs and FastAPI. Managed to make the cross-origin headers work securely. SQLite database is syncing rows nicely now."



### Scenario 1: Simulate Dynamic Resume Optimization

def simulate_resume_tailoring(job_desc: str, pool: list):
    print("\n⚡ [1/3] Simulating Resume Tailoring & Project Matching...")
    
    prompt = f"""
    Act as an elite technical recruiter. You are adjusting a candidate's resume to match a specific target company's job description.
    
    Target Job Description:
    {job_desc}
    
    Candidate's Available Project Pool:
    {json.dumps(pool, indent=2)}
    
    Task:
    Select exactly the top 1 or 2 projects that exhibit the highest technical proximity to the job requirements.
    For each selected project, write a highly tailored, high-impact bullet point phrase highlighting how that specific project directly solves the needs outlined in the description.
    
    Output strictly as a valid JSON array of objects with keys 'project_id', 'title', and 'tailored_bullet_point'.
    Do not wrap the output in markdown code blocks or add introductory text. Raw JSON only.
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    print("=== AI Generated Resume Customization Data ===")
    print(response.text.strip())



### Scenario 2: Simulate LinkedIn Journal (Active Input)

def simulate_active_journal_post(notes: str):
    print("\n📝 [2/3] Simulating Daily Journal to LinkedIn Copy Conversion...")
    
    prompt = f"""
    Transform these raw, informal developer daily work logs into a clean, compelling, and professional LinkedIn post.
    
    Guidelines:
    - Sound like an authentic, high-output builder tracking progress in public.
    - Avoid generic corporate buzzwords ('thrilled to announce', 'passionate about').
    - Keep formatting readable with clean single line breaks.
    - Limit to a maximum of 2 highly specific hashtags.
    
    Raw Developer Notes:
    {notes}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    print("=== AI Generated LinkedIn Post (Active Note) ===")
    print(response.text.strip())


### Scenario 3: Simulate LinkedIn Journal (Fallback Path)

def simulate_fallback_project_post(unfinished_project: dict):
    print("\n🦋 [3/3] Simulating Fallback Post Generation From Unfinished Project...")
    
    prompt = f"""
    The developer forgot to log their daily progress today. Look at this unfinished project from their workspace 
    and synthesize an engineering-focused 'Build in Public' update post for LinkedIn.
    
    Guidelines:
    - Frame it around what the developer is currently thinking about, a technical blocker they are trying to solve, or what the next logical code patch/feature change will be.
    - Focus strictly on technical reality over high-level descriptions.
    
    Unfinished Project Context:
    Title: {unfinished_project['title']}
    Stack: {unfinished_project['tech_stack']}
    Current Status/Notes: {unfinished_project['description']}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    print("=== AI Generated LinkedIn Post (WIP Fallback Node) ===")
    print(response.text.strip())

if __name__ == "__main__":
    # Run the structural engine testing pass
    simulate_resume_tailoring(MOCK_COMPANY_JD, PROJECT_POOL)
    simulate_active_journal_post(MOCK_DAILY_NOTES)
    simulate_fallback_project_post(UNFINISHED_PROJECTS[0])