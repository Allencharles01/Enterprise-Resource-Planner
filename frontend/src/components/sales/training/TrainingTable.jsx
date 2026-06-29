"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { trainingPrograms } from "./trainingData";
import { api } from "@/lib/api";
import TrainingStatusBadge from "./TrainingStatusBadge";
import TrainingProgressBar from "./TrainingProgressBar";
import TrainingParticipantsModal from "./TrainingParticipantsModal";

export default function TrainingTable() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [liveCourses, setLiveCourses] = useState([]);
  const [liveCandidates, setLiveCandidates] = useState([]);

  useEffect(() => {
    api.get("/api/training/courses").then((res) => setLiveCourses(res.data || [])).catch(() => {});
    api.get("/api/training/candidates").then((res) => setLiveCandidates(res.data || [])).catch(() => {});
  }, []);

  // Merge live database courses with seed static programs
  const combinedPrograms = [
    ...trainingPrograms.map((p) => {
      const enrolledCandidates = liveCandidates.filter((c) => c.courseName === p.name);
      const totalEnrolled = p.enrolled + enrolledCandidates.length;
      const completedCount = p.completed + enrolledCandidates.filter((c) => c.status === "Completed").length;
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
            status: c.status || "Enrolled",
            courseName: c.courseName,
            cost: c.cost,
            education: c.education,
            university: c.university,
          })),
        ],
      };
    }),
    ...liveCourses.filter((c) => !trainingPrograms.some((tp) => tp.name === c.name)).map((c) => {
      const enrolledCandidates = liveCandidates.filter((cand) => cand.courseName === c.name);
      return {
        id: c._id,
        name: c.name,
        category: "Technical",
        duration: "8 weeks",
        instructor: "Enterprise Mentor",
        enrolled: enrolledCandidates.length,
        completed: enrolledCandidates.filter((cand) => cand.status === "Completed").length,
        revenue: `${c.currency || "₹"} ${c.price}`,
        progress: enrolledCandidates.length > 0 ? Math.round(enrolledCandidates.reduce((acc, curr) => acc + (curr.progress || 0), 0) / enrolledCandidates.length) : 0,
        status: "Active",
        participants: enrolledCandidates.map((cand) => ({
          id: cand._id,
          name: cand.name,
          email: cand.email,
          contact: cand.phone || "N/A",
          progress: cand.progress || 0,
          status: cand.status || "Enrolled",
          courseName: cand.courseName,
          cost: cand.cost,
          education: cand.education,
          university: cand.university,
        })),
      };
    }),
  ];

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-3xl border border-gray-200 bg-white shadow-sm dark:bg-white/5 dark:border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-semibold text-foreground">
            Training Programs
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Active and completed training sessions · Click Enrolled count to see participants
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-white/10">
              <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4 min-w-[260px]">Program</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 min-w-[100px]">Duration</th>
                <th className="px-6 py-4 min-w-[160px]">Instructor</th>
                <th className="px-6 py-4">Enrolled</th>
                <th className="px-6 py-4">Completed</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {combinedPrograms.map((program) => (
                <tr
                  key={program.id}
                  className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
                >
                  <td className="px-6 py-5 font-medium min-w-[260px] whitespace-nowrap text-foreground">
                    {program.name}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap
                        ${
                          program.category === "Technical"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : program.category === "Management"
                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            : program.category === "Business"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : program.category === "Design"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : program.category === "Soft Skills"
                            ? "bg-pink-500/10 text-pink-500 border-pink-500/20"
                            : "bg-muted text-foreground border-border"
                        }
                      `}
                    >
                      {program.category}
                    </span>
                  </td>

                  <td className="px-6 py-5 min-w-[100px] whitespace-nowrap text-foreground">
                    {program.duration}
                  </td>

                  <td className="px-6 py-5 min-w-[160px] whitespace-nowrap text-foreground">
                    {program.instructor}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() => setSelectedProgram(program)}
                      className="font-semibold underline underline-offset-4 text-primary hover:opacity-80 transition"
                    >
                      {program.enrolled}
                    </button>
                  </td>

                  <td className="px-6 py-5 text-foreground">
                    {program.completed}
                  </td>

                  <td className="px-6 py-5 font-medium text-emerald-500">
                    {program.revenue}
                  </td>

                  <td className="px-6 py-5 min-w-[160px]">
                    <TrainingProgressBar progress={program.progress} />
                  </td>

                  <td className="px-6 py-5">
                    <TrainingStatusBadge status={program.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {selectedProgram && (
        <TrainingParticipantsModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </>
  );
}