"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { EditProjectsModal } from "@/components/EditProjectsModal";
import { InternshipModals } from "@/components/InternshipModals";
import { TrainingModals } from "@/components/TrainingModals";
import { EmployeeDetailsModal } from "@/components/EmployeeDetailsModal";
import CsvDocsExplorerModal from "@/components/CsvDocsExplorerModal";
import { api } from "@/lib/api";
import {
  FolderKanban,
  GraduationCap,
  BookOpen,
  UserCheck,
  PlusCircle,
  Edit3,
  Trash2,
  UserPlus,
  UserMinus,
  Settings,
  Sparkles,
  ArrowUpRight,
  FileText,
  Radiation,
  Database,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EditProfileRequestsModal } from "@/components/EditProfileRequestsModal";
import { MasterDeleteModal } from "@/components/modals/MasterDeleteModal";
import MasterCustomerDataModal from "@/components/modals/MasterCustomerDataModal";

export default function ControlPanelPage() {
  const router = useRouter();
  const [isEditProjectsOpen, setIsEditProjectsOpen] = useState(false);
  const [internshipModal, setInternshipModal] = useState(null);
  const [trainingModal, setTrainingModal] = useState(null);
  const [activeToast, setActiveToast] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileRequestsOpen, setIsProfileRequestsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [adminRecord, setAdminRecord] = useState(null);
  const [isCsvExplorerOpen, setIsCsvExplorerOpen] = useState(false);
  const [isMasterDeleteOpen, setIsMasterDeleteOpen] = useState(false);
  const [isMasterCustomerDataOpen, setIsMasterCustomerDataOpen] = useState(false);

  const handleMasterDeleteSuccess = (target) => {
    setActiveToast(`Successfully deleted ${target} data!`);
    setTimeout(() => setActiveToast(null), 4000);
    fetchAdminData();
    if (target === "all") {
      router.refresh();
    }
  };

  const fetchAdminData = () => {
    api
      .get("/api/auth/me")
      .then((res) => {
        const u = res.data?.user || res.data;
        if (u) {
          const names = (u.name || "Admin User").split(" ");
          setAdminRecord({
            _id: u.id || "admin_1",
            id: u.id || "admin_1",
            userId: u.id,
            employeeCode: u.employeeCode || "ADMIN",
            personal: {
              firstName: names[0] || "Admin",
              lastName: names.slice(1).join(" ") || "Emp",
              contactEmail: u.email || "admin@novanectar.com",
            },
            work: {
              companyEmail: u.email || "admin@novanectar.com",
              designation: u.designation || "System Administrator",
              department: u.department || "Executive Suite",
              manager: "None",
            },
          });
        }
      })
      .catch((err) => console.error("Failed to fetch admin record:", err));

    api
      .get("/api/profileChangeRequests?status=pending")
      .then((res) => {
        setPendingCount((res.data || []).length);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const showToast = (actionName) => {
    setActiveToast(`Opened workflow: ${actionName}`);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout adminName="Admin">
      <div className="max-w-7xl mx-auto pb-24 px-4 md:px-0">
        {/* Desktop Banner View */}
        <div className="hidden md:block relative mb-12 p-8 sm:p-12 rounded-3xl overflow-hidden glass border border-border/80 shadow-2xl shadow-indigo-500/10">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-violet-600/20 via-indigo-500/20 to-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3 border border-primary/20">
                <Sparkles size={14} /> Executive Suite
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                Admin Control Panel
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
                Centralized operational command. Orchestrate client projects, manage internship programs, oversee training modules, and configure system profiles.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Banner View */}
        <div className="block md:hidden mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/15">
              <Sparkles size={10} /> Executive
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Control Panel
          </h1>
        </div>

        {/* Grid Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8"
        >
          {/* Section 1: Clients Projects */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-5 md:p-8 border border-indigo-500/30 shadow-xl relative overflow-hidden flex flex-col group hover:border-indigo-500/50 transition-all"
          >
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/60">
              <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl border border-indigo-500/20 shadow-inner">
                <FolderKanban size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  Section 1: Clients Projects
                </h2>
                <p className="text-xs text-muted-foreground">
                  Create, budget, and oversee enterprise deliverables
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              <button
                onClick={() => router.push("/projects/new")}
                className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-indigo-500/25 flex flex-col justify-between items-start text-left hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
              >
                <div className="p-2 bg-white/20 rounded-xl mb-4">
                  <PlusCircle size={22} />
                </div>
                <div>
                  <div className="text-lg">Add a New project</div>
                  <div className="text-xs text-indigo-100 font-normal mt-1 flex items-center gap-1">
                    Launch project form <ArrowUpRight size={12} />
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsEditProjectsOpen(true)}
                className="p-5 rounded-2xl bg-muted/60 hover:bg-muted border border-border text-foreground font-bold flex flex-col justify-between items-start text-left hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
              >
                <div className="p-2 bg-primary/10 text-primary rounded-xl mb-4">
                  <Edit3 size={22} />
                </div>
                <div>
                  <div className="text-lg">Edit an Existing Project</div>
                  <div className="text-xs text-muted-foreground font-normal mt-1 flex items-center gap-1">
                    Manage 3-tab directory <ArrowUpRight size={12} />
                  </div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Section 2: Internships */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-5 md:p-8 border border-emerald-500/30 shadow-xl relative overflow-hidden flex flex-col group hover:border-emerald-500/50 transition-all"
          >
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/60">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 shadow-inner">
                <GraduationCap size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  Section 2: Internships
                </h2>
                <p className="text-xs text-muted-foreground">
                  Recruit candidates and structure development curriculums
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
              {[
                { label: "Add a Candidate", id: "addCandidate", icon: <UserPlus size={18} /> },
                { label: "Edit Candidate's profile", id: "editCandidate", icon: <Edit3 size={18} /> },
                { label: "Remove a Candidate", id: "removeCandidate", icon: <UserMinus size={18} />, danger: true },
                { label: "Add a New course", id: "addCourse", icon: <PlusCircle size={18} /> },
                { label: "Edit an Existing Course", id: "editCourse", icon: <BookOpen size={18} /> },
                { label: "Remove a Course", id: "removeCourse", icon: <Trash2 size={18} />, danger: true },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setInternshipModal(btn.id)}
                  className={`p-4 rounded-2xl text-xs font-bold border flex flex-col items-center justify-center gap-2 text-center transition-all hover:scale-105 active:scale-95 ${
                    btn.danger
                      ? "bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500/10"
                      : "bg-muted/40 border-border hover:bg-muted text-foreground"
                  }`}
                >
                  {btn.icon}
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Section 3: Training */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-5 md:p-8 border border-amber-500/30 shadow-xl relative overflow-hidden flex flex-col group hover:border-amber-500/50 transition-all"
          >
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/60">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 shadow-inner">
                <BookOpen size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  Section 3: Training
                </h2>
                <p className="text-xs text-muted-foreground">
                  Upskill workforce with tailored learning pathways
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
              {[
                { label: "Create a New course", id: "add_course", icon: <PlusCircle size={18} /> },
                { label: "Edit an Existing Course", id: "edit_course", icon: <Edit3 size={18} /> },
                { label: "Remove a Course", id: "remove_course", icon: <Trash2 size={18} />, danger: true },
                { label: "Add a Candidate", id: "add_candidate", icon: <UserPlus size={18} /> },
                { label: "Edit Candidate's profile", id: "edit_candidate", icon: <UserCheck size={18} /> },
                { label: "Remove a Candidate", id: "remove_candidate", icon: <UserMinus size={18} />, danger: true },
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => setTrainingModal(btn.id)}
                  className={`p-4 rounded-2xl text-xs font-bold border flex flex-col items-center justify-center gap-2 text-center transition-all hover:scale-105 active:scale-95 ${
                    btn.danger
                      ? "bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500/10"
                      : "bg-muted/40 border-border hover:bg-muted text-foreground"
                  }`}
                >
                  {btn.icon}
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Section 4: Accounts */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-5 md:p-8 border border-purple-500/30 shadow-xl relative overflow-hidden flex flex-col group hover:border-purple-500/50 transition-all justify-between"
          >
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/60">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl border border-purple-500/20 shadow-inner">
                <Settings size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  Section 4: Accounts
                </h2>
                <p className="text-xs text-muted-foreground">
                  Personal preferences and security parameters
                </p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center my-auto pt-2">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="w-full min-h-[120px] rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 text-white font-extrabold shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 p-5 text-center cursor-pointer border border-purple-400/30 group"
              >
                <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors shadow-inner">
                  <Settings size={24} className="animate-spin duration-1000" />
                </div>
                <span className="text-xs sm:text-sm leading-tight">Edit Your Profile</span>
              </button>

              <button
                onClick={() => setIsProfileRequestsOpen(true)}
                className="w-full min-h-[120px] rounded-2xl bg-gradient-to-br from-pink-600 via-rose-600 to-purple-700 text-white font-extrabold shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 p-5 text-center cursor-pointer border border-pink-400/30 relative group"
              >
                {pendingCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black shadow-lg animate-bounce">
                    {pendingCount}
                  </span>
                )}
                <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors shadow-inner">
                  <FileText size={24} />
                </div>
                <span className="text-xs sm:text-sm leading-tight">Edit Profile Requests</span>
              </button>

              <button
                onClick={() => setIsCsvExplorerOpen(true)}
                className="w-full min-h-[120px] rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-700 text-white font-extrabold shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 p-5 text-center cursor-pointer border border-cyan-400/30 group"
              >
                <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors shadow-inner">
                  <FolderKanban size={24} />
                </div>
                <span className="text-xs sm:text-sm leading-tight">CSV Docs Explorer</span>
              </button>

              <button
                onClick={() => setIsMasterCustomerDataOpen(true)}
                className="w-full min-h-[120px] rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white font-extrabold shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 p-5 text-center cursor-pointer border border-teal-400/30 group"
              >
                <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors shadow-inner">
                  <Database size={24} />
                </div>
                <span className="text-xs sm:text-sm leading-tight">Master Customer Data</span>
              </button>

              <button
                onClick={() => setIsMasterDeleteOpen(true)}
                className="w-full min-h-[120px] rounded-2xl bg-gradient-to-br from-red-600 via-orange-600 to-amber-700 text-white font-extrabold shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 p-5 text-center cursor-pointer border border-red-400/30 group"
              >
                <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors shadow-inner">
                  <Radiation size={24} className="animate-[spin_12s_linear_infinite] group-hover:animate-[spin_3s_linear_infinite]" />
                </div>
                <span className="text-xs sm:text-sm leading-tight">Master Delete</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <EditProjectsModal
        isOpen={isEditProjectsOpen}
        onClose={() => setIsEditProjectsOpen(false)}
      />

      <InternshipModals
        activeModal={internshipModal}
        onClose={() => setInternshipModal(null)}
      />

      <TrainingModals
        activeModal={trainingModal}
        onClose={() => setTrainingModal(null)}
      />

      {/* Admin Profile Modal */}
      {adminRecord && (
        <EmployeeDetailsModal
          employee={adminRecord}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onUpdated={() => fetchAdminData()}
        />
      )}

      {/* Edit Profile Requests Modal */}
      <EditProfileRequestsModal
        isOpen={isProfileRequestsOpen}
        onClose={() => setIsProfileRequestsOpen(false)}
        onUpdated={() => fetchAdminData()}
      />

      <CsvDocsExplorerModal
        isOpen={isCsvExplorerOpen}
        onClose={() => setIsCsvExplorerOpen(false)}
      />

      <MasterCustomerDataModal
        isOpen={isMasterCustomerDataOpen}
        onClose={() => setIsMasterCustomerDataOpen(false)}
      />

      <MasterDeleteModal
        isOpen={isMasterDeleteOpen}
        onClose={() => setIsMasterDeleteOpen(false)}
        onSuccess={handleMasterDeleteSuccess}
      />

      {/* Toast Notification */}
      {activeToast && (
        <div className="fixed bottom-8 right-8 z-[100] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm border border-border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></div>
          {activeToast}
        </div>
      )}
    </DashboardLayout>
  );
}
