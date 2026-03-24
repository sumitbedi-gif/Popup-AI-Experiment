"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown, ChevronUp, ChevronLeft, Sparkles, Zap,
  AlignLeft, MousePointerClick, ImageIcon, SquareCheck, Eye,
  X,
} from "lucide-react"
import type { IssueId } from "./outage-popup"

// ── Types ────────────────────────────────────────────────────────────────────
export type Tier = "ai" | "standard"

interface HealthIssue {
  id: IssueId
  title: string
  severity: "fix" | "improve"
  Icon: React.ComponentType<{ size?: number; className?: string }>
  insightAI: string
  insightStandard: string
  yourDataChip: string
  howToFix: string
}

// ── Issue definitions ────────────────────────────────────────────────────────
const ISSUES: HealthIssue[] = [
  {
    id: "body",
    title: "Body text is too long",
    severity: "fix",
    Icon: AlignLeft,
    insightAI: "Your body text is ~380 characters. For incident notifications, popups with 31\u201380 characters see 3.2\u00d7 higher engagement. Your other outage popups average 65 characters.",
    insightStandard: "Your body text is ~380 characters. The recommended range for modals is 31\u201380 characters.",
    yourDataChip: "Your incident popups with 31\u201380 char body text average 23.7% engagement rate vs 7.2% for longer text.",
    howToFix: "Shorten your body text to 31\u201380 characters. Focus on the essential message: what\u2019s happening, when, and what the user should do.",
  },
  {
    id: "cta",
    title: "CTA uses dismissive text",
    severity: "fix",
    Icon: MousePointerClick,
    insightAI: 'Your CTA says "OK". For incident popups, CTAs like "View Status Page" or "Check Timeline" drive users to take meaningful action. Your best-performing outage popups use action-oriented CTAs.',
    insightStandard: 'Your CTA says "OK". Action verbs like "View Details" or "Learn More" tend to drive higher engagement than dismissive text.',
    yourDataChip: "Popups with action-verb CTAs average 10.6% engagement vs 4.3% for generic dismiss text like OK, Got It, Close.",
    howToFix: "Replace \u201COK\u201D with an action-oriented CTA like \u201CView Status Page\u201D or \u201CCheck Timeline\u201D that directs the user to a next step.",
  },
  {
    id: "media",
    title: "No visual media included",
    severity: "improve",
    Icon: ImageIcon,
    insightAI: "This popup has no image or icon. For incident and outage communications, a warning icon or status graphic helps users immediately recognize the severity.",
    insightStandard: "This popup has no image or icon. Adding a relevant visual (like a warning icon) can improve scannability.",
    yourDataChip: "Across Whatfix, incident popups with a warning icon or status image average 11.4% engagement vs 6.0% for text-only.",
    howToFix: "Add a warning icon or status illustration above the heading. A visual cue helps users immediately recognize the popup\u2019s purpose.",
  },
  {
    id: "checkbox",
    title: 'No "Don\'t show again" option',
    severity: "improve",
    Icon: SquareCheck,
    insightAI: 'This popup doesn\'t include a "Don\'t show me again" checkbox. For recurring maintenance notifications, users who\'ve acknowledged the message shouldn\'t be shown it repeatedly.',
    insightStandard: 'This popup doesn\'t include a "Don\'t show me again" checkbox. For recurring content, this lets users opt out after first viewing.',
    yourDataChip: "Popups with a suppress checkbox show 79.8% reduction in repeat-view fatigue. Your release popups already use this.",
    howToFix: "Add a \u201CDon\u2019t show me again\u201D checkbox below the CTA button. This reduces repeat-view fatigue for recurring notifications.",
  },
  {
    id: "contrast",
    title: "Body text contrast is low",
    severity: "improve",
    Icon: Eye,
    insightAI: "Your body text uses a light gray (#999) on a white background, giving a contrast ratio of ~2.8:1. WCAG AA requires 4.5:1 for normal text.",
    insightStandard: "Your body text color may not meet WCAG 4.5:1 contrast requirements against the background.",
    yourDataChip: "This is a WCAG accessibility standard. Your other popups use #333 which passes at 12.6:1.",
    howToFix: "Change body text color from #999999 to #333333 or darker. This meets WCAG AA\u2019s 4.5:1 contrast ratio requirement for normal text.",
  },
]

