import { ArrowRight } from "lucide-react";

export default function FeatureCard({ icon, iconBg, title, description, stat, statLabel, onOpen }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50 sm:p-6 dark:border-white/10 dark:bg-[#0B1224] dark:hover:border-white/20 dark:hover:shadow-none">
      <div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${iconBg}`}>
          {icon}
        </div>
        <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500">{statLabel}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{stat}</p>
        </div>
        <button
          onClick={onOpen}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
        >
          Open
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
