"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useState } from "react"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { WhatfixSidebar } from "@/components/whatfix-sidebar"
import { PromoPopup } from "@/components/promo-popup"

// ── Right config panel ────────────────────────────────────────────────────
function ConfigPanel() {
  const [appearanceOpen, setAppearanceOpen] = useState(true)
  const [positionOpen, setPositionOpen] = useState(false)
  const [controlsOpen, setControlsOpen] = useState(false)
  const [bgMode, setBgMode] = useState<"color" | "image">("color")
  const [overlay, setOverlay] = useState<"dim" | "blur">("dim")
  const [padding, setPadding] = useState(28)
  const [borderRadius, setBorderRadius] = useState(20)

  return (
    <div style={{
      position: "fixed", right: 0, top: 0, width: "300px", height: "100vh",
      background: "#fff", borderLeft: "1px solid #ECECF3", zIndex: 200,
      display: "flex", flexDirection: "column",
      boxShadow: "-4px 0 12px rgba(0,0,0,0.06)",
      fontFamily: "Inter, -apple-system, sans-serif",
    }}>
      {/* Scrollable sections */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Appearance */}
        <section style={{ borderBottom: "1px solid #ECECF3" }}>
          <button
            onClick={() => setAppearanceOpen(!appearanceOpen)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", border: "none", background: "transparent",
              cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "#1F1F32",
            }}
          >
            Appearance
            {appearanceOpen
              ? <ChevronUp size={16} style={{ color: "#6B697B" }} />
              : <ChevronDown size={16} style={{ color: "#6B697B" }} />}
          </button>

          {appearanceOpen && (
            <div style={{ padding: "4px 20px 20px", display: "flex", flexDirection: "column", gap: "18px" }}>

              {/* Background */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "#3D3C52", display: "block", marginBottom: "8px" }}>
                  Background
                </label>
                <div style={{ display: "flex", borderRadius: "6px", border: "1px solid #DFDDE7", overflow: "hidden" }}>
                  {(["color", "image"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setBgMode(mode)}
                      style={{
                        flex: 1, padding: "7px", border: "none", cursor: "pointer",
                        fontSize: "13px", fontWeight: 500, transition: "background 150ms",
                        background: bgMode === mode ? "#0975D7" : "transparent",
                        color: bgMode === mode ? "#fff" : "#3D3C52",
                        textTransform: "capitalize",
                      }}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color swatch */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#3D3C52" }}>Color</span>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: "#E07B7B", border: "2px solid #DFDDE7", cursor: "pointer",
                }} />
              </div>

              {/* Padding */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#3D3C52" }}>Padding</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#6B697B" }}>Uniform</span>
                    <div
                      style={{
                        width: "34px", height: "18px", borderRadius: "9px", cursor: "pointer",
                        background: "#0975D7", position: "relative", transition: "background 150ms",
                      }}
                    >
                      <div style={{
                        position: "absolute", right: "2px", top: "2px",
                        width: "14px", height: "14px", borderRadius: "50%", background: "#fff",
                      }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#6B697B" }}>All sides</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#3D3C52" }}>{padding} px</span>
                </div>
                <input
                  type="range" min={0} max={60} value={padding}
                  onChange={(e) => setPadding(+e.target.value)}
                  style={{ width: "100%", accentColor: "#0975D7" }}
                />
              </div>

              {/* Border Radius */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#3D3C52" }}>Border Radius</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "12px", color: "#6B697B" }}>Uniform</span>
                    <div style={{
                      width: "34px", height: "18px", borderRadius: "9px", cursor: "pointer",
                      background: "#0975D7", position: "relative",
                    }}>
                      <div style={{
                        position: "absolute", right: "2px", top: "2px",
                        width: "14px", height: "14px", borderRadius: "50%", background: "#fff",
                      }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#6B697B" }}>All sides</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#3D3C52" }}>{borderRadius} px</span>
                </div>
                <input
                  type="range" min={0} max={40} value={borderRadius}
                  onChange={(e) => setBorderRadius(+e.target.value)}
                  style={{ width: "100%", accentColor: "#0975D7" }}
                />
              </div>

              {/* Overlay */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#3D3C52" }}>Overlay</span>
                  <div style={{ display: "flex", gap: "14px" }}>
                    {(["dim", "blur"] as const).map((mode) => (
                      <label key={mode} style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", fontSize: "13px", color: "#3D3C52" }}>
                        <input
                          type="radio" name="overlay" value={mode}
                          checked={overlay === mode}
                          onChange={() => setOverlay(mode)}
                          style={{ accentColor: "#0975D7" }}
                        />
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Position */}
        <section style={{ borderBottom: "1px solid #ECECF3" }}>
          <button
            onClick={() => setPositionOpen(!positionOpen)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", border: "none", background: "transparent",
              cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "#1F1F32",
            }}
          >
            Position
            {positionOpen
              ? <ChevronUp size={16} style={{ color: "#6B697B" }} />
              : <ChevronDown size={16} style={{ color: "#6B697B" }} />}
          </button>
          {positionOpen && (
            <div style={{ padding: "4px 20px 20px" }}>
              <p style={{ fontSize: "13px", color: "#6B697B" }}>Center (default)</p>
            </div>
          )}
        </section>

        {/* Controls */}
        <section style={{ borderBottom: "1px solid #ECECF3" }}>
          <button
            onClick={() => setControlsOpen(!controlsOpen)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", border: "none", background: "transparent",
              cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "#1F1F32",
            }}
          >
            Controls
            {controlsOpen
              ? <ChevronUp size={16} style={{ color: "#6B697B" }} />
              : <ChevronDown size={16} style={{ color: "#6B697B" }} />}
          </button>
          {controlsOpen && (
            <div style={{ padding: "4px 20px 20px" }}>
              <p style={{ fontSize: "13px", color: "#6B697B" }}>Close button enabled</p>
            </div>
          )}
        </section>
      </div>

      {/* Bottom action bar */}
      <div style={{
        padding: "14px 20px", borderTop: "1px solid #ECECF3",
        display: "flex", gap: "10px",
      }}>
        <button style={{
          flex: 1, padding: "9px", border: "1px solid #DFDDE7", borderRadius: "6px",
          background: "transparent", fontSize: "13px", fontWeight: 500,
          color: "#3D3C52", cursor: "pointer",
        }}>
          Discard
        </button>
        <button style={{
          flex: 1, padding: "9px", border: "none", borderRadius: "6px",
          background: "#C74900", color: "#fff", fontSize: "13px", fontWeight: 500,
          cursor: "pointer",
        }}>
          Save
        </button>
      </div>
    </div>
  )
}

// ── Top breadcrumb bar ────────────────────────────────────────────────────
function EditorHeader({ popupName }: { popupName: string }) {
  const router = useRouter()

  return (
    <div style={{
      position: "fixed", top: 0, left: "260px", right: "300px", zIndex: 200,
      background: "#fff", borderBottom: "1px solid #ECECF3",
      fontFamily: "Inter, -apple-system, sans-serif",
    }}>
      {/* Breadcrumb */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "10px 24px 0", fontSize: "13px", color: "#6B697B",
      }}>
        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#6B697B", fontSize: "13px", padding: 0 }}
        >
          All content
        </button>
        <ChevronRight size={12} style={{ color: "#C4C3D0" }} />
        <button
          onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#6B697B", fontSize: "13px", padding: 0 }}
        >
          {popupName}
        </button>
        <span style={{
          background: "#EBF5FF", color: "#0975D7", fontSize: "11px", fontWeight: 600,
          padding: "2px 8px", borderRadius: "4px",
        }}>
          Editing
        </span>
      </div>

      {/* Title + tabs */}
      <div style={{ padding: "6px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Folder icon */}
          <div style={{
            width: "28px", height: "28px", border: "2px solid #DFDDE7", borderRadius: "4px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: "14px", height: "10px", border: "2px solid #8C899F", borderRadius: "1px" }} />
          </div>
          <h1 style={{ fontSize: "18px", fontWeight: 600, color: "#1F1F32", margin: 0 }}>{popupName}</h1>
        </div>

        <div style={{ display: "flex", gap: "24px" }}>
          {["Configurations", "Visibility Rules"].map((tab, i) => (
            <button
              key={tab}
              className={`wf-tab ${i === 0 ? "active" : ""}`}
              style={{ fontSize: "13px" }}
            >
              <span>{tab}</span>
              <div className="wf-tab-indicator" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
function EditorPageInner() {
  const searchParams = useSearchParams()
  const popupName = searchParams.get("name") || "Popup"

  return (
    <>
      <WhatfixSidebar activeId="widgets" />
      <EditorHeader popupName={popupName} />
      <ConfigPanel />

      {/* The PromoPopup renders full-screen with fixed positioning,
          fitting naturally between the sidebars */}
      <PromoPopup />
    </>
  )
}

export default function PopupEditorPage() {
  return (
    <Suspense>
      <EditorPageInner />
    </Suspense>
  )
}
