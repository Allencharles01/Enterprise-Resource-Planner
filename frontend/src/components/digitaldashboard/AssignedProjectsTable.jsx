import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, CalendarDays } from "lucide-react";
import { statusColors } from "./data/mockData";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 5;

export default function AssignedProjectsTable({ projects = [], onViewDetails }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedProjects = projects.slice(start, start + PAGE_SIZE);
  const router = useRouter();

  const displayBudget = (budget) => {
    if (typeof budget === "number") {
      return "₹" + budget.toLocaleString("en-IN");
    }
    return budget || "₹0";
  };

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

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
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
            {paginatedProjects.map((p) => (
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
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusColors[p.status] || 
                    (p.status === "In Progress" || p.status === "Ongoing" ? "bg-blue-500/15 text-blue-600 dark:text-blue-400" :
                     p.status === "On Track" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                     p.status === "Completed" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                     "bg-gray-500/15 text-gray-600 dark:text-gray-400")
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 pr-4 text-gray-600 dark:text-gray-300">{displayBudget(p.budget)}</td>
                <td className="py-3.5 pr-4 text-gray-600 dark:text-gray-300">{p.deadline}</td>
                <td className="py-3.5 pr-0 text-right">
                  <button
                    onClick={() => router.push(`/employee/digitaldashboard/client/${p.id}`)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
                  >
                    View Details <ArrowRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                  No projects assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card/Tile Layout */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {paginatedProjects.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-gray-150 bg-[#FAF7FF]/40 p-4 shadow-sm dark:border-white/5 dark:bg-[#0E172A]/40 backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 dark:border-white/5">
              <button
                onClick={() => router.push(`/employee/digitaldashboard/client/${p.id}`)}
                className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400 text-left cursor-pointer"
              >
                {p.client}
              </button>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                statusColors[p.status] || 
                (p.status === "In Progress" || p.status === "Ongoing" ? "bg-blue-500/15 text-blue-600 dark:text-blue-400" :
                 p.status === "On Track" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                 p.status === "Completed" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" :
                 "bg-gray-500/15 text-gray-600 dark:text-gray-400")
              }`}>
                {p.status}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <p className="text-gray-400 dark:text-gray-500">Project Type</p>
                <p className="font-semibold text-gray-750 dark:text-gray-200 mt-0.5">{p.projectType}</p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Assigned By</p>
                <p className="font-semibold text-gray-750 dark:text-gray-200 mt-0.5">{p.assignedBy}</p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Budget</p>
                <p className="font-semibold text-gray-750 dark:text-gray-200 mt-0.5">{displayBudget(p.budget)}</p>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500">Deadline</p>
                <p className="font-semibold text-gray-750 dark:text-gray-200 mt-0.5">{p.deadline}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex justify-end">
              <button
                onClick={() => router.push(`/employee/digitaldashboard/client/${p.id}`)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                View Details <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
            No projects assigned.
          </p>
        )}
      </div>

      {projects.length > 0 && (
        <div className="mt-5 flex items-center justify-between text-sm text-gray-400 dark:text-gray-500">
          <span>Showing {start + 1} to {start + paginatedProjects.length} of {projects.length} projects</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/10"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
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
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/10"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
