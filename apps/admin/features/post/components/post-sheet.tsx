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
import { Separator } from "@t2p-admin/ui/components/separator";
import { IconEdit, IconEye, IconLoader2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@t2p-admin/ui/lib/utils";
import { format } from "date-fns";
import { api } from "@/lib/api";
import {
  createPostSchema,
  type CreatePostInput,
  type PostType,
} from "../helpers/post.schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@t2p-admin/ui/components/popover";
import { Calendar } from "@t2p-admin/ui/components/calendar";

interface PostSheetProps {
  post: PostType | null;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "create";
  onModeChange: (mode: "view" | "edit") => void;
  onSave: (data: CreatePostInput) => Promise<void>;
  isLoading?: boolean;
}

export function PostSheet({
  post,
  isOpen,
  onClose,
  mode,
  onModeChange,
  onSave,
  isLoading = false,
}: PostSheetProps) {
  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
      startsAt: undefined,
      endsAt: undefined,
    },
  });

  React.useEffect(() => {
    if (mode === "create") {
      form.reset({
        title: "",
        content: "",
        imageUrl: "",
        startsAt: undefined,
        endsAt: undefined,
      });
    } else if (post) {
      form.reset({
        title: post.title,
        content: post.content || "",
        imageUrl: post.imageUrl || "",
        startsAt: post.startsAt.toISOString(),
        endsAt: post.endsAt?.toISOString(),
      });
    }
  }, [post, mode, form]);

  const handleSubmit = async (data: CreatePostInput) => {
    try {
      await onSave(data);
      onModeChange("view");
    } catch (err) {
      console.error("Failed to save post:", err);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!post && mode !== "create") return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto px-6 py-4">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mode === "view" ? (
                <IconEye className="size-5 text-primary" />
              ) : (
                <IconEdit className="size-5 text-primary" />
              )}
              <SheetTitle className="text-lg font-semibold">
                {mode === "view"
                  ? "View Post"
                  : mode === "edit"
                    ? "Edit Post"
                    : "Create Post"}
              </SheetTitle>
            </div>

            {mode !== "create" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onModeChange(mode === "view" ? "edit" : "view")}
                className="gap-2"
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
          <SheetDescription>
            {mode === "view"
              ? "View post details."
              : mode === "edit"
                ? "Edit post details."
                : "Create a new post."}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-2" />

        <div className="mt-4">
          <PostEditMode
            post={post}
            form={form}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isCreateMode={mode === "create"}
            onSuccess={handleClose}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PostEditMode({
  post,
  form,
  onSubmit,
  isLoading,
  isCreateMode,
  onSuccess,
}: {
  post: PostType | null;
  form: UseFormReturn<CreatePostInput>;
  onSubmit: (data: CreatePostInput) => Promise<void>;
  isLoading: boolean;
  isCreateMode: boolean;
  onSuccess?: () => void;
}) {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageKey, setImageKey] = React.useState<string | null>(null);
  const [imageLoading, setImageLoading] = React.useState<boolean>(false);

  const watchImage = form.watch("imageUrl");

  const isFileList = (value: unknown): value is FileList =>
    value instanceof FileList;

  // Set initial preview for editing
  React.useEffect(() => {
    if (!isCreateMode && post?.imageUrl && !isFileList(watchImage)) {
      setImagePreview(post.imageUrl);
      setImageKey(null);
    }
  }, [post, isCreateMode, watchImage]);

  React.useEffect(() => {
    let cancelled = false;

    const uploadImage = async () => {
      if (isFileList(watchImage) && watchImage[0]) {
        const file = watchImage[0];
        const key = `posts/${Date.now()}-${file.name}`;

        try {
          setImageLoading(true);

          // ✅ Get signed PUT URL
          const { data: putData } = await api.courses.getSignedUrl({
            type: "put",
            key,
          });
          if (!putData?.url) throw new Error("Signed PUT URL not received");

          // ✅ Upload to bucket
          await fetch(putData.url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          // ✅ Get signed GET URL for preview
          const { data: getData } = await api.courses.getSignedUrl({
            type: "get",
            key,
          });
          if (!getData?.url) throw new Error("Signed GET URL not received");

          if (!cancelled) {
            setImagePreview(getData.url);
            setImageKey(key);
            form.setValue("imageUrl", key); // store only the key
          }
        } catch (err) {
          console.error("Failed to upload image", err);
        } finally {
          if (!cancelled) setImageLoading(false);
        }
      }
    };

    uploadImage();

    return () => {
      cancelled = true;
    };
  }, [watchImage, form]);

  const handleRemoveImage = async () => {
    try {
      setImageLoading(true);

      if (imageKey) {
        const res = await api.courses.getSignedUrl({
          type: "delete",
          key: imageKey,
        });
        if (res.data?.url) await fetch(res.data.url, { method: "DELETE" });
      }

      // Reset states and form
      form.setValue("imageUrl", "");
      setImagePreview(null);
      setImageKey(null);

      const inputEl = document.getElementById(
        "image-upload"
      ) as HTMLInputElement;
      if (inputEl) inputEl.value = "";
    } catch (err) {
      console.error("Failed to delete image", err);
    } finally {
      setImageLoading(false);
    }
  };

  const handleFormSubmit = async (data: CreatePostInput) => {
    try {
      if (!isCreateMode && post) {
        const currentValue = data.imageUrl;

        if (
          (typeof currentValue === "string" &&
            currentValue === post.imageUrl) ||
          currentValue === ""
        ) {
          if (currentValue === "") data.imageUrl = "";
          else delete data.imageUrl;
        }
      }

      await onSubmit(data);
      form.reset();
      setImagePreview(null);
      setImageKey(null);
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
        {/* Image Upload */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) onChange(files);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className={cn(
                      "w-full h-32 flex flex-col items-center justify-center text-sm text-muted-foreground border-2 border-dashed border-muted rounded-xl cursor-pointer hover:bg-muted/40",
                      imageLoading && "opacity-50 pointer-events-none"
                    )}
                  >
                    {imageLoading ? (
                      <IconLoader2 className="animate-spin" />
                    ) : imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Image preview"
                        className="w-full h-32 object-cover rounded-lg"
                        width={350}
                        height={250}
                      />
                    ) : (
                      "Click to upload image"
                    )}
                  </label>
                  {imagePreview && !imageLoading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={handleRemoveImage}
                    >
                      Remove Image
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
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter content..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Starts At */}
        <FormField
          control={form.control}
          name="startsAt"
          render={({ field }) => {
            const dateValue = field.value ? new Date(field.value) : undefined;

            return (
              <FormItem>
                <FormLabel>Starts At</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {dateValue
                        ? format(dateValue, "PPP p")
                        : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateValue}
                      onSelect={(date) => {
                        if (date) field.onChange(date.toISOString());
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Ends At */}
        <FormField
          control={form.control}
          name="endsAt"
          render={({ field }) => {
            const dateValue = field.value ? new Date(field.value) : undefined;

            return (
              <FormItem>
                <FormLabel>Ends At</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {dateValue
                        ? format(dateValue, "PPP p")
                        : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateValue}
                      onSelect={(date) => {
                        if (date) field.onChange(date.toISOString());
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
            {isCreateMode ? "Create Post" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
