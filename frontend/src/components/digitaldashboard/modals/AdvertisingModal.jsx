import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import AdvertisingFormModal from "./AdvertisingFormModal";
import Modal from "../ui/Modal";
import { DonutChart } from "../Charts";
import { advertising, formatINR } from "../data/mockData";

const donutColors = ["#3B82F6", "#8B5CF6", "#10B981", "#F97316"];

function StatBox({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{sub}</p>}
    </div>
  );
}

export default function AdvertisingModal({ open, onClose, project,}) {
  const [platforms, setPlatforms] = useState(advertising.platforms);

const [showForm, setShowForm] = useState(false);
const [editingPlatform, setEditingPlatform] = useState(null);
const totals = {
  spend: platforms.reduce((s, p) => s + Number(p.budget), 0),

  reach: platforms.reduce((s, p) => s + Number(p.reach), 0),

  clicks: platforms.reduce((s, p) => s + Number(p.clicks), 0),

  ctr:
    Math.round(
      platforms.reduce((s, p) => s + Number(p.ctr), 0) /
        platforms.length
    ) || 0,

  conversions: advertising.totals.conversions,

  revenue: platforms.reduce(
    (s, p) => s + Number(p.revenue),
    0
  ),

  roi:
    (
      platforms.reduce((s, p) => s + Number(p.roi), 0) /
      platforms.length
    ).toFixed(1),
};
  const donutData = platforms.map((p, i) => ({ value: p.budget, color: donutColors[i] }));
  const totalBudget = platforms.reduce((s, p) => s + p.budget, 0);
  

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<Megaphone size={22} />}
      iconBg="bg-blue-500"
      title="Advertising Management"
      subtitle="Track and analyze advertising performance across all platforms."
      maxWidth="max-w-5xl"
      footer={
        <button onClick={onClose} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-500">
          Close
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox label="Total Spend" value={formatINR(totals.spend)} />
        <StatBox label="Total Reach" value={totals.reach.toLocaleString("en-IN")} />
        <StatBox label="Total Clicks" value={totals.clicks.toLocaleString("en-IN")} />
        <StatBox label="Avg. CTR" value={`${totals.ctr}%`} />
        <StatBox label="Conversions" value={totals.conversions} />
        <StatBox label="Revenue Generated" value={formatINR(totals.revenue)} />
        <StatBox label="ROI" value={`${totals.roi}x`} />
      </div>
      <div className="mb-4 flex justify-end">
  <button
    onClick={() => {
      setEditingPlatform(null);
      setShowForm(true);
    }}
    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
  >
    <Plus size={16} />
    Add Advertising
  </button>
</div>

      <h3 className="mb-3 mt-6 text-sm font-semibold text-gray-900 dark:text-white">Platform Performance</h3>
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-400 dark:border-white/5 dark:bg-white/5 dark:text-gray-500">
              <th className="px-4 py-2.5 font-medium">Platform</th>
              <th className="px-4 py-2.5 font-medium">Budget</th>
              <th className="px-4 py-2.5 font-medium">Reach</th>
              <th className="px-4 py-2.5 font-medium">Clicks</th>
              <th className="px-4 py-2.5 font-medium">CTR</th>
              <th className="px-4 py-2.5 font-medium">Revenue</th>
              <th className="px-4 py-2.5 font-medium">ROI</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((p) => (
              <tr key={p.name} className="border-b border-gray-50 last:border-0 dark:border-white/5">
                <td className="px-4 py-3">
  <div className="flex items-center justify-between">

    <div>
      <p className="font-medium text-gray-900 dark:text-white">
        {p.name}
      </p>

      <p className="text-xs text-gray-400 dark:text-gray-500">
        {p.sub}
      </p>
    </div>

    <div className="flex gap-2">

      <button
        onClick={() => {
          setEditingPlatform(p);
          setShowForm(true);
        }}
        className="rounded-lg p-2 text-blue-500 hover:bg-blue-500/10"
      >
        <Pencil size={15} />
      </button>

      <button
        onClick={() =>
          setPlatforms(
            platforms.filter(
              (item) => item.name !== p.name
            )
          )
        }
        className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
      >
        <Trash2 size={15} />
      </button>

    </div>

  </div>
</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatINR(p.budget)}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.reach.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.clicks.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.ctr}%</td>
                <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">{formatINR(p.revenue)}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.roi}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 rounded-xl border border-gray-100 p-5 sm:flex-row dark:border-white/5">
        <DonutChart data={donutData} />
        <div className="flex-1 space-y-2 w-full">
          <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Spend Distribution</p>
          {platforms.map((p, i) => (
            <div key={p.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: donutColors[i] }} />
                {p.name}
              </span>
              <span className="text-gray-400 dark:text-gray-500">{Math.round((p.budget / totalBudget) * 100)}%</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatINR(p.budget)}</span>
            </div>
          ))}
        </div>
      </div>
      <AdvertisingFormModal
  open={showForm}
  onClose={() => setShowForm(false)}
  editingPlatform={editingPlatform}
  onSave={(platform) => {

    if (editingPlatform) {

      setPlatforms(
        platforms.map((p) =>
          p.name === editingPlatform.name
            ? platform
            : p
        )
      );

    } else {

      setPlatforms([
        ...platforms,
        platform,
      ]);

    }

    setEditingPlatform(null);
  }}
/>
    </Modal>
  );
}
