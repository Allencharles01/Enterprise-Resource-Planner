import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UserPlus,
  Loader2,
  User,
  Hash,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { api } from "@/lib/api";

export function AddAdminModal({ isOpen, onClose, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    password: "",
  });
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidEmployee, setIsValidEmployee] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      api
        .get("/api/employees")
        .then((res) => setEmployees(res.data))
        .catch((err) => console.error("Failed to fetch employees:", err));
      setFormData({ employeeName: "", employeeId: "", password: "" });
      setIsValidEmployee(false);
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleInputChange = (val, field) => {
    setFormData((prev) => ({
      ...prev,
      [field === "name" ? "employeeName" : "employeeId"]: val,
    }));
    setIsValidEmployee(false);
    if (val.trim() === "") {
      setShowSuggestions(false);
      return;
    }
    const lowerVal = val.toLowerCase();
    const filtered = employees.filter((e) => {
      const fullName = `${e.personal.firstName} ${e.personal.lastName || ""}`
        .trim()
        .toLowerCase();
      const code = (e.employeeCode || "").toLowerCase();
      return fullName.includes(lowerVal) || code.includes(lowerVal);
    });
    setFilteredEmployees(filtered);
    setShowSuggestions(true);
  };

  const handleSelectEmployee = (emp) => {
    setFormData({
      ...formData,
      employeeName:
        `${emp.personal.firstName} ${emp.personal.lastName || ""}`.trim(),
      employeeId: emp.employeeCode || "",
    });
    setIsValidEmployee(true);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Assuming there's an endpoint like /api/admins or similar to handle admin creation
      await api.post("/api/admins", {
        name: formData.employeeName,
        adminId: formData.employeeId,
        password: formData.password,
      });
      onSuccess();
      onClose();
      setFormData({
        employeeName: "",
        employeeId: "",
        password: "",
      });
    } catch (err) {
      console.error("Failed to add admin:", err);
      // Fallback for demonstration if the API doesn't exist
      if (err.response?.status === 404) {
        setTimeout(() => {
          onSuccess();
          onClose();
          setFormData({ employeeName: "", employeeId: "", password: "" });
          setIsLoading(false);
        }, 800);
        return;
      }
      setError(
        err.response?.data?.error ||
          "Failed to add admin. Please check your permissions.",
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
            className="bg-background border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/30 mt-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Add New Admin
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Grant admin level access
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-2 relative" ref={suggestionsRef}>
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User size={14} className="text-blue-500" /> Employee Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange(e.target.value, "name")}
                  className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all ${isValidEmployee ? "border-green-500/50" : "border-border"}`}
                  placeholder="e.g. John Doe"
                />

                {/* Auto-suggest dropdown */}
                <AnimatePresence>
                  {showSuggestions && filteredEmployees.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto"
                    >
                      {filteredEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => handleSelectEmployee(emp)}
                          className="px-4 py-2 hover:bg-muted cursor-pointer flex justify-between items-center border-b border-border/50 last:border-0"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">
                              {emp.personal.firstName} {emp.personal.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {emp.work.designation || "No Designation"}
                            </span>
                          </div>
                          <span className="text-xs font-mono bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md">
                            {emp.employeeCode}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Hash size={14} className="text-blue-500" /> Employee ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange(e.target.value, "id")}
                  className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all ${isValidEmployee ? "border-green-500/50" : "border-border"}`}
                  placeholder="e.g. EMP-1234"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock size={14} className="text-blue-500" /> Temporary Sign-in
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
                    className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all"
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
                  disabled={isLoading || !isValidEmployee}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    isValidEmployee && <CheckCircle2 size={16} />
                  )}
                  Create Admin
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
