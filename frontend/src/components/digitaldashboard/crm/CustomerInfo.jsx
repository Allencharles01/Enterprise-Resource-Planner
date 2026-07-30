"use client";

import { useState } from "react";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import {
  formatCallDuration,
  getInitials,
} from "@/utils/phoneFormatter";

export default function CustomerInfo({
  contact,
  recentCalls = [],
  onPhoneClick,
  onEmailClick,
  onViewAllHistory,
  onAddNote,
}) {
  const [draftNote, setDraftNote] = useState("");

  if (!contact) {
    return (
      <div className="rounded-2xl border p-6 bg-white dark:bg-[#12121b] dark:border-white/5">
        <p className="text-gray-500 dark:text-gray-400">
          No customer selected.
        </p>
      </div>
    );
  }

  const saveNote = () => {
    if (!draftNote.trim()) return;

    if (onAddNote) {
      onAddNote(draftNote.trim());
    }

    setDraftNote("");
  };

  return (
    <div
      className="
        rounded-2xl
        border
        p-5
        flex
        flex-col
        gap-5
        overflow-y-auto

        bg-white
        border-violet-100

        dark:bg-[#12121b]
        dark:border-white/5
      "
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-violet-500 text-lg">👤</span>

        <h3 className="font-semibold text-[#24123B] dark:text-white">
          Customer Information
        </h3>
      </div>

      {/* Avatar */}
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 rounded-full bg-violet-500 text-white flex items-center justify-center font-bold text-lg">
          {getInitials(contact.name)}
        </div>

        <div className="flex-1">

          <h2 className="font-semibold text-lg text-[#24123B] dark:text-white">
            {contact.name}
          </h2>

          {contact.leadCategory && (
            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
              {contact.leadCategory}
            </span>
          )}

          {/* Phone */}
          <button
            onClick={() => onPhoneClick(contact.phoneNumber)}
            className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600"
          >
            <Phone size={15} />
            {contact.phoneNumber}
          </button>

          {/* Email */}
          {contact.email && (
            <button
              onClick={() => onEmailClick(contact.email)}
              className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-violet-600"
            >
              <Mail size={15} />
              {contact.email}
            </button>
          )}
        </div>
      </div>

      {/* Customer Details */}
      <div className="grid grid-cols-2 gap-4">

        <Field label="Company" value={contact.company} />

        <Field label="Designation" value={contact.designation} />

        <Field label="Education" value={contact.education} />

        <Field label="Location" value={contact.location} />

        <Field
          label="Employment"
          value={contact.employmentStatus}
        />
      </div>

      {/* Notes */}
      <div>

        <h4 className="font-medium mb-2 dark:text-white">
          Notes
        </h4>

        <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">

          {(contact.notes || []).length === 0 && (
            <p className="text-sm text-gray-400">
              No notes available.
            </p>
          )}

          {(contact.notes || []).map((note) => (
            <div
              key={note.id}
              className="rounded-lg bg-[#F7F2FF] dark:bg-white/5 p-3"
            >
              <p className="text-sm dark:text-gray-200">
                {note.content}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {note.createdBy} •{" "}
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">

          <input
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
            placeholder="Add a note..."
            className="
              flex-1
              rounded-lg
              border
              px-3
              py-2
              text-sm

              bg-[#F7F2FF]
              border-[#DDD6FE]

              dark:bg-white/5
              dark:border-white/10
              dark:text-white
            "
          />

          <button
            onClick={saveNote}
            disabled={!draftNote.trim()}
            className="
              px-4
              rounded-lg
              bg-violet-600
              text-white
              hover:bg-violet-700
              disabled:opacity-40
            "
          >
            Save
          </button>
        </div>
      </div>

      {/* Recent Calls */}
      <div>

        <div className="flex items-center justify-between mb-3">

          <h4 className="font-medium flex items-center gap-2 dark:text-white">
            <Phone size={16} />
            Recent Calls
          </h4>

          <button
            onClick={onViewAllHistory}
            className="text-sm text-violet-600 hover:underline"
          >
            View All
          </button>

        </div>

        <div className="space-y-3">

          {recentCalls.length === 0 && (
            <p className="text-sm text-gray-400">
              No previous calls available.
            </p>
          )}

          {recentCalls.slice(0, 3).map((call) => (
            <div
              key={call.id}
              className="flex items-center justify-between"
            >
              <div className="flex gap-2">

                <ArrowUpRight
                  size={18}
                  className="text-green-500 mt-1"
                />

                <div>

                  <p className="dark:text-white">
                    {call.status}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(
                      call.callStartTime
                    ).toLocaleDateString()}{" "}
                    {new Date(
                      call.callStartTime
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                </div>
              </div>

              <span className="text-sm text-gray-500">
                {formatCallDuration(call.callDurationSeconds)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function Field({ label, value }) {
  if (!value) return null;

  return (
    <div>
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="text-sm text-[#24123B] dark:text-gray-200">
        {value}
      </p>
    </div>
  );
}