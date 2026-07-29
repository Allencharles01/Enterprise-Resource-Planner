"use client";

export default function TrainingStatusBadge({ status }) {
  const styles = {
    Active: "training-pill training-pill-blue",
    Completed: "training-pill training-pill-green",
    Certified: "training-pill training-pill-purple",
    Pending: "training-pill training-pill-yellow",
    Cancelled: "training-pill training-pill-red",
  };

  return (
    <span
      className={
        styles[status] ||
        "training-pill bg-muted text-foreground border-border"
      }
    >
      {status}
    </span>
  );
}