"use client";

import { useEffect, useState } from "react";
import { X, CalendarClock } from "lucide-react";

const inputClass =
  "w-full rounded-2xl bg-[#1b2333] border border-slate-700/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition";

export default function EmployeeRemindersModal({ isOpen, onClose }) {
  const [reminderData, setReminderData] = useState({
    title: "",
    description: "",
    dateTime: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setReminderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleReminder = () => {
    if (
      !reminderData.title ||
      !reminderData.description ||
      !reminderData.dateTime
    ) {
      alert("Please fill title, description, and date/time.");
      return;
    }

    const existingReminders = JSON.parse(
      localStorage.getItem("employeeReminders") || "[]",
    );

    const updatedReminders = [
      ...existingReminders,
      {
        ...reminderData,
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem(
      "employeeReminders",
      JSON.stringify(updatedReminders),
    );

    alert("Reminder scheduled successfully.");

    setReminderData({
      title: "",
      description: "",
      dateTime: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700/60 bg-[#111827] shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-700/60 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-white">Schedule Reminder</h2>
            <p className="mt-1 text-sm text-slate-400">
              Add reminder details and schedule it for later
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-400 hover:scale-105 active:scale-95 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">
              Title
            </label>
            <input
              name="title"
              value={reminderData.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="Reminder title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">
              Description
            </label>
            <textarea
              name="description"
              value={reminderData.description}
              onChange={handleChange}
              rows={5}
              className={`${inputClass} resize-none`}
              placeholder="Write reminder description..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-200">
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={reminderData.dateTime}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 gap-3 border-t border-slate-700/60 px-6 py-5">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleScheduleReminder}
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition"
          >
            <CalendarClock size={17} />
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}