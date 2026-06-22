// src/components/sales/ProjectsTable.jsx

"use client";

import { projectsData } from "./salesData";
import StatusBadge from "./StatusBadge";

export default function ProjectsTable() {
  return (
    <div className="glass-card rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Detailed View
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track all client projects and revenue.
          </p>
        </div>

        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          View Reports
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 text-sm font-semibold text-muted-foreground">
                Project
              </th>
              <th className="text-left py-3 text-sm font-semibold text-muted-foreground">
                Client
              </th>
              <th className="text-left py-3 text-sm font-semibold text-muted-foreground">
                Revenue
              </th>
              <th className="text-left py-3 text-sm font-semibold text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {projectsData.map((project) => (
              <tr
                key={project.id}
                className="border-b border-border/50 hover:bg-muted/30 transition"
              >
                <td className="py-4 font-medium text-foreground">
                  {project.project}
                </td>

                <td className="py-4 text-muted-foreground">
                  {project.client}
                </td>

                <td className="py-4 text-foreground">
                  {project.revenue}
                </td>

                <td className="py-4">
                  <StatusBadge status={project.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}