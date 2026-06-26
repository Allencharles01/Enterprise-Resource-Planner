"use client";
import { useEffect } from "react";

import {
  X,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Briefcase,
  TrendingUp,
  FileText,
  Download,
  Eye,
  UserRound,
} from "lucide-react";

export default function InternProfileModal({ intern, onClose }) {
  useEffect(() => {
    if (!intern) return;

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [intern, onClose]);

  if (!intern) return null;

  const initials = intern.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  const handleDownloadProfile = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${intern.name} - Candidate Profile</title>
          <style>
            @page {
              size: A4;
              margin: 18mm;
            }

            body {
              font-family: Arial, sans-serif;
              color: #111827;
              background: #ffffff;
              margin: 0;
              padding: 0;
            }

            .header {
              border-bottom: 3px solid #111827;
              padding-bottom: 18px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }

            .title {
              font-size: 28px;
              font-weight: 800;
              margin: 0;
            }

            .subtitle {
              font-size: 14px;
              color: #6b7280;
              margin-top: 6px;
            }

            .badge {
              background: #dcfce7;
              color: #166534;
              padding: 7px 14px;
              border-radius: 999px;
              font-size: 13px;
              font-weight: 700;
            }

            .section {
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 18px;
              margin-bottom: 18px;
            }

            .section-title {
              font-size: 17px;
              font-weight: 800;
              margin-bottom: 14px;
              color: #111827;
            }

            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 14px 24px;
            }

            .row {
              margin-bottom: 10px;
            }

            .label {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 3px;
            }

            .value {
              font-size: 14px;
              font-weight: 700;
              color: #111827;
            }

            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 14px;
              margin-top: 12px;
            }

            .summary-card {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              padding: 14px;
              text-align: center;
            }

            .summary-value {
              font-size: 22px;
              font-weight: 800;
              color: #111827;
            }

            .summary-label {
              font-size: 12px;
              color: #6b7280;
              margin-top: 4px;
            }

            .progress-track {
              width: 100%;
              height: 10px;
              background: #e5e7eb;
              border-radius: 999px;
              overflow: hidden;
              margin-top: 8px;
            }

            .progress-fill {
              height: 100%;
              background: #4f46e5;
              width: ${intern.progress || 0}%;
            }

            .skills {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }

            .skill {
              background: #eef2ff;
              color: #4338ca;
              padding: 6px 10px;
              border-radius: 999px;
              font-size: 12px;
              font-weight: 700;
            }

            .document-row {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #e5e7eb;
              padding: 10px 0;
              font-size: 14px;
            }

            .document-row:last-child {
              border-bottom: none;
            }

            .footer {
              margin-top: 28px;
              padding-top: 14px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
          </style>
        </head>

        <body>
          <div class="header">
            <div>
              <h1 class="title">Candidate Profile</h1>
              <div class="subtitle">${intern.name} • ${intern.program} • ${intern.department}</div>
            </div>
            <div class="badge">${intern.status}</div>
          </div>

          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="grid">
              <div class="row">
                <div class="label">Full Name</div>
                <div class="value">${intern.name}</div>
              </div>
              <div class="row">
                <div class="label">Email</div>
                <div class="value">${intern.email}</div>
              </div>
              <div class="row">
                <div class="label">Phone</div>
                <div class="value">${intern.phone || "N/A"}</div>
              </div>
              <div class="row">
                <div class="label">Education</div>
                <div class="value">${intern.education || "N/A"}</div>
              </div>
              <div class="row">
                <div class="label">University</div>
                <div class="value">${intern.university || "N/A"}</div>
              </div>
              <div class="row">
                <div class="label">Department</div>
                <div class="value">${intern.department}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Internship Details</div>
            <div class="grid">
              <div class="row">
                <div class="label">Program</div>
                <div class="value">${intern.program}</div>
              </div>
              <div class="row">
                <div class="label">Duration</div>
                <div class="value">${intern.duration}</div>
              </div>
              <div class="row">
                <div class="label">Start Date</div>
                <div class="value">${intern.startDate || "N/A"}</div>
              </div>
              <div class="row">
                <div class="label">End Date</div>
                <div class="value">${intern.endDate || "N/A"}</div>
              </div>
              <div class="row">
                <div class="label">Mentor</div>
                <div class="value">${intern.mentor}</div>
              </div>
              <div class="row">
                <div class="label">Sales Agent</div>
                <div class="value">${intern.salesAgent || "N/A"}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Course & Progress Overview</div>

            <div class="grid">
              <div class="row">
                <div class="label">Purchased Course</div>
                <div class="value">${intern.program}</div>
              </div>
              <div class="row">
                <div class="label">Course Cost</div>
                <div class="value">${intern.courseCost || "N/A"}</div>
              </div>
            </div>

            <div class="row" style="margin-top: 14px;">
              <div class="label">Overall Progress</div>
              <div class="value">${intern.progress || 0}%</div>
              <div class="progress-track">
                <div class="progress-fill"></div>
              </div>
            </div>

            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-value">${intern.projectsCompleted || "0/0"}</div>
                <div class="summary-label">Projects Completed</div>
              </div>

              <div class="summary-card">
                <div class="summary-value">${intern.placement}</div>
                <div class="summary-label">Placement Status</div>
              </div>

              <div class="summary-card">
                <div class="summary-value">${intern.status}</div>
                <div class="summary-label">Candidate Status</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Skills & Competencies</div>
            <div class="skills">
              ${(intern.skills || [])
                .map((skill) => `<span class="skill">${skill}</span>`)
                .join("")}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Invoices & Legal Documents</div>
            <div class="document-row">
              <span>Internship Agreement</span>
              <strong>${intern.startDate || "N/A"}</strong>
            </div>
            <div class="document-row">
              <span>Course Invoice</span>
              <strong>${intern.startDate || "N/A"}</strong>
            </div>
            <div class="document-row">
              <span>NDA Agreement</span>
              <strong>${intern.startDate || "N/A"}</strong>
            </div>
          </div>

          <div class="footer">
            Generated Candidate Profile Report • ${new Date().toLocaleDateString()}
          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };


  const handleDownloadDocument = (docType) => {
  const documentContent = {
    "Internship Agreement": {
      title: "Internship Agreement",
      subtitle: "Official internship agreement document",
      body: `
        This Internship Agreement is made between the organization and ${intern.name}.
        The candidate is enrolled in the ${intern.program} internship program under the ${intern.department} department.
        The internship duration is ${intern.duration}, starting from ${intern.startDate || "N/A"} and ending on ${intern.endDate || "N/A"}.
        The assigned mentor for this internship is ${intern.mentor || "N/A"}.
        The intern is expected to follow all organizational guidelines, maintain professional conduct, complete assigned tasks on time, and participate actively in project work.
      `,
    },
    "Course Invoice": {
      title: "Course Invoice",
      subtitle: "Training course fee and payment details",
      body: `
        This invoice is generated for ${intern.name} for the purchased course: ${intern.program}.
        The total course cost is ${intern.courseCost || "N/A"}.
        The program duration is ${intern.duration}.
        Candidate department: ${intern.department}.
        Payment status is considered recorded for internship and training documentation purposes.
      `,
    },
    "NDA Agreement": {
      title: "NDA Agreement",
      subtitle: "Confidentiality and non-disclosure document",
      body: `
        This Non-Disclosure Agreement is issued for ${intern.name}.
        During the internship period, the candidate may access internal project information, business data, client details, and technical resources.
        The candidate agrees not to disclose, copy, share, or misuse any confidential information received during the internship.
        This agreement remains applicable during and after the internship period.
      `,
    },
  };

  const selectedDoc = documentContent[docType];

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${selectedDoc.title} - ${intern.name}</title>
        <style>
          @page {
            size: A4;
            margin: 18mm;
          }

          body {
            font-family: Arial, sans-serif;
            background: #ffffff;
            color: #111827;
            margin: 0;
            padding: 0;
          }

          .header {
            border-bottom: 3px solid #111827;
            padding-bottom: 18px;
            margin-bottom: 24px;
          }

          .title {
            font-size: 28px;
            font-weight: 800;
            margin: 0;
          }

          .subtitle {
            font-size: 14px;
            color: #6b7280;
            margin-top: 6px;
          }

          .section {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 18px;
            margin-bottom: 18px;
          }

          .section-title {
            font-size: 17px;
            font-weight: 800;
            margin-bottom: 14px;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px 28px;
          }

          .label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
          }

          .value {
            font-size: 14px;
            font-weight: 700;
          }

          .body-text {
            font-size: 14px;
            line-height: 1.8;
            color: #374151;
            text-align: justify;
          }

          .signature {
            margin-top: 55px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }

          .sign-line {
            border-top: 1px solid #111827;
            padding-top: 8px;
            font-size: 13px;
            font-weight: 700;
          }

          .footer {
            margin-top: 35px;
            padding-top: 14px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>

      <body>
        <div class="header">
          <h1 class="title">${selectedDoc.title}</h1>
          <div class="subtitle">${selectedDoc.subtitle}</div>
        </div>

        <div class="section">
          <div class="section-title">Candidate Details</div>
          <div class="grid">
            <div>
              <div class="label">Candidate Name</div>
              <div class="value">${intern.name}</div>
            </div>
            <div>
              <div class="label">Email</div>
              <div class="value">${intern.email}</div>
            </div>
            <div>
              <div class="label">Program</div>
              <div class="value">${intern.program}</div>
            </div>
            <div>
              <div class="label">Department</div>
              <div class="value">${intern.department}</div>
            </div>
            <div>
              <div class="label">Duration</div>
              <div class="value">${intern.duration}</div>
            </div>
            <div>
              <div class="label">Mentor</div>
              <div class="value">${intern.mentor || "N/A"}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Document Details</div>
          <p class="body-text">${selectedDoc.body}</p>
        </div>

        <div class="signature">
          <div class="sign-line">Authorized Signature</div>
          <div class="sign-line">Candidate Signature</div>
        </div>

        <div class="footer">
          Generated on ${new Date().toLocaleDateString()} • ${selectedDoc.title}
        </div>

        <script>
          window.onload = function () {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-[700px] max-h-[84vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-background/95 backdrop-blur-xl px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-base font-bold text-foreground">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-foreground">
                  {intern.name}
                </h2>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {intern.status}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mt-1">
                {intern.program} · {intern.department}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Personal + Internship Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-muted/10 p-4">
              <div className="flex items-center gap-2 mb-4">
                <UserRound size={16} className="text-primary" />
                <h3 className="font-semibold text-foreground">
                  Personal Info
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <InfoRow icon={<Mail size={14} />} label="Email" value={intern.email} />
                <InfoRow icon={<Phone size={14} />} label="Phone" value={intern.phone || "N/A"} />
                <InfoRow icon={<GraduationCap size={14} />} label="Education" value={intern.education || "N/A"} />
                <InfoRow icon={<Building2 size={14} />} label="University" value={intern.university || "N/A"} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-muted/10 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase size={16} className="text-primary" />
                <h3 className="font-semibold text-foreground">
                  Internship Details
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <InfoRow label="Duration" value={intern.duration || "N/A"} />
                <InfoRow label="Start" value={intern.startDate || "N/A"} />
                <InfoRow label="End" value={intern.endDate || "N/A"} />
                <InfoRow label="Mentor" value={intern.mentor || "N/A"} />
                <InfoRow label="Sales Agent" value={intern.salesAgent || "N/A"} />
              </div>
            </div>
          </div>

          {/* Course Cost */}
          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap size={16} className="text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Purchased Course & Cost
                  </h3>
                </div>

                <h4 className="text-base font-bold text-foreground">
                  {intern.program}
                </h4>

                <p className="text-sm text-muted-foreground">
                  {intern.duration} program
                </p>
              </div>

              <p className="text-2xl font-bold text-emerald-500">
                {intern.courseCost || "$4,500"}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary" />
              <h3 className="font-semibold text-foreground">
                Progress Tracking
              </h3>
            </div>

            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold text-foreground">
                {intern.progress}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground dark:bg-primary"
                style={{ width: `${intern.progress}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-muted/40 p-3 text-center">
                <h4 className="text-lg font-bold text-foreground">
                  {intern.projectsCompleted || "0/0"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Projects Completed
                </p>
              </div>

              <div className="rounded-xl bg-muted/40 p-3 text-center">
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {intern.placement}
                </span>
                <p className="text-xs text-muted-foreground mt-2">
                  Placement Status
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <h3 className="font-semibold text-foreground mb-3">
              Skills & Competencies
            </h3>

            <div className="flex flex-wrap gap-2">
              {(intern.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-foreground border border-border"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Documents */}
<div className="rounded-2xl border border-border bg-background p-4">
  <div className="flex items-center gap-2 mb-4">
    <FileText size={16} className="text-primary" />
    <h3 className="font-semibold text-foreground">
      Invoices & Legal Documents
    </h3>
  </div>

  {["Internship Agreement", "Course Invoice", "NDA Agreement"].map((doc) => (
    <div
      key={doc}
      className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border last:border-b-0 py-3"
    >
      <p className="text-sm font-medium text-foreground">
        {doc}
      </p>

      <p className="text-sm text-muted-foreground whitespace-nowrap">
        {intern.startDate || "Jan 15, 2026"}
      </p>

      <button
        onClick={() => handleDownloadDocument(doc)}
        className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition"
      >
        <Download size={15} />
        View
      </button>
    </div>
  ))}
</div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background/95 backdrop-blur-xl border-t border-border px-5 py-4 flex gap-3">
          <button
            onClick={handleDownloadProfile}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted transition"
          >
            <Download size={17} />
            Download PDF Profile
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-foreground text-background py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>

      <span className="text-right font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}