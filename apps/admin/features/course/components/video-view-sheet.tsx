// @/features/course/components/video-view-sheet.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@t2p-admin/ui/components/dialog";
import { Button } from "@t2p-admin/ui/components/button";
import { Video } from "lucide-react";
import { api } from "@/lib/api";
import { CourseContentType } from "../helpers/course.schema";
import { VideoOutputType } from "../helpers/folder.schema";
import Hls from "hls.js";

const getVideoUrl = (guid: string) =>
  `https://vz-89e3d251-e65.b-cdn.net/${guid}/playlist.m3u8`;

const getFallbackVideoUrl = (guid: string) =>
  `https://vz-89e3d251-e65.b-cdn.net/${guid}/play_720p.mp4`;

const getThumbnailUrl = (guid: string) =>
  `https://vz-89e3d251-e65.b-cdn.net/${guid}/thumbnail.jpg`;

interface VideoViewSheetProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  folderId: string;
  contentId: string;
  initialContent?: CourseContentType;
}

export function VideoViewSheet({
  open,
  onClose,
  courseId,
  folderId,
  contentId,
  initialContent,
}: VideoViewSheetProps) {
  const [content, setContent] = useState<CourseContentType | null>(initialContent || null);
  const [video, setVideo] = useState<VideoOutputType["video"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const initializeHls = (guid: string) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const hlsUrl = getVideoUrl(guid);
    const fallbackUrl = getFallbackVideoUrl(guid);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.ERROR, (_, data) => {
  if (!data) return;

  // Only log fatal errors for clarity
  if (data.fatal) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        console.warn("Network error, trying to recover...");
        hls.startLoad();
        break;
      case Hls.ErrorTypes.MEDIA_ERROR:
        console.warn("Media error, trying to recover...");
        hls.recoverMediaError();
        break;
      default:
        console.error("Unrecoverable HLS error, switching to fallback video");
        if (videoRef.current) videoRef.current.src = getFallbackVideoUrl(video?.guid || "");
    }
  } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
    // Non-fatal media errors (like buffer gaps) - optional logging
    console.warn("HLS media warning:", data.details);
  }
});


      hlsRef.current = hls;
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = hlsUrl;
    } else {
      videoElement.src = fallbackUrl;
    }
  };

  useEffect(() => {
    if (!open) return;

    const fetchVideoDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.courses.folder.content.getVideo({
          id: courseId,
          folderId,
          contentId,
        });

        if (!res.data) {
          setError("Video details not found.");
          return;
        }

        const { video: newVideo, ...rest } = res.data;
        setContent(rest);
        setVideo(newVideo);

        if (newVideo?.guid) {
          initializeHls(newVideo.guid);
        } else {
          setError("Video GUID not found for this content.");
        }
      } catch (err) {
        console.error("Error fetching video details:", err);
        setError("Failed to load video. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [open, courseId, folderId, contentId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {content?.title || "View Video"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {content?.description || "No description provided."}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-black flex items-center justify-center relative">
          {loading && (
            <div className="absolute text-white">Loading video...</div>
          )}
          {error && (
            <div className="absolute text-destructive text-center px-4">
              {error}
            </div>
          )}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            autoPlay
            playsInline
            poster={video?.guid ? getThumbnailUrl(video.guid) : undefined}
          />
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-end gap-2 flex-shrink-0">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
