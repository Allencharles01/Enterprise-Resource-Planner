// src/components/sales/ProjectsTable.jsx

"use client";

import { projectsData } from "./salesData";
import StatusBadge from "./StatusBadge";

import {
  Eye,
  Download,
  MoreVertical,
} from "lucide-react";

export default function ProjectsTable() {
  return (
    <div className="glass-card rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Client Projects Detailed View
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all client projects. Click Budget for Financial Overview
          </p>
        </div>

        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          View Reports
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
  <thead>
    <tr className="border-b border-border">
      <th className="text-left py-4">Project Name</th>
      <th className="text-left py-4">Client Name</th>
      <th className="text-left py-4">Budget</th>
      <th className="text-left py-4">Lead Manager</th>
      <th className="text-left py-4">Deadline</th>
      <th className="text-left py-4">Progress</th>
      <th className="text-left py-4">Status</th>
      <th className="text-left py-4">Report</th>
      <th className="text-left py-4">Actions</th>
    </tr>
  </thead>

  <tbody>
    {projectsData.map((project) => (
      <tr
        key={project.id}
        className="border-b border-border/50 hover:bg-muted/20 transition"
      >
        <td className="py-5 font-medium">
          {project.project}
        </td>

        <td className="py-5 text-muted-foreground">
          {project.client}
        </td>

        <td className="py-5">
          <button className="font-semibold underline">
            {project.budget}
          </button>
        </td>

        <td className="py-5">
          {project.manager}
        </td>

        <td className="py-5">
          {project.deadline}
        </td>

        <td className="py-5 w-52">
          <div className="flex items-center gap-3">
            <div className="w-32 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${project.progress}%`,
                }}
              />
            </div>

            <span className="text-sm">
              {project.progress}%
            </span>
          </div>
        </td>

        <td className="py-5">
          <StatusBadge status={project.status} />
        </td>

        <td className="py-5">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-muted/30">
            <Eye size={16} />
            View Project
          </button>
        </td>

        <td className="py-5">
          <div className="flex items-center gap-3">
            <button>
              <Download size={18} />
            </button>

            <button>
              <MoreVertical size={18} />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
    </div>
  );
}