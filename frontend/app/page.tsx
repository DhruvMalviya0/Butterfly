"use client";

<<<<<<< HEAD
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Award,
  Briefcase,
  Download,
  PlusCircle,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface Application {
=======
import { useEffect, useMemo, useState, type FormEvent } from "react";

type Application = {
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
  id: number;
  company_name: string;
  job_title: string;
  status: string;
  date_applied: string;
<<<<<<< HEAD
}

interface ProjectForm {
=======
};

type Project = {
  id: number;
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
  title: string;
  description: string;
  tech_stack: string;
  github_link: string;
<<<<<<< HEAD
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
=======
};

type ProjectForm = {
  title: string;
  description: string;
  tech_stack: string;
  github_link: string;
};

type ApplicationForm = {
  company_name: string;
  job_title: string;
  status: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
const STATUS_OPTIONS = [
  "Scanned",
  "Applied",
  "Interview Scheduled",
  "Accepted",
  "Ghosted",
  "Rejected",
  "Scam",
];

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
<<<<<<< HEAD
=======
  const [projects, setProjects] = useState<Project[]>([]);
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
  const [newProject, setNewProject] = useState<ProjectForm>({
    title: "",
    description: "",
    tech_stack: "",
    github_link: "",
  });
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
=======
  const [newApplication, setNewApplication] = useState<ApplicationForm>({
    company_name: "",
    job_title: "",
    status: "Scanned",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [showAddApp, setShowAddApp] = useState(false);
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)

  const loadApplications = async () => {
    setIsLoading(true);
    try {
<<<<<<< HEAD
      const response = await fetch(`${BACKEND_URL}/applications`);
      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading applications:", error);
      setMessage("Could not load applications from the backend.");
=======
      const response = await fetch(`${BACKEND_URL}/applications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setStatusMessage("Could not load applications from the backend.");
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadApplications();
=======
  const loadProjects = async () => {
    setProjectsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/projects`);
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadApplications();
    void loadProjects();
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
  }, []);

  const metrics = useMemo(() => {
    const totalApplications = applications.length;
    const totalScams = applications.filter((application) => application.status === "Scam").length;
    const positiveResponses = applications.filter((application) =>
      ["Interview Scheduled", "Accepted"].includes(application.status),
    ).length;
<<<<<<< HEAD
    const responseRate = totalApplications > 0 ? (positiveResponses / totalApplications) * 100 : 0;

    return {
      totalApplications,
      totalScams,
      responseRate,
    };
  }, [applications]);

  const visibleApplications = applications.filter((application) => application.status !== "Scam");

=======
    const responseRate = totalApplications ? (positiveResponses / totalApplications) * 100 : 0;

    return { totalApplications, totalScams, responseRate };
  }, [applications]);

>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/applications/${id}`, {
        method: "PUT",
<<<<<<< HEAD
        headers: {
          "Content-Type": "application/json",
        },
=======
        headers: { "Content-Type": "application/json" },
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
<<<<<<< HEAD
        throw new Error("Failed to update application status");
      }

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === id ? { ...application, status: newStatus } : application,
        ),
      );
      setMessage(`Updated status to ${newStatus}.`);
    } catch (error) {
      console.error("Failed to update status:", error);
      setMessage("Status update failed. Check the backend connection.");
=======
        throw new Error("Status update failed");
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === id ? { ...application, status: newStatus } : application,
        ),
      );
      setStatusMessage(`Updated status to ${newStatus}.`);
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to update status.");
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
    }
  };

  const triggerResumeDownload = async (id: number) => {
<<<<<<< HEAD
    setActiveResumeId(id);
    const previewWindow = window.open("about:blank", "_blank", "noopener,noreferrer");

    try {
      const response = await fetch(`${BACKEND_URL}/applications/generate-resume/${id}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Resume generation failed");
      }

      const pdfBlob = await response.blob();
      const objectUrl = URL.createObjectURL(pdfBlob);

      if (previewWindow) {
        previewWindow.location.href = objectUrl;
      } else {
        const downloadLink = document.createElement("a");
        downloadLink.href = objectUrl;
        downloadLink.download = "tailored_resume.pdf";
        downloadLink.click();
      }

      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
      setMessage("Tailored resume generated successfully.");
    } catch (error) {
      console.error("Resume generation failed:", error);
      previewWindow?.close();
      setMessage("Resume generation failed. Check the backend logs.");
    } finally {
      setActiveResumeId(null);
=======
    try {
      window.open(`${BACKEND_URL}/applications/generate-resume/${id}`, "_blank", "noopener,noreferrer");
      setStatusMessage("Tailored resume requested.");
    } catch (error) {
      console.error(error);
      setStatusMessage("Resume generation failed.");
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
    }
  };

  const handleProjectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
