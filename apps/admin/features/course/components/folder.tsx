"use client";

import React, { useState, useCallback, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MoreVertical,
  Folder,
  FolderOpen,
  GripVertical,
  Edit2,
  Trash2,
  Calendar,
  Lock,
  Unlock,
} from "lucide-react";
import { Button } from "@t2p-admin/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@t2p-admin/ui/components/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@t2p-admin/ui/components/alert-dialog";
import { Input } from "@t2p-admin/ui/components/input";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "motion/react";
import { cn } from "@t2p-admin/ui/lib/utils";

type FolderItemProps = {
  id: string;
  name: string;
  date: string | Date;
  order?: number;
  locked?: boolean;
  onRename?: (newName: string) => void;
  onDelete?: () => void;
  onLock?: () => void;
  onUnlock?: () => void;
  isDragging?: boolean;
};

function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const FolderItem = memo<FolderItemProps>(
  ({
    id,
    name,
    date,
    order,
    locked = false,
    onRename,
    onDelete,
    onLock,
    onUnlock,
  }) => {
    const router = useRouter();
    const { courseId } = useParams<{ courseId: string }>();
    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [renameValue, setRenameValue] = useState(name);
    const [isHovered, setIsHovered] = useState(false);

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

    const handleNavigate = useCallback(() => {
      router.push(`/dashboard/courses/my-courses/${courseId}/folders/${id}`);
    }, [router, courseId, id]);

    const handleRename = useCallback(() => {
      if (renameValue.trim() && renameValue.trim() !== name) {
        onRename?.(renameValue.trim());
      }
      setRenameOpen(false);
    }, [renameValue, name, onRename]);

    const handleDelete = useCallback(() => {
      onDelete?.();
      setDeleteOpen(false);
    }, [onDelete]);

    const handleRenameOpen = useCallback(() => {
      setRenameValue(name);
      setRenameOpen(true);
    }, [name]);

    return (
      <>
        <motion.div
          ref={setNodeRef}
          style={style}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "group relative bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
            "hover:bg-accent/5 hover:border-accent/20",
            isDragging && "opacity-50 shadow-lg z-50 rotate-1"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-4 p-4">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className={cn(
                "flex-shrink-0 cursor-grab active:cursor-grabbing p-1 rounded-md transition-colors",
                "hover:bg-muted",
                isDragging && "cursor-grabbing opacity-100"
              )}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Folder Icon */}
            <div className="flex-shrink-0 relative">
              {isHovered ? (
                <FolderOpen className="w-8 h-8 text-primary transition-all duration-200" />
              ) : (
                <Folder className="w-8 h-8 text-primary transition-all duration-200" />
              )}
            </div>

            {/* Folder Content */}
            <div className="flex-1 min-w-0">
              <button
                onClick={handleNavigate}
                className="block w-full text-left group/button"
              >
                <h3 className="font-semibold text-foreground group-hover/button:text-primary transition-colors duration-200 truncate">
                  {name}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>Created {formatDate(date)}</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Actions Menu */}
            <div className="flex-shrink-0 flex items-center">
              {locked && <Lock className="w-4 h-4 text-red-500 z-10" />}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={handleRenameOpen}
                    className="cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Rename Folder
                  </DropdownMenuItem>

                  {locked ? (
                    <DropdownMenuItem
                      onClick={onUnlock}
                      className="cursor-pointer"
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      Unlock Folder
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={onLock}
                      className="cursor-pointer"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Lock Folder
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeleteOpen(true)}
                    className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Drag Overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-xl" />
          )}
        </motion.div>

        {/* Rename Dialog */}
        <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rename Folder</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder="Enter folder name"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenameOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleRename}
                disabled={!renameValue.trim() || renameValue.trim() === name}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                folder and all of its contents.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Folder
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
);

FolderItem.displayName = "FolderItem";
export default FolderItem;
