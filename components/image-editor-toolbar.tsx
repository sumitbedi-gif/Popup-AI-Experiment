"use client"

import { useState } from "react"
import {
  Replace,
  Trash2,
  RotateCcw,
  Sparkles,
  Palette,
  Film,
  Shuffle,
  Wand2,
  ImageUp,
  Loader2,
} from "lucide-react"

interface ImageEditorToolbarProps {
  onCartoonify: () => void
  onConvertToGif: () => void
  onReset: () => void
  onClose: () => void
  isProcessing: boolean
  processingLabel?: string
}

const aiSubmenuItems = [
  { label: "Cartoonify", icon: Palette, action: "cartoonify", comingSoon: false },
  { label: "Convert to GIF", icon: Film, action: "gif", comingSoon: false },
  { label: "Remix", icon: Shuffle, action: "remix", comingSoon: true },
  { label: "Enhance", icon: Wand2, action: "enhance", comingSoon: true },
  { label: "Upscale", icon: ImageUp, action: "upscale", comingSoon: true },
]

export function ImageEditorToolbar({
  onCartoonify,
  onConvertToGif,
  onReset,
  onClose,
  isProcessing,
  processingLabel,
}: ImageEditorToolbarProps) {
  const [showAIMenu, setShowAIMenu] = useState(false)

  function handleAIAction(action: string) {
    if (action === "cartoonify") {
      onCartoonify()
    } else if (action === "gif") {
      onConvertToGif()
    }
    setShowAIMenu(false)
  }

  return (
    <div className="flex -translate-x-1/2 items-center gap-0.5 rounded-xl bg-foreground/90 px-1.5 py-1.5 shadow-xl backdrop-blur-md">
      {/* Edit with AI button */}
      <div className="relative">
        <button
          onClick={() => setShowAIMenu(!showAIMenu)}
          disabled={isProcessing}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:from-[#2563eb] hover:to-[#0891b2] disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {isProcessing ? (processingLabel || "Processing...") : "Edit with AI"}
        </button>

        {/* AI Submenu */}
        {showAIMenu && !isProcessing && (
          <div className="absolute bottom-full left-0 mb-2 w-44 overflow-hidden rounded-xl bg-foreground/95 p-1 shadow-2xl backdrop-blur-md">
            {aiSubmenuItems.map((item) => (
              <button
                key={item.action}
                onClick={() => !item.comingSoon && handleAIAction(item.action)}
                disabled={item.comingSoon}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${item.comingSoon ? "cursor-default text-white/40" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                <item.icon className="h-3.5 w-3.5 shrink-0 text-white/50" />
                <span className="flex-1">{item.label}</span>
                {item.comingSoon && (
                  <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-white/40">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-1 h-5 w-px bg-white/20" />

      {/* Replace */}
      <button
        onClick={onClose}
        className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        title="Replace image"
      >
        <Replace className="h-4 w-4" />
      </button>

      {/* Delete */}
      <button
        onClick={onClose}
        className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        title="Delete image"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        title="Reset to original"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  )
}
