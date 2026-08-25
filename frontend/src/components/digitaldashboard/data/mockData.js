export const user = {
  name: "User",
  initials: "U",
};

export const metrics = {
  allocatedBudget: { value: 0, growth: 0 },
  spendAmount: { value: 0, growth: 0 },
};

export const companies = [];

export const monthlySpend = [];

export const recentActivity = [];

export const assignedProjects = [];

export const advertising = {
  totals: {
    spend: 0,
    reach: 0,
    clicks: 0,
    ctr: 0,
    conversions: 0,
    revenue: 0,
    roi: 0,
  },
  platforms: [],
};

export const creators = {
  totals: { totalCreators: 0, totalBudget: 0, totalReach: 0, engagement: 0 },
  oneTime: [],
  partnership: [],
  budgetUtilized: 0,
};

export const heavyAds = {
  totals: { spend: 0, profit: 0, reach: 0, avgRoi: 0 },
  campaignTypes: ["Billboards", "Sponsorship Deals", "Event Sponsoring", "Outdoor Ads"],
  campaigns: [],
  bestPerforming: null,
};

export const invoices = {
  totalDocuments: 0,
  storageUsedGb: 0,
  storageTotalGb: 10,
  documents: [],
  tabs: ["All Documents", "Invoices", "Contracts", "Payment Records", "Partnership Agreements"],
};

export const statusColors = {
  Paid: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Active: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Planning: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  Reviewed: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  Completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Scheduled: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
};

export const formatINR = (n) =>
  "₹" + Number(n).toLocaleString("en-IN");

export const employees = [
  {
    id: 1,
    name: "Aman Verma",
    role: "Marketing Executive",
    online: true,
    lastMessage: "Campaign report is ready.",
    time: "2m ago",
    messages: [
      { sender: "Aman", text: "Hi Rahul!", time: "10:20 AM" },
      { sender: "You", text: "Hello Aman.", time: "10:21 AM" },
      { sender: "Aman", text: "Campaign report is ready.", time: "10:22 AM" },
    ],
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "Content Strategist",
    online: false,
    lastMessage: "Let's discuss tomorrow.",
    time: "25m ago",
    messages: [
      { sender: "Priya", text: "Can we meet tomorrow?", time: "9:45 AM" },
      { sender: "You", text: "Sure.", time: "9:47 AM" },
    ],
  },
  {
    id: 3,
    name: "Rohit Sharma",
    role: "SEO Executive",
    online: true,
    lastMessage: "Keyword report updated.",
    time: "1h ago",
    messages: [
      { sender: "Rohit", text: "Keyword report updated.", time: "8:30 AM" },
    ],
  },
];
export const deadlineNotifications = [
  {
    id: 1,
    client: "Nike India",
    task: "Google Ads Campaign",
    due: "Tomorrow",
    priority: "high",
    read: false,
  },
  {
    id: 2,
    client: "Zomato",
    task: "Creator Video Approval",
    due: "2 Days",
    priority: "medium",
    read: false,
  },
  {
    id: 3,
    client: "Myntra",
    task: "Heavy Advertisement Banner",
    due: "5 Days",
    priority: "low",
    read: true,
  },
  {
    id: 4,
    client: "Samsung India",
    task: "Product Launch Campaign",
    due: "8 July 2026",
    priority: "medium",
    read: false,
  },
];