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

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
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

  const unreadNotificationCount = unreadReminderCount + apiUnreadCount;

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
                href="/employee/sales"
                className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg text-white shadow-md shadow-primary/30 overflow-hidden"
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

                {isNotificationsOpen && (
  <div className="notification-modal-card absolute right-0 top-full z-[120] mt-4 w-[390px] overflow-hidden rounded-2xl">
    <div className="notification-modal-header flex items-start justify-between px-5 py-4">
      <div>
        <h2 className="notification-title text-lg font-bold">
          Notifications
        </h2>

        <p className="notification-subtitle text-xs">
          Unread reminders and lead messages
        </p>
      </div>

      <button
        onClick={() => {
          setIsNotificationsOpen(false);
          setSelectedNotification(null);
        }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition hover:scale-105 hover:bg-red-400 active:scale-95"
      >
        <X size={20} />
      </button>
    </div>

    <div className="notification-modal-body max-h-[360px] space-y-3 overflow-y-auto p-4">
      {reminders.length === 0 &&
        leadMessages.length === 0 &&
        apiNotifications.length === 0 && (
          <p className="notification-subtitle text-sm">
            No notifications yet.
          </p>
        )}

      {reminders.map((reminder) => (
        <button
          key={reminder.id}
          onClick={() => openNotificationDetails(reminder)}
          className={`notification-card w-full rounded-xl px-4 py-3 text-left transition ${
            reminder.isRead ? "opacity-70" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <AlarmClock size={18} className="notification-icon-box mt-1" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="notification-card-title text-sm font-bold">
                  {reminder.title}
                </h3>

                {!reminder.isRead && (
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                )}
              </div>

              <p className="notification-card-description mt-1 line-clamp-2 text-sm">
                {reminder.description}
              </p>

              <p className="notification-card-date mt-2 text-xs font-semibold">
                {reminder.dateTime}
              </p>
            </div>
          </div>
        </button>
      ))}

      {leadMessages.map((message) => (
        <button
          key={message.id}
          onClick={() => openNotificationDetails(message)}
          className={`notification-card w-full rounded-xl px-4 py-3 text-left transition ${
            message.isRead ? "opacity-70" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <Mail size={18} className="notification-icon-box mt-1" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="notification-card-title text-sm font-bold">
                  {message.title}
                </h3>

                {!message.isRead && (
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                )}
              </div>

              <p className="notification-card-description mt-1 line-clamp-2 text-sm">
                {message.message}
              </p>

              <p className="notification-card-date mt-2 text-xs font-semibold">
                {message.time}
              </p>
            </div>
          </div>
        </button>
      ))}

      {apiNotifications.map((notif) => (
        <button
          key={notif._id}
          onClick={() => openNotificationDetails(notif)}
          className={`notification-card w-full rounded-xl px-4 py-3 text-left transition ${
            notif.isRead ? "opacity-70" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <Bell size={18} className="notification-icon-box mt-1" />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="notification-card-title text-sm font-bold">
                  {notif.title}
                </h3>

                {!notif.isRead && (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                )}
              </div>

              <p className="notification-card-description mt-1 line-clamp-2 text-sm">
                {notif.message}
              </p>

              <p className="notification-card-date mt-2 text-xs font-semibold">
                {new Date(notif.createdAt).toLocaleDateString()}{" "}
                {new Date(notif.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </button>
      ))}

      {selectedNotification && (
        <div className="notification-card mt-4 rounded-xl p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="notification-card-title text-sm font-bold">
                {selectedNotification.title}
              </h3>

              <p className="notification-card-description mt-2 text-sm leading-6">
                {selectedNotification.message ||
                  selectedNotification.description}
              </p>

              <p className="notification-card-date mt-3 text-xs font-semibold">
                {selectedNotification.time || selectedNotification.dateTime}
              </p>
            </div>

            <button
              onClick={() => setSelectedNotification(null)}
              className="notification-subtitle transition hover:text-[#260b45] dark:hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}
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