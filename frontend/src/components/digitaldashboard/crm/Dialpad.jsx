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
        p-5
        flex
        flex-col
        gap-4
        bg-white
        border-violet-100
        dark:bg-[#12121b]
        dark:border-white/5
        transition-colors
        duration-300
      "
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#24123B] dark:text-white">
          Dialpad
        </h3>

        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            online
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
          }`}
        >
          {online ? "Online" : "Offline"}
        </span>
      </div>

      <div className="relative">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter phone number"
          disabled={isActive}
          className="
            w-full
            rounded-xl
            border
            px-4
            py-3
            text-sm

            bg-[#F7F2FF]
            border-[#DDD6FE]
            text-[#24123B]

            dark:bg-white/5
            dark:border-white/10
            dark:text-white

            focus:outline-none
            focus:ring-2
            focus:ring-violet-400
          "
        />

        {phoneNumber && !isActive && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {KEYS.map((key) => (
          <button
            key={key.digit}
            type="button"
            disabled={isActive}
            onClick={() => onDial(key.digit)}
            className="
              aspect-square
              rounded-full
              flex
              flex-col
              items-center
              justify-center

              text-lg
              font-semibold

              bg-[#F7F2FF]
              text-[#24123B]

              hover:bg-[#EDE9FE]

              dark:bg-white/5
              dark:text-white
              dark:hover:bg-white/10

              disabled:opacity-40
            "
          >
            {key.digit}

            {key.sub && (
              <span className="text-[9px] tracking-wider text-gray-400">
                {key.sub}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={onCall}
          disabled={!phoneNumber || isActive}
          className="
            flex-1
            h-12
            rounded-full

            bg-emerald-500
            hover:bg-emerald-600

            text-white

            disabled:opacity-40
          "
        >
          <Phone className="h-5 w-5 mx-auto" />
        </button>

        <button
          type="button"
          onClick={onBackspace}
          disabled={isActive || !phoneNumber}
          className="
            h-12
            w-12
            rounded-full

            bg-gray-100
            hover:bg-gray-200

            dark:bg-white/5
            dark:hover:bg-white/10

            disabled:opacity-40
          "
        >
          <Delete className="h-5 w-5 mx-auto" />
        </button>

        {isActive && (
          <button
            type="button"
            onClick={onEndCall}
            className="
              h-12
              w-12
              rounded-full

              bg-red-500
              hover:bg-red-600

              text-white
            "
          >
            <PhoneOff className="h-5 w-5 mx-auto" />
          </button>
        )}
      </div>

      <div className="text-center">

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
          <p className="text-2xl font-bold mt-1 text-[#24123B] dark:text-white">
            {formatCallDuration(durationSeconds)}
          </p>
        )}
      </div>
    </div>
  );
}