"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import DigitalDashboardPage from "@/app/employee/digitaldashboard/page";

export default function ClientDashboardRoute() {
  const params = useParams();
  const id = params?.id;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";
        const res = await fetch(`${apiUrl}/api/projects/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (data.client === "NovaNectar Pvt Ltd" && data.name === "Enterprise Resource Planner") {
            setProject(null);
          } else {
            setProject(data);
          }
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-white">
        <div className="text-sm font-medium">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-white">
        <div className="text-center p-8 rounded-2xl bg-white dark:bg-[#0B1224] border border-gray-200 dark:border-white/10 shadow-lg">
          <h2 className="text-xl font-bold mb-2">Project Not Found</h2>
          <p className="text-sm text-gray-500 mb-4">The assigned project with ID &quot;{id}&quot; does not exist.</p>
          <a
            href="/employee/digitaldashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            ← Back to Digital Dashboard
          </a>
        </div>
      </div>
    );
  }

  const mappedProject = {
    id: project.id || project._id,
    client: project.client,
    projectType: project.name,
    assignedBy: project.manager || "Unassigned",
    status: project.status || "Active",
    budget: project.budget,
    deadline: project.deadline ? new Date(project.deadline).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }) : "31 Jul 2026",
    files: project.files || []
  };

  return <DigitalDashboardPage clientProject={mappedProject} />;
}
