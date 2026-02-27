"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronLeft, ChevronRight, ChevronDown,
  LayoutGrid, Layers, BarChart2, Palette, Tag, Settings,
  Bell, BookOpen, MessageSquare,
} from "lucide-react"

interface NavItem {
  id: string
  label: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { id: "content",   label: "Content",            Icon: LayoutGrid, href: "#" },
  { id: "widgets",   label: "Widgets",             Icon: Layers,     href: "/" },
  { id: "analytics", label: "Guidance analytics",  Icon: BarChart2,  href: "#" },
  { id: "style",     label: "Style",               Icon: Palette,    href: "#" },
  { id: "tags",      label: "Tags",                Icon: Tag,        href: "#" },
  { id: "settings",  label: "Settings",            Icon: Settings,   href: "/settings" },
]

const BOTTOM_ITEMS: NavItem[] = [
  { id: "notifications", label: "Notifications", Icon: Bell,           href: "#" },
  { id: "resources",     label: "Resources",     Icon: BookOpen,       href: "#" },
  { id: "chat",          label: "Chat",          Icon: MessageSquare,  href: "#" },
]

export function WhatfixSidebar({ activeId = "widgets" }: { activeId?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <aside
      className="sidebar"
      style={{
        position: "fixed", left: 0, top: 0, zIndex: 200,
        display: "flex", flexDirection: "column", height: "100vh",
        width: isCollapsed ? "68px" : "260px",
        transition: "width 200ms",
      }}
    >
      {/* Collapse toggle */}
      <button
        className="sidebar-collapse-btn"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed
          ? <ChevronRight size={14} strokeWidth={2.5} />
          : <ChevronLeft  size={14} strokeWidth={2.5} />}
      </button>

      {/* Header — product name */}
      <div
        className="sidebar-header"
        style={isCollapsed ? { justifyContent: "center", padding: "0 0 0 2px" } : {}}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Whatfix diamond */}
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M16 4L28 16L16 28L4 16L16 4Z" fill="#E45913" />
            <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="#FF7A3D" />
          </svg>
          {!isCollapsed && (
            <span style={{ color: "#fff", fontSize: "17px", fontWeight: 600 }}>Guidance</span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Workspace selector */}
      {!isCollapsed && (
        <button className="sidebar-org-selector">
          <div style={{
            width: "26px", height: "26px", borderRadius: "6px",
            background: "#E45913", display: "flex", alignItems: "center",
            justifyContent: "center", color: "white", fontSize: "12px",
            fontWeight: 700, flexShrink: 0,
          }}>
            S
          </div>
          <span style={{ flex: 1, fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>
            Sumit_Bedi_Demo
          </span>
          <ChevronDown size={14} style={{ color: "#A8A8BF" }} />
        </button>
      )}

      {/* Main navigation */}
      <nav
        className={`sidebar-nav ${isCollapsed ? "sidebar-nav-collapsed" : ""}`}
        style={{ marginTop: isCollapsed ? "8px" : "4px" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV_ITEMS.map(({ id, label, Icon, href }) => {
            const isActive = id === activeId
            return (
              <Link
                key={id}
                href={href}
                className={`sidebar-item ${isCollapsed ? "sidebar-item-collapsed" : ""} ${isActive ? "active" : ""}`}
              >
                <Icon size={20} strokeWidth={1.8} className="sidebar-item-icon" />
                {!isCollapsed && <span>{label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Bottom section */}
      <div className={`sidebar-bottom ${isCollapsed ? "sidebar-bottom-collapsed" : ""}`}>
        {/* User */}
        <button
          className="sidebar-user"
          style={isCollapsed ? { justifyContent: "center", padding: "8px 0" } : {}}
        >
          <div className="sidebar-user-avatar">S</div>
          {!isCollapsed && <span>Sumit Bedi</span>}
        </button>

        {/* Utility items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
          {BOTTOM_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sidebar-item ${isCollapsed ? "sidebar-item-collapsed" : ""}`}
            >
              <Icon size={20} strokeWidth={1.8} className="sidebar-item-icon" />
              {!isCollapsed && <span>{label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Whatfix logo */}
      {isMounted && (
        <div style={{
          display: "flex", justifyContent: isCollapsed ? "center" : "flex-start",
          alignItems: "center", padding: isCollapsed ? "10px 0" : "10px 20px",
        }}>
          <Image
            src="/brand/whatfix-logo.png"
            alt="Whatfix"
            width={isCollapsed ? 24 : 80}
            height={24}
            style={{ objectFit: "contain", opacity: 0.7, width: "auto", height: "24px" }}
          />
        </div>
      )}
    </aside>
  )
}
