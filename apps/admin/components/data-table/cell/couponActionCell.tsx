"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu"
import { Button } from "@t2p-admin/ui/components/button"
import { IconDotsVertical } from "@tabler/icons-react"
import { CreateCouponOutput } from "@/features/coupon/helpers/coupon.schema"
import { IdType } from "@/lib/zod"

interface CouponActionsCellProps {
  coupon: CreateCouponOutput
  onView: (coupon: CreateCouponOutput) => void
  onEdit: (coupon: CreateCouponOutput) => void
  onDelete: (id: IdType['id']) => void
}

export function CouponActionsCell({
  coupon,
  onView,
  onEdit,
  onDelete,
}: CouponActionsCellProps) {


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <IconDotsVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onView(coupon)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(coupon)}>
          Edit Coupon
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(coupon.id)}
          className="text-destructive focus:text-destructive"
        >
          Delete Coupon
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