<<<<<<< HEAD
    setIsSubmittingProject(true);

    try {
      const response = await fetch(`${BACKEND_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
=======
    try {
      const response = await fetch(`${BACKEND_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Project submission failed");
      }

<<<<<<< HEAD
      setNewProject({
        title: "",
        description: "",
        tech_stack: "",
        github_link: "",
      });
      setMessage("Project logged successfully to the database.");
    } catch (error) {
      console.error("Failed to add project:", error);
      setMessage("Project submission failed. Check the backend connection.");
    } finally {
      setIsSubmittingProject(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#07111f_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-emerald-500/20 bg-slate-950/70 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400/80">
                Project Cascade
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Autonomous CRM and Analytics Command Center
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                Track internship pipelines, publish portfolio projects, and generate tailored PDFs directly
                from the FastAPI backend.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadApplications()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-500 hover:text-emerald-300"
            >
              <RefreshCw className="h-4 w-4" /> Refresh Data
            </button>
          </div>
          {message ? (
            <p className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              {message}
            </p>
          ) : null}
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard
            label="Total Applications Processed"
            value={metrics.totalApplications.toString()}
            icon={<Briefcase className="h-5 w-5 text-emerald-300" />}
            accent="emerald"
          />
          <MetricCard
            label="Automated Scams Neutralized"
            value={metrics.totalScams.toString()}
            icon={<ShieldAlert className="h-5 w-5 text-rose-300" />}
            accent="rose"
          />
          <MetricCard
            label="Response Rate"
            value={`${metrics.responseRate.toFixed(1)}%`}
            icon={<Award className="h-5 w-5 text-sky-300" />}
            accent="sky"
          />
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Application Pipeline Tracking Matrix</h2>
                <p className="text-sm text-slate-400">
                  Update statuses in place and launch resume tailoring from the same row.
                </p>
              </div>
              <div className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {visibleApplications.length} active rows
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.2em] text-slate-400">
                    <th className="pb-3 pr-4 font-semibold">Company</th>
                    <th className="pb-3 pr-4 font-semibold">Position</th>
                    <th className="pb-3 pr-4 font-semibold">Applied</th>
                    <th className="pb-3 pr-4 font-semibold">Status</th>
                    <th className="pb-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-sm">
                  {isLoading ? (
                    <tr>
                      <td className="py-8 text-slate-400" colSpan={5}>
                        Loading applications from FastAPI...
=======
      setNewProject({ title: "", description: "", tech_stack: "", github_link: "" });
      setStatusMessage("Project committed to database.");
      void loadProjects();
    } catch (error) {
      console.error(error);
      setStatusMessage("Project submission failed.");
    }
  };

  const handleApplicationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApplication),
      });

      if (!response.ok) {
        throw new Error("Application submission failed");
      }

      setNewApplication({ company_name: "", job_title: "", status: "Scanned" });
      setShowAddApp(false);
      setStatusMessage("Application added to pipeline.");
      void loadApplications();
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to add application.");
    }
  };

  const visibleApplications = applications.filter((application) => application.status !== "Scam");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">Project Cascade</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Autonomous CRM and Analytics Command Center</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Track internship pipelines, manage portfolio projects, and generate tailored resumes from one dashboard.
          </p>
          {statusMessage ? <p className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm">{statusMessage}</p> : null}
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Total Applications Processed" value={metrics.totalApplications.toString()} />
          <MetricCard label="Automated Scams Neutralized" value={metrics.totalScams.toString()} />
          <MetricCard label="Response Rate" value={`${metrics.responseRate.toFixed(1)}%`} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Application Pipeline Tracking Matrix</h2>
                <p className="text-sm text-slate-400">Update statuses in place and launch resume generation.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddApp((prev) => !prev)}
                  className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-slate-950"
                >
                  {showAddApp ? "Cancel" : "+ Add Job"}
                </button>
                <button
                  type="button"
                  onClick={() => void loadApplications()}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-emerald-500"
                >
                  Refresh
                </button>
              </div>
            </div>

            {showAddApp && (
              <form
                onSubmit={(e) => void handleApplicationSubmit(e)}
                className="mb-5 grid gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:grid-cols-3"
              >
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Company Name
                  </label>
                  <input
                    required
                    type="text"
                    value={newApplication.company_name}
                    onChange={(e) => setNewApplication({ ...newApplication, company_name: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Job Title
                  </label>
                  <input
                    required
                    type="text"
                    value={newApplication.job_title}
                    onChange={(e) => setNewApplication({ ...newApplication, job_title: e.target.value })}
                    placeholder="e.g. SWE Intern"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Initial Status
                  </label>
                  <select
                    value={newApplication.status}
                    onChange={(e) => setNewApplication({ ...newApplication, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-emerald-300 outline-none focus:border-emerald-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="col-span-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-400"
                >
                  Add to Pipeline
                </button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.2em] text-slate-400">
                    <th className="pb-3 pr-4">Company</th>
                    <th className="pb-3 pr-4">Position</th>
                    <th className="pb-3 pr-4">Applied</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {isLoading ? (
                    <tr>
                      <td className="py-8 text-slate-400" colSpan={5}>
                        Loading applications...
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
                      </td>
                    </tr>
                  ) : visibleApplications.length === 0 ? (
                    <tr>
                      <td className="py-8 text-slate-400" colSpan={5}>
                        No active applications yet.
                      </td>
                    </tr>
                  ) : (
                    visibleApplications.map((application) => (
<<<<<<< HEAD
                      <tr key={application.id} className="transition hover:bg-slate-900/70">
                        <td className="py-4 pr-4 font-medium text-white">{application.company_name}</td>
                        <td className="py-4 pr-4 text-slate-300">{application.job_title}</td>
                        <td className="py-4 pr-4 text-slate-400">
                          {new Date(application.date_applied).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
=======
                      <tr key={application.id} className="hover:bg-slate-800/40">
                        <td className="py-4 pr-4 font-medium text-white">{application.company_name}</td>
                        <td className="py-4 pr-4 text-slate-300">{application.job_title}</td>
                        <td className="py-4 pr-4 text-slate-400">
                          {new Date(application.date_applied).toLocaleDateString()}
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
                        </td>
                        <td className="py-4 pr-4">
                          <select
                            value={application.status}
                            onChange={(event) => void handleStatusChange(application.id, event.target.value)}
<<<<<<< HEAD
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-emerald-300 outline-none transition focus:border-emerald-500"
=======
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-emerald-300 outline-none"
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            type="button"
                            onClick={() => void triggerResumeDownload(application.id)}
<<<<<<< HEAD
                            disabled={activeResumeId === application.id}
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Download className="h-4 w-4" />
                            {activeResumeId === application.id ? "Preparing..." : "Tailor Resume"}
=======
                            className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500 hover:text-slate-950"
                          >
                            Tailor Resume
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

<<<<<<< HEAD
          <aside className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-xl shadow-black/20">
            <div className="mb-4 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Portfolio Asset Intake</h2>
            </div>
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <Field label="Project Title" value={newProject.title} onChange={(value) => setNewProject({ ...newProject, title: value })} placeholder="Time-Series Demand Forecast" />
              <Field label="Core Tech Stack" value={newProject.tech_stack} onChange={(value) => setNewProject({ ...newProject, tech_stack: value })} placeholder="Python, Pandas, Scikit-learn" />
              <Field
                label="GitHub Link"
                value={newProject.github_link}
                onChange={(value) => setNewProject({ ...newProject, github_link: value })}
                placeholder="https://github.com/you/project"
              />
=======
          <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Portfolio Asset Intake</h2>
            <form onSubmit={(e) => void handleProjectSubmit(e)} className="space-y-4">
              <Field label="Project Title" value={newProject.title} onChange={(value) => setNewProject({ ...newProject, title: value })} />
              <Field label="Core Tech Stack" value={newProject.tech_stack} onChange={(value) => setNewProject({ ...newProject, tech_stack: value })} />
              <Field label="GitHub Link" value={newProject.github_link} onChange={(value) => setNewProject({ ...newProject, github_link: value })} />
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Recruiter Description Blueprint
                </label>
                <textarea
<<<<<<< HEAD
                  required
                  rows={6}
                  value={newProject.description}
                  onChange={(event) => setNewProject({ ...newProject, description: event.target.value })}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  placeholder="Detail the technical outcome, datasets, deployment, and measurable impact..."
=======
                  rows={6}
                  required
                  value={newProject.description}
                  onChange={(event) => setNewProject({ ...newProject, description: event.target.value })}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
                  placeholder="Describe the project, outcomes, and stack..."
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
                />
              </div>
              <button
                type="submit"
<<<<<<< HEAD
                disabled={isSubmittingProject}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Sparkles className="h-4 w-4" />
                {isSubmittingProject ? "Committing..." : "Commit Asset to Database"}
              </button>
            </form>
=======
                className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400"
              >
                Commit Asset to Database
              </button>
            </form>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Committed Projects</h3>
              {projectsLoading ? (
                <p className="text-sm text-slate-500">Loading...</p>
              ) : projects.length === 0 ? (
                <p className="text-sm text-slate-500">No projects committed yet.</p>
              ) : (
                <ul className="space-y-2">
                  {projects.map((project) => (
                    <li key={project.id} className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
                      <p className="text-sm font-semibold text-slate-100">{project.title}</p>
                      <p className="text-xs text-slate-400">{project.tech_stack}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
          </aside>
        </section>
      </div>
    </main>
  );
}

<<<<<<< HEAD
function MetricCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  accent: "emerald" | "rose" | "sky";
}) {
  const accentStyles = {
    emerald: "from-emerald-500/15 to-emerald-500/5 border-emerald-500/20",
    rose: "from-rose-500/15 to-rose-500/5 border-rose-500/20",
    sky: "from-sky-500/15 to-sky-500/5 border-sky-500/20",
  }[accent];

  return (
    <div className={`rounded-3xl border bg-gradient-to-br ${accentStyles} p-5 shadow-lg shadow-black/10`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</p>
          <h3 className="mt-3 text-3xl font-black text-white">{value}</h3>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">{icon}</div>
      </div>
=======
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</p>
      <h3 className="mt-3 text-3xl font-black text-white">{value}</h3>
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
<<<<<<< HEAD
  placeholder,
=======
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
<<<<<<< HEAD
  placeholder: string;
=======
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </label>
      <input
        required
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
<<<<<<< HEAD
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
      />
    </div>
  );
}
=======
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
      />
    </div>
  );
}
>>>>>>> b212720 (feat: initialize project structure with Next.js frontend, SQLite database, and resume generation templates)
