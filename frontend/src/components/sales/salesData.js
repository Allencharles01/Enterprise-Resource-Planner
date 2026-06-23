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
    project: "E-Commerce Platform",
    client: "TechCorp Inc.",
    budget: "$450K",
    manager: "Sarah Johnson",
    deadline: "15 Jul 2026",
    progress: 75,
    status: "On Track",
  },
  {
    id: 2,
    project: "CRM Dashboard",
    client: "SalesFlow Ltd.",
    budget: "$320K",
    manager: "David Smith",
    deadline: "28 Jul 2026",
    progress: 60,
    status: "At Risk",
  },
  {
    id: 3,
    project: "Mobile Banking App",
    client: "FinSecure",
    budget: "$780K",
    manager: "Emily Brown",
    deadline: "10 Aug 2026",
    progress: 90,
    status: "On Track",
  },
  {
    id: 4,
    project: "HR Management System",
    client: "PeopleFirst",
    budget: "$240K",
    manager: "Michael Lee",
    deadline: "22 Aug 2026",
    progress: 45,
    status: "Delayed",
  },
  {
    id: 5,
    project: "Inventory Portal",
    client: "SupplyChain Pro",
    budget: "$510K",
    manager: "Jessica Wilson",
    deadline: "01 Sep 2026",
    progress: 80,
    status: "On Track",
  },
];