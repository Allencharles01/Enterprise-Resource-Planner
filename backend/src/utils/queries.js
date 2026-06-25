export function textRegex(value) {
  return value ? { $regex: value, $options: "i" } : undefined;
}

export function sortQuery(sortBy = "createdAt", order = "desc") {
  return { [sortBy]: order === "asc" ? 1 : -1 };
}

export function monthStart(monthsAgo) {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCMonth(date.getUTCMonth() - monthsAgo);
  return date;
}
