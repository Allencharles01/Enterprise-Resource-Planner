"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  Moon,
  Sun,
  LogOut,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  MessageSquare,
  Bell,
  ClipboardList,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { DirectoryModal } from "./DirectoryModal";
import { AdminsModal } from "./AdminsModal";
import { NewRequestsModal } from "./NewRequestsModal";
import { ManualEmployeeModal } from "./ManualEmployeeModal";
import { api } from "@/lib/api";

export function DashboardLayout({ children, adminName = "Admin" }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEmployeesDropdownOpen, setIsEmployeesDropdownOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isAdminsOpen, setIsAdminsOpen] = useState(false);
  const [isNewRequestsOpen, setIsNewRequestsOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
    useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const getInitials = (str) => {
    if (!str) return "AC";
    const p = str.trim().split(" ");
    return p.length >= 2
      ? `${p[0][0]}${p[p.length - 1][0]}`.toUpperCase()
      : p[0].slice(0, 2).toUpperCase();
  };
  const [displayName, setDisplayName] = useState(
    adminName ? adminName.split(" ")[0] : "Admin",
  );
  const [userInitials, setUserInitials] = useState(getInitials(adminName));
  const calendarRef = useRef(null);
  const dropdownRef = useRef(null);
  const deptDropdownRef = useRef(null);
  const pathname = usePathname();

  const departments = [
    { name: "Sales", path: "/sales" },
    { name: "Digital Marketing", path: "/digital-marketing" },
  ];

  const handleDepartmentClick = (dept) => {
    if (pathname === dept.path) {
      setToastMessage(`You are already on ${dept.name} Dashboard.`);
      setTimeout(() => setToastMessage(null), 2000);
      setIsDepartmentDropdownOpen(false);
    } else {
      router.push(dept.path);
      setIsDepartmentDropdownOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        if (data.user?.name) {
          const parts = data.user.name.trim().split(" ");
          setDisplayName(parts[0]);
          setUserInitials(getInitials(data.user.name));
          localStorage.setItem("userName", data.user.name);
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };

    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setDisplayName(storedName.trim().split(" ")[0]);
      setUserInitials(getInitials(storedName));
    } else {
      fetchUser();
    }
    // Close calendar on outside click
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsEmployeesDropdownOpen(false);
      }
      if (
        deptDropdownRef.current &&
        !deptDropdownRef.current.contains(event.target)
      ) {
        setIsDepartmentDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen w-full relative overflow-hidden">
      <div className="flex flex-col w-full min-h-screen z-10">
        {/* Navbar */}
        <nav className="glass border-b border-border/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg text-white shadow-md shadow-primary/30 overflow-hidden"
                >
                  <img
                    src="/NovaLogo.jpeg"
                    alt="Nova Logo"
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Welcome back, {displayName}
                  </h1>
                  <p className="text-xs font-medium text-gradient">
                    Admin Level Access
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative" ref={deptDropdownRef}>
                  <button
                    onClick={() =>
                      setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)
                    }
                    title="Department"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors border border-emerald-500/20 cursor-pointer shadow-sm"
                  >
                    <Building2 size={18} />
                    <motion.div
                      animate={{ rotate: isDepartmentDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isDepartmentDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 py-2 bg-background border border-border shadow-2xl rounded-xl w-52 z-50 origin-top-right flex flex-col"
                      >
                        {departments.map((dept) => (
                          <button
                            key={dept.name}
                            onClick={() => handleDepartmentClick(dept)}
                            className="px-4 py-2 text-left text-sm hover:bg-muted text-foreground transition-colors w-full flex items-center justify-between group"
                          >
                            {dept.name}
                            {pathname === dept.path && (
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            )}
                          </button>
                        ))}
                        <div className="h-px bg-border/50 my-1"></div>
                        <button
                          onClick={() => setIsDepartmentDropdownOpen(false)}
                          className="px-4 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full font-medium flex items-center gap-2"
                        >
                          <span className="text-lg leading-none">+</span> Add
                          Dept
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setIsEmployeesDropdownOpen(!isEmployeesDropdownOpen)
                    }
                    title="Employees"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-600 transition-colors border border-blue-500/20 cursor-pointer shadow-sm"
                  >
                    <UserPlus size={18} />
                    <motion.div
                      animate={{ rotate: isEmployeesDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isEmployeesDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 py-2 bg-background border border-border shadow-2xl rounded-xl w-48 z-50 origin-top-right flex flex-col"
                      >
                        <button
                          onClick={() => {
                            setIsDirectoryOpen(true);
                            setIsEmployeesDropdownOpen(false);
                          }}
                          className="px-4 py-2 text-left text-sm hover:bg-muted text-foreground transition-colors"
                        >
                          Directory
                        </button>
                        <button
                          onClick={() => {
                            setIsAdminsOpen(true);
                            setIsEmployeesDropdownOpen(false);
                          }}
                          className="px-4 py-2 text-left text-sm hover:bg-muted text-foreground transition-colors"
                        >
                          Admins
                        </button>
                        <button
                          onClick={() => {
                            setIsNewRequestsOpen(true);
                            setIsEmployeesDropdownOpen(false);
                          }}
                          className="px-4 py-2 text-left text-sm hover:bg-muted text-foreground transition-colors"
                        >
                          New Requests
                        </button>
                        <button
                          onClick={() => {
                            setIsManualOpen(true);
                            setIsEmployeesDropdownOpen(false);
                          }}
                          className="px-4 py-2 text-left text-sm hover:bg-muted text-foreground transition-colors border-t border-border/50 mt-1 pt-2 font-medium"
                        >
                          Manual
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setIsNewRequestsOpen(true)}
                  title="New Requests"
                  className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-600 transition-all border border-amber-500/20 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
                >
                  <ClipboardList size={18} />
                </button>

                <button
                  onClick={() => {
                    setToastMessage("Messages: Function to be defined later");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  title="Messages"
                  className="w-10 h-10 rounded-full bg-violet-500/10 text-violet-500 hover:bg-violet-500/20 hover:text-violet-600 transition-all border border-violet-500/20 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
                >
                  <MessageSquare size={18} />
                </button>

                <button
                  onClick={() => {
                    setToastMessage("Notifications: Function to be defined later");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  title="Notifications"
                  className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 hover:text-pink-600 transition-all border border-pink-500/20 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Bell size={18} />
                </button>

                {/* Hidden Calendar Ref container for DOM safety if ref is attached */}
                <div className="hidden" ref={calendarRef} />

                {/* Admin Control Panel Profile Icon */}
                <button
                  onClick={() => router.push("/control-panel")}
                  title="Admin Control Panel"
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white font-extrabold flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all border-2 border-indigo-300/40 text-sm ml-1 cursor-pointer"
                >
                  {userInitials}
                </button>

                <button
                  onClick={toggleTheme}
                  title="Light/Dark mode"
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-1 cursor-pointer"
                >
                  {mounted && theme === "dark" ? (
                    <Sun size={20} />
                  ) : (
                    <Moon size={20} />
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 transition-colors font-medium text-sm ml-2 border border-red-500/20 cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <DirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
      />
      <AdminsModal
        isOpen={isAdminsOpen}
        onClose={() => setIsAdminsOpen(false)}
      />
      <NewRequestsModal
        isOpen={isNewRequestsOpen}
        onClose={() => setIsNewRequestsOpen(false)}
      />
      <ManualEmployeeModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-6 py-3 rounded-lg shadow-2xl font-medium text-sm z-[100] flex items-center gap-3 border border-border"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
