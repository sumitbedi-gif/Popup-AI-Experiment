"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  FolderPlus, Search, Filter, LayoutGrid, List,
  ChevronsUpDown, ChevronLeft, ChevronRight, HelpCircle, ChevronDown,
  Sparkles, CheckCircle2, AlertTriangle, XCircle, X, TrendingDown, ArrowRight,
} from "lucide-react"
import { WhatfixSidebar } from "@/components/whatfix-sidebar"

interface PopupRow {
  id: string
  name: string
  version: number
  type: string
  createdOn: string
  createdBy: string
  updatedBy: string
  updatedOn: string
  status: "red" | "yellow" | "green"
}

const POPUPS: PopupRow[] = [
  { id: "outage-alert",        name: "Outage Alert",              version: 3,  type: "Pop Up", createdOn: "Jan 12, 2026", createdBy: "Sumit Bedi",   updatedBy: "Sumit Bedi",   updatedOn: "Jan 15, 2026", status: "green"  },
  { id: "downtime-notice",     name: "Scheduled Maintenance",     version: 1,  type: "Pop Up", createdOn: "Dec 04, 2025", createdBy: "Ujjal Hafila", updatedBy: "Ujjal Hafila", updatedOn: "Dec 04, 2025", status: "yellow" },
  { id: "feature-announce",    name: "Team's Productivity",        version: 2,  type: "Pop Up", createdOn: "Nov 18, 2025", createdBy: "Sumit Bedi",   updatedBy: "Ujjal Hafila", updatedOn: "Nov 20, 2025", status: "red"    },
  { id: "trial-expiry",        name: "Trial Expiry Warning",      version: 4,  type: "Pop Up", createdOn: "Oct 07, 2025", createdBy: "Ujjal Hafila", updatedBy: "Ujjal Hafila", updatedOn: "Oct 08, 2025", status: "red"    },
  { id: "onboarding-welcome",  name: "Onboarding Welcome",        version: 2,  type: "Pop Up", createdOn: "Sep 15, 2025", createdBy: "Sumit Bedi",   updatedBy: "Sumit Bedi",   updatedOn: "Oct 01, 2025", status: "green"  },
  { id: "upgrade-offer",       name: "Free Trial Upgrade Offer",  version: 5,  type: "Pop Up", createdOn: "Aug 22, 2025", createdBy: "Ujjal Hafila", updatedBy: "Ujjal Hafila", updatedOn: "Sep 01, 2025", status: "yellow" },
  { id: "product-update",      name: "Product Update Banner",     version: 1,  type: "Pop Up", createdOn: "Jul 10, 2025", createdBy: "Ujjal Hafila", updatedBy: "Sumit Bedi",   updatedOn: "Jul 11, 2025", status: "red"    },
  { id: "feedback-survey",     name: "Feedback Survey Prompt",    version: 3,  type: "Pop Up", createdOn: "Jun 03, 2025", createdBy: "Sumit Bedi",   updatedBy: "Ujjal Hafila", updatedOn: "Jun 05, 2025", status: "yellow" },
  { id: "re-engagement",       name: "Re-engagement Campaign",    version: 2,  type: "Pop Up", createdOn: "May 14, 2025", createdBy: "Ujjal Hafila", updatedBy: "Ujjal Hafila", updatedOn: "May 20, 2025", status: "red"    },
  { id: "support-contact",     name: "Support Contact Prompt",    version: 57, type: "Pop Up", createdOn: "Apr 02, 2025", createdBy: "Sumit Bedi",   updatedBy: "Sumit Bedi",   updatedOn: "Jan 01, 2026", status: "green"  },
]

// Popup/modal icon
function PopupIcon() {
  return (
    <svg width="15" height="13" viewBox="0 0 16 14" fill="none" style={{ flexShrink: 0 }}>
      <rect x="0.75" y="0.75" width="14.5" height="12.5" rx="1.8" stroke="#8C899F" strokeWidth="1.2" />
      <path d="M0.75 4H15.25" stroke="#8C899F" strokeWidth="1" />
      <circle cx="2.75" cy="2.4" r="0.8" fill="#8C899F" />
      <circle cx="5" cy="2.4" r="0.8" fill="#8C899F" />
    </svg>
  )
}

