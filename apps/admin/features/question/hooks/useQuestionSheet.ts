"use client"

import { useState, useCallback } from "react"
import type { CreateQuestionType, QuestionFormType, QuestionType, UpdateQuestionType } from "@/features/question/question.schema"
import { api } from "@/lib/api"

interface UseQuestionSheetReturn {
  isOpen: boolean
  currentQuestion: QuestionType | null
  mode: "view" | "edit" | "create"
  isLoading: boolean

  openSheet: (question?: QuestionType | null, mode?: "view" | "edit" | "create") => void
  closeSheet: () => void
  setMode: (mode: "view" | "edit" | "create") => void
  handleSave: (data: QuestionFormType) => Promise<void>
}

export function useQuestionSheet(): UseQuestionSheetReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null)
  const [mode, setMode] = useState<"view" | "edit" | "create">("view")
  const [isLoading, setIsLoading] = useState(false)

  const openSheet = useCallback(
    (question?: QuestionType | null, initialMode: "view" | "edit" | "create" = "view") => {
      setCurrentQuestion(question ?? null)
      setMode(initialMode)
      setIsOpen(true)
    },
    [],
  )

  const closeSheet = useCallback(() => {
    setIsOpen(false)
    setCurrentQuestion(null)
    setMode("view")
  }, [])

  const handleSave = useCallback(
  async (data: QuestionFormType) => {
    setIsLoading(true)
    try {
      if (mode === "create") {
        const createData = data as CreateQuestionType
        console.log("Created", createData)
        const created = await api.question.createQuestion(createData)
        setCurrentQuestion(created.data)
        setMode("view")
        console.log("Question created successfully")
      } else if (currentQuestion) {
        const updateData = data as UpdateQuestionType
        await api.question.updateQuestionById(
          { id: currentQuestion.id },
          updateData
        )
        setCurrentQuestion((prev) => (prev ? { ...prev, ...data } : null))
        console.log("Question updated successfully")
      }
    } catch (error) {
      console.error("Error saving question:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  },
  [currentQuestion, mode]
)


  return {
    isOpen,
    currentQuestion,
    mode,
    isLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  }
}
