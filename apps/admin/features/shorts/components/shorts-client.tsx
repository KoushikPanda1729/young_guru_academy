"use client";
import React, { useState } from "react";
import { ShortsOutput } from "../helpers/shorts.schema";
import { IconBrandParsinta, IconPlus } from "@tabler/icons-react";
import { Header } from "@/components/dashboard/page-header";
import { useShorts } from "../hooks/useShorts";
import { Button } from "@t2p-admin/ui/components/button";
import { ShortsUploadSheet } from "@/features/course/components/upload-sheet";
import { api } from "@/lib/api";
import { toast } from "sonner";

import { ShortsPlayer } from "./shorts-player";
import { ShortsGrid } from "./shorts-grid";

export const ShortsClient = () => {
  const { data, total, isLoading, error, refetch, handleReorder } = useShorts({
    initialPageSize: 20,
    enabled: true,
  });

  console.log("Shorts error:", error);

  const [openUpload, setOpenUpload] = useState(false);
  const [editingShort, setEditingShort] = useState<ShortsOutput | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  const handleEditVideo = (videoId: string) => {
    const shortToEdit = data?.find((short) => short.videoId === videoId);
    if (shortToEdit) {
      setEditingShort(shortToEdit);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await api.shorts.deleteShortById({ id: videoId });
      toast.success("Short deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting short:", error);
      toast.error("Failed to delete short");
    }
  };

  const handlePlayVideo = (videoId: string) => {
    const index = data?.findIndex((short) => short.videoId === videoId) ?? 0;
    setCurrentVideoIndex(index);
    setPlayingVideoId(videoId);
  };

  const handleClosePlayer = () => {
    setPlayingVideoId(null);
  };

  const handlePreviousVideo = () => {
    if (data && currentVideoIndex > 0) {
      const newIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(newIndex);
      setPlayingVideoId(data[newIndex].videoId);
    }
  };

  const handleNextVideo = () => {
    if (data && currentVideoIndex < data.length - 1) {
      const newIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newIndex);
      setPlayingVideoId(data[newIndex].videoId);
    }
  };

  const currentShort = data?.find((short) => short.videoId === playingVideoId);

  return (
    <>
      <section className="pb-4">
        <Header
          icon={<IconBrandParsinta className="text-primary h-6 w-6" />}
          title={"Shorts Management"}
          description={`Upload, view and edit shorts ${total ? `• ${total} total shorts` : ""}`}
          onRefresh={refetch}
          refreshing={isLoading}
          actions={
            <Button onClick={() => setOpenUpload(true)}>
              <IconPlus className="h-4 w-4 mr-1" />
              Upload Short
            </Button>
          }
        />
      </section>

      {error ? (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="text-red-500 mb-4">
            <IconBrandParsinta className="h-16 w-16" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Shorts
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            There was an issue loading your shorts. Please try refreshing the
            page.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      ) : (
        <ShortsGrid
          shorts={data || []}
          isLoading={isLoading}
          onEditVideo={handleEditVideo}
          onDeleteVideo={handleDeleteVideo}
          onPlayVideo={handlePlayVideo}
          onReorder={handleReorder}
        />
      )}

      <ShortsUploadSheet
        open={openUpload || !!editingShort}
        onClose={() => {
          setOpenUpload(false);
          setEditingShort(null);
          refetch();
        }}
        editShort={editingShort}
      />

      {/* Shorts Player Modal */}
      {playingVideoId && currentShort && (
        <ShortsPlayer
          short={currentShort}
          onClose={handleClosePlayer}
          onPrevious={handlePreviousVideo}
          onNext={handleNextVideo}
          hasPrevious={currentVideoIndex > 0}
          hasNext={data ? currentVideoIndex < data.length - 1 : false}
        />
      )}
    </>
  );
};
