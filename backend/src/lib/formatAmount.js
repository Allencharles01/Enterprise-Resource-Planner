/**
 * Formats numeric values and currency strings using comma separator (e.g. 1,25,000).
 */
export function formatAmount(val) {
  if (val === null || val === undefined || val === "") return "";
  let str = String(val);

  str = str.replace(/(\d),(?=\d)/g, "$1");

  return str.replace(/\b(\d+)(\.\d+)?\b/g, (match, integerPart, decimalPart = "") => {
    if (integerPart.length <= 3) return match;
    const lastThree = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
    const formattedOther = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return `${formattedOther},${lastThree}${decimalPart}`;
  });
}

export default formatAmount;
