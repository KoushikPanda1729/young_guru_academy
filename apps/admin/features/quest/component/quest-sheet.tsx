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
} from "@tabler/icons-react";
import {
  scheduleQuestFormSchema,
  ScheduleQuestFormType,
  type QuestType,
} from "@/features/quest/quest.schema";
import { cn } from "@t2p-admin/ui/lib/utils";
import Image from "next/image";
import { api } from "@/lib/api";
import { format } from "date-fns";

interface QuestSheetProps {
  quest: QuestType | null;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "create";
  onModeChange: (mode: "view" | "edit") => void;
  onSave: (data: ScheduleQuestFormType) => Promise<void>;
  isLoading?: boolean;
}

export function QuestSheet({
  quest,
  isOpen,
  onClose,
  mode,
  onModeChange,
  onSave,
  isLoading = false,
}: QuestSheetProps) {
  
  const form = useForm<ScheduleQuestFormType>({
    resolver: zodResolver(scheduleQuestFormSchema),
    defaultValues: {
      title: "",
      description: "",
      banner: undefined,
    },
  });

  React.useEffect(() => {
    if (mode === "create") {
      form.reset({
        title: "",
        description: "",
        banner: undefined,
      });
    } else if (quest) {
      form.reset({
        title: quest.title || "",
        description: quest.description || "",
        banner: quest.banner || undefined,
      });
    }
  }, [quest, form, mode]);

  const handleSubmit = async (data: ScheduleQuestFormType) => {
    try {
      await onSave(data);
      onModeChange("view");
    } catch (error) {
      console.error("Error saving quest:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!quest && mode !== "create") return null;

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
                  ? "View Quest"
                  : mode === "edit"
                  ? "Edit Quest"
                  : "Create Quest"}
              </SheetTitle>
            </div>

            {mode !== "create" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onModeChange(mode === "view" ? "edit" : "view")
                }
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
              ? "View quest details and information."
              : mode === "edit"
              ? "Edit quest details and save changes."
              : "Create a new quest with title and description"}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-2" />

        <div className="mt-4">
          {mode === "view" ? (
            <QuestViewMode quest={quest!} />
          ) : (
            <QuestEditMode
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


export function QuestViewMode({ quest }: { quest: QuestType }) {
  const [signedBannerUrl, setSignedBannerUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getSignedUrl = async () => {
      if (quest.banner && typeof quest.banner === "string") {
        try {
          const res = await api.quest.getSignedUrl({ type: "get", key: quest.banner });
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
  }, [quest.banner]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Badge variant={quest.archived ? "secondary" : "default"}>
          {quest.archived ? "Archived" : "Active"}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Title
          </h3>
          <div className="p-4 bg-muted rounded-xl border text-sm leading-relaxed font-medium">
            {quest.title}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Description
          </h3>
          <div className="p-4 bg-muted rounded-xl border text-sm leading-relaxed">
            {quest.description}
          </div>
        </div>

        {signedBannerUrl && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Banner
            </h3>
            <div className="p-4 bg-muted rounded-xl border">
              <Image
                src={signedBannerUrl}
                alt="Quest banner"
                className="w-full h-32 object-cover rounded-lg"
                width={350}
                height={250}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-1">
              Status
            </h3>
            <p className="text-sm text-foreground">
              {quest.archived ? "Archived" : "Active"}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3">Metadata</h3>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">ID:</span>
              <span className="ml-2 font-mono text-xs text-foreground">{quest.id}</span>
            </div>
            {quest.createdAt && (
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2 text-foreground">
                  {format(new Date(quest.createdAt), "PPP 'at' p")}
                </span>
              </div>
            )}
            {quest.updatedAt && (
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <span className="ml-2 text-foreground">
                  {format(new Date(quest.updatedAt), "PPP 'at' p")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export function QuestEditMode({
  form,
  onSubmit,
  isLoading,
  isCreateMode,
  onSuccess,
}: {
  form: UseFormReturn<ScheduleQuestFormType>;
  onSubmit: (data: ScheduleQuestFormType) => Promise<void>;
  isLoading: boolean;
  isCreateMode: boolean;
  onSuccess?: () => void;
}) {
  const [bannerPreview, setBannerPreview] = React.useState<string | null>(null);
  const [bannerKey, setBannerKey] = React.useState<string | null>(null);
  const [bannerLoading, setBannerLoading] = React.useState<boolean>(false);

  const watchBanner = form.watch("banner");

  React.useEffect(() => {
    const loadBanner = async () => {
      if (watchBanner instanceof FileList && watchBanner[0]) {
        const file = watchBanner[0];
        const key = `banners/${Date.now()}-${file.name}`;

        try {
          setBannerLoading(true);
          const res = await api.quest.getSignedUrl({ type: "put", key });
          if (!res.data?.url) throw new Error("Signed PUT URL not received");

          await fetch(res.data.url, {
            method: "PUT",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });

          const objectUrl = URL.createObjectURL(file);
          setBannerPreview(objectUrl);
          setBannerKey(key);
          form.setValue("banner", key);
          URL.revokeObjectURL(objectUrl);
        } catch (err) {
          console.error("Failed to upload banner image", err);
        } finally {
          setBannerLoading(false);
        }
      } else if (typeof watchBanner === "string") {
        try {
          setBannerLoading(true);
          const res = await api.quest.getSignedUrl({ type: "get", key: watchBanner });

          if (res.data?.url) {
            setBannerPreview(res.data.url);
            setBannerKey(watchBanner);
          } else {
            setBannerPreview(null);
            setBannerKey(null);
          }
        } catch (err) {
          console.error("Failed to get preview signed URL", err);
          setBannerPreview(null);
        } finally {
          setBannerLoading(false);
        }
      } else {
        setBannerPreview(null);
        setBannerKey(null);
      }
    };

    loadBanner();
  }, [watchBanner, form]);

  const handleRemoveImage = async () => {
    if (!bannerKey) return;

    try {
      setBannerLoading(true);
      const res = await api.quest.getSignedUrl({ type: "delete", key: bannerKey });

      if (res.data?.url) {
        await fetch(res.data.url, {
          method: "DELETE",
        });
      }

      form.setValue("banner", null);
      setBannerPreview(null);
      setBannerKey(null);

      const inputEl = document.getElementById("banner-upload") as HTMLInputElement;
      if (inputEl) inputEl.value = "";
    } catch (err) {
      console.error("Failed to delete image", err);
    } finally {
      setBannerLoading(false);
    }
  };

  const handleFormSubmit = async (data: ScheduleQuestFormType) => {
    try {
      await onSubmit(data);
      form.reset();
      setBannerPreview(null);
      setBannerKey(null);
      onSuccess?.();
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Banner Image Upload */}
        <FormField
          control={form.control}
          name="banner"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Banner Image</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <input
                    id="banner-upload"
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
                    htmlFor="banner-upload"
                    className={cn(
                      "w-full h-32 flex flex-col items-center justify-center text-sm text-muted-foreground",
                      "border-2 border-dashed border-muted rounded-xl cursor-pointer transition-colors",
                      "hover:bg-muted/40",
                      bannerLoading && "opacity-50 pointer-events-none"
                    )}
                  >
                    {bannerLoading ? (
                      <IconLoader2 className="animate-spin" />
                    ) : bannerPreview?.startsWith("http") ? (
                      <Image
                 
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-32 object-cover rounded-lg"
                        width={350}
                        height={250}
                      />
                    ) : (
                      "Click to upload banner image"
                    )}
                  </label>
                  {bannerPreview && !bannerLoading && (
                    <Button
                      variant="ghost"
                      type="button"
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
                <Input placeholder="Enter quest title..." {...field} />
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
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter quest description..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
            {isCreateMode ? "Create Quest" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}


