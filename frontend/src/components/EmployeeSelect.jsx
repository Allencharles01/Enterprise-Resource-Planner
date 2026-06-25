import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { Search, X, Loader2 } from "lucide-react";

export function EmployeeSelect({
  value,
  onChange,
  onEmployeeClick,
  placeholder = "Search employee...",
  departmentFilter,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchEmployees() {
      setIsLoading(true);
      try {
        const response = await api.get("/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.personal.firstName} ${emp.personal.lastName || ""}`
      .trim()
      .toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter
      ? emp.work?.department === departmentFilter ||
        emp.work?.department === "Management"
      : true;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {value ? (
        <div
          className="flex items-center justify-between p-1.5 pl-3 bg-primary/10 border border-primary/30 rounded-xl hover:bg-primary/20 transition-colors cursor-pointer group"
          onClick={() => onEmployeeClick(value)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              {value.personal.firstName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {value.personal.firstName} {value.personal.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {value.work?.designation || "Employee"}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
        </div>
      )}

      {isOpen && !value && (
        <div className="absolute z-10 w-full mt-2 bg-background border border-border rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground flex justify-center">
              <Loader2 className="animate-spin" size={20} />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No employees found.
            </div>
          ) : (
            <div className="p-1">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => {
                    onChange(emp);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted-foreground/10 text-muted-foreground flex items-center justify-center font-bold text-sm">
                      {emp.personal.firstName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {emp.personal.firstName} {emp.personal.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {emp.work?.designation || "Employee"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
