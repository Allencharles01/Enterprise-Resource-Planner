"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  Command,
  Loader2,
  Building2,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [orgSlug, setOrgSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [loginType, setLoginType] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
      const payload =
        loginType === "admin"
          ? { adminId, password, isAdmin: true }
          : { orgSlug, email, password };
      const response = await axios.post(`${apiUrl}/api/auth/login`, payload);
      setMessage("Login successful! Redirecting...");
      // Save token and user details to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.user.name);
      localStorage.setItem("userRole", response.data.user.role);
      sessionStorage.setItem("active_session", "true");
      console.log("Token and user details saved");
      // Simulate redirection to dashboard
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred during login. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
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

            <div className="text-center mb-8 lg:hidden">
              <div className="w-16 h-16 shrink-0 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30 overflow-hidden">
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

            <div className="hidden lg:block mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Welcome Back
              </h2>
              <p className="text-muted-foreground mt-2">
                Please sign in to your workspace
              </p>
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
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Workspace ID (Org Slug)
                    </label>
                    <div className="relative">
                      <Building2
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <input
                        type="text"
                        value={orgSlug}
                        onChange={(e) => setOrgSlug(e.target.value)}
                        disabled={isLoading}
                        className="w-full bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-muted-foreground text-foreground disabled:opacity-50"
                        placeholder="novanectar"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={18}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="w-full bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-muted-foreground text-foreground disabled:opacity-50"
                        placeholder="name@company.com"
                        required
                      />
                    </div>
                  </div>
                </>
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
                  <a
                    href="#"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </a>
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
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:underline font-medium"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
