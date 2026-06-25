import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UserPlus,
  Loader2,
  User,
  Hash,
  Briefcase,
  Building,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { api } from "@/lib/api";

export function ApproveRequestModal({ isOpen, onClose, onSuccess, request }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    employeeCode: "",
    department: "",
    designation: "",
    password: "",
  });

  useEffect(() => {
    if (isOpen && request) {
      const parts = request.name.split(" ");
      setFormData({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        employeeCode: "",
        department: "",
        designation: "",
        password: "",
      });
      setError("");
    }
  }, [isOpen, request]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post(`/api/accountRequests/${request._id}/approve`, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to approve request. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/30 mt-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 text-green-500 rounded-xl">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Add New Employee
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Approve request for {request?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
            >
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User size={14} className="text-primary" /> First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User size={14} className="text-primary" /> Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Hash size={14} className="text-primary" /> Employee ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.employeeCode}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeCode: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="e.g. EMP-1001"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Building size={14} className="text-primary" /> Department
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none"
                  >
                    <option value="" disabled>
                      Select Department...
                    </option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DBMS">DBMS</option>
                    <option value="Networks">Networks</option>
                    <option value="Testing">Testing & QA</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Briefcase size={14} className="text-primary" /> Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="e.g. Senior Developer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock size={14} className="text-primary" /> Temporary Sign-in
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This will be emailed to the candidate.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  Save Employee
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
