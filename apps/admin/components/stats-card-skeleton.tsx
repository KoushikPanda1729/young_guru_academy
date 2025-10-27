import { Card, CardContent, CardHeader } from "@t2p-admin/ui/components/card";
import { Skeleton } from "@t2p-admin/ui/components/skeleton";

export const StatsCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-3 rounded-full" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-7 w-16" />
    </CardContent>
  </Card>
);