// ── Health data ───────────────────────────────────────────────────────────────
const SCORE_RADIUS = 32
const SCORE_CIRC = 2 * Math.PI * SCORE_RADIUS

function ScoreRing({ score, color }: { score: number; color: string }) {
  const offset = SCORE_CIRC * (1 - score / 100)
  return (
    <svg width="76" height="76" viewBox="0 0 76 76">
      <circle cx="38" cy="38" r={SCORE_RADIUS} fill="none" stroke="#f3f4f6" strokeWidth="5" />
      <circle cx="38" cy="38" r={SCORE_RADIUS} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={SCORE_CIRC} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 38 38)"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
      <text x="38" y="44" textAnchor="middle" fontSize="17" fontWeight="bold" fill={color}>{score}</text>
    </svg>
  )
}

interface HealthIssue { label: string; status: "good" | "warn" | "bad"; msg: string }
interface HealthData { score: number; color: string; label: string; insight: string; issues: HealthIssue[] }

const HEALTH: Record<"red" | "yellow" | "green", HealthData> = {
  red: {
    score: 47, color: "#ef4444", label: "Needs Work",
    insight: "68% of users closed popups with this much text within 3 seconds. Shorter copy converts better.",
    issues: [
      { label: "Image",   status: "bad",  msg: "No hero image — low visual impact" },
      { label: "Heading", status: "bad",  msg: "Vague, lacks specificity" },
      { label: "Body",    status: "bad",  msg: "Too long, reader drops off" },
      { label: "Button",  status: "warn", msg: "Soft CTA, low conversion" },
    ],
  },
  yellow: {
    score: 71, color: "#f59e0b", label: "Improving",
    insight: "A stronger CTA and trimmed body copy could lift conversions by up to 20%.",
    issues: [
      { label: "Image",   status: "good", msg: "Hero image present, good contrast" },
      { label: "Heading", status: "good", msg: "Clear and action-driven" },
      { label: "Body",    status: "warn", msg: "Slightly long, consider trimming" },
      { label: "Button",  status: "warn", msg: "CTA could be more urgent" },
    ],
  },
  green: {
    score: 91, color: "#22c55e", label: "Excellent",
    insight: "This popup is performing well above average! Content is concise and the CTA is compelling.",
    issues: [
      { label: "Image",   status: "good", msg: "Hero image added, strong contrast" },
      { label: "Heading", status: "good", msg: "Clear and action-driven" },
      { label: "Body",    status: "good", msg: "Concise and scannable" },
      { label: "Button",  status: "good", msg: "High-urgency CTA" },
    ],
  },
}

// ── Status pill ───────────────────────────────────────────────────────────────
const PILL_CONFIG = {
  red:    { label: "Low",     bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  yellow: { label: "Medium",  bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  green:  { label: "Good",    bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
}

function StatusPill({ status, onClick }: {
  status: "red" | "yellow" | "green"
  onClick: (e: React.MouseEvent) => void
}) {
  const cfg = PILL_CONFIG[status]
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(e) }}
      style={{
        display: "inline-flex", alignItems: "center", gap: "4px",
        padding: "2px 8px", borderRadius: "12px",
        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
        fontSize: "11px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", lineHeight: "18px",
      }}
    >
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </button>
  )
}

// ── Dashboard health panel ────────────────────────────────────────────────────
interface PanelState { id: string; name: string; status: "red" | "yellow" | "green"; x: number; y: number }

