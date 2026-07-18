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

export function NotificationsModal({ isOpen, onClose, onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all"); // "all" | "unread"

  const fetchNotifications = () => {
    Promise.resolve().then(() => setLoading(true));
    api
      .get("/api/notifications")
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
      await api.patch("/api/notifications/read-all");
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
      await api.delete("/api/notifications");
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
        className="bg-background border border-border/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-border/60 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-600 shadow-inner">
              <Bell size={20} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  Notifications Center
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-violet-500 text-white text-xs font-extrabold shadow-sm">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time updates, messages, customer inquiries, and employee activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    title="Mark all as read"
className="px-3 py-1.5 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 text-xs font-semibold flex items-center gap-1.5 transition-all"                  >
                    <CheckCheck size={14} /> Mark All Read
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  title="Clear all notifications"
                  className="p-2 rounded-xl bg-muted text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-all ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-border/60 bg-background flex items-center gap-2">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedFilter === "all"
                ? "bg-violet-500 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setSelectedFilter("unread")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              selectedFilter === "unread"
                ? "bg-violet-500 text-white shadow-sm"
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
              <Loader2 className="animate-spin text-violet-500" size={32} />
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
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 relative group ${
                    n.isRead
                      ? "bg-background border-border/50 opacity-80 hover:opacity-100 hover:border-border"
                      : "bg-violet-500/5 dark:bg-violet-500/10 border-violet-500/30 shadow-sm"
                  }`}
                >
                  {/* Status indicator dot */}
                  {!n.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                  )}
                  {!n.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-violet-500" />
                  )}

                  <div className="p-2.5 rounded-xl bg-muted/60 border border-border/40 shrink-0 mt-0.5">
                    {getCategoryIcon(n.category)}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
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

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2.5">
                      {n.link && (
                        <span className="text-[11px] font-bold text-violet-500 flex items-center gap-1 group-hover:underline">
                          Open {n.link === "inquiries" ? "Customer Inquiries" : n.link === "messages" ? "Correspondence Box" : n.link === "accounts" ? "Account Requests" : "Details"}
                          <ExternalLink size={12} />
                        </span>
                      )}

                      {!n.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(n._id, e)}
                          className="text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Check size={12} /> Mark read
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteNotification(n._id, e)}
                    title="Delete notification"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground absolute bottom-3 right-3"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>Total Notifications: {notifications.length}</span>
          <span>Click any item to open or mark read</span>
        </div>
      </motion.div>
    </div>
  );
}