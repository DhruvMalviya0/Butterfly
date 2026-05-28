# Project Butterfly 🦋
> **An Autonomous Multi-Site Recruitment Pipeline, Dynamic Document Assembly Engine & Dev-Journal CRM Workspace**

Project Butterfly is an advanced, full-stack automation platform designed to flip the traditional internship hunt on its head. Instead of sending standard, static applications, this system acts as an autonomous pipeline that scrapes top job boards, runs security checks to neutralize scams, and uses LLM semantic vector space matching to compile targeted resumes tailored to a company's unique profile on the fly. 

Additionally, it features an integrated **Autonomous Technical Branding Engine**—a developer journal that synthesizes raw engineering logs or active work-in-progress drafts into professional "Build in Public" LinkedIn posts.

---

## 🏗️ Architectural Core & System Data Flow

The architecture operates via a decoupled, asynchronous engine loop split across three core infrastructure blocks:

1. **Orchestrated Ingestion & Scam Mitigation:** A headless automation pipeline utilizing Playwright configurations cycles through an array of trusted platforms sequentially. Extracted listing metadata fields (`company_name`, `job_title`, `job_description`) pass through a multi-tiered heuristic barrier (Global exact-match blacklists + regex-based text mining) to cleanly catch fraudulent operations or ghost postings before storage.
2. **Dynamic Contextual Synthesizer:** When an application node is triggered, the Python backend queries the local SQLite data layer to pull your complete project catalog. The Google Gemini API analyzes the semantic correlation between the target company’s job description and your pool. It selects the optimal projects and generates highly specific, contextual accomplishments which are injected via Jinja2 into an HTML/CSS template. WeasyPrint compiles this directly into an ATS-compliant, copy-pasteable PDF.
3. **Social Syndication & Branding Hub:** Keeps track of daily engineering micro-logs. If active logs are submitted, Gemini formats them into concise, engaging tech posts. If no input is given, the fallback worker isolates unfinished project concepts from the database and constructs a high-value engineering problem-statement thread, dropping all items into a frontend "Pending Review" approval queue before using social endpoints.

---

## 🛠️ Consolidated Tech Stack

Project Butterfly maintains strict technical boundaries, relying on exactly one definitive industry tool per logical task:

| Sub-System Node | Technology Selection | Operational Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | `Next.js` (React) | High-fidelity SPA structure, component-driven client tracking tables, and live state rendering. |
| **UI Styling** | `Tailwind CSS` | Rapid micro-component layouts with custom dark/neon status vectors and state indicators. |
| **API Backend Layer** | `FastAPI` (Python) | High-concurrency asynchronous worker management and lightweight routing controllers. |
| **Relational Storage** | `SQLite` via `SQLAlchemy` | Local relational data modeling mapping applications, projects, journals, and social queues. |
| **Artificial Intelligence** | `Google Gemini API` | Real-time semantic analysis, portfolio parsing, and programmatic text synthesis. |
| **Document Assembly** | `WeasyPrint` | Programmatic HTML-to-PDF compilation building completely clean, ATS-readable assets. |
| **Browser Automation** | `Playwright` | Headless rendering capable of navigating complex modern, client-side JS-heavy job portals. |
| **External Cloud Sync** | `Google Sheets API` | Distributed data mirroring providing real-time logging to an external spreadsheet CRM. |

---

## 🗃️ Complete Database Schema Matrix

The application's data structure handles the operational parameters using four interrelated relational tables within `butterfly.db`:

* `applications`: Tracks company information, job titles, scraped summaries, and state machine vectors (`Scanned`, `Applied`, `Ghosted`, `Rejected`, `Accepted`).
* `projects`: Serves as the candidate asset pool containing titles, primary technical stacks, source links, and operational metrics. Includes an `is_finished` boolean flag to trigger social engine fallbacks.
* `journal_entries`: Simple tracking table logging time-stamped raw developer notes submitted via the frontend text controls.
* `linkedin_queue`: Manages synthesized post drafts waiting for manual user review, tracking string outputs and execution tags (`Pending`, `Approved`, `Posted`).

---

## 🗺️ Engineering Milestone Phases

### Phase 1: Distributed Data Sync Layer (`feature/db-and-tracker-sync`)
* Architected the SQLAlchemy base model mapping parameters over SQLite.
* Configured a cloud service account connection via the `google-api-python-client` to execute non-blocking row operations.
* Devised webhook triggers ensuring any status badge update on the UI mirrors live to the target Google Spreadsheet within seconds.

### Phase 2: Semantic Document Assembly Engine (`feature/ai-resume-generator`)
* Implemented the Gemini API mapping interface utilizing strict prompt configurations to force raw structured JSON returns.
* Designed a beautiful, single-page resume template file using highly semantic HTML structures and plain CSS layouts.
* Hooked up a FastAPI controller that matches project elements, hydrates placeholders, and returns compiled PDF files directly to browser tabs.

### Phase 3: Orchestrated Multi-Site Ingestion (`feature/scraper-and-scam-filter`)
* Developed a scalable configuration matrix within Playwright to loop across distinct target platforms seamlessly.
* Formulated a Tier 1 Global Blacklist array and a Tier 2 Regex Engine to instantly flag common recruitment scam patterns (*unpaid safety deposits*, *telegram interviews*, *training fees*).

### Phase 4: Full-Stack Command Center & Branding Hub (`feature/frontend-crm-dashboard`)
* Formulated a beautiful web interface featuring real-time data metrics, application tracking matrices, and inline drop-down selectors.
* Added a dedicated Content-Generation block allowing users to submit quick notes, review AI-generated drafts, and manually approve social syndication pipelines.

---

## 📊 End-to-End Operational Verification

The core AI routines have been validated through edge-case testing metrics to confirm systemic performance:

### 1. Dynamic Project Matching Execution
* **ML/Data Analyst Search:** When given a data analyst job description, the engine automatically isolates and prioritizes the **Predictive Time-Series Forecast Tool** project.
* **DevOps/Automation Search:** When given an infrastructure job description, the engine dynamically strips the data analytics project and highlights the **Cloud Automation Janitor** tool.

### 2. Branding Engine Fallback Verification
* **Active Progress Path:** Transforms messy notes: *"fixed loopback CORS error between NextJS and FastAPI"* into an insightful post outlining cross-origin architecture solutions.
* **WIP Fallback Path:** If no notes exist, it maps unfinished project parameters and constructs a problem-statement discussing token-handling architecture inside Python environments.

---

## ⚙️ Installation & Local Initialization

### 1. Backend API Deployment
Ensure you save your parameters inside a local `.env` configuration file in the backend root directory before initializing:
```bash
# Move into the backend repository and activate your virtual environment
$ cd backend
$ source .venv/bin/activate

# Install required dependencies
$pip install fastapi uvicorn sqlalchemy google-genai weasyprint playwright$ playwright install chromium

# Launch the server instance via Uvicorn
$ uvicorn main:app --reload

# Move into the frontend UI folder
$ cd frontend

# Install UI components and state management hooks
$ npm install

# Launch the Next.js Turbopack development workspace
$ npm run dev
```
