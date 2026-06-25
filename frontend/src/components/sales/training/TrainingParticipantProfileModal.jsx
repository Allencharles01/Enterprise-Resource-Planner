"use client";

import {
  X,
  Mail,
  Phone,
  CalendarDays,
  GraduationCap,
  TrendingUp,
  FileText,
  Download,
} from "lucide-react";

export default function TrainingParticipantProfileModal({
  participant,
  program,
  onClose,
}) {
  if (!participant) return null;

  const initials = participant.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  const handleDownloadProfile = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${participant.name} - Training Profile</title>
          <style>
            @page {
              size: A4;
              margin: 18mm;
            }

            body {
              font-family: Arial, sans-serif;
              color: #111827;
              background: #ffffff;
            }

            .header {
              border-bottom: 3px solid #111827;
              padding-bottom: 18px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
            }

            .title {
              font-size: 28px;
              font-weight: 800;
              margin: 0;
            }

            .subtitle {
              color: #6b7280;
              font-size: 14px;
              margin-top: 6px;
            }

            .badge {
              background: #dcfce7;
              color: #166534;
              padding: 7px 14px;
              border-radius: 999px;
              font-weight: 700;
              font-size: 13px;
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

            .progress-track {
              height: 10px;
              background: #e5e7eb;
              border-radius: 999px;
              overflow: hidden;
              margin-top: 8px;
            }

            .progress-fill {
              height: 100%;
              background: #4f46e5;
              width: ${participant.progress || 0}%;
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
              <h1 class="title">Training Participant Profile</h1>
              <div class="subtitle">${participant.name} • ${program.name}</div>
            </div>
            <div class="badge">${participant.status}</div>
          </div>

          <div class="section">
            <div class="section-title">Participant Information</div>
            <div class="grid">
              <div>
                <div class="label">Name</div>
                <div class="value">${participant.name}</div>
              </div>
              <div>
                <div class="label">Email</div>
                <div class="value">${participant.email}</div>
              </div>
              <div>
                <div class="label">Contact</div>
                <div class="value">${participant.contact}</div>
              </div>
              <div>
                <div class="label">Status</div>
                <div class="value">${participant.status}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Training Details</div>
            <div class="grid">
              <div>
                <div class="label">Course</div>
                <div class="value">${program.name}</div>
              </div>
              <div>
                <div class="label">Category</div>
                <div class="value">${program.category}</div>
              </div>
              <div>
                <div class="label">Duration</div>
                <div class="value">${program.duration}</div>
              </div>
              <div>
                <div class="label">Instructor</div>
                <div class="value">${program.instructor}</div>
              </div>
              <div>
                <div class="label">Start Date</div>
                <div class="value">${participant.startDate || "N/A"}</div>
              </div>
              <div>
                <div class="label">Certificate</div>
                <div class="value">${participant.certificate || "Pending"}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Progress Report</div>
            <div class="grid">
              <div>
                <div class="label">Course Progress</div>
                <div class="value">${participant.progress}%</div>
              </div>
              <div>
                <div class="label">Attendance</div>
                <div class="value">${participant.attendance || 0}%</div>
              </div>
            </div>

            <div class="progress-track">
              <div class="progress-fill"></div>
            </div>
          </div>

          <div class="footer">
            Generated Training Participant Profile • ${new Date().toLocaleDateString()}
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-[640px] max-h-[84vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-background/95 backdrop-blur-xl px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-base font-bold text-foreground">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-foreground">
                  {participant.name}
                </h2>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {participant.status}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mt-1">
                {program.name} · {program.instructor}
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
          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <h3 className="font-semibold text-foreground mb-4">
              Contact Information
            </h3>

            <div className="space-y-3 text-sm">
              <InfoRow icon={<Mail size={14} />} label="Email" value={participant.email} />
              <InfoRow icon={<Phone size={14} />} label="Phone" value={participant.contact} />
              <InfoRow icon={<CalendarDays size={14} />} label="Start Date" value={participant.startDate || "N/A"} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-primary" />
              <h3 className="font-semibold text-foreground">
                Progress Report
              </h3>
            </div>

            <ProgressRow label="Course Progress" value={participant.progress} />
            <ProgressRow label="Attendance" value={participant.attendance || 0} />
          </div>

          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={16} className="text-primary" />
              <h3 className="font-semibold text-foreground">
                Certificate & Completion
              </h3>
            </div>

            <p className="text-sm text-muted-foreground">
              {participant.certificate || "Certificate will be issued upon completion."}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/10 p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-primary" />
              <h3 className="font-semibold text-foreground">
                Downloadable Documents
              </h3>
            </div>

            {["Enrollment Agreement", "Progress Report", "Certificate Record"].map(
              (doc) => (
                <div
                  key={doc}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border last:border-b-0 py-3"
                >
                  <p className="text-sm font-medium text-foreground">
                    {doc}
                  </p>

                  <button
                    onClick={handleDownloadProfile}
                    className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition"
                  >
                    <Download size={15} />
                    View
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-background/95 backdrop-blur-xl border-t border-border px-5 py-4 flex gap-3">
          <button
            onClick={handleDownloadProfile}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-muted transition"
          >
            <Download size={17} />
            Download Profile
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

function ProgressRow({ label, value }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-foreground dark:bg-primary"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}