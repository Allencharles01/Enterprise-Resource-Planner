"use client";

import { X, Briefcase, Clock, Download } from "lucide-react";

export default function BudgetModal({ project, onClose }) {
  if (!project) return null;

  const financial = project;

  const handleDownloadInvoice = () => {
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const fileName = `Invoice_${project.project.replaceAll(" ", "_")}.html`;

  const paymentRows = financial.payments
    .map(
      (payment) => `
        <tr>
          <td>${payment.date}</td>
          <td>${payment.amount}</td>
          <td>${payment.title}</td>
        </tr>
      `
    )
    .join("");

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${project.project}</title>

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
            Project: <strong>${project.project}</strong>
            &nbsp;|&nbsp;
            Client: <strong>${project.client}</strong>
          </div>

          <table class="details">
            <tr>
              <td>Lead Manager</td>
              <td>${project.manager}</td>
            </tr>

            <tr>
              <td>Deadline</td>
              <td>${project.deadline}</td>
            </tr>

            <tr>
              <td>Payment Due Date</td>
              <td>${project.deadline}</td>
            </tr>

            <tr>
              <td>Services</td>
              <td>${financial.services.join(", ")}</td>
            </tr>

            <tr>
              <td class="bold">Total Agreed Amount</td>
              <td class="bold">${financial.agreed}</td>
            </tr>

            <tr>
              <td class="bold">Total Received</td>
              <td class="green">${financial.received}</td>
            </tr>

            <tr>
              <td class="bold">Remaining Balance</td>
              <td class="red">${financial.remaining}</td>
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


const handleDownloadSummary = () => {
  const today = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  const fileName = `Summary_${project.project.replace(/[^a-z0-9]/gi, "_")}.html`;

  const summaryHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Project Summary - ${project.project}</title>

        <style>
          body {
            margin: 0;
            background: #ffffff;
            color: #0f172a;
            font-family: Arial, Helvetica, sans-serif;
          }

          .summary {
            padding: 70px 55px;
          }

          h1 {
            margin: 0 0 18px;
            font-size: 28px;
            color: #17375e;
          }

          .meta {
            font-size: 16px;
            margin-bottom: 26px;
          }

          .meta strong {
            font-weight: 700;
          }

          .cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 22px;
            margin-bottom: 26px;
          }

          .card {
            background: #f3f7fd;
            border-radius: 8px;
            padding: 18px;
          }

          .card h2 {
            margin: 0;
            font-size: 24px;
            color: #17375e;
          }

          .card p {
            margin: 4px 0 0;
            font-size: 13px;
            color: #475569;
          }

          .section {
            margin-top: 24px;
            font-size: 16px;
          }

          .progress-label {
            margin-bottom: 14px;
          }

          .progress-track {
            width: 100%;
            height: 10px;
            background: #dbe3ef;
            border-radius: 999px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            width: ${project.progress}%;
            background: #17375e;
            border-radius: 999px;
          }

          .services {
            margin-top: 26px;
            font-size: 18px;
          }

          .footer {
            margin-top: 24px;
            font-size: 12px;
            color: #64748b;
          }
        </style>
      </head>

      <body>
        <div class="summary">
          <h1>Project Summary - ${project.project}</h1>

          <div class="meta">
            Client: <strong>${project.client}</strong>
            &nbsp; | &nbsp;
            Manager: <strong>${project.manager}</strong>
            &nbsp; | &nbsp;
            Deadline: <strong>${project.deadline}</strong>
          </div>

          <div class="cards">
            <div class="card">
              <h2>${financial.agreed}</h2>
              <p>Total Agreed</p>
            </div>

            <div class="card">
              <h2>${financial.received}</h2>
              <p>Received</p>
            </div>

            <div class="card">
              <h2>${financial.remaining}</h2>
              <p>Remaining</p>
            </div>

            <div class="card">
              <h2>${project.status}</h2>
              <p>Status</p>
            </div>
          </div>

          <div class="section">
            <div class="progress-label">
              Collection Progress: <strong>${project.progress}%</strong>
            </div>

            <div class="progress-track">
              <div class="progress-fill"></div>
            </div>
          </div>

          <div class="services">
            <strong>Services Provided:</strong>
            ${financial.services.join(" · ")}
          </div>

          <div class="footer">
            Generated ${today} — Confidential
          </div>
        </div>
      </body>
    </html>
  `;

  const blob = new Blob([summaryHTML], {
    type: "text/html",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
       className="
  w-full
  max-w-[570px]
  h-[690px]
  max-h-[86vh]
  overflow-y-auto
  rounded-2xl
  border
  border-border
  bg-background
  shadow-2xl
"
      >
        <div className="p-5 border-b border-border flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {project.project}
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              {project.client}
              <span className="mx-2">•</span>
              {project.manager}
              <span className="mx-2">•</span>
              Due {project.deadline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-500 text-white hover:scale-105 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 p-5">
          <div className="rounded-xl bg-muted/40 p-3 text-center">
            <p className="text-xl font-bold">{financial.agreed}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Agreed</p>
          </div>

          <div className="rounded-xl bg-muted/40 p-3 text-center">
            <p className="text-xl font-bold text-green-500">
              {financial.received}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Received</p>
          </div>

          <div className="rounded-xl bg-muted/40 p-3 text-center">
            <p className="text-xl font-bold text-red-500">
              {financial.remaining}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Remaining</p>
          </div>
        </div>

        <div className="px-5">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium">Collection Progress</span>
            <span className="font-semibold">{project.progress}%</span>
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="p-5">
          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={16} />
              <h3 className="text-sm font-semibold">Services Provided</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {financial.services.map((service) => (
                <span
                  key={service}
                  className="px-3 py-1 rounded-full bg-muted text-xs"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5">
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Clock size={16} />
              <h3 className="text-sm font-semibold">Payment History</h3>
            </div>

            {financial.payments.map((payment, index) => (
              <div
                key={index}
                className="px-4 py-3 border-b border-border flex justify-between gap-4"
              >
                <div>
                  <p className="text-sm font-medium">{payment.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {payment.date}
                  </p>
                </div>

                <div className="text-sm font-bold text-green-500">
                  {payment.amount}
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Service Agreement */}
      <div className="px-5 pt-4">
        <div className="rounded-xl border border-border p-4">
          <div className="flex items-start gap-2">
            <Briefcase
              size={16}
              className="mt-0.5 text-muted-foreground"
            />

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Service Agreement
              </h3>

              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Agreement signed on {financial.agreementDate}. All services
                governed by master services agreement MSA-2026.
              </p>
            </div>
          </div>
        </div>
      </div>

        <div className="p-5 flex gap-3">
          <button
  onClick={handleDownloadInvoice}
  className="flex-1 border border-border rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2"
>
  <Download size={16} />
  Download Invoice
</button>

          <button
  onClick={handleDownloadSummary}
  className="flex-1 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2"
>
  <Download size={16} />
  Download Summary
</button>
        </div>
      </div>
    </div>
  );
}