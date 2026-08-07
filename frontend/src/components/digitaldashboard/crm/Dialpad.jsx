"use client";

import {
  Delete,
  Phone,
  PhoneOff,
  QrCode,
  X,
} from "lucide-react";

import { QRCodeCanvas } from "qrcode.react";
import { useState, useEffect } from "react";
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
  const isActive = callState === "calling" || callState === "connected";
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showQR) {
        setShowQR(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showQR]);

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

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              online
                ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400"
            }`}
          >
            {online ? "Online" : "Offline"}
          </span>

          <button
            onClick={() => setShowQR(true)}
            className="
              h-10
              w-10
              rounded-xl
              border
              border-violet-200
              bg-[#F7F2FF]
              hover:bg-violet-500
              hover:text-white

              dark:bg-[#1B1B2D]
              dark:border-white/10
              dark:hover:bg-violet-500

              flex
              items-center
              justify-center

              transition-all
              duration-300
              hover:scale-105
            "
            title="Generate QR Code"
          >
            <QrCode size={18} />
          </button>
        </div>
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
      <div className="grid grid-cols-3 gap-2 mb-3">
        {KEYS.map((key) => (
          <button
            key={key.digit}
            type="button"
            disabled={isActive}
            onClick={() => onDial(key.digit)}
            className="
              h-13
              w-13
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
            <span className="text-xl font-bold text-[#24123B] dark:text-white leading-none">
              {key.digit}
            </span>

            {key.sub && (
              <span className="text-[8px] uppercase tracking-widest text-gray-400 mt-0.5">
                {key.sub}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!isActive ? (
          <button
            type="button"
            onClick={onCall}
            disabled={!phoneNumber}
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
        ) : (
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

        {(callState === "calling" || callState === "connected") && (
          <p className="mt-2 text-3xl font-bold text-[#24123B] dark:text-white">
            {formatCallDuration(durationSeconds)}
          </p>
        )}
      </div>

      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            className="
              relative
              w-[360px]
              rounded-2xl
              bg-white
              dark:bg-[#12121b]
              border
              border-violet-200
              dark:border-white/10
              p-6
              shadow-2xl
            "
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-red-500"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-center text-[#24123B] dark:text-white">
              Scan to Call
            </h2>

            <p className="text-center text-sm text-gray-500 mt-2 mb-5">
              Scan this QR using your phone
            </p>

            {phoneNumber ? (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-xl">
                  <QRCodeCanvas value={`tel:${phoneNumber}`} size={220} />
                </div>

                <p className="font-semibold text-[#24123B] dark:text-white">
                  {phoneNumber}
                </p>
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="text-2xl mb-3">😕</div>

                <h3 className="font-bold text-red-500">
                  Oops! Something went wrong.
                </h3>

                <p className="text-gray-500 mt-2">
                  Please enter or select a phone number first.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}