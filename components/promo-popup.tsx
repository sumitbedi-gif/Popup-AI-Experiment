"use client"

import { useState, useCallback, useRef } from "react"
import Image from "next/image"
import {
  ArrowRight, RotateCcw, Sparkles, CheckCircle2, AlertTriangle,
  XCircle, Zap, Type, AlignLeft, MousePointerClick, X, Layers, TrendingDown, Eye,
} from "lucide-react"
import { ImageEditorToolbar } from "@/components/image-editor-toolbar"
import { TextEditorToolbar } from "@/components/text-editor-toolbar"

// ── Original copy ────────────────────────────────────────────────────────────
const ORIGINAL_HEADING = "Supercharge Your Team\u2019s Productivity"
const ORIGINAL_BODY =
  "Join thousands of high-performing teams already using our platform to collaborate smarter, ship faster, and achieve more together.\n\nOur all-in-one workspace brings every tool, task, and conversation into one place\u2014so your team spends less time switching between apps and more time doing meaningful work. From project kickoff to final delivery, every step is tracked, streamlined, and built for speed.\n\nWith real-time collaboration, AI-powered workflows, and deep integrations with 100+ tools your team already loves, you\u2019ll wonder how you ever managed without it. Teams on our platform report 40% fewer status meetings and ship 3\u00d7 faster on average."
const ORIGINAL_BUTTON = "Get Started Free"

// ── AI-fixed copy ─────────────────────────────────────────────────────────────
const FIXED_HEADING = "Ship Faster. Collaborate Better. Start Today."
const FIXED_BODY = "Join 10,000+ teams already delivering more with our platform.\n\nCollaborate smarter, ship faster \u2014 starting today."
const FIXED_BUTTON = "Claim Your Free Trial"

// ── Text variant menus ────────────────────────────────────────────────────────
const headingVariants = [
  { label: "Polish", text: "Elevate Your Team\u2019s Performance to New Heights" },
  { label: "Summarize", text: "Work Smarter, Ship Faster" },
  { label: "Formal", text: "Enhance Organizational Productivity and Collaboration" },
  { label: "Action-Oriented", text: "Start Building Better Products With Your Team Today" },
  { label: "Conversational", text: "Ready to Get More Done With Your Team?" },
]

const bodyVariants = [
  { label: "Polish", text: "Trusted by thousands of world-class teams, our platform transforms the way you collaborate, enabling faster delivery and smarter workflows." },
  { label: "Summarize", text: "A smarter platform for teams that want to collaborate better and ship faster." },
  { label: "Formal", text: "Our enterprise-grade platform empowers organizations to optimize collaboration workflows, accelerate product delivery, and drive measurable outcomes." },
  { label: "Action-Oriented", text: "Stop wasting time on inefficient workflows. Join 10,000+ teams who already collaborate smarter and ship 3x faster with our platform." },
  { label: "Conversational", text: "Thousands of teams already love how easy it is to work together on our platform. Want to see what all the fuss is about?" },
]


const buttonVariants = [
  { label: "Action-Oriented", text: "Start Your Free Trial" },
  { label: "Urgent", text: "Claim Your Spot Now" },
  { label: "Casual", text: "Let\u2019s Go!" },
  { label: "Value-Driven", text: "Unlock Your Potential" },
  { label: "Conversational", text: "See It in Action" },
]

// ── AI issue checklist ────────────────────────────────────────────────────────
const ISSUE_ITEMS = [
  {
    label: "Image",
    Icon: Layers,
    unfixedStatus: "bad" as const,
    fixedStatus: "good" as const,
    beforeMsg: "No hero image — low visual impact",
    afterMsg: "Hero image added, strong contrast",
    points: 12,
  },
  {
    label: "Heading",
    Icon: Type,
    unfixedStatus: "bad" as const,
    fixedStatus: "good" as const,
    beforeMsg: "Vague, lacks specificity",
    afterMsg: "Clear and action-driven",
    points: 10,
  },
  {
    label: "Body",
    Icon: AlignLeft,
    unfixedStatus: "bad" as const,
    fixedStatus: "good" as const,
    beforeMsg: "Too long, reader drops off",
    afterMsg: "Concise and scannable",
    points: 10,
  },
  {
    label: "Button",
    Icon: MousePointerClick,
    unfixedStatus: "warn" as const,
    fixedStatus: "good" as const,
    beforeMsg: "Soft CTA, low conversion",
    afterMsg: "High-urgency CTA",
    points: 10,
  },
]

