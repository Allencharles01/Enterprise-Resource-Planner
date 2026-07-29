"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  Command,
  Loader2,
  Building2,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  User,
  Phone,
  FileText,
  Calendar,
  DollarSign,
  Upload,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Briefcase,
  Clock,
  Zap,
  Trash2,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { formatAmount } from "@/lib/formatAmount";

// Custom WOW Interactive Calendar Picker Component
function CustomDatePicker({ selectedDate, onSelectDate, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) {
      const parts = selectedDate.split("-");
      if (parts.length === 3) {
        return new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
      }
    }
    return new Date(2026, 6, 1); // July 2026 default
  });

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

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day, e) => {
    e.stopPropagation();
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    onSelectDate(`${year}-${formattedMonth}-${formattedDay}`);
    onClose();
  };

  const handlePreset = (daysToAdd, e) => {
    e.stopPropagation();
    const d = new Date(2026, 6, 8); // Anchor reference date or today
    d.setDate(d.getDate() + daysToAdd);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    onSelectDate(`${y}-${m}-${day}`);
    onClose();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    return selectedDate === `${year}-${formattedMonth}-${formattedDay}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-full right-0 mb-3 z-50 w-[330px] bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-5 shadow-[0_0_50px_-10px_rgba(16,185,129,0.45)] backdrop-blur-2xl"
    >
      {/* Glowing Top bar decoration */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-t-2xl" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 mt-1.5">
        <div className="flex items-center gap-2 font-bold text-white tracking-wide text-base">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Calendar size={16} />
          </div>
          <span>
            {monthNames[month]} {year}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {dayNames.map((d, i) => (
          <span
            key={i}
            className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider py-1"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-9" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const selected = isSelected(day);
          return (
            <button
              key={day}
              type="button"
              onClick={(e) => handleDateClick(day, e)}
              className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                selected
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/40 scale-110 ring-2 ring-emerald-300/50 z-10"
                  : "text-slate-200 hover:bg-slate-800 hover:text-emerald-400 border border-transparent hover:border-emerald-500/30"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Quick Preset Pills */}
      <div className="border-t border-slate-800/80 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles size={12} className="text-emerald-400 animate-pulse" /> Quick
          Timeline Presets
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={(e) => handlePreset(14, e)}
            className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 border border-slate-700/80 hover:border-emerald-500/50 text-[11px] font-semibold text-slate-300 hover:text-emerald-300 transition-all flex items-center justify-center gap-1.5"
          >
            <Zap size={12} className="text-amber-400" /> +2 Weeks
          </button>
          <button
            type="button"
            onClick={(e) => handlePreset(30, e)}
            className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 border border-slate-700/80 hover:border-emerald-500/50 text-[11px] font-semibold text-slate-300 hover:text-emerald-300 transition-all flex items-center justify-center gap-1.5"
          >
            <Clock size={12} className="text-blue-400" /> +1 Month
          </button>
          <button
            type="button"
            onClick={(e) => handlePreset(90, e)}
            className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 border border-slate-700/80 hover:border-emerald-500/50 text-[11px] font-semibold text-slate-300 hover:text-emerald-300 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles size={12} className="text-purple-400" /> +3 Months
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectDate("");
              onClose();
            }}
            className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 border border-slate-700/80 hover:border-red-500/50 text-[11px] font-semibold text-slate-300 hover:text-red-300 transition-all flex items-center justify-center gap-1.5"
          >
            <Trash2 size={12} className="text-red-400" /> Clear
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [loginType, setLoginType] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Customer Modal state
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerSubmitted, setCustomerSubmitted] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phoneCountryCode: "+1",
    phoneNumber: "",
    email: "",
    altPhoneCountryCode: "+1",
    altPhoneNumber: "",
    altEmail: "",
    projectName: "",
    projectDetails: "",
    file: null,
    budgetRange: "",
    currency: "USD ($)",
    deadline: "",
  });

  // Forgot Password Modal state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotForm, setForgotForm] = useState({
    username: "",
    email: "",
  });

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showCustomerModal) {
          if (showDatePicker) {
            setShowDatePicker(false);
          } else {
            setShowCustomerModal(false);
          }
        }
        if (showForgotPasswordModal) setShowForgotPasswordModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCustomerModal, showForgotPasswordModal, showDatePicker]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";
      const payload =
        loginType === "admin"
          ? { adminId, password, isAdmin: true }
          : { username: username.trim(), password };
      const response = await axios.post(`${apiUrl}/api/auth/login`, payload);
      setMessage("Login successful! Redirecting...");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.user.name);
      localStorage.setItem("userRole", response.data.user.role);
      localStorage.setItem(
        "userDepartment",
        response.data.user.department || ""
      );
      localStorage.setItem(
        "userDesignation",
        response.data.user.designation || ""
      );
      localStorage.setItem(
        "userEmployeeCode",
        response.data.user.employeeCode || ""
      );
      localStorage.setItem(
        "userStatus",
        response.data.user.status || ""
      );
      localStorage.setItem(
        "userJoiningDate",
        response.data.user.joiningDate || ""
      );
      sessionStorage.setItem("active_session", "true");
      console.log("Token and user details saved");
      // Redirect to dashboard based on role & department
      setTimeout(() => {
        const dept = (response.data.user.department || "").toLowerCase();
        const uname = (username || "").toLowerCase();
        if (
          loginType === "employee" &&
          (dept.includes("sales") || uname.includes("sales"))
        ) {
          router.push("/employee/sales");
        } else if (
          loginType === "employee" &&
          (dept.includes("digital") || uname.includes("digital"))
        ) {
          router.push("/employee/digitaldashboard");
        } else {
          router.push("/");
        }
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "An error occurred during login. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [customerSubmitting, setCustomerSubmitting] = useState(false);

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setCustomerSubmitting(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";
      let fileData = "";
      let fileName = "";
      if (customerForm.file) {
        fileName = customerForm.file.name;
        const reader = new FileReader();
        fileData = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => resolve("");
          reader.readAsDataURL(customerForm.file);
        });
      }
      await axios.post(`${apiUrl}/api/customerInquiries`, {
        ...customerForm,
        fileName,
        fileData,
      });
      setCustomerSubmitted(true);
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
      setCustomerSubmitted(true);
    } finally {
      setCustomerSubmitting(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSubmitted(true);
  };

  const formatDeadlineDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const d = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2]),
      );
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    return dateStr;
  };

  return (
    <div className="flex min-h-screen w-full bg-transparent relative overflow-hidden">
      <div className="flex w-full max-w-6xl mx-auto z-10 p-4 items-center justify-center lg:justify-between gap-12">
        {/* Left branding section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col justify-center w-1/2"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 shrink-0 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 overflow-hidden">
              <img
                src="/NovaLogo.jpeg"
                alt="Nova Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold tracking-tight whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
              NovaNectar Pvt Ltd
            </h1>
          </div>

          <h2 className="text-4xl lg:text-4xl font-bold text-foreground mb-4 leading-snug">
            Enterprise resource planning
          </h2>

          <h3 className="text-3xl font-bold tracking-tight mb-6">
            Manage your{" "}
            <span className="text-gradient">business effortlessly.</span>
          </h3>

          <p className="text-lg text-muted-foreground max-w-lg">
            The next-generation enterprise resource planning platform designed
            for speed, scale, and simplicity.
          </p>

          {/* Violet/Indigo Customer Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setCustomerSubmitted(false);
              setShowCustomerModal(true);
            }}
            type="button"
            className="mt-8 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold px-7 py-4 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-3 w-fit border border-violet-400/40 cursor-pointer group"
          >
            <span className="tracking-wide">Are you a Customer? Click here</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </motion.button>
        </motion.div>

        {/* Right login form section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

            <div className="flex items-start justify-between mb-8 lg:hidden">
              <div className="flex-1">
                <div className="w-16 h-16 shrink-0 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30 overflow-hidden">
                  <img
                    src="/NovaLogo.jpeg"
                    alt="Nova Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Welcome Back
                </h2>
                <p className="text-muted-foreground mt-2">
                  Sign in to your account
                </p>
              </div>

              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="relative inline-flex items-center h-9 w-16 rounded-full bg-muted/80 p-1 transition-colors duration-300 border border-border/80 focus:outline-none hover:border-primary/40 shadow-inner shrink-0 cursor-pointer"
                  title={`Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} mode`}
                >
                  <div className="absolute inset-0 flex items-center justify-between px-2.5 text-xs pointer-events-none">
                    <Sun size={13} className="text-amber-500/70" />
                    <Moon size={13} className="text-indigo-400/70" />
                  </div>
                  <span
                    className={`relative z-10 inline-flex items-center justify-center h-7 w-7 rounded-full bg-background shadow-md transition-transform duration-300 transform ${
                      resolvedTheme === "dark"
                        ? "translate-x-7 bg-slate-900 text-indigo-400"
                        : "translate-x-0 bg-white text-amber-500"
                    }`}
                  >
                    {resolvedTheme === "dark" ? (
                      <Moon size={14} className="text-indigo-400" />
                    ) : (
                      <Sun size={14} className="text-amber-500" />
                    )}
                  </span>
                </button>
              )}
            </div>

            <div className="hidden lg:flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Welcome Back
                </h2>
                <p className="text-muted-foreground mt-2">
                  Please sign in to your workspace
                </p>
              </div>

              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="relative inline-flex items-center h-9 w-16 rounded-full bg-muted/80 p-1 transition-colors duration-300 border border-border/80 focus:outline-none hover:border-primary/40 shadow-inner shrink-0 cursor-pointer"
                  title={`Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} mode`}
                >
                  <div className="absolute inset-0 flex items-center justify-between px-2.5 text-xs pointer-events-none">
                    <Sun size={13} className="text-amber-500/70" />
                    <Moon size={13} className="text-indigo-400/70" />
                  </div>
                  <span
                    className={`relative z-10 inline-flex items-center justify-center h-7 w-7 rounded-full bg-background shadow-md transition-transform duration-300 transform ${
                      resolvedTheme === "dark"
                        ? "translate-x-7 bg-slate-900 text-indigo-400"
                        : "translate-x-0 bg-white text-amber-500"
                    }`}
                  >
                    {resolvedTheme === "dark" ? (
                      <Moon size={14} className="text-indigo-400" />
                    ) : (
                      <Sun size={14} className="text-amber-500" />
                    )}
                  </span>
                </button>
              )}
            </div>

            {/* Role Toggle */}
            <div className="flex bg-muted/50 p-1 rounded-xl mb-6 border border-border/50">
              <button
                type="button"
                onClick={() => setLoginType("employee")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  loginType === "employee"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setLoginType("admin")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  loginType === "admin"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginType === "employee" ? (
                <div className="space-y-1.5 animate-in fade-in duration-300">
                  <label className="text-sm font-medium text-foreground">
                    Username
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-muted-foreground text-foreground disabled:opacity-50"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <label className="text-sm font-medium text-foreground">
                    Login ID
                  </label>
                  <div className="relative">
                    <Command
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <input
                      type="text"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-muted-foreground text-foreground disabled:opacity-50"
                      placeholder="Admin Login ID"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSubmitted(false);
                      setShowForgotPasswordModal(true);
                    }}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-10 py-2.5 outline-none transition-all placeholder:text-muted-foreground text-foreground disabled:opacity-50"
                    placeholder="••••••••"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-medium text-red-500 bg-red-500/10 p-3 rounded-md border border-red-500/20 text-center"
                >
                  {error}
                </motion.div>
              )}

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-medium text-green-500 bg-green-500/10 p-3 rounded-md border border-green-500/20 text-center"
                >
                  {message}
                </motion.div>
              )}

              <motion.button
                whileHover={!isLoading ? { scale: 1.01 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors mt-4 shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:underline font-medium"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </form>

            {/* Customer Button visible on mobile screens */}
            <div className="pt-4 mt-4 border-t border-border/40 text-center lg:hidden">
              <button
                type="button"
                onClick={() => {
                  setCustomerSubmitted(false);
                  setShowCustomerModal(true);
                }}
                className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 text-sm border border-violet-400/40"
              >
                <span>Are you a Customer? Click here</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* WOW Customer Modal Pop up */}
      <AnimatePresence>
        {showCustomerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (showDatePicker) setShowDatePicker(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/80 rounded-3xl shadow-[0_0_80px_-15px_rgba(16,185,129,0.3)] w-full max-w-3xl max-h-[92vh] overflow-y-auto relative p-6 md:p-10 text-slate-100"
            >
              {/* Top Gradient Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 rounded-t-3xl" />

              {/* Header & Red Circle X button */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-6 mb-8 mt-1">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      Customer Inquiry Form
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Tell us about your project and we&apos;ll connect with you soon.
                    </p>
                  </div>
                </div>

                {/* Red Circle X Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="w-11 h-11 rounded-full bg-red-500/15 border-2 border-red-500/60 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-500/20 shrink-0 cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={22} className="stroke-[3]" />
                </motion.button>
              </div>

              {customerSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-7 max-w-xl mx-auto"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 ring-8 ring-emerald-500/10 animate-bounce">
                    <CheckCircle2 size={44} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white tracking-tight">
                    Inquiry Received!
                  </h3>
                  <div className="text-slate-300 text-base leading-relaxed bg-slate-800/60 p-6 rounded-2xl border border-emerald-500/30 shadow-inner space-y-3">
                    <p>
                      Your project inquiry has been sent to our Internal Department for
                      review. We&apos;ll reach out to you via your registered phone
                      number or email address shortly.
                    </p>
                    <p className="text-sm text-emerald-400 font-semibold flex items-center justify-center gap-2 border-t border-slate-700/60 pt-3">
                      <Sparkles size={16} /> A copy of this form has been sent to your primary Email ID ({customerForm.email}).
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowCustomerModal(false)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold px-10 py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                  >
                    Close Window
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleCustomerSubmit} className="space-y-8">
                  {/* Personal Info Section */}
                  <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800 space-y-5">
                    <div className="flex items-center gap-3 border-b border-slate-700/60 pb-3.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <User size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-wide">
                          Personal Info Section
                        </h3>
                        <p className="text-xs text-slate-400">
                          Primary and alternate contact details
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                          <span>Name</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customerForm.name}
                          onChange={(e) =>
                            setCustomerForm({ ...customerForm, name: e.target.value })
                          }
                          className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-slate-500 shadow-inner"
                          placeholder="Your full name"
                        />
                      </div>

                      {/* Phone Number with Country Code */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                          <span>Phone Number</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={customerForm.phoneCountryCode}
                            onChange={(e) =>
                              setCustomerForm({
                                ...customerForm,
                                phoneCountryCode: e.target.value,
                              })
                            }
                            className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-3 text-sm text-white transition-all outline-none shrink-0 font-bold"
                          >
                            <option value="+1">+1 (USA/CA)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+91">+91 (India)</option>
                            <option value="+61">+61 (AUS)</option>
                            <option value="+81">+81 (Japan)</option>
                            <option value="+49">+49 (Germany)</option>
                            <option value="+33">+33 (France)</option>
                            <option value="+86">+86 (China)</option>
                            <option value="+971">+971 (UAE)</option>
                            <option value="+65">+65 (Singapore)</option>
                          </select>
                          <input
                            type="tel"
                            required
                            value={customerForm.phoneNumber}
                            onChange={(e) =>
                              setCustomerForm({
                                ...customerForm,
                                phoneNumber: e.target.value,
                              })
                            }
                            className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-slate-500 shadow-inner"
                            placeholder="Phone number"
                          />
                        </div>
                      </div>

                      {/* Email ID */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                          <span>Email ID</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={customerForm.email}
                          onChange={(e) =>
                            setCustomerForm({ ...customerForm, email: e.target.value })
                          }
                          className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-slate-500 shadow-inner"
                          placeholder="you@example.com"
                        />
                      </div>

                      {/* Alternate Phone Number */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200 flex justify-between items-center">
                          <span>Alternate Phone number</span>
                          <span className="text-[11px] font-bold bg-slate-800 px-2 py-0.5 rounded-md text-slate-400">
                            Optional
                          </span>
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={customerForm.altPhoneCountryCode}
                            onChange={(e) =>
                              setCustomerForm({
                                ...customerForm,
                                altPhoneCountryCode: e.target.value,
                              })
                            }
                            className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-3 text-sm text-white transition-all outline-none shrink-0 font-bold"
                          >
                            <option value="+1">+1 (USA/CA)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+91">+91 (India)</option>
                            <option value="+61">+61 (AUS)</option>
                            <option value="+81">+81 (Japan)</option>
                            <option value="+49">+49 (Germany)</option>
                            <option value="+33">+33 (France)</option>
                            <option value="+86">+86 (China)</option>
                            <option value="+971">+971 (UAE)</option>
                            <option value="+65">+65 (Singapore)</option>
                          </select>
                          <input
                            type="tel"
                            value={customerForm.altPhoneNumber}
                            onChange={(e) =>
                              setCustomerForm({
                                ...customerForm,
                                altPhoneNumber: e.target.value,
                              })
                            }
                            className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-slate-500 shadow-inner"
                            placeholder="Alternate phone"
                          />
                        </div>
                      </div>

                      {/* Alternate Email ID */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200 flex justify-between items-center">
                          <span>Alternate Email ID</span>
                          <span className="text-[11px] font-bold bg-slate-800 px-2 py-0.5 rounded-md text-slate-400">
                            Optional
                          </span>
                        </label>
                        <input
                          type="email"
                          value={customerForm.altEmail}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              altEmail: e.target.value,
                            })
                          }
                          className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-slate-500 shadow-inner"
                          placeholder="Alternate email address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Section */}
                  <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800 space-y-5">
                    <div className="flex items-center gap-3 border-b border-slate-700/60 pb-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-wide">
                          Project Section
                        </h3>
                        <p className="text-xs text-slate-400">
                          Tell us what you are looking to build or transform
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Project Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                          <span>Project Name</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customerForm.projectName}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              projectName: e.target.value,
                            })
                          }
                          className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-slate-500 shadow-inner"
                          placeholder="e.g. Next-Gen Cloud ERP Solution"
                        />
                      </div>

                      {/* Project Details with Compact File Attachment Toolbar */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-slate-200">
                            Project Details
                          </label>
                          <span className="text-xs text-emerald-400/80 font-medium flex items-center gap-1">
                            <Sparkles size={13} /> Type details or attach document
                          </span>
                        </div>

                        <textarea
                          rows={4}
                          value={customerForm.projectDetails}
                          onChange={(e) =>
                            setCustomerForm({
                              ...customerForm,
                              projectDetails: e.target.value,
                            })
                          }
                          className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-white transition-all outline-none resize-none placeholder:text-slate-500 shadow-inner leading-relaxed"
                          placeholder="Describe your project goals, key modules, target audience, and any special technical specifications..."
                        />

                        {/* Small Compact File Upload Toolbar Underneath */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="relative">
                            <input
                              type="file"
                              id="file-upload-compact"
                              accept=".pdf,.ppt,.pptx,.doc,.docx"
                              onChange={(e) =>
                                setCustomerForm({
                                  ...customerForm,
                                  file: e.target.files?.[0] || null,
                                })
                              }
                              className="hidden"
                            />
                            <label
                              htmlFor="file-upload-compact"
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-800/80 hover:from-emerald-500/20 hover:to-teal-500/20 border border-slate-700/80 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 text-xs font-semibold px-3.5 py-2 rounded-xl cursor-pointer transition-all duration-200 shadow-sm group"
                            >
                              <Upload
                                size={14}
                                className="text-emerald-400 group-hover:scale-110 transition-transform"
                              />
                              <span>
                                {customerForm.file
                                  ? "Change attached document"
                                  : "Attach file (PDF, PPT, DOCX)"}
                              </span>
                            </label>
                          </div>

                          {customerForm.file ? (
                            <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/40 rounded-xl px-3.5 py-1.5 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                              <span className="text-xs text-emerald-300 font-bold truncate max-w-[220px]">
                                {customerForm.file.name}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setCustomerForm({ ...customerForm, file: null })
                                }
                                className="text-slate-400 hover:text-red-400 transition-colors ml-1 p-0.5 rounded"
                                title="Remove file"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                              <span>Max size: 25MB</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-500 italic">Optional if details entered</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Budget Range & Preferable Deadline */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                        {/* Budget Range */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                            <span>Budget Range</span>
                            <span className="text-red-500 font-bold">*</span>
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={customerForm.currency}
                              onChange={(e) =>
                                setCustomerForm({
                                  ...customerForm,
                                  currency: e.target.value,
                                })
                              }
                              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-3 text-sm text-white transition-all outline-none shrink-0 font-bold"
                            >
                              <option value="USD ($)">USD ($)</option>
                              <option value="EUR (€)">EUR (€)</option>
                              <option value="GBP (£)">GBP (£)</option>
                              <option value="INR (₹)">INR (₹)</option>
                              <option value="AUD ($)">AUD ($)</option>
                              <option value="CAD ($)">CAD ($)</option>
                              <option value="JPY (¥)">JPY (¥)</option>
                              <option value="AED (AED)">AED (AED)</option>
                            </select>
                            <input
                              type="text"
                              required
                              value={customerForm.budgetRange}
                              onChange={(e) =>
                                setCustomerForm({
                                  ...customerForm,
                                  budgetRange: formatAmount(e.target.value),
                                })
                              }
                              className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-white transition-all outline-none placeholder:text-slate-500 shadow-inner font-semibold"
                              placeholder="e.g. 1,25,000"
                            />
                          </div>
                        </div>

                        {/* WOW Custom Calendar Preferable Deadline */}
                        <div className="space-y-2 relative">
                          <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                            <span>Preferable Deadline</span>
                            <span className="text-red-500 font-bold">*</span>
                          </label>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDatePicker(!showDatePicker);
                            }}
                            className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm text-white transition-all cursor-pointer flex items-center justify-between shadow-inner select-none"
                          >
                            <div className="flex items-center gap-2.5">
                              <Calendar
                                size={18}
                                className="text-emerald-400 shrink-0"
                              />
                              <span
                                className={
                                  customerForm.deadline
                                    ? "text-white font-bold"
                                    : "text-slate-500 font-normal"
                                }
                              >
                                {customerForm.deadline
                                  ? formatDeadlineDisplay(customerForm.deadline)
                                  : "Select preferable deadline..."}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {customerForm.deadline && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCustomerForm({ ...customerForm, deadline: "" });
                                  }}
                                  className="p-1 hover:bg-slate-700 rounded-md text-slate-400 hover:text-red-400 transition-colors"
                                  title="Clear date"
                                >
                                  <X size={14} />
                                </button>
                              )}
                              <ChevronLeft
                                size={16}
                                className={`text-slate-400 transition-transform duration-300 ${
                                  showDatePicker
                                    ? "-rotate-90 text-emerald-400"
                                    : "rotate-180"
                                }`}
                              />
                            </div>
                          </div>

                          <AnimatePresence>
                            {showDatePicker && (
                              <CustomDatePicker
                                selectedDate={customerForm.deadline}
                                onSelectDate={(dateStr) =>
                                  setCustomerForm({
                                    ...customerForm,
                                    deadline: dateStr,
                                  })
                                }
                                onClose={() => setShowDatePicker(false)}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:via-teal-500 hover:to-green-500 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 text-base group cursor-pointer"
                  >
                    <span>Submit Project Inquiry</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WOW Forgot Password Modal Pop up */}
      <AnimatePresence>
        {showForgotPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/80 rounded-3xl shadow-[0_0_80px_-15px_rgba(99,102,241,0.3)] w-full max-w-md p-7 md:p-9 relative text-slate-100"
            >
              {/* Top Gradient Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-3xl" />

              {/* Header & Red Circle X button */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-5 mb-6 mt-1">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white tracking-tight">
                      Reset Password
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      We&apos;ll send a secure recovery link
                    </p>
                  </div>
                </div>

                {/* Red Circle X Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="w-11 h-11 rounded-full bg-red-500/15 border-2 border-red-500/60 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-500/20 shrink-0 cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={22} className="stroke-[3]" />
                </motion.button>
              </div>

              {forgotSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-blue-500/40 ring-8 ring-blue-500/10 animate-bounce">
                    <CheckCircle2 size={36} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    Link Sent Successfully!
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/60 p-5 rounded-2xl border border-blue-500/30 shadow-inner">
                    A Password Change link is sent to the registered Email Address.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all cursor-pointer mt-2"
                  >
                    Close
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-200">
                      Enter your username <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        required
                        value={forgotForm.username}
                        onChange={(e) =>
                          setForgotForm({ ...forgotForm, username: e.target.value })
                        }
                        className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-11 pr-4 py-3 text-sm text-white transition-all outline-none placeholder:text-slate-500 shadow-inner font-medium"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-200">
                      Enter your Registered Email{" "}
                      <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="email"
                        required
                        value={forgotForm.email}
                        onChange={(e) =>
                          setForgotForm({ ...forgotForm, email: e.target.value })
                        }
                        className="w-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-11 pr-4 py-3 text-sm text-white transition-all outline-none placeholder:text-slate-500 shadow-inner font-medium"
                        placeholder="Enter your Registered Email"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all mt-6 flex items-center justify-center gap-2.5 cursor-pointer group"
                  >
                    <span>Submit</span>
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

