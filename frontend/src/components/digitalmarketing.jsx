import { useState, useRef, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";

// ─── THEME ───────────────────────────────────────────────────────────────────
const DARK = {
  bg: "#020817", bg2: "#061224", card: "#081427", modal: "#0B1426",
  border: "rgba(59,130,246,0.25)", borderHover: "rgba(59,130,246,0.5)",
  text: "#FFFFFF", textSec: "#94A3B8", textMuted: "#64748B",
  blue: "#2563EB", purple: "#8B5CF6", orange: "#F97316", cyan: "#06B6D4",
  green: "#10B981", red: "#EF4444",
};
const LIGHT = {
  bg: "#F8FAFC", bg2: "#EFF6FF", card: "#FFFFFF", modal: "#FFFFFF",
  border: "#CBD5E1", borderHover: "#93C5FD",
  text: "#0F172A", textSec: "#475569", textMuted: "#94A3B8",
  blue: "#2563EB", purple: "#8B5CF6", orange: "#F97316", cyan: "#06B6D4",
  green: "#10B981", red: "#EF4444",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const monthlyData = [
  { month: "Jan", spend: 50000 }, { month: "Feb", spend: 80000 },
  { month: "Mar", spend: 110000 }, { month: "Apr", spend: 130000 },
  { month: "May", spend: 125000 }, { month: "Jun", spend: 210000 },
  { month: "Jul", spend: 230000 }, { month: "Aug", spend: 160000 },
  { month: "Sep", spend: 170000 }, { month: "Oct", spend: 165000 },
  { month: "Nov", spend: 155000 }, { month: "Dec", spend: 195000 },
];

const budgetData = [
  { name: "Advertising", budget: 200000, spent: 83000, color: "#2563EB" },
  { name: "Content Creators", budget: 80000, spent: 48000, color: "#8B5CF6" },
  { name: "Heavy Ads", budget: 300000, spent: 210000, color: "#F97316" },
  { name: "Documents", budget: 20000, spent: 1000, color: "#06B6D4" },
];

const recentActivity = [
  { icon: "📢", title: "Google Ads campaign launched", sub: "Search Engine Campaign - Product Launch", time: "2h ago", color: "#2563EB" },
  { icon: "👥", title: "New creator partnership added", sub: "TechGuru Official - 15% Revenue Share", time: "5h ago", color: "#8B5CF6" },
  { icon: "🖥", title: "Billboard campaign scheduled", sub: "Mumbai Highway - 15 Days Campaign", time: "1d ago", color: "#F97316" },
  { icon: "🗂", title: "Invoice #INV-0187 uploaded", sub: "For Meta Ads Campaign", time: "2d ago", color: "#06B6D4" },
];

const adCampaigns = [
  { name: "Google Search - Product Launch", platform: "Google Ads", spent: "₹28,000", roi: "82%", reach: "4.2M", status: "Active" },
  { name: "Instagram Story Ads", platform: "Meta Ads", spent: "₹22,000", roi: "71%", reach: "2.8M", status: "Active" },
  { name: "YouTube Pre-roll Campaign", platform: "Google Ads", spent: "₹18,000", roi: "65%", reach: "1.9M", status: "Paused" },
  { name: "Facebook Carousel Ads", platform: "Meta Ads", spent: "₹15,000", roi: "58%", reach: "1.4M", status: "Active" },
];

const creators = [
  { name: "Logan Paul", handle: "@loganpaul", platform: "YouTube", spent: "$50,000", profit: "$90,000 (80% ROI)", reach: "3M", status: "Paid" },
  { name: "CarryMinati", handle: "@carryminati", platform: "YouTube", spent: "₹1,00,000", profit: "₹1,60,000 (60% ROI)", reach: "2.3M", status: "Paid" },
  { name: "MrBeast", handle: "@mrbeast", platform: "YouTube", spent: "15% share", profit: "$1,20,000 (75% ROI)", reach: "6M", status: "Active" },
  { name: "BeerBiceps", handle: "@beerbiceps", platform: "Instagram", spent: "20% share", profit: "₹2,00,000 (66% ROI)", reach: "1.8M", status: "Active" },
];

const heavyCampaigns = [
  { name: "Delhi Metro Billboard Campaign", type: "Billboards", location: "Delhi Metro Stations", spent: "₹55,000", profit: "₹90,000 (64% ROI)", reach: "2,50,000", roi: "64%", status: "Active" },
  { name: "Tech Conference 2026 Sponsorship", type: "Sponsorship", location: "Bangalore", spent: "₹80,000", profit: "₹1,40,000 (75% ROI)", reach: "1,80,000", roi: "75%", status: "Active" },
  { name: "Digital Marketing Summit 2026", type: "Event", location: "Mumbai", spent: "₹45,000", profit: "₹70,000 (55% ROI)", reach: "90,000", roi: "55%", status: "Scheduled" },
  { name: "City Banner Campaign (North Zone)", type: "Outdoor Ads", location: "Lucknow", spent: "₹30,000", profit: "₹54,000 (80% ROI)", reach: "65,000", roi: "80%", status: "Completed" },
  { name: "Highway Billboard Campaign", type: "Billboards", location: "Mumbai Highway", spent: "₹50,000", profit: "₹1,00,000 (66% ROI)", reach: "1,20,000", roi: "66%", status: "Active" },
];

const documents = [
  { name: "Invoice-INV-001", file: "invoice_inv_001.pdf", type: "Invoice", related: "Google Ads Campaign", date: "18 Jun 2024", status: "Verified" },
  { name: "Contract-CT-012", file: "contract_ct_012.docx", type: "Contract", related: "TechGuru Official (Partnership)", date: "14 Jun 2024", status: "Active" },
  { name: "Payment Slip-098", file: "payment_slip_098.pdf", type: "Payment Record", related: "CarryMinati (One-Time)", date: "12 Jun 2024", status: "Paid" },
  { name: "Partnership Agreement", file: "agreement_mrbeast.docx", type: "Partnership", related: "MrBeast (Partnership)", date: "10 Jun 2024", status: "Active" },
  { name: "Invoice-META-ADS-45", file: "invoice_meta_ads_45.pdf", type: "Invoice", related: "Meta Ads Campaign", date: "08 Jun 2024", status: "Approved" },
  { name: "Campaign Report - May", file: "campaign_report_may.xlsx", type: "Report", related: "Digital Marketing Team", date: "05 Jun 2024", status: "Reviewed" },
  { name: "Invoice-BILLBOARD-23", file: "invoice_billboard_23.pdf", type: "Invoice", related: "Billboard Campaign", date: "02 Jun 2024", status: "Paid" },
];

const departments = ["Digital Marketing", "Sales", "HR", "Finance", "Operations", "Product"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function formatINR(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(0)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function StatusBadge({ status, t }) {
  const map = {
    Active: t.green, Paid: t.green, Approved: t.green, Verified: t.green,
    Paused: t.textMuted, Scheduled: t.blue, Reviewed: t.purple,
    Completed: t.cyan,
  };
  const color = map[status] || t.textMuted;
  return (
    <span style={{
      padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
      background: `${color}22`, color, border: `1px solid ${color}44`,
    }}>{status}</span>
  );
}

function TypeBadge({ type, t }) {
  const map = {
    Invoice: t.blue, Contract: t.purple, "Payment Record": t.green,
    Partnership: t.orange, Report: t.cyan, Billboards: t.orange,
    Sponsorship: t.purple, Event: t.blue, "Outdoor Ads": t.green,
  };
  const color = map[type] || t.textMuted;
  return (
    <span style={{
      padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
      background: `${color}22`, color, border: `1px solid ${color}44`,
    }}>{type}</span>
  );
}

// ─── MODAL WRAPPER ────────────────────────────────────────────────────────────
function Modal({ open, onClose, children, t }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
    }} onClick={onClose}>
      <div style={{
        background: t.modal, border: `1px solid ${t.border}`, borderRadius: "16px",
        width: "100%", maxWidth: "900px", maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
      }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ─── ADVERTISING MODAL ────────────────────────────────────────────────────────
function AdvertisingModal({ open, onClose, t }) {
  const [activeTab, setActiveTab] = useState("All Platforms");
  const tabs = ["All Platforms", "Google Ads", "Meta Ads", "Instagram Ads"];
  return (
    <Modal open={open} onClose={onClose} t={t}>
      <div style={{ padding: "28px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📢</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>Advertising Management</div>
            <div style={{ fontSize: 13, color: t.textSec }}>Manage all digital advertising campaigns across platforms.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: t.textMuted, fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Spend", val: "₹83,000", color: t.blue },
            { label: "Total Reach", val: "10.3M", color: t.purple },
            { label: "Avg ROI", val: "69%", color: t.green },
            { label: "Active Campaigns", val: "3", color: t.cyan },
          ].map(s => (
            <div key={s.label} style={{ background: t.bg2, borderRadius: 10, padding: "14px 16px", border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "7px 16px", borderRadius: 8, border: `1px solid ${activeTab === tab ? t.blue : t.border}`,
              background: activeTab === tab ? t.blue : "transparent", color: activeTab === tab ? "#fff" : t.textSec,
              fontWeight: 500, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
            }}>{tab}</button>
          ))}
        </div>
        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {["Campaign Name", "Platform", "Amount Spent", "ROI", "Reach", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: t.textMuted, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adCampaigns.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${t.border}22` }}>
                  <td style={{ padding: "12px", color: t.text, fontWeight: 500 }}>{row.name}</td>
                  <td style={{ padding: "12px", color: t.textSec }}>{row.platform}</td>
                  <td style={{ padding: "12px", color: t.blue, fontWeight: 600 }}>{row.spent}</td>
                  <td style={{ padding: "12px", color: t.green, fontWeight: 600 }}>{row.roi}</td>
                  <td style={{ padding: "12px", color: t.textSec }}>{row.reach}</td>
                  <td style={{ padding: "12px" }}><StatusBadge status={row.status} t={t} /></td>
                  <td style={{ padding: "12px" }}>
                    <button style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${t.blue}`, background: "transparent", color: t.blue, fontSize: 12, cursor: "pointer" }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "9px 24px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer", fontWeight: 500 }}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── CONTENT CREATORS MODAL ───────────────────────────────────────────────────
function CreatorsModal({ open, onClose, t }) {
  const [activeTab, setActiveTab] = useState("All Platforms");
  const tabs = ["All Platforms", "Instagram", "YouTube", "TikTok", "X", "Facebook"];
  return (
    <Modal open={open} onClose={onClose} t={t}>
      <div style={{ padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👥</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>Content Creators Management</div>
            <div style={{ fontSize: 13, color: t.textSec }}>Manage content creators, payments and performance across platforms.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: t.textMuted, fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {/* Top stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Top Performing Platform", val: "Instagram", color: t.purple },
            { label: "Highest Reach Platform", val: "YouTube", color: t.green },
            { label: "Highest Profit Platform", val: "Instagram", color: t.orange },
            { label: "Total Creator Budget", val: "₹48,000", color: t.cyan },
          ].map(s => (
            <div key={s.label} style={{ background: t.bg2, borderRadius: 10, padding: "14px 16px", border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "7px 16px", borderRadius: 8, border: `1px solid ${activeTab === tab ? t.purple : t.border}`,
              background: activeTab === tab ? t.purple : "transparent", color: activeTab === tab ? "#fff" : t.textSec,
              fontWeight: 500, fontSize: 13, cursor: "pointer",
            }}>{tab}</button>
          ))}
        </div>
        {/* One-Time */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.purple }} />
              <span style={{ fontWeight: 600, color: t.text }}>One-Time Payment Creators</span>
            </div>
            <button style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.purple}`, background: "transparent", color: t.purple, fontSize: 12, cursor: "pointer" }}>+ Add Creator</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {["Creator", "Platform", "Amount Spent", "Profit Generated", "Reach", "Status"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: t.textMuted, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {creators.slice(0, 2).map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${t.border}22` }}>
                  <td style={{ padding: "11px 12px" }}>
                    <div style={{ fontWeight: 600, color: t.text }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>{r.handle}</div>
                  </td>
                  <td style={{ padding: "11px 12px", color: t.textSec }}>{r.platform}</td>
                  <td style={{ padding: "11px 12px", color: t.blue, fontWeight: 600 }}>{r.spent}</td>
                  <td style={{ padding: "11px 12px", color: t.green, fontWeight: 600 }}>{r.profit}</td>
                  <td style={{ padding: "11px 12px", color: t.textSec }}>{r.reach} Accounts</td>
                  <td style={{ padding: "11px 12px" }}><StatusBadge status={r.status} t={t} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Partnership */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.purple }} />
              <span style={{ fontWeight: 600, color: t.text }}>Partnership Creators</span>
            </div>
            <button style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.purple}`, background: "transparent", color: t.purple, fontSize: 12, cursor: "pointer" }}>+ Add Partner</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {["Creator / Agency", "Platform", "Revenue Share", "Profit Generated", "Reach", "Status"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: t.textMuted, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {creators.slice(2).map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${t.border}22` }}>
                  <td style={{ padding: "11px 12px" }}>
                    <div style={{ fontWeight: 600, color: t.text }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>{r.handle}</div>
                  </td>
                  <td style={{ padding: "11px 12px", color: t.textSec }}>{r.platform}</td>
                  <td style={{ padding: "11px 12px", color: t.blue, fontWeight: 600 }}>{r.spent}</td>
                  <td style={{ padding: "11px 12px", color: t.green, fontWeight: 600 }}>{r.profit}</td>
                  <td style={{ padding: "11px 12px", color: t.textSec }}>{r.reach} Accounts</td>
                  <td style={{ padding: "11px 12px" }}><StatusBadge status={r.status} t={t} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer stats */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${t.border}`, paddingTop: 16 }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👥</div>
              <div>
                <div style={{ fontSize: 11, color: t.textMuted }}>Total Creators</div>
                <div style={{ fontWeight: 700, color: t.text }}>24 <span style={{ fontWeight: 400, fontSize: 11, color: t.textMuted }}>Across all platforms</span></div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(6,182,212,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📱</div>
              <div>
                <div style={{ fontSize: 11, color: t.textMuted }}>Active Partnership</div>
                <div style={{ fontWeight: 700, color: t.text }}>8 <span style={{ fontWeight: 400, fontSize: 11, color: t.textMuted }}>Ongoing collaborations</span></div>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: "9px 24px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer", fontWeight: 500 }}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── HEAVY ADS MODAL ─────────────────────────────────────────────────────────
function HeavyAdsModal({ open, onClose, t }) {
  const [activeFilter, setActiveFilter] = useState("All Campaigns");
  const filters = ["All Campaigns", "Billboards", "Sponsorship Deals", "Event Sponsoring", "Outdoor Ads"];
  return (
    <Modal open={open} onClose={onClose} t={t}>
      <div style={{ padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🖥</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>Heavy Advertisement Management</div>
            <div style={{ fontSize: 13, color: t.textSec }}>Manage and analyze large scale offline advertising campaigns.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: t.textMuted, fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Spend", val: "₹2,10,000", sub: "↑ 16% from last month", color: t.orange },
            { label: "Total Profit Generated", val: "₹3,54,000", sub: "↑ 24% from last month", color: t.green },
            { label: "Total Reach", val: "12,80,000", sub: "↑ 18% from last month", color: t.cyan },
            { label: "Average ROI", val: "68.2%", sub: "↑ 7.4% from last month", color: t.purple },
          ].map(s => (
            <div key={s.label} style={{ background: t.bg2, borderRadius: 10, padding: "14px 16px", border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: t.green, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: t.textMuted, marginRight: 4 }}>Campaign Type Filter</span>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: "7px 14px", borderRadius: 8, border: `1px solid ${activeFilter === f ? t.orange : t.border}`,
              background: activeFilter === f ? t.orange : "transparent", color: activeFilter === f ? "#fff" : t.textSec,
              fontWeight: 500, fontSize: 12, cursor: "pointer",
            }}>{f}</button>
          ))}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {["Campaign Name", "Type", "Location / Event", "Amount Spent", "Profit Generated", "Reach", "ROI", "Status"].map(h => (
                  <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: t.textMuted, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heavyCampaigns.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${t.border}22` }}>
                  <td style={{ padding: "11px 12px", color: t.text, fontWeight: 500 }}>{row.name}</td>
                  <td style={{ padding: "11px 12px" }}><TypeBadge type={row.type} t={t} /></td>
                  <td style={{ padding: "11px 12px", color: t.textSec }}>{row.location}</td>
                  <td style={{ padding: "11px 12px", color: t.orange, fontWeight: 600 }}>{row.spent}</td>
                  <td style={{ padding: "11px 12px", color: t.green, fontWeight: 600 }}>{row.profit}</td>
                  <td style={{ padding: "11px 12px", color: t.textSec }}>{row.reach}</td>
                  <td style={{ padding: "11px 12px", color: t.cyan, fontWeight: 600 }}>{row.roi}</td>
                  <td style={{ padding: "11px 12px" }}><StatusBadge status={row.status} t={t} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Best campaign */}
        <div style={{ background: `${t.orange}11`, border: `1px solid ${t.orange}33`, borderRadius: 12, padding: "14px 18px", marginTop: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 28 }}>🏆</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: t.textMuted }}>Best Performing Campaign</div>
            <div style={{ fontWeight: 700, color: t.text, fontSize: 16 }}>Tech Conference 2026 Sponsorship</div>
            <div style={{ fontSize: 12, color: t.orange }}>Highest ROI: 75%</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[{ label: "Amount Spent", val: "₹80,000", icon: "💼" }, { label: "Profit Generated", val: "₹1,40,000", icon: "📈" }, { label: "Reach", val: "1,80,000", icon: "👁" }, { label: "ROI", val: "75%", icon: "🎯" }].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: t.textMuted }}>{s.label}</div>
                <div style={{ fontWeight: 700, color: t.text }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "9px 24px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer", fontWeight: 500 }}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── INVOICES MODAL ───────────────────────────────────────────────────────────
