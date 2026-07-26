"use client";

import { Delete, Phone, PhoneOff } from "lucide-react";
import { formatCallDuration } from "@/utils/phoneFormatter";

const KEYS = [
  { digit: "1" },
  { digit: "2", sub: "ABC" },
  { digit: "3", sub: "DEF" },
  { digit: "4", sub: "GHI" },
  { digit: "5", sub: "JKL" },
  { digit: "6", sub: "MNO" },
  { digit: "7", sub: "PQRS" },
  { digit: "8", sub: "TUV" },
  { digit: "9", sub: "WXYZ" },
  { digit: "*" },
  { digit: "0", sub: "+" },
  { digit: "#" },
];

const STATUS_LABEL = {
  ready: "Ready to Call",
  calling: "Calling...",
  connected: "Connected",
  ended: "Call Ended",
  failed: "Unable to connect. Please try again.",
  missed: "Missed",
};

export default function Dialpad({
  phoneNumber,
  onChange,
  onDial,
  onBackspace,
  onCall,
  onEndCall,
  callState,
  durationSeconds,
  online = true,
}) {
  const isActive =
    callState === "calling" || callState === "connected";

  return (
    <div
      className="
        rounded-2xl
        border
        border-violet-100
        bg-white
        dark:bg-[#12121b]
        dark:border-white/10
        p-4
        transition-all
        duration-300
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#24123B] dark:text-white">
          Dial Pad
        </h3>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            online
              ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
              : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
          }`}
        >
          {online ? "Online" : "Offline"}
        </span>
      </div>

      {/* Number Input */}

      <div className="relative mb-5">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => onChange(e.target.value)}
          disabled={isActive}
          placeholder="Enter phone number"
          className="
            w-full
            rounded-xl
            border
            border-violet-200
            bg-[#F7F2FF]
            dark:bg-[#1B1B2D]
            dark:border-white/10

            px-4
            py-3

            text-lg
            font-semibold
            tracking-wide

            text-[#24123B]
            dark:text-white

            focus:outline-none
            focus:ring-2
            focus:ring-violet-400
          "
        />

        {phoneNumber && !isActive && (
          <button
            onClick={() => onChange("")}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2

              text-gray-400
              hover:text-red-500
            "
          >
            ✕
          </button>
        )}
      </div>

      {/* Dial Pad */}

      <div className="grid grid-cols-3 gap-2 mb-5">
        {KEYS.map((key) => (
          <button
            key={key.digit}
            type="button"
            disabled={isActive}
            onClick={() => onDial(key.digit)}
            className="
              h-16
              w-16
              mx-auto

              rounded-full

              border
              border-violet-200

              bg-[#F7F2FF]
              hover:bg-[#EDE9FE]

              dark:bg-[#1B1B2D]
              dark:border-white/10
              dark:hover:bg-white/10

              flex
              flex-col
              items-center
              justify-center

              transition-all
              duration-200
              hover:scale-105

              disabled:opacity-40
            "
          >
            <span className="text-2xl font-bold text-[#24123B] dark:text-white">
              {key.digit}
            </span>

            {key.sub && (
              <span className="text-[9px] uppercase tracking-widest text-gray-400">
                {key.sub}
              </span>
            )}
          </button>
        ))}
      </div>
            {/* Action Buttons */}

      <div className="space-y-3">

        <button
          type="button"
          onClick={onCall}
          disabled={!phoneNumber || isActive}
          className="
            w-full
            h-12
            rounded-xl

            bg-emerald-500
            hover:bg-emerald-600

            text-white
            font-semibold

            flex
            items-center
            justify-center
            gap-2

            transition-all
            duration-200

            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          <Phone size={18} />
          Call
        </button>

        {isActive && (
          <button
            type="button"
            onClick={onEndCall}
            className="
              w-full
              h-12
              rounded-xl

              bg-red-500
              hover:bg-red-600

              text-white
              font-semibold

              flex
              items-center
              justify-center
              gap-2

              transition-all
              duration-200
            "
          >
            <PhoneOff size={18} />
            End Call
          </button>
        )}

        <button
          type="button"
          onClick={onBackspace}
          disabled={!phoneNumber || isActive}
          className="
            w-full
            h-11

            rounded-xl

            border
            border-violet-200

            bg-[#F7F2FF]
            hover:bg-[#EDE9FE]

            dark:bg-[#1B1B2D]
            dark:border-white/10
            dark:hover:bg-white/10

            flex
            items-center
            justify-center
            gap-2

            text-[#24123B]
            dark:text-white

            transition-all
            duration-200

            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          <Delete size={18} />
          Delete
        </button>

      </div>

      {/* Status */}

      <div className="mt-5 text-center">

        <p
          className={`text-sm font-medium ${
            callState === "failed"
              ? "text-red-500"
              : callState === "connected"
              ? "text-emerald-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {STATUS_LABEL[callState]}
        </p>

        {(callState === "calling" ||
          callState === "connected") && (
          <p className="mt-2 text-3xl font-bold text-[#24123B] dark:text-white">
            {formatCallDuration(durationSeconds)}
          </p>
        )}

      </div>

    </div>
  );
}