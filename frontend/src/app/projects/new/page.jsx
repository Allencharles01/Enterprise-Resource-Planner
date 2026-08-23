"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs } from "@/components/ui/Tabs";
import { BasicDetailsTab } from "@/components/ProjectForm/BasicDetailsTab";
import { DepartmentTab } from "@/components/ProjectForm/DepartmentTab";
import { EmployeeDetailsModal } from "@/components/EmployeeDetailsModal";
import { api } from "@/lib/api";
import {
  Server,
  Code2,
  Database,
  Shield,
  TestTube2,
  CheckCircle2,
  ChevronRight,
  Save,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const tabs = [
  { id: "basic", label: "Basic Details", icon: <CheckCircle2 size={18} /> },
  { id: "frontend", label: "Frontend", icon: <Code2 size={18} /> },
  { id: "backend", label: "Backend", icon: <Server size={18} /> },
  { id: "dbms", label: "DBMS", icon: <Database size={18} /> },
  { id: "networks", label: "Networks & Security", icon: <Shield size={18} /> },
  { id: "testing", label: "Testing & QA", icon: <TestTube2 size={18} /> },
];

const initialDeptData = {
  deadline: "",
  reportingManager: null,
  teams: [],
};

export default function NewProjectPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
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

  const handleDepartmentChange = (dept, data) => {
    setDepartments((prev) => ({ ...prev, [dept]: data }));
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        basicDetails,
        departments,
      };
      await api.post("/api/projects", payload);
      alert("Project saved successfully!");
      router.push("/");
    } catch (err) {
      console.error("Failed to save project:", err);
      alert("Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentIndex = tabs.findIndex((t) => t.id === activeTab);
  const isLastTab = currentIndex === tabs.length - 1;

  const nextTab = () => {
    if (!isLastTab) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  return (
    <DashboardLayout adminName="Admin">
      <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Create New Project
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              <span className="md:inline hidden">Set up a new project, assign managers, and define team structures.</span>
              <span className="inline md:hidden">Set up new project structure.</span>
            </p>
          </div>
          <div className="flex gap-2.5 w-full md:w-auto">
            <button
              onClick={() => router.back()}
              className="flex-1 md:flex-none px-4 py-2 md:px-6 md:py-2.5 rounded-xl border border-border text-foreground text-xs md:text-sm font-semibold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 md:flex-none px-4 py-2 md:px-6 md:py-2.5 rounded-xl bg-primary text-primary-foreground text-xs md:text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5 md:gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save Project
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl md:rounded-3xl p-4 md:p-8 border border-border/50 shadow-xl shadow-black/5">
          <div className="mb-6 md:mb-8">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <div className="min-h-[500px]">
            {activeTab === "basic" && (
              <BasicDetailsTab
                data={basicDetails}
                onChange={setBasicDetails}
                onEmployeeClick={handleEmployeeClick}
              />
            )}

            {activeTab === "frontend" && (
              <DepartmentTab
                title="Frontend"
                departmentKey="frontend"
                data={departments.frontend}
                onChange={(d) => handleDepartmentChange("frontend", d)}
                onEmployeeClick={handleEmployeeClick}
              />
            )}

            {activeTab === "backend" && (
              <DepartmentTab
                title="Backend"
                departmentKey="backend"
                data={departments.backend}
                onChange={(d) => handleDepartmentChange("backend", d)}
                onEmployeeClick={handleEmployeeClick}
              />
            )}

            {activeTab === "dbms" && (
              <DepartmentTab
                title="DBMS"
                departmentKey="dbms"
                data={departments.dbms}
                onChange={(d) => handleDepartmentChange("dbms", d)}
                onEmployeeClick={handleEmployeeClick}
              />
            )}

            {activeTab === "networks" && (
              <DepartmentTab
                title="Networks & Security"
                departmentKey="networks"
                data={departments.networks}
                onChange={(d) => handleDepartmentChange("networks", d)}
                onEmployeeClick={handleEmployeeClick}
              />
            )}

            {activeTab === "testing" && (
              <DepartmentTab
                title="Testing & QA"
                departmentKey="testing"
                data={departments.testing}
                onChange={(d) => handleDepartmentChange("testing", d)}
                onEmployeeClick={handleEmployeeClick}
              />
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-border/50 flex justify-end">
            {!isLastTab && (
              <button
                onClick={nextTab}
                className="px-6 py-3 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted-foreground/10 transition-colors flex items-center gap-2"
              >
                Next Section
                <ChevronRight size={18} />
              </button>
            )}
            {isLastTab && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 animate-in fade-in zoom-in duration-300 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Complete & Save
              </button>
            )}
          </div>
        </div>
      </div>

      <EmployeeDetailsModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </DashboardLayout>
  );
}
