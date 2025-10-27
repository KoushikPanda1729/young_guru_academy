"use client"

import { DashboardTemplate } from "@/components/dashboard/dashboard-template"
import { IconTrophy, IconPlus } from "@tabler/icons-react"
import { Button } from "@t2p-admin/ui/components/button"
import { toast } from "sonner"
import { useEffect } from "react"
import { useCoupon } from "@/features/coupon/hooks/useCoupon"
import { useCouponSheet } from "@/features/coupon/hooks/useCouponSheet"
import { CreateCouponInput, CreateCouponOutput } from "@/features/coupon/helpers/coupon.schema"
import { couponColumns } from "@/components/data-table/columns/coupon-column"
import { CouponSheet } from "@/features/coupon/components/coupon-sheet"

export default function CouponsPage() {
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
    refetch,
    handleDelete,
  } = useCoupon({ initialPageSize: 10, enabled: true })

  const {
    isOpen,
    currentCoupon,
    mode,
    isLoading: isSheetLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  } = useCouponSheet()

  const handleView = (q: CreateCouponOutput) => openSheet(q, "view")
  const handleEdit = (q: CreateCouponOutput) => openSheet(q, "edit")

  const handleSheetSave = async (data: CreateCouponInput) => {
    await handleSave(data)
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])


  const columns = couponColumns({
  handleView,
  handleEdit,
  handleDelete,
})

  const handleRefresh = async () => {
    await Promise.all([refetch()])
  }

  return (
    <DashboardTemplate
      icon={<IconTrophy className="size-6 text-primary" />}
      title="Coupon Management"
      description="Manage and organize quest schedules"
      onRefresh={handleRefresh}
      refreshing={isLoading}
      actions={
        <Button size="sm" className="gap-2" onClick={() => openSheet(undefined, "create")}>
          <IconPlus className="size-4" />
          Add Coupon
        </Button>
      }
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
      }}
    >
      <CouponSheet
        coupon={currentCoupon}
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