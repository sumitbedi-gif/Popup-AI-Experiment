"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, X, Trash2 } from "lucide-react"
import { WhatfixSidebar } from "@/components/whatfix-sidebar"

// ── Types ─────────────────────────────────────────────────────────────────────
interface PropertyItem {
  id: string
  name: string
  description: string
  enabled: boolean
  section: string
  values?: string[]
}

// ── Default values for popup properties ──────────────────────────────────────
const POPUP_DEFAULT_VALUES: Record<string, string[]> = {
  "popup-use-cases": [
    "Employee onboarding", "Release management", "Training and guidance",
    "Policy and governance", "Announcements", "Incident and Outages",
  ],
  "popup-type": ["Modal", "Snackbar", "Carousel"],
  "popup-content": ["Media and text", "Only text"],
}

// ── Modal category data ───────────────────────────────────────────────────────
const MODAL_CATEGORIES = [
  {
    name: "Analytics", count: 2,
    items: [
      { id: "ga-exclude",   name: "GA Exclude Optional Dimensions", description: "Mitigate the need for whitelisting the Google Analytics domain, enabling this reduces the GA payload, sending hits as GET calls, but some POST calls may still be missed" },
      { id: "proxy-domain", name: "Proxy Domain",                   description: "Address customer restrictions, the IT team can establish a forward proxy with a custom domain to receive analytics calls, forwarding them to the whatfix.com endpoint" },
    ],
  },
  {
    name: "App Properties", count: 3,
    items: [
      { id: "app-locale",   name: "Application Locale",     description: "Set the application locale for multilingual support across your guided experiences" },
      { id: "app-env",      name: "Environment Identifier", description: "Tag the application environment (prod, staging, dev) for accurate analytics segmentation" },
      { id: "app-version",  name: "App Version Tracking",   description: "Track which version of the application users are on to correlate guidance performance" },
    ],
  },
  {
    name: "Common Properties", count: 20,
    items: [
      { id: "elem-reliability",    name: "Element reliability indicator", description: "Displays the reliability of the captured step on Studio and Dashboard" },
      { id: "realtime-validation", name: "Real time rule validation",      description: "Enables real time validation of Visibility & Element Precision rules in Studio" },
      { id: "user-segment",        name: "User Segmentation",             description: "Segment users by role, plan, or custom attributes for targeted guidance" },
      { id: "session-replay",      name: "Session Replay Integration",    description: "Connect session replay tools to correlate guidance events with user sessions" },
    ],
  },
  {
    name: "Flow", count: 9,
    items: [
      { id: "flow-resume",   name: "Flow Resume",         description: "Allow users to resume interrupted flows from where they left off" },
      { id: "flow-skip",     name: "Step Skip",           description: "Enable users to skip individual steps within a guided flow" },
      { id: "flow-progress", name: "Progress Indicator",  description: "Show a progress bar or step count to users during a flow" },
    ],
  },
  {
    name: "Self Help", count: 7,
    items: [
      { id: "sh-search",   name: "Search Boost",     description: "Enhance search relevance with AI-powered content ranking" },
      { id: "sh-feedback", name: "Article Feedback", description: "Allow users to rate and provide feedback on self-help articles" },
      { id: "sh-related",  name: "Related Articles", description: "Automatically surface related content at the end of each article" },
    ],
  },
  {
    name: "Smart Tip", count: 3,
    items: [
      { id: "st-delay",     name: "Display Delay",      description: "Set a delay before smart tips appear to avoid interrupting user flow" },
      { id: "st-frequency", name: "Show Frequency",     description: "Control how often a smart tip is shown to the same user" },
      { id: "st-dismiss",   name: "Persistent Dismiss", description: "Remember dismissed smart tips across sessions for a cleaner experience" },
    ],
  },
  {
    name: "User Action", count: 6,
    items: [
      { id: "ua-click", name: "Click Tracking",   description: "Track user click events to measure engagement with guided content" },
      { id: "ua-hover", name: "Hover Tracking",   description: "Record hover interactions for heatmap and attention analysis" },
      { id: "ua-form",  name: "Form Completion",  description: "Monitor form fill rates and identify drop-off fields in your application" },
    ],
  },
  {
    name: "Popups", count: 3,
    items: [
      { id: "popup-use-cases", name: "Use cases", description: "Add or delete use cases for your popup content to target specific user scenarios and workflows" },
      { id: "popup-type",      name: "Type",      description: "Add or delete types to customize the visual structure and presentation of your popups" },
      { id: "popup-content",   name: "Content",   description: "Add or delete content blocks to manage the text, media, and messaging within your popups" },
    ],
  },
]

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: "44px", height: "24px", borderRadius: "12px", border: "none",
        background: enabled ? "#0975D7" : "#D1D5DB",
        position: "relative", cursor: "pointer", flexShrink: 0,
        transition: "background 200ms",
      }}
    >
      <div style={{
        position: "absolute",
        left: enabled ? "22px" : "2px",
        top: "2px",
        width: "20px", height: "20px", borderRadius: "50%", background: "#fff",
        transition: "left 200ms",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  )
}

