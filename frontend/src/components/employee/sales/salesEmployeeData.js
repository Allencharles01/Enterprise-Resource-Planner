import { Target, IndianRupee, TrendingUp } from "lucide-react";

export const employeeInfo = {
  name: "Rahul Sharma",
  initials: "RS",
  role: "Senior Sales Executive",
  id: "EMP001",
  status: "Active",
  month: "June 2026",
};

export const tabs = ["Client Projects", "Internships", "Training"];

export const employeeStats = {
  "Client Projects": [
    {
      title: "Total Active Leads",
      value: "0",
      change: "0%",
      subtitle: "No leads recorded",
      icon: Target,
      color: "rose",
    },
    {
      title: "Revenue Pipeline",
      value: "₹0",
      change: "0%",
      subtitle: "No revenue generated",
      icon: IndianRupee,
      color: "purple",
    },
    {
      title: "Conversion Rate",
      value: "0%",
      change: "0%",
      subtitle: "No conversions yet",
      icon: TrendingUp,
      color: "red",
    },
  ],

  Internships: [
    {
      title: "Total Candidates Brought",
      value: "0",
      change: "0",
      subtitle: "No candidates recorded",
      icon: Target,
      color: "cyan",
    },
    {
      title: "Total Fee Collected",
      value: "₹0",
      change: "0%",
      subtitle: "No fees collected",
      icon: IndianRupee,
      color: "blue",
    },
    {
      title: "Placement Rate",
      value: "0%",
      change: "0%",
      subtitle: "No placements yet",
      icon: TrendingUp,
      color: "indigo",
    },
  ],

  Training: [
    {
      title: "Total Trainings Brought",
      value: "0",
      change: "0",
      subtitle: "No trainings recorded",
      icon: Target,
      color: "amber",
    },
    {
      title: "Training Revenue",
      value: "₹0",
      change: "0%",
      subtitle: "No revenue generated",
      icon: IndianRupee,
      color: "orange",
    },
    {
      title: "Completion Rate",
      value: "0%",
      change: "0%",
      subtitle: "No completions yet",
      icon: TrendingUp,
      color: "emerald",
    },
  ],
};

export const monthlyData = {
  "Client Projects": [
    {
      month: "June 2026",
      badge: "Current",
      records: [],
    },
    {
      month: "May 2026",
      badge: "Previous",
      records: [],
    },
  ],

  Internships: [
    {
      month: "June 2026",
      badge: "Current",
      records: [],
    },
    {
      month: "May 2026",
      badge: "Previous",
      records: [],
    },
  ],

  Training: [
    {
      month: "June 2026",
      badge: "Current",
      records: [],
    },
    {
      month: "May 2026",
      badge: "Previous",
      records: [],
    },
  ],
};