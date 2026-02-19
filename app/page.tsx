"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  FolderPlus, Search, Filter, LayoutGrid, List,
  ChevronsUpDown, Folder, ChevronLeft, ChevronRight, HelpCircle,
  ChevronDown,
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
}

const POPUPS: PopupRow[] = [
  { id: "christmas-pops",    name: "Christmas Pops",       version: 1,  type: "Pop Up", createdOn: "Oct 14, 2025", createdBy: "Ujjal Hafila", updatedBy: "Ujjal Hafila", updatedOn: "Oct 14, 2025" },
  { id: "pop-up",            name: "Pop-up",               version: 1,  type: "Pop Up", createdOn: "May 30, 2025", createdBy: "Ujjal Hafila", updatedBy: "Ujjal Hafila", updatedOn: "May 30, 2025" },
  { id: "dzthysdtgh",        name: "dzthysdtgh",           version: 1,  type: "Pop Up", createdOn: "May 05, 2025", createdBy: "Ujjal Hafila", updatedBy: "Ujjal Hafila", updatedOn: "May 05, 2025" },
  { id: "ai-test",           name: "AI Test",              version: 1,  type: "Pop Up", createdOn: "Mar 05, 2025", createdBy: "Ujjal Hafila", updatedBy: "Ujjal Hafila", updatedOn: "Mar 05, 2025" },
  { id: "testing-one",       name: "Testing One",          version: 2,  type: "Pop Up", createdOn: "Nov 14, 2023", createdBy: "Ujjal Hafila", updatedBy: "Ujjal Hafila", updatedOn: "Apr 01, 2024" },
  { id: "shatterdome",       name: "Shatterdome",          version: 3,  type: "Pop Up", createdOn: "Aug 29, 2023", createdBy: "Ujjal Hafila", updatedBy: "Ujjal Hafila", updatedOn: "Apr 01, 2024" },
  { id: "name-me-pop",       name: "Name Me Pop",          version: 2,  type: "Pop Up", createdOn: "Feb 22, 2024", createdBy: "Ujjal Hafila", updatedBy: "Ujjal Hafila", updatedOn: "Apr 01, 2024" },
  { id: "test-popup-one",    name: "Test Popup One",       version: 5,  type: "Pop Up", createdOn: "Oct 22, 2021", createdBy: "Sumit Bedi",   updatedBy: "Ujjal Hafila", updatedOn: "Apr 01, 2024" },
  { id: "copy-color-change", name: "Copy of Color Change", version: 5,  type: "Pop Up", createdOn: "May 27, 2021", createdBy: "Sumit Bedi",   updatedBy: "Ujjal Hafila", updatedOn: "Apr 01, 2024" },
  { id: "sumit-test",        name: "Sumit_Test",           version: 57, type: "Pop Up", createdOn: "Jun 04, 2021", createdBy: "Sumit Bedi",   updatedBy: "Sumit Bedi",   updatedOn: "Jan 01, 2024" },
]

const TABS = ["Draft", "Ready", "Production"] as const
type Tab = typeof TABS[number]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>("Draft")
  const [search, setSearch] = useState("")

  const filtered = POPUPS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FCFCFD", fontFamily: "Inter, -apple-system, sans-serif" }}>
      <WhatfixSidebar activeId="widgets" />

      {/* Main content — offset by sidebar width */}
      <div style={{ marginLeft: "260px", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Studio banner */}
        <div style={{
          background: "#1D4ED8", color: "white", fontSize: "13px", fontWeight: 500,
          padding: "10px 24px", display: "flex", alignItems: "center", gap: "6px",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "15px" }}>🚀</span>
          <span>
            You need the studio extension to create content like flows, beacons, launchers and smart-tips.{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>Install studio to create content</span>
          </span>
        </div>

        {/* Page header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #ECECF3" }}>
          {/* Title row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 24px 12px",
          }}>
            <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#1F1F32", margin: 0 }}>Widgets</h1>
            <button className="wf-header-create-btn">
              Create widget
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Tabs + action bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 24px",
          }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: "24px" }}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`wf-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span>{tab}</span>
                  <div className="wf-tab-indicator" />
                </button>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "8px" }}>
              <button className="wf-action-btn">
                <FolderPlus size={14} />
                Create folder
              </button>
              <div className="wf-search">
                <Search size={13} style={{ color: "#8C899F", flexShrink: 0 }} />
                <input
                  placeholder="Search widget"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="wf-action-btn">
                <Filter size={13} />
                Filter (1)
              </button>
              <button className="wf-icon-btn">
                <LayoutGrid size={15} />
              </button>
              <button className="wf-icon-btn">
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#fff", borderBottom: "1px solid #ECECF3", position: "sticky", top: 0, zIndex: 10 }}>
                <th style={{ width: "36px", padding: "10px 12px 10px 20px" }}>
                  <input type="checkbox" style={{ cursor: "pointer" }} />
                </th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#3D3C52", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    Name
                    <ChevronsUpDown size={12} style={{ color: "#8C899F" }} />
                  </div>
                </th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#3D3C52" }}>Version</th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#3D3C52" }}>Type</th>
                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#3D3C52", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    Created on
                    <ChevronsUpDown size={12} style={{ color: "#8C899F" }} />
                  </div>
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
                  style={{
                    background: i % 2 === 0 ? "#fff" : "#FAFAFA",
                    borderBottom: "1px solid #F2F2F8",
                    cursor: "pointer",
                    transition: "background-color 100ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#F0F4FF")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFAFA")}
                >
                  <td style={{ padding: "12px 12px 12px 20px" }}>
                    <input type="checkbox" style={{ cursor: "pointer" }} onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Folder size={15} style={{ color: "#8C899F", flexShrink: 0 }} />
                      <span style={{ color: "#1F1F32", fontWeight: 500 }}>{popup.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px", color: "#525066" }}>
                    <span style={{
                      color: "#0975D7", textDecoration: "underline", cursor: "pointer",
                      fontWeight: 500,
                    }}>
                      {popup.version}
                    </span>
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

        {/* Pagination footer */}
        <div style={{
          background: "#fff", borderTop: "1px solid #ECECF3",
          padding: "12px 24px", display: "flex", alignItems: "center",
          justifyContent: "space-between", fontSize: "13px", color: "#525066",
          flexShrink: 0,
        }}>
          <span>Rows 1–{filtered.length} of {POPUPS.length}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button className="wf-icon-btn"><ChevronLeft size={14} /></button>
            <button style={{
              width: "30px", height: "30px", borderRadius: "6px", border: "none",
              background: "#0975D7", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer",
            }}>1</button>
            <button style={{
              width: "30px", height: "30px", borderRadius: "6px", border: "1px solid #DFDDE7",
              background: "transparent", fontSize: "13px", cursor: "pointer", color: "#3D3C52",
            }}>2</button>
            <button className="wf-icon-btn"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Self Help floating button */}
      <button style={{
        position: "fixed", bottom: "24px", right: "24px", zIndex: 300,
        display: "flex", alignItems: "center", gap: "8px",
        background: "#1F1F32", color: "white", border: "none", borderRadius: "24px",
        padding: "10px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      }}>
        <HelpCircle size={16} />
        Self Help
      </button>
    </div>
  )
}
