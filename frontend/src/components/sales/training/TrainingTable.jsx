"use client";

import { motion } from "framer-motion";
import { trainingPrograms } from "./trainingData";
import TrainingStatusBadge from "./TrainingStatusBadge";
import TrainingProgressBar from "./TrainingProgressBar";

export default function TrainingTable() {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-3xl border border-gray-200 bg-white shadow-sm dark:bg-white/5 dark:border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10">
        <h2 className="text-xl font-semibold">
          Training Programs
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of all training sessions
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 dark:border-white/10">
            <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
              <th className="px-6 py-4">Program</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Instructor</th>
              <th className="px-6 py-4">Enrolled</th>
              <th className="px-6 py-4">Completed</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {trainingPrograms.map((program) => (
              <tr
                key={program.id}
                className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
              >
                <td className="px-6 py-5 font-medium">
                  {program.name}
                </td>

                <td className="px-6 py-5 text-gray-500 dark:text-gray-400">
                  {program.category}
                </td>

                <td className="px-6 py-5">
                  {program.duration}
                </td>

                <td className="px-6 py-5">
                  {program.instructor}
                </td>

                <td className="px-6 py-5">
                  {program.enrolled}
                </td>

                <td className="px-6 py-5">
                  {program.completed}
                </td>

                <td className="px-6 py-5 font-medium">
                  {program.revenue}
                </td>

                <td className="px-6 py-5 min-w-[160px]">
                  <TrainingProgressBar
                    progress={program.progress}
                  />
                </td>

                <td className="px-6 py-5">
                  <TrainingStatusBadge
                    status={program.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}