function InvoicesModal({ open, onClose, t }) {
  const [activeTab, setActiveTab] = useState("All Documents");
  const tabs = ["All Documents", "Invoices", "Contracts", "Payment Records", "Partnership Agreements"];
  return (
    <Modal open={open} onClose={onClose} t={t}>
      <div style={{ padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(6,182,212,0.2)", border: "1px solid rgba(6,182,212,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🗂</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>Invoices & Documents</div>
            <div style={{ fontSize: 13, color: t.textSec }}>Manage and track all invoices, contracts and related documents in one place.</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: t.textMuted, fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "7px 16px", borderRadius: 8, border: `1px solid ${activeTab === tab ? t.cyan : t.border}`,
              background: activeTab === tab ? t.cyan : "transparent", color: activeTab === tab ? "#fff" : t.textSec,
              fontWeight: 500, fontSize: 13, cursor: "pointer",
            }}>{tab}</button>
          ))}
        </div>
        {/* Search row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 160, background: t.bg2, border: `1px solid ${t.border}`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: t.textMuted }}>🔍</span>
            <input placeholder="Search documents..." style={{ border: "none", background: "transparent", color: t.text, fontSize: 13, outline: "none", width: "100%" }} />
          </div>
          {["All Types", "All Status"].map(p => (
            <select key={p} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.bg2, color: t.textSec, fontSize: 13 }}>
              <option>{p}</option>
            </select>
          ))}
        </div>
        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                {["Document Name", "Type", "Related To", "Date", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: t.textMuted, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${t.border}22` }}>
                  <td style={{ padding: "11px 12px" }}>
                    <div style={{ fontWeight: 600, color: t.text }}>{doc.name}</div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>{doc.file}</div>
                  </td>
                  <td style={{ padding: "11px 12px" }}><TypeBadge type={doc.type} t={t} /></td>
                  <td style={{ padding: "11px 12px", color: t.textSec }}>{doc.related}</td>
                  <td style={{ padding: "11px 12px", color: t.textMuted }}>{doc.date}</td>
                  <td style={{ padding: "11px 12px" }}><StatusBadge status={doc.status} t={t} /></td>
                  <td style={{ padding: "11px 12px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: t.textSec, fontSize: 11, cursor: "pointer" }}>View</button>
                      <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: t.textSec, fontSize: 11, cursor: "pointer" }}>↓</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${t.border}`, paddingTop: 16, marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(6,182,212,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📁</div>
            <div>
              <div style={{ fontSize: 11, color: t.textMuted }}>Total Documents Stored</div>
              <div style={{ fontWeight: 700, color: t.text, fontSize: 18 }}>28 Files <span style={{ fontSize: 12, fontWeight: 400, color: t.textMuted }}>Across all categories</span></div>
            </div>
            <div style={{ marginLeft: 24 }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Storage Used: 2.4 GB / 10 GB — 24%</div>
              <div style={{ width: 160, height: 6, background: t.bg2, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: "24%", height: "100%", background: t.cyan, borderRadius: 4 }} />
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: "9px 24px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer", fontWeight: 500 }}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── EMPLOYEES MODAL ──────────────────────────────────────────────────────────
function EmployeesModal({ open, onClose, t }) {
  const employees = [
    { name: "Riya Sharma", role: "Marketing Manager", dept: "Digital Marketing", status: "Active" },
    { name: "Aman Verma", role: "Content Strategist", dept: "Digital Marketing", status: "Active" },
    { name: "Priya Nair", role: "SEO Specialist", dept: "Digital Marketing", status: "Active" },
    { name: "Kunal Mehta", role: "Paid Ads Manager", dept: "Digital Marketing", status: "On Leave" },
    { name: "Sneha Gupta", role: "Creative Designer", dept: "Digital Marketing", status: "Active" },
  ];
  return (
    <Modal open={open} onClose={onClose} t={t}>
      <div style={{ padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>Employees</div>
            <div style={{ fontSize: 13, color: t.textSec }}>Digital Marketing Department</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: t.textMuted, fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${t.border}` }}>
              {["Name", "Role", "Department", "Status"].map(h => (
                <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: t.textMuted, fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((e, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${t.border}22` }}>
                <td style={{ padding: "11px 12px", color: t.text, fontWeight: 600 }}>{e.name}</td>
                <td style={{ padding: "11px 12px", color: t.textSec }}>{e.role}</td>
                <td style={{ padding: "11px 12px", color: t.textSec }}>{e.dept}</td>
                <td style={{ padding: "11px 12px" }}><StatusBadge status={e.status} t={t} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: "9px 24px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.text, cursor: "pointer", fontWeight: 500 }}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [isDark, setIsDark] = useState(true);
  const [showDept, setShowDept] = useState(false);
  const [selectedDept, setSelectedDept] = useState("Digital Marketing");
  const [showAd, setShowAd] = useState(false);
  const [showCreators, setShowCreators] = useState(false);
  const [showHeavy, setShowHeavy] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);
  const [spendRange, setSpendRange] = useState("This Year");

  const t = isDark ? DARK : LIGHT;

  const marketingCards = [
    {
      id: "advertising", title: "Advertising",
      subtitle: "Google Ads • Meta Ads • Instagram Ads",
      emoji: "📢",
      accent: t.blue, accentBg: "rgba(37,99,235,0.15)",
      border: "rgba(37,99,235,0.35)", glow: "rgba(37,99,235,0.15)",
      onClick: () => setShowAd(true),
    },
    {
      id: "content", title: "Content Creators",
      subtitle: "One Time Creators • Partnership Creators",
      emoji: "👥",
      accent: t.purple, accentBg: "rgba(139,92,246,0.15)",
      border: "rgba(139,92,246,0.35)", glow: "rgba(139,92,246,0.15)",
      onClick: () => setShowCreators(true),
    },
    {
      id: "heavy", title: "Heavy Advertisement",
      subtitle: "Billboards • Sponsorship • Events",
      emoji: "🖥",
      accent: t.orange, accentBg: "rgba(249,115,22,0.15)",
      border: "rgba(249,115,22,0.35)", glow: "rgba(249,115,22,0.15)",
      onClick: () => setShowHeavy(true),
    },
    {
      id: "invoices", title: "Invoices & Documents",
      subtitle: "Invoices • Contracts • Payments",
      emoji: "🗂",
      accent: t.cyan, accentBg: "rgba(6,182,212,0.15)",
      border: "rgba(6,182,212,0.35)", glow: "rgba(6,182,212,0.15)",
      onClick: () => setShowInvoices(true),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif", color: t.text }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        background: t.bg2, borderBottom: `1px solid ${t.border}`,
        padding: "0 24px", height: 60, display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "linear-gradient(135deg,#2563EB,#8B5CF6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 14, color: "#fff",
          }}>NN</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: t.text }}>NovaNectar <span style={{ color: t.blue }}>ERP</span></div>
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Department dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowDept(!showDept)} style={{
              padding: "7px 14px", borderRadius: 8, border: `1px solid ${t.border}`,
              background: "transparent", color: t.text, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, fontWeight: 500,
            }}>
              🏠 {selectedDept} ▾
            </button>
            {showDept && (
              <div style={{
                position: "absolute", top: "110%", right: 0, background: t.modal,
                border: `1px solid ${t.border}`, borderRadius: 10, padding: "6px 0",
                minWidth: 180, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", zIndex: 200,
              }}>
                {departments.map(d => (
                  <div key={d} onClick={() => { setSelectedDept(d); setShowDept(false); }} style={{
                    padding: "8px 16px", cursor: "pointer", fontSize: 13, color: t.text,
                    background: selectedDept === d ? `${t.blue}22` : "transparent",
                  }}>{d}</div>
                ))}
              </div>
            )}
          </div>

          {/* Employees */}
          <button onClick={() => setShowEmployees(true)} style={{
            padding: "7px 14px", borderRadius: 8, border: `1px solid ${t.border}`,
            background: "transparent", color: t.text, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, fontWeight: 500,
          }}>👤 Employees</button>

          {/* Calendar */}
          <button style={{
            width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.border}`,
            background: "transparent", color: t.text, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>📅</button>

          {/* Theme toggle */}
          <button onClick={() => setIsDark(!isDark)} style={{
            width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.border}`,
            background: "transparent", color: t.text, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{isDark ? "🌙" : "☀️"}</button>

          {/* Logout */}
          <button style={{
            padding: "7px 16px", borderRadius: 8, border: `1px solid ${t.red}44`,
            background: `${t.red}15`, color: t.red, fontSize: 13, cursor: "pointer",
            fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
          }}>↪ Logout</button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: "28px 24px", maxWidth: 1400, margin: "0 auto" }}>

        {/* Welcome */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: t.text, margin: 0 }}>Digital Marketing Dashboard</h1>
          <p style={{ fontSize: 14, color: t.textSec, margin: "4px 0 0" }}>Track, manage and optimize all marketing activities in one place.</p>
        </div>

        {/* ── BUDGET ANALYTICS CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          {/* Total Budget */}
          <div style={{
            background: `linear-gradient(135deg, ${t.card} 0%, #0d1f3c 100%)`,
            border: `1px solid ${t.border}`, borderRadius: 14, padding: "22px 24px",
            display: "flex", alignItems: "center", gap: 20, overflow: "hidden", position: "relative",
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(37,99,235,0.25)", border: "1px solid rgba(37,99,235,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>💼</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Total Allocated Budget</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: t.text }}>₹5,00,000</div>
              <div style={{ fontSize: 12, color: t.green, marginTop: 3 }}>↑ 22% from last month</div>
            </div>
            <div style={{ width: 180, height: 60, opacity: 0.7 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData.slice(-6)} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <Line type="monotone" dataKey="spend" stroke="#2563EB" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spend Amount */}
          <div style={{
            background: `linear-gradient(135deg, ${t.card} 0%, #1a0d2e 100%)`,
            border: `1px solid ${t.border}`, borderRadius: 14, padding: "22px 24px",
            display: "flex", alignItems: "center", gap: 20, overflow: "hidden",
          }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>📊</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Spend Amount</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: t.text }}>₹1,42,000</div>
              <div style={{ fontSize: 12, color: t.red, marginTop: 3 }}>↓ 8% from last month</div>
            </div>
            <div style={{ width: 180, height: 60, opacity: 0.7 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData.slice(-6)} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <Bar dataKey="spend" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── 4 HORIZONTAL MARKETING CARDS ── */}
        <div style={{ display: "flex", flexDirection: "row", gap: 16, marginBottom: 24 }}>
          {marketingCards.map(card => (
            <MarketingCard key={card.id} card={card} t={t} isDark={isDark} />
          ))}
        </div>

        {/* ── CHARTS + ACTIVITY ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16, marginBottom: 24 }}>
          {/* Monthly Spend Analytics */}
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>📈</span>
                <span style={{ fontWeight: 700, fontSize: 16, color: t.text }}>Monthly Spend Analytics</span>
              </div>
              <select value={spendRange} onChange={e => setSpendRange(e.target.value)} style={{
                padding: "6px 12px", borderRadius: 8, border: `1px solid ${t.border}`,
                background: t.bg2, color: t.textSec, fontSize: 13,
              }}>
                {["This Year", "Last Year", "Last 6 Months"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={`${t.border}66`} />
                  <XAxis dataKey="month" tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={formatINR} tick={{ fill: t.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: t.modal, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: t.text }} formatter={v => [`₹${v.toLocaleString("en-IN")}`, "Spend"]}
                  />
                  <Area type="monotone" dataKey="spend" stroke="#2563EB" strokeWidth={2.5} fill="url(#spendGrad)" dot={{ fill: "#2563EB", r: 3 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>🕐</span>
                <span style={{ fontWeight: 700, fontSize: 16, color: t.text }}>Recent Activity</span>
              </div>
              <button style={{ background: "none", border: "none", color: t.blue, fontSize: 12, cursor: "pointer", fontWeight: 500 }}>View All →</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {recentActivity.map((act, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    background: `${act.color}20`, border: `1px solid ${act.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                  }}>{act.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{act.title}</div>
                    <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{act.sub}</div>
                  </div>
                  <div style={{ fontSize: 11, color: t.textMuted, flexShrink: 0 }}>{act.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BUDGET SNAPSHOT ── */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <span style={{ fontSize: 18 }}>📷</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: t.text }}>Budget Snapshot</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {budgetData.map(item => {
              const pct = Math.round((item.spent / item.budget) * 100);
              return (
                <div key={item.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{item.name}</span>
                    <span style={{ fontSize: 12, color: t.textMuted }}>
                      ₹{item.spent.toLocaleString("en-IN")} / ₹{item.budget.toLocaleString("en-IN")} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 7, background: `${item.color}22`, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: item.color, borderRadius: 4, transition: "width 1s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── MODALS ── */}
      <AdvertisingModal open={showAd} onClose={() => setShowAd(false)} t={t} />
      <CreatorsModal open={showCreators} onClose={() => setShowCreators(false)} t={t} />
      <HeavyAdsModal open={showHeavy} onClose={() => setShowHeavy(false)} t={t} />
      <InvoicesModal open={showInvoices} onClose={() => setShowInvoices(false)} t={t} />
      <EmployeesModal open={showEmployees} onClose={() => setShowEmployees(false)} t={t} />
    </div>
  );
}

// ─── MARKETING CARD (hover state) ────────────────────────────────────────────
function MarketingCard({ card, t, isDark }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={card.onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: "1 1 0", minWidth: 0, height: 150, padding: "20px",
        borderRadius: 14,
        background: isDark ? "#081427" : "#FFFFFF",
        border: `1px solid ${hovered ? card.accent : card.border}`,
        boxShadow: hovered ? `0 8px 32px ${card.glow}, 0 0 0 1px ${card.border}` : `0 2px 10px ${card.glow}`,
        cursor: "pointer",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0px)",
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: card.accentBg, border: `1px solid ${card.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
      }}>{card.emoji}</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 5 }}>{card.title}</div>
        <div style={{ fontSize: 11.5, color: t.textMuted, lineHeight: 1.5 }}>{card.subtitle}</div>
      </div>
    </div>
  );
}
