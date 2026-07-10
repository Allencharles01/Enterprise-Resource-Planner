"use client";

import {
  ArrowLeft,
  Building2,
  UserRound,
  CalendarDays,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  Download,
} from "lucide-react";

const statusStyle = (status = "") => {
  const value = String(status).toLowerCase();

  if (value.includes("approved") || value.includes("on track") || value.includes("ongoing")) {
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  }

  if (value.includes("pending")) {
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }

  if (value.includes("needs update")) {
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }

  if (value.includes("rejected")) {
    return "bg-rose-500/10 text-rose-500 border-rose-500/20";
  }

  return "bg-muted text-muted-foreground border-border";
};

export default function SalesEmployeeProjectView({
  project,
  onBack,
  onDownloadInvoice,
}) {
  const projectName = project.project || project.projectName || "Project";
  const clientName = project.client || project.clientName || "Client";
  const budget = project.agreed || project.budget || "₹0";
  const received = project.received || "₹0";
  const remaining = project.remaining || "₹0";
  const progress = project.progress ?? 0;
  const status = project.status || project.leadStatus || "Pending";
  const approval = project.approvalStatus || project.approval || "Pending";
  const deadline = project.deadline || "N/A";
  const submittedDate = project.submitted || project.submittedDate || "N/A";
  const agreementDate = project.agreementDate || submittedDate || "N/A";
  const services = project.services || ["Service details pending"];
  const payments = project.payments || [];
  const salesAgent =
    project.salesAgent ||
    project.manager ||
    (typeof window !== "undefined" ? localStorage.getItem("userName") : null) ||
    "Sales Agent";

  const paymentStatus =
    remaining === "₹0" || remaining === "0" ? "Fully Paid" : "Partially Paid";

  const timeline = [
    {
      title: "Lead Submitted",
      date: submittedDate,
      status: "Completed",
      description: "Project lead was submitted by the sales employee.",
    },
    {
      title: "Admin Approval",
      date: agreementDate,
      status: approval === "Approved" ? "Completed" : "Pending",
      description:
        approval === "Approved"
          ? "Project has been approved for execution."
          : "Project is waiting for approval or needs updates.",
    },
    {
      title: "Project Execution",
      date: "In Progress",
      status: progress > 0 ? "In Progress" : "Upcoming",
      description: "Internal execution is being handled by the operations team.",
    },
    {
      title: "Expected Delivery",
      date: deadline,
      status: progress >= 100 ? "Completed" : "Upcoming",
      description: "Final delivery timeline shared with the client.",
    },
  ];

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
      <div
        className="
          group relative overflow-hidden rounded-2xl border border-border p-7
          bg-background transition-all duration-300
          hover:-translate-y-1
          hover:border-primary/40
          hover:shadow-2xl hover:shadow-primary/20
        "
      >
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.20),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.12),transparent_35%)]" />

        <div className="relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition"
          >
            <ArrowLeft size={18} />
            Back to Client Projects
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {projectName}
              </h1>

              <div className="flex flex-wrap items-center gap-6 mt-5 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  <strong className="text-foreground">Client:</strong>
                  {clientName}
                </span>

                <span className="flex items-center gap-2">
                  <UserRound size={16} className="text-pink-500" />
                  <strong className="text-foreground">Sales Agent:</strong>
                  {salesAgent}
                </span>

                <span className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-amber-500" />
                  <strong className="text-foreground">Deadline:</strong>
                  {deadline}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span
                className={`px-5 py-3 rounded-xl border text-sm font-semibold ${statusStyle(
                  status
                )}`}
              >
                Status: {status === "On Track" ? "Ongoing" : status}
              </span>

              <span
                className={`px-5 py-3 rounded-xl border text-sm font-semibold ${statusStyle(
                  approval
                )}`}
              >
                Approval: {approval}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Access Notice */}
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck size={22} className="text-indigo-400 mt-0.5" />

          <div>
            <h3 className="font-bold text-foreground">
              Employee Project Overview
            </h3>

            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              This view is limited to sales-related project details. Internal
              team assignments, department managers, employee task ownership,
              and admin-level execution details are hidden for this role.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="group relative overflow-hidden rounded-2xl border border-border p-6 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/20">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_38%)]" />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <p className="text-muted-foreground font-medium">
                Project Value
              </p>
              <IndianRupee size={22} className="text-orange-500" />
            </div>

            <h2 className="text-3xl font-bold text-foreground mt-10">
              {budget}
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              Total agreed project amount
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-border p-6 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/20">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_38%)]" />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <p className="text-muted-foreground font-medium">
                Amount Received
              </p>
              <CheckCircle2 size={22} className="text-emerald-500" />
            </div>

            <h2 className="text-3xl font-bold text-foreground mt-10">
              {received}
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              Payment received from client
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-border p-6 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/20">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.18),transparent_38%)]" />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <p className="text-muted-foreground font-medium">
                Balance Due
              </p>
              <Clock size={22} className="text-rose-500" />
            </div>

            <h2 className="text-3xl font-bold text-foreground mt-10">
              {remaining}
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              Pending payment from client
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-border p-6 bg-background transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/20">
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_38%)]" />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <p className="text-muted-foreground font-medium">
                Project Progress
              </p>
              <TrendingUp size={22} className="text-cyan-500" />
            </div>

            <h2 className="text-3xl font-bold text-foreground mt-10">
              {progress}%
            </h2>

            <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
              <div
                className="h-full rounded-full bg-foreground dark:bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project + Payment Details */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <FileText size={20} className="text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Client Project Summary
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sales-accessible project information
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoRow label="Project Name" value={projectName} />
            <InfoRow label="Client Name" value={clientName} />
            <InfoRow label="Submitted Date" value={submittedDate} />
            <InfoRow label="Agreement Date" value={agreementDate} />
            <InfoRow label="Expected Deadline" value={deadline} />
            <InfoRow label="Payment Status" value={paymentStatus} />
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-5">
            <IndianRupee size={20} className="text-emerald-500" />
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Commercial Overview
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Basic financial details visible to sales employee
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoRow label="Total Agreed Amount" value={budget} />
            <InfoRow label="Amount Received" value={received} />
            <InfoRow label="Remaining Balance" value={remaining} />
            <InfoRow label="Approval Status" value={approval} />
          </div>

          <button
            onClick={() => onDownloadInvoice?.(project)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border/80 px-4 py-2 text-sm font-bold text-foreground hover:bg-muted transition shadow-sm"
          >
            <Download size={16} />
            Download Invoice
          </button>
        </div>
      </div>

      {/* Services Scope */}
      <div className="glass-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold text-foreground">
          Project Scope Shared With Client
        </h2>

        <p className="text-sm text-muted-foreground mt-1 mb-5">
          Services included in the project agreement
        </p>

        <div className="flex flex-wrap gap-3">
          {services.map((service) => (
            <span
              key={service}
              className="px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="glass-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold text-foreground">
          Client-Facing Timeline
        </h2>

        <p className="text-sm text-muted-foreground mt-1 mb-6">
          High-level progress timeline without internal team details
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-4 text-foreground">
                  Stage
                </th>
                <th className="text-left px-4 py-4 text-foreground">
                  Date / Status
                </th>
                <th className="text-left px-4 py-4 text-foreground">
                  Progress Status
                </th>
                <th className="text-left px-4 py-4 text-foreground">
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              {timeline.map((item) => (
                <tr
                  key={item.title}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="px-4 py-4 font-semibold text-foreground">
                    {item.title}
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {item.date}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="glass-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-bold text-foreground">
          Payment History
        </h2>

        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Payments recorded for this client project
        </p>

        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Payment Title
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.length > 0 ? (
                payments.map((payment, index) => (
                  <tr
                    key={`${payment.title}-${index}`}
                    className="border-b border-border/60 last:border-b-0 hover:bg-muted/20 transition"
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {payment.title}
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {payment.date}
                    </td>

                    <td className="px-4 py-3 font-bold text-emerald-500">
                      {payment.amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-6 text-center text-sm text-muted-foreground"
                  >
                    No payment history available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground text-right">
        {value || "N/A"}
      </span>
    </div>
  );
}