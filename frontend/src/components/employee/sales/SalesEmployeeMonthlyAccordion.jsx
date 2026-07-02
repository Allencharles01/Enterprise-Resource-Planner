"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
} from "lucide-react";

const badgeStyle = (status = "") => {
  const value = String(status).toLowerCase();

  if (value.includes("on track")) {
    return "bg-teal-100 text-teal-700 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20";
  }

  if (value.includes("approved")) {
    return "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
  }

  if (value.includes("pending")) {
    return "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
  }

  if (value.includes("needs update")) {
    return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
  }

  if (value.includes("rejected")) {
    return "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
  }

  return "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
};

const placementBadgeStyle = (placement = "") => {
  const value = String(placement).toLowerCase();

  if (value.includes("not placed")) {
    return "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
  }

  if (value.includes("placed")) {
    return "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
  }

  if (value.includes("interview")) {
    return "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20";
  }

  if (value.includes("process")) {
    return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
  }

  return "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
};



export default function SalesEmployeeMonthlyAccordion({ activeTab, data }) {
  const [openMonth, setOpenMonth] = useState(data?.[0]?.month || "");

  const getTitle = () => {
    if (activeTab === "Client Projects") return "Client Projects Detailed View";
    if (activeTab === "Internships") return "Internships Detailed View";
    return "Training Detailed View";
  };

  const renderClientProjectsTable = (records) => (
    <table className="w-full min-w-[1200px] text-left border-collapse">
      <thead>
        <tr className="border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
          <th className="py-4 px-4 whitespace-nowrap font-bold">Project Name</th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Client Name</th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Budget</th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Lead Status</th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Approval Status</th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Deadline</th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Submitted</th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Report</th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-border/40 text-sm">
        {records.map((item, index) => (
          <tr key={index} className="hover:bg-muted/30 transition-colors">
            <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
              {item.projectName || item.project}
            </td>

            <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
              {item.clientName || item.client}
            </td>

            <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
              {item.budget}
            </td>

           <td className="py-4 px-4 whitespace-nowrap">
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold ${badgeStyle(
      item.leadStatus || item.status
    )}`}
  >
    {item.leadStatus || item.status}
  </span>
</td>

            <td className="py-4 px-4 whitespace-nowrap">
  <span
    className={`px-3 py-1 rounded-full text-xs font-bold ${badgeStyle(
      item.approvalStatus || item.approval
    )}`}
  >
    {item.approvalStatus || item.approval}
  </span>
</td>

            <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
              {item.deadline}
            </td>

            <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
              {item.submitted || item.submittedDate}
            </td>

            <td className="py-4 px-4 whitespace-nowrap">
              <button className="flex items-center gap-2 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold transition">
                <FileText size={16} />
                View
              </button>
            </td>

            <td className="py-4 px-4 whitespace-nowrap">
              <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 hover:bg-indigo-500/10 hover:border-indigo-500/40 text-xs font-bold transition shadow-sm">
                <Eye size={15} className="text-indigo-400" />
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderInternshipsTable = (records) => (
  <table className="w-full min-w-[1200px] text-left border-collapse">
    <thead>
      <tr className="border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Candidate Name
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Program
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Email
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Phone
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Course Fee
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Internship Duration
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Approval Status
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Submitted
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Placement
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          View Profile
        </th>
      </tr>
    </thead>

    <tbody className="divide-y divide-border/40 text-sm">
      {records.map((item, index) => (
        <tr key={index} className="hover:bg-muted/30 transition-colors">
          <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
            {item.candidateName}
          </td>

          <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
            {item.program}
          </td>

          <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
            {item.email}
          </td>

          <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
            {item.phone}
          </td>

          <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
            {item.courseFee || item.fee}
          </td>

          <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
            {item.duration}
          </td>

          <td className="py-4 px-4 whitespace-nowrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${badgeStyle(
                item.approvalStatus || item.approval
              )}`}
            >
              {item.approvalStatus || item.approval}
            </span>
          </td>

          <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
            {item.submittedDate || item.submitted}
          </td>

          <td className="py-4 px-4 whitespace-nowrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${placementBadgeStyle(
                item.placement
              )}`}
            >
              {item.placement}
            </span>
          </td>

          <td className="py-4 px-4 whitespace-nowrap">
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 hover:bg-indigo-500/10 hover:border-indigo-500/40 text-xs font-bold transition shadow-sm">
              <Eye size={15} className="text-indigo-400" />
              View Profile
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

  const renderTrainingTable = (records) => (
  <table className="w-full min-w-[1200px] text-left border-collapse">
    <thead>
      <tr className="border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Training Program
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Client/Candidate Name
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Training Fee
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Start Date
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Status
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Approval Status
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          Submitted Date
        </th>

        <th className="py-4 px-4 whitespace-nowrap font-bold">
          View Profile
        </th>
      </tr>
    </thead>

    <tbody className="divide-y divide-border/40 text-sm">
      {records.map((item, index) => (
        <tr key={index} className="hover:bg-muted/30 transition-colors">
          <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
            {item.trainingProgram || item.trainingName}
          </td>

          <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
            {item.clientName || item.candidateName}
          </td>

          <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
            {item.trainingFee || item.fee}
          </td>

          <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
            {item.startDate}
          </td>

          <td className="py-4 px-4 whitespace-nowrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${badgeStyle(
                item.status
              )}`}
            >
              {item.status}
            </span>
          </td>

          <td className="py-4 px-4 whitespace-nowrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${badgeStyle(
                item.approvalStatus || item.approval
              )}`}
            >
              {item.approvalStatus || item.approval}
            </span>
          </td>

          <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
            {item.submittedDate || item.submitted}
          </td>

          <td className="py-4 px-4 whitespace-nowrap">
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 hover:bg-indigo-500/10 hover:border-indigo-500/40 text-xs font-bold transition shadow-sm">
              <Eye size={15} className="text-indigo-400" />
              View Profile
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

  const renderTable = (records) => {
    if (activeTab === "Client Projects") {
      return renderClientProjectsTable(records);
    }

    if (activeTab === "Internships") {
      return renderInternshipsTable(records);
    }

    return renderTrainingTable(records);
  };

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold text-foreground">
          {getTitle()} - {openMonth}
        </h2>

        <p className="text-sm text-muted-foreground mt-1">
          Month-wise records — click a section to expand
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {data.map((monthBlock, index) => {
          const isOpen = openMonth === monthBlock.month;

          return (
            <div
              key={monthBlock.month}
              className="glass-card rounded-2xl border border-border overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenMonth(isOpen ? "" : monthBlock.month)
                }
                className="w-full flex items-center justify-between px-6 py-5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground">
                    {monthBlock.month}
                  </h3>

                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold">
                    {monthBlock.records.length} records
                  </span>

                  {index === 0 && (
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                      Current
                    </span>
                  )}
                </div>

                {isOpen ? (
                  <ChevronDown size={20} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={20} className="text-muted-foreground" />
                )}
              </button>

              {isOpen && (
                <div className="overflow-x-auto border-t border-border">
                  {renderTable(monthBlock.records)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}