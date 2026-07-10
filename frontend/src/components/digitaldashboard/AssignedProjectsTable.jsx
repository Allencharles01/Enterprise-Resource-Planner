import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, CalendarDays } from "lucide-react";
import { assignedProjects, statusColors, formatINR } from "./data/mockData";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 5;

export default function AssignedProjectsTable({ onViewDetails }) {
  const [page, setPage] = useState(1);
  const totalPages = 3;
  const start = (page - 1) * PAGE_SIZE;
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#0B1224]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-500 dark:text-indigo-400">
            <CalendarDays size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Assigned Projects</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">View and access your assigned projects</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400 dark:border-white/5 dark:text-gray-500">
              <th className="py-2.5 pr-4 font-medium">Client Name</th>
              <th className="py-2.5 pr-4 font-medium">Project Type</th>
              <th className="py-2.5 pr-4 font-medium">Assigned By</th>
              <th className="py-2.5 pr-4 font-medium">Status</th>
              <th className="py-2.5 pr-4 font-medium">Budget</th>
              <th className="py-2.5 pr-4 font-medium">Deadline</th>
              <th className="py-2.5 pr-0 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignedProjects.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 last:border-0 dark:border-white/5">
                <td className="py-3.5 pr-4">
                  <button
                    onClick={() => router.push(`/employee/digitaldashboard/client/${p.id}`)}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                  >
                    {p.client}
                  </button>
                </td>
                <td className="py-3.5 pr-4 text-gray-600 dark:text-gray-300">{p.projectType}</td>
                <td className="py-3.5 pr-4 text-gray-600 dark:text-gray-300">{p.assignedBy}</td>
                <td className="py-3.5 pr-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 pr-4 text-gray-600 dark:text-gray-300">{formatINR(p.budget)}</td>
                <td className="py-3.5 pr-4 text-gray-600 dark:text-gray-300">{p.deadline}</td>
                <td className="py-3.5 pr-0 text-right">
                  <button
                    onClick={() => router.push(`/employee/digitaldashboard/client/${p.id}`)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View Details <ArrowRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-gray-400 dark:text-gray-500">
        <span>Showing {start + 1} to {start + assignedProjects.length} of 15 projects</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/10"
          >
            <ChevronLeft size={16} />
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${page === n
                ? "bg-indigo-600 text-white"
                : "border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/10"
                }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/10"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
