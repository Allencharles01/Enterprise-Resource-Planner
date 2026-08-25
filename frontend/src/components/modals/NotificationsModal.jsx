import { useState, useEffect } from "react";
import {
  X,
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Briefcase,
  Mail,
  UserPlus,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export function NotificationsModal({ isOpen, onClose, onNavigate, employeeCode, employeeName }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all"); // "all" | "unread"

  const fetchNotifications = () => {
    Promise.resolve().then(() => setLoading(true));
    const url = employeeCode
      ? `/api/notifications?employeeCode=${employeeCode}&employeeName=${encodeURIComponent(employeeName || "")}`
      : "/api/notifications";
    api
      .get(url)
      .then((res) => {
        Promise.resolve().then(() => {
          setNotifications(res.data?.notifications || []);
          setUnreadCount(res.data?.unreadCount || 0);
          setLoading(false);
        });
      })
      .catch((err) => {
        console.error("Failed to fetch notifications:", err);
        Promise.resolve().then(() => {
          setLoading(false);
        });
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.patch(`/api/notifications/${id}/read`);
      Promise.resolve().then(() => {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        if (typeof window !== "undefined") window.dispatchEvent(new Event("notificationsRead"));
      });
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const url = employeeCode
        ? `/api/notifications/read-all?employeeCode=${employeeCode}&employeeName=${encodeURIComponent(employeeName || "")}`
        : "/api/notifications/read-all";
      await api.patch(url);
      Promise.resolve().then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        if (typeof window !== "undefined") window.dispatchEvent(new Event("notificationsRead"));
      });
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.delete(`/api/notifications/${id}`);
      Promise.resolve().then(() => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        setUnreadCount((prev) => {
          const item = notifications.find((n) => n._id === id);
          return item && !item.isRead ? Math.max(0, prev - 1) : prev;
        });
        if (typeof window !== "undefined") window.dispatchEvent(new Event("notificationsRead"));
      });
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?"))
      return;
    try {
      const url = employeeCode
        ? `/api/notifications?employeeCode=${employeeCode}&employeeName=${encodeURIComponent(employeeName || "")}`
        : "/api/notifications";
      await api.delete(url);
      Promise.resolve().then(() => {
        setNotifications([]);
        setUnreadCount(0);
        if (typeof window !== "undefined") window.dispatchEvent(new Event("notificationsRead"));
      });
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "inquiry":
        return <Briefcase className="text-emerald-500" size={16} />;
      case "message":
        return <Mail className="text-violet-500" size={16} />;
      case "account":
        return <UserPlus className="text-blue-500" size={16} />;
      case "alert":
        return <ShieldAlert className="text-rose-500" size={16} />;
      default:
        return <AlertCircle className="text-amber-500" size={16} />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === "unread") return !n.isRead;
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-background border border-border/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative"
      >
        {/* Absolute Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors z-10 cursor-pointer"
          title="Close (Esc)"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border/60 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 shadow-inner shrink-0">
                <Bell size={20} className="animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground leading-none">
                    Notifications Center
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-extrabold shadow-sm whitespace-nowrap">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 leading-normal">
                  Real-time updates, messages, and employee activity
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {notifications.length > 0 && (
                <>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      title="Mark all as read"
                      className="px-3 py-1.5 rounded-xl bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap"
                    >
                      <CheckCheck size={14} />
                      <span>Mark All Read</span>
                    </button>
                  )}
                  <button
                    onClick={handleClearAll}
                    title="Clear all notifications"
                    className="p-1.5 rounded-xl bg-muted text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all border border-border/40"
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-border/60 bg-background flex items-center gap-2">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
              selectedFilter === "all"
                ? "bg-pink-500 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setSelectedFilter("unread")}
            className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
              selectedFilter === "unread"
                ? "bg-pink-500 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <Loader2 className="animate-spin text-pink-500" size={32} />
              <p className="text-sm font-medium">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground/60">
                <Bell size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  No notifications found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedFilter === "unread"
                    ? "You have read all your notifications!"
                    : "You are all caught up on alerts and updates."}
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {filteredNotifications.map((n) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => {
                    if (!n.isRead) handleMarkAsRead(n._id);
                    if (n.link && onNavigate) {
                      onNavigate(n.link);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative group ${
                    n.isRead
                      ? "bg-background border-border/50 opacity-80 hover:opacity-100 hover:border-border"
                      : "bg-pink-500/5 dark:bg-pink-500/10 border-pink-500/30 shadow-sm"
                  }`}
                >
                  {/* Status indicator dot */}
                  {!n.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                  )}
                  {!n.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-pink-500" />
                  )}

                  <div className="p-2 rounded-xl bg-muted/65 border border-border/40 shrink-0 mt-0.5">
                    {getCategoryIcon(n.category)}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 w-full">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        •{" "}
                        {new Date(n.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      {n.link && (
                        <span className="text-[10px] sm:text-[11px] font-bold text-pink-500 flex items-center gap-1 group-hover:underline">
                          Open {n.link.includes("contacts") ? "Contacts Sync" : n.link === "inquiries" ? "Customer Inquiries" : n.link === "messages" ? "Correspondence Box" : n.link === "accounts" ? "Account Requests" : "Details"}
                          <ExternalLink size={11} />
                        </span>
                      )}

                      {!n.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(n._id, e)}
                          className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        >
                          <Check size={11} /> Mark read
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteNotification(n._id, e)}
                    title="Delete notification"
                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground absolute bottom-2.5 right-2.5"
                  >
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>Total Notifications: {notifications.length}</span>
          <span>Click any item to open or mark read</span>
        </div>
      </motion.div>
    </div>
  );
}
