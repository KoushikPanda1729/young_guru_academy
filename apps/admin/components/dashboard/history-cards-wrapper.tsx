import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@t2p-admin/ui/components/card'
import { Separator } from '@t2p-admin/ui/components/separator'
import React from 'react'

type HistoryCardProps = {
  title: string
  description: string
  time: Date | string
  status?: 'sent' | 'scheduled'
  to?: string
}

export default function HistoryCardWrappers({
  title,
  description,
  time,
  status,
  to,
}: HistoryCardProps) {
  const date = new Date(time)
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

  return (
    <Card className="w-full min-w-xs transition hover:bg-muted/5 hover:shadow-sm">
      <CardHeader>
        <CardTitle className="text-base md:text-lg font-semibold truncate">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
        {to && (
          <span className="inline-block text-xs font-medium px-2 py-0.5 mt-2 rounded bg-muted text-muted-foreground">
            To: {to}
          </span>
        )}
      </CardHeader>

      <Separator orientation="horizontal" className="w-full" />

      <CardFooter className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
        <span>{formattedDate}</span>
        {status && (
          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
              status === 'sent'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {status}
          </span>
        )}
      </CardFooter>
    </Card>
  )
}
