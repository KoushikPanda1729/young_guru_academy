import { ShortsOutput } from "../helpers/shorts.schema";

import { Card, CardHeader } from "@t2p-admin/ui/components/card";
import Image from "next/image";
import { Button } from "@t2p-admin/ui/components/button";
import { IconBrandParsinta, IconPlus } from "@tabler/icons-react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableShortCard } from "./shorts-card";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

export const ShortsGrid = ({
  shorts,
  isLoading,
  onEditVideo,
  onDeleteVideo,
  onPlayVideo,
  onReorder,
}: {
  shorts: ShortsOutput[];
  isLoading: boolean;
  onEditVideo: (videoId: string) => void;
  onDeleteVideo: (videoId: string) => void;
  onPlayVideo: (videoId: string) => void;
  onReorder?: (reorderedShorts: ShortsOutput[]) => void;
}) => {
  const [localShorts, setLocalShorts] = useState(shorts);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Update local shorts when props change
  useEffect(() => {
    setLocalShorts(shorts);
  }, [shorts]);

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

  const getThumbnailUrl = (videoId: string) => {
    return `https://vz-89e3d251-e65.b-cdn.net/${videoId}/thumbnail.jpg`;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalShorts((items) => {
        const oldIndex = items.findIndex((item) => item.videoId === active.id);
        const newIndex = items.findIndex((item) => item.videoId === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update order property
        const reorderedItems = newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        // Call the onReorder callback
        if (onReorder) {
          onReorder(reorderedItems);
        }

        return reorderedItems;
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="aspect-[9/16] bg-gradient-to-br from-gray-200 to-gray-300" />
            <CardHeader className="pb-2 space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="flex justify-between pt-1">
                <div className="h-3 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-200 rounded w-12" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!localShorts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="rounded-full bg-primary/10 p-6 mb-6">
          <IconBrandParsinta className="h-16 w-16 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Shorts Yet</h3>
        <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
          Get started by uploading your first short video. Create engaging
          vertical content that captures your audience&apos;s attention.
        </p>
        <Button size="lg" className="gap-2">
          <IconPlus className="h-5 w-5" />
          Upload Your First Short
        </Button>
      </div>
    );
  }

  const activeShort = localShorts.find((s) => s.videoId === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={localShorts.map((s) => s.videoId)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6">
          {localShorts.map((video) => (
            <SortableShortCard
              key={video.videoId}
              video={video}
              onEditVideo={onEditVideo}
              onDeleteVideo={onDeleteVideo}
              onPlayVideo={onPlayVideo}
              getThumbnailUrl={getThumbnailUrl}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId && activeShort ? (
          <Card className="overflow-hidden shadow-2xl ring-2 ring-primary opacity-90 w-[250px]">
            <div className="relative aspect-[9/16] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <Image
                src={getThumbnailUrl(activeShort.videoId)}
                alt={activeShort.title}
                width={250}
                height={500}
                className="w-full h-full object-cover"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <CardHeader className="pb-2">
              <h3 className="font-semibold text-sm line-clamp-2">
                {activeShort.title}
              </h3>
            </CardHeader>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
