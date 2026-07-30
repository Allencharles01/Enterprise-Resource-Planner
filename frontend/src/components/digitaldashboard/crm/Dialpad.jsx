"use client";

<<<<<<< HEAD
import { Delete, Phone, PhoneOff } from "lucide-react";
=======
import {
  Delete,
  Phone,
  PhoneOff,
  QrCode,
  X,
} from "lucide-react";

import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
>>>>>>> Newfrontend-kanak
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

<<<<<<< HEAD
=======
  const [showQR, setShowQR] = useState(false);

>>>>>>> Newfrontend-kanak
  return (
    <div
      className="
        rounded-2xl
        border
<<<<<<< HEAD
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
=======
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
>>>>>>> Newfrontend-kanak
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => onChange(e.target.value)}
<<<<<<< HEAD
          placeholder="Enter phone number"
          disabled={isActive}
=======
          disabled={isActive}
          placeholder="Enter phone number"
>>>>>>> Newfrontend-kanak
          className="
            w-full
            rounded-xl
            border
<<<<<<< HEAD
            px-4
            py-3
            text-sm

            bg-[#F7F2FF]
            border-[#DDD6FE]
            text-[#24123B]

            dark:bg-white/5
            dark:border-white/10
=======
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
>>>>>>> Newfrontend-kanak
            dark:text-white

            focus:outline-none
            focus:ring-2
            focus:ring-violet-400
          "
        />

        {phoneNumber && !isActive && (
          <button
<<<<<<< HEAD
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
=======
            onClick={() => onChange("")}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2

              text-gray-400
              hover:text-red-500
            "
>>>>>>> Newfrontend-kanak
          >
            ✕
          </button>
        )}
      </div>

<<<<<<< HEAD
      <div className="grid grid-cols-3 gap-3">
=======
      {/* Dial Pad */}

      <div className="grid grid-cols-3 gap-2 mb-5">
>>>>>>> Newfrontend-kanak
        {KEYS.map((key) => (
          <button
            key={key.digit}
            type="button"
            disabled={isActive}
            onClick={() => onDial(key.digit)}
            className="
<<<<<<< HEAD
              aspect-square
              rounded-full
=======
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

>>>>>>> Newfrontend-kanak
              flex
              flex-col
              items-center
              justify-center

<<<<<<< HEAD
              text-lg
              font-semibold

              bg-[#F7F2FF]
              text-[#24123B]

              hover:bg-[#EDE9FE]

              dark:bg-white/5
              dark:text-white
              dark:hover:bg-white/10
=======
              transition-all
              duration-200
              hover:scale-105
>>>>>>> Newfrontend-kanak

              disabled:opacity-40
            "
          >
<<<<<<< HEAD
            {key.digit}

            {key.sub && (
              <span className="text-[9px] tracking-wider text-gray-400">
=======
            <span className="text-2xl font-bold text-[#24123B] dark:text-white">
              {key.digit}
            </span>

            {key.sub && (
              <span className="text-[9px] uppercase tracking-widest text-gray-400">
>>>>>>> Newfrontend-kanak
                {key.sub}
              </span>
            )}
          </button>
        ))}
      </div>
<<<<<<< HEAD

      <div className="flex items-center gap-3">
=======
            {/* Action Buttons */}

      <div className="space-y-3">
>>>>>>> Newfrontend-kanak

        <button
          type="button"
          onClick={onCall}
          disabled={!phoneNumber || isActive}
          className="
<<<<<<< HEAD
            flex-1
            h-12
            rounded-full
=======
            w-full
            h-12
            rounded-xl
>>>>>>> Newfrontend-kanak

            bg-emerald-500
            hover:bg-emerald-600

            text-white
<<<<<<< HEAD

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
=======
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
>>>>>>> Newfrontend-kanak
        </button>

        {isActive && (
          <button
            type="button"
            onClick={onEndCall}
            className="
<<<<<<< HEAD
              h-12
              w-12
              rounded-full
=======
              w-full
              h-12
              rounded-xl
>>>>>>> Newfrontend-kanak

              bg-red-500
              hover:bg-red-600

              text-white
<<<<<<< HEAD
            "
          >
            <PhoneOff className="h-5 w-5 mx-auto" />
          </button>
        )}
      </div>

      <div className="text-center">
=======
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
>>>>>>> Newfrontend-kanak

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
<<<<<<< HEAD
          <p className="text-2xl font-bold mt-1 text-[#24123B] dark:text-white">
            {formatCallDuration(durationSeconds)}
          </p>
        )}
      </div>
=======
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
            <QRCodeCanvas
              value={`tel:${phoneNumber}`}
              size={220}
            />
          </div>

          <p className="font-semibold text-[#24123B] dark:text-white">
            {phoneNumber}
          </p>

        </div>

      ) : (

        <div className="py-10 text-center">

          <div className="text-2xl mb-3">
            😕
          </div>

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

>>>>>>> Newfrontend-kanak
    </div>
  );
}