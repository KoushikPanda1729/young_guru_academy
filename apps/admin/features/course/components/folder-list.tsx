"use client";

import React, { useState, useCallback } from "react";
import { CourseFolderType } from "@/features/course/helpers/folder.schema";
import FolderItem from "./folder";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { motion, AnimatePresence } from "motion/react";
import { Folder, FolderPlus } from "lucide-react";
import { Button } from "@t2p-admin/ui/components/button";

type FolderListProps = {
  folders: CourseFolderType[];
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  onReorder?: (folders: CourseFolderType[]) => void;
  onCreateFolder?: () => void;
  onLock?: (id: string) => void;
  onUnlock?: (id: string) => void;
  loading?: boolean;
};

const EmptyState = React.memo<{ onCreateFolder?: () => void }>(
  ({ onCreateFolder }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
        <Folder className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No folders yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Create your first folder to organize your course content and materials.
      </p>
      <Button onClick={onCreateFolder} className="gap-2">
        <FolderPlus className="w-4 h-4" />
        Create Your First Folder
      </Button>
    </motion.div>
  )
);

EmptyState.displayName = "EmptyState";

const LoadingSkeleton = React.memo(() => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse bg-muted/50 rounded-xl h-20 flex items-center gap-4 px-4"
      >
        <div className="w-8 h-8 bg-muted rounded" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-3 bg-muted rounded w-1/4" />
        </div>
      </div>
    ))}
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

export default function FolderList({
  folders,
  onRename,
  onDelete,
  onReorder,
  onLock,
  onUnlock,
  onCreateFolder,
  loading = false,
}: FolderListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localFolders, setLocalFolders] = useState(folders);

  React.useEffect(() => {
    setLocalFolders(folders);
  }, [folders]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        const oldIndex = localFolders.findIndex(
          (folder) => folder.id === active.id
        );
        const newIndex = localFolders.findIndex(
          (folder) => folder.id === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedFolders = arrayMove(localFolders, oldIndex, newIndex);

          // Update order property
          const updatedFolders = reorderedFolders.map((folder, index) => ({
            ...folder,
            order: index,
          }));

          setLocalFolders(updatedFolders);
          onReorder?.(updatedFolders);
        }
      }
    },
    [localFolders, onReorder]
  );

  const activeFolderItem = activeId
    ? localFolders.find((f) => f.id === activeId)
    : null;

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!localFolders || localFolders.length === 0) {
    return <EmptyState onCreateFolder={onCreateFolder} />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={localFolders.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          <AnimatePresence>
            {localFolders.map((folder, index) => (
              <FolderItem
                key={folder.id}
                id={folder.id}
                name={folder.name}
                date={folder.createdAt}
                order={index}
                locked={folder.lock}
                onLock={() => onLock?.(folder.id)}
                onUnlock={() => onUnlock?.(folder.id)}
                onRename={(newName) => onRename?.(folder.id, newName)}
                onDelete={() => onDelete?.(folder.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      <DragOverlay>
        {activeFolderItem ? (
          <div className="bg-card border border-border rounded-xl shadow-lg rotate-3 opacity-90">
            <FolderItem
              id={activeFolderItem.id}
              name={activeFolderItem.name}
              date={activeFolderItem.createdAt}
              isDragging
              onRename={() => {}}
              onDelete={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
