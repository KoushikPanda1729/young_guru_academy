"use client";

import React, { useState, useCallback, useEffect } from "react";
import { CourseContentType } from "../helpers/course.schema";
import ContentItem from "./content";
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
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { motion, AnimatePresence } from "motion/react";

type ContentListProps = {
  contents: CourseContentType[];
  onRename?: (id: string, newName: string, newDescription: string) => void;
  onDelete?: (id: string) => void;
  onReorder?: (orders: { id: string; order: number }[]) => void;
  onView?: (id: string) => void;
  onUnlock?: (id: string) => void;
  onLock?: (id: string) => void;
};

/* --- Loading skeleton --- */
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

export default function ContentList({
  contents,
  onRename,
  onDelete,
  onView,
  onLock,
  onUnlock,
  onReorder,
}: ContentListProps) {
  const [localContents, setLocalContents] = useState(contents);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setLocalContents(contents);
  }, [contents]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        const oldIndex = localContents.findIndex((c) => c.id === active.id);
        const newIndex = localContents.findIndex((c) => c.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(localContents, oldIndex, newIndex);
          const updated = reordered.map((c, idx) => ({ ...c, order: idx }));

          setLocalContents(updated);
          onReorder?.(updated);
        }
      }
    },
    [localContents, onReorder]
  );

  const activeItem = activeId
    ? localContents.find((c) => c.id === activeId)
    : null;

  if (!contents || contents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 text-center text-gray-500 border rounded-lg"
      >
        No content available
      </motion.div>
    );
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
        items={localContents.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          <AnimatePresence>
            {localContents.map((content) => (
              <motion.div
                key={content.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <ContentItem
                  id={content.id}
                  title={content.title}
                  description={content.description!}
                  type={content.type}
                  date={content.createdAt}
                  order={content.order}
                  locked={content.lock}
                  onUnlock={() => onUnlock?.(content.id)}
                  onLock={() => onLock?.(content.id)}
                  onView={(id) => onView?.(id)}
                  onRename={(id, n, d) => onRename?.(id, n, d)}
                  onDelete={(id) => onDelete?.(id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      {/* Drag overlay with ghost style */}
      <DragOverlay>
        {activeItem ? (
          <div className="bg-card border border-border rounded-xl shadow-lg rotate-2 opacity-90">
            <ContentItem
              id={activeItem.id}
              title={activeItem.title}
              description={activeItem.description!}
              type={activeItem.type}
              date={activeItem.createdAt}
              onView={(id) => onView?.(id)}
              locked={activeItem.lock}
              onRename={() => {}}
              onDelete={() => {}}
              onUnlock={() => {}}
              onLock={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
