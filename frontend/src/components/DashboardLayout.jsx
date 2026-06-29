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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium text-sm border border-emerald-500/20"
                  >
                    <Building2 size={16} />
                    Department
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-600 transition-colors font-medium text-sm border border-blue-500/20"
                  >
                    <UserPlus size={16} />
                    Employees
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

                <div className="relative" ref={calendarRef}>
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className={`p-2 rounded-full transition-colors ${isCalendarOpen ? "bg-primary/20 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                  >
                    <CalendarIcon size={20} />
                  </button>

                  {/* Calendar Popup */}
                  <AnimatePresence>
                    {isCalendarOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 p-4 bg-background border border-border shadow-2xl rounded-2xl w-72 z-50 origin-top-right"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <button
                            onClick={() =>
                              setCurrentDate(
                                new Date(
                                  currentDate.getFullYear(),
                                  currentDate.getMonth() - 1,
                                  1,
                                ),
                              )
                            }
                            className="p-1 hover:bg-muted rounded-full text-muted-foreground transition-colors"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <div className="font-semibold text-foreground">
                            {monthNames[currentDate.getMonth()]}{" "}
                            {currentDate.getFullYear()}
                          </div>
                          <button
                            onClick={() =>
                              setCurrentDate(
                                new Date(
                                  currentDate.getFullYear(),
                                  currentDate.getMonth() + 1,
                                  1,
                                ),
                              )
                            }
                            className="p-1 hover:bg-muted rounded-full text-muted-foreground transition-colors"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                            (day) => (
                              <div
                                key={day}
                                className="text-center text-xs font-medium text-muted-foreground py-1"
                              >
                                {day}
                              </div>
                            ),
                          )}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: firstDayOfMonth }).map(
                            (_, i) => (
                              <div key={`empty-${i}`} className="p-2" />
                            ),
                          )}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const isToday =
                              new Date().getDate() === i + 1 &&
                              new Date().getMonth() ===
                                currentDate.getMonth() &&
                              new Date().getFullYear() ===
                                currentDate.getFullYear();
                            return (
                              <button
                                key={i + 1}
                                className={`p-2 w-8 h-8 flex items-center justify-center rounded-full text-sm mx-auto transition-all ${
                                  isToday
                                    ? "bg-primary text-white font-bold shadow-md shadow-primary/30"
                                    : "text-foreground hover:bg-muted font-medium"
                                }`}
                              >
                                {i + 1}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Admin Control Panel Profile Icon */}
                <button
                  onClick={() => router.push("/control-panel")}
                  title="Admin Control Panel"
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white font-extrabold flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all border-2 border-indigo-300/40 text-sm"
                >
                  {userInitials}
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-1"
                >
                  {mounted && theme === "dark" ? (
                    <Sun size={20} />
                  ) : (
                    <Moon size={20} />
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 transition-colors font-medium text-sm ml-2 border border-red-500/20"
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
