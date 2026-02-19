"use client"

import { Suspense } from "react"
import { WhatfixSidebar } from "@/components/whatfix-sidebar"
import { PromoPopup } from "@/components/promo-popup"

function EditorPageInner() {
  return (
    <>
      <WhatfixSidebar activeId="widgets" />
      <PromoPopup containerClassName="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 pl-[260px]" />
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
