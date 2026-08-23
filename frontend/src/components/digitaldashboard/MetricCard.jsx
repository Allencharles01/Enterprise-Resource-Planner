import { ArrowUpRight, Wallet, TrendingUp } from "lucide-react";
import { MiniLineChart, MiniBarChart } from "./Charts";
import { formatINR } from "./data/mockData";

export default function MetricCard({
  label,
  value,
  growth,
  chartType = "line",
  chartData,
  color,
  icon,
  accentFrom,
  accentTo,
}) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 dark:border-white/10 dark:bg-[#0B1224] shadow-sm">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.12]"
        style={{ background: `radial-gradient(circle at 85% 20%, ${color}, transparent 60%)` }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
          >
            {icon}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-none">{label}</p>
            <p className="mt-1 text-lg font-extrabold text-gray-900 sm:text-2xl dark:text-white leading-none">
              {value}
            </p>
            <div className="mt-1 flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold text-emerald-500">
              <ArrowUpRight size={12} className="shrink-0" />
              <span>{growth}% from last month</span>
            </div>
          </div>
        </div>
        <div className="h-12 w-20 shrink-0 sm:h-16 sm:w-28">
          {chartType === "line" ? (
            <MiniLineChart data={chartData} color={color} />
          ) : (
            <MiniBarChart data={chartData} color={color} />
          )}
        </div>
      </div>
    </div>
  );
}

export const metricIcons = { Wallet, TrendingUp };
