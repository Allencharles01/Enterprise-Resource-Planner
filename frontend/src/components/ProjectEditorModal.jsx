"use client";

import { useState, useEffect } from "react";
import {
  X,
  Loader2,
  Save,
  CheckCircle2,
  Code2,
  Server,
  Database,
  Shield,
  TestTube2,
  Sliders,
  DollarSign,
  Phone,
  Mail,
  Building2,
  FileText,
  Calendar,
  Paperclip,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { DepartmentTab } from "@/components/ProjectForm/DepartmentTab";
import { EmployeeSelect } from "@/components/EmployeeSelect";

const initialDeptData = {
  deadline: "",
  reportingManager: null,
  teams: [],
};

export function ProjectEditorModal({ isOpen, project, onClose, onUpdated }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("Ongoing");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const [basicDetails, setBasicDetails] = useState({
    projectTitle: "",
    clientName: "",
    clientPhone: "",
    clientCountryCode: "+1",
    clientEmail: "",
    budget: "",
    currency: "USD ($)",
    projectDetails: "",
    files: [],
    projectLead: null,
    deadline: "",
  });

  const [departments, setDepartments] = useState({
    frontend: { ...initialDeptData },
    backend: { ...initialDeptData },
    dbms: { ...initialDeptData },
    networks: { ...initialDeptData },
    testing: { ...initialDeptData },
  });

  useEffect(() => {
    if (project) {
      setStatus(project.status || "Ongoing");
      setBasicDetails({
        projectTitle: project.name || "",
        clientName: project.client || "",
        clientPhone: project.clientPhone || "",
        clientCountryCode: project.clientCountryCode || "+1",
        clientEmail: project.clientEmail || "",
        budget: project.budget || "",
        currency: project.currency || "USD ($)",
        projectDetails: project.projectDetails || "",
        files: project.files || [],
        projectLead: null, // can be looked up or kept null
        deadline: project.deadline ? project.deadline.split("T")[0] : "",
      });

      if (project.departments) {
        setDepartments({
          frontend: project.departments.frontend || { ...initialDeptData },
          backend: project.departments.backend || { ...initialDeptData },
          dbms: project.departments.dbms || { ...initialDeptData },
          networks: project.departments.networks || { ...initialDeptData },
          testing: project.departments.testing || { ...initialDeptData },
        });
      }
    }
  }, [project]);

  const handleDepartmentChange = (dept, data) => {
    setDepartments((prev) => ({ ...prev, [dept]: data }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const pid = project.id || project._id;
      const payload = {
        basicDetails,
        departments,
        status,
      };
      await api.put(`/api/projects/${pid}`, payload);
      alert("Project updated successfully!");
      onUpdated();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update project.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Details", icon: <CheckCircle2 size={16} /> },
    { id: "frontend", label: "Frontend", icon: <Code2 size={16} /> },
    { id: "backend", label: "Backend", icon: <Server size={16} /> },
    { id: "dbms", label: "DBMS", icon: <Database size={16} /> },
    { id: "networks", label: "Networks & Security", icon: <Shield size={16} /> },
    { id: "testing", label: "Testing & QA", icon: <TestTube2 size={16} /> },
  ];

  const statusOptions = ["Completed", "On Hold", "Ongoing"];

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="relative w-full max-w-6xl max-h-[92vh] bg-background border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/60 bg-muted/20 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl border border-primary/20">
                <Sliders size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                  Edit Project: <span className="text-primary">{project.name}</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Update deliverables, timeline parameters, and team assignments
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Status Button Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                    status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      : status === "On Hold"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  Status: {status}
                  <ChevronDown size={14} />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 py-2 bg-background border border-border shadow-2xl rounded-xl w-40 z-50 flex flex-col">
                    {statusOptions.map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setStatus(st);
                          setIsStatusDropdownOpen(false);
                        }}
                        className="px-4 py-2 text-left text-xs font-bold hover:bg-muted text-foreground transition-colors flex items-center justify-between"
                      >
                        {st}
                        {status === st && <CheckCircle2 size={12} className="text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>

              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Modal Tabs */}
          <div className="flex border-b border-border bg-muted/20 px-6 pt-3 gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all rounded-t-xl whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-background shadow-sm"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === "basic" && (
              <div className="space-y-6 max-w-4xl animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <FileText size={14} className="text-primary" /> Project Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={basicDetails.projectTitle}
                      onChange={(e) => setBasicDetails({ ...basicDetails, projectTitle: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Building2 size={14} className="text-primary" /> Client Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={basicDetails.clientName}
                      onChange={(e) => setBasicDetails({ ...basicDetails, clientName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Phone size={14} className="text-primary" /> Client Phone
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="w-20 px-3 py-3 bg-muted/40 border border-border rounded-xl text-sm font-mono text-center"
                        value={basicDetails.clientCountryCode}
                        onChange={(e) => setBasicDetails({ ...basicDetails, clientCountryCode: e.target.value })}
                      />
                      <input
                        type="tel"
                        className="flex-1 px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={basicDetails.clientPhone}
                        onChange={(e) => setBasicDetails({ ...basicDetails, clientPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Mail size={14} className="text-primary" /> Client Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={basicDetails.clientEmail}
                      onChange={(e) => setBasicDetails({ ...basicDetails, clientEmail: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <DollarSign size={14} className="text-emerald-500" /> Budget ({basicDetails.currency})
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-sm font-mono font-bold text-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      value={basicDetails.budget}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const fmt = raw ? parseInt(raw, 10).toLocaleString("en-IN") : "";
                        setBasicDetails({ ...basicDetails, budget: fmt });
                      }}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2 pt-4 border-t border-border/50">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Paperclip size={14} className="text-primary" /> Project Scope & Details
                    </label>
                    <textarea
                      rows={5}
                      className="w-full p-4 bg-muted/40 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={basicDetails.projectDetails}
                      onChange={(e) => setBasicDetails({ ...basicDetails, projectDetails: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "frontend" && (
              <DepartmentTab
                title="Frontend"
                departmentKey="frontend"
                data={departments.frontend}
                onChange={(d) => handleDepartmentChange("frontend", d)}
                onEmployeeClick={() => {}}
              />
            )}

            {activeTab === "backend" && (
              <DepartmentTab
                title="Backend"
                departmentKey="backend"
                data={departments.backend}
                onChange={(d) => handleDepartmentChange("backend", d)}
                onEmployeeClick={() => {}}
              />
            )}

            {activeTab === "dbms" && (
              <DepartmentTab
                title="DBMS"
                departmentKey="dbms"
                data={departments.dbms}
                onChange={(d) => handleDepartmentChange("dbms", d)}
                onEmployeeClick={() => {}}
              />
            )}

            {activeTab === "networks" && (
              <DepartmentTab
                title="Networks & Security"
                departmentKey="networks"
                data={departments.networks}
                onChange={(d) => handleDepartmentChange("networks", d)}
                onEmployeeClick={() => {}}
              />
            )}

            {activeTab === "testing" && (
              <DepartmentTab
                title="Testing & QA"
                departmentKey="testing"
                data={departments.testing}
                onChange={(d) => handleDepartmentChange("testing", d)}
                onEmployeeClick={() => {}}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
