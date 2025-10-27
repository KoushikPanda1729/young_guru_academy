"use client";

import React, { useMemo, useState } from "react";
import { Header } from "../../../components/dashboard/page-header";
import { IconFlag2Filled } from "@tabler/icons-react";
import { BannerForm } from "./banner-form";
import BannerPreview from "./banner-preview";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@t2p-admin/ui/components/card";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SortableBannerItem } from "./banner-item";
import { useBanner } from "../hooks/useBanner";
import type { Banner } from "../helpers/banner.schema";
import { useCourseOptions } from "../../course/hooks/useCourseOptions";
import { useQuestOptions } from "../../quest/hooks/useQuestOptions";

export default function BannerClient() {
  const {
    banners,
    isLoading,
    createBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
  } = useBanner();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { options: courseOptions } = useCourseOptions();
  const { options: questOptions } = useQuestOptions();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const editingBanner = useMemo(() => {
    return editingIndex !== null ? banners?.[editingIndex] : undefined;
  }, [editingIndex, banners]);

  const handleAdd = (banner: Banner) => {
    createBanner.mutate(
      { image: banner.image, type: banner.type, target: banner.target },
      { onSuccess: () => setEditingIndex(null) }
    );
  };

  const handleUpdate = (banner: Banner) => {
    if (!editingBanner) return;
    updateBanner.mutate(
      {
        params: { id: editingBanner.id },
        body: { image: banner.image, type: banner.type, target: banner.target },
      },
      { onSuccess: () => setEditingIndex(null) }
    );
  };

  const handleRemove = (index: number) => {
    const banner = banners![index];
    if (!banner) return;
    deleteBanner.mutate(
      { id: banner.id },
      { onSuccess: () => editingIndex === index && setEditingIndex(null) }
    );
  };

  const startEdit = (index: number) => setEditingIndex(index);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!banners || !over || active.id === over.id) return;

    const oldIndex = banners.findIndex((b) => b.id === active.id);
    const newIndex = banners.findIndex((b) => b.id === over.id);

    const reordered = arrayMove(banners, oldIndex, newIndex);

    reorderBanners.mutate(
      { orders: reordered.map((b, i) => ({ id: b.id, order: i + 1 })) },
      {
        onSuccess: () =>
          setEditingIndex((prev) => {
            if (prev === null) return null;
            if (oldIndex === prev) return newIndex;
            if (oldIndex < prev && newIndex >= prev) return prev - 1;
            if (oldIndex > prev && newIndex <= prev) return prev + 1;
            return prev;
          }),
      }
    );
  };

  return (
    <>
      <section>
        <Header
          title="Banners"
          description="Create and manage promotional banners for your platform."
          icon={<IconFlag2Filled className="h-6 w-6 text-primary" />}
        />
      </section>
      <section>
        <div className="p-4 lg:p-6">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,480px)]">
            {/* Left: Form + list */}
            <div className="space-y-6">
              <Card>
                <CardContent>
                  <BannerForm
                    key={editingBanner?.id ?? "new"}
                    initialValue={editingBanner}
                    onAdd={handleAdd}
                    onUpdate={handleUpdate}
                    courseOptions={courseOptions}
                    questOptions={questOptions}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Banners</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Drag and drop to reorder banners
                  </p>
                </CardHeader>
                <CardContent>
                  {isLoading || !banners ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : banners.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No banners yet.
                    </p>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={banners.map((b) => b.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <ul className="grid gap-3">
                          {banners.map((b, i) => (
                            <SortableBannerItem
                              key={b.id}
                              banner={b}
                              isEditing={editingIndex === i}
                              onEdit={() => startEdit(i)}
                              onRemove={() => handleRemove(i)}
                            />
                          ))}
                        </ul>
                      </SortableContext>
                    </DndContext>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Preview */}
            <div>
              <BannerPreview banners={banners || []} orientation="horizontal" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
