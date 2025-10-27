"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { CourseType } from "../helpers/course.schema";

interface CourseOption {
  id: string;
  title: string;
}

export function useCourseOptions(enabled = true) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courseOptions"],
    queryFn: async (): Promise<CourseOption[]> => {
      const response = await api.courses.getCourses({
        limit: 100,
        offset: 0,
        sortBy: "createdAt",
        sortDirection: "desc",
      });

      const items = response.data ?? [];
      return items.map((c: CourseType) => ({
        id: c.id,
        title: c.title,
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
