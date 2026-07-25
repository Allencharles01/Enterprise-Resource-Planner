/**
 * Formats any amount into a clean rupee format.
 * Examples:
 * "USD Below ₹50,000" -> "₹50,000"
 * "USD 25,000" -> "₹25,000"
 * "INR INR 25,000" -> "₹25,000"
 * "USD 0" -> "₹0"
 */
export function formatAmount(val) {
  if (val === null || val === undefined || val === "") return "₹0";

  const str = String(val).trim();

  const numberMatch = str.match(/-?\d[\d,]*(?:\.\d+)?/);

  if (!numberMatch) return "₹0";

  const numericValue = Number(numberMatch[0].replace(/,/g, ""));

  if (Number.isNaN(numericValue)) return "₹0";

  return `₹${Math.abs(numericValue).toLocaleString("en-IN")}`;
}

export default formatAmount;