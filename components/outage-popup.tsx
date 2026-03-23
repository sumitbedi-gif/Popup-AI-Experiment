"use client"

import { X } from "lucide-react"

// ── Content constants ────────────────────────────────────────────────────────
const ORIGINAL_HEADING = "Scheduled System Maintenance"
const ORIGINAL_BODY =
  "We would like to inform you that our system will undergo scheduled maintenance on Saturday, January 25th, 2026, starting at 2:00 AM EST and concluding at approximately 6:00 AM EST. During this maintenance window, all services including the customer portal, API endpoints, and reporting dashboard will be temporarily unavailable. We apologize for any inconvenience this may cause and recommend that you save all work in progress before the maintenance period begins. If you have any questions or concerns, please contact our support team."
const ORIGINAL_CTA = "OK"

const FIXED_BODY =
  "Scheduled maintenance on Jan 25, 2:00–6:00 AM EST. All services will be temporarily unavailable. Save your work before the window begins."
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
          }}
        >
          {/* Scan overlay */}
          {scanningIssue && (
            <div className="pointer-events-none absolute inset-0 z-30">
              <div className="absolute inset-0 bg-blue-950/40" />
              <div className="scan-beam" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-7 py-4 backdrop-blur-md">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-white">
                    Applying fix…
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Close button */}
          <button
            className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            style={{ cursor: "default" }}
          >
            <X size={15} />
          </button>

          {/* Scroll area */}
          <div className="max-h-[520px] overflow-y-auto">
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
                  src="/images/System outage copy.svg"
                  alt="System outage warning"
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
                  marginTop: "8px",
                  padding: ctaFixed ? "11px 24px" : "10px 32px",
                  borderRadius: "8px",
                  border: "none",
                  background: ctaFixed ? "#2563eb" : "#e5e7eb",
                  color: ctaFixed ? "#fff" : "#374151",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "default",
                  transition: "all 400ms ease",
                }}
              >
                {displayCta}
              </button>

              {/* Don't show again checkbox — appears when checkbox issue is fixed */}
              {checkboxFixed && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#6b7280",
                    marginTop: "4px",
                    cursor: "default",
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    style={{ cursor: "default", accentColor: "#2563eb" }}
                  />
                  Don&apos;t show me again
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Children (e.g. issues pill) */}
      {children}
    </div>
  )
}
