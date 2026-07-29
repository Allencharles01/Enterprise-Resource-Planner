"use client";

import { Bell, CheckCircle2, Clock, Phone, X } from "lucide-react";

export default function NotificationModal({
  open,
  onClose,
  notifications = [],
  onMarkAsRead,
  onClearAll,
}) {
  if (!open) return null;

  const getIcon = (type) => {
    switch (type) {
      case "call":
        return <Phone size={18} className="text-violet-600" />;

      case "followup":
        return <Clock size={18} className="text-orange-500" />;

      case "success":
        return <CheckCircle2 size={18} className="text-green-600" />;

      default:
        return <Bell size={18} className="text-violet-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="
          w-full
          max-w-xl
          rounded-2xl
          bg-white
          dark:bg-[#161622]
          shadow-2xl
          border
          border-violet-100
          dark:border-white/10
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-violet-100 dark:border-white/10 p-5">
          <div className="flex items-center gap-2">
            <Bell className="text-violet-600" size={22} />
            <h2 className="text-lg font-semibold text-[#24123B] dark:text-white">
              Notifications
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-violet-100 dark:hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[450px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell
                size={40}
                className="mx-auto mb-3 text-violet-300"
              />

              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                No Notifications
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                You're all caught up.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  flex
                  items-start
                  gap-4
                  p-4
                  border-b
                  border-violet-100
                  dark:border-white/5
                  transition
                  ${
                    notification.read
                      ? ""
                      : "bg-violet-50 dark:bg-violet-500/10"
                  }
                `}
              >
                <div className="mt-1">
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-[#24123B] dark:text-white">
                    {notification.title}
                  </h4>

                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {notification.time}
                  </p>
                </div>

                {!notification.read && (
                  <button
                    onClick={() =>
                      onMarkAsRead?.(notification.id)
                    }
                    className="
                      rounded-lg
                      border
                      border-violet-300
                      px-3
                      py-1
                      text-xs
                      hover:bg-violet-100
                      dark:border-white/10
                      dark:hover:bg-white/5
                    "
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-violet-100 dark:border-white/10 p-5">
          <button
            onClick={onClearAll}
            className="
              rounded-xl
              border
              border-red-300
              px-4
              py-2
              text-red-600
              hover:bg-red-50
              dark:border-red-700
              dark:hover:bg-red-500/10
            "
          >
            Clear All
          </button>

          <button
            onClick={onClose}
            className="
              rounded-xl
              bg-violet-600
              px-5
              py-2
              text-white
              hover:bg-violet-700
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}