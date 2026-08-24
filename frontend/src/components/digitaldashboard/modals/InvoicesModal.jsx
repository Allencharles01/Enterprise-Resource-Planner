import { useState, useEffect } from "react";
import { FolderOpen, Search, Eye, Download, HardDrive } from "lucide-react";
import Modal from "../ui/Modal";
import { invoices, statusColors } from "../data/mockData";

export default function InvoicesModal({ open, onClose }) {
  const [tab, setTab] = useState("All Documents");
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState([]);
  const [storageUsed, setStorageUsed] = useState(invoices.storageUsedGb);
  const [totalDocsCount, setTotalDocsCount] = useState(invoices.totalDocuments);

  useEffect(() => {
    if (open) {
      const isDeleted = typeof window !== "undefined" && localStorage.getItem("marketing_deleted") === "true";
      setDocs(isDeleted ? [] : invoices.documents);
      setStorageUsed(isDeleted ? 0 : invoices.storageUsedGb);
      setTotalDocsCount(isDeleted ? 0 : invoices.totalDocuments);
    }
  }, [open]);

  const filtered = docs.filter((d) => {
    const matchesTab = tab === "All Documents" || d.type === tab.replace(/s$/, "");
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const storagePct = storageUsed && invoices.storageTotalGb ? Math.round((storageUsed / invoices.storageTotalGb) * 100) : 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={<FolderOpen size={22} />}
      iconBg="bg-teal-500"
      title="Invoices & Documents"
      subtitle="Manage all invoices, contracts and related documents in one place."
      maxWidth="max-w-5xl"
      footer={
        <button onClick={onClose} className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-500">
          Close
        </button>
      }
    >
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3 dark:border-white/5">
        {invoices.tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium ${
              tab === t
                ? "bg-teal-600 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-teal-500/20"
          />
        </div>
        <select className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
          <option>All Status</option>
          <option>Paid</option>
          <option>Active</option>
          <option>Reviewed</option>
        </select>
        <input type="date" className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200" />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100 dark:border-white/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-400 dark:border-white/5 dark:bg-white/5 dark:text-gray-500">
              <th className="px-4 py-2.5 font-medium">Document Name</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Related To</th>
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.name} className="border-b border-gray-50 last:border-0 dark:border-white/5">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{d.name}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{d.type}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{d.relatedTo}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{d.date}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[d.status]}`}>{d.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10">
                      <Eye size={13} /> View
                    </button>
                    <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10">
                      <Download size={13} /> Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                  No documents match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 text-teal-500 dark:text-teal-400">
            <HardDrive size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Documents Stored</p>
            <p className="font-semibold text-gray-900 dark:text-white">{totalDocsCount} Files</p>
          </div>
        </div>
        <div className="flex-1 sm:max-w-xs">
          <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Storage Used</span>
            <span>{storageUsed} GB / {invoices.storageTotalGb} GB</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-teal-500" style={{ width: `${storagePct}%` }} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
