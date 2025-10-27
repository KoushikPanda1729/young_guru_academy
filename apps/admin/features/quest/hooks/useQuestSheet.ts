"use client"
import { useState, useCallback } from "react"
import type { ScheduleQuestFormType, QuestType, UpdateQuestType } from "@/features/quest/quest.schema"
import { api } from "@/lib/api"
import { toast } from "sonner"
interface UseQuestSheetReturn {
  isOpen: boolean
  currentQuest: QuestType | null
  mode: "view" | "edit" | "create"
  isLoading: boolean
  openSheet: (quest?: QuestType | null, mode?: "view" | "edit" | "create") => void
  closeSheet: () => void
  setMode: (mode: "view" | "edit" | "create") => void
  handleSave: (data: ScheduleQuestFormType) => Promise<void>
}

export function useQuestSheet(): UseQuestSheetReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuest, setCurrentQuest] = useState<QuestType | null>(null)
  const [mode, setMode] = useState<"view" | "edit" | "create">("view")
  const [isLoading, setIsLoading] = useState(false)

  const openSheet = useCallback(
    (quest?: QuestType | null, initialMode: "view" | "edit" | "create" = "view") => {
      setCurrentQuest(quest ?? null)
      setMode(initialMode)
      setIsOpen(true)
    },
    [],
  )

  const closeSheet = useCallback(() => {
    setIsOpen(false)
    setCurrentQuest(null)
    setMode("view")
  }, [])

  const handleSave = useCallback(
    async (data: ScheduleQuestFormType) => {
      setIsLoading(true)
      try {
        if (mode === "create") {
          const created = await api.quest.createQuest(data)
          setCurrentQuest(created.data)
          setMode("view")
          toast.success("Quest created successfully")
        } else if (currentQuest) {
          const updateData: UpdateQuestType = {
            ...data,
            banner: typeof data.banner === 'string' ? data.banner : undefined
          }
          await api.quest.updateQuestById(
            { id: currentQuest.id },
            updateData
          )
          setCurrentQuest((prev) => prev ? { 
            ...prev, 
            ...updateData,
            banner: updateData.banner || prev.banner
          } : null)
          toast.success("Quest updated successfully")
        }
      } catch (error) {
        console.error("Error saving quest:", error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [currentQuest, mode]
  )

  return {
    isOpen,
    currentQuest,
    mode,
    isLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  }
}