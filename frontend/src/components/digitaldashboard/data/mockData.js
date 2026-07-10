export const user = {
  name: "Rahul Sharma",
  initials: "RS",
};

export const metrics = {
  allocatedBudget: { value: 500000, growth: 14.6 },
  spendAmount: { value: 175000, growth: 8.5 },
};

export const companies = [
  {
    id: "nike",
    name: "Nike India",
    revenue: 500000,
    spent: 250000,
    roi: 2.0,
    campaigns: 1,
  },
  {
    id: "zomato",
    name: "Zomato",
    revenue: 320000,
    spent: 180000,
    roi: 1.78,
    campaigns: 1,
  },
  {
    id: "myntra",
    name: "Myntra",
    revenue: 260000,
    spent: 120000,
    roi: 2.17,
    campaigns: 1,
  },
  {
    id: "samsung",
    name: "Samsung India",
    revenue: 340000,
    spent: 160000,
    roi: 2.13,
    campaigns: 1,
  },
  {
    id: "cocacola",
    name: "Coca-Cola",
    revenue: 410000,
    spent: 200000,
    roi: 2.05,
    campaigns: 1,
  },
];

export const monthlySpend = [
  { month: "Jan", value: 120000 },
  { month: "Feb", value: 145000 },
  { month: "Mar", value: 132000 },
  { month: "Apr", value: 168000 },
  { month: "May", value: 190000 },
  { month: "Jun", value: 210000 },
  { month: "Jul", value: 225000 },
  { month: "Aug", value: 205000 },
  { month: "Sep", value: 178000 },
  { month: "Oct", value: 196000 },
  { month: "Nov", value: 220000 },
  { month: "Dec", value: 240000 },
];

export const recentActivity = [
  {
    id: 1,
    title: "Google Ads campaign launched",
    detail: "Search Engine Campaign - Product Launch",
    time: "2h ago",
    type: "advertising",
  },
  {
    id: 2,
    title: "New creator partnership added",
    detail: "TechGuru Official - 15% Revenue Share",
    time: "5h ago",
    type: "creators",
  },
  {
    id: 3,
    title: "Billboard campaign scheduled",
    detail: "Mumbai Highway - 15 Days Campaign",
    time: "1d ago",
    type: "heavyAds",
  },
  {
    id: 4,
    title: "New invoice uploaded",
    detail: "Invoice #INV-2024-1256",
    time: "2d ago",
    type: "invoices",
  },
];

export const assignedProjects = [
  {
    id: 1,
    client: "Nike India",
    projectType: "Product Launch Campaign",
    assignedBy: "Marketing Manager",
    status: "Active",
    budget: 250000,
    deadline: "20 Jul 2026",
    startDate: "10 Jul 2026",
    expectedRevenue: 500000,
    priority: "High",
    description: "Social media and Google Ads campaign for new sneaker launch.",
      module: "Advertising",
  permission: "Google Ads",
  },
  {
    id: 2,
    client: "Zomato",
    projectType: "Creator Campaign",
    assignedBy: "Brand Manager",
    status: "Active",
    budget: 180000,
    deadline: "15 Jul 2026",
    startDate: "01 Jul 2026",
    expectedRevenue: 320000,
    priority: "Medium",
    description: "Influencer-led food discovery campaign across Instagram and YouTube.",
    module: "Creators",
  permission: "Partnership Creators"

  },
  {
    id: 3,
    client: "Myntra",
    projectType: "Heavy Advertisement",
    assignedBy: "Marketing Manager",
    status: "Planning",
    budget: 120000,
    deadline: "25 Jul 2026",
    startDate: "18 Jul 2026",
    expectedRevenue: 260000,
    priority: "Medium",
    description: "Billboard and outdoor advertising for end-of-season sale.",
    module: "Heavy Ads",
  permission: "Billboards"
  },
  {
    id: 4,
    client: "Samsung India",
    projectType: "Product Awareness Campaign",
    assignedBy: "Regional Head",
    status: "Active",
    budget: 160000,
    deadline: "10 Aug 2026",
    startDate: "20 Jul 2026",
    expectedRevenue: 340000,
    priority: "High",
    description: "Multi-channel awareness push for new smartphone lineup.",
    module: "Advertising",
  permission: "Meta Ads"
  },
  {
    id: 5,
    client: "Coca-Cola",
    projectType: "Festival Campaign",
    assignedBy: "Marketing Manager",
    status: "Planning",
    budget: 200000,
    deadline: "05 Aug 2026",
    startDate: "22 Jul 2026",
    expectedRevenue: 410000,
    priority: "High",
    description: "Festive season creator and outdoor advertising push.",
    module: "Invoices",
  permission: "Documents"
  },
];

