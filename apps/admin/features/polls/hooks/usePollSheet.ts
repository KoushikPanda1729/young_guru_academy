"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { CreatePollInput, PollResponse } from "../helpers/polls.schema";

interface UsePollSheetReturn {
  isOpen: boolean;
  currentPoll: PollResponse | null;
  mode: "view" | "edit" | "create";
  isLoading: boolean;
  openSheet: (
    poll?: PollResponse | null,
    mode?: "view" | "edit" | "create"
  ) => void;
  closeSheet: () => void;
  setMode: (mode: "view" | "edit" | "create") => void;
  handleSave: (data: CreatePollInput) => Promise<void>;
}

export function usePollSheet(): UsePollSheetReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPoll, setCurrentPoll] = useState<PollResponse | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | "create">("view");
  const [isLoading, setIsLoading] = useState(false);

  const openSheet = useCallback(
    (
      poll?: PollResponse | null,
      initialMode: "view" | "edit" | "create" = "view"
    ) => {
      setCurrentPoll(poll ?? null);
      setMode(initialMode);
      setIsOpen(true);
    },
    []
  );

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    setCurrentPoll(null);
    setMode("view");
  }, []);

  const handleSave = useCallback(
    async (data: CreatePollInput) => {
      setIsLoading(true);
      try {
        if (mode === "create") {
          const created = await api.poll.createPoll(data);
          setCurrentPoll(created.data);
          setMode("view");
          toast.success("Poll created successfully");
        } else if (currentPoll) {
          const updated = await api.poll.updatePollById(
            { id: currentPoll.id },
            data
          );
          setCurrentPoll(updated.data);
          toast.success("Poll updated successfully");
        }
      } catch (error) {
        console.error("Error saving poll:", error);
        toast.error("Failed to save poll");
      } finally {
        setIsLoading(false);
      }
    },
    [currentPoll, mode]
  );

  return {
    isOpen,
    currentPoll,
    mode,
    isLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  };
}
