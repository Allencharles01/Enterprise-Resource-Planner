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
import { EmployeeDetailsModal } from "./EmployeeDetailsModal";

export function DirectoryModal({ isOpen, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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
          <div className="p-4 md:p-6 border-b border-border/50 bg-muted/20 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Users size={20} className="md:h-6 md:w-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-foreground">
                    Employee Directory
                  </h2>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
                    Total: {filteredAndSortedEmployees.length} team members
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} className="md:h-6 md:w-6" />
              </button>
            </div>

            {/* Search Bar (Full width on mobile, max-w-sm and aligned right on desktop) */}
            <div className="flex md:justify-end">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by Name, Emp Number, ID, Dept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-12 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : (
              <>
                {/* Desktop view: Tabular structure */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
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
                              <button
                                type="button"
                                onClick={() => setSelectedEmployee(emp)}
                                className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg font-bold underline underline-offset-4 cursor-pointer transition-all hover:scale-105"
                                title="Click to view/edit Employee Details"
                              >
                                {emp.employeeCode}
                              </button>
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

                {/* Mobile view: Tile layout */}
                <div className="block md:hidden space-y-4">
                  {paginatedEmployees.map((emp, idx) => {
                    const absoluteIndex =
                      (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    const snoStr = String(absoluteIndex).padStart(3, "0");
                    const empNum = emp.employeeNumber || snoStr;
                    const empId = emp.employeeCode || "NA";
                    const fullName = `${emp.personal?.firstName || ""} ${
                      emp.personal?.lastName !== "Emp"
                        ? emp.personal?.lastName || ""
                        : ""
                    }`.trim();
                    const designation = emp.work?.designation || "NA";
                    const department = emp.work?.department || "NA";
                    const companyEmail = emp.work?.companyEmail || "NA";

                    return (
                      <div
                        key={emp.id || emp._id || idx}
                        onClick={() => setSelectedEmployee(emp)}
                        className="glass-card p-4 rounded-xl border border-border/60 space-y-3 cursor-pointer hover:border-primary/40 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-mono text-muted-foreground mr-2">
                              #{snoStr}
                            </span>
                            <span className="text-xs font-mono text-muted-foreground">
                              Num: {empNum}
                            </span>
                            <h4 className="text-base font-bold text-foreground mt-0.5">
                              {fullName}
                            </h4>
                          </div>
                          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg font-mono text-xs font-bold underline">
                            {empId}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/40 pt-2.5">
                          <div>
                            <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                              Designation
                            </span>
                            <span className="text-foreground font-medium">
                              {designation}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                              Department
                            </span>
                            <span className="text-foreground font-medium">
                              {department}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs">
                          <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                            Company Email
                          </span>
                          <span className="text-muted-foreground font-mono break-all text-left block mt-0.5">
                            {companyEmail}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {paginatedEmployees.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No employees found matching your search.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Pagination Footer */}
          {!isLoading && filteredAndSortedEmployees.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 px-6 border-t border-border/50 bg-muted/10">
              <div className="text-xs text-muted-foreground text-center sm:text-left">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredAndSortedEmployees.length,
                )}{" "}
                of {filteredAndSortedEmployees.length} entries
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 px-3 border border-border rounded-xl text-xs flex items-center gap-1 disabled:opacity-40 hover:bg-muted text-foreground transition-colors cursor-pointer bg-background"
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
                  className="p-2 px-3 border border-border rounded-xl text-xs flex items-center gap-1 disabled:opacity-40 hover:bg-muted text-foreground transition-colors cursor-pointer bg-background"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <EmployeeDetailsModal
        isOpen={Boolean(selectedEmployee)}
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onUpdated={() => {
          setSelectedEmployee(null);
          setIsLoading(true);
          api
            .get("/api/employees")
            .then((res) => setEmployees(res.data || []))
            .catch((err) => console.error("Failed to refresh directory:", err))
            .finally(() => setIsLoading(false));
        }}
      />
    </AnimatePresence>
  );
}
