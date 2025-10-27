import { Card, CardContent, CardHeader, CardTitle } from "@t2p-admin/ui/components/card"

export const StatsCard = ({
  icon,
  label,
  dotColor,
  value,
}: {
  icon?: React.ReactNode
  dotColor?: string
  label: string
  value: number | string
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      {icon ? icon : <div className={`w-3 h-3 rounded-full ${dotColor}`} />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
)