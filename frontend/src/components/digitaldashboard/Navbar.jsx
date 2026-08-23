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
  Ticket,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { MessagesModal } from "@/components/MessagesModal";
import EmployeeRemindersModal from "@/components/employee/sales/EmployeeRemindersModal";
import { EmployeeSelfProfileModal } from "@/components/EmployeeSelfProfileModal";
import { api } from "@/lib/api";
import { NotificationsModal } from "../modals/NotificationsModal";
import CSVPreviewModal from "@/components/digitaldashboard/modals/CSVPreviewModal";

export default function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

const toggleTheme = () =>
  setTheme(theme === "dark" ? "light" : "dark");

  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [internalChatCount, setInternalChatCount] = useState(0);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isCSVPreviewOpen, setIsCSVPreviewOpen] = useState(false);

  const [leadMessages, setLeadMessages] = useState([]);
  const [apiNotifications, setApiNotifications] = useState([]);
  const [apiUnreadCount, setApiUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const empCode = localStorage.getItem("userEmployeeCode") || "EMP002";
      const empName = localStorage.getItem("userName") || "Digital Employee";
      const res = await api.get(`/api/notifications?employeeCode=${empCode}&employeeName=${encodeURIComponent(empName)}`);
      setApiNotifications(res.data?.notifications || []);
      setApiUnreadCount(res.data?.unreadCount || 0);
    } catch (e) {
      console.error("Failed to fetch API notifications:", e);
    }
  };

  const calendarRef = useRef(null);
  const notificationRef = useRef(null);

  const [userInfo, setUserInfo] = useState({
    name: "Digital Employee",
    designation: "Digital Marketing Specialist",
    id: "EMP002",
    status: "Active",
    joiningDate: "June 2026",
  });

  useEffect(() => {
    loadReminders();

    const storedName = localStorage.getItem("userName");
    const storedDesignation = localStorage.getItem("userDesignation");
    const storedId = localStorage.getItem("userEmployeeCode");
    const storedStatus = localStorage.getItem("userStatus");
    const storedJoining = localStorage.getItem("userJoiningDate");

    if (storedName || storedDesignation || storedId) {
      setUserInfo({
        name: storedName || "Employee",
        designation: storedDesignation || "Digital Marketing Specialist",
        id: storedId || "EMP002",
        status: storedStatus || "Active",
        joiningDate: storedJoining || "June 2026",
      });
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            const uName = data.user.name || storedName || "Employee";
            const uDesig = data.user.designation || storedDesignation || "Digital Marketing Specialist";
            const uId = data.user.employeeCode || storedId || "EMP002";
            const uStatus = data.user.status || storedStatus || "Active";
            const uJoining = data.user.joiningDate || storedJoining || "June 2026";

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
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
        const empCode = localStorage.getItem("userEmployeeCode") || "EMP002";
        const res = await fetch(`${apiUrl}/api/internalChat/unread?code=${empCode}`);
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
      localStorage.getItem("employeeReminders") || "[]",
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
    (reminder) => reminder.isRead !== true,
  ).length;

  const unreadMessageCount = leadMessages.filter(
    (message) => message.isRead !== true,
  ).length;

  const unreadNotificationCount = unreadReminderCount + apiUnreadCount;

  const handleNotificationClick = () => {
    loadReminders();
    fetchNotifications();
    setIsNotificationsOpen((prev) => !prev);
  };

  const markReminderAsRead = (reminderId) => {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === reminderId ? { ...reminder, isRead: true } : reminder,
    );

    setReminders(updatedReminders);

    localStorage.setItem(
      "employeeReminders",
      JSON.stringify(updatedReminders),
    );
  };

  const markMessageAsRead = (messageId) => {
    setLeadMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, isRead: true } : message,
      ),
    );
  };

  const openNotificationDetails = async (notification) => {
  // 👇 This will print the complete notification object in the browser console
  console.log("Notification Clicked:", notification);

  setSelectedNotification(notification);

  // Open CSV Preview if admin sends a sheet
  if (
    notification.title?.toLowerCase().includes("sheet") ||
    notification.message?.toLowerCase().includes("sheet") ||
    notification.message?.toLowerCase().includes("csv")
  ) {
    setIsNotificationsOpen(false);
    setIsCSVPreviewOpen(true);
    return;
  }

  // Existing functionality
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
    if (!name) return "DM";

    const parts = name.trim().split(" ");

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/login");
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
      <nav className="sales-employee-light-navbar sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg shadow-sm dark:border-border/50 dark:bg-[#050816]/90 dark:shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <Link
                href="/employee/digitaldashboard"
                className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg text-white shadow-md shadow-primary/30 overflow-hidden"
              >
                <img
                  src="/digitaldashboard-company-logo.png"
                  alt="Nova Logo"
                  className="w-full h-full object-cover"
                />
              </Link>

              <div>
                <h1 className="text-base sm:text-xl font-bold text-slate-950 dark:text-foreground truncate max-w-[140px] sm:max-w-none">
                  <span className="inline md:hidden">Hey! {userInfo.name}</span>
                  <span className="hidden md:inline">Welcome back, {userInfo.name}</span>
                </h1>

                <p className="text-[10px] sm:text-xs font-medium text-gradient">
                  NovaNectar Services Pvt. Ltd.
                </p>
              </div>
            </div>

            {/* Right side (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 font-medium text-sm dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20">
                <Building2 size={16} />
                Digital Marketing
              </div>

              <button
                onClick={() => router.push("/employee/raise-ticket")}
                title="Raise a Ticket"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold text-xs hover:bg-cyan-500/20 transition cursor-pointer shadow-sm"
              >
                <Ticket size={16} />
                <span>Raise Ticket</span>
              </button>

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
                {theme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
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
                        <p className="text-xs font-bold text-white truncate">{userInfo.name}</p>
                        <p className="text-[11px] text-blue-400 font-mono mt-0.5">{userInfo.id} • {userInfo.designation}</p>
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

            {/* Right side (Mobile) */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-muted cursor-pointer"
              >
                {theme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-muted cursor-pointer"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-45 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 max-w-[80vw] bg-white dark:bg-background border-l border-slate-200/70 dark:border-border shadow-2xl p-6 md:hidden flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/70 dark:border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-purple-500 text-white font-bold flex items-center justify-center text-xs">
                    {getInitials(userInfo.name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-950 dark:text-foreground truncate max-w-[140px]">{userInfo.name}</h4>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{userInfo.designation}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-muted text-muted-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Department Info */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 font-semibold text-xs justify-center">
                  <Building2 size={16} />
                  Digital Marketing
                </div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/employee/raise-ticket");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-semibold text-xs justify-center hover:bg-cyan-500/20 transition cursor-pointer"
                >
                  <Ticket size={16} />
                  <span>Raise Ticket</span>
                </button>
              </div>

              {/* Navigation Sections */}
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Workspace & Tasks</p>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsCalendarOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-muted text-slate-900 dark:text-foreground transition-colors flex items-center gap-2"
                    >
                      <Calendar size={16} className="text-indigo-500" />
                      <span>Calendar</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMessagesOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-muted text-slate-900 dark:text-foreground transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Mail size={16} className="text-blue-500" />
                        Messages
                      </span>
                      {internalChatCount + unreadMessageCount > 0 && (
                        <span className="bg-blue-500 text-white rounded-full text-[10px] font-bold px-1.5 py-0.5 animate-pulse">
                          {internalChatCount + unreadMessageCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsRemindersOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-muted text-slate-900 dark:text-foreground transition-colors flex items-center gap-2"
                    >
                      <AlarmClock size={16} className="text-amber-500" />
                      <span>Reminders</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleNotificationClick();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-muted text-slate-900 dark:text-foreground transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Bell size={16} className="text-rose-500" />
                        Notifications
                      </span>
                      {unreadNotificationCount > 0 && (
                        <span className="bg-rose-500 text-white rounded-full text-[10px] font-bold px-1.5 py-0.5">
                          {unreadNotificationCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-slate-100 dark:hover:bg-muted text-slate-900 dark:text-foreground transition-colors flex items-center gap-2"
                    >
                      <Settings size={16} className="text-purple-500" />
                      <span>Account Info</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="mt-auto pt-6 border-t border-slate-200/70 dark:border-border">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-semibold text-sm border border-red-100 dark:bg-red-500/10 dark:border-red-500/20"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile View Calendar Modal */}
      <AnimatePresence>
        {isCalendarOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setIsCalendarOpen(false)}>
            <div className="w-72 rounded-2xl border border-slate-700/70 bg-[#070b1a] p-4 shadow-2xl shadow-black/60 z-[160]" onClick={(e) => e.stopPropagation()}>
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
              <button onClick={() => setIsCalendarOpen(false)} className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-50 text-white rounded-xl text-xs font-bold transition-all">Close Calendar</button>
            </div>
          </div>
        )}
      </AnimatePresence>


      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => {
          setIsNotificationsOpen(false);
          fetchNotifications();
        }}
        onNavigate={(path) => router.push(path)}
        employeeCode={(typeof window !== "undefined" ? localStorage.getItem("userEmployeeCode") : null) || userInfo.id}
        employeeName={(typeof window !== "undefined" ? localStorage.getItem("userName") : null) || userInfo.name}
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
      <CSVPreviewModal
  open={isCSVPreviewOpen}
  onClose={() => setIsCSVPreviewOpen(false)}
  fileName={selectedNotification?.fileName || "Employee_Leads_July_2026.csv"}
  uploadedBy={selectedNotification?.uploadedBy || "Admin"}
  rows={selectedNotification?.rows}
/>
    </>
  );
}
