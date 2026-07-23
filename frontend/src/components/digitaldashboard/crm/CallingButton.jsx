"use client";

import { Phone } from "lucide-react";

export default function CallingButton({
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Open calling workspace"
      className="
        inline-flex items-center gap-2
        rounded-xl
        px-4
        py-2.5
        text-sm
        font-medium
        border
        transition-colors
        duration-300

        border-violet-300
        text-violet-600
        bg-white
        hover:bg-violet-50

        dark:border-violet-500/40
        dark:text-violet-300
        dark:bg-transparent
        dark:hover:bg-violet-500/10

        disabled:opacity-50
        disabled:cursor-not-allowed

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-violet-400
      "
    >
      <Phone className="h-4 w-4" />
      <span>Calling</span>
    </button>
  );
}