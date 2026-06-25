"use client";

import { useState } from "react";
import { X, UserRound } from "lucide-react";
import TrainingParticipantProfileModal from "./TrainingParticipantProfileModal";

export default function TrainingParticipantsModal({ program, onClose }) {
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const participants = program.participants || [];

  const statusStyle = (status) => {
    if (status === "Completed") {
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }

    if (status === "Enrolled") {
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    }

    if (status === "Dropped") {
      return "bg-red-500/10 text-red-500 border-red-500/20";
    }

    return "bg-muted text-foreground border-border";
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-4xl max-h-[82vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-background/95 backdrop-blur-xl px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                All Enrolled Participants
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                {participants.length} participants enrolled in {program.name}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-105 hover:shadow-lg hover:shadow-red-500/30 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="border-b border-border bg-muted/40">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Progress</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {participants.map((participant) => (
                  <tr
                    key={participant.id}
                    className="border-b border-border/60 last:border-b-0 hover:bg-muted/20 transition"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground">
                        {participant.name}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {participant.email}
                    </td>

                    <td className="px-5 py-4 text-sm text-foreground whitespace-nowrap">
                      {participant.contact}
                    </td>

                    <td className="px-5 py-4 min-w-[180px]">
                      <div className="text-sm font-medium text-foreground mb-1">
                        {participant.progress}%
                      </div>

                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-foreground dark:bg-primary"
                          style={{ width: `${participant.progress}%` }}
                        />
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle(
                          participant.status
                        )}`}
                      >
                        {participant.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedParticipant(participant)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition"
                      >
                        <UserRound size={16} />
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedParticipant && (
        <TrainingParticipantProfileModal
          participant={selectedParticipant}
          program={program}
          onClose={() => setSelectedParticipant(null)}
        />
      )}
    </>
  );
}