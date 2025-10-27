"use client"

import { DashboardTemplate } from "@/components/dashboard/dashboard-template"
import { IconTrophy, IconPlus } from "@tabler/icons-react"
import { Circle } from "lucide-react"
import { Button } from "@t2p-admin/ui/components/button"
import { useQuestSheet } from "@/features/quest/hooks/useQuestSheet"
import type { ScheduleQuestFormType, QuestType } from "@/features/quest/quest.schema"
import { toast } from "sonner"
import { useEffect } from "react"
import { useQuest } from "@/features/quest/hooks/useQuest"
import { QuestSheet } from "@/features/quest/component/quest-sheet"
import { getQuestColumns } from "@/components/data-table/columns/quest-columns"

export default function QuestsPage() {
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
  } = useQuest({ initialPageSize: 10, enabled: true })

  const {
    isOpen,
    currentQuest,
    mode,
    isLoading: isSheetLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  } = useQuestSheet()

  const handleViewEdit = (q: QuestType) => openSheet(q, "view")

  const handleSheetSave = async (data: ScheduleQuestFormType) => {
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

  const columns = getQuestColumns({
    handleViewEdit,
    handleDelete,
    handleArchive,
    handleUnarchive,
  })

  const enhancedStats = stats
    ? [
        {
          label: "Total Quests",
          value: stats.totalCount,
          icon: <Circle className="size-4 text-muted-foreground" />,
          isLoading: isStatsLoading,
        },
        {
          label: "Archived Quests",
          value: stats.ArchievedQuestTotal,
          icon: <Circle className="size-4 text-red-500" />,
          isLoading: isStatsLoading,
        },
      ]
    : [];

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchStats()])
  }

  return (
    <DashboardTemplate
      icon={<IconTrophy className="size-6 text-primary" />}
      title="Quest Management"
      description="Manage and organize quest schedules"
      onRefresh={handleRefresh}
      refreshing={isLoading || isStatsLoading}
      actions={
        <Button size="sm" className="gap-2" onClick={() => openSheet(undefined, "create")}>
          <IconPlus className="size-4" />
          Add Quest
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
        archivedOptions: [
          { label: "All", value: "all" },
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ],
        searchColumns: ["title", "description"],
        handleBulkDelete: handleBulkDelete,
        handleBulkArchive: handleBulkArchive,
        handleBulkUnarchive: handleBulkUnarchive,
      }}
    >
      <QuestSheet
        quest={currentQuest}
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