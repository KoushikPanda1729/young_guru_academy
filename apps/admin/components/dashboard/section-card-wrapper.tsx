"use client"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@t2p-admin/ui/components/card"
import { Badge } from "@t2p-admin/ui/components/badge"
import { type ReactNode } from "react"

interface SectionCardWrapperProps {
  title: string
  value: string | number
  description: string
  badgeText: string
  badgeIcon: ReactNode
  footerText: string
  footerSubtext: string
  trendingIcon?: ReactNode
}

export function SectionCardWrapper({
  title,
  value,
  badgeText,
  badgeIcon,
  footerText,
  footerSubtext,
  trendingIcon
}: SectionCardWrapperProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {badgeIcon}
            {badgeText}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {footerText}
          {trendingIcon && <span className="size-4 mr-2">{trendingIcon}</span>}
        </div>
        <div className="text-muted-foreground">{footerSubtext}</div>
      </CardFooter>
    </Card>
  )
}
