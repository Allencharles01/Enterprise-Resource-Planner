"use client";

import { useEffect, useState } from "react";
import {
  X,
  CalendarClock,
  Trash2,
  CheckCircle2,
  PlusCircle,
  ListTodo,
} from "lucide-react";

const inputClass = "employee-reminder-input";

const labelClass = "mb-2 block text-sm font-semibold employee-reminder-label";

export default function EmployeeRemindersModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("create");
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
    const updated = remindersList.filter(
      (reminder, idx) => (reminder.id || `reminder-${idx}`) !== id
    );

    localStorage.setItem("employeeReminders", JSON.stringify(updated));
    setRemindersList(updated);
  };

  const handleMarkAsDone = (id) => {
    const updated = remindersList.map((reminder, idx) =>
      (reminder.id || `reminder-${idx}`) === id
        ? { ...reminder, isRead: true }
        : reminder
    );

    localStorage.setItem("employeeReminders", JSON.stringify(updated));
    setRemindersList(updated);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-md">
      <div className="employee-reminder-modal-card flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl">
        <div className="employee-reminder-modal-header flex items-start justify-between px-6 py-5">
          <div>
            <h2 className="employee-reminder-title text-xl font-bold">
              Employee Reminders
            </h2>

            <p className="employee-reminder-subtitle mt-1 text-sm">
              Schedule notifications and view upcoming deadlines
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition hover:scale-105 hover:bg-red-400 active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        <div className="employee-reminder-tabs flex gap-3 px-6 pt-3">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 border-b-2 px-2 pb-3 text-sm font-bold transition ${
              activeTab === "create"
                ? "employee-reminder-tab-active"
                : "employee-reminder-tab-inactive"
            }`}
          >
            <PlusCircle size={17} />
            Create New Reminder
          </button>

          <button
            onClick={() => setActiveTab("view")}
            className={`flex items-center gap-2 border-b-2 px-2 pb-3 text-sm font-bold transition ${
              activeTab === "view"
                ? "employee-reminder-tab-active"
                : "employee-reminder-tab-inactive"
            }`}
          >
            <ListTodo size={17} />
            View All Reminders ({remindersList.length})
          </button>
        </div>

        <div className="employee-reminder-modal-body flex-1 space-y-5 overflow-y-auto p-6">
          {activeTab === "create" ? (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  name="title"
                  value={reminderData.title}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Reminder title"
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
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
                <label className={labelClass}>Date & Time</label>
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
                <div className="py-12 text-center text-sm text-muted-foreground dark:text-slate-500">
                  No scheduled reminders found. Click &quot;Create New
                  Reminder&quot; to add one.
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
                      className={`flex flex-col justify-between gap-4 rounded-2xl p-4 transition sm:flex-row sm:items-center ${
                        reminder.isRead
                          ? "employee-reminder-card-done"
                          : "employee-reminder-card-active"
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="employee-reminder-icon-box rounded-xl p-2.5">
                          <CalendarClock size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`employee-reminder-card-title truncate text-sm font-bold ${
                                reminder.isRead ? "line-through" : ""
                              }`}
                            >
                              {reminder.title}
                            </h3>

                            {!reminder.isRead && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
                                Upcoming
                              </span>
                            )}
                          </div>

                          <p className="employee-reminder-card-description mt-1 line-clamp-2 text-xs">
                            {reminder.description}
                          </p>

                          <p className="employee-reminder-card-date mt-2 flex items-center gap-1.5 text-xs font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-indigo-400" />
                            {formattedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {!reminder.isRead && (
                          <button
                            onClick={() => handleMarkAsDone(remId)}
                            className="flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-200 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                            title="Mark as completed"
                          >
                            <CheckCircle2 size={16} />
                            Done
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteReminder(remId)}
                          className="rounded-xl border border-red-200 bg-red-100 p-2 text-red-500 transition hover:bg-red-200 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
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

        {activeTab === "create" && (
          <div className="employee-reminder-modal-footer grid grid-cols-2 gap-3 px-6 py-4">
            <button
              onClick={onClose}
              className="employee-reminder-secondary-btn rounded-2xl px-5 py-3 text-sm font-bold transition"
            >
              Cancel
            </button>

            <button
              onClick={handleScheduleReminder}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:opacity-90 dark:bg-indigo-600 dark:shadow-indigo-500/25 dark:hover:bg-indigo-500"
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