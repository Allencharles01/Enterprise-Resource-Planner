import { useState } from "react";
import {
  Tv,
  Trophy,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import HeavyAdsFormModal from "./HeavyAdsFormModal";
import Modal from "../ui/Modal";
import { heavyAds, statusColors, formatINR } from "../data/mockData";

function StatBox({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

export default function HeavyAdsModal({ open, onClose }) {
  const [filter, setFilter] = useState("All Campaigns");
  const [campaigns, setCampaigns] = useState(heavyAds.campaigns);

const [showForm, setShowForm] = useState(false);
const [editingCampaign, setEditingCampaign] = useState(null);

const { campaignTypes, bestPerforming } = heavyAds;
const totals = {
  spend: campaigns.reduce((s, c) => s + Number(c.spent), 0),

  profit: campaigns.reduce((s, c) => s + Number(c.profit), 0),

  reach: campaigns.reduce((s, c) => s + Number(c.reach), 0),

  avgRoi:
    (
      campaigns.reduce((s, c) => s + Number(c.roi), 0) /
      campaigns.length
    ).toFixed(1),
};
  const filtered = filter === "All Campaigns" ? campaigns : campaigns.filter((c) => c.type === filter);

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<Tv size={22} />}
      iconBg="bg-orange-500"
      title="Heavy Advertisement Management"
      subtitle="Manage and analyze large scale offline advertising campaigns."
      maxWidth="max-w-5xl"
      footer={
        <button onClick={onClose} className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-400">
          Close
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox label="Total Spend" value={formatINR(totals.spend)} />
        <StatBox label="Total Profit Generated" value={formatINR(totals.profit)} />
        <StatBox label="Reach" value={totals.reach.toLocaleString("en-IN")} />
        <StatBox label="Average ROI" value={`${totals.avgRoi}%`} />
      </div>

      <div className="mt-5 mb-4 flex items-center justify-between flex-wrap gap-3">

  <button
    onClick={() => {
      setEditingCampaign(null);
      setShowForm(true);
    }}
    className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-400"
  >
    <Plus size={16} />
    Add Campaign
  </button>

  <div className="flex flex-wrap gap-2">

    {["All Campaigns", ...campaignTypes].map((t) => (
      <button
        key={t}
        onClick={() => setFilter(t)}
        className={`...`}
      >
        {t}
      </button>
    ))}

  </div>
</div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-400 dark:border-white/5 dark:bg-white/5 dark:text-gray-500">
              <th className="px-4 py-2.5 font-medium">Campaign Name</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Location</th>
              <th className="px-4 py-2.5 font-medium">Spent</th>
              <th className="px-4 py-2.5 font-medium">Profit</th>
              <th className="px-4 py-2.5 font-medium">Reach</th>
              <th className="px-4 py-2.5 font-medium">ROI</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.name} className="border-b border-gray-50 last:border-0 dark:border-white/5">
                <td className="px-4 py-3">
  <div className="flex items-center justify-between">

    <span className="font-medium text-gray-900 dark:text-white">
      {c.name}
    </span>

    <div className="flex gap-2">

      <button
        onClick={() => {
          setEditingCampaign(c);
          setShowForm(true);
        }}
        className="rounded-lg p-2 text-blue-500 hover:bg-blue-500/10"
      >
        <Pencil size={15} />
      </button>

      <button
        onClick={() =>
          setCampaigns(
            campaigns.filter(
              (item) => item.name !== c.name
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
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.type}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.location}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatINR(c.spent)}</td>
                <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">{formatINR(c.profit)}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.reach.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{c.roi}%</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-xl border border-orange-200 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-orange-500/20 dark:bg-orange-500/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
            <Trophy size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Best Performing Campaign</p>
            <p className="font-semibold text-gray-900 dark:text-white">{bestPerforming.name}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Amount Spent</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatINR(bestPerforming.spent)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Profit Generated</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatINR(bestPerforming.profit)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Reach</p>
            <p className="font-medium text-gray-900 dark:text-white">{bestPerforming.reach.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">ROI</p>
            <p className="font-medium text-orange-500">{bestPerforming.roi}%</p>
          </div>
        </div>
      </div>
      <HeavyAdsFormModal
  open={showForm}
  onClose={() => setShowForm(false)}
  editingCampaign={editingCampaign}
  onSave={(campaign) => {

    if (editingCampaign) {

      setCampaigns(
        campaigns.map((c) =>
          c.name === editingCampaign.name
            ? campaign
            : c
        )
      );

    } else {

      setCampaigns([
        ...campaigns,
        campaign,
      ]);

    }

    setEditingCampaign(null);
  }}
/>
    </Modal>
  );
}
