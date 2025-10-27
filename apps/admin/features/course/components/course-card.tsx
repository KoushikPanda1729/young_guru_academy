"use client";
import React, { memo, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@t2p-admin/ui/lib/utils";
import { Button } from "@t2p-admin/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@t2p-admin/ui/components/card";
import {
  Clock,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Star,
  CheckCircle2,
  FileEdit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@t2p-admin/ui/components/dropdown-menu";
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
import { formatPrice } from "../helpers/format-price";
import { api } from "@/lib/api";
import { IconSend } from "@tabler/icons-react";
import { Badge } from "@t2p-admin/ui/components/badge";
import { Skeleton } from "@t2p-admin/ui/components/skeleton";
import { motion } from "motion/react";
import { CourseType } from "../helpers/course.schema";
import { Separator } from "@t2p-admin/ui/components/separator";

type CourseCardProps = {
  course: CourseType;
  showActions?: boolean;
  onEdit?: (courseId: string) => void;
  onView?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  onPublish?: (courseId: string) => void;
  onUnpublish?: (courseId: string) => void;
  onPopular?: (courseId: string) => void;
  onUnpopular?: (courseId: string) => void;
};

function formatDuration(
  value: number | null,
  unit: "days" | "months" | "years" | "lifetime"
) {
  if (unit === "lifetime") return "Lifetime";
  if (value === null) return null;
  return `${value} ${unit}`;
}

// Optimized image placeholder component
const ImagePlaceholder = memo(() => (
  <div className="w-full h-full bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center transition-colors duration-200">
    <div className="text-center text-muted-foreground">
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center backdrop-blur-sm">
        <ImageIcon className="w-10 h-10 text-primary/40" />
      </div>
      <span className="text-sm font-medium">No Preview Available</span>
    </div>
  </div>
));
ImagePlaceholder.displayName = "ImagePlaceholder";

// Course image component with loading states
const CourseImage = memo<{
  src: string | null;
  alt: string;
  course: CourseCardProps["course"];
}>(({ src, alt, course }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-muted">
      {/* Image loading skeleton */}
      {imageLoading && <Skeleton className="absolute inset-0 w-full h-full" />}

      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-all duration-700 ease-out",
            "group-hover:scale-110",
            imageLoading && "opacity-0"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={false}
        />
      ) : (
        <ImagePlaceholder />
      )}

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Status & Popular badges */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={course.isPublished ? "default" : "secondary"}
            className={cn(
              "backdrop-blur-md border font-semibold text-xs shadow-lg transition-all duration-300",
              course.isPublished
                ? "bg-emerald-500/95 hover:bg-emerald-600 text-white border-emerald-400/50 shadow-emerald-500/20"
                : "bg-slate-700/95 hover:bg-slate-800 text-slate-100 border-slate-600/50"
            )}
          >
            {course.isPublished ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Published
              </>
            ) : (
              <>
                <FileEdit className="w-3 h-3 mr-1" />
                Draft
              </>
            )}
          </Badge>

          {course.popular && (
            <Badge
              variant="default"
              className="backdrop-blur-md bg-amber-500/95 hover:bg-amber-600 text-white border border-amber-400/50 shadow-lg shadow-amber-500/20 font-semibold text-xs transition-all duration-300"
            >
              <Star className="w-3 h-3 mr-1 fill-current" />
              Popular
            </Badge>
          )}
        </div>

        {(course.durationValue !== null ||
          course.durationUnit === "lifetime") && (
          <Badge
            variant="outline"
            className="backdrop-blur-md bg-black/70 hover:bg-black/80 text-white border-white/30 shadow-lg font-medium text-xs transition-all duration-300"
          >
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(course.durationValue, course.durationUnit)}
          </Badge>
        )}
      </div>
    </div>
  );
});
CourseImage.displayName = "CourseImage";

// Price component with enhanced styling
const CoursePrice = memo<{ course: CourseCardProps["course"] }>(
  ({ course }) => {
    const hasDiscount = useMemo(
      () => course.mrp && course.price && course.mrp > course.price,
      [course.mrp, course.price]
    );

    const discountPercentage = useMemo(
      () =>
        hasDiscount
          ? Math.round(((course.mrp! - course.price!) / course.mrp!) * 100)
          : 0,
      [hasDiscount, course.mrp, course.price]
    );

    if (
      course.price === null ||
      course.price === undefined ||
      course.price === 0
    ) {
      return (
        <Badge className="text-sm font-bold px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-sm">
          Free Course
        </Badge>
      );
    }

    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          {formatPrice(course.price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-sm line-through text-muted-foreground/70">
              {formatPrice(course.mrp!)}
            </span>
            <Badge className="text-xs px-2 py-0.5 bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 font-bold shadow-sm">
              {discountPercentage}% OFF
            </Badge>
          </>
        )}
      </div>
    );
  }
);
CoursePrice.displayName = "CoursePrice";

