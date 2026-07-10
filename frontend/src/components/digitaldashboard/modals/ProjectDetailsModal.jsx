import { CalendarCheck } from "lucide-react";
import Modal from "../ui/Modal";
import { statusColors, formatINR } from "../data/mockData";

export default function ProjectDetailsModal({ open, onClose, project, onOpenAdvertising,
  onOpenCreators,
  onOpenHeavyAds,
  onOpenInvoices, }) {
  if (!project) return null;

  const rows = [
    ["Client Name", project.client],
    ["Project Type", project.projectType],
    ["Assigned By", project.assignedBy],
    ["Status", project.status, true],
    ["Start Date", project.startDate],
    ["Deadline", project.deadline],
    ["Budget", formatINR(project.budget)],
    ["Expected Revenue", formatINR(project.expectedRevenue)],
    ["Priority", project.priority],
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<CalendarCheck size={22} />}
      iconBg="bg-indigo-500"
      title="Project Details"
      subtitle={project.client}
      maxWidth="max-w-3xl"
      footer={
        <button
          onClick={onClose}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Close
        </button>
      }
    >
      <div className="space-y-0.5">
        {rows.map(([label, value, isStatus]) => (
          <div key={label} className="flex items-center justify-between border-b border-gray-100 py-2.5 text-sm last:border-0 dark:border-white/5">
            <span className="text-gray-500 dark:text-gray-400">{label}</span>
            {isStatus ? (
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[value]}`}>{value}</span>
            ) : (
              <span className="font-medium text-gray-900 dark:text-white">{value}</span>
            )}
          </div>
        ))}
        <div className="pt-3">
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">Description</p>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{project.description}</p>
        </div>
        {/* Assigned Access */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Assigned Access
          </h3>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Assigned Module
              </p>

              <p className="mt-1 font-medium text-gray-900 dark:text-white">
                {project.module}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Assigned Permission
              </p>

              <p className="mt-1 font-medium text-indigo-600 dark:text-indigo-400">
                {project.permission}
              </p>
            </div>

          </div>
        </div>
        {/* Quick Actions */}
        <div className="mt-6">

          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={() => {
                if (project.module === "Advertising") {
                  onClose();
                  onOpenAdvertising();
                }
              }}
              className={`rounded-xl border p-4 text-left transition ${project.module === "Advertising"
                  ? "border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10"
                  : "cursor-not-allowed opacity-50"
                }`}
            >
              <p className="font-semibold">Advertising</p>

              <p className="mt-1 text-xs text-gray-500">
                {project.module === "Advertising"
                  ? "Access Granted"
                  : "Read Only"}
              </p>
            </button>

            <button
              onClick={() => {
                if (project.module === "Creators") {
                  onClose();
                  onOpenCreators();
                }
              }}
              className={`rounded-xl border p-4 text-left transition ${project.module === "Creators"
                  ? "border-purple-300 bg-purple-50 hover:bg-purple-100 dark:border-purple-500/30 dark:bg-purple-500/10"
                  : "cursor-not-allowed opacity-50"
                }`}
            >
              <p className="font-semibold">Creators</p>

              <p className="mt-1 text-xs text-gray-500">
                {project.module === "Creators"
                  ? "Access Granted"
                  : "Read Only"}
              </p>
            </button>

            <button
              onClick={() => {
                if (project.module === "Heavy Ads") {
                  onClose();
                  onOpenHeavyAds();
                }
              }}
              className={`rounded-xl border p-4 text-left transition ${project.module === "Heavy Ads"
                  ? "border-orange-300 bg-orange-50 hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-500/10"
                  : "cursor-not-allowed opacity-50"
                }`}
            >
              <p className="font-semibold">Heavy Ads</p>

              <p className="mt-1 text-xs text-gray-500">
                {project.module === "Heavy Ads"
                  ? "Access Granted"
                  : "Read Only"}
              </p>
            </button>

            <button
              onClick={() => {
                if (project.module === "Invoices") {
                  onClose();
                  onOpenInvoices();
                }
              }}
              className={`rounded-xl border p-4 text-left transition ${project.module === "Invoices"
                  ? "border-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                  : "cursor-not-allowed opacity-50"
                }`}
            >
              <p className="font-semibold">Invoices</p>

              <p className="mt-1 text-xs text-gray-500">
                {project.module === "Invoices"
                  ? "Access Granted"
                  : "Read Only"}
              </p>
            </button>

          </div>

        </div>
      </div>
    </Modal>
  );
}
