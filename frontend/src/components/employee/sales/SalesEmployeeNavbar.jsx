"use client";

import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Mail,
  Bell,
  AlarmClock,
  Moon,
  Sun,
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
  X,
  Settings,
  User,
  MessageSquare,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Briefcase,
  UserPlus,
  ShieldAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { MessagesModal } from "@/components/MessagesModal";
import EmployeeRemindersModal from "./EmployeeRemindersModal";
import { EmployeeSelfProfileModal } from "./EmployeeSelfProfileModal";
import { api } from "@/lib/api";

export default function SalesEmployeeNavbar() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [internalChatCount, setInternalChatCount] = useState(0);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [leadMessages, setLeadMessages] = useState([]);
  const [apiNotifications, setApiNotifications] = useState([]);
  const [apiUnreadCount, setApiUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const empCode = localStorage.getItem("userEmployeeCode") || "EMP001";
      const empName = localStorage.getItem("userName") || "Rahul Sharma";

      const res = await api.get(
        `/api/notifications?employeeCode=${empCode}&employeeName=${encodeURIComponent(
          empName
        )}`
      );

      setApiNotifications(res.data?.notifications || []);
      setApiUnreadCount(res.data?.unreadCount || 0);
    } catch (e) {
      console.error("Failed to fetch API notifications:", e);
    }
  };

  const calendarRef = useRef(null);
  const notificationRef = useRef(null);

  const [userInfo, setUserInfo] = useState({
    name: "Rahul Sharma",
    designation: "Senior Sales Executive",
    id: "EMP001",
    status: "Active",
    joiningDate: "June 2026",
  });

  useEffect(() => {
    setMounted(true);
    loadReminders();

    const storedName = localStorage.getItem("userName");
    const storedDesignation = localStorage.getItem("userDesignation");
    const storedId = localStorage.getItem("userEmployeeCode");
    const storedStatus = localStorage.getItem("userStatus");
    const storedJoining = localStorage.getItem("userJoiningDate");

    if (storedName || storedDesignation || storedId) {
      setUserInfo({
        name: storedName || "Employee",
        designation: storedDesignation || "Senior Sales Executive",
        id: storedId || "EMP001",
        status: storedStatus || "Active",
        joiningDate: storedJoining || "June 2026",
      });
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

        const res = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();

          if (data?.user) {
            const uName = data.user.name || storedName || "Employee";
            const uDesig =
              data.user.designation ||
              storedDesignation ||
              "Senior Sales Executive";
            const uId = data.user.employeeCode || storedId || "EMP001";
            const uStatus = data.user.status || storedStatus || "Active";
            const uJoining =
              data.user.joiningDate || storedJoining || "June 2026";

            setUserInfo({
              name: uName,
              designation: uDesig,
              id: uId,
              status: uStatus,
              joiningDate: uJoining,
            });

            localStorage.setItem("userName", uName);
            localStorage.setItem("userDesignation", uDesig);
            localStorage.setItem("userEmployeeCode", uId);
            localStorage.setItem("userStatus", uStatus);
            localStorage.setItem("userJoiningDate", uJoining);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();

    const fetchChatCount = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
        const empCode = localStorage.getItem("userEmployeeCode") || "EMP001";
        const res = await fetch(
          `${apiUrl}/api/internalChat/unread?code=${empCode}`
        );

        if (res.ok) {
          const data = await res.json();
          setInternalChatCount(data?.unreadCount || 0);
        }
      } catch (e) {}
    };

    fetchChatCount();
    fetchNotifications();

    const interval = setInterval(() => {
      fetchChatCount();
      fetchNotifications();
    }, 30000);

    const handleMessagesRead = () => {
      fetchChatCount();
      fetchNotifications();
    };

    window.addEventListener("messagesRead", handleMessagesRead);

    return () => {
      clearInterval(interval);
      window.removeEventListener("messagesRead", handleMessagesRead);
    };
  }, []);

  const loadReminders = () => {
    const storedReminders = JSON.parse(
      localStorage.getItem("employeeReminders") || "[]"
    );

    const formattedReminders = storedReminders.map((reminder, index) => ({
      ...reminder,
      id: reminder.id || `reminder-${index}`,
      type: "reminder",
      isRead: reminder.isRead === true ? true : false,
    }));

    setReminders(formattedReminders);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsNotificationsOpen(false);
        setSelectedNotification(null);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isNotificationsOpen]);

  const unreadReminderCount = reminders.filter(
    (reminder) => reminder.isRead !== true
  ).length;

  const unreadMessageCount = leadMessages.filter(
    (message) => message.isRead !== true
  ).length;

  const unreadNotificationCount = unreadReminderCount + unreadMessageCount + apiUnreadCount;

  const handleNotificationClick = () => {
    loadReminders();
    fetchNotifications();
    setIsNotificationsOpen((prev) => !prev);
  };

  const markReminderAsRead = (reminderId) => {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === reminderId ? { ...reminder, isRead: true } : reminder
    );

    setReminders(updatedReminders);

    localStorage.setItem("employeeReminders", JSON.stringify(updatedReminders));
  };

  const markMessageAsRead = (messageId) => {
    setLeadMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, isRead: true } : message
      )
    );
  };

  const openNotificationDetails = async (notification) => {
    setSelectedNotification(notification);

    if (notification.type === "reminder") {
      markReminderAsRead(notification.id);
    } else if (notification.type === "message") {
      markMessageAsRead(notification.id);
    } else {
      try {
        await api.patch(`/api/notifications/${notification._id}/read`);
        fetchNotifications();
      } catch (err) {
        console.error("Failed to mark API notification as read:", err);
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return "RS";

    const parts = name.trim().split(" ");

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const today = new Date();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <>
      <nav className="sales-employee-light-navbar sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg shadow-sm dark:border-border/50 dark:bg-background/60 dark:shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                title="Go to Home"
                className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg text-white shadow-md shadow-primary/30 overflow-hidden cursor-pointer"
              >
                <img
                  src="/NovaLogo.jpeg"
                  alt="Nova Logo"
                  className="w-full h-full object-cover"
                />
              </Link>

              <div>
                <h1 className="text-xl font-bold text-slate-950 dark:text-foreground">
                  Welcome back, {userInfo.name}
                </h1>

                <p className="text-xs font-medium text-gradient">
                  NovaNectar Services Pvt. Ltd.
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium text-sm dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                <Building2 size={16} />
                Sales Department
              </div>

              {/* Calendar */}
              <div className="relative" ref={calendarRef}>
                <button
                  title="Calendar"
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                  className={`p-2 rounded-full transition ${
                    isCalendarOpen
                      ? "bg-indigo-500/10 text-indigo-500"
                      : "text-slate-500 hover:text-slate-950 hover:bg-slate-100 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-muted"
                  }`}
                >
                  <Calendar size={20} />
                </button>

                {isCalendarOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-700/70 bg-[#070b1a] p-4 shadow-2xl shadow-black/60 z-[120] origin-top-right">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={goToPreviousMonth}
                        className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <h2 className="text-sm font-semibold text-white">
                        {monthNames[month]} {year}
                      </h2>

                      <button
                        onClick={goToNextMonth}
                        className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map((day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-medium text-slate-400 py-1"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-2" />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;

                        const isToday =
                          day === today.getDate() &&
                          month === today.getMonth() &&
                          year === today.getFullYear();

                        const hasReminder = reminders.some((r) => {
                          if (!r.dateTime) return false;

                          const d = new Date(r.dateTime);

                          return (
                            d.getDate() === day &&
                            d.getMonth() === month &&
                            d.getFullYear() === year
                          );
                        });

                        return (
                          <button
                            key={day}
                            className={`relative p-2 w-8 h-8 flex items-center justify-center rounded-full text-sm mx-auto transition-all ${
                              isToday
                                ? "bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/40"
                                : "text-slate-100 hover:bg-slate-800 font-medium"
                            }`}
                          >
                            <span>{day}</span>

                            {hasReminder && (
                              <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <button
                title="Messages"
                onClick={() => setIsMessagesOpen(true)}
                className="relative p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition dark:text-muted-foreground dark:hover:text-blue-400 dark:hover:bg-blue-500/10"
              >
                <Mail size={20} />

                {internalChatCount + unreadMessageCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white flex items-center justify-center animate-pulse shadow-sm">
                    {internalChatCount + unreadMessageCount}
                  </span>
                )}
              </button>

              {/* Reminders */}
              <button
                title="Reminders"
                onClick={() => setIsRemindersOpen(true)}
                className="p-2 rounded-full text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition dark:text-muted-foreground dark:hover:text-amber-400 dark:hover:bg-amber-500/10"
              >
                <AlarmClock size={20} />
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  title="Notifications"
                  onClick={handleNotificationClick}
                  className="relative p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition dark:text-muted-foreground dark:hover:text-rose-400 dark:hover:bg-rose-500/10"
                >
                  <Bell size={20} />

                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white flex items-center justify-center">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-muted"
              >
                {mounted && resolvedTheme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  title="Account Info (Profile Updates)"
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white font-extrabold flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all border-2 border-indigo-300/40 text-sm cursor-pointer"
                >
                  {getInitials(userInfo.name)}
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 py-2 bg-[#111827] border border-slate-700/80 shadow-2xl rounded-xl w-60 z-50 origin-top-right flex flex-col text-slate-100"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-800">
                        <p className="text-xs font-bold text-white truncate">
                          {userInfo.name}
                        </p>

                        <p className="text-[11px] text-blue-400 font-mono mt-0.5">
                          {userInfo.id} • {userInfo.designation}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="px-4 py-3 text-left text-xs font-bold hover:bg-slate-800 text-slate-200 transition-colors flex items-center gap-2.5 cursor-pointer"
                      >
                        <Settings size={15} className="text-purple-400" />
                        <span>Account Info</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition font-medium text-sm border border-red-100 dark:bg-red-500/10 dark:border-red-500/20 dark:hover:bg-red-500/20"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isNotificationsOpen && (
          <EmployeeNotificationsCenterModal
            onClose={() => {
              setIsNotificationsOpen(false);
              setSelectedNotification(null);
            }}
            reminders={reminders}
            setReminders={setReminders}
            leadMessages={leadMessages}
            setLeadMessages={setLeadMessages}
            apiNotifications={apiNotifications}
            setApiNotifications={setApiNotifications}
            setApiUnreadCount={setApiUnreadCount}
            fetchNotifications={fetchNotifications}
            router={router}
          />
        )}
      </AnimatePresence>

      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
      />

      <EmployeeRemindersModal
        isOpen={isRemindersOpen}
        onClose={() => {
          setIsRemindersOpen(false);
          loadReminders();
        }}
      />

      <EmployeeSelfProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userInfo={userInfo}
        onUpdate={(newInfo) => setUserInfo({ ...userInfo, ...newInfo })}
      />
    </>
  );
}

function EmployeeNotificationsCenterModal({
  onClose,
  reminders,
  setReminders,
  leadMessages,
  setLeadMessages,
  apiNotifications,
  setApiNotifications,
  setApiUnreadCount,
  fetchNotifications,
  router,
}) {
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      setLoading(true);

      try {
        await fetchNotifications();
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizeDate = (value) => {
    if (!value) return new Date().toISOString();

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return new Date().toISOString();
    }

    return parsed.toISOString();
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
      case "reminder":
        return <AlarmClock className="text-amber-500" size={16} />;
      default:
        return <AlertCircle className="text-amber-500" size={16} />;
    }
  };

  const normalizedNotifications = [
    ...apiNotifications.map((notification) => ({
      ...notification,
      id: notification._id,
      source: "api",
      category: notification.category || "alert",
      title: notification.title || "Notification",
      message: notification.message || "",
      createdAt: normalizeDate(notification.createdAt),
      isRead: notification.isRead === true,
    })),

    ...reminders.map((reminder) => ({
      id: reminder.id,
      source: "reminder",
      category: "reminder",
      title: reminder.title || "Reminder",
      message: reminder.description || reminder.message || "",
      createdAt: normalizeDate(reminder.dateTime),
      isRead: reminder.isRead === true,
      raw: reminder,
    })),

    ...leadMessages.map((message) => ({
      id: message.id,
      source: "message",
      category: "message",
      title: message.title || "Lead Message",
      message: message.message || message.description || "",
      createdAt: normalizeDate(message.createdAt || message.time),
      isRead: message.isRead === true,
      raw: message,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const unreadCount = normalizedNotifications.filter(
    (notification) => !notification.isRead
  ).length;

  const filteredNotifications = normalizedNotifications.filter(
    (notification) => {
      if (selectedFilter === "unread") return !notification.isRead;
      return true;
    }
  );

  const markNotificationAsRead = async (notification, e) => {
    if (e) e.stopPropagation();
    if (notification.isRead) return;

    if (notification.source === "api") {
      try {
        await api.patch(`/api/notifications/${notification.id}/read`);

        setApiNotifications((prev) =>
          prev.map((item) =>
            item._id === notification.id ? { ...item, isRead: true } : item
          )
        );

        setApiUnreadCount((prev) => Math.max(0, prev - 1));

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("notificationsRead"));
        }
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }

      return;
    }

    if (notification.source === "reminder") {
      const updatedReminders = reminders.map((reminder) =>
        reminder.id === notification.id ? { ...reminder, isRead: true } : reminder
      );

      setReminders(updatedReminders);
      localStorage.setItem("employeeReminders", JSON.stringify(updatedReminders));
      return;
    }

    if (notification.source === "message") {
      setLeadMessages((prev) =>
        prev.map((message) =>
          message.id === notification.id ? { ...message, isRead: true } : message
        )
      );
    }
  };

  const handleNotificationClick = async (notification) => {
    await markNotificationAsRead(notification);

    if (notification.link && router) {
      const targetPath = notification.link.startsWith("/")
        ? notification.link
        : `/${notification.link}`;

      router.push(targetPath);
      onClose();
    }
  };

  const handleMarkAllAsRead = async () => {
    const updatedReminders = reminders.map((reminder) => ({
      ...reminder,
      isRead: true,
    }));

    setReminders(updatedReminders);
    localStorage.setItem("employeeReminders", JSON.stringify(updatedReminders));

    setLeadMessages((prev) =>
      prev.map((message) => ({
        ...message,
        isRead: true,
      }))
    );

    try {
      await api.patch("/api/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all API notifications as read:", err);
    }

    setApiNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );

    setApiUnreadCount(0);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notificationsRead"));
    }
  };

  const handleDeleteNotification = async (notification, e) => {
    if (e) e.stopPropagation();

    if (notification.source === "api") {
      try {
        await api.delete(`/api/notifications/${notification.id}`);
      } catch (err) {
        console.error("Failed to delete notification:", err);
      }

      setApiNotifications((prev) =>
        prev.filter((item) => item._id !== notification.id)
      );

      if (!notification.isRead) {
        setApiUnreadCount((prev) => Math.max(0, prev - 1));
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("notificationsRead"));
      }

      return;
    }

    if (notification.source === "reminder") {
      const updatedReminders = reminders.filter(
        (reminder) => reminder.id !== notification.id
      );

      setReminders(updatedReminders);
      localStorage.setItem("employeeReminders", JSON.stringify(updatedReminders));
      return;
    }

    if (notification.source === "message") {
      setLeadMessages((prev) =>
        prev.filter((message) => message.id !== notification.id)
      );
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?")) {
      return;
    }

    setReminders([]);
    localStorage.setItem("employeeReminders", JSON.stringify([]));
    setLeadMessages([]);

    try {
      await api.delete("/api/notifications");
    } catch (err) {
      console.error("Failed to clear API notifications:", err);
    }

    setApiNotifications([]);
    setApiUnreadCount(0);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notificationsRead"));
    }
  };

  const formatNotificationTime = (createdAt) => {
    const date = new Date(createdAt);

    return `${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} • ${date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })}`;
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-background border border-border/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-border/60 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 shadow-inner">
              <Bell size={20} className="animate-bounce" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  Notifications Center
                </h3>

                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-xs font-extrabold shadow-sm">
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
            {normalizedNotifications.length > 0 && (
              <>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    title="Mark all as read"
                    className="px-3 py-1.5 rounded-xl bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
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
                ? "bg-pink-500 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Notifications ({normalizedNotifications.length})
          </button>

          <button
            onClick={() => setSelectedFilter("unread")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
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
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={`${notification.source}-${notification.id}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 relative group ${
                    notification.isRead
                      ? "bg-background border-border/50 opacity-80 hover:opacity-100 hover:border-border"
                      : "bg-pink-500/5 dark:bg-pink-500/10 border-pink-500/30 shadow-sm"
                  }`}
                >
                  {/* Status indicator dot */}
                  {!notification.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                  )}

                  {!notification.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-pink-500" />
                  )}

                  <div className="p-2.5 rounded-xl bg-muted/60 border border-border/40 shrink-0 mt-0.5">
                    {getCategoryIcon(notification.category)}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {notification.title}
                      </h4>

                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatNotificationTime(notification.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2.5">
                      {notification.link && (
                        <span className="text-[11px] font-bold text-pink-500 flex items-center gap-1 group-hover:underline">
                          Open{" "}
                          {notification.link === "inquiries"
                            ? "Customer Inquiries"
                            : notification.link === "messages"
                            ? "Correspondence Box"
                            : notification.link === "accounts"
                            ? "Account Requests"
                            : "Details"}
                          <ExternalLink size={12} />
                        </span>
                      )}

                      {!notification.isRead && (
                        <button
                          onClick={(e) => markNotificationAsRead(notification, e)}
                          className="text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Check size={12} /> Mark read
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteNotification(notification, e)}
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
          <span>Total Notifications: {normalizedNotifications.length}</span>
          <span>Click any item to open or mark read</span>
        </div>
      </motion.div>
    </div>
  );
}

