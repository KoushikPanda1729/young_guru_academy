"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import type { PushNotificationType, ScheduleNotificationFormType } from "../notification.schema"
import { api } from "@/lib/api"

type NotificationSheetMode = "create" | "view"

export function useNotificationSheet() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentNotification, setCurrentNotification] = useState<PushNotificationType | null>(null)
  const [mode, setMode] = useState<NotificationSheetMode>("view")
  const [isLoading, setIsLoading] = useState(false)

  const openSheet = useCallback(
    (sheetMode: NotificationSheetMode = "create", notification: PushNotificationType | null = null) => {
      setCurrentNotification(notification)
      setMode(sheetMode)
      setIsOpen(true)
    },
    []
  )

  const closeSheet = useCallback(() => {
    setIsOpen(false)
    setCurrentNotification(null)
  }, [])

  const handleSave = useCallback(
    async (data: ScheduleNotificationFormType) => {
      try {
        setIsLoading(true)
        await api.notification.createNotification(data)
        toast.success("Notification created successfully")
        closeSheet()
      } catch (err) {
        toast.error((err as Error)?.message ?? "Failed to create notification")
      } finally {
        setIsLoading(false)
      }
    },
    [closeSheet]
  )

  return {
    isOpen,
    mode,
    setMode,
    isLoading,
    currentNotification,
    openSheet,
    closeSheet,
    handleSave,
  }
}
