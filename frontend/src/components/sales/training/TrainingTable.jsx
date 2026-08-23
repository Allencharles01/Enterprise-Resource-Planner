"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { trainingPrograms } from "./trainingData";
import { api } from "@/lib/api";
import TrainingStatusBadge from "./TrainingStatusBadge";
import TrainingProgressBar from "./TrainingProgressBar";
import TrainingParticipantsModal from "./TrainingParticipantsModal";
import TrainingParticipantProfileModal from "./TrainingParticipantProfileModal";

const getCategoryPillClass = (category) => {
  const styles = {
    Technical: "training-pill training-pill-blue",
    Management: "training-pill training-pill-purple",
    Business: "training-pill training-pill-green",
    Design: "training-pill training-pill-yellow",
    "Soft Skills": "training-pill training-pill-pink",
  };

  return styles[category] || "training-pill bg-muted text-foreground border-border";
};

export default function TrainingTable() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedMobileProgramId, setSelectedMobileProgramId] = useState("");
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [liveCourses, setLiveCourses] = useState([]);
  const [liveCandidates, setLiveCandidates] = useState([]);

  useEffect(() => {
    api
      .get("/api/training/courses")
      .then((res) => setLiveCourses(res.data || []))
      .catch(() => {});

    api
      .get("/api/training/candidates")
      .then((res) => setLiveCandidates(res.data || []))
      .catch(() => {});
  }, []);

  const combinedPrograms = [
    ...trainingPrograms.map((p) => {
      const enrolledCandidates = liveCandidates.filter(
        (c) => c.courseName === p.name
      );

      const totalEnrolled = p.enrolled + enrolledCandidates.length;

      const completedCount =
        p.completed +
        enrolledCandidates.filter((c) => c.status === "Completed").length;

      return {
        ...p,
        enrolled: totalEnrolled,
        completed: completedCount,
        participants: [
          ...(p.participants || []),
          ...enrolledCandidates.map((c) => ({
            id: c._id,
            name: c.name,
            email: c.email,
            contact: c.phone || "N/A",
            progress: c.progress || 0,
            status: c.status || "Active",
            courseName: c.courseName,
            cost: c.cost,
            education: c.education,
            university: c.university,
          })),
        ],
      };
    }),

    ...liveCourses
      .filter((c) => !trainingPrograms.some((tp) => tp.name === c.name))
      .map((c) => {
        const enrolledCandidates = liveCandidates.filter(
          (cand) => cand.courseName === c.name
        );

        return {
          id: c._id,
          name: c.name,
          category: "Technical",
          duration: "8 weeks",
          instructor: "Enterprise Mentor",
          enrolled: enrolledCandidates.length,
          completed: enrolledCandidates.filter(
            (cand) => cand.status === "Completed"
          ).length,
          revenue: `${c.currency || "₹"} ${c.price}`,
          progress:
            enrolledCandidates.length > 0
              ? Math.round(
                  enrolledCandidates.reduce(
                    (acc, curr) => acc + (curr.progress || 0),
                    0
                  ) / enrolledCandidates.length
                )
              : 0,
          status: "Active",
          participants: enrolledCandidates.map((cand) => ({
            id: cand._id,
            name: cand.name,
            email: cand.email,
            contact: cand.phone || "N/A",
            progress: cand.progress || 0,
            status: cand.status || "Active",
            courseName: cand.courseName,
            cost: cand.cost,
            education: cand.education,
            university: cand.university,
          })),
        };
      }),
  ];

  const activeMobileProgram =
    combinedPrograms.find((p) => String(p.id) === String(selectedMobileProgramId)) ||
    combinedPrograms[0];

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className="glass-card rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Training Programs
            </h2>

            <p className="text-sm text-muted-foreground mt-1 md:block hidden">
              Active and completed training sessions · Click Enrolled count to
              see participants
            </p>
            <p className="text-sm text-muted-foreground mt-1 md:hidden block">
              Active and completed training sessions · Select a program to view candidates
            </p>
          </div>
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[1300px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                <th className="py-4 px-4 whitespace-nowrap font-bold">
                  Program
                </th>
                <th className="py-4 px-4 whitespace-nowrap font-bold">
                  Category
                </th>
                <th className="py-4 px-4 whitespace-nowrap font-bold">
                  Duration
                </th>
                <th className="py-4 px-4 whitespace-nowrap font-bold">
                  Instructor
                </th>
                <th className="py-4 px-4 whitespace-nowrap font-bold">
                  Enrolled
                </th>
                <th className="py-4 px-4 whitespace-nowrap font-bold">
                  Completed
                </th>
                <th className="py-4 px-4 whitespace-nowrap font-bold">
                  Revenue
                </th>
                <th className="py-4 px-4 whitespace-nowrap font-bold">
                  Progress
                </th>
                <th className="py-4 px-4 whitespace-nowrap font-bold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/40 text-sm">
              {combinedPrograms.map((program) => (
                <tr
                  key={program.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
                    {program.name}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={getCategoryPillClass(program.category)}>
                      {program.category}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-foreground whitespace-nowrap">
                    {program.duration}
                  </td>

                  <td className="py-4 px-4 text-foreground whitespace-nowrap">
                    {program.instructor}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedProgram(program)}
                      className="font-semibold underline underline-offset-4 text-primary hover:opacity-80 transition"
                    >
                      {program.enrolled}
                    </button>
                  </td>

                  <td className="py-4 px-4 text-foreground whitespace-nowrap">
                    {program.completed}
                  </td>

                  <td className="py-4 px-4 font-bold text-emerald-500 whitespace-nowrap">
                    {program.revenue}
                  </td>

                  <td className="py-4 px-4 min-w-[180px]">
                    <TrainingProgressBar progress={program.progress} />
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <TrainingStatusBadge status={program.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Dropdown Selector & Cards) */}
        <div className="block md:hidden space-y-5">
          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select Training Program
            </label>
            
            {/* Custom Modern Dropdown Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                className="w-full flex items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <span className="truncate">{activeMobileProgram?.name || "Select Training Program"}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 shrink-0 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMobileDropdownOpen && (
                <>
                  {/* Overlay click-away container */}
                  <div 
                    className="fixed inset-0 z-20 cursor-default" 
                    onClick={() => setIsMobileDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 z-30 mt-1 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto">
                    {combinedPrograms.map((program) => (
                      <button
                        key={program.id}
                        type="button"
                        onClick={() => {
                          setSelectedMobileProgramId(program.id);
                          setIsMobileDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          String(program.id) === String(activeMobileProgram?.id)
                            ? "bg-blue-600 text-white font-semibold"
                            : "text-slate-200 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        {program.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {activeMobileProgram && (
            <div className="space-y-5">
              {/* Program Detail Overview Card */}
              <div className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className={getCategoryPillClass(activeMobileProgram.category)}>
                    {activeMobileProgram.category}
                  </span>
                  <TrainingStatusBadge status={activeMobileProgram.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Instructor</span>
                    <span className="font-semibold text-slate-200">{activeMobileProgram.instructor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Duration</span>
                    <span className="font-semibold text-slate-200">{activeMobileProgram.duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Revenue</span>
                    <span className="font-semibold text-emerald-500 font-mono">{activeMobileProgram.revenue}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Enrolled / Completed</span>
                    <span className="font-semibold text-slate-200">{activeMobileProgram.enrolled} / {activeMobileProgram.completed}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400 text-xs block mb-1">Average Progress</span>
                  <TrainingProgressBar progress={activeMobileProgram.progress} />
                </div>
              </div>

              {/* Candidates Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Enrolled Candidates ({activeMobileProgram.participants?.length || 0})
                </h3>

                {(!activeMobileProgram.participants || activeMobileProgram.participants.length === 0) ? (
                  <div className="text-center py-8 bg-slate-800/10 border border-slate-800/50 rounded-2xl text-slate-500 text-sm">
                    No candidates currently enrolled.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {activeMobileProgram.participants.map((candidate) => {
                      const initials = candidate.name
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "CN";

                      const displayStatus =
                        candidate.status === "Enrolled"
                          ? "Active"
                          : candidate.status === "Dropped"
                          ? "Cancelled"
                          : candidate.status || "Active";

                      return (
                        <div
                          key={candidate.id}
                          className="bg-slate-800/30 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-300 space-y-3.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-slate-850 border border-slate-750 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-100 text-sm break-words leading-snug">
                                  {candidate.name}
                                </h4>
                                <p className="text-xs text-slate-400 break-all mt-0.5">
                                  {candidate.email}
                                </p>
                              </div>
                            </div>
                            <div className="shrink-0 pt-0.5">
                              <TrainingStatusBadge status={displayStatus} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-800/50">
                            <div>
                              <span className="text-slate-500 block mb-0.5 uppercase tracking-wider font-semibold">Contact</span>
                              <span className="text-slate-300 font-medium">{candidate.contact}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block mb-0.5 uppercase tracking-wider font-semibold">University</span>
                              <span className="text-slate-300 font-medium block truncate">
                                {candidate.university || "N/A"}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>Progress</span>
                              <span className="font-semibold text-slate-200">{candidate.progress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                style={{ width: `${candidate.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => setSelectedParticipant(candidate)}
                              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-750 bg-slate-800/50 text-slate-300 hover:bg-slate-850 hover:text-white transition-all text-xs font-semibold cursor-pointer active:scale-[0.98]"
                            >
                              <span>View Candidate Profile</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {selectedProgram && (
        <TrainingParticipantsModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}

      {selectedParticipant && activeMobileProgram && (
        <TrainingParticipantProfileModal
          participant={selectedParticipant}
          program={activeMobileProgram}
          onClose={() => setSelectedParticipant(null)}
        />
      )}
    </>
  );
}