// ── Score progression ────────────────────────────────────────────────────────
const SCORE_MAP: Record<number, { score: number; label: string; color: string }> = {
  0: { score: 38, label: "Needs attention", color: "#EF4444" },
  1: { score: 52, label: "Needs work", color: "#F59E0B" },
  2: { score: 68, label: "Needs work", color: "#F59E0B" },
  3: { score: 79, label: "Needs work", color: "#F59E0B" },
  4: { score: 91, label: "Looking good", color: "#10B981" },
  5: { score: 100, label: "Looking good", color: "#10B981" },
}

// ── Score ring SVG — animates from 0 on mount ───────────────────────────────
const R = 38
const CIRC = 2 * Math.PI * R

function ScoreRing({ score, color }: { score: number; color: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const displayScore = mounted ? score : 0
  const offset = CIRC * (1 - displayScore / 100)

  return (
    <svg width="96" height="96" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={R} fill="none" stroke="#f3f4f6" strokeWidth="6" />
      <circle
        cx="44" cy="44" r={R} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={CIRC} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 44 44)"
        style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.4,0,0.2,1), stroke 600ms ease-in-out" }}
      />
      <text x="44" y="51" textAnchor="middle" fontSize="22" fontWeight="bold" fill={color}
        style={{ transition: "fill 600ms ease-in-out" }}
      >{score}</text>
    </svg>
  )
}

// ── Standard tier: segmented progress bar ────────────────────────────────────
function SegmentedProgress({ fixedCount }: { fixedCount: number }) {
  return (
    <div style={{ display: "flex", gap: "4px", width: "100%" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            flex: 1, height: "6px", borderRadius: "3px",
            background: i < fixedCount ? "#10B981" : "#E5E7EB",
            transition: "background 400ms ease",
          }}
        />
      ))}
    </div>
  )
}

// ── Celebration illustration for all-clear ──────────────────────────────────
function CelebrationIllustration() {
  return (
    <div style={{ position: "relative", marginBottom: "20px" }}>
      <div style={{
        position: "absolute", inset: "-24px",
        background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: "relative" }}>
        <circle cx="60" cy="60" r="32" fill="#ECFDF5" />
        <circle cx="60" cy="60" r="26" fill="#D1FAE5" opacity="0.5" />
        <path d="M47 60l8 8 18-18" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Sparkle dots */}
        <circle className="sparkle-dot" cx="18" cy="28" r="3" fill="#A7F3D0" style={{ animationDelay: "0.1s" }} />
        <circle className="sparkle-dot" cx="100" cy="22" r="2.5" fill="#6EE7B7" style={{ animationDelay: "0.2s" }} />
        <circle className="sparkle-dot" cx="97" cy="88" r="2" fill="#A7F3D0" style={{ animationDelay: "0.3s" }} />
        <circle className="sparkle-dot" cx="14" cy="82" r="2.5" fill="#6EE7B7" style={{ animationDelay: "0.15s" }} />
        <circle className="sparkle-dot" cx="32" cy="12" r="2" fill="#D1FAE5" style={{ animationDelay: "0.25s" }} />
        <circle className="sparkle-dot" cx="88" cy="14" r="1.5" fill="#D1FAE5" style={{ animationDelay: "0.35s" }} />
        <circle className="sparkle-dot" cx="105" cy="55" r="1.5" fill="#A7F3D0" style={{ animationDelay: "0.4s" }} />
        <circle className="sparkle-dot" cx="10" cy="55" r="2" fill="#D1FAE5" style={{ animationDelay: "0.3s" }} />
      </svg>
    </div>
  )
}

// ── Severity badge ───────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: "fix" | "improve" }) {
  const isFix = severity === "fix"
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "1px 7px", borderRadius: "4px", fontSize: "10px", fontWeight: 600,
      background: isFix ? "#FEE2E2" : "#FEF3C7",
      color: isFix ? "#991B1B" : "#92400E",
    }}>
      {isFix ? "Fix" : "Improve"}
    </span>
  )
}

