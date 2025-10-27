"use client"

import { DashboardTemplate } from "@/components/dashboard/dashboard-template"
import { IconPhoneCall } from "@tabler/icons-react"
import { Circle } from "lucide-react"
import { toast } from "sonner"
import { useEffect } from "react"
import { useTest } from "@/features/test/hook/useTest"
import { testHistoryColumns } from "@/components/data-table/columns/test-columns"
import { TestHistoryType } from "@/features/test/test.schema"
import { useTestSheet } from "@/features/test/hook/useTestSheet"
import { TestSheet } from "@/features/test/components/test-sheet"
import { Button } from "@t2p-admin/ui/components/button"
import { exportToExcel } from "@/lib/utils"

export default function TestPage() {
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
  } = useTest({ initialPageSize: 10, enabled: true })

  const {
    isOpen,
    currentTest,
    openSheet,
    closeSheet,
  } = useTestSheet()

  const handleView = (test: TestHistoryType) => openSheet(test)

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  useEffect(() => {
    if (statsError) toast.error(`Stats error: ${statsError}`)
  }, [statsError])

  const columns = testHistoryColumns({
    handleView,
    handleDelete,
    handleArchive,
    handleUnarchive,
  })

  const enhancedStats = stats
    ? [
        {
          label: "Total Tests",
          value: stats.totalCount,
          icon: <Circle className="size-4 text-muted-foreground" />,
          isLoading: isStatsLoading,
        },
        {
          label: "This Week",
          value: stats.weeklyTotal,
          icon: <Circle className="size-4 text-blue-500" />,
          isLoading: isStatsLoading,
        },
        {
          label: "This Month",
          value: stats.monthlyTotal,
          icon: <Circle className="size-4 text-green-500" />,
          isLoading: isStatsLoading,
        },
        {
          label: "Today",
          value: stats.todaysTotal,
          icon: <Circle className="size-4 text-yellow-500" />,
          isLoading: isStatsLoading,
        },
      ]
    : []

  const handleRefresh = async () => {
    await Promise.all([refetch(), refetchStats()])
  }

  return (
    <DashboardTemplate
      icon={<IconPhoneCall className="size-6 text-primary" />}
      title="Test Management"
      description="Monitor and manage all Tests"
      onRefresh={handleRefresh}
      refreshing={isLoading || isStatsLoading}
      actions={
          <Button size={"sm"} onClick={() => exportToExcel<TestHistoryType[]>(data?.data ?? [])}>
            Generate Report
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
        categoryOptions: [],
        archivedOptions: [
          { label: "All", value: "all" },
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ],
        searchColumns: ["callerId", "receiverId", "callerName", "receiverName"],
        handleBulkDelete,
        handleBulkArchive,
        handleBulkUnarchive,
      }}
    >
      <TestSheet
        test={currentTest}
        isOpen={isOpen}
        onClose={closeSheet}
      />
    </DashboardTemplate>
  )
}
