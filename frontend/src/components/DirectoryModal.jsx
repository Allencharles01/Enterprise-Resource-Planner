import { useState, useEffect } from "react";
import { X, Loader2, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export function DirectoryModal({ isOpen, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      api
        .get("/api/employees")
        .then((res) => {
          setEmployees(res.data);
        })
        .catch((err) => console.error("Failed to fetch directory:", err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-7xl max-h-[90vh] bg-background border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Users size={24} />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Employee Directory
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-semibold">S.no</th>
                      <th className="px-6 py-4 font-semibold">Emp Number</th>
                      <th className="px-6 py-4 font-semibold">Emp ID</th>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Contact Email</th>
                      <th className="px-6 py-4 font-semibold">Company Email</th>
                      <th className="px-6 py-4 font-semibold">Designation</th>
                      <th className="px-6 py-4 font-semibold">Department</th>
                      <th className="px-6 py-4 font-semibold">Manager</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, idx) => (
                      <tr
                        key={emp.id || idx}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-6 py-4 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">
                          {emp.employeeNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 font-medium text-primary bg-primary/5">
                          {emp.employeeCode}
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground">
                          {emp.personal?.firstName} {emp.personal?.lastName}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {emp.personal?.contactEmail || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {emp.work?.companyEmail || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 whitespace-nowrap rounded-full text-xs font-medium border border-blue-500/20">
                            {emp.work?.designation || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">
                          {emp.work?.department || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {emp.work?.manager || "N/A"}
                        </td>
                      </tr>
                    ))}
                    {employees.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-6 py-8 text-center text-muted-foreground"
                        >
                          No employees found in the directory.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