// ── Accordion section ─────────────────────────────────────────────────────────
function AccordionSection({
  sectionName, items, onToggle, onDelete,
  onUpdateValue, onDeleteValue, onAddValue,
}: {
  sectionName: string
  items: PropertyItem[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdateValue?: (itemId: string, index: number, value: string) => void
  onDeleteValue?: (itemId: string, index: number) => void
  onAddValue?: (itemId: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ marginBottom: "8px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "none", border: "none", cursor: "pointer",
          padding: "10px 0", fontSize: "15px", fontWeight: 600, color: "#1F1F32",
        }}
      >
        {open
          ? <ChevronUp size={16} style={{ color: "#6B697B" }} />
          : <ChevronDown size={16} style={{ color: "#6B697B" }} />}
        {sectionName} ({items.length})
      </button>

      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "16px 20px", background: "#fff",
                border: "1px solid #ECECF3", borderRadius: "8px",
              }}
            >
              {/* Property header row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <Toggle enabled={item.enabled} onChange={() => onToggle(item.id)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "#1F1F32" }}>{item.name}</div>
                  <div style={{ fontSize: "13px", color: "#6B697B", marginTop: "2px" }}>{item.description}</div>
                </div>
                {/* Hide trash when only 1 property remains in the section */}
                {items.length > 1 && (
                  <button
                    onClick={() => onDelete(item.id)}
                    style={{ border: "none", background: "none", cursor: "pointer", color: "#C4C3D0", padding: "4px", display: "flex", borderRadius: "4px", flexShrink: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#C4C3D0")}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Editable value list (popup properties only) */}
              {item.values && (
                <div style={{ marginTop: "14px", paddingLeft: "60px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {item.values.map((val, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => onUpdateValue?.(item.id, idx, e.target.value)}
                          style={{
                            width: "260px", padding: "7px 12px",
                            border: "1px solid #DFDDE7", borderRadius: "6px",
                            fontSize: "13px", color: "#1F1F32",
                            outline: "none", background: "#fff",
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#0975D7")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "#DFDDE7")}
                        />
                        {/* Hide delete on last value */}
                        {item.values!.length > 1 && (
                          <button
                            onClick={() => onDeleteValue?.(item.id, idx)}
                            style={{
                              border: "none", background: "none", cursor: "pointer",
                              color: "#C4C3D0", padding: "4px", display: "flex",
                              borderRadius: "4px", flexShrink: 0,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#C4C3D0")}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => onAddValue?.(item.id)}
                    style={{
                      marginTop: "10px",
                      padding: "5px 14px", borderRadius: "5px",
                      border: "1px solid #0975D7", background: "transparent",
                      color: "#0975D7", fontSize: "12px", fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    + Add
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Add Preferences Modal ─────────────────────────────────────────────────────
function AddPreferencesModal({ existingIds, onClose, onAdd }: {
  existingIds: Set<string>
  onClose: () => void
  onAdd: (items: { id: string; name: string; description: string; section: string }[]) => void
}) {
  const [selectedCategory, setSelectedCategory] = useState("Analytics")
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const category = MODAL_CATEGORIES.find(c => c.name === selectedCategory)!

  function toggleCheck(id: string) {
    const next = new Set(checked)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setChecked(next)
  }

  function handleAdd() {
    const toAdd = MODAL_CATEGORIES
      .flatMap(cat => cat.items.map(item => ({ ...item, section: cat.name })))
      .filter(item => checked.has(item.id) && !existingIds.has(item.id))
    onAdd(toAdd)
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: "12px", width: "820px", maxHeight: "82vh",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          fontFamily: "Inter, -apple-system, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #ECECF3", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#1F1F32", margin: 0 }}>Add preferences</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left: category list */}
          <div style={{ width: "230px", borderRight: "1px solid #ECECF3", overflowY: "auto", padding: "8px 0" }}>
            {MODAL_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 20px", border: "none", cursor: "pointer",
                    fontSize: "14px", fontWeight: isActive ? 600 : 500,
                    background: isActive ? "#0975D7" : "transparent",
                    color: isActive ? "#fff" : "#1F1F32",
                  }}
                >
                  <span>{cat.name}</span>
                  <span style={{ fontSize: "13px", color: isActive ? "rgba(255,255,255,0.75)" : "#6B697B" }}>{cat.count}</span>
                </button>
              )
            })}
          </div>

          {/* Right: property checkboxes */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            {category.items.map((item) => {
              const alreadyAdded = existingIds.has(item.id)
              const isChecked = checked.has(item.id)
              return (
                <label
                  key={item.id}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "12px",
                    padding: "14px 16px", border: "1px solid #ECECF3", borderRadius: "8px",
                    marginBottom: "10px", cursor: alreadyAdded ? "default" : "pointer",
                    background: alreadyAdded ? "#F9F9FC" : "#fff",
                    opacity: alreadyAdded ? 0.55 : 1,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked || alreadyAdded}
                    disabled={alreadyAdded}
                    onChange={() => { if (!alreadyAdded) toggleCheck(item.id) }}
                    style={{ marginTop: "2px", width: "16px", height: "16px", cursor: alreadyAdded ? "default" : "pointer", accentColor: "#0975D7", flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#1F1F32" }}>{item.name}</div>
                    <div style={{ fontSize: "13px", color: "#6B697B", marginTop: "3px", lineHeight: "1.5" }}>{item.description}</div>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 28px", borderTop: "1px solid #ECECF3", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{ padding: "9px 24px", borderRadius: "6px", border: "1.5px solid #C74900", background: "transparent", color: "#C74900", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={checked.size === 0}
            style={{
              padding: "9px 24px", borderRadius: "6px", border: "none",
              background: checked.size === 0 ? "#E5E7EB" : "#C74900",
              color: checked.size === 0 ? "#9CA3AF" : "#fff",
              fontSize: "14px", fontWeight: 500,
              cursor: checked.size === 0 ? "default" : "pointer",
              transition: "background 150ms",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const SETTINGS_TABS = ["Technical configuration", "Smart context", "User rules"] as const
type SettingsTab = typeof SETTINGS_TABS[number]

const INITIAL_PROPERTIES: PropertyItem[] = [
  { id: "elem-reliability",    name: "Element reliability indicator", description: "Displays the reliability of the captured step on Studio and Dashboard",                        enabled: true, section: "Common Properties" },
  { id: "realtime-validation", name: "Real time rule validation",     description: "Enables real time validation of Visibility & Element Precision rules in Studio", enabled: true, section: "Common Properties" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Technical configuration")
  const [properties, setProperties] = useState<PropertyItem[]>(INITIAL_PROPERTIES)
  const [showModal, setShowModal] = useState(false)
  const [saveError, setSaveError] = useState(false)

  const existingIds = new Set(properties.map(p => p.id))

  // Group by section, preserving insertion order
  const sections = properties.reduce<Record<string, PropertyItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  function handleToggle(id: string) {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  }

  function handleDelete(id: string) {
    setProperties(prev => prev.filter(p => p.id !== id))
  }

  function handleAdd(items: { id: string; name: string; description: string; section: string }[]) {
    setProperties(prev => [
      ...prev,
      ...items.map(i => ({
        ...i,
        enabled: true,
        values: POPUP_DEFAULT_VALUES[i.id] ? [...POPUP_DEFAULT_VALUES[i.id]] : undefined,
      })),
    ])
    setShowModal(false)
  }

  function handleUpdateValue(itemId: string, index: number, value: string) {
    setProperties(prev => prev.map(p =>
      p.id === itemId && p.values
        ? { ...p, values: p.values.map((v, i) => i === index ? value : v) }
        : p
    ))
  }

  function handleDeleteValue(itemId: string, index: number) {
    setProperties(prev => prev.map(p =>
      p.id === itemId && p.values
        ? { ...p, values: p.values.filter((_, i) => i !== index) }
        : p
    ))
  }

  function handleAddValue(itemId: string) {
    setProperties(prev => prev.map(p =>
      p.id === itemId && p.values !== undefined
        ? { ...p, values: [...p.values, ""] }
        : p
    ))
  }

  function handleSave() {
    const hasEmpty = properties.some(p => p.values?.some(v => v.trim() === ""))
    if (hasEmpty) {
      setSaveError(true)
      setTimeout(() => setSaveError(false), 4000)
      return
    }
    setSaveError(false)
    // save logic here
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FCFCFD", fontFamily: "Inter, -apple-system, sans-serif" }}>
      <WhatfixSidebar activeId="settings" />

      <div style={{ marginLeft: "260px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Studio banner */}
        <div style={{ background: "#1D4ED8", color: "white", fontSize: "13px", fontWeight: 500, padding: "10px 24px", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <span style={{ fontSize: "15px" }}>🚀</span>
          <span>
            You need the studio extension to create content like flows, beacons, launchers and smart-tips.{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>Install studio to create content</span>
          </span>
        </div>

        {/* Page header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #ECECF3", padding: "24px 32px 0" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 600, color: "#1F1F32", margin: "0 0 16px 0" }}>Advanced customisation</h1>
          <div style={{ display: "flex", gap: "28px" }}>
            {SETTINGS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`wf-tab ${activeTab === tab ? "active" : ""}`}
                style={{ fontSize: "14px" }}
              >
                <span>{tab}</span>
                <div className="wf-tab-indicator" />
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, padding: "28px 32px" }}>

          {/* Sub-header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#1F1F32" }}>
              All ({properties.length})
            </span>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowModal(true)}
                style={{ padding: "8px 18px", borderRadius: "6px", border: "1.5px solid #C74900", background: "transparent", color: "#C74900", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
              >
                Add preferences
              </button>
              <button onClick={handleSave} style={{ padding: "8px 18px", borderRadius: "6px", border: "none", background: "#C74900", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                Save
              </button>
            </div>
          </div>

          {/* Accordion sections */}
          {Object.entries(sections).map(([sectionName, items]) => (
            <AccordionSection
              key={sectionName}
              sectionName={sectionName}
              items={items}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdateValue={handleUpdateValue}
              onDeleteValue={handleDeleteValue}
              onAddValue={handleAddValue}
            />
          ))}

          {properties.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#9CA3AF", fontSize: "14px" }}>
              No properties added yet. Click &quot;Add preferences&quot; to get started.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddPreferencesModal
          existingIds={existingIds}
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}

      {/* Bottom error banner */}
      {saveError && (
        <div style={{
          position: "fixed", bottom: 0, left: "260px", right: 0, zIndex: 700,
          background: "#FEF2F2", borderTop: "1px solid #FECACA",
          padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7.5" stroke="#DC2626" />
              <path d="M8 4.5V8.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="11" r="0.75" fill="#DC2626" />
            </svg>
            <span style={{ fontSize: "13px", color: "#991B1B", fontWeight: 500 }}>
              Value can&apos;t be empty. Please fill in or remove all blank fields before saving.
            </span>
          </div>
          <button
            onClick={() => setSaveError(false)}
            style={{ border: "none", background: "none", cursor: "pointer", color: "#DC2626", display: "flex", padding: "2px" }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
