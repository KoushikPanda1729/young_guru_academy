"use client";

import { IconBook, IconPlus } from "@tabler/icons-react";
import { Header } from "@/components/dashboard/page-header";
import React, { useCallback, useMemo, Suspense } from "react";
import { useCourse } from "../hooks/useCourse";
import { useCourseSheet } from "../hooks/useCourseSheet";
import { Button } from "@t2p-admin/ui/components/button";
import { CoursePagination } from "./course-pagination";
import { CourseCard } from "./course-card";
import { CourseSheet } from "./course-sheet";
import { Alert, AlertDescription } from "@t2p-admin/ui/components/alert";
import { Skeleton } from "@t2p-admin/ui/components/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { CourseType } from "../helpers/course.schema";

// Loading skeleton component for better UX
const CourseCardSkeleton = React.memo(() => (
  <div className="w-[300px] mx-auto">
    <Skeleton className="aspect-video w-full rounded-t-xl" />
    <div className="p-4 space-y-3 border border-t-0 rounded-b-xl">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
));
CourseCardSkeleton.displayName = "CourseCardSkeleton";

// Empty state component
const EmptyState = React.memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center mt-16 gap-6 text-center max-w-md mx-auto"
  >
    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
      <IconBook className="w-12 h-12 text-muted-foreground" />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-foreground">No courses yet</h3>
      <p className="text-muted-foreground">
        Get started by creating your first course. Share your knowledge with the
        world!
      </p>
    </div>
  </motion.div>
));
EmptyState.displayName = "EmptyState";

// Error boundary component
const ErrorFallback = React.memo<{ error: string; onRetry: () => void }>(
  ({ error, onRetry }) => (
    <Alert variant="destructive" className="mt-6">
      <AlertDescription className="flex items-center justify-between">
        <span>Error loading courses: {error}</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  )
);
ErrorFallback.displayName = "ErrorFallback";

// Grid container with animation
const CourseGrid = React.memo<{ children: React.ReactNode }>(({ children }) => (
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
));
CourseGrid.displayName = "CourseGrid";

export default function CourseClient() {
  const {
    data,
    total,
    isLoading: courseLoading,
    pagination,
    setPagination,
    refetch,
    handleDelete,
    handlePublish,
    handleUnpublish,
    handlePopular,
    handleUnpopular,
    error: courseError,
    setError,
  } = useCourse();

  const {
    isOpen,
    currentCourse,
    mode,
    isLoading: sheetLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  } = useCourseSheet();

  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([refetch()]);
      toast.success("Courses refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh courses");
      console.error("Refresh error:", error);
    }
  }, [refetch]);

  const handleCreateCourse = useCallback(() => {
    openSheet(undefined, "create");
  }, [openSheet]);

  const handleEditCourse = useCallback(
    (course: CourseType) => {
      openSheet(course, "edit");
    },
    [openSheet]
  );

  const handleViewCourse = useCallback(
    (course: CourseType) => {
      openSheet(course, "view");
    },
    [openSheet]
  );

  const handleDeleteCourse = useCallback(
    async (course: CourseType) => {
      try {
        await handleDelete(course);
        toast.success(`Course "${course.title}" deleted successfully`);
      } catch (error) {
        toast.error("Failed to delete course");
        console.error("Delete error:", error);
      }
    },
    [handleDelete]
  );

  const handlePublishCourse = useCallback(
    async (course: CourseType) => {
      try {
        await handlePublish(course);
        toast.success(`Course "${course.title}" published successfully`);
      } catch (error) {
        toast.error("Failed to publish course");
        console.error("Publish error:", error);
      }
    },
    [handlePublish]
  );

  const handleUnpublishCourse = useCallback(
    async (course: CourseType) => {
      try {
        await handleUnpublish(course);
        toast.success(`Course "${course.title}" unpublished successfully`);
      } catch (error) {
        toast.error("Failed to unpublish course");
        console.error("Unpublish error:", error);
      }
    },
    [handleUnpublish]
  );

  const handlePopularCourse = useCallback(
    async (course: CourseType) => {
      try {
        await handlePopular(course);
        toast.success(`Course "${course.title}" marked as popular`);
      } catch (error) {
        toast.error("Failed to mark course as popular");
        console.error("Popular error:", error);
      }
    },
    [handlePopular]
  );

  const handleUnpopularCourse = useCallback(
    async (course: CourseType) => {
      try {
        await handleUnpopular(course);
        toast.success(`Course "${course.title}" unmarked as popular`);
      } catch (error) {
        toast.error("Failed to unmark course as popular");
        console.error("Unpopular error:", error);
      }
    },
    [handleUnpopular]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, pageIndex: page }));
    },
    [setPagination]
  );

  const handleRetryError = useCallback(() => {
    setError(null);
    refetch();
  }, [setError, refetch]);

  const totalPages = useMemo(
    () => Math.ceil(total / pagination.pageSize),
    [total, pagination.pageSize]
  );

  const showPagination = useMemo(
    () => totalPages > 1 && !courseLoading && data && data.length > 0,
    [totalPages, courseLoading, data]
  );

  const renderLoadingSkeletons = useMemo(
    () =>
      Array.from({ length: pagination.pageSize }, (_, idx) => (
        <CourseCardSkeleton key={`skeleton-${idx}`} />
      )),
    [pagination.pageSize]
  );

  return (
    <>
      <section className="pb-4">
        <Header
          icon={<IconBook className="w-6 h-6 text-primary" />}
          title="Course Management"
          description="Create, edit, manage and publish your courses"
          onRefresh={handleRefresh}
          actions={
            <Button
              size="sm"
              className="gap-2 hover:gap-3 transition-all duration-200"
              onClick={handleCreateCourse}
              disabled={sheetLoading}
            >
              <IconPlus className="size-4" />
              Create Course
            </Button>
          }
        />
      </section>

      <section className="lg:px-6 px-4">
        {courseError && !courseLoading && (
          <ErrorFallback error={courseError} onRetry={handleRetryError} />
        )}

        {courseLoading && <CourseGrid>{renderLoadingSkeletons}</CourseGrid>}

        {!courseLoading && !courseError && (
          <AnimatePresence mode="wait">
            {data && data.length > 0 ? (
              <motion.div
                key="courses-with-data"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CourseGrid>
                  <AnimatePresence>
                    {data.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        layout
                      >
                        <CourseCard
                          course={course}
                          showActions
                          onEdit={() => handleEditCourse(course)}
                          onView={() => handleViewCourse(course)}
                          onDelete={() => handleDeleteCourse(course)}
                          onPublish={() => handlePublishCourse(course)}
                          onUnpublish={() => handleUnpublishCourse(course)}
                          onPopular={() => handlePopularCourse(course)}
                          onUnpopular={() => handleUnpopularCourse(course)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CourseGrid>

                {showPagination && (
                  <motion.div
                    className="mt-8 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CoursePagination
                      currentPage={pagination.pageIndex}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="courses-empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EmptyState />
                <motion.div
                  className="flex justify-center mt-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    size="lg"
                    className="gap-2 hover:gap-3 transition-all duration-200"
                    onClick={handleCreateCourse}
                    disabled={sheetLoading}
                  >
                    <IconPlus className="size-5" />
                    Create Your First Course
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>

      <Suspense fallback={null}>
        <CourseSheet
          course={currentCourse}
          isOpen={isOpen}
          onClose={closeSheet}
          mode={mode}
          onModeChange={setMode}
          onSave={handleSave}
          isLoading={sheetLoading}
        />
      </Suspense>
    </>
  );
}