function DashboardHealthPanel({ panel, onClose, onOpenEditor }: {
  panel: PanelState
  onClose: () => void
  onOpenEditor: () => void
}) {
  const h = HEALTH[panel.status]
  const PANEL_W = 278
  const x = Math.min(panel.x, (typeof window !== "undefined" ? window.innerWidth : 1440) - PANEL_W - 16)
  const y = Math.max(panel.y - 8, 8)

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="panel-in"
      style={{
        position: "fixed", left: x, top: y, width: PANEL_W, zIndex: 600,
        background: "#fff", borderRadius: "16px", border: "1px solid #e5e7eb",
        boxShadow: "0 8px 32px rgba(0,0,0,0.14)", overflow: "hidden",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={13} style={{ color: "#3b82f6" }} />
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>Content Health</span>
        </div>
        <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#9ca3af", padding: "2px", display: "flex" }}>
          <X size={13} />
        </button>
      </div>

      {/* Insight banner */}
      <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "9px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
          <TrendingDown size={12} style={{ color: "#d97706", flexShrink: 0, marginTop: "1px" }} />
          <p style={{ fontSize: "11px", lineHeight: "1.5", color: "#92400e", margin: 0 }}>{h.insight}</p>
        </div>
      </div>

      {/* Score ring */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", padding: "14px 0 10px" }}>
        <ScoreRing score={h.score} color={h.color} />
        <span style={{ fontSize: "11px", fontWeight: 500, color: "#9ca3af" }}>{h.label}</span>
      </div>

      {/* Issues grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px", padding: "0 12px 12px" }}>
        {h.issues.map(({ label, status, msg }, i) => (
          <div
            key={label}
            className="item-fade-in"
            style={{
              animationDelay: `${i * 0.1}s`, borderRadius: "8px", padding: "8px 9px",
              border: `1px solid ${status === "good" ? "#d1fae5" : status === "warn" ? "#fde68a" : "#fecaca"}`,
              background: status === "good" ? "#f0fdf4" : status === "warn" ? "#fffbeb" : "#fef2f2",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "3px" }}>
              {status === "good"
                ? <CheckCircle2 size={11} style={{ color: "#22c55e", flexShrink: 0 }} />
                : status === "warn"
                ? <AlertTriangle size={11} style={{ color: "#f59e0b", flexShrink: 0 }} />
                : <XCircle size={11} style={{ color: "#ef4444", flexShrink: 0 }} />}
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151" }}>{label}</span>
            </div>
            <p style={{ fontSize: "10px", color: "#6b7280", margin: 0, lineHeight: "1.4" }}>{msg}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: "0 12px 12px" }}>
        <button
          onClick={onOpenEditor}
          style={{
            width: "100%", padding: "9px", borderRadius: "10px",
            background: "linear-gradient(135deg, #2563eb, #06b6d4)",
            border: "none", color: "#fff", fontSize: "12px", fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          }}
        >
          Open in editor
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const TABS = ["Draft", "Ready", "Production"] as const
type Tab = typeof TABS[number]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("Draft")
  const [search, setSearch] = useState("")
  const [panel, setPanel] = useState<PanelState | null>(null)

  const filtered = POPUPS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (!panel) return
    function handleClick() { setPanel(null) }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [panel])

  function handlePillClick(e: React.MouseEvent, popup: PopupRow) {
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    if (panel?.id === popup.id) { setPanel(null); return }
    setPanel({ id: popup.id, name: popup.name, status: popup.status, x: rect.right + 12, y: rect.top })
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FCFCFD", fontFamily: "Inter, -apple-system, sans-serif" }}>
      <WhatfixSidebar activeId="widgets" />

      <div style={{ marginLeft: "260px", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Studio banner */}
        <div style={{
          background: "#1D4ED8", color: "white", fontSize: "13px", fontWeight: 500,
          padding: "10px 24px", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0,
        }}>
          <span style={{ fontSize: "15px" }}>🚀</span>
          <span>
            You need the studio extension to create content like flows, beacons, launchers and smart-tips.{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>Install studio to create content</span>
          </span>
        </div>

        {/* Page header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #ECECF3" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 12px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#1F1F32", margin: 0 }}>Widgets</h1>
            <button className="wf-header-create-btn">
              Create widget
              <ChevronDown size={14} />
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
            <div style={{ display: "flex", gap: "24px" }}>
              {TABS.map((tab) => (
                <button key={tab} className={`wf-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                  <span>{tab}</span>
                  <div className="wf-tab-indicator" />
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "8px" }}>
              <button className="wf-action-btn"><FolderPlus size={14} />Create folder</button>
              <div className="wf-search">
                <Search size={13} style={{ color: "#8C899F", flexShrink: 0 }} />
                <input placeholder="Search widget" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button className="wf-action-btn"><Filter size={13} />Filter (1)</button>
              <button className="wf-icon-btn"><LayoutGrid size={15} /></button>
              <button className="wf-icon-btn"><List size={15} /></button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#fff", borderBottom: "1px solid #ECECF3", position: "sticky", top: 0, zIndex: 10 }}>
                <th style={{ width: "36px", padding: "10px 12px 10px 20px" }}><input type="checkbox" style={{ cursor: "pointer" }} /></th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#3D3C52" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>Name <ChevronsUpDown size={12} style={{ color: "#8C899F" }} /></div>
                </th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#3D3C52" }}>Version</th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#3D3C52" }}>Type</th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#3D3C52", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>Created on <ChevronsUpDown size={12} style={{ color: "#8C899F" }} /></div>
                </th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#3D3C52", whiteSpace: "nowrap" }}>Created By</th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#3D3C52", whiteSpace: "nowrap" }}>Last updated by</th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#3D3C52", whiteSpace: "nowrap" }}>Last updated on</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((popup, i) => (
                <tr
                  key={popup.id}
                  onClick={() => router.push(`/popup/${popup.id}?name=${encodeURIComponent(popup.name)}`)}
                  style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA", borderBottom: "1px solid #F2F2F8", cursor: "pointer", transition: "background-color 100ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F0F4FF")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFAFA")}
                >
                  <td style={{ padding: "12px 12px 12px 20px" }}>
                    <input type="checkbox" style={{ cursor: "pointer" }} onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <PopupIcon />
                      <span style={{ color: "#1F1F32", fontWeight: 500 }}>{popup.name}</span>
                      <StatusPill status={popup.status} onClick={(e) => handlePillClick(e, popup)} />
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: "#0975D7", textDecoration: "underline", cursor: "pointer", fontWeight: 500 }}>{popup.version}</span>
                  </td>
                  <td style={{ padding: "12px", color: "#525066" }}>{popup.type}</td>
                  <td style={{ padding: "12px", color: "#525066" }}>{popup.createdOn}</td>
                  <td style={{ padding: "12px", color: "#525066" }}>{popup.createdBy}</td>
                  <td style={{ padding: "12px", color: "#525066" }}>{popup.updatedBy}</td>
                  <td style={{ padding: "12px", color: "#525066" }}>{popup.updatedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ background: "#fff", borderTop: "1px solid #ECECF3", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", color: "#525066", flexShrink: 0 }}>
          <span>Rows 1–{filtered.length} of {POPUPS.length}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button className="wf-icon-btn"><ChevronLeft size={14} /></button>
            <button style={{ width: "30px", height: "30px", borderRadius: "6px", border: "none", background: "#0975D7", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>1</button>
            <button style={{ width: "30px", height: "30px", borderRadius: "6px", border: "1px solid #DFDDE7", background: "transparent", fontSize: "13px", cursor: "pointer", color: "#3D3C52" }}>2</button>
            <button className="wf-icon-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Self Help */}
      <button style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 300, display: "flex", alignItems: "center", gap: "8px", background: "#1F1F32", color: "white", border: "none", borderRadius: "24px", padding: "10px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
        <HelpCircle size={16} />
        Self Help
      </button>

      {/* Health panel overlay */}
      {panel && (
        <DashboardHealthPanel
          panel={panel}
          onClose={() => setPanel(null)}
          onOpenEditor={() => router.push(`/popup/${panel.id}?name=${encodeURIComponent(panel.name)}`)}
        />
      )}
    </div>
  )
}
