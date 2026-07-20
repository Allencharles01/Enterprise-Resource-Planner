export default function StatusBadge({ status }) {
  const styles = {
    "On Track": "sales-status-on-track",
    "At Risk": "sales-status-at-risk",
    Delayed: "sales-status-delayed",
  };

  return (
    <span className={`sales-status-badge ${styles[status] || ""}`}>
      {status}
    </span>
  );
}