// ── Types ─────────────────────────────────────────────────────────────────────
type ToolbarType = "image" | "heading" | "body" | "button"
type ActiveToolbar = { type: ToolbarType; pos: { x: number; y: number } } | null

// ── Score SVG ring ────────────────────────────────────────────────────────────
const SCORE_RADIUS = 36
const SCORE_CIRCUMFERENCE = 2 * Math.PI * SCORE_RADIUS


function ScoreRingLight({ score, color, size = 88 }: { score: number; color: string; size?: number }) {
  const dashoffset = SCORE_CIRCUMFERENCE * (1 - score / 100)
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={SCORE_RADIUS} fill="none" stroke="#f3f4f6" strokeWidth="6" />
      <circle
        cx="40" cy="40" r={SCORE_RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={SCORE_CIRCUMFERENCE}
        strokeDashoffset={dashoffset}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 1s ease, stroke 1s ease" }}
      />
      <text x="40" y="47" textAnchor="middle" fontSize="20" fontWeight="bold" fill={color}>{score}</text>
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export function PromoPopup() {
  // Existing state
  const [activeToolbar, setActiveToolbar] = useState<ActiveToolbar>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingLabel, setProcessingLabel] = useState("")
  const [imageSrc, setImageSrc] = useState("/images/popup-hero.png")
  const [imageAlt, setImageAlt] = useState("Team collaborating around a laptop in a modern office")
  const [isGif, setIsGif] = useState(false)
  const [heading, setHeading] = useState(ORIGINAL_HEADING)
  const [body, setBody] = useState(ORIGINAL_BODY)
  const [buttonText, setButtonText] = useState(ORIGINAL_BUTTON)
  const [textProcessing, setTextProcessing] = useState<ToolbarType | null>(null)

  // AI Refine state
  const [showRefinePanel, setShowRefinePanel] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const [fixedItems, setFixedItems] = useState<Set<string>>(new Set())
  const [showImage, setShowImage] = useState(false)
  const [isComparingOriginal, setIsComparingOriginal] = useState(false)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  const closeToolbar = useCallback(() => setActiveToolbar(null), [])

  function getTopCenter(el: HTMLElement | null): { x: number; y: number } {
    if (!el) return { x: 0, y: 0 }
    const rect = el.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top }
  }

  function handleCartoonify() {
    setIsProcessing(true)
    setProcessingLabel("Cartoonifying...")
    setActiveToolbar(null)
    setTimeout(() => {
      setImageSrc("/images/popup-hero-cartoon.png")
      setImageAlt("Cartoon illustration of team collaborating")
      setIsGif(false)
      setIsProcessing(false)
    }, 2500)
  }

  function handleConvertToGif() {
    if (isGif) { setActiveToolbar(null); return }
    setIsProcessing(true)
    setProcessingLabel("Converting to GIF...")
    setActiveToolbar(null)
    const isCartoon = imageSrc === "/images/popup-hero-cartoon.png"
    setTimeout(() => {
      if (isCartoon) {
        setImageSrc("/images/popup-hero-cartoon.gif")
        setImageAlt("Animated cartoon GIF of team collaborating")
      } else {
        setImageSrc("/images/popup-hero-stock.gif")
        setImageAlt("Animated GIF of team collaborating")
      }
      setIsGif(true)
      setIsProcessing(false)
    }, 2500)
  }

  function handleImageReset() {
    setImageSrc("/images/popup-hero.png")
    setImageAlt("Team collaborating around a laptop in a modern office")
    setIsGif(false)
    setActiveToolbar(null)
  }

  function handleImageClick(e: React.MouseEvent) {
    if (isProcessing) return
    e.stopPropagation()
    setActiveToolbar(
      activeToolbar?.type === "image" ? null : { type: "image", pos: { x: e.clientX, y: e.clientY } }
    )
  }

  function handleElementClick(type: ToolbarType, ref: React.RefObject<HTMLElement | null>, e: React.MouseEvent) {
    if (textProcessing) return
    e.stopPropagation()
    if (activeToolbar?.type === type) {
      setActiveToolbar(null)
    } else {
      const pos = getTopCenter(ref.current)
      setActiveToolbar({ type, pos })
    }
  }

  function handleTextRewrite(type: ToolbarType, text: string, setter: (t: string) => void) {
    setActiveToolbar(null)
    setTextProcessing(type)
    setTimeout(() => {
      setter(text)
      setTextProcessing(null)
    }, 1200)
  }

  function handleFixWithAI() {
    setIsScanning(true)
    setTimeout(() => {
      setHeading(FIXED_HEADING)
      setBody(FIXED_BODY)
      setButtonText(FIXED_BUTTON)
      setImageSrc("/images/popup-hero.png")
      setImageAlt("Team collaborating around a laptop in a modern office")
      setIsGif(false)
      setShowImage(true)
      setFixedItems(new Set(ISSUE_ITEMS.map(i => i.label)))
      setIsFixed(true)
      setIsScanning(false)
    }, 2500)
  }

  function handleFixItem(label: string) {
    const next = new Set(fixedItems)
    next.add(label)
    setFixedItems(next)
    switch (label) {
      case "Image":
        setShowImage(true)
        setImageSrc("/images/popup-hero.png")
        setImageAlt("Team collaborating around a laptop in a modern office")
        break
      case "Heading": setHeading(FIXED_HEADING); break
      case "Body":    setBody(FIXED_BODY);        break
      case "Button":  setButtonText(FIXED_BUTTON); break
    }
    if (next.size === ISSUE_ITEMS.length) setIsFixed(true)
  }

  function handleResetDemo() {
    setImageSrc("/images/popup-hero.png")
    setImageAlt("Team collaborating around a laptop in a modern office")
    setIsGif(false)
    setHeading(ORIGINAL_HEADING)
    setBody(ORIGINAL_BODY)
    setButtonText(ORIGINAL_BUTTON)
    setActiveToolbar(null)
    setIsProcessing(false)
    setTextProcessing(null)
    setShowRefinePanel(false)
    setIsFixed(false)
    setFixedItems(new Set())
    setIsScanning(false)
    setShowImage(false)
    setIsComparingOriginal(false)
  }

  // Derived score: 49 base + points for each individually fixed item
  const aiScore = isFixed
    ? 91
    : 49 + ISSUE_ITEMS.filter(i => fixedItems.has(i.label)).reduce((sum, i) => sum + i.points, 0)
  const scoreColor = aiScore >= 80 ? "#22c55e" : aiScore >= 60 ? "#f59e0b" : "#ef4444"
  const issueCount = ISSUE_ITEMS.length

  // Display values — swap to originals when user holds the compare button
  const displayHeading = isComparingOriginal ? ORIGINAL_HEADING : heading
  const displayBody = isComparingOriginal ? ORIGINAL_BODY : body
  const displayButtonText = isComparingOriginal ? ORIGINAL_BUTTON : buttonText
  const displayShowImage = !isComparingOriginal && showImage

  const editableClass = (type: ToolbarType) =>
    `cursor-pointer rounded-lg transition-all hover:bg-primary/5 ${activeToolbar?.type === type ? "bg-primary/5 ring-2 ring-[#3b82f6]/50" : ""} ${textProcessing === type ? "animate-pulse opacity-50" : ""}`

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-heading"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 px-4"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/12 backdrop-blur-[3px]"
          aria-hidden="true"
          onClick={closeToolbar}
        />

        {/* Popup wrapper — relative so the panel can anchor off it */}
        <div className="relative z-10 w-full max-w-lg">

        {/* Popup Card */}
        <div className="relative overflow-hidden rounded-2xl bg-card shadow-2xl">

          {/* Scan overlay — sits outside the scroll so it always covers the visible card */}
          {isScanning && (
            <div className="pointer-events-none absolute inset-0 z-30">
              <div className="absolute inset-0 bg-blue-950/50" />
              <div className="scan-beam" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-8 py-5 backdrop-blur-md">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-white">Analyzing &amp; rewriting content…</span>
                </div>
              </div>
            </div>
          )}

          {/* Scroll wrapper — image + content scroll together as one unit */}
          <div className="max-h-[560px] overflow-y-auto">

          {/* Image — hidden until AI adds it */}
          {displayShowImage && <div className="relative aspect-[16/9] w-full overflow-visible">
            <div
              className="group relative h-full w-full cursor-pointer overflow-hidden"
              onClick={handleImageClick}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover transition-all duration-500"
                priority
                unoptimized={isGif}
                key={imageSrc}
              />
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-foreground/60 backdrop-blur-sm">
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 animate-ping rounded-full bg-[#3b82f6]/30" />
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#3b82f6]" />
                    <div
                      className="absolute inset-1.5 animate-spin rounded-full border-2 border-transparent border-t-[#06b6d4]"
                      style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
                    />
                  </div>
                  <span className="text-xs font-medium text-white">{processingLabel}</span>
                </div>
              )}
              {activeToolbar?.type === "image" && !isProcessing && (
                <div className="absolute inset-0 ring-2 ring-inset ring-[#3b82f6]/50" />
              )}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
              {!isProcessing && activeToolbar?.type !== "image" && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-md">
                    Click to Edit
                  </span>
                </div>
              )}
            </div>
          </div>}

          {/* Content */}
          <div>
            <div className="flex flex-col items-center gap-3 px-8 pb-8 pt-5 text-center">
              <h2
                ref={headingRef}
                id="popup-heading"
                onClick={(e) => handleElementClick("heading", headingRef, e)}
                className={`px-2 py-1 text-balance text-2xl font-bold leading-tight tracking-tight text-card-foreground ${editableClass("heading")}`}
              >
                {displayHeading}
              </h2>

              <div
                ref={bodyRef}
                onClick={(e) => handleElementClick("body", bodyRef, e)}
                className={`w-full px-2 py-1 text-left text-sm leading-relaxed text-muted-foreground ${editableClass("body")}`}
              >
                {displayBody.split('\n\n').map((para, i) => (
                  <p key={i} className={i > 0 ? 'mt-3' : ''}>{para}</p>
                ))}
              </div>

              <a
                ref={buttonRef}
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleElementClick("button", buttonRef, e)
                }}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 ${activeToolbar?.type === "button" ? "ring-2 ring-[#3b82f6]/50 ring-offset-2" : ""} ${textProcessing === "button" ? "animate-pulse opacity-50" : ""}`}
              >
                {displayButtonText}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          </div>{/* end scroll wrapper */}
        </div>{/* end popup card */}

        {/* Panel — floats to the right of the popup without shifting it */}
        {showRefinePanel && (
          <div className="panel-in absolute left-full top-0 ml-3 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-900">Content Health</span>
              </div>
              <div className="flex items-center gap-1">
                {isFixed && (
                  <button
                    onMouseDown={() => setIsComparingOriginal(true)}
                    onMouseUp={() => setIsComparingOriginal(false)}
                    onMouseLeave={() => setIsComparingOriginal(false)}
                    title="Hold to compare original"
                    className={`rounded-full p-1 transition-colors hover:bg-gray-100 ${isComparingOriginal ? "bg-blue-50 text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setShowRefinePanel(false)}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Insight banner */}
            <div className="border-b border-amber-100 bg-amber-50 px-4 py-3">
              <div className="flex items-start gap-2">
                <TrendingDown className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
                <p className="text-xs leading-relaxed text-amber-900">
                  <span className="font-bold">68% of users</span> closed popups with this much text within 3 seconds. Shorter copy converts better.
                </p>
              </div>
            </div>

            {/* Score ring */}
            <div className="flex flex-col items-center gap-1.5 py-5">
              <ScoreRingLight score={aiScore} color={scoreColor} size={88} />
              <span className="text-xs font-medium text-gray-400">
                {isFixed ? "Excellent" : "Needs Improvement"}
              </span>
            </div>

            {/* Issue tiles — 2 per row, each clickable to fix individually */}
            <div className="grid grid-cols-2 gap-2 px-4 pb-4">
              {ISSUE_ITEMS.map(({ label, Icon, unfixedStatus, fixedStatus, beforeMsg, afterMsg }, index) => {
                const itemFixed = isFixed || fixedItems.has(label)
                const status = itemFixed ? fixedStatus : unfixedStatus
                const message = itemFixed ? afterMsg : beforeMsg
                return (
                  <div
                    key={label}
                    onClick={() => { if (!itemFixed) handleFixItem(label) }}
                    className={`item-fade-in rounded-lg border p-2.5 transition-all ${
                      itemFixed
                        ? "border-green-100 bg-green-50 cursor-default"
                        : status === "warn"
                        ? "border-amber-100 bg-amber-50 cursor-pointer hover:brightness-95 hover:shadow-sm"
                        : "border-red-100 bg-red-50 cursor-pointer hover:brightness-95 hover:shadow-sm"
                    }`}
                    style={{ animationDelay: `${index * 0.11}s` }}
                    title={itemFixed ? undefined : "Click to fix this issue"}
                  >
                    <div className="mb-1 flex items-center gap-1.5">
                      {itemFixed
                        ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-500" />
                        : status === "warn"
                        ? <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        : <XCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />}
                      <span className="truncate text-xs font-semibold text-gray-700">{label}</span>
                    </div>
                    <p className="text-[11px] leading-snug text-gray-500">{message}</p>
                  </div>
                )
              })}
            </div>

            {/* CTA */}
            <div className="px-4 pb-4">
              {!isFixed ? (
                <button
                  onClick={handleFixWithAI}
                  disabled={isScanning}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-105 disabled:opacity-70"
                >
                  <Zap className="h-4 w-4" />
                  {isScanning ? "Rewriting…" : "Fix with AI"}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  All issues resolved!
                </div>
              )}
            </div>
          </div>
        )}

        </div>{/* end popup wrapper */}

        {/* ── Issues Found pill ───────────────────────────────────────────── */}
        <button onClick={() => setShowRefinePanel((v) => !v)} className="relative z-10 cursor-pointer">
          {!isFixed ? (
            <span className="ai-pill-wrapper">
              <span className="ai-spin-border" />
              <span className="relative z-10 flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-800">
                Issues Found
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                  {issueCount}
                </span>
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-2 rounded-full border border-green-200 bg-white px-5 py-2.5 text-sm font-semibold text-green-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              All Issues Fixed
            </span>
          )}
        </button>
      </div>

      {/* ── Individual element toolbars ────────────────────────────────────── */}
      {activeToolbar?.type === "image" && (
        <div
          className="fixed z-[100] -translate-y-full"
          style={{ left: activeToolbar.pos.x, top: activeToolbar.pos.y - 12 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ImageEditorToolbar
            onCartoonify={handleCartoonify}
            onConvertToGif={handleConvertToGif}
            onReset={handleImageReset}
            onClose={closeToolbar}
            isProcessing={isProcessing}
            processingLabel={processingLabel}
          />
        </div>
      )}

{activeToolbar?.type === "heading" && (
        <div
          className="fixed z-[100] -translate-x-1/2 -translate-y-full"
          style={{ left: activeToolbar.pos.x, top: activeToolbar.pos.y - 8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <TextEditorToolbar
            variants={headingVariants}
            onSelect={(text) => handleTextRewrite("heading", text, setHeading)}
            onClose={closeToolbar}
            isProcessing={textProcessing === "heading"}
          />
        </div>
      )}

      {activeToolbar?.type === "body" && (
        <div
          className="fixed z-[100] -translate-x-1/2 -translate-y-full"
          style={{ left: activeToolbar.pos.x, top: activeToolbar.pos.y - 8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <TextEditorToolbar
            variants={bodyVariants}
            onSelect={(text) => handleTextRewrite("body", text, setBody)}
            onClose={closeToolbar}
            isProcessing={textProcessing === "body"}
          />
        </div>
      )}

      {activeToolbar?.type === "button" && (
        <div
          className="fixed z-[100] -translate-x-1/2 -translate-y-full"
          style={{ left: activeToolbar.pos.x, top: activeToolbar.pos.y - 8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <TextEditorToolbar
            variants={buttonVariants}
            onSelect={(text) => handleTextRewrite("button", text, setButtonText)}
            onClose={closeToolbar}
            isProcessing={textProcessing === "button"}
          />
        </div>
      )}

      {/* ── Reset Demo ─────────────────────────────────────────────────────── */}
      <button
        onClick={handleResetDemo}
        className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full bg-foreground/80 px-5 py-2.5 text-sm font-medium text-background shadow-lg backdrop-blur-sm transition-all hover:bg-foreground/90"
      >
        <RotateCcw className="h-4 w-4" />
        Reset Demo
      </button>
    </>
  )
}
