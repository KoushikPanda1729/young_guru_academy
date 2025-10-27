"use client"

import { DashboardTemplate } from "@/components/dashboard/dashboard-template"
import { IconMapQuestion, IconPlus } from "@tabler/icons-react"
import { Circle } from "lucide-react"
import { Button } from "@t2p-admin/ui/components/button"
import { QuestionSheet } from "@/features/question/components/question-sheet"
import { getQuestionColumns } from "@/components/data-table/columns/question-columns"
import { useQuestions } from "@/features/question/hooks/useQuestion"
import { useQuestionSheet } from "@/features/question/hooks/useQuestionSheet"
import type { QuestionFormType, QuestionType } from "@/features/question/question.schema"
import { toast } from "sonner"
import { useEffect } from "react"

export default function QuestionsPage() {
  const {
    data,
    stats,
    isLoading,
    isStatsLoading,
    error,
    statsError,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    refetch,
    refetchStats,
    handleDelete,
    handleBulkArchive,
    handleBulkDelete,
    handleBulkUnarchive,
    handleArchive,
    handleUnarchive,
  } = useQuestions({ initialPageSize: 10, enabled: true })

  const {
    isOpen,
    currentQuestion,
    mode,
    isLoading: isSheetLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  } = useQuestionSheet()

  const handleViewEdit = (q: QuestionType) => openSheet(q, "view")

  const handleSheetSave = async (data: QuestionFormType) => {
    await handleSave(data)
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  useEffect(() => {
    if (statsError) {
      toast.error(`Stats error: ${statsError}`)
    }
  }, [statsError])

  const columns = getQuestionColumns({
    handleViewEdit,
    handleDelete,
    handleArchive,
    handleUnarchive,
  })

const enhancedStats = stats
  ? [
      {
        label: "Total Questions",
        value: stats.totalCount,
        icon: <Circle className="size-4 text-muted-foreground" />,
        isLoading: isStatsLoading,
      },
      {
        label: "Category A",
        value: stats.CategoryACount,
        icon: <Circle className="size-4 text-blue-500" />,
        isLoading: isStatsLoading,
      },
      {
        label: "Category B",
        value: stats.CategoryBCount,
        icon: <Circle className="size-4 text-green-500" />,
        isLoading: isStatsLoading,
      },
      {
        label: "Category C",
        value: stats.CategoryCCount,
        icon: <Circle className="size-4 text-yellow-500" />,
        isLoading: isStatsLoading,
      },
    ]
  : [];


  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchStats()])
  }

  return (
    <DashboardTemplate
      icon={<IconMapQuestion className="size-6 text-primary" />}
      title="Question Management"
      description="Manage and organize test questions"
      onRefresh={handleRefresh}
      refreshing={isLoading || isStatsLoading}
      actions={
        <Button size="sm" className="gap-2" onClick={() => openSheet(undefined, "create")}>
          <IconPlus className="size-4" />
          Add Questions
        </Button>
      }
      stats={enhancedStats}
      isStatsLoading={isStatsLoading}
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
        categoryOptions: ["A", "B", "C"],
        archivedOptions: [
          { label: "All", value: "all" },
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ],
        searchColumns: ["question"],
        handleBulkDelete: handleBulkDelete,
        handleBulkArchive: handleBulkArchive,
        handleBulkUnarchive: handleBulkUnarchive,
      }}
    >
      <QuestionSheet
        question={currentQuestion}
        isOpen={isOpen}
        onClose={closeSheet}
        mode={mode}
        onModeChange={setMode}
        onSave={handleSheetSave}
        isLoading={isSheetLoading}
      />
    </DashboardTemplate>
  )
}