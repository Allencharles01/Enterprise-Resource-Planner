"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { trainingPrograms } from "./trainingData";
import { api } from "@/lib/api";
import TrainingStatusBadge from "./TrainingStatusBadge";
import TrainingProgressBar from "./TrainingProgressBar";
import TrainingParticipantsModal from "./TrainingParticipantsModal";

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

            <p className="text-sm text-muted-foreground mt-1">
              Active and completed training sessions · Click Enrolled count to
              see participants
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
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