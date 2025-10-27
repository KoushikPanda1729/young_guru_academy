"use client";

import { useState, useCallback } from "react";
import type { StudentFeedbackItem } from "@/features/reviews/helpers/reviews.schema";

interface UseReviewSheetReturn {
  isOpen: boolean;
  currentReview: StudentFeedbackItem | null;
  openSheet: (review?: StudentFeedbackItem | null) => void;
  closeSheet: () => void;
}

export function useReviewSheet(): UseReviewSheetReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<StudentFeedbackItem | null>(null);

  const openSheet = useCallback((review?: StudentFeedbackItem | null) => {
    setCurrentReview(review ?? null);
    setIsOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    setCurrentReview(null);
  }, []);

  return {
    isOpen,
    currentReview,
    openSheet,
    closeSheet,
  };
}
