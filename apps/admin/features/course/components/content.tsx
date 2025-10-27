"use client";

import React, { useCallback, memo, JSX } from "react";
import {
  MoreVertical,
  Video,
  FileText,
  HelpCircle,
  GripVertical,
  Lock,
  Unlock,
  Trash,
  Edit2,
  Eye,
} from "lucide-react";
import { Button } from "@t2p-admin/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { cn } from "@t2p-admin/ui/lib/utils";
import { Badge } from "@t2p-admin/ui/components/badge";

type ContentType = "VIDEO" | "FILE" | "QUIZ";

type ContentItemProps = {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  date: string | Date;
  order?: number;
  onRename?: (id: string, newName: string, newDescription: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  locked: boolean;
  onLock?: () => void;
  onUnlock?: () => void;
};

function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

const iconMap: Record<ContentType, JSX.Element> = {
  VIDEO: <Video className="w-6 h-6 text-blue-600 shrink-0" />,
  FILE: <FileText className="w-6 h-6 text-green-600 shrink-0" />,
  QUIZ: <HelpCircle className="w-6 h-6 text-purple-600 shrink-0" />,
};

const ContentItem = memo<ContentItemProps>(
  ({
    id,
    title,
    description = "",
    type,
    date,
    order,
    onRename,
    onDelete,
    onView,
    locked,
    onLock,
    onUnlock,
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const handleViewClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onView?.(id);
      },
      [id, onView]
    );

    const handleEditClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onRename?.(id, title, description);
      },
      [id, title, description, onRename]
    );

    const handleDeleteClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(id);
      },
      [id, onDelete]
    );

    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group relative flex items-center justify-between p-4 border rounded-xl shadow-sm bg-card cursor-pointer transition-all",
          "hover:bg-accent/10 hover:shadow-md",
          isDragging && "opacity-50 shadow-lg z-50 rotate-1"
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "flex-shrink-0 cursor-grab active:cursor-grabbing p-1 rounded-md transition-colors",
            isDragging && "cursor-grabbing opacity-100"
          )}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        <div
          className="flex items-center gap-3 overflow-hidden flex-1 min-w-0"
          onClick={handleViewClick}
        >
          <div className="relative flex items-center justify-center w-8 h-8">
            {iconMap[type]}
            {typeof order === "number" && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {order + 1}
              </Badge>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-medium truncate text-foreground">{title}</p>
            {description && (
              <p className="text-sm text-muted-foreground truncate">
                {description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {type.charAt(0) + type.slice(1).toLowerCase()} ·{" "}
              {formatDate(date)}
            </p>
          </div>
        </div>

        <DropdownMenu>
          {locked && <Lock className="w-4 h-4 text-red-500 z-10" />}
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent transition"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={handleViewClick}>
              <Eye className="w-4 h-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditClick}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {locked ? (
              <DropdownMenuItem onClick={onUnlock} className="cursor-pointer">
                <Unlock className="w-4 h-4 mr-2" />
                Unlock Folder
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={onLock} className="cursor-pointer">
                <Lock className="w-4 h-4 mr-2" />
                Lock Folder
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={handleDeleteClick}
              className="text-destructive focus:bg-destructive/20 focus:text-destructive"
            >
              <Trash className="w-4 h-4 mr-2 text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isDragging && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-xl" />
        )}
      </motion.div>
    );
  }
);

ContentItem.displayName = "ContentItem";
export default ContentItem;
