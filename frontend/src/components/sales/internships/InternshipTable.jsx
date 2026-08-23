"use client";

import { useState, useEffect } from "react";
import { UserRound, Loader2, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import InternProfileModal from "./InternProfileModal";

export default function InternshipTable() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedIntern, setSelectedIntern] = useState(null);
  
  const [selectedMobileProgram, setSelectedMobileProgram] = useState("All Programs");
  const [isMobileProgramDropdownOpen, setIsMobileProgramDropdownOpen] = useState(false);

  useEffect(() => {
    api.get("/api/internships/candidates")
      .then((res) => {
        const list = (res.data || []).map((item) => ({
          id: item._id,
          name: item.name,
          email: item.email,
          program: item.courseName,
          department: item.education || "Engineering",
          duration: item.duration || "3 months",
          mentor: item.salesAgent || "Allen Charles",
          progress: item.progress || 0,
          placement: item.status === "Completed" ? "Placed" : "Under Review",
          status: item.status || "Active",
          ...item
        }));
        setInterns(list);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredInterns = interns.filter((intern) => {
    if (filter === "All") return true;
    if (filter === "Active") return intern.status === "Active";
    if (filter === "Dropped") return intern.status === "Dropped Out";
    return true;
  });

  const activeCount = interns.filter(
    (i) => i.status === "Active"
  ).length;

  const droppedCount = interns.filter(
    (i) => i.status === "Dropped Out"
  ).length;

  const uniquePrograms = [
    "All Programs",
    ...Array.from(new Set(interns.map((i) => i.program).filter(Boolean)))
  ];

  const mobileFilteredInterns = filteredInterns.filter((intern) => {
    if (selectedMobileProgram === "All Programs") return true;
    return intern.program === selectedMobileProgram;
  });

  return (
    <>
      <div className="glass-card rounded-2xl border border-border p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Intern Details
            </h2>

            <p className="text-muted-foreground mt-2">
              View candidate profiles and track progress
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3 overflow-x-auto pb-1 max-w-full whitespace-nowrap scrollbar-none">
            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                filter === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            >
              All Interns ({interns.length})
            </button>

            <button
              onClick={() => setFilter("Active")}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                filter === "Active"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            >
              Active Interns ({activeCount})
            </button>

            <button
              onClick={() => setFilter("Dropped")}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                filter === "Dropped"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background"
              }`}
            >
              Dropped Out ({droppedCount})
            </button>
          </div>
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th className="text-left py-4 px-4 font-semibold whitespace-nowrap">Name</th>
                <th className="text-left py-4 px-4 font-semibold whitespace-nowrap">Program</th>
                <th className="text-left py-4 px-4 font-semibold whitespace-nowrap">Department</th>
                <th className="text-left py-4 px-4 font-semibold whitespace-nowrap">Duration</th>
                <th className="text-left py-4 px-4 font-semibold whitespace-nowrap">Mentor</th>
                <th className="text-left py-4 px-4 font-semibold whitespace-nowrap">Progress</th>
                <th className="text-left py-4 px-4 font-semibold whitespace-nowrap">Placement</th>
                <th className="text-left py-4 px-4 font-semibold whitespace-nowrap">Status</th>
                <th className="text-left py-4 px-4 font-semibold whitespace-nowrap">Profile</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {filteredInterns.map((intern) => (
                <tr
                  key={intern.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition"
                >
                  {/* Name */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-semibold text-foreground">
                      {intern.name}
                    </div>

                    <div className="text-xs text-muted-foreground mt-0.5">
                      {intern.email}
                    </div>
                  </td>

                  <td className="py-4 px-4 font-medium text-foreground whitespace-nowrap">{intern.program}</td>

                  <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">{intern.department}</td>

                  <td className="py-4 px-4 whitespace-nowrap">{intern.duration}</td>

                  <td className="py-4 px-4 font-medium text-foreground whitespace-nowrap">{intern.mentor}</td>

                  {/* Progress */}
                  <td className="py-4 px-4 w-[220px] min-w-[180px]">
                    <div className="text-sm font-bold mb-1 text-emerald-400">
                      {intern.progress || 0}%
                    </div>

                    <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden border border-border/50">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/30"
                        style={{
                          width: `${intern.progress || 0}%`,
                        }}
                      />
                    </div>
                  </td>

                  {/* Placement */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        intern.placement === "Shortlisted"
                          ? "bg-blue-500/10 text-blue-500"
                          : intern.placement === "Under Review"
                          ? "bg-amber-500/10 text-amber-500"
                          : intern.placement === "Placed"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {intern.placement}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        intern.status === "Active"
                          ? "bg-green-500/10 text-green-500"
                          : intern.status === "Completed"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {intern.status}
                    </span>
                  </td>

                  {/* Profile */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedIntern(intern)}
                      className="
                        flex items-center gap-2
                        px-4 py-2
                        border border-border
                        rounded-xl
                        hover:bg-muted/50
                        transition
                      "
                    >
                      <UserRound size={16} />
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Dropdown Selector & Cards) */}
        <div className="block md:hidden mt-6 space-y-5">
          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select Internship Program
            </label>
            
            {/* Custom Modern Dropdown Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMobileProgramDropdownOpen(!isMobileProgramDropdownOpen)}
                className="w-full flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <span className="truncate">{selectedMobileProgram}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 shrink-0 ${isMobileProgramDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileProgramDropdownOpen && (
                <>
                  {/* Overlay click-away container */}
                  <div 
                    className="fixed inset-0 z-20 cursor-default" 
                    onClick={() => setIsMobileProgramDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 z-30 mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto">
                    {uniquePrograms.map((prog) => (
                      <button
                        key={prog}
                        type="button"
                        onClick={() => {
                          setSelectedMobileProgram(prog);
                          setIsMobileProgramDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          prog === selectedMobileProgram
                            ? "bg-blue-600 text-white font-semibold"
                            : "text-slate-200 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        {prog}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Interns Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Candidates ({mobileFilteredInterns.length})
            </h3>

            {mobileFilteredInterns.length === 0 ? (
              <div className="text-center py-8 bg-slate-800/10 border border-slate-800/50 rounded-2xl text-slate-500 text-sm">
                No interns found matching the filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {mobileFilteredInterns.map((intern) => {
                  const initials = intern.name
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "IN";

                  return (
                    <div
                      key={intern.id}
                      className="bg-slate-800/30 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-300 space-y-3.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-slate-850 border border-slate-750 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-100 text-sm break-words leading-snug">
                              {intern.name}
                            </h4>
                            <p className="text-xs text-slate-400 break-all mt-0.5">
                              {intern.email}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 pt-0.5">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              intern.status === "Active"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : intern.status === "Completed"
                                ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                : "bg-red-500/10 text-red-500 border border-red-500/20"
                            }`}
                          >
                            {intern.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-2.5 border-t border-slate-800/50">
                        <div>
                          <span className="text-slate-500 block mb-0.5 uppercase tracking-wider font-semibold">Program</span>
                          <span className="text-slate-300 font-medium break-words block">{intern.program}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5 uppercase tracking-wider font-semibold">Department</span>
                          <span className="text-slate-300 font-medium break-words block">{intern.department}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5 uppercase tracking-wider font-semibold">Mentor</span>
                          <span className="text-slate-300 font-medium break-words block">{intern.mentor}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5 uppercase tracking-wider font-semibold">Placement</span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5 ${
                              intern.placement === "Shortlisted"
                                ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                : intern.placement === "Under Review"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : intern.placement === "Placed"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-muted text-foreground border border-border/20"
                            }`}
                          >
                            {intern.placement}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Progress</span>
                          <span className="font-semibold text-slate-200">{intern.progress || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-slate-800/50">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 rounded-full"
                            style={{
                              width: `${intern.progress || 0}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedIntern(intern)}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-750 bg-slate-800/50 text-slate-300 hover:bg-slate-850 hover:text-white transition-all text-xs font-semibold cursor-pointer active:scale-[0.98]"
                        >
                          <UserRound size={14} />
                          <span>View Profile</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedIntern && (
        <InternProfileModal
          intern={selectedIntern}
          onClose={() => setSelectedIntern(null)}
        />
      )}
    </>
  );
}