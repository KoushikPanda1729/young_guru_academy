"use client";

import { DashboardTemplate } from "@/components/dashboard/dashboard-template";
import { IconMessageCircle } from "@tabler/icons-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useReview } from "../hooks/useReview";
import { getReviewColumns } from "./review-column";
import { StudentFeedbackItem } from "../helpers/reviews.schema";
import { ReviewSheet } from "./review-sheet";

export default function ReviewsClient() {
  const {
    data,
    isLoading,
    error,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    handleDelete,
    refetch,
  } = useReview({ initialPageSize: 10, enabled: true });

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<StudentFeedbackItem | null>(null);

  const handleView = (review: StudentFeedbackItem) => {
    setCurrentReview(review);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setCurrentReview(null);
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const columns = getReviewColumns({
    handleView,
    handleDelete
  });

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <DashboardTemplate
      icon={<IconMessageCircle className="size-6 text-primary" />}
      title="Student Reviews"
      description="View and manage student feedback"
      onRefresh={handleRefresh}
      refreshing={isLoading}
      isStatsLoading={false}
      tableProps={{
        columns,
        paginatedTableData: data,
        isTableDataLoading: isLoading,
        pagination,
        setPagination,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        categoryOptions: ['REPORT', 'REVIEW'],
        searchColumns: ["review", "student.user.name", "reviewer.user.name"],
      }}
    >
      <ReviewSheet
        review={currentReview}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />
    </DashboardTemplate>
  );
}
