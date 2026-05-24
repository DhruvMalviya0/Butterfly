"use client";

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
  id: number;
  company_name: string;
  job_title: string;
  status: string;
  date_applied: string;
}

interface ProjectForm {
  title: string;
  description: string;
  tech_stack: string;
  github_link: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
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
  const [newProject, setNewProject] = useState<ProjectForm>({
    title: "",
    description: "",
    tech_stack: "",
    github_link: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/applications`);
      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading applications:", error);
      setMessage("Could not load applications from the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadApplications();
  }, []);

  const metrics = useMemo(() => {
    const totalApplications = applications.length;
    const totalScams = applications.filter((application) => application.status === "Scam").length;
    const positiveResponses = applications.filter((application) =>
      ["Interview Scheduled", "Accepted"].includes(application.status),
    ).length;
    const responseRate = totalApplications > 0 ? (positiveResponses / totalApplications) * 100 : 0;

    return {
      totalApplications,
      totalScams,
      responseRate,
    };
  }, [applications]);

  const visibleApplications = applications.filter((application) => application.status !== "Scam");

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
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
    }
  };

  const triggerResumeDownload = async (id: number) => {
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
    }
  };

  const handleProjectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingProject(true);

    try {
      const response = await fetch(`${BACKEND_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Project submission failed");
      }

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
                      <tr key={application.id} className="transition hover:bg-slate-900/70">
                        <td className="py-4 pr-4 font-medium text-white">{application.company_name}</td>
                        <td className="py-4 pr-4 text-slate-300">{application.job_title}</td>
                        <td className="py-4 pr-4 text-slate-400">
                          {new Date(application.date_applied).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-4 pr-4">
                          <select
                            value={application.status}
                            onChange={(event) => void handleStatusChange(application.id, event.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-emerald-300 outline-none transition focus:border-emerald-500"
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
                            disabled={activeResumeId === application.id}
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Download className="h-4 w-4" />
                            {activeResumeId === application.id ? "Preparing..." : "Tailor Resume"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Recruiter Description Blueprint
                </label>
                <textarea
                  required
                  rows={6}
                  value={newProject.description}
                  onChange={(event) => setNewProject({ ...newProject, description: event.target.value })}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
                  placeholder="Detail the technical outcome, datasets, deployment, and measurable impact..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingProject}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Sparkles className="h-4 w-4" />
                {isSubmittingProject ? "Committing..." : "Commit Asset to Database"}
              </button>
            </form>
          </aside>
        </section>
      </div>
    </main>
  );
}

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
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
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
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
      />
    </div>
  );
}
