import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@t2p-admin/ui/lib/utils";
import { GripVertical, ExternalLink, PlayCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@t2p-admin/ui/components/button";
import { Banner } from "../helpers/banner.schema";
import {
  IconBook,
  IconTrophy,
  IconWorld,
  IconBrandYoutube,
} from "@tabler/icons-react";

interface SortableBannerItemProps {
  banner: Banner;
  isEditing: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

const typeConfig = {
  COURSE: {
    label: "Course",
    icon: IconBook,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  QUEST: {
    label: "Quest",
    icon: IconTrophy,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  EXTERNAL: {
    label: "External",
    icon: IconWorld,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  YOUTUBE: {
    label: "YouTube",
    icon: IconBrandYoutube,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
};

export function SortableBannerItem({
  banner,
  isEditing,
  onEdit,
  onRemove,
}: SortableBannerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = typeConfig[banner.type as keyof typeof typeConfig];
  const TypeIcon = config?.icon || IconWorld;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 rounded-lg border p-3 bg-card transition-all hover:shadow-md",
        isEditing && "ring-2 ring-primary shadow-md",
        isDragging && "opacity-50 shadow-xl scale-105"
      )}
    >
      {/* Editing Indicator */}
      {isEditing && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
          Editing
        </div>
      )}

      {/* Drag Handle */}
      <button
        type="button"
        className="hidden sm:block cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Content */}
      <div className="flex flex-1 items-start sm:items-center gap-3 min-w-0 w-full">
        {/* Banner Image */}
        <div className="relative shrink-0 group/img">
          <Image
            src={banner.image || "/placeholder-banner.png"}
            alt="Banner thumbnail"
            className="h-12 w-20 sm:h-14 sm:w-24 rounded-md object-cover bg-muted ring-1 ring-border"
            width={96}
            height={56}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-md flex items-center justify-center">
            <ExternalLink className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Banner Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h4 className="text-sm font-semibold truncate leading-tight">
              Untitled banner
            </h4>
          </div>

          {/* Type Badge and Target */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1.5">
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium w-fit",
                config?.bgColor,
                config?.color
              )}
            >
              <TypeIcon className="h-3 w-3" />
              {config?.label || banner.type}
            </div>

            {banner.target && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                {banner.target}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-row flex-col-reverse gap-1.5 shrink-0 ml-auto sm:ml-0">
          <Button
            size="sm"
            variant={isEditing ? "default" : "outline"}
            onClick={onEdit}
            className="h-8 text-xs px-3"
          >
            {isEditing ? "Editing" : "Edit"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRemove}
            className="h-8 text-xs px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Mobile Drag Handle */}
      <button
        type="button"
        className="sm:hidden absolute left-1/2 -translate-x-1/2 bottom-1 cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground transition-colors"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
    </li>
  );
}
