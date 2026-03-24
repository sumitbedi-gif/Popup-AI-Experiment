"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

// ── Content constants ────────────────────────────────────────────────────────
const ORIGINAL_HEADING = "Scheduled System Maintenance"
const ORIGINAL_BODY =
  "We would like to inform you that our system will undergo scheduled maintenance on Saturday, January 25th, 2026, starting at 2:00 AM EST and concluding at approximately 6:00 AM EST. During this maintenance window, all services including the customer portal, API endpoints, and reporting dashboard will be temporarily unavailable. We apologize for any inconvenience this may cause and recommend that you save all work in progress before the maintenance period begins. If you have any questions or concerns, please contact our support team."
const ORIGINAL_CTA = "OK"

const FIXED_BODY =
  "Scheduled maintenance on Jan 25, 2:00\u20136:00 AM EST. All services will be temporarily unavailable. Please save your work beforehand."
const FIXED_CTA = "View Status Page"

// ── Types ────────────────────────────────────────────────────────────────────
export type IssueId = "body" | "cta" | "media" | "checkbox" | "contrast"

interface OutagePopupProps {
  fixedIssues: Set<IssueId>
  /** Currently scanning issue (shows overlay animation) */
  scanningIssue?: IssueId | null
  containerClassName?: string
  children?: React.ReactNode
}

// ── Component ────────────────────────────────────────────────────────────────
export function OutagePopup({ fixedIssues, scanningIssue, containerClassName, children }: OutagePopupProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const bodyFixed = fixedIssues.has("body")
  const ctaFixed = fixedIssues.has("cta")
  const mediaFixed = fixedIssues.has("media")
  const checkboxFixed = fixedIssues.has("checkbox")
  const contrastFixed = fixedIssues.has("contrast")

  const displayBody = bodyFixed ? FIXED_BODY : ORIGINAL_BODY
  const displayCta = ctaFixed ? FIXED_CTA : ORIGINAL_CTA
  const bodyColor = contrastFixed ? "#333333" : "#999999"

  return (
    <div className={containerClassName ?? "fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 px-4"}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/8 backdrop-blur-[2px]" aria-hidden="true" />

      {/* Popup card */}
      <div className="relative z-10 w-full max-w-lg">
        <div
          className="relative overflow-hidden bg-white"
          style={{
            borderRadius: "14px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "scale(1)" : "scale(0.96)",
            transition: "opacity 350ms cubic-bezier(0.2,0,0.2,1), transform 350ms cubic-bezier(0.2,0,0.2,1)",
          }}
        >
          {/* Scan overlay */}
          {scanningIssue && (
            <div className="pointer-events-none absolute inset-0 z-30">
              <div className="absolute inset-0 bg-blue-950/40" />
              <div className="scan-beam" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px 24px", borderRadius: "14px",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" className="animate-spin">
                    <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span style={{
                    fontSize: "13px", fontWeight: 600, color: "#fff",
                    letterSpacing: "0.01em",
                  }}>
                    Fixing with AI…
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Close button — only appears when checkbox issue is fixed */}
          {checkboxFixed && (
            <button
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              style={{ cursor: "default" }}
            >
              <X size={15} />
            </button>
          )}

          {/* Scroll area */}
          <div>
            {/* Media — shown only when media issue is fixed */}
            {mediaFixed && (
              <div
                className="flex items-center justify-center px-8 pt-6"
                style={{
                  transition: "opacity 400ms ease, max-height 400ms ease",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Education icons.svg"
                  alt="System maintenance"
                  style={{
                    height: "160px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            {/* Content — center-aligned */}
            <div
              className="flex flex-col gap-3 px-8 pb-6 pt-5"
              style={{ alignItems: "center", textAlign: "center" }}
            >
              {/* Heading */}
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                {ORIGINAL_HEADING}
              </h2>

              {/* Body */}
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.65,
                  color: bodyColor,
                  margin: 0,
                  transition: "color 600ms ease",
                }}
              >
                {displayBody}
              </p>

              {/* CTA button */}
              <button
                style={{
                  marginTop: "16px",
                  padding: ctaFixed ? "12px 48px" : "10px 32px",
                  borderRadius: "8px",
                  border: "none",
                  background: ctaFixed ? "#1F2937" : "#e5e7eb",
                  color: ctaFixed ? "#fff" : "#374151",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "default",
                  transition: "all 400ms ease",
                }}
              >
                {displayCta}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Children (e.g. issues pill) */}
      {children}
    </div>
  )
}
