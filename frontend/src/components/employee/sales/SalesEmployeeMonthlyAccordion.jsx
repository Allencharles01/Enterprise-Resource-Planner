"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  Download,
  MoreVertical,
  UserRound,
} from "lucide-react";
import BudgetModal from "@/components/sales/BudgetModal";
import TrainingParticipantsModal from "./TrainingParticipantsModal";
import InternProfileModal from "./InternProfileModal";
import SalesEmployeeProjectView from "./SalesEmployeeProjectView";
import { formatAmount } from "@/lib/formatAmount";

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
    return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
  }

  if (value.includes("placed")) {
    return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  }

  if (value.includes("interview")) {
    return "bg-purple-500/10 text-purple-500 border border-purple-500/20";
  }

  if (value.includes("process")) {
    return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  }

  if (value.includes("under review")) {
    return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
  }

  return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
};

const internStatusStyle = (status = "") => {
  const value = String(status).toLowerCase();

  if (value.includes("active")) {
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  }

  if (value.includes("dropped")) {
    return "bg-red-500/10 text-red-500 border-red-500/20";
  }

  if (value.includes("completed")) {
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }

  if (value.includes("not approved")) {
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }

  return "bg-muted text-foreground border-border";
};

export default function SalesEmployeeMonthlyAccordion({ activeTab, data }) {
  const [openMonth, setOpenMonth] = useState(data?.[0]?.month || "");
  const [selectedBudgetProject, setSelectedBudgetProject] = useState(null);
  const [selectedTrainingProgram, setSelectedTrainingProgram] = useState(null);
  const [activeInternFilter, setActiveInternFilter] = useState("All");
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [selectedClientProject, setSelectedClientProject] = useState(null);

  const getTitle = () => {
    if (activeTab === "Client Projects") return "Client Projects Detailed View";
    if (activeTab === "Internships") return "Internships Detailed View";
    return "Training Detailed View";
  };

  const formatCurrencyValue = (value) => {
    return formatAmount(value || 0);
  };

  const formatPayments = (payments = []) => {
    return payments.map((payment) => ({
      ...payment,
      amount: formatCurrencyValue(payment.amount || 0),
    }));
  };

  const isBudgetModalAllowed = (project) => {
    const approval = String(project.approvalStatus || project.approval || "")
      .trim()
      .toLowerCase();

    return approval === "approved";
  };

  const formatProjectForModal = (project) => ({
    ...project,
    project: project.project || project.projectName || "Project",
    client: project.client || project.clientName || "Client",
    manager: project.manager || "Rahul Sharma",

    agreed: formatCurrencyValue(project.agreed || project.budget || 0),
    received: formatCurrencyValue(project.received || 0),
    remaining: formatCurrencyValue(project.remaining || 0),

    progress: project.progress ?? 0,
    status: project.status || project.leadStatus || "Pending",
    deadline: project.deadline || "N/A",

    services: project.services || ["Service details pending"],
    payments: formatPayments(project.payments || []),

    agreementDate:
      project.agreementDate ||
      project.submitted ||
      project.submittedDate ||
      "N/A",
  });

  const handleBudgetClick = (project) => {
    if (!isBudgetModalAllowed(project)) {
      return;
    }

    setSelectedBudgetProject(formatProjectForModal(project));
  };

  const handleViewProject = (project) => {
    setSelectedClientProject(formatProjectForModal(project));
  };

  const handleDownloadInvoice = (project) => {
    const invoiceProject = formatProjectForModal(project);

    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const fileName = `Invoice_${invoiceProject.project.replace(
      /[^a-z0-9]/gi,
      "_"
    )}.html`;

    const paymentRows =
      invoiceProject.payments.length > 0
        ? invoiceProject.payments
            .map(
              (payment) => `
                <tr>
                  <td>${payment.date}</td>
                  <td>${payment.amount}</td>
                  <td>${payment.title}</td>
                </tr>
              `
            )
            .join("")
        : `
          <tr>
            <td>N/A</td>
            <td>N/A</td>
            <td>No payment history available</td>
          </tr>
        `;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoiceProject.project}</title>

          <style>
            body {
              margin: 0;
              background: #ffffff;
              color: #0f172a;
              font-family: Arial, Helvetica, sans-serif;
            }

            .invoice {
              width: 760px;
              margin: 70px auto;
            }

            h1 {
              margin: 0 0 22px;
              font-size: 30px;
              letter-spacing: 1px;
              color: #17375e;
            }

            .meta {
              font-size: 14px;
              color: #475569;
              margin-bottom: 36px;
            }

            .meta strong {
              color: #334155;
            }

            .details {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
              font-size: 16px;
            }

            .details td {
              padding: 10px 0;
              border-bottom: 1px solid #e2e8f0;
            }

            .details td:first-child {
              font-weight: 500;
              width: 36%;
            }

            .details td:last-child {
              text-align: right;
            }

            .bold {
              font-weight: 700;
            }

            .green {
              color: #059669;
              font-weight: 700;
            }

            .red {
              color: #991b1b;
              font-weight: 700;
            }

            .payments {
              width: 100%;
              border-collapse: collapse;
              margin-top: 22px;
              font-size: 16px;
            }

            .payments th {
              background: #1f426e;
              color: #ffffff;
              text-align: left;
              padding: 12px 14px;
            }

            .payments td {
              padding: 11px 14px;
              border-bottom: 1px solid #e2e8f0;
            }

            .footer {
              margin-top: 34px;
              font-size: 12px;
              color: #64748b;
            }
          </style>
        </head>

        <body>
          <div class="invoice">
            <h1>INVOICE</h1>

            <div class="meta">
              Project: <strong>${invoiceProject.project}</strong>
              &nbsp;|&nbsp;
              Client: <strong>${invoiceProject.client}</strong>
            </div>

            <table class="details">
              <tr>
                <td>Lead Manager</td>
                <td>${invoiceProject.manager}</td>
              </tr>

              <tr>
                <td>Deadline</td>
                <td>${invoiceProject.deadline}</td>
              </tr>

              <tr>
                <td>Payment Due Date</td>
                <td>${invoiceProject.deadline}</td>
              </tr>

              <tr>
                <td>Services</td>
                <td>${invoiceProject.services.join(", ")}</td>
              </tr>

              <tr>
                <td class="bold">Total Agreed Amount</td>
                <td class="bold">${invoiceProject.agreed}</td>
              </tr>

              <tr>
                <td class="bold">Total Received</td>
                <td class="green">${invoiceProject.received}</td>
              </tr>

              <tr>
                <td class="bold">Remaining Balance</td>
                <td class="red">${invoiceProject.remaining}</td>
              </tr>
            </table>

            <table class="payments">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>

              <tbody>
                ${paymentRows}
              </tbody>
            </table>

            <div class="footer">
              Generated ${today} — Confidential
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], {
      type: "text/html",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  };

  const openTrainingParticipants = (training) => {
    const formattedTrainingFee = formatCurrencyValue(
      training.trainingFee || training.fee || training.cost || 0
    );

    setSelectedTrainingProgram({
      ...training,
      name: training.name || training.trainingProgram || training.trainingName,
      category: training.category || "Paid Training Course",
      duration: training.duration || training.trainingDuration || "N/A",
      instructor: training.instructor || "Enterprise Mentor",
      trainingFee: formattedTrainingFee,
      fee: formattedTrainingFee,
      cost: formattedTrainingFee,
    });
  };

  const getInternApproval = (intern) =>
    intern.approvalStatus || intern.approval || "";

  const isInternApproved = (intern) =>
    String(getInternApproval(intern)).trim().toLowerCase() === "approved";

  const getInternStatus = (intern) => {
    if (!isInternApproved(intern)) return "Not Approved";

    return intern.internStatus || intern.status || "Active";
  };

  const getInternMentor = (intern) => {
    if (!isInternApproved(intern)) return "Not yet assigned";

    return intern.mentor || "Enterprise Mentor";
  };

  const openInternProfile = (intern) => {
    const finalStatus = getInternStatus(intern);
    const finalMentor = getInternMentor(intern);

    setSelectedIntern({
      ...intern,
      name: intern.name || intern.candidateName,
      phone: intern.phone || "N/A",
      department: intern.department || "BTech Computer Science",
      education: intern.education || "Undergraduate",
      university: intern.university || "UPES",
      program: intern.program,
      duration: intern.duration,
      mentor: finalMentor,
      status: finalStatus,
      placement: intern.placement || "Under Review",
      courseCost: formatCurrencyValue(
        intern.courseCost || intern.courseFee || intern.fee || intern.cost || 0
      ),
      progress: intern.progress || 0,
      projectsCompleted: intern.projectsCompleted || "0/3",
      salesAgent: intern.salesAgent || "Rahul Sharma",
      startDate:
        intern.startDate || intern.submittedDate || intern.submitted || "N/A",
      endDate: intern.endDate || "N/A",
      skills: intern.skills || ["Communication", "Learning", "Teamwork"],
    });
  };

  const renderClientProjectsTable = (records) => (
    <table className="w-full min-w-[1200px] text-left border-collapse">
      <thead>
        <tr className="border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
          <th className="py-4 px-4 whitespace-nowrap font-bold">
            Project Name
          </th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">
            Client Name
          </th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Budget</th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">
            Lead Status
          </th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">
            Approval Status
          </th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Deadline</th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Submitted</th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">
            View Project
          </th>
          <th className="py-4 px-4 whitespace-nowrap font-bold">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-border/40 text-sm">
        {records.map((item, index) => {
          const budgetDisplay = formatCurrencyValue(item.budget || item.agreed);

          return (
            <tr key={index} className="hover:bg-muted/30 transition-colors">
              <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
                {item.projectName || item.project}
              </td>

              <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                {item.clientName || item.client}
              </td>

              <td className="py-4 px-4 whitespace-nowrap">
                {isBudgetModalAllowed(item) ? (
                  <button
                    onClick={() => handleBudgetClick(item)}
                    className="font-bold underline text-emerald-400 hover:text-emerald-300 transition"
                  >
                    {budgetDisplay}
                  </button>
                ) : (
                  <span
                    title="Financial overview will be available after admin approval"
                    className="font-bold text-foreground cursor-not-allowed opacity-80"
                  >
                    {budgetDisplay}
                  </span>
                )}
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
                <button
                  onClick={() => handleViewProject(item)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 hover:bg-indigo-500/10 hover:border-indigo-500/40 text-xs font-bold transition shadow-sm"
                >
                  <Eye size={15} className="text-indigo-400" />
                  View Project
                </button>
              </td>

              <td className="py-4 px-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadInvoice(item)}
                    className="p-2 rounded-xl border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition shadow-sm"
                    title="Download Invoice"
                  >
                    <Download size={16} />
                  </button>

                  <button
                    className="p-2 rounded-xl border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition shadow-sm"
                    title="More Actions"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderInternshipsTable = (records) => {
    const filterOptions = [
      {
        label: "All Interns",
        value: "All",
        count: records.length,
      },
      {
        label: "Active Interns",
        value: "Active",
        count: records.filter((item) => getInternStatus(item) === "Active")
          .length,
      },
      {
        label: "Dropped Out",
        value: "Dropped Out",
        count: records.filter(
          (item) => getInternStatus(item) === "Dropped Out"
        ).length,
      },
      {
        label: "Not Approved",
        value: "Not Approved",
        count: records.filter(
          (item) => getInternStatus(item) === "Not Approved"
        ).length,
      },
      {
        label: "Completed",
        value: "Completed",
        count: records.filter((item) => getInternStatus(item) === "Completed")
          .length,
      },
    ];

    const filteredRecords =
      activeInternFilter === "All"
        ? records
        : records.filter((item) => getInternStatus(item) === activeInternFilter);

    return (
      <div className="min-w-[1250px]">
        <div className="flex flex-col gap-5 px-6 py-6 border-b border-border lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              Intern Details
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              View candidate profiles and track progress
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveInternFilter(filter.value)}
                className={`rounded-2xl border px-5 py-3 text-sm font-bold transition ${
                  activeInternFilter === filter.value
                    ? "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-sm text-muted-foreground">
              <th className="py-4 px-4 whitespace-nowrap font-bold">
                Candidate
              </th>

              <th className="py-4 px-4 whitespace-nowrap font-bold">
                Department
              </th>

              <th className="py-4 px-4 whitespace-nowrap font-bold">
                Duration
              </th>

              <th className="py-4 px-4 whitespace-nowrap font-bold">
                Mentor
              </th>

              <th className="py-4 px-4 whitespace-nowrap font-bold">
                Progress
              </th>

              <th className="py-4 px-4 whitespace-nowrap font-bold">
                Placement
              </th>

              <th className="py-4 px-4 whitespace-nowrap font-bold">Status</th>

              <th className="py-4 px-4 whitespace-nowrap font-bold">
                Profile
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/40 text-sm">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((item, index) => {
                const internStatus = getInternStatus(item);
                const mentor = getInternMentor(item);
                const progress = item.progress || 0;

                return (
                  <tr
                    key={index}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-5 px-4 whitespace-nowrap">
                      <p className="font-bold text-foreground">
                        {item.candidateName || item.name}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.email}
                      </p>
                    </td>

                    <td className="py-5 px-4 text-muted-foreground whitespace-nowrap">
                      {item.department || "BTech Computer Science"}
                    </td>

                    <td className="py-5 px-4 font-semibold text-foreground whitespace-nowrap">
                      {item.duration}
                    </td>

                    <td
                      className={`py-5 px-4 font-semibold whitespace-nowrap ${
                        mentor === "Not yet assigned"
                          ? "text-muted-foreground italic"
                          : "text-foreground"
                      }`}
                    >
                      {mentor}
                    </td>

                    <td className="py-5 px-4 min-w-[180px]">
                      <div className="text-sm font-bold text-emerald-400 mb-2">
                        {progress}%
                      </div>

                      <div className="h-2 w-44 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-400"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-5 px-4 whitespace-nowrap">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-bold ${placementBadgeStyle(
                          item.placement || "Under Review"
                        )}`}
                      >
                        {item.placement || "Under Review"}
                      </span>
                    </td>

                    <td className="py-5 px-4 whitespace-nowrap">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-bold border ${internStatusStyle(
                          internStatus
                        )}`}
                      >
                        {internStatus}
                      </span>
                    </td>

                    <td className="py-5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => openInternProfile(item)}
                        className="inline-flex items-center gap-3 rounded-2xl border border-border px-5 py-3 text-sm font-bold text-foreground hover:bg-muted transition"
                      >
                        <UserRound size={18} />
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-5 py-8 text-center text-sm text-muted-foreground"
                >
                  No interns found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTrainingTable = (records) => (
    <table className="w-full min-w-[1300px] text-left border-collapse">
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
            Total Enrolled
          </th>

          <th className="py-4 px-4 whitespace-nowrap font-bold">
            Instructor
          </th>

          <th className="py-4 px-4 whitespace-nowrap font-bold">
            Progress Report
          </th>

          <th className="py-4 px-4 whitespace-nowrap font-bold">
            Approval Status
          </th>

          <th className="py-4 px-4 whitespace-nowrap font-bold">
            Submitted Date
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-border/40 text-sm">
        {records.map((item, index) => {
          const approval = item.approvalStatus || item.approval;
          const isApproved = String(approval).toLowerCase() === "approved";
          const trainingFeeDisplay = formatCurrencyValue(
            item.trainingFee || item.fee || item.cost
          );

          return (
            <tr key={index} className="hover:bg-muted/30 transition-colors">
              <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
                {item.trainingProgram || item.trainingName}
              </td>

              <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                {item.clientName || item.candidateName}
              </td>

              <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
                {trainingFeeDisplay}
              </td>

              <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                {item.startDate}
              </td>

              <td className="py-4 px-4 whitespace-nowrap">
                <button
                  onClick={() => openTrainingParticipants(item)}
                  className="inline-flex min-w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-bold text-indigo-500 hover:bg-indigo-500/20 transition"
                  title="View enrolled participants"
                >
                  {item.participants?.length || 0}
                </button>
              </td>

              <td className="py-4 px-4 whitespace-nowrap">
                <span
                  className={`font-semibold ${
                    isApproved
                      ? "text-foreground"
                      : "text-muted-foreground italic"
                  }`}
                >
                  {isApproved
                    ? item.instructor || "Enterprise Mentor"
                    : "Not yet assigned"}
                </span>
              </td>

              <td className="py-4 px-4 min-w-[180px]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">
                      {item.progress || 0}%
                    </span>
                    <span className="text-muted-foreground">Completed</span>
                  </div>

                  <div className="h-2 w-40 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground dark:bg-primary"
                      style={{
                        width: `${item.progress || 0}%`,
                      }}
                    />
                  </div>
                </div>
              </td>

              <td className="py-4 px-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${badgeStyle(
                    approval
                  )}`}
                >
                  {approval}
                </span>
              </td>

              <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                {item.submittedDate || item.submitted}
              </td>
            </tr>
          );
        })}
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

  if (selectedClientProject) {
    return (
      <SalesEmployeeProjectView
        project={selectedClientProject}
        onBack={() => setSelectedClientProject(null)}
        onDownloadInvoice={handleDownloadInvoice}
      />
    );
  }

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
                onClick={() => setOpenMonth(isOpen ? "" : monthBlock.month)}
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

      {selectedBudgetProject && (
        <BudgetModal
          project={selectedBudgetProject}
          onClose={() => setSelectedBudgetProject(null)}
        />
      )}

      {selectedTrainingProgram && (
        <TrainingParticipantsModal
          program={selectedTrainingProgram}
          onClose={() => setSelectedTrainingProgram(null)}
        />
      )}

      {selectedIntern && (
        <InternProfileModal
          intern={selectedIntern}
          onClose={() => setSelectedIntern(null)}
        />
      )}
    </div>
  );
}