export const CourseCard = memo<CourseCardProps>(
  ({
    course,
    showActions = false,
    onEdit,
    onView,
    onDelete,
    onPublish,
    onUnpublish,
    onPopular,
    onUnpopular,
  }) => {
    const [signedBannerUrl, setSignedBannerUrl] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    React.useEffect(() => {
      let mounted = true;

      const getSignedUrl = async () => {
        if (course.thumbnail && typeof course.thumbnail === "string") {
          try {
            const res = await api.quest.getSignedUrl({
              type: "get",
              key: course.thumbnail,
            });
            if (mounted && res.data?.url) {
              setSignedBannerUrl(res.data.url);
            }
          } catch (error) {
            console.error("Failed to get signed banner URL", error);
            if (mounted) {
              setSignedBannerUrl(null);
            }
          }
        }
      };

      getSignedUrl();

      return () => {
        mounted = false;
      };
    }, [course.thumbnail]);

    // Memoized handlers
    const handleEdit = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onEdit?.(course.id);
      },
      [onEdit, course.id]
    );

    const handleView = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onView?.(course.id);
      },
      [onView, course.id]
    );

    const handlePublish = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onPublish?.(course.id);
      },
      [onPublish, course.id]
    );

    const handleUnpublish = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onUnpublish?.(course.id);
      },
      [onUnpublish, course.id]
    );

    const handlePopular = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onPopular?.(course.id);
      },
      [onPopular, course.id]
    );

    const handleUnpopular = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onUnpopular?.(course.id);
      },
      [onUnpopular, course.id]
    );

    const handleDelete = useCallback(() => {
      onDelete?.(course.id);
      setIsDeleteDialogOpen(false);
    }, [onDelete, course.id]);

    const handleDropdownClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    }, []);

    const courseLink = `/dashboard/courses/my-courses/${course.id}`;
    const truncatedDescription = useMemo(
      () =>
        course.description && course.description.length > 120
          ? course.description.substring(0, 120) + "..."
          : course.description,
      [course.description]
    );

    return (
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="h-full"
      >
        <Card className="group w-full h-full max-w-[340px] mx-auto rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-card border border-border/50 hover:border-primary/20 flex flex-col py-0">
          {/* Clickable Thumbnail */}
          <Link href={courseLink} className="block flex-shrink-0">
            <CardContent className="p-0 relative overflow-hidden cursor-pointer">
              <CourseImage
                src={signedBannerUrl}
                alt={`${course.title} course thumbnail`}
                course={course}
              />
            </CardContent>
          </Link>

          {/* Content Section */}
          <div className="pt-0 px-5 pb-3 space-y-2 flex-grow flex flex-col">
            <CardHeader className="p-0 space-y-3 flex-grow">
              <Link href={courseLink}>
                <CardTitle className="cursor-pointer text-lg font-bold line-clamp-2 hover:text-primary transition-colors duration-300 leading-snug">
                  {course.title}
                </CardTitle>
              </Link>

              {truncatedDescription && (
                <CardDescription className="text-sm line-clamp-3 leading-relaxed text-muted-foreground/80">
                  {truncatedDescription}
                </CardDescription>
              )}
            </CardHeader>

            <Separator className="my-1" />

            {/* Footer */}
            <CardFooter className="p-0 pt-1">
              <div className="flex items-center justify-between w-full gap-3">
                <CoursePrice course={course} />

                {/* Actions Dropdown */}
                {showActions && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 flex-shrink-0"
                        onClick={handleDropdownClick}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-semibold">
                        Course Actions
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {onView && (
                        <DropdownMenuItem
                          onClick={handleView}
                          className="cursor-pointer gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                      )}

                      {onEdit && (
                        <DropdownMenuItem
                          onClick={handleEdit}
                          className="cursor-pointer gap-2"
                        >
                          <Pencil className="w-4 h-4" />
                          <span>Edit Course</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      {/* Publish / Unpublish */}
                      {course.isPublished
                        ? onUnpublish && (
                            <DropdownMenuItem
                              onClick={handleUnpublish}
                              className="cursor-pointer gap-2"
                            >
                              <IconSend className="w-4 h-4" />
                              <span>Unpublish Course</span>
                            </DropdownMenuItem>
                          )
                        : onPublish && (
                            <DropdownMenuItem
                              onClick={handlePublish}
                              className="cursor-pointer gap-2"
                            >
                              <IconSend className="w-4 h-4" />
                              <span>Publish Course</span>
                            </DropdownMenuItem>
                          )}

                      {/* Popular / Unpopular */}
                      {course.popular
                        ? onUnpopular && (
                            <DropdownMenuItem
                              onClick={handleUnpopular}
                              className="cursor-pointer gap-2"
                            >
                              <Star className="w-4 h-4" />
                              <span>Remove from Popular</span>
                            </DropdownMenuItem>
                          )
                        : onPopular && (
                            <DropdownMenuItem
                              onClick={handlePopular}
                              className="cursor-pointer gap-2 text-amber-600 focus:text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-950"
                            >
                              <Star className="w-4 h-4 fill-current" />
                              <span>Mark as Popular</span>
                            </DropdownMenuItem>
                          )}

                      {/* Delete */}
                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Course</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardFooter>
          </div>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete &quot;{course.title}&quot;?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                course and remove all of its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Delete Course
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    );
  }
);

CourseCard.displayName = "CourseCard";
