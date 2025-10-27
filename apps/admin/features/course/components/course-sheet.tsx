"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@t2p-admin/ui/components/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@t2p-admin/ui/components/form";
import { Input } from "@t2p-admin/ui/components/input";
import { Textarea } from "@t2p-admin/ui/components/textarea";
import { Button } from "@t2p-admin/ui/components/button";
import { Badge } from "@t2p-admin/ui/components/badge";
import { Separator } from "@t2p-admin/ui/components/separator";
import {
  IconEdit,
  IconEye,
  IconLoader2,
  IconX,
  IconUsers,
  IconClock,
  IconStar,
  IconBook,
} from "@tabler/icons-react";
import {
  CreateCourseSchema,
  CourseType,
  createCourseType,
} from "../helpers/course.schema";
import Image from "next/image";
import { api } from "../../../lib/api";
import { cn } from "@t2p-admin/ui/lib/utils";
import { formatPrice } from "../helpers/format-price";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@t2p-admin/ui/components/select";

interface CourseSheetProps {
  course: CourseType | null;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "create";
  onModeChange: (mode: "view" | "edit") => void;
  onSave: (data: createCourseType) => Promise<void>;
  isLoading?: boolean;
}

export function CourseSheet({
  course,
  isOpen,
  onClose,
  mode,
  onModeChange,
  onSave,
  isLoading = false,
}: CourseSheetProps) {
  const form = useForm<createCourseType>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      title: "",
      slug: "",
      duration: {
        value: null,
        unit: "days",
      },
      description: "",
      thumbnail: null,
      mrp: 0,
      price: 0,
      isPublished: false,
    },
  });

  React.useEffect(() => {
    if (mode === "create") {
      form.reset({
        title: "",
        slug: "",
        duration: {
          value: null,
          unit: "days",
        },
        description: "",
        thumbnail: undefined,
        mrp: 0,
        price: 0,
        isPublished: false,
      });
    } else if (course) {
      form.reset({
        title: course.title,
        slug: course.slug,
        description: course.description || "",
        thumbnail: course.thumbnail,
        mrp: course.mrp,
        price: course.price,
        isPublished: course.isPublished,
        duration: {
          value: course.durationValue || null,
          unit: course.durationUnit || null,
        },
      });
    }
  }, [course, form, mode]);

  const handleSubmit = async (data: createCourseType) => {
    try {
      await onSave(data);
      onModeChange("view");
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!course && mode !== "create") return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-[650px] overflow-y-auto px-0">
        <div className="px-6 py-4">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    mode === "view"
                      ? "bg-blue-100 dark:bg-blue-950"
                      : "bg-purple-100 dark:bg-purple-950"
                  )}
                >
                  {mode === "view" ? (
                    <IconEye className="size-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <IconEdit className="size-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <div>
                  <SheetTitle className="text-xl font-bold">
                    {mode === "view"
                      ? "Course Details"
                      : mode === "edit"
                        ? "Edit Course"
                        : "Create New Course"}
                  </SheetTitle>
                  <SheetDescription className="text-xs mt-0.5">
                    {mode === "view"
                      ? "View comprehensive course information"
                      : mode === "edit"
                        ? "Modify course details and save changes"
                        : "Add a new course to your collection"}
                  </SheetDescription>
                </div>
              </div>

              {mode !== "create" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onModeChange(mode === "view" ? "edit" : "view")
                  }
                  className="gap-2 h-9"
                >
                  {mode === "view" ? (
                    <>
                      <IconEdit className="size-4" />
                      Edit
                    </>
                  ) : (
                    <>
                      <IconX className="size-4" />
                      Cancel
                    </>
                  )}
                </Button>
              )}
            </div>
          </SheetHeader>
        </div>

        <Separator />

        <div className="px-6 py-6">
          {mode === "view" ? (
            <CourseViewMode course={course!} />
          ) : (
            <CourseEditMode
              form={form}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isCreateMode={mode === "create"}
              onSuccess={handleClose}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ------------------------ View Mode ------------------------
export function CourseViewMode({ course }: { course: CourseType }) {
  const [signedBannerUrl, setSignedBannerUrl] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    const getSignedUrl = async () => {
      if (course.thumbnail && typeof course.thumbnail === "string") {
        try {
          const res = await api.quest.getSignedUrl({
            type: "get",
            key: course.thumbnail,
          });
          if (res.data?.url) {
            setSignedBannerUrl(res.data.url);
          } else {
            setSignedBannerUrl(null);
          }
        } catch (error) {
          console.error("Failed to get signed banner URL", error);
          setSignedBannerUrl(null);
        }
      }
    };

    getSignedUrl();
  }, [course.thumbnail]);

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge
          variant={course.isPublished ? "default" : "secondary"}
          className="px-3 py-1 text-xs font-medium"
        >
          {course.isPublished ? "Published" : "Draft"}
        </Badge>
        {course.popular && (
          <Badge
            variant="outline"
            className="px-3 py-1 text-xs font-medium border-amber-500 text-amber-700 dark:text-amber-400"
          >
            Popular
          </Badge>
        )}
      </div>

      {/* Thumbnail */}
      {signedBannerUrl && (
        <div className="relative w-full h-56 rounded-xl overflow-hidden border bg-muted">
          <Image
            src={signedBannerUrl}
            alt={course.title}
            className="w-full h-full object-cover"
            width={600}
            height={350}
          />
        </div>
      )}

      {/* Title & Description */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {course.description || "No description provided"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <IconUsers className="size-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-900 dark:text-blue-300">
              Students
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {course.totalStudents.toLocaleString()}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-1">
            <IconBook className="size-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-900 dark:text-purple-300">
              Lessons
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
            {course.totalLessons}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-1">
            <IconStar className="size-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-amber-900 dark:text-amber-300">
              Likes
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
            {course.likesCount ? course.likesCount : 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-1">
            <IconClock className="size-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-900 dark:text-green-300">
              Duration
            </span>
          </div>
          <p className="text-lg font-bold text-green-700 dark:text-green-400">
            {course.durationUnit === "lifetime"
              ? "Lifetime"
              : course.durationValue
                ? `${course.durationValue} ${course.durationUnit}`
                : "N/A"}
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-muted/50 p-5 rounded-xl border">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Pricing
        </h3>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-foreground">
            {formatPrice(course.price)}
          </span>
          {course.mrp && course.mrp > course.price && (
            <>
              <span className="text-lg line-through text-muted-foreground">
                {formatPrice(course.mrp)}
              </span>
              <Badge variant="secondary" className="text-xs">
                {Math.round(((course.mrp - course.price) / course.mrp) * 100)}%
                OFF
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="pt-4 border-t space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Metadata
        </h3>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Course ID:</span>
            <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
              {course.id}
            </code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Slug:</span>
            <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
              {course.slug}
            </code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="outline" className="text-xs">
              {course.status}
            </Badge>
          </div>
          {course.publishedAt && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Published:</span>
              <span className="text-foreground">
                {course.publishedAt.toLocaleDateString()}
              </span>
            </div>
          )}
          {course.createdAt && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Created:</span>
              <span className="text-foreground">
                {course.createdAt.toLocaleDateString()}
              </span>
            </div>
          )}
          {course.updatedAt && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="text-foreground">
                {course.updatedAt.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CourseEditMode({
  form,
  onSubmit,
  isLoading,
  isCreateMode,
  onSuccess,
}: {
  form: UseFormReturn<createCourseType>;
  onSubmit: (data: createCourseType) => Promise<void>;
  isLoading: boolean;
  isCreateMode: boolean;
  onSuccess?: () => void;
}) {
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(
    null
  );
  const [thumbnailKey, setThumbnailKey] = React.useState<string | null>(null);
  const [thumbnailLoading, setThumbnailLoading] = React.useState(false);

  const watchThumbnail = form.watch("thumbnail");
  const watchTitle = form.watch("title");

  const generateSlug = (title: string): string =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  React.useEffect(() => {
    if (watchTitle !== undefined) {
      if (isCreateMode || !form.getValues("slug")) {
        const newSlug = generateSlug(watchTitle);
        form.setValue("slug", newSlug, { shouldValidate: true });
      }
    }
  }, [watchTitle, form, isCreateMode]);

  React.useEffect(() => {
    const loadThumbnail = async () => {
      if (watchThumbnail instanceof FileList && watchThumbnail[0]) {
        const file = watchThumbnail[0];
        const key = `courses/thumbnail-${Date.now()}-${file.name}`;

        try {
          setThumbnailLoading(true);
          const res = await api.courses.getSignedUrl({ type: "put", key });
          if (!res.data?.url) throw new Error("Signed PUT URL not received");

          await fetch(res.data.url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          const objectUrl = URL.createObjectURL(file);
          setThumbnailPreview(objectUrl);
          setThumbnailKey(key);
          form.setValue("thumbnail", key);

          setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        } catch (err) {
          console.error("Failed to upload thumbnail image", err);
        } finally {
          setThumbnailLoading(false);
        }
      } else if (typeof watchThumbnail === "string") {
        try {
          setThumbnailLoading(true);
          const res = await api.courses.getSignedUrl({
            type: "get",
            key: watchThumbnail,
          });

          if (res.data?.url) {
            setThumbnailPreview(res.data.url);
            setThumbnailKey(watchThumbnail);
          } else {
            setThumbnailPreview(null);
            setThumbnailKey(null);
          }
        } catch (err) {
          console.error("Failed to get preview signed URL", err);
          setThumbnailPreview(null);
        } finally {
          setThumbnailLoading(false);
        }
      } else {
        setThumbnailPreview(null);
        setThumbnailKey(null);
      }
    };

    loadThumbnail();
  }, [watchThumbnail, form]);

  const handleRemoveImage = async () => {
    if (!thumbnailKey) return;

    try {
      setThumbnailLoading(true);
      const res = await api.courses.getSignedUrl({
        type: "delete",
        key: thumbnailKey,
      });
      if (res.data?.url) {
        await fetch(res.data.url, { method: "DELETE" });
      }

      form.setValue("thumbnail", null);
      setThumbnailPreview(null);
      setThumbnailKey(null);

      const inputEl = document.getElementById(
        "thumbnail-upload"
      ) as HTMLInputElement;
      if (inputEl) inputEl.value = "";
    } catch (err) {
      console.warn("Failed to delete image", err);
    } finally {
      setThumbnailLoading(false);
    }
  };

  const handleFormSubmit = async (data: createCourseType) => {
    try {
      await onSubmit(data);
      form.reset();
      setThumbnailPreview(null);
      setThumbnailKey(null);
      onSuccess?.();
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Thumbnail Upload */}
        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Course Thumbnail
              </FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        onChange(files);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className={cn(
                      "relative w-full h-64 flex flex-col items-center justify-center text-sm text-muted-foreground",
                      "border-2 border-dashed rounded-xl cursor-pointer transition-all",
                      thumbnailPreview
                        ? "border-primary/50 bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40",
                      thumbnailLoading && "opacity-50 pointer-events-none"
                    )}
                  >
                    {thumbnailLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <IconLoader2 className="size-8 animate-spin text-primary" />
                        <span className="text-xs">Uploading...</span>
                      </div>
                    ) : thumbnailPreview ? (
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover rounded-lg"
                        width={600}
                        height={350}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 rounded-full bg-muted">
                          <IconEdit className="size-6 text-muted-foreground" />
                        </div>
                        <span className="font-medium">
                          Click to upload thumbnail
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PNG, JPG up to 5MB
                        </span>
                      </div>
                    )}
                  </label>
                  {thumbnailPreview && !thumbnailLoading && (
                    <Button
                      variant="outline"
                      type="button"
                      size="sm"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={handleRemoveImage}
                    >
                      <IconX className="size-4 mr-2" />
                      Remove Thumbnail
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Course Title *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Complete Web Development Bootcamp"
                  {...field}
                  value={field.value ?? ""}
                  className="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Description *
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what students will learn in this course..."
                  {...field}
                  value={field.value ?? ""}
                  rows={4}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Access Duration *
              </FormLabel>
              <FormControl>
                <div className="flex gap-3">
                  {field.value?.unit !== "lifetime" && (
                    <Input
                      type="number"
                      placeholder="30"
                      value={field.value?.value ?? ""}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          value: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      className="w-28 h-11"
                    />
                  )}

                  <Select
                    value={field.value?.unit}
                    onValueChange={(val) =>
                      field.onChange({
                        value:
                          val === "lifetime"
                            ? null
                            : (field.value?.value ?? 30),
                        unit: val,
                      })
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "h-11",
                        field.value?.unit === "lifetime" && "w-full"
                      )}
                    >
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                      <SelectItem value="lifetime">Lifetime Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Price (₹) *
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="999"
                    {...field}
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mrp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">MRP (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1999"
                    {...field}
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={isLoading}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-11 gap-2"
          >
            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
            {isCreateMode ? "Create Course" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
