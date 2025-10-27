import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@t2p-admin/ui/components/avatar";
import { IconBrandParsinta } from "@tabler/icons-react";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  Share,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import Hls from "hls.js";

import { ShortsOutput } from "../helpers/shorts.schema";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ShortsPlayerProps {
  short: ShortsOutput;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "US";

export const ShortsPlayer = ({
  short,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: ShortsPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(short.commentedBy);
  const [showControls, setShowControls] = useState(false);
  const [likesCount, setLikesCount] = useState(short.likesCount);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const componentMountedRef = useRef(true);
  const autoPlayAttemptedRef = useRef(false);

  const getVideoUrl = (videoId: string) =>
    `https://vz-89e3d251-e65.b-cdn.net/${videoId}/playlist.m3u8`;
  const getFallbackVideoUrl = (videoId: string) =>
    `https://vz-89e3d251-e65.b-cdn.net/${videoId}/play_720p.mp4`;
  const getThumbnailUrl = (videoId: string) =>
    `https://vz-89e3d251-e65.b-cdn.net/${videoId}/thumbnail.jpg`;

  const safePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !componentMountedRef.current || !isVideoReady) return;

    try {
      setError(null);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        await playPromise;
        setIsPlaying(true);
        console.log("Video started playing successfully");
      }
    } catch (error) {
      console.error("Video play failed:", error);
      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            console.warn("Autoplay was prevented. User interaction required.");
            setIsPlaying(false);
            setError("Click to play - autoplay prevented");
            break;
          case "AbortError":
            console.warn("Video play was aborted.");
            break;
          case "NotSupportedError":
            setError("Video format not supported");
            break;
          default:
            setError("Failed to play video");
        }
      }
    }
  }, [isVideoReady]);

  const safePause = useCallback(() => {
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
      setIsPlaying(false);
      console.log("Video paused");
    }
  }, []);

  // Initialize HLS and handle video source
  const initializeVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !componentMountedRef.current) return;

    console.log("Initializing video for:", short.videoId);
    setIsLoading(true);
    setError(null);
    setIsVideoReady(false);
    autoPlayAttemptedRef.current = false;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const hlsUrl = getVideoUrl(short.videoId);
    const fallbackUrl = getFallbackVideoUrl(short.videoId);

    // Set initial video properties
    video.muted = isMuted;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";

    // Add video event listeners
    const handleLoadedData = () => {
      if (componentMountedRef.current) {
        console.log("Video loaded data event fired");
        setIsLoading(false);
        setIsVideoReady(true);
      }
    };

    const handleCanPlay = () => {
      if (componentMountedRef.current) {
        console.log("Video can play event fired");
        setIsLoading(false);
        setIsVideoReady(true);

        // Attempt autoplay once video is ready
        if (!autoPlayAttemptedRef.current) {
          autoPlayAttemptedRef.current = true;
          setTimeout(() => {
            if (componentMountedRef.current && !isPlaying) {
              console.log("Attempting autoplay...");
              safePlay();
            }
          }, 100);
        }
      }
    };

    const handlePlay = () => {
      if (componentMountedRef.current) {
        setIsPlaying(true);
      }
    };

    const handlePause = () => {
      if (componentMountedRef.current) {
        setIsPlaying(false);
      }
    };

    const handleVideoError = (e: Event) => {
      console.error("Video element error:", e);
      if (componentMountedRef.current) {
        setError("Video playback error");
        setIsLoading(false);
      }
    };

    // Add event listeners
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleVideoError);

    if (Hls.isSupported()) {
      try {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 300,
          startLevel: -1, // Auto quality selection
        });

        hlsRef.current = hls;
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (componentMountedRef.current) {
            console.log("HLS manifest parsed successfully");
            // Don't set loading to false here, wait for canplay event
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);

          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log("Network error, attempting to recover...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("Media error, attempting to recover...");
                hls.recoverMediaError();
                break;
              default:
                console.log("Fatal error, falling back to MP4");
                if (componentMountedRef.current) {
                  // Clean up HLS and fallback to MP4
                  hls.destroy();
                  hlsRef.current = null;
                  video.src = fallbackUrl;
                  setError("Streaming failed, using fallback");
                }
                break;
            }
          }
        });
      } catch (error) {
        console.error("HLS initialization failed:", error);
        if (componentMountedRef.current) {
          video.src = fallbackUrl;
          setError("Streaming unavailable, using fallback");
        }
      }
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      console.log("Using native HLS support");
      video.src = hlsUrl;
    } else {
      // No HLS support, using MP4 fallback
      console.log("No HLS support, using MP4 fallback");
      video.src = fallbackUrl;
      setError("HLS not supported, using MP4");
    }
  }, [short.videoId, isMuted, safePlay, isPlaying]);

  // Initialize video when component mounts or video changes
  useEffect(() => {
    componentMountedRef.current = true;
    initializeVideo();

    return () => {
      componentMountedRef.current = false;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }
    };
  }, [short.videoId]);

  // Reset states when short changes
  useEffect(() => {
    setIsLiked(false);
    setComments(short.commentedBy);
    setLikesCount(short.likesCount);
    setNewComment("");
    setIsPlaying(false);
    setError(null);
    setIsVideoReady(false);
    autoPlayAttemptedRef.current = false;
  }, [short]);

  // Handle mute state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Event handlers
  const togglePlayPause = useCallback(() => {
    if (isLoading || !isVideoReady) {
      console.log("Video not ready for play/pause");
      return;
    }

    console.log("Toggling play/pause, current state:", isPlaying);
    if (isPlaying) {
      safePause();
    } else {
      safePlay();
    }
  }, [isLoading, isVideoReady, isPlaying, safePause, safePlay]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      // API call would go here
      toast.success(isLiked ? "Removed from likes" : "Added to likes");
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
      // Revert state on error
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = {
        id: `user${Date.now()}`,
        name: "You",
        image:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
        content: newComment,
        createdAt: new Date(),
      };

      setComments([comment, ...comments]);
      setNewComment("");
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case " ":
        e.preventDefault();
        togglePlayPause();
        break;
      case "ArrowUp":
        e.preventDefault();
        if (hasPrevious && onPrevious) onPrevious();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (hasNext && onNext) onNext();
        break;
      case "Escape":
        onClose();
        break;
      case "m":
      case "M":
        e.preventDefault();
        toggleMute();
        break;
    }
  };

  // Utility functions
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Navigation arrows */}
      {hasPrevious && onPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-full p-3 text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      {hasNext && onNext && (
        <button
          onClick={onNext}
          className="absolute right-96 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-full p-3 text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 rotate-180" />
        </button>
      )}

      {/* Video Section - Left Side */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onClick={togglePlayPause}
        >
          {/* Video Player */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            muted={isMuted}
            autoPlay
            poster={getThumbnailUrl(short.videoId)}
          />

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                <p>Loading video...</p>
                <p className="text-xs mt-2 text-white/70">
                  Video ID: {short.videoId}
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center max-w-md p-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <X className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-lg font-medium mb-2">
                  {error.includes("autoplay")
                    ? "Click to Play"
                    : "Playback Issue"}
                </p>
                <p className="text-sm text-white/80 mb-4">{error}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (error.includes("autoplay")) {
                      safePlay();
                    } else {
                      initializeVideo();
                    }
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {error.includes("autoplay") ? "Play Video" : "Retry"}
                </button>
              </div>
            </div>
          )}

          {/* Video Controls Overlay */}
          {showControls && !isLoading && !error && isVideoReady && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </div>
            </div>
          )}

          {/* Status indicator for debugging */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 rounded px-3 py-1 text-xs text-white">
              Loading: {isLoading.toString()} | Ready: {isVideoReady.toString()}{" "}
              | Playing: {isPlaying.toString()}
            </div>
          )}

          {/* Mute Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          {/* Creator Info Overlay */}
          <div className="absolute bottom-6 left-6 text-white max-w-md">
            <h2 className="text-xl font-semibold mb-2">{short.title}</h2>
            {short.description && (
              <p className="text-sm text-white/90 mb-3">{short.description}</p>
            )}
            <div className="flex items-center text-xs text-white/70">
              <span>{formatTime(short.createdAt)}</span>
              {short.duration && (
                <>
                  <span className="mx-2">•</span>
                  <span>{short.duration}s</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments and Actions Section - Right Side */}
      <div className="w-80 bg-black text-white flex flex-col border-l border-gray-800">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <IconBrandParsinta className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Admin</p>
                <p className="text-xs text-gray-400">
                  Video ID: {short.videoId}
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-around py-4 border-b border-gray-800">
          <button
            onClick={handleLike}
            className={`flex flex-col items-center gap-1 ${isLiked ? "text-red-500" : "text-white hover:text-red-500"} transition-colors`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-xs">{formatNumber(likesCount)}</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white hover:text-blue-500 transition-colors">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs">{formatNumber(comments.length)}</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-white hover:text-green-500 transition-colors">
            <Share className="w-6 h-6" />
            <span className="text-xs">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <p className="text-sm font-semibold mb-4">
              {comments.length} comments
            </p>

            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet</p>
                <p className="text-sm">Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={comment.image ?? ""}
                        alt={comment.name}
                      />
                      <AvatarFallback>
                        {getInitials(comment.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white">
                          {comment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
            >
              Post
            </button>
          </div>
        </div>

        {/* Keyboard shortcuts help */}
        <div className="p-2 bg-gray-900/50 text-xs text-gray-400 text-center">
          <p>Space: Play/Pause • M: Mute • ↑↓: Navigate • Esc: Close</p>
        </div>
      </div>
    </div>
  );
};
