// src/components/sales/salesData.js
import {
  Briefcase,
  DollarSign,
  TrendingUp,
} from "lucide-react";


export const statsData = [
  {
    title: "Total Client Projects",
    value: "24",
    change: "+12%",
    subtitle: "vs last month",
    color: "amber",
    icon: Briefcase,
  },
  {
    title: "Total Revenue Till Date",
    value: "$2.85M",
    change: "+18%",
    subtitle: "YoY Growth",
    color: "emerald",
    icon: DollarSign,
  },
  {
    title: "Current Month Revenue",
    value: "$385K",
    change: "+8%",
    subtitle: "Monthly Growth",
    color: "rose",
    icon: TrendingUp,
  },
];

export const projectsData = [
  {
    id: 1,
    project: "Enterprise CRM System",
    client: "TechCorp Industries",
    budget: "$450K",
    manager: "Sarah Johnson",
    deadline: "01 Jul 2026",
    progress: 75,
    status: "On Track",

    agreed: "$450,000",
    received: "$337,500",
    remaining: "$112,500",

    services: [
      "CRM Development",
      "API Integration",
      "User Training",
      "Support SLA",
    ],

    payments: [
      {
        title: "Initial Deposit (25%)",
        date: "15 Jan 2026",
        amount: "$112,500",
      },
      {
        title: "Milestone 1 - Requirements Sign-off",
        date: "10 Mar 2026",
        amount: "$112,500",
      },
      {
        title: "Milestone 2 - Development Phase",
        date: "20 May 2026",
        amount: "$112,500",
      },
    ],
  },

  {
    id: 2,
    project: "Mobile Banking App",
    client: "FinanceFirst Bank",
    budget: "$780K",
    manager: "David Smith",
    deadline: "28 Jul 2026",
    progress: 60,
    status: "At Risk",

    agreed: "$780,000",
    received: "$468,000",
    remaining: "$312,000",

    services: [
      "Mobile App Development",
      "Security Audit",
      "Payment Gateway",
      "Testing",
    ],

    payments: [
      {
        title: "Initial Deposit",
        date: "05 Feb 2026",
        amount: "$195,000",
      },
      {
        title: "UI/UX Approval",
        date: "10 Apr 2026",
        amount: "$156,000",
      },
      {
        title: "Development Milestone",
        date: "12 Jun 2026",
        amount: "$117,000",
      },
    ],
  },

  {
    id: 3,
    project: "E-Commerce Platform",
    client: "RetailMax Corp",
    budget: "$320K",
    manager: "Emily Brown",
    deadline: "10 Aug 2026",
    progress: 90,
    status: "On Track",

    agreed: "$320,000",
    received: "$288,000",
    remaining: "$32,000",

    services: [
      "Web Development",
      "Inventory Integration",
      "Payment Gateway",
      "SEO Optimization",
    ],

    payments: [
      {
        title: "Advance Payment",
        date: "10 Jan 2026",
        amount: "$96,000",
      },
      {
        title: "Development Completion",
        date: "15 Apr 2026",
        amount: "$96,000",
      },
      {
        title: "Testing & Deployment",
        date: "12 Jun 2026",
        amount: "$96,000",
      },
    ],
  },

  {
    id: 4,
    project: "AI Analytics Dashboard",
    client: "DataVision Inc",
    budget: "$240K",
    manager: "Michael Lee",
    deadline: "22 Aug 2026",
    progress: 45,
    status: "Delayed",

    agreed: "$240,000",
    received: "$108,000",
    remaining: "$132,000",

    services: [
      "AI Model Integration",
      "Dashboard Development",
      "Reporting Tools",
    ],

    payments: [
      {
        title: "Project Kickoff",
        date: "12 Feb 2026",
        amount: "$60,000",
      },
      {
        title: "Data Pipeline Setup",
        date: "15 Apr 2026",
        amount: "$48,000",
      },
    ],
  },

  {
    id: 5,
    project: "Supply Chain Management",
    client: "LogisticsPro LLC",
    budget: "$510K",
    manager: "Jessica Wilson",
    deadline: "01 Sep 2026",
    progress: 80,
    status: "On Track",

    agreed: "$510,000",
    received: "$408,000",
    remaining: "$102,000",

    services: [
      "ERP Integration",
      "Warehouse Management",
      "Analytics Module",
      "Training",
    ],

    payments: [
      {
        title: "Initial Contract",
        date: "10 Jan 2026",
        amount: "$153,000",
      },
      {
        title: "Implementation Phase",
        date: "15 Apr 2026",
        amount: "$153,000",
      },
      {
        title: "Go Live",
        date: "20 Jun 2026",
        amount: "$102,000",
      },
    ],
  },
];