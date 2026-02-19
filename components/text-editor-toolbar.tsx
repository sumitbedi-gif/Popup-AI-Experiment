"use client"

import { useState, useRef, useEffect } from "react"
import {
  Sparkles,
  Bold,
  Italic,
  Strikethrough,
  Link,
  Loader2,
} from "lucide-react"

interface TextVariant {
  label: string
  text: string
}

interface TextEditorToolbarProps {
  variants: TextVariant[]
  onSelect: (text: string) => void
  onClose: () => void
  isProcessing: boolean
}

export function TextEditorToolbar({
  variants,
  onSelect,
  onClose,
  isProcessing,
}: TextEditorToolbarProps) {
  const [showAIMenu, setShowAIMenu] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (showAIMenu && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      // If less than 320px below, open upward
      setOpenUpward(spaceBelow < 320)
    }
  }, [showAIMenu])

  function handleSelect(text: string) {
    setShowAIMenu(false)
    onSelect(text)
  }

  return (
    <div className="flex items-center gap-0.5 rounded-xl bg-foreground/90 px-1.5 py-1.5 shadow-xl backdrop-blur-md">
      {/* Edit with AI button */}
      <div className="relative">
        <button
          ref={btnRef}
          onClick={() => setShowAIMenu(!showAIMenu)}
          disabled={isProcessing}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:from-[#2563eb] hover:to-[#0891b2] disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {isProcessing ? "Rewriting..." : "Edit with AI"}
        </button>

        {/* AI Submenu */}
        {showAIMenu && !isProcessing && (
          <div
            className={`absolute left-0 w-[26rem] overflow-y-auto rounded-xl bg-foreground/95 p-1.5 shadow-2xl backdrop-blur-md ${
              openUpward ? "bottom-full mb-2" : "top-full mt-2"
            }`}
            style={{ maxHeight: "min(400px, 60vh)" }}
          >
            {variants.map((variant) => (
              <button
                key={variant.label}
                onClick={() => handleSelect(variant.text)}
                className="flex w-full flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/10"
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#3b82f6]">
                  {variant.label}
                </span>
                <span className="text-xs leading-relaxed text-white/80">
                  {variant.text}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-1 h-5 w-px bg-white/20" />

      {/* RTE icons */}
      <button
        onClick={onClose}
        className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={onClose}
        className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={onClose}
        className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      <button
        onClick={onClose}
        className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        title="Link"
      >
        <Link className="h-4 w-4" />
      </button>
    </div>
  )
}
