// utils/phoneFormatter.js

/**
 * Formats seconds into MM:SS
 * Example:
 * 65 -> 01:05
 */
export function formatCallDuration(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Returns initials from a name.
 * Example:
 * "Kanak Mehta" -> KM
 * "John" -> J
 */
export function getInitials(name = "") {
  if (!name) return "?";

  const words = name
    .trim()
    .split(" ")
    .filter(Boolean);

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();
}

/**
 * Formats phone number for display.
 * Doesn't change the actual value.
 */
export function formatPhoneNumber(phone = "") {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  return phone;
}

/**
 * Removes everything except numbers.
 */
export function cleanPhoneNumber(phone = "") {
  return phone.replace(/\D/g, "");
}

/**
 * Simple validation.
 */
export function isValidPhoneNumber(phone = "") {
  const digits = cleanPhoneNumber(phone);

  return digits.length >= 10;
}

/**
 * Returns today's date.
 */
export function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Returns time.
 */
export function formatTime(date) {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Date + Time together.
 */
export function formatDateTime(date) {
  if (!date) return "";

  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * Generates avatar color from name.
 */
export function getAvatarColor(name = "") {
  const colors = [
    "bg-violet-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }

  return colors[hash % colors.length];
}

/**
 * Returns status color classes.
 */
export function getStatusColor(status = "") {
  switch (status.toLowerCase()) {
    case "answered":
      return "bg-green-100 text-green-700";

    case "unanswered":
      return "bg-yellow-100 text-yellow-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    case "call later":
      return "bg-blue-100 text-blue-700";

    case "failed":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

/**
 * Formats bytes.
 */
export function formatFileSize(bytes = 0) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
    " " +
    sizes[i]
  );
}