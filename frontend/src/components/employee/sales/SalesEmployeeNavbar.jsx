"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  MessageSquare,
  Bell,
  AlarmClock,
  Moon,
  Sun,
  LogOut,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function SalesEmployeeNavbar() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const employeeName = "Rahul Sharma";

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg shadow-sm dark:border-border/50 dark:bg-background/60 dark:shadow-xl">
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
                Welcome back, {employeeName}
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

            <button
              title="Calendar"
              className="p-2 rounded-full text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-muted"
            >
              <Calendar size={20} />
            </button>

            <button
              title="Messages from Admin"
              className="p-2 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition dark:text-muted-foreground dark:hover:text-blue-400 dark:hover:bg-blue-500/10"
            >
              <MessageSquare size={20} />
            </button>

            <button
              title="Reminders"
              className="p-2 rounded-full text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition dark:text-muted-foreground dark:hover:text-amber-400 dark:hover:bg-amber-500/10"
            >
              <AlarmClock size={20} />
            </button>

            <button
              title="Notifications"
              className="relative p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition dark:text-muted-foreground dark:hover:text-rose-400 dark:hover:bg-rose-500/10"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

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

            <button
              title="Employee Profile"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white font-extrabold flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all border-2 border-indigo-300/40 text-sm"
            >
              {getInitials(employeeName)}
            </button>

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
  );
}