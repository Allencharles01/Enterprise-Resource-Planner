import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { EmployeeSelect } from "@/components/EmployeeSelect";
import {
  FileText,
  Building2,
  Calendar,
  Phone,
  Mail,
  DollarSign,
  Upload,
  Paperclip,
  X,
} from "lucide-react";

export function BasicDetailsTab({ data, onChange, onEmployeeClick }) {
  const [employees, setEmployees] = useState([]);
  const [showBroughtDropdown, setShowBroughtDropdown] = useState(false);
  const [broughtSearch, setBroughtSearch] = useState("");

  useEffect(() => {
    api.get("/api/employees").then((res) => {
      setEmployees(res.data || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setBroughtSearch(data.broughtBySalesAgent || "");
  }, [data.broughtBySalesAgent]);

  const salesEmployees = employees.filter((e) => {
    const isSales = e.work?.department?.toLowerCase() === "sales";
    if (!isSales) return false;
    if (!broughtSearch) return true;
    const q = broughtSearch.toLowerCase();
    const fullName = `${e.personal?.firstName || ""} ${e.personal?.lastName || ""}`.toLowerCase();
    const empCode = (e.employeeCode || "").toLowerCase();
    const empNum = (e.employeeNumber || "").toLowerCase();
    const loginId = (e.work?.companyEmail || "").toLowerCase();
    const personalEmail = (e.personal?.contactEmail || "").toLowerCase();
    return (
      fullName.includes(q) ||
      empCode.includes(q) ||
      empNum.includes(q) ||
      loginId.includes(q) ||
      personalEmail.includes(q)
    );
  });

  const handleAgentSelect = (emp) => {
    const name = `${emp.personal?.firstName || ""} ${emp.personal?.lastName || ""}`.trim();
    setBroughtSearch(name);
    onChange({
      ...data,
      broughtBySalesAgent: name,
      projectLead: emp
    });
    setShowBroughtDropdown(false);
  };

  const handleAgentTextChange = (text) => {
    setBroughtSearch(text);
    const matchingEmp = employees.find(
      (e) => `${e.personal?.firstName || ""} ${e.personal?.lastName || ""}`.trim().toLowerCase() === text.trim().toLowerCase()
    ) || null;
    onChange({
      ...data,
      broughtBySalesAgent: text,
      projectLead: matchingEmp
    });
  };

  const currencies = ["USD ($)", "EUR (€)", "GBP (£)", "INR (₹)", "CAD ($)", "AUD ($)", "JPY (¥)"];
  const countryCodes = ["+1", "+44", "+91", "+61", "+81", "+49", "+33"];

  const handleBudgetChange = (e) => {
    // Remove non-digits
    const rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) {
      onChange({ ...data, budget: "" });
      return;
    }
    // Format with commas
    const formatted = parseInt(rawValue, 10).toLocaleString("en-IN");
    onChange({ ...data, budget: formatted });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type || "document",
    }));
    onChange({ ...data, files: [...(data.files || []), ...newFiles] });
  };

  const removeFile = (idx) => {
    const nextFiles = [...(data.files || [])];
    nextFiles.splice(idx, 1);
    onChange({ ...data, files: nextFiles });
  };

  return (
    <div className="space-y-5 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-lg md:text-2xl font-bold text-foreground mb-1 md:mb-2">
          Basic Details & Client Dossier
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Define core project parameters, budget, and client contact channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Project Title */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            Project Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground text-sm"
            placeholder="e.g., Enterprise Resource Planner AI"
            value={data.projectTitle || ""}
            onChange={(e) =>
              onChange({ ...data, projectTitle: e.target.value })
            }
          />
        </div>

        {/* Client Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            Client Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground text-sm"
            placeholder="e.g., NovaNectar Private Limited"
            value={data.clientName || ""}
            onChange={(e) => onChange({ ...data, clientName: e.target.value })}
          />
        </div>

        {/* Client Phone beside Client Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Phone size={16} className="text-primary" />
            Client Phone Number
          </label>
          <div className="flex gap-2">
            <select
              value={data.clientCountryCode || "+1"}
              onChange={(e) => onChange({ ...data, clientCountryCode: e.target.value })}
              className="px-3 py-3 bg-muted/50 border border-border rounded-xl text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {countryCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground text-sm font-mono"
              placeholder="9876543210"
              value={data.clientPhone || ""}
              onChange={(e) => onChange({ ...data, clientPhone: e.target.value })}
            />
          </div>
        </div>

        {/* Client Email Address */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Mail size={16} className="text-primary" />
            Client Email Address
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground text-sm"
            placeholder="contact@cliententerprise.com"
            value={data.clientEmail || ""}
            onChange={(e) => onChange({ ...data, clientEmail: e.target.value })}
          />
        </div>

        {/* Budget + Currency Selector */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-500" />
            Project Budget
          </label>
          <div className="flex gap-2">
            <select
              value={data.currency || "USD ($)"}
              onChange={(e) => onChange({ ...data, currency: e.target.value })}
              className="px-3 py-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold focus:outline-none"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="flex-1 px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-foreground text-sm font-mono font-bold"
              placeholder="10,000"
              value={data.budget || ""}
              onChange={handleBudgetChange}
            />
          </div>
        </div>

        {/* Overall Deadline */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            Overall Deadline
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground text-sm"
            value={data.deadline || ""}
            onChange={(e) => onChange({ ...data, deadline: e.target.value })}
          />
        </div>

        {/* Sales Agent Responsible */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-background rounded-full"></div>
            </div>
            Sales Agent Responsible
          </label>
          <div className="relative">
            <input
              type="text"
              disabled={data.foundOnOwn}
              placeholder={data.foundOnOwn ? "Not applicable (Found us on own)" : "Type to search Sales Agent..."}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground text-sm disabled:opacity-50 disabled:bg-muted/30"
              value={broughtSearch}
              onChange={(e) => handleAgentTextChange(e.target.value)}
              onFocus={() => !data.foundOnOwn && setShowBroughtDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowBroughtDropdown(false), 200);
              }}
            />
            {showBroughtDropdown && !data.foundOnOwn && (
              <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-xl shadow-xl max-h-48 overflow-y-auto">
                {salesEmployees.length === 0 ? (
                  <div className="p-3 text-xs text-muted-foreground">No Sales employees found</div>
                ) : (
                  salesEmployees.map((e) => {
                    const name = `${e.personal?.firstName || ""} ${e.personal?.lastName || ""}`.trim();
                    return (
                      <button
                        key={e.id || e._id}
                        type="button"
                        onMouseDown={() => handleAgentSelect(e)}
                        className="w-full text-left p-3 hover:bg-muted text-sm text-foreground transition-colors"
                      >
                        {name} (Sales)
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Checkbox: Client found us on their own */}
        <div className="flex items-center gap-3 pt-4 md:col-span-2">
          <input
            type="checkbox"
            id="foundOnOwn"
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary/50 bg-background cursor-pointer"
            checked={data.foundOnOwn || false}
            onChange={(e) => {
              const checked = e.target.checked;
              onChange({
                ...data,
                foundOnOwn: checked,
                broughtBySalesAgent: "",
                projectLead: null,
              });
              if (checked) {
                setBroughtSearch("");
              }
            }}
          />
          <label htmlFor="foundOnOwn" className="text-sm font-semibold text-foreground cursor-pointer select-none">
            Client found us on their own without any assistance from a sales agent
          </label>
        </div>

        {/* Project Details & Files Upload Zone */}
        <div className="space-y-3 md:col-span-2 pt-2 border-t border-border/50">
          <label className="text-sm font-semibold text-foreground flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <span className="flex items-center gap-2">
              <Paperclip size={16} className="text-primary" />
              Enter Project Details & Dossier Files
            </span>
            <span className="text-xs text-muted-foreground font-normal">
              Type details or upload .docx, .pdf, .ppt, .txt, .form
            </span>
          </label>

          <textarea
            rows={4}
            placeholder="Type comprehensive scope of work, technical specifications, and key deliverables..."
            value={data.projectDetails || ""}
            onChange={(e) => onChange({ ...data, projectDetails: e.target.value })}
            className="w-full p-4 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-y"
          />

          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-bold cursor-pointer transition-colors shadow-sm">
              <Upload size={14} className="text-primary" />
              Upload Document (.pdf, .docx, .ppt, .txt)
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.form"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {data.files && data.files.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap flex-1">
                {data.files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-foreground animate-in fade-in"
                  >
                    <Paperclip size={12} className="text-primary" />
                    <span className="max-w-[140px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
