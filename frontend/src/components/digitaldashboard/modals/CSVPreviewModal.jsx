"use client";

import { useState } from "react";
import { X, FileSpreadsheet, CheckCircle2, RefreshCw } from "lucide-react";

export default function CSVPreviewModal({
  open,
  onClose,
  fileName = "Employee_Leads_July_2026.csv",
  uploadedBy = "Admin",
  rows,
  onSync,
}) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  if (!open) return null;

  const defaultData = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@gmail.com",
  },
  {
    id: 2,
    name: "Priya Gupta",
    phone: "9123456789",
    email: "priya@gmail.com",
  },
  {
    id: 3,
    name: "Aman Singh",
    phone: "9988776655",
    email: "aman@gmail.com",
  },
];

  const handleSync = () => {
  setIsSyncing(true);

  setTimeout(() => {
    setIsSyncing(false);
    setSyncComplete(true);

    if (onSync) {
      onSync();
    }
  }, 1500);
};

  const handleClose = () => {
    setIsSyncing(false);
    setSyncComplete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl dark:bg-[#0f172a] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="text-green-600" size={24} />
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                CSV Preview
              </h2>
              <p className="text-sm text-slate-500">
                Review uploaded employee sheet
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {!syncComplete ? (
          <>
            {/* File Info */}
            <div className="px-6 pt-5">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {fileName}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Uploaded by <strong>{uploadedBy}</strong>
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="px-6 py-5">
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Email</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(rows || defaultData).map((row, index) => (
                      <tr
                        key={index}
                        className="border-t border-slate-200 dark:border-slate-700"
                      >
                        <td className="px-4 py-3">{row.name}</td>
                        <td className="px-4 py-3">{row.phone}</td>
                        <td className="px-4 py-3">{row.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
              <button
                onClick={handleClose}
                className="rounded-lg border border-slate-300 px-5 py-2 font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
              >
                {isSyncing && (
                  <RefreshCw size={16} className="animate-spin" />
                )}

                {isSyncing ? "Syncing..." : "Sync Sheet"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center px-8 py-14">
            <CheckCircle2
              size={70}
              className="mb-5 text-green-500"
            />

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Sheet Synced Successfully
            </h3>

            <p className="mt-3 text-center text-slate-500">
              The employee data has been synchronized successfully.
            </p>

            <button
              onClick={handleClose}
              className="mt-8 rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}