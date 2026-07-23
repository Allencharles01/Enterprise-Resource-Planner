"use client";

import { CheckCircle2, X } from "lucide-react";

export default function SyncSuccessModal({
  open,
  onClose,
  totalContacts = 0,
  importedContacts = 0,
  skippedContacts = 0,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          bg-white
          dark:bg-[#161622]
          shadow-2xl
          border
          border-violet-100
          dark:border-white/10
        "
      >

        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b border-violet-100 dark:border-white/10">

          <div className="flex items-center gap-3">

            <CheckCircle2
              size={28}
              className="text-green-600"
            />

            <div>

              <h2 className="text-lg font-semibold text-[#24123B] dark:text-white">
                Sync Successful
              </h2>

              <p className="text-sm text-gray-500">
                Contacts imported successfully.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-violet-100 dark:hover:bg-white/5"
          >
            <X size={18} />
          </button>

        </div>

        {/* Body */}

        <div className="space-y-4 p-6">

          <div className="rounded-xl bg-violet-50 dark:bg-violet-500/10 p-4">

            <div className="flex justify-between mb-3">
              <span>Total Contacts</span>
              <span className="font-semibold">
                {totalContacts}
              </span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Imported</span>
              <span className="font-semibold text-green-600">
                {importedContacts}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Skipped</span>
              <span className="font-semibold text-orange-500">
                {skippedContacts}
              </span>
            </div>

          </div>

          <div className="rounded-xl border border-violet-100 dark:border-white/10 p-4">

            <p className="text-sm text-gray-600 dark:text-gray-400">

              Your CRM database has been updated successfully.
              Newly imported contacts are now available in the
              Contact List and Calling Workspace.

            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 p-5 border-t border-violet-100 dark:border-white/10">

          <button
            onClick={onClose}
            className="
              rounded-xl
              bg-violet-600
              px-5
              py-2
              text-white
              hover:bg-violet-700
            "
          >
            Continue
          </button>

        </div>

      </div>

    </div>
  );
}