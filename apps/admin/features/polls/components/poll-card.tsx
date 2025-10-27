"use client";

import {
  MoreVertical,
  Edit3,
  Trash2,
  Lock,
  LockOpen,
  Heart,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { Badge } from "@t2p-admin/ui/components/badge";
import { Button } from "@t2p-admin/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@t2p-admin/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu";
import { cn } from "@t2p-admin/ui/lib/utils";
import { PollResponse } from "../helpers/polls.schema";

type PollStatus = "draft" | "open" | "closed";

export type PollCardProps = {
  poll: PollResponse;
  className?: string;
  onEdit?: (poll: PollResponse) => void;
  onDelete?: (poll: PollResponse) => void;
  onOpen?: (poll: PollResponse) => void;
  onClose?: (poll: PollResponse) => void;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }: { status: PollStatus }) {
  const color =
    status === "open"
      ? "bg-green-100 text-green-800"
      : status === "closed"
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-800";
  return <Badge className={color}>{status.toUpperCase()}</Badge>;
}

export function PollCard({
  poll,
  className,
  onEdit,
  onDelete,
  onOpen,
  onClose,
}: PollCardProps) {
  const handleToggleStatus = () => {
    if (poll.isClosed) {
      onOpen?.(poll); // Was closed, now open
    } else {
      onClose?.(poll); // Was open, now close
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="space-y-2 flex-1">
          <CardTitle className="text-lg font-semibold">
            {poll.question}
          </CardTitle>
          {poll.description && (
            <p className="text-sm text-muted-foreground">{poll.description}</p>
          )}

          <CardDescription className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={poll.isClosed ? "closed" : "open"} />
            <span className="text-xs font-medium text-muted-foreground">
              {poll.totalVotes} {poll.totalVotes === 1 ? "vote" : "votes"}
            </span>
            {poll.likesCount && poll.likesCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Heart className="h-3 w-3" />
                {poll.likesCount}
              </span>
            )}
            {poll.commentsCount && poll.commentsCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageCircle className="h-3 w-3" />
                {poll.commentsCount}
              </span>
            )}
          </CardDescription>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Open poll actions"
            >
              <MoreVertical className="h-4 w-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            <DropdownMenuLabel>Poll actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit?.(poll)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleToggleStatus}
              className="cursor-pointer"
            >
              {poll.isClosed ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Open poll
                </>
              ) : (
                <>
                  <LockOpen className="mr-2 h-4 w-4" />
                  Close poll
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(poll)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-2 px-6 py-4">
        {poll.options.map((opt) => {
          const percent =
            poll.totalVotes > 0
              ? Math.round((opt.votesCount / poll.totalVotes) * 100)
              : 0;
          const isHighest =
            opt.votesCount ===
              Math.max(...poll.options.map((o) => o.votesCount)) &&
            opt.votesCount > 0;

          return (
            <div key={opt.id} className="relative">
              <div className="relative z-10 flex items-center justify-between px-4 py-3 border border-primary rounded-2xl">
                <div className="font-medium text-sm">{opt.text}</div>
                <div className="text-sm font-semibold text-primary">
                  {percent}%
                </div>
              </div>
              <div
                className={cn(
                  "absolute inset-0 rounded-lg transition-all",
                  isHighest
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-muted/50 border border-border"
                )}
                style={{
                  clipPath: `inset(0 ${100 - percent}% 0 0 round 0.5rem)`,
                }}
              />
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4 pb-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {poll.endsAt ? (
            <span>Ends {formatDate(poll.endsAt)}</span>
          ) : (
            <span>Started {formatDate(poll.startsAt)}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToggleStatus}>
            {poll.isClosed ? "Opem poll" : "Close poll"}
          </Button>
          <Button size="sm" onClick={() => onEdit?.(poll)}>
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export type PollGridProps = {
  polls: PollResponse[];
  className?: string;
  onEdit?: (poll: PollResponse) => void;
  onDelete?: (poll: PollResponse) => void;
  onOpen?: (poll: PollResponse) => void;
  onClose?: (poll: PollResponse) => void;
};

export function PollGrid({
  polls,
  className,
  onEdit,
  onDelete,
  onOpen,
  onClose,
}: PollGridProps) {
  if (polls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No polls found</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpen={onOpen}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
