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
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-[#0B1224]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.12]"
        style={{ background: `radial-gradient(circle at 85% 20%, ${color}, transparent 60%)` }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})` }}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
              {formatINR(value)}
            </p>
            <div className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-500">
              <ArrowUpRight size={14} />
              {growth}% from last month
            </div>
          </div>
        </div>
        <div className="h-16 w-28 shrink-0 sm:h-20 sm:w-36">
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
