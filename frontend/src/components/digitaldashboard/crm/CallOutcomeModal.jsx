"use client";

import { useState } from "react";
import { X } from "lucide-react";

const STATUSES = [
  "Answered",
  "Unanswered",
  "Rejected",
  "Call Later",
];

const CATEGORIES = [
  "Advertising",
  "Content Creation",
  "Heavy Advertisement",
];

export default function CallOutcomeModal({
  open,
  onClose,
  onSave,
}) {
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center">

      <div className="w-[480px] rounded-2xl bg-white dark:bg-[#12121b] border border-violet-200 dark:border-white/10">

        {/* Header */}

        <div className="flex items-center justify-between p-5 border-b border-border">

          <h2 className="text-xl font-bold">
            Call Summary
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        {/* Body */}

        <div className="p-5 space-y-5">

          <div>

            <label className="font-semibold">
              Call Status
            </label>

            <select
              value={status}
              onChange={(e)=>setStatus(e.target.value)}
              className="mt-2 w-full rounded-xl border p-3 bg-background"
            >
              <option value="">
                Select Status
              </option>

              {STATUSES.map((s)=>(
                <option key={s}>
                  {s}
                </option>
              ))}

            </select>

          </div>

          {status==="Answered" && (

            <div>

              <label className="font-semibold">
                Lead Category
              </label>

              <select
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl border p-3 bg-background"
              >

                <option value="">
                  Select Category
                </option>

                {CATEGORIES.map((c)=>(
                  <option key={c}>
                    {c}
                  </option>
                ))}

              </select>

            </div>

          )}

          {status==="Call Later" && (

            <>

              <div>

                <label>Date</label>

                <input
                  type="date"
                  value={date}
                  onChange={(e)=>setDate(e.target.value)}
                  className="mt-2 w-full rounded-xl border p-3"
                />

              </div>

              <div>

                <label>Time</label>

                <input
                  type="time"
                  value={time}
                  onChange={(e)=>setTime(e.target.value)}
                  className="mt-2 w-full rounded-xl border p-3"
                />

              </div>

            </>

          )}

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 p-5 border-t border-border">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border"
          >
            Cancel
          </button>

          <button
            onClick={()=>{
              onSave({
                status,
                category,
                date,
                time,
              });

              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-violet-600 text-white"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}