import { useState, useEffect, useMemo } from "react";
import {
  X,
  Loader2,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export function DirectoryModal({ isOpen, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setSearchQuery("");
      setCurrentPage(1);
      api
        .get("/api/employees")
        .then((res) => {
          setEmployees(res.data || []);
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

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter and Sort ascending by Emp Number
  const filteredAndSortedEmployees = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const filtered = employees.filter((emp) => {
      if (!query) return true;
      const fullName = `${emp.personal?.firstName || ""} ${emp.personal?.lastName || ""}`.toLowerCase();
      const empNum = String(emp.employeeNumber || "").toLowerCase();
      const empId = String(emp.employeeCode || "").toLowerCase();
      const contactEmail = String(emp.personal?.contactEmail || "").toLowerCase();
      const dept = String(emp.work?.department || "").toLowerCase();
      const desig = String(emp.work?.designation || "").toLowerCase();

      return (
        fullName.includes(query) ||
        empNum.includes(query) ||
        empId.includes(query) ||
        contactEmail.includes(query) ||
        dept.includes(query) ||
        desig.includes(query)
      );
    });

    // Sort ascending starting from 001
    return filtered.sort((a, b) => {
      const numA = parseInt(a.employeeNumber || "999999", 10);
      const numB = parseInt(b.employeeNumber || "999999", 10);
      if (numA !== numB) return numA - numB;
      return String(a.employeeCode || "").localeCompare(
        String(b.employeeCode || ""),
      );
    });
  }, [employees, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedEmployees.length / ITEMS_PER_PAGE),
  );

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedEmployees.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedEmployees, currentPage]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-7xl max-h-[90vh] bg-background border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/20 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Employee Directory
                </h2>
                <p className="text-xs text-muted-foreground">
                  Total: {filteredAndSortedEmployees.length} team members
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-end">
              {/* Search Bar Top Right */}
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by Name, Emp Number, ID, Dept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
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
                    {paginatedEmployees.map((emp, idx) => {
                      const absoluteIndex =
                        (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      const snoStr = String(absoluteIndex).padStart(3, "0");

                      return (
                        <tr
                          key={emp.id || emp._id || idx}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-6 py-4 text-muted-foreground font-mono">
                            {snoStr}
                          </td>
                          <td className="px-6 py-4 font-medium text-foreground font-mono">
                            {emp.employeeNumber || snoStr}
                          </td>
                          <td className="px-6 py-4 font-medium text-primary bg-primary/5 font-mono">
                            {emp.employeeCode}
                          </td>
                          <td className="px-6 py-4 font-bold text-foreground">
                            {emp.personal?.firstName}{" "}
                            {emp.personal?.lastName !== "Emp"
                              ? emp.personal?.lastName
                              : ""}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-xs">
                            {emp.personal?.contactEmail || "NA"}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-xs">
                            {emp.work?.companyEmail || "NA"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 whitespace-nowrap rounded-full text-xs font-medium border border-blue-500/20">
                              {emp.work?.designation || "NA"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground font-medium">
                            {emp.work?.department || "NA"}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            {emp.work?.manager || "NA"}
                          </td>
                        </tr>
                      );
                    })}
                    {paginatedEmployees.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-6 py-8 text-center text-muted-foreground"
                        >
                          No employees found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {!isLoading && filteredAndSortedEmployees.length > 0 && (
            <div className="flex items-center justify-between p-4 px-6 border-t border-border/50 bg-muted/10">
              <div className="text-xs text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredAndSortedEmployees.length,
                )}{" "}
                of {filteredAndSortedEmployees.length} entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 px-3 border border-border rounded-xl text-xs flex items-center gap-1 disabled:opacity-40 hover:bg-muted text-foreground transition-colors"
                >
                  <ChevronLeft size={14} /> Prev
                </button>

                <div className="flex items-center gap-1 px-2 font-mono text-xs text-muted-foreground">
                  Page <span className="text-foreground font-bold">{currentPage}</span> of {totalPages}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 px-3 border border-border rounded-xl text-xs flex items-center gap-1 disabled:opacity-40 hover:bg-muted text-foreground transition-colors"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
