"use client";

export default function TrainingProgressBar({ progress }) {
  return (
    <div className="w-full">
      <p className="text-sm font-medium mb-1">{progress}%</p>

      <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-slate-900 dark:bg-violet-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}