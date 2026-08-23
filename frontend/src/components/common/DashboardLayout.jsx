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
  User,
  FileText,
  Settings,
  Ticket,
  Menu,
  X,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { DirectoryModal } from "../modals/DirectoryModal";
import { AdminsModal } from "../modals/AdminsModal";
import { NewRequestsModal } from "../modals/NewRequestsModal";
import { MessagesModal } from "../modals/MessagesModal";
import { NotificationsModal } from "../modals/NotificationsModal";
import { ManualEmployeeModal } from "../modals/ManualEmployeeModal";
import { EmployeeDetailsModal } from "../modals/EmployeeDetailsModal";
import { EditProfileRequestsModal } from "../modals/EditProfileRequestsModal";
import { AddDepartmentModal } from "../modals/AddDepartmentModal";
import { UnbuiltDepartmentErrorModal } from "../modals/UnbuiltDepartmentErrorModal";
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
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeRequestsCount, setActiveRequestsCount] = useState(0);
  const [activeNotificationsCount, setActiveNotificationsCount] = useState(0);
  const [activeMessagesCount, setActiveMessagesCount] = useState(0);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
    useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isEditProfileRequestsOpen, setIsEditProfileRequestsOpen] =
    useState(false);
  const [isAdminEditProfileOpen, setIsAdminEditProfileOpen] = useState(false);
  const [adminRecord, setAdminRecord] = useState(null);
  const [pendingProfileReqCount, setPendingProfileReqCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tickets & Department Modal States
  const [activeTicketsCount, setActiveTicketsCount] = useState(0);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [unbuiltDeptModal, setUnbuiltDeptModal] = useState({
    isOpen: false,
    departmentName: "",
  });
  const [customDepartments, setCustomDepartments] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("custom_departments");
      if (saved) setCustomDepartments(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const fetchAdminMe = () => {
    api
      .get("/api/auth/me")
      .then((res) => {
        const u = res.data?.user || res.data;
        if (u) {
          const names = (u.name || "Admin User").split(" ");
          setAdminRecord({
            _id: u.id || "admin_1",
            id: u.id || "admin_1",
            userId: u.id,
            employeeCode: u.employeeCode || "ADMIN",
            personal: {
              firstName: names[0] || "Admin",
              lastName: names.slice(1).join(" ") || "Emp",
              contactEmail: u.email || "admin@novanectar.com",
            },
            work: {
              companyEmail: u.email || "admin@novanectar.com",
              designation: u.designation || "System Administrator",
              department: u.department || "Executive Suite",
              manager: "None",
            },
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAdminMe();

    const fetchCounts = () => {
      const adminId = adminRecord?._id || adminRecord?.id || "ADMIN_ID";

      Promise.all([
        api.get("/api/customerInquiries").catch(() => ({ data: [] })),
        api.get("/api/accountRequests").catch(() => ({ data: [] })),
        api.get("/api/profileChangeRequests").catch(() => ({ data: [] })),
        api
          .get("/api/notifications")
          .catch(() => ({ data: { unreadCount: 0 } })),
        api
          .get(
            `/api/internalChat/unread?userId=${adminId}&code=ADMIN&role=admin`
          )
          .catch(() => ({ data: { unreadCount: 0 } })),
        api.get("/api/emails").catch(() => ({ data: [] })),
        api.get("/api/tickets/unread-count").catch(() => ({ data: { openCount: 0 } })),
      ]).then(([inqRes, accRes, profileRes, notifRes, chatRes, emailRes, ticketRes]) => {
        const inqCount = (inqRes.data || []).filter((i) => !i.isRead).length;
        const accCount = (accRes.data || []).filter(
          (a) => a.status === "pending" && !a.isRead
        ).length;
        const profileCount = (profileRes.data || []).filter(
          (p) => p.status === "pending" && !p.isRead
        ).length;

        setActiveRequestsCount(inqCount + accCount + profileCount);

        setPendingProfileReqCount(
          (profileRes.data || []).filter((p) => p.status === "pending").length
        );

        setActiveNotificationsCount(notifRes.data?.unreadCount || 0);

        const unreadChats = chatRes.data?.unreadCount || 0;

        const unreadEmails = (emailRes.data || []).filter(
          (e) => !e.isRead && (e.direction === "inbound" || !e.direction)
        ).length;

        setActiveMessagesCount(unreadChats + unreadEmails);
        setActiveTicketsCount(ticketRes.data?.openCount || ticketRes.data?.unreadCount || 0);
      });
    };

    fetchCounts();

    const interval = setInterval(fetchCounts, 30000);

    window.addEventListener("messagesRead", fetchCounts);
    window.addEventListener("notificationsRead", fetchCounts);

    return () => {
      clearInterval(interval);
      window.removeEventListener("messagesRead", fetchCounts);
      window.removeEventListener("notificationsRead", fetchCounts);
    };
  }, [
    isNewRequestsOpen,
    isNotificationsOpen,
    isEditProfileRequestsOpen,
    isAdminEditProfileOpen,
    isMessagesOpen,
  ]);

  const getInitials = (str) => {
    if (!str) return "AC";

    const p = str.trim().split(" ");

    return p.length >= 2
      ? `${p[0][0]}${p[p.length - 1][0]}`.toUpperCase()
      : p[0].slice(0, 2).toUpperCase();
  };

  const [displayName, setDisplayName] = useState(
    adminName ? adminName.split(" ")[0] : "Admin"
  );

  const [userInitials, setUserInitials] = useState(getInitials(adminName));

  const calendarRef = useRef(null);
  const dropdownRef = useRef(null);
  const deptDropdownRef = useRef(null);
  const pathname = usePathname();

  const baseDepartments = [
    { name: "Sales", path: "/sales" },
    { name: "Digital Marketing", path: "/digital-marketing" },
  ];

  const departments = [...baseDepartments, ...customDepartments];

  const handleDepartmentClick = (dept) => {
    if (dept.isCustom) {
      setIsDepartmentDropdownOpen(false);
      setUnbuiltDeptModal({ isOpen: true, departmentName: dept.name });
      return;
    }

    if (pathname === dept.path) {
      setToastMessage(`You are already on ${dept.name} Dashboard.`);
      setTimeout(() => setToastMessage(null), 2000);
      setIsDepartmentDropdownOpen(false);
    } else {
      router.push(dept.path);
      setIsDepartmentDropdownOpen(false);
    }
  };

  const handleDepartmentAdded = (newDept) => {
    const updated = [...customDepartments, newDept];
    setCustomDepartments(updated);
    localStorage.setItem("custom_departments", JSON.stringify(updated));
    setToastMessage(`Department "${newDept.name}" added successfully.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const checkRBAC = (role, department, userName) => {
      const r = (role || "").toLowerCase();
      const d = (department || "").toLowerCase();
      const u = (userName || "").toLowerCase();

      if (r === "employee") {
        if (d.includes("sales") || u.includes("sales")) {
          router.replace("/employee/sales");
          return true;
        } else if (d.includes("digital") || u.includes("digital")) {
          router.replace("/employee/digitaldashboard");
          return true;
        } else {
          router.replace("/login");
          return true;
        }
      }

      return false;
    };

    // Check immediate local cache
    const cachedRole = localStorage.getItem("userRole");
    const cachedDept = localStorage.getItem("userDepartment");
    const cachedName = localStorage.getItem("userName");

    if (cachedRole) {
      if (checkRBAC(cachedRole, cachedDept, cachedName)) {
        return;
      }
    }

    const fetchUser = async () => {
      try {
        const { data } = await api.get("/api/auth/me");

        if (data.user?.name) {
          const parts = data.user.name.trim().split(" ");

          setDisplayName(parts[0]);
          setUserInitials(getInitials(data.user.name));

          localStorage.setItem("userName", data.user.name);

          if (data.user.role) {
            localStorage.setItem("userRole", data.user.role);
          }

          if (data.user.department) {
            localStorage.setItem("userDepartment", data.user.department);
          }

          if (data.user.designation) {
            localStorage.setItem("userDesignation", data.user.designation);
          }

          if (data.user.employeeCode) {
            localStorage.setItem("userEmployeeCode", data.user.employeeCode);
          }

          if (data.user.status) {
            localStorage.setItem("userStatus", data.user.status);
          }

          if (data.user.joiningDate) {
            localStorage.setItem("userJoiningDate", data.user.joiningDate);
          }

          checkRBAC(data.user.role, data.user.department, data.user.name);
        }
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };

    const storedName = localStorage.getItem("userName");

    if (storedName) {
      Promise.resolve().then(() => {
        setDisplayName(storedName.trim().split(" ")[0]);
        setUserInitials(getInitials(storedName));
      });
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
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
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
    <div className="admin-light-page flex min-h-screen w-full relative overflow-hidden">
      <div className="flex flex-col w-full min-h-screen z-10">
        {/* Navbar */}
        <nav className="admin-light-navbar sticky top-0 z-50 border-b border-purple-200/40 dark:border-border/50 backdrop-blur-sm">
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
                  <h1 className="text-base sm:text-xl font-bold text-foreground truncate max-w-[140px] sm:max-w-none">
                    <span className="inline md:hidden">Hey! {displayName}</span>
                    <span className="hidden md:inline">Welcome back, {displayName}</span>
                  </h1>

                  <p className="text-[10px] sm:text-xs font-medium text-gradient">
                    Admin Level Access
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-4">
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
                          onClick={() => {
                            setIsDepartmentDropdownOpen(false);
                            setIsAddDepartmentOpen(true);
                          }}
                          className="px-4 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full font-medium flex items-center gap-2 cursor-pointer"
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
                  className="relative w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-600 transition-all border border-amber-500/20 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
                >
                  <ClipboardList size={18} />

                  {activeRequestsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse border border-background">
                      {activeRequestsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsMessagesOpen(true)}
                  title="Messages & Email Box"
                  className="relative w-10 h-10 rounded-full bg-violet-500/10 text-violet-500 hover:bg-violet-500/20 hover:text-violet-600 transition-all border border-violet-500/20 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
                >
                  <MessageSquare size={18} />

                  {activeMessagesCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-violet-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse border border-background">
                      {activeMessagesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsNotificationsOpen(true)}
                  title="Notifications Center"
                  className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 hover:text-pink-600 transition-all border border-pink-500/20 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 relative"
                >
                  <Bell size={18} />

                  {activeNotificationsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-pink-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse border border-background">
                      {activeNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Tickets Icon Button */}
                <button
                  onClick={() => router.push("/tickets")}
                  title="Tickets Module"
                  className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 hover:text-cyan-600 transition-all border border-cyan-500/20 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 relative"
                >
                  <Ticket size={18} />

                  {activeTicketsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-cyan-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse border border-background">
                      {activeTicketsCount}
                    </span>
                  )}
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

              {/* Mobile controls */}
              <div className="flex md:hidden items-center gap-2">
                <button
                  onClick={toggleTheme}
                  title="Light/Dark mode"
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {mounted && theme === "dark" ? (
                    <Sun size={20} />
                  ) : (
                    <Moon size={20} />
                  )}
                </button>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  title="Menu"
                  className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-72 max-w-[80vw] bg-background border-l border-border shadow-2xl p-6 md:hidden flex flex-col overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-purple-500 text-white font-bold flex items-center justify-center text-xs">
                      {userInitials}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground truncate max-w-[140px]">{displayName}</h4>
                      <p className="text-[10px] text-muted-foreground">Admin Access</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 space-y-6">
                  {/* Departments */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Departments</p>
                    <div className="space-y-1.5">
                      {departments.map((dept) => (
                        <button
                          key={dept.name}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleDepartmentClick(dept);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between ${
                            pathname === dept.path
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Building2 size={16} />
                            {dept.name}
                          </span>
                          {pathname === dept.path && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          )}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsAddDepartmentOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-2"
                      >
                        <span>+ Add Department</span>
                      </button>
                    </div>
                  </div>

                  {/* Employees Controls */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Employees</p>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsDirectoryOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-muted text-foreground transition-colors flex items-center gap-2"
                      >
                        <User size={16} className="text-blue-500" />
                        <span>Directory</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsAdminsOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-muted text-foreground transition-colors flex items-center gap-2"
                      >
                        <UserPlus size={16} className="text-indigo-500" />
                        <span>Admins</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsNewRequestsOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-muted text-foreground transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <ClipboardList size={16} className="text-amber-500" />
                          New Requests
                        </span>
                        {activeRequestsCount > 0 && (
                          <span className="bg-rose-500 text-white rounded-full text-[10px] font-bold px-1.5 py-0.5">
                            {activeRequestsCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsManualOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-muted text-foreground transition-colors flex items-center gap-2 border-t border-border/50 pt-2"
                      >
                        <FileText size={16} className="text-teal-500" />
                        <span>Manual</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Quick Actions</p>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMessagesOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-muted text-foreground transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <MessageSquare size={16} className="text-violet-500" />
                          Messages
                        </span>
                        {activeMessagesCount > 0 && (
                          <span className="bg-violet-500 text-white rounded-full text-[10px] font-bold px-1.5 py-0.5 animate-pulse">
                            {activeMessagesCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsNotificationsOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-muted text-foreground transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Bell size={16} className="text-pink-500" />
                          Notifications
                        </span>
                        {activeNotificationsCount > 0 && (
                          <span className="bg-pink-500 text-white rounded-full text-[10px] font-bold px-1.5 py-0.5 animate-pulse">
                            {activeNotificationsCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          router.push("/tickets");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-muted text-foreground transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Ticket size={16} className="text-cyan-500" />
                          Tickets
                        </span>
                        {activeTicketsCount > 0 && (
                          <span className="bg-cyan-500 text-white rounded-full text-[10px] font-bold px-1.5 py-0.5 animate-pulse">
                            {activeTicketsCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          router.push("/control-panel");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-muted text-foreground transition-colors flex items-center gap-2"
                      >
                        <Settings size={16} className="text-indigo-400" />
                        <span>Admin Control Panel</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-auto pt-6 border-t border-border">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-semibold text-sm border border-red-500/20"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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

      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={(target) => {
          if (target === "inquiries" || target === "accounts") {
            setIsNewRequestsOpen(true);
          }

          if (target === "messages") {
            setIsMessagesOpen(true);
          }
        }}
      />

      <ManualEmployeeModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />

      {adminRecord && (
        <EmployeeDetailsModal
          employee={adminRecord}
          isOpen={isAdminEditProfileOpen}
          onClose={() => setIsAdminEditProfileOpen(false)}
          onUpdated={() => fetchAdminMe()}
        />
      )}

      <EditProfileRequestsModal
        isOpen={isEditProfileRequestsOpen}
        onClose={() => setIsEditProfileRequestsOpen(false)}
        onUpdated={() => {}}
      />

      <AddDepartmentModal
        isOpen={isAddDepartmentOpen}
        onClose={() => setIsAddDepartmentOpen(false)}
        onDepartmentAdded={handleDepartmentAdded}
      />

      <UnbuiltDepartmentErrorModal
        isOpen={unbuiltDeptModal.isOpen}
        onClose={() => setUnbuiltDeptModal({ isOpen: false, departmentName: "" })}
        departmentName={unbuiltDeptModal.departmentName}
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