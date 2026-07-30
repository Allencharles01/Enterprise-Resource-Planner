"use client";

import { X } from "lucide-react";
import CustomerInfo from "./CustomerInfo";

export default function CustomerDetailsModal({
  open,
  onClose,
  contact,
  recentCalls = [],
  onPhoneClick,
  onEmailClick,
  onViewAllHistory,
  onAddNote,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div
  className="
    relative
    w-[90vw]
    max-w-5xl
    max-h-[90vh]
    overflow-y-auto
    rounded-2xl
    shadow-2xl

    bg-white
    border
    border-violet-200

    dark:bg-[#12121b]
    dark:border-white/10
  "
>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-2xl font-bold text-[#24123B] dark:text-white">
            Customer Details
          </h2>

          <button
  onClick={onClose}
  className="
    rounded-lg
    p-2
    transition
    hover:bg-violet-100
    dark:hover:bg-white/10
  "
>
  <X
    className="text-[#24123B] dark:text-white"
    size={22}
  />
</button>
        </div>

        {/* Customer Info */}
        <div className="p-6">
          <CustomerInfo
            contact={contact}
            recentCalls={recentCalls}
            onPhoneClick={(number) => {
              onPhoneClick(number);
              onClose(); // close popup after selecting number
            }}
            onEmailClick={onEmailClick}
            onViewAllHistory={onViewAllHistory}
            onAddNote={onAddNote}
          />
        </div>

      </div>
    </div>
  );
}