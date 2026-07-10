"use client";

import { useParams } from "next/navigation";
import { assignedProjects } from "@/components/digitaldashboard/data/mockData";
import DigitalDashboardPage from "@/app/employee/digitaldashboard/page";

export default function ClientDashboardRoute() {
  const params = useParams();
  const id = params?.id;

  const project = assignedProjects.find(
    (p) => String(p.id) === String(id)
  );

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

  return <DigitalDashboardPage clientProject={project} />;
}
