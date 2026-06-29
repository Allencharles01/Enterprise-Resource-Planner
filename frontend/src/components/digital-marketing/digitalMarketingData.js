export function inr(value) {
  if (value == null) return "";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  } catch (e) {
    return String(value);
  }
}

export function compact(value) {
  if (value == null) return "";
  try {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(Number(value));
  } catch (e) {
    return String(value);
  }
}

export const summaryJson = {
  user: { name: "Admin", access: "Administrator" },
  budget: {
    totalAllocated: 500000,
    allocatedChange: 14.2,
    spent: 175000,
    spentChange: 8.5,
  },
  modules: [
    {
      id: "advertising",
      title: "Advertising",
      metricLabel: "Spend",
      metricValue: 125000,
      button: "Open",
      labels: ["Reach", "ROI"],
      glow: "blue",
    },
    {
      id: "creators",
      title: "Creators",
      metricLabel: "Paid",
      metricValue: 50000,
      button: "Open",
      labels: ["Top creators"],
      glow: "purple",
    },
    {
      id: "heavyads",
      title: "Heavy Ads",
      metricLabel: "Campaigns",
      metricValue: 12,
      button: "Open",
      labels: ["Events"],
      glow: "orange",
    },
    {
      id: "documents",
      title: "Documents",
      metricLabel: "Files",
      metricValue: 342,
      button: "Open",
      labels: ["Storage"],
      glow: "cyan",
    },
  ],
};

export const analyticsJson = {
  range: "Last 6 Months",
  monthly: [
    { month: "Jan", profit: 22000, spend: 18000 },
    { month: "Feb", profit: 28000, spend: 21000 },
    { month: "Mar", profit: 35000, spend: 26000 },
    { month: "Apr", profit: 42000, spend: 31000 },
    { month: "May", profit: 48000, spend: 38000 },
    { month: "Jun", profit: 56000, spend: 41000 },
  ],
};

export const activitiesJson = {
  items: [
    { id: 1, title: "User signed in", time: "2h ago" },
    { id: 2, title: "Campaign created", time: "1d ago" },
  ],
};

export const advertisingJson = {
  filters: ["All Platforms", "Facebook", "Google"],
  rows: [
    {
      platform: "Facebook",
      amountSpent: 50000,
      profitGenerated: 70000,
      reach: 120000,
      roi: "40%",
      status: "Active",
    },
    {
      platform: "Google",
      amountSpent: 75000,
      profitGenerated: 90000,
      reach: 150000,
      roi: "20%",
      status: "Paused",
    },
  ],
  stats: [
    { label: "Spend", value: 125000 },
    { label: "Profit", value: 160000 },
  ],
  bestPlatform: { name: "Facebook", description: "Highest reach" },
};

export const creatorsJson = {
  platforms: ["YouTube", "Instagram"],
  oneTime: [
    {
      creator: "Alice",
      platform: "YouTube",
      amountSpent: 20000,
      profitGenerated: 30000,
      reach: 50000,
      status: "Active",
    },
  ],
  partnership: [],
  stats: [{ label: "Creators", value: 120 }],
  bottomStats: [{ label: "Top Creator", value: "Alice" }],
};

export const heavyadsJson = {
  filters: ["All", "Outdoor"],
  rows: [
    {
      campaignName: "Summer Fest",
      type: "Outdoor",
      location: "Mall",
      amountSpent: 30000,
      profitGenerated: 45000,
      reach: 20000,
      roi: "50%",
      status: "Active",
    },
  ],
  stats: [{ label: "Campaigns", value: 12 }],
  bestCampaign: { name: "Summer Fest", description: "Highest engagement" },
};

export const documentsJson = {
  tabs: ["All Documents", "Invoices"],
  rows: [
    {
      documentName: "Invoice-001.pdf",
      type: "Invoice",
      relatedTo: "Order-12",
      date: "2026-06-20",
      status: "Approved",
    },
  ],
  types: ["Invoice", "Contract"],
  statuses: ["Approved", "Pending"],
  storage: { label: "40 GB of 100 GB", used: 40 },
};
