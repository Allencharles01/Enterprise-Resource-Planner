"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Command, Loader2, User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
      await axios.post(`${apiUrl}/api/accountRequests`, {
        name,
        email,
      });
      setIsSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred during your request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="flex w-full max-w-6xl mx-auto z-10 p-4 items-center justify-center lg:justify-between gap-12">
        {/* Left branding section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col justify-center w-1/2"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <Command size={24} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              NovaNectar ERP
            </h1>
          </div>
          <h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Start scaling your <br />
            <span className="text-gradient">business today.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Join thousands of modern enterprises using NovaNectar to manage
            their resources efficiently.
          </p>
        </motion.div>

        {/* Right register form section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

            <div className="text-center mb-8 lg:hidden">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-primary/30 overflow-hidden">
                <img
                  src="/NovaLogo.jpeg"
                  alt="Nova Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Create Account
              </h2>
              <p className="text-muted-foreground mt-2">Setup your workspace</p>
            </div>

            <div className="hidden lg:block mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Create Account
              </h2>
              <p className="text-muted-foreground mt-2">
                Setup your workspace to get started
              </p>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-2"
              >
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-500/20 overflow-hidden">
                  <img
                    src="/NovaLogo.jpeg"
                    alt="Nova Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Hey {name},
                </h3>
                <p className="text-sm text-muted-foreground text-left leading-relaxed">
                  We have received your request to create an account with
                  NovaNectar ERP Services. The account creation process may take
                  up to 24 hours.
                </p>
                <p className="text-sm text-muted-foreground text-left leading-relaxed">
                  Please keep an eye out for the Account Activation email, which
                  will be sent to your registered email address ({email}) and
                  will contain further instructions.
                </p>
                <Link
                  href="/login"
                  className="inline-block mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Return to Login
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Your Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={18}
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="w-full bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-2 outline-none transition-all placeholder:text-muted-foreground text-foreground disabled:opacity-50 text-sm"
                      placeholder="John Doe"
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
                      className="w-full bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-lg pl-10 pr-4 py-2 outline-none transition-all placeholder:text-muted-foreground text-foreground disabled:opacity-50 text-sm"
                      placeholder="Enter your email address here"
                      required
                    />
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

                <motion.button
                  whileHover={!isLoading ? { scale: 1.01 } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors mt-2 shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      Sign Up <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>

                <div className="text-center mt-2">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
