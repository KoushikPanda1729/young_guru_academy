"use client"

import { useState, useCallback } from "react"
import type { TestHistoryType } from "@/features/test/test.schema"

interface UseTestSheetReturn {
  isOpen: boolean
  currentTest: TestHistoryType | null
  openSheet: (test?: TestHistoryType | null) => void
  closeSheet: () => void
}

export function useTestSheet(): UseTestSheetReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTest, setCurrentTest] = useState<TestHistoryType | null>(null)

  const openSheet = useCallback((test?: TestHistoryType | null) => {
    setCurrentTest(test ?? null)
    setIsOpen(true)
  }, [])

  const closeSheet = useCallback(() => {
    setIsOpen(false)
    setCurrentTest(null)
  }, [])

  return {
    isOpen,
    currentTest,
    openSheet,
    closeSheet,
  }
}