// ── Issue card ───────────────────────────────────────────────────────────────
function IssueCard({
  issue, tier, isExpanded, onToggle, onFix, onDismiss,
}: {
  issue: HealthIssue
  tier: Tier
  isExpanded: boolean
  onToggle: () => void
  onFix: () => void
  onDismiss: () => void
}) {
  const { Icon } = issue
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className="issue-card"
      style={{
        border: "1px solid #E5E7EB", borderRadius: "10px",
        background: "#fff",
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "10px",
          padding: "12px 14px", border: "none", background: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ color: "#6B7280", flexShrink: 0, display: "flex" }}><Icon size={16} /></span>
        <span style={{
          flex: 1, fontSize: "13px", fontWeight: 500, color: "#111827",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {issue.title}
        </span>
        <SeverityBadge severity={issue.severity} />
        {isExpanded
          ? <ChevronUp size={14} style={{ color: "#9CA3AF", flexShrink: 0 }} />
          : <ChevronDown size={14} style={{ color: "#9CA3AF", flexShrink: 0 }} />}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div style={{
          padding: "0 14px 14px",
          animation: "slideDown 200ms ease-out",
        }}>
          {/* Insight text */}
          <p style={{ fontSize: "12px", lineHeight: 1.6, color: "#4B5563", margin: "0 0 10px" }}>
            {tier === "ai" ? issue.insightAI : issue.insightStandard}
          </p>

          {/* Your data chip (AI only) */}
          {tier === "ai" && (
            <div style={{
              background: "#EFF6FF", borderRadius: "6px", padding: "8px 10px",
              marginBottom: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                <Sparkles size={12} style={{ color: "#1E40AF", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "11px", lineHeight: 1.5, color: "#1E40AF" }}>
                  {issue.yourDataChip}
                </span>
              </div>
            </div>
          )}

          {/* AI tier: Fix with AI + Dismiss */}
          {tier === "ai" && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={onFix} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                padding: "9px", borderRadius: "8px", border: "none",
                background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer",
              }}>
                <Zap size={13} />
                Fix with AI
              </button>
              <button onClick={onDismiss} style={{
                padding: "9px 16px", borderRadius: "8px",
                border: "1px solid #E5E7EB", background: "#fff",
                color: "#6B7280", fontSize: "12px", fontWeight: 500, cursor: "pointer",
              }}>
                Dismiss
              </button>
            </div>
          )}

          {/* Standard tier: Fix with AI (premium upsell) + Dismiss */}
          {tier === "standard" && (
            <div style={{ display: "flex", gap: "8px" }}>
              {/* Fix with AI — blue gradient with premium icon, tooltip on hover */}
              <div style={{ position: "relative", flex: 1 }}>
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    padding: "9px", borderRadius: "8px", border: "none",
                    background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                    color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/Premium Icon.svg"
                    alt=""
                    style={{ width: "14px", height: "14px" }}
                  />
                  Fix with AI
                </button>
                {/* Tooltip — positioned below the button */}
                {showTooltip && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: "50%",
                    transform: "translateX(-50%)", whiteSpace: "nowrap",
                    padding: "6px 10px", borderRadius: "6px",
                    background: "#1F2937", color: "#fff",
                    fontSize: "11px", fontWeight: 500,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    pointerEvents: "none", zIndex: 10,
                  }}>
                    <div style={{
                      position: "absolute", bottom: "100%", left: "50%",
                      transform: "translateX(-50%)",
                      width: 0, height: 0,
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",
                      borderBottom: "5px solid #1F2937",
                    }} />
                    Upgrade to AI tier for one-click fixes
                  </div>
                )}
              </div>
              {/* Dismiss */}
              <button onClick={onDismiss} style={{
                padding: "9px 16px", borderRadius: "8px",
                border: "1px solid #E5E7EB", background: "#fff",
                color: "#6B7280", fontSize: "12px", fontWeight: 500, cursor: "pointer",
                whiteSpace: "nowrap",
              }}>
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main health panel ────────────────────────────────────────────────────────
interface HealthPanelProps {
  fixedIssues: Set<IssueId>
  dismissedIssues: Set<IssueId>
  tier: Tier
  onFixIssue: (id: IssueId) => void
  onFixAllIssues: () => void
  onDismissIssue: (id: IssueId) => void
  onBack: () => void
  isFixingAll?: boolean
}

export function HealthPanel({
  fixedIssues, dismissedIssues, tier, onFixIssue, onFixAllIssues, onDismissIssue, onBack, isFixingAll,
}: HealthPanelProps) {
  const [expandedCard, setExpandedCard] = useState<IssueId | null>(null)
  const [showDismissed, setShowDismissed] = useState(false)

  const activeIssues = ISSUES.filter(i => !fixedIssues.has(i.id) && !dismissedIssues.has(i.id))
  const dismissedList = ISSUES.filter(i => dismissedIssues.has(i.id))
  const fixedCount = fixedIssues.size
  const totalResolved = fixedIssues.size + dismissedIssues.size
  const { score, label, color } = SCORE_MAP[Math.min(fixedCount, 5)]
  const isAllClear = totalResolved >= 5

  const totalChecks = tier === "ai" ? 19 : 10
  const passedChecks = totalChecks - (5 - totalResolved)

  // Standard tier: all-clear text depends on whether any were genuinely fixed
  const standardAllFixed = fixedCount >= 5
  const standardAllClearText = standardAllFixed
    ? "All issues resolved"
    : `${fixedCount} of 5 issues resolved`

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Header with back button */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "14px 16px", borderBottom: "1px solid #E5E7EB",
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{
          border: "none", background: "none", cursor: "pointer",
          display: "flex", padding: "4px", color: "#6B7280",
          borderRadius: "4px",
        }}>
          <ChevronLeft size={18} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
          <Sparkles size={14} style={{ color: "#2E75B6" }} />
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }}>Popup Health</span>
        </div>
        <button onClick={onBack} style={{
          border: "none", background: "none", cursor: "pointer",
          display: "flex", padding: "4px", color: "#9CA3AF",
        }}>
          <X size={14} />
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{
        flex: 1, overflowY: "auto", display: "flex", flexDirection: "column",
      }}>
        {/* Score header — tier-dependent */}
        {!isAllClear && (
          <>
            {tier === "ai" ? (
              /* AI tier: score ring + label */
              <>
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "4px", padding: "20px 0 8px",
                  flexShrink: 0,
                }}>
                  <ScoreRing score={score} color={color} />
                  <span style={{
                    fontSize: "12px", fontWeight: 600, color,
                    transition: "color 600ms ease-in-out",
                  }}>
                    {label}
                  </span>
                </div>

                {/* Summary line */}
                <div style={{
                  textAlign: "center", fontSize: "12px", color: "#6B7280",
                  padding: "0 16px 16px", flexShrink: 0,
                }}>
                  {5 - totalResolved} issue{5 - totalResolved !== 1 ? "s" : ""} · {passedChecks} checks passed
                </div>
              </>
            ) : (
              /* Standard tier: issue counter + segmented bar */
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "12px", padding: "24px 24px 20px",
                flexShrink: 0,
              }}>
                <span style={{
                  fontSize: "18px", fontWeight: 700, color: "#111827",
                  letterSpacing: "-0.01em",
                }}>
                  {fixedCount} of 5 issues resolved
                </span>
                <SegmentedProgress fixedCount={fixedCount} />
                <div style={{
                  fontSize: "12px", color: "#6B7280",
                }}>
                  {5 - totalResolved} issue{5 - totalResolved !== 1 ? "s" : ""} remaining · {passedChecks} checks passed
                </div>
              </div>
            )}
          </>
        )}

        {/* All clear state — celebration illustration centered */}
        {isAllClear ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "0 40px 60px", textAlign: "center",
          }}>
            <CelebrationIllustration />
            <h3 style={{
              fontSize: "18px", fontWeight: 700, color: "#111827",
              margin: "0 0 8px", letterSpacing: "-0.01em",
            }}>
              {tier === "standard" ? standardAllClearText : "All clear!"}
            </h3>
            {tier === "standard" && (
              <div style={{ width: "60%", marginBottom: "12px" }}>
                <SegmentedProgress fixedCount={fixedCount} />
              </div>
            )}
            <p style={{
              fontSize: "13px", color: "#9CA3AF", margin: 0, lineHeight: 1.6,
            }}>
              {tier === "ai" ? (
                dismissedList.length > 0
                  ? `No remaining issues. You dismissed ${dismissedList.length} suggestion${dismissedList.length !== 1 ? "s" : ""}.`
                  : "Your popup follows all best practices."
              ) : (
                dismissedList.length > 0
                  ? `You dismissed ${dismissedList.length} suggestion${dismissedList.length !== 1 ? "s" : ""}.`
                  : "All issues have been resolved."
              )}
            </p>
          </div>
        ) : (
          /* Issue cards */
          <div style={{
            display: "flex", flexDirection: "column", gap: "8px",
            padding: "0 14px 14px", flex: 1,
          }}>
            {activeIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                tier={tier}
                isExpanded={expandedCard === issue.id}
                onToggle={() => setExpandedCard(expandedCard === issue.id ? null : issue.id)}
                onFix={() => onFixIssue(issue.id)}
                onDismiss={() => onDismissIssue(issue.id)}
              />
            ))}
          </div>
        )}

        {/* Dismissed section */}
        {dismissedList.length > 0 && !isAllClear && (
          <div style={{ padding: "0 14px 14px", flexShrink: 0 }}>
            <button
              onClick={() => setShowDismissed(v => !v)}
              style={{
                border: "none", background: "none", cursor: "pointer",
                fontSize: "11px", color: "#9CA3AF", textDecoration: "underline",
              }}
            >
              {showDismissed ? "Hide dismissed" : `Show ${dismissedList.length} dismissed`}
            </button>
            {showDismissed && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px", opacity: 0.5 }}>
                {dismissedList.map(issue => (
                  <div key={issue.id} style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 12px", borderRadius: "8px",
                    border: "1px solid #E5E7EB", background: "#F9FAFB",
                  }}>
                    <span style={{ color: "#9CA3AF", display: "flex" }}><issue.Icon size={14} /></span>
                    <span style={{ fontSize: "12px", color: "#9CA3AF", flex: 1 }}>{issue.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI tier: "Fix all with AI" button — sticky bottom */}
      {tier === "ai" && !isAllClear && (
        <div style={{ flexShrink: 0, padding: "12px 14px" }}>
          <button
            onClick={onFixAllIssues}
            disabled={!!isFixingAll}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "12px", borderRadius: "10px", border: "none",
              background: isFixingAll
                ? "linear-gradient(135deg, #93c5fd, #67e8f9)"
                : "linear-gradient(135deg, #2563eb, #06b6d4)",
              color: "#fff", fontSize: "13px", fontWeight: 600,
              cursor: isFixingAll ? "not-allowed" : "pointer",
              transition: "opacity 200ms",
              opacity: isFixingAll ? 0.7 : 1,
            }}
          >
            <Zap size={15} />
            {isFixingAll ? "Fixing all issues…" : "Fix all with AI"}
          </button>
        </div>
      )}

      {/* Upgrade banner — sticky bottom (Standard tier only) */}
      {tier === "standard" && !isAllClear && (
        <div style={{ flexShrink: 0, padding: "12px 14px" }}>
          <div style={{
            padding: "14px 16px", borderRadius: "12px",
            background: "#F9FAFB", border: "1px solid #E5E7EB",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/Premium Icon.svg"
                alt=""
                style={{ width: "24px", height: "24px", flexShrink: 0 }}
              />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>
                Unlock AI Fixes
              </span>
            </div>
            <p style={{
              fontSize: "12px", color: "#6B7280", margin: 0, lineHeight: 1.5,
            }}>
              Get data-backed insights and one-click AI fixes with the premium AI Health Panel.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export { ISSUES, SCORE_MAP }
