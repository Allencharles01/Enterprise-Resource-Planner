import AdvertisingCampaign from "../models/AdvertisingCampaign.js";
import ContentCreator from "../models/ContentCreator.js";
import HeavyAdvertisement from "../models/HeavyAdvertisement.js";
import Document from "../models/Document.js";
import Activity from "../models/Activity.js";
import { monthStart } from "./queries.js";

async function monthlySeries(model, months, dateField = "createdAt") {
  const start = monthStart(months - 1);
  const rows = await model.aggregate([
    { $match: { [dateField]: { $gte: start } } },
    {
      $group: {
        _id: { year: { $year: `$${dateField}` }, month: { $month: `$${dateField}` } },
        spend: { $sum: "$amountSpent" },
        profit: { $sum: "$profitGenerated" },
        reach: { $sum: "$reach" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  return rows.map((row) => ({
    label: `${row._id.year}-${String(row._id.month).padStart(2, "0")}`,
    spend: row.spend,
    profit: row.profit,
    reach: row.reach
  }));
}

function mergeSeries(...seriesGroups) {
  const merged = new Map();
  for (const series of seriesGroups) {
    for (const item of series) {
      const current = merged.get(item.label) || { label: item.label, spend: 0, profit: 0, reach: 0 };
      current.spend += item.spend;
      current.profit += item.profit;
      current.reach += item.reach;
      merged.set(item.label, current);
    }
  }
  return Array.from(merged.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export async function getMonthlyAnalytics(range = "monthly") {
  const months = range === "weekly" ? 2 : range === "yearly" ? 12 : 6;
  const [advertising, creators, heavyAds] = await Promise.all([
    monthlySeries(AdvertisingCampaign, months),
    monthlySeries(ContentCreator, months),
    monthlySeries(HeavyAdvertisement, months)
  ]);

  return mergeSeries(advertising, creators, heavyAds);
}

export async function getDashboardSummary() {
  const [advertisingSpend, creatorSpend, heavyAdSpend, advertisingProfit, creatorProfit, heavyAdProfit, documentCount, monthlyAnalytics, recentActivities] =
    await Promise.all([
      AdvertisingCampaign.aggregate([{ $group: { _id: null, value: { $sum: "$amountSpent" } } }]),
      ContentCreator.aggregate([{ $group: { _id: null, value: { $sum: "$amountSpent" } } }]),
      HeavyAdvertisement.aggregate([{ $group: { _id: null, value: { $sum: "$amountSpent" } } }]),
      AdvertisingCampaign.aggregate([{ $group: { _id: null, value: { $sum: "$profitGenerated" } } }]),
      ContentCreator.aggregate([{ $group: { _id: null, value: { $sum: "$profitGenerated" } } }]),
      HeavyAdvertisement.aggregate([{ $group: { _id: null, value: { $sum: "$profitGenerated" } } }]),
      Document.countDocuments(),
      getMonthlyAnalytics("monthly"),
      Activity.find().sort({ timestamp: -1 }).limit(8).lean()
    ]);

  const totalSpend = (advertisingSpend[0]?.value || 0) + (creatorSpend[0]?.value || 0) + (heavyAdSpend[0]?.value || 0);
  const totalProfit = (advertisingProfit[0]?.value || 0) + (creatorProfit[0]?.value || 0) + (heavyAdProfit[0]?.value || 0);

  return {
    totalBudget: totalSpend + totalProfit,
    totalSpend,
    creatorBudget: (creatorSpend[0]?.value || 0) + (creatorProfit[0]?.value || 0),
    heavyAdBudget: (heavyAdSpend[0]?.value || 0) + (heavyAdProfit[0]?.value || 0),
    documentCount,
    monthlyAnalytics,
    recentActivities
  };
}