export const advertising = {
  totals: {
    spend: 125000,
    reach: 524000,
    clicks: 12450,
    ctr: 2.36,
    conversions: 320,
    revenue: 210000,
    roi: 1.68,
  },
  platforms: [
    { name: "Google Ads", sub: "Search & Display", budget: 50000, reach: 210000, clicks: 5240, ctr: 2.49, revenue: 95000, roi: 1.9 },
    { name: "Meta Ads", sub: "Facebook & Instagram", budget: 35000, reach: 185000, clicks: 4150, ctr: 2.24, revenue: 70000, roi: 2.0 },
    { name: "LinkedIn Ads", sub: "Sponsored Content", budget: 20000, reach: 85000, clicks: 1870, ctr: 2.2, revenue: 25000, roi: 1.25 },
    { name: "Twitter Ads", sub: "Promoted Tweets", budget: 20000, reach: 44000, clicks: 1190, ctr: 2.7, revenue: 20000, roi: 1.0 },
  ],
};

export const creators = {
  totals: { totalCreators: 24, totalBudget: 48000, totalReach: 685000, engagement: 8.42 },
  oneTime: [
    { name: "Aman Verma", handle: "@amanverma_tech", platform: "Instagram", followers: "125K", contentType: "Reels + Story", amount: 5000, status: "Paid" },
    { name: "Priya Mehta", handle: "@priyamehtaofficial", platform: "YouTube", followers: "210K", contentType: "YouTube Short", amount: 7000, status: "Paid" },
    { name: "Tech With Rahul", handle: "@techwithrahul", platform: "Instagram", followers: "98K", contentType: "Reels", amount: 4000, status: "Pending" },
    { name: "Ananya Singh", handle: "@ananyasingh_", platform: "Instagram", followers: "76K", contentType: "Story", amount: 3000, status: "Paid" },
    { name: "Vlogs By Karan", handle: "@vlogsbykaran", platform: "YouTube", followers: "155K", contentType: "YouTube Short", amount: 6000, status: "Paid" },
  ],
  partnership: [
    { name: "TechGuru Official", handle: "@techguru", platform: "YouTube", followers: "480K", contentType: "Monthly Series", amount: 15000, status: "Active" },
    { name: "StyleWithSanya", handle: "@stylewithsanya", platform: "Instagram", followers: "310K", contentType: "Brand Ambassador", amount: 12000, status: "Active" },
    { name: "FoodieFables", handle: "@foodiefables", platform: "Instagram", followers: "220K", contentType: "Quarterly Deal", amount: 9000, status: "Active" },
  ],
  budgetUtilized: 82,
};

export const heavyAds = {
  totals: { spend: 210000, profit: 354000, reach: 1280000, avgRoi: 68.2 },
  campaignTypes: ["Billboards", "Sponsorship Deals", "Event Sponsoring", "Outdoor Ads"],
  campaigns: [
    { name: "Delhi Metro Billboard Campaign", type: "Billboards", location: "Delhi Metro Stations", spent: 55000, profit: 90000, reach: 250000, roi: 64, status: "Active" },
    { name: "Tech Conference 2026 Sponsorship", type: "Sponsorship Deals", location: "Bangalore", spent: 80000, profit: 140000, reach: 180000, roi: 75, status: "Active" },
    { name: "Digital Marketing Summit 2026", type: "Event Sponsoring", location: "Mumbai", spent: 45000, profit: 70000, reach: 90000, roi: 55, status: "Scheduled" },
    { name: "City Banner Campaign (North Zone)", type: "Outdoor Ads", location: "Lucknow", spent: 30000, profit: 54000, reach: 65000, roi: 80, status: "Completed" },
    { name: "Highway Billboard Campaign", type: "Billboards", location: "Mumbai Highway", spent: 50000, profit: 100000, reach: 120000, roi: 66, status: "Active" },
  ],
  bestPerforming: {
    name: "Tech Conference 2026 Sponsorship",
    spent: 80000,
    profit: 140000,
    reach: 180000,
    roi: 75,
  },
};

export const invoices = {
  totalDocuments: 28,
  storageUsedGb: 2.4,
  storageTotalGb: 10,
  documents: [
    { name: "Invoice-JN-2024-001.pdf", type: "Invoice", relatedTo: "Google Ads Campaign", date: "18 Jun 2024", status: "Paid" },
    { name: "Contract-CT-012.docx", type: "Contract", relatedTo: "TechGuru Official (Partnership)", date: "14 Jun 2024", status: "Active" },
    { name: "Payment Slip-098.pdf", type: "Payment Record", relatedTo: "CarryMinati (One-Time Payment)", date: "12 Jun 2024", status: "Paid" },
    { name: "Partnership Agreement.docx", type: "Partnership", relatedTo: "MrBeast (Partnership)", date: "10 Jun 2024", status: "Active" },
    { name: "Campaign Report - May.xlsx", type: "Report", relatedTo: "Digital Marketing Team", date: "05 Jun 2024", status: "Reviewed" },
    { name: "Invoice-BILLBOARD-23.pdf", type: "Invoice", relatedTo: "Billboard Campaign", date: "02 Jun 2024", status: "Paid" },
  ],
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