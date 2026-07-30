"use client";

import { useState } from "react";
import { X, Calendar, Clock } from "lucide-react";

export default function ReviewSheetModal({
    open,
    onClose,
    contact = {},
    onSubmit,
}) {
  const [summary, setSummary] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [priority, setPriority] = useState("Medium");

  if (!open) return null;

  const handleSubmit = () => {
    if (!summary.trim()) {
      alert("Please enter the call summary.");
      return;
    }

    onSubmit?.({
  customerId: contact?.id,
  summary,
  followUpDate,
  followUpTime,
  priority,
});

    setSummary("");
    setFollowUpDate("");
    setFollowUpTime("");
    setPriority("Medium");

    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#161622] shadow-xl border border-violet-100 dark:border-white/10">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-violet-100 dark:border-white/10">

          <div>
            <h2 className="text-xl font-semibold text-[#24123B] dark:text-white">
              Call Review Sheet
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Save important details before moving to the next contact.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-violet-100 dark:hover:bg-white/5"
          >
            <X size={18} />
          </button>

        </div>

        {/* Customer */}
        <div className="p-5 border-b border-violet-100 dark:border-white/10">

          <h3 className="font-semibold text-lg">
  {contact?.name || "Customer"}
</h3>

<p className="text-sm text-gray-500">
  {contact?.phoneNumber}
</p>

<p className="text-sm text-gray-500">
  {contact?.company}
</p>

        </div>

        {/* Body */}
        <div className="space-y-5 p-5">

          {/* Summary */}
          <div>

            <label className="font-medium block mb-2">
              Call Summary
            </label>

            <textarea
              rows={5}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write what happened during the call..."
              className="w-full rounded-xl border border-violet-200 dark:border-white/10 px-4 py-3 bg-white dark:bg-[#1f1f2f] outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />

          </div>

          {/* Follow Up */}

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium">
                <Calendar size={16} />
                Follow-up Date
              </label>

              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full rounded-xl border border-violet-200 dark:border-white/10 px-4 py-3 bg-white dark:bg-[#1f1f2f]"
              />

            </div>

            <div>

              <label className="mb-2 flex items-center gap-2 font-medium">
                <Clock size={16} />
                Follow-up Time
              </label>

              <input
                type="time"
                value={followUpTime}
                onChange={(e) => setFollowUpTime(e.target.value)}
                className="w-full rounded-xl border border-violet-200 dark:border-white/10 px-4 py-3 bg-white dark:bg-[#1f1f2f]"
              />

            </div>

          </div>

          {/* Priority */}

          <div>

            <label className="block mb-2 font-medium">
              Lead Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-violet-200 dark:border-white/10 px-4 py-3 bg-white dark:bg-[#1f1f2f]"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 p-5 border-t border-violet-100 dark:border-white/10">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-violet-300 hover:bg-violet-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700"
          >
            Save Review
          </button>

        </div>

      </div>

    </div>
  );
}