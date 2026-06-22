// src/components/sales/StatusBadge.jsx

export default function StatusBadge({ status }) {
  const styles = {
    Completed:
      "bg-green-500/10 text-green-600 border-green-500/20",
    "In Progress":
      "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Pending:
      "bg-amber-500/10 text-amber-600 border-amber-500/20",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        styles[status] || "bg-muted text-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
}