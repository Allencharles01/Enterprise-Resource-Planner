"use client";

import { useEffect, useState } from "react";
import { X, CalendarClock, Trash2, CheckCircle2, PlusCircle, ListTodo } from "lucide-react";

const inputClass =
  "w-full rounded-2xl bg-[#1b2333] border border-slate-700/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 transition";

export default function EmployeeRemindersModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("create"); // "create" | "view"
  const [remindersList, setRemindersList] = useState([]);
  const [reminderData, setReminderData] = useState({
    title: "",
    description: "",
    dateTime: "",
  });

  const loadAndSortReminders = () => {
    const existing = JSON.parse(
      localStorage.getItem("employeeReminders") || "[]"
    );
    // Sort from nearest date/time to farthest
    const sorted = existing.sort((a, b) => {
      const dateA = new Date(a.dateTime || a.createdAt || 0).getTime();
      const dateB = new Date(b.dateTime || b.createdAt || 0).getTime();
      return dateA - dateB;
    });
    setRemindersList(sorted);
  };

  useEffect(() => {
    if (!isOpen) return;
    loadAndSortReminders();

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
      localStorage.getItem("employeeReminders") || "[]"
    );

    const updatedReminders = [
      ...existingReminders,
      {
        id: `reminder-${Date.now()}`,
        ...reminderData,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem(
      "employeeReminders",
      JSON.stringify(updatedReminders)
    );

    alert("Reminder scheduled successfully.");

    setReminderData({
      title: "",
      description: "",
      dateTime: "",
    });

    loadAndSortReminders();
    setActiveTab("view");
  };

  const handleDeleteReminder = (id) => {
    const updated = remindersList.filter((r, idx) => (r.id || `reminder-${idx}`) !== id);
    localStorage.setItem("employeeReminders", JSON.stringify(updated));
    setRemindersList(updated);
  };

  const handleMarkAsDone = (id) => {
    const updated = remindersList.map((r, idx) =>
      (r.id || `reminder-${idx}`) === id ? { ...r, isRead: true } : r
    );
    localStorage.setItem("employeeReminders", JSON.stringify(updated));
    setRemindersList(updated);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700/60 bg-[#111827] shadow-2xl shadow-black/60 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-700/60 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-white">Employee Reminders</h2>
            <p className="mt-1 text-xs text-slate-400">
              Schedule notifications and view upcoming deadlines
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-400 hover:scale-105 active:scale-95 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Top Tabs */}
        <div className="flex border-b border-slate-700/60 bg-slate-900/60 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-bold text-sm transition ${
              activeTab === "create"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <PlusCircle size={17} />
            Create New Reminder
          </button>

          <button
            onClick={() => setActiveTab("view")}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-bold text-sm transition ${
              activeTab === "view"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <ListTodo size={17} />
            View All Reminders ({remindersList.length})
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === "create" ? (
            <div className="space-y-5">
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
                  rows={4}
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
          ) : (
            <div className="space-y-3">
              {remindersList.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  No scheduled reminders found. Click &quot;Create New Reminder&quot; to add one.
                </div>
              ) : (
                remindersList.map((reminder, idx) => {
                  const remId = reminder.id || `reminder-${idx}`;
                  const formattedDate = reminder.dateTime
                    ? new Date(reminder.dateTime).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "No exact time set";

                  return (
                    <div
                      key={remId}
                      className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        reminder.isRead
                          ? "bg-slate-900/40 border-slate-700/50 opacity-60"
                          : "bg-indigo-500/10 border-indigo-500/30 shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`p-2.5 rounded-xl ${reminder.isRead ? "bg-slate-800 text-slate-400" : "bg-indigo-500/20 text-indigo-400"}`}>
                          <CalendarClock size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`text-sm font-bold truncate ${reminder.isRead ? "line-through text-slate-400" : "text-white"}`}>
                              {reminder.title}
                            </h3>
                            {!reminder.isRead && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                Upcoming
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                            {reminder.description}
                          </p>
                          <p className="text-xs font-semibold text-indigo-300 mt-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            {formattedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {!reminder.isRead && (
                          <button
                            onClick={() => handleMarkAsDone(remId)}
                            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition text-xs font-bold flex items-center gap-1"
                            title="Mark as completed"
                          >
                            <CheckCircle2 size={16} />
                            Done
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReminder(remId)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition"
                          title="Delete reminder"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === "create" && (
          <div className="grid grid-cols-2 gap-3 border-t border-slate-700/60 px-6 py-4 bg-slate-900/40">
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
              Schedule Reminder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}