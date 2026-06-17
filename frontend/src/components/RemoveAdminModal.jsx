import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  User,
  Hash,
  Lock,
  ShieldMinus,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { api } from "@/lib/api";

export function RemoveAdminModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    password: "",
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const resetAndClose = () => {
    setStep(1);
    setFormData({ employeeName: "", employeeId: "", password: "" });
    setError("");
    onClose();
  };

  const handleInitialConfirm = (e) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.employeeId) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleFinalConfirm = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError("Admin password is required for confirmation.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.delete("/api/admins", {
        data: {
          employeeId: formData.employeeId,
          password: formData.password,
        },
      });
      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to remove admin. Please verify credentials.",
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-600"></div>

            {step === 1 && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-border/50 bg-red-500/5 mt-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 text-red-500 rounded-xl">
                      <ShieldMinus size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        Remove Admin
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Revoke administrator privileges
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetAndClose}
                    className="p-2 text-muted-foreground hover:bg-muted rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleInitialConfirm} className="p-6 space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <User size={14} className="text-red-500" /> Employee Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.employeeName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employeeName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Hash size={14} className="text-red-500" /> Employee ID
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.employeeId}
                      onChange={(e) =>
                        setFormData({ ...formData, employeeId: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
                      placeholder="e.g. EMP-1234"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-border/50">
                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="px-4 py-2 rounded-lg font-medium text-red-500 hover:bg-red-500/10 transition-colors border border-red-500/20"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-border/50 bg-orange-500/5 mt-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        Confirm Removal
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Authorization required
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetAndClose}
                    className="p-2 text-muted-foreground hover:bg-muted rounded-full"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleFinalConfirm} className="p-6 space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                      {error}
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground mb-4">
                    Please enter your Admin Password to confirm the removal of{" "}
                    <span className="font-bold text-foreground">
                      {formData.employeeName}
                    </span>{" "}
                    ({formData.employeeId}).
                  </p>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Lock size={14} className="text-orange-500" /> Admin
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
                        className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
                        placeholder="••••••••"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ShieldMinus size={16} />
                      )}
                      Confirm Removal
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 3 && (
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Success</h3>
                <p className="text-muted-foreground">
                  <span className="font-bold text-foreground">
                    {formData.employeeName}
                  </span>{" "}
                  was successfully removed and no longer has Admin Privileges.
                </p>
                <button
                  onClick={() => {
                    onSuccess();
                    resetAndClose();
                  }}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
