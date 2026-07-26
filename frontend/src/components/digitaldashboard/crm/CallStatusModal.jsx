"use client";

import { useState } from "react";
import { X } from "lucide-react";

const CALL_STATUSES = [
  "Answered",
  "Unanswered",
  "Rejected",
  "Call Later",
  "Busy",
  "Wrong Number",
];

export default function CallStatusModal({
    open,
    onClose,
    onSave,
    loading = false,
    contact,
    durationSeconds,
}) {
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  if (!open) return null;

  const handleSave = () => {
    if (!status) {
      alert("Please select a call status.");
      return;
    }

    if (onSave) {
      onSave({
        status,
        remarks,
      });
    }

    setStatus("");
    setRemarks("");
  };

  const handleClose = () => {
    setStatus("");
    setRemarks("");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="
          w-full
          max-w-lg
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
        <div className="flex items-center justify-between border-b border-violet-100 dark:border-white/10 p-5">
          <h2 className="text-lg font-semibold text-[#24123B] dark:text-white">
            Call Status
          </h2>

          <button
            onClick={handleClose}
            className="rounded-lg p-2 hover:bg-violet-50 dark:hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-5">
          <div className="mb-5 rounded-xl bg-violet-50 dark:bg-violet-500/10 p-4">
  <h3 className="font-semibold">
    {contact?.name}
  </h3>

  <p className="text-sm text-gray-500">
    {contact?.phoneNumber}
  </p>

  <p className="text-sm text-gray-500">
    Duration: {Math.floor(durationSeconds / 60)}:
{String(durationSeconds % 60).padStart(2, "0")}
  </p>
</div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Select Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                border-violet-200
                dark:border-white/10
                bg-white
                dark:bg-[#1f1f2f]
                px-4
                py-3
                focus:ring-2
                focus:ring-violet-500
                outline-none
              "
            >
              <option value="">Choose Status</option>

              {CALL_STATUSES.map((item) => (
  <option key={item} value={item}>
    {item}
  </option>
))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Remarks
            </label>

            <textarea
              rows={5}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Write call notes..."
              className="
                w-full
                rounded-xl
                border
                border-violet-200
                dark:border-white/10
                bg-white
                dark:bg-[#1f1f2f]
                px-4
                py-3
                resize-none
                outline-none
                focus:ring-2
                focus:ring-violet-500
              "
            />
          </div>
        </div>

        <div className="mb-5 rounded-xl bg-violet-50 dark:bg-violet-500/10 p-4">

    <h3 className="font-semibold">
        {contact?.name}
    </h3>

    <p className="text-sm text-gray-500">
        {contact?.phoneNumber}
    </p>

    <p className="text-sm text-gray-500">
        Duration : {durationSeconds}s
    </p>

</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-violet-100 dark:border-white/10 p-5">
          <button
            onClick={handleClose}
            className="
              rounded-xl
              border
              border-violet-300
              px-5
              py-2
              hover:bg-violet-50
              dark:border-white/10
              dark:hover:bg-white/5
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="
              rounded-xl
              bg-violet-600
              px-5
              py-2
              text-white
              hover:bg-violet-700
              disabled:opacity-50
            "
          >
            {loading ? "Saving..." : "Save Status"}
          </button>
        </div>
      </div>
    </div>
  );
}