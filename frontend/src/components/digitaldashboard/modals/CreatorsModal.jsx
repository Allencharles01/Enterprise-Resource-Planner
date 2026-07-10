import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import CreatorFormModal from "./CreatorFormModal";
import { Users, PieChart } from "lucide-react";
import Modal from "../ui/Modal";
import { creators, statusColors, formatINR } from "../data/mockData";

function StatBox({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/5 dark:bg-white/5">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

export default function CreatorsModal({ open, onClose }) {
  const [tab, setTab] = useState("oneTime");
  const [oneTimeCreators, setOneTimeCreators] = useState(creators.oneTime);
  const [partnershipCreators, setPartnershipCreators] = useState(creators.partnership);

  const [showForm, setShowForm] = useState(false);
  const [editingCreator, setEditingCreator] = useState(null);

  const rows =
    tab === "oneTime"
      ? oneTimeCreators
      : partnershipCreators;
  const allCreators = [
  ...oneTimeCreators,
  ...partnershipCreators,
];

const totalCreators = allCreators.length;

const totalBudget = allCreators.reduce(
  (sum, creator) => sum + Number(creator.amount),
  0
);

const totalReach = allCreators.reduce((sum, creator) => {
  const followers = String(creator.followers)
    .replace(/K/i, "000")
    .replace(/M/i, "000000")
    .replace(/,/g, "");

  return sum + Number(followers);
}, 0);

const engagement = creators.totals.engagement;

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<Users size={22} />}
      iconBg="bg-purple-500"
      title="Content Creators Management"
      subtitle="Manage content creators, payments and partnership details."
      maxWidth="max-w-5xl"
      footer={
        <button onClick={onClose} className="rounded-lg bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-500">
          Close
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox
  label="Total Creators"
  value={totalCreators}
/>
        <StatBox
  label="Total Budget"
  value={formatINR(totalBudget)}
/>
        <StatBox
  label="Total Reach"
  value={totalReach.toLocaleString("en-IN")}
/>
        <StatBox
  label="Avg. Engagement"
  value={`${engagement}%`}
/>
      </div>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => {
            setEditingCreator(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500"
        >
          <Plus size={16} />
          Add Creator
        </button>
      </div>

      <div className="mt-6 flex gap-2 border-b border-gray-100 dark:border-white/5">
        {[
          { key: "oneTime", label: "One Time Creators" },
          { key: "partnership", label: "Partnership Creators" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium ${tab === t.key
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-400 dark:border-white/5 dark:bg-white/5 dark:text-gray-500">
              <th className="px-4 py-2.5 font-medium">Creator Name</th>
              <th className="px-4 py-2.5 font-medium">Platform</th>
              <th className="px-4 py-2.5 font-medium">Followers</th>
              <th className="px-4 py-2.5 font-medium">Content Type</th>
              <th className="px-4 py-2.5 font-medium">Amount Paid</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.handle} className="border-b border-gray-50 last:border-0 dark:border-white/5">
                <td className="px-4 py-3">
  <div className="flex items-center justify-between">

    <div>
      <p className="font-medium text-gray-900 dark:text-white">
        {c.name}
      </p>

      <a
        href={
          c.platform === "Instagram"
            ? `https://instagram.com/${c.handle.replace("@", "")}`
            : `https://youtube.com/@${c.handle.replace("@", "")}`
        }
        target="_blank"
        rel="noreferrer"
        className="text-xs text-blue-500 hover:underline"
      >
        {c.handle}
      </a>
    </div>

    <div className="flex gap-2">

      <button
        onClick={() => {
          setEditingCreator(c);
          setShowForm(true);
        }}
        className="rounded-lg p-2 text-blue-500 hover:bg-blue-500/10"
      >
        <Pencil size={15} />
      </button>

      <button
        onClick={() => {
          if (tab === "oneTime") {
            setOneTimeCreators(
              oneTimeCreators.filter(
                (creator) => creator.handle !== c.handle
              )
            );
          } else {
            setPartnershipCreators(
              partnershipCreators.filter(
                (creator) => creator.handle !== c.handle
              )
            );
          }
        }}
        className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
      >
        <Trash2 size={15} />
      </button>

    </div>

  </div>
</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.platform}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.followers}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.contentType}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{formatINR(c.amount)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center gap-4 rounded-xl border border-gray-100 p-4 dark:border-white/5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500 dark:text-purple-400">
          <PieChart size={20} />
        </div>
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Total Creator Budget Utilized</span>
<span className="font-semibold text-gray-900 dark:text-white">
  {Math.min(
    Math.round((totalBudget / 60000) * 100), // Assuming 60,000 is the total budget limit
    100
  )}%
</span>          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
              style={{ width: `${Math.min(
  Math.round((totalBudget / 60000) * 100), // Assuming 60,000 is the total budget limit
  100
)}%` }}
            />
          </div>
        </div>
      </div>
      <CreatorFormModal
  open={showForm}
  onClose={() => setShowForm(false)}
  editingCreator={editingCreator}
  onSave={(creator) => {
    if (tab === "oneTime") {
      if (editingCreator) {
        setOneTimeCreators(
          oneTimeCreators.map((c) =>
            c.handle === editingCreator.handle ? creator : c
          )
        );
      } else {
        setOneTimeCreators([...oneTimeCreators, creator]);
      }
    } else {
      if (editingCreator) {
        setPartnershipCreators(
          partnershipCreators.map((c) =>
            c.handle === editingCreator.handle ? creator : c
          )
        );
      } else {
        setPartnershipCreators([...partnershipCreators, creator]);
      }
    }

    setEditingCreator(null);
  }}
/>
    </Modal>
  );
}
