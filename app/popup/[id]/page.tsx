"use client"

import { Suspense, useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { WhatfixSidebar } from "@/components/whatfix-sidebar"
import { PromoPopup } from "@/components/promo-popup"

// ── Shared sub-components ─────────────────────────────────────────────────────
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
      <span style={{ fontSize: "13px", color: "#1F1F32", fontWeight: 500 }}>{label}</span>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: "1px", background: "#ECECF3", margin: "2px 0" }} />
}

function UniformToggle() {
  const [on, setOn] = useState(true)
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{ fontSize: "12px", color: "#6B697B" }}>Uniform</span>
      <button
        onClick={() => setOn(o => !o)}
        style={{
          width: "36px", height: "20px", borderRadius: "10px", border: "none",
          background: on ? "#0975D7" : "#D1D5DB", position: "relative",
          cursor: "pointer", flexShrink: 0, transition: "background 200ms",
        }}
      >
        <div style={{
          position: "absolute", top: "2px", left: on ? "18px" : "2px",
          width: "16px", height: "16px", borderRadius: "50%", background: "#fff",
          transition: "left 200ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>
  )
}

function SliderRow({ label, defaultValue, min = 0, max = 60, unit = "px" }: {
  label: string; defaultValue: number; min?: number; max?: number; unit?: string
}) {
  const [val, setVal] = useState(defaultValue)
  return (
    <div style={{ padding: "6px 0 10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", color: "#6B697B" }}>{label}</span>
        <span style={{ fontSize: "12px", color: "#6B697B" }}>{val} {unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#0975D7", cursor: "pointer" }}
      />
    </div>
  )
}

// ── Accordion ─────────────────────────────────────────────────────────────────
function PanelAccordion({ title, defaultOpen = false, children }: {
  title: string; defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: "1px solid #ECECF3" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", border: "none", background: "none", cursor: "pointer",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#1F1F32" }}>{title}</span>
        {open
          ? <ChevronUp size={16} style={{ color: "#6B697B" }} />
          : <ChevronDown size={16} style={{ color: "#6B697B" }} />}
      </button>
      {open && <div style={{ padding: "0 16px 12px" }}>{children}</div>}
    </div>
  )
}

// ── Appearance accordion content ──────────────────────────────────────────────
function AppearanceContent() {
  const [bgMode, setBgMode] = useState<"Color" | "Image">("Color")
  const [color, setColor] = useState("#E85D5D")

  return (
    <>
      <Row label="Background">
        <div style={{ display: "flex", border: "1px solid #DFDDE7", borderRadius: "6px", overflow: "hidden" }}>
          {(["Color", "Image"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setBgMode(mode)}
              style={{
                padding: "5px 14px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 500,
                background: bgMode === mode ? "#0975D7" : "#fff",
                color: bgMode === mode ? "#fff" : "#6B697B",
                transition: "background 150ms",
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </Row>

      <Row label="Color">
        <label style={{ cursor: "pointer" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "6px", background: color,
            border: "1px solid #DFDDE7", cursor: "pointer",
          }} />
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
        </label>
      </Row>

      <Divider />

      <Row label="Padding"><UniformToggle /></Row>
      <SliderRow label="All sides" defaultValue={28} min={0} max={60} />

      <Divider />

      <Row label="Border Radius"><UniformToggle /></Row>
      <SliderRow label="All sides" defaultValue={20} min={0} max={40} />
    </>
  )
}

// ── Position accordion content ────────────────────────────────────────────────
function PositionContent() {
  const positions = ["Top left", "Top center", "Top right", "Center left", "Center", "Center right", "Bottom left", "Bottom center", "Bottom right"]
  const [selected, setSelected] = useState("Center")
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", padding: "4px 0 8px" }}>
      {positions.map((pos) => (
        <button
          key={pos}
          onClick={() => setSelected(pos)}
          style={{
            padding: "8px 4px", borderRadius: "6px", border: "1px solid",
            borderColor: selected === pos ? "#0975D7" : "#DFDDE7",
            background: selected === pos ? "#EFF6FF" : "#fff",
            color: selected === pos ? "#0975D7" : "#6B697B",
            fontSize: "11px", cursor: "pointer", fontWeight: selected === pos ? 600 : 400,
          }}
        >
          {pos}
        </button>
      ))}
    </div>
  )
}

// ── Controls accordion content ────────────────────────────────────────────────
function ControlsContent() {
  const controls = [
    { label: "Show close button", default: true },
    { label: "Close on backdrop click", default: true },
    { label: "Show progress dots", default: false },
    { label: "Auto-advance slides", default: false },
  ]
  const [states, setStates] = useState(() => controls.map(c => c.default))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingBottom: "8px" }}>
      {controls.map((ctrl, i) => (
        <div key={ctrl.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}>
          <span style={{ fontSize: "13px", color: "#1F1F32" }}>{ctrl.label}</span>
          <button
            onClick={() => setStates(prev => prev.map((v, j) => j === i ? !v : v))}
            style={{
              width: "36px", height: "20px", borderRadius: "10px", border: "none",
              background: states[i] ? "#0975D7" : "#D1D5DB", position: "relative",
              cursor: "pointer", flexShrink: 0, transition: "background 200ms",
            }}
          >
            <div style={{
              position: "absolute", top: "2px", left: states[i] ? "18px" : "2px",
              width: "16px", height: "16px", borderRadius: "50%", background: "#fff",
              transition: "left 200ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Right config panel ────────────────────────────────────────────────────────
function ConfigPanel() {
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: "300px", zIndex: 100,
      background: "#fff", borderLeft: "1px solid #ECECF3",
      overflowY: "auto", fontFamily: "Inter, -apple-system, sans-serif",
    }}>
      <PanelAccordion title="Appearance" defaultOpen>
        <AppearanceContent />
      </PanelAccordion>
      <PanelAccordion title="Position">
        <PositionContent />
      </PanelAccordion>
      <PanelAccordion title="Controls">
        <ControlsContent />
      </PanelAccordion>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
function EditorPageInner() {
  return (
    <>
      <WhatfixSidebar activeId="widgets" />
      <PromoPopup containerClassName="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 pl-[260px] pr-[300px]" />
      <ConfigPanel />
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
