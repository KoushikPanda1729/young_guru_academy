"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QuestType } from "../quest.schema";

interface QuestOption {
  id: string;
  title: string;
}

export function useQuestOptions(enabled = true) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["questOptions"],
    queryFn: async (): Promise<QuestOption[]> => {
      const response = await api.quest.getQuests({
        limit: 100,
        offset: 0,
        sortBy: "createdAt",
        sortDirection: "desc",
      });

      const items = response.data ?? [];
      return items.map((q: QuestType) => ({
        id: q.id,
        title: q.title,
      }));
    },
    enabled,
    staleTime: 10 * 60 * 1000,
  });

  return {
    options: data ?? [],
    isLoading,
    error,
    refetch,
  };
}
