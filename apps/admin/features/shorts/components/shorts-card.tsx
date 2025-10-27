import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@t2p-admin/ui/components/alert-dialog";
import { ShortsOutput } from "../helpers/shorts.schema";

import { Heart, MessageCircle, Play, GripVertical } from "lucide-react";

import { Card, CardHeader } from "@t2p-admin/ui/components/card";
import Image from "next/image";
import { Button } from "@t2p-admin/ui/components/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@t2p-admin/ui/lib/utils";

interface SortableShortCardProps {
  video: ShortsOutput;
  onEditVideo: (videoId: string) => void;
  onDeleteVideo: (videoId: string) => void;
  onPlayVideo: (videoId: string) => void;
  getThumbnailUrl: (videoId: string) => string;
  isDragging?: boolean;
}

export const SortableShortCard = ({
  video,
  onEditVideo,
  onDeleteVideo,
  onPlayVideo,
  getThumbnailUrl,
  isDragging = false,
}: SortableShortCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: video.videoId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "overflow-hidden hover:shadow-lg transition-all duration-200 group pt-0 relative",
        isSortableDragging && "shadow-2xl ring-2 ring-primary z-50"
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 bg-black/60 hover:bg-black/80 rounded-lg p-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4 text-white" />
      </div>

      <div
        className="relative aspect-[9/16] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer"
        onClick={() => onPlayVideo(video.videoId)}
      >
        <Image
          src={getThumbnailUrl(video.videoId)}
          alt={video.title}
          width={250}
          height={500}
          className="w-full h-full object-cover"
          unoptimized={true}
          onError={(e) => {
            console.error("Image loading error for videoId:", video.videoId);
            console.error("Attempted URL:", getThumbnailUrl(video.videoId)); // Log the problematic URL
            console.error("Synthetic event:", e);
            // You can also access the native event for more details if needed:
            console.error("Native event:", e.nativeEvent);
          }}
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-16 hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white ml-1 fill-white" />
          </div>
        </div>

        {/* Action buttons overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="backdrop-blur-sm bg-white/90 hover:bg-white text-black"
              onClick={(e) => {
                e.stopPropagation();
                onEditVideo(video.videoId);
              }}
              title="Edit Video"
            >
              <IconEdit className="h-4 w-4 mr-1" />
              Edit
            </Button>

            {/* Delete with AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  className="backdrop-blur-sm bg-red-600/90 hover:bg-red-600"
                  title="Delete Video"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconTrash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Short?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the short video <b>{video.title}</b>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => onDeleteVideo(video.videoId)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Video stats overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-black/70 transition-colors">
            <Heart className="w-3.5 h-3.5" />
            <span className="font-medium">{video.likesCount}</span>
          </div>
          <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-black/70 transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="font-medium">{video.commentsCount}</span>
          </div>
        </div>

        {/* Order badge */}
        <div className="absolute bottom-2 left-2 bg-primary/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-semibold">
          #{video.order || 0}
        </div>
      </div>

      <CardHeader className="pb-2 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 leading-tight hover:text-primary transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-green-500"></span>
            {new Date(video.createdAt).toLocaleDateString()}
          </span>
          {video.duration && (
            <span className="font-medium text-primary">{video.duration}s</span>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};
