/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
import { IconEye, IconLoader2 } from "@tabler/icons-react";
import Image from "next/image";
import { format } from "date-fns";

import { api } from "@/lib/api";
import {
  scheduleNotificationFormSchema,
  ScheduleNotificationFormType,
  PushNotificationType,
  SegmentsResponseSchema,
} from "@/features/notification/notification.schema";
import { Switch } from "@t2p-admin/ui/components/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@t2p-admin/ui/components/popover";
import { cn } from "@t2p-admin/ui/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@t2p-admin/ui/components/calendar";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@t2p-admin/ui/components/multi-select";
import { RefetchOptions } from "@tanstack/query-core";
import z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@t2p-admin/ui/components/select";

interface NotificationSheetProps {
  notification: PushNotificationType | null;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "create";
  onModeChange: (mode: "view" | "create") => void;
  onSave: (data: ScheduleNotificationFormType) => Promise<void>;
  isLoading?: boolean;
  segments: z.infer<typeof SegmentsResponseSchema>;
  isSegmentsLoading: boolean;
  segmentsError: string | null;
  refetchSegments: (options?: RefetchOptions | undefined) => Promise<any>;
}

export function NotificationSheet({
  notification,
  isOpen,
  onClose,
  mode,
  onModeChange,
  onSave,
  isLoading = false,
  segments,
  isSegmentsLoading,
  segmentsError,
}: NotificationSheetProps) {
  const form = useForm<ScheduleNotificationFormType>({
    resolver: zodResolver(scheduleNotificationFormSchema),
    defaultValues: {
      segments: [],
      title: "",
      description: "",
      landingScreen: "",
      customUrl: "",
      schedule: undefined,
    },
  });

  const handleSubmit = async (data: ScheduleNotificationFormType) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (mode === "view" && !notification) return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto px-6 py-4">
        <SheetHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <IconEye className="size-5 text-primary" />
              <SheetTitle className="text-lg font-semibold">
                {mode === "view" ? "View Notification" : "Create Notification"}
              </SheetTitle>
            </div>

            {mode === "view" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onModeChange("create")}
              >
                Create New
              </Button>
            )}
          </div>
          <SheetDescription>
            {mode === "view"
              ? "View notification details and content."
              : "Fill in the details to create a new notification."}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-2" />

        <div className="mt-4">
          {mode === "view" ? (
            notification && <NotificationViewMode notification={notification} />
          ) : (
            <NotificationCreateMode
              form={form}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              segments={segments}
              isSegmentsLoading={isSegmentsLoading}
              segmentsError={segmentsError}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function NotificationViewMode({
  notification,
}: {
  notification: PushNotificationType;
}) {
  const [signedImageUrl, setSignedImageUrl] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    const getSignedUrl = async () => {
      if (notification.image && typeof notification.image === "string") {
        try {
          const res = await api.quest.getSignedUrl({
            type: "get",
            key: notification.image,
          });
          setSignedImageUrl(res.data?.url ?? null);
        } catch (error) {
          console.error("Failed to get signed image URL", error);
          setSignedImageUrl(null);
        }
      }
    };
    getSignedUrl();
  }, [notification.image]);

  return (
    <div className="space-y-6">
      <Field label="Title">{notification.title}</Field>
      <Field label="Message">{notification.message}</Field>

      {signedImageUrl && (
        <Field label="Image">
          <Image
            src={signedImageUrl}
            alt="Notification image"
            className="w-full h-32 object-cover rounded-lg"
            width={350}
            height={250}
          />
        </Field>
      )}

      {notification.schedule && (
        <Field label="Scheduled For">
          {format(new Date(notification.schedule), "PPP 'at' p")}
        </Field>
      )}

      <div className="pt-4 border-t">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3">
          Metadata
        </h3>
        <div className="grid gap-2 text-sm">
          <MetaItem label="ID">{notification.id}</MetaItem>
          {notification.createdAt && (
            <MetaItem label="Created">
              {format(new Date(notification.createdAt), "PPP 'at' p")}
            </MetaItem>
          )}
          {notification.updatedAt && (
            <MetaItem label="Updated">
              {format(new Date(notification.updatedAt), "PPP 'at' p")}
            </MetaItem>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationCreateMode({
  form,
  onSubmit,
  isLoading,
  segments,
  isSegmentsLoading,
  segmentsError,
}: {
  form: UseFormReturn<ScheduleNotificationFormType>;
  onSubmit: (data: ScheduleNotificationFormType) => Promise<void>;
  isLoading: boolean;
  segments: z.infer<typeof SegmentsResponseSchema>;
  isSegmentsLoading: boolean;
  segmentsError: string | null;
}) {
  const [isScheduled, setIsScheduled] = useState(false);

  const segmentOptions: MultiSelectOption[] = React.useMemo(() => {
    if (!segments?.segments) return [];

    return segments.segments.map((segment) => ({
      label: segment.name || segment.id,
      value: segment.name,
    }));
  }, [segments]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="segments"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                <span>Segments *</span>
              </FormLabel>
              <FormControl>
                <MultiSelect
                  options={segmentOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder={
                    isSegmentsLoading
                      ? "Loading segments..."
                      : segmentsError
                        ? "Error loading segments"
                        : segmentOptions.length === 0
                          ? "No segments available. Create one above."
                          : "Select segments..."
                  }
                  disabled={isSegmentsLoading || !!segmentsError}
                  searchable={true}
                  maxCount={3}
                  emptyIndicator={
                    segmentsError ? (
                      <div className="text-center text-sm text-red-500">
                        Failed to load segments
                      </div>
                    ) : (
                      <div className="text-center text-sm text-muted-foreground">
                        No segments found. Try creating one above.
                      </div>
                    )
                  }
                  className="w-full"
                  responsive={true}
                  resetOnDefaultValueChange={true}
                  variant="default"
                  animationConfig={{
                    badgeAnimation: "bounce",
                    popoverAnimation: "scale",
                    optionHoverAnimation: "highlight",
                    duration: 0.2,
                  }}
                />
              </FormControl>
              {segmentsError && (
                <p className="text-sm text-red-500 mt-1">
                  Error loading segments: {segmentsError}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter notification title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter notification message..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="landingScreen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Landing Screen</FormLabel>
              <Select
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  if (val !== "custom") {
                    form.setValue("customUrl", "");
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a screen or custom URL" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="talk2partners://home?index=0">
                    Home
                  </SelectItem>
                  <SelectItem value="talk2partners://home?index=1">
                    Courses
                  </SelectItem>
                  <SelectItem value="talk2partners://home?index=2">
                    Partners
                  </SelectItem>
                  <SelectItem value="talk2partners://home?index=3">
                    Shorts
                  </SelectItem>
                  <SelectItem value="talk2partners://home?index=4">
                    Chats
                  </SelectItem>
                  <SelectItem value="custom">Custom URL</SelectItem>
                </SelectContent>
              </Select>

              {field.value === "custom" && (
                <FormField
                  control={form.control}
                  name="customUrl"
                  render={({ field: urlField }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="Enter custom URL"
                          value={urlField.value}
                          onChange={(e) => {
                            urlField.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between border p-4 rounded-lg">
          <div>
            <FormLabel>Send Immediately</FormLabel>
            <p className="text-sm text-muted-foreground">
              Turn off to schedule for a later date/time.
            </p>
          </div>
          <Switch
            checked={!isScheduled}
            onCheckedChange={(checked) => {
              setIsScheduled(!checked);
              if (checked) {
                form.setValue("schedule", undefined);
              }
            }}
          />
        </div>

        {isScheduled && (
          <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Schedule Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP p")
                      ) : (
                        <span>Pick date & time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col space-y-2 p-2">
                    <Calendar
                      mode="single"
                      selected={field.value ? (field.value as Date) : undefined}
                      onSelect={(date) => {
                        if (!date) {
                          field.onChange(undefined);
                          return;
                        }
                        const existingDate = field.value ?? new Date();
                        const hours = existingDate.getHours();
                        const minutes = existingDate.getMinutes();
                        date.setHours(hours, minutes);
                        field.onChange(date);
                      }}
                      autoFocus
                    />
                    <input
                      type="time"
                      className="border rounded-md px-2 py-1"
                      value={
                        field.value
                          ? `${String(field.value.getHours()).padStart(
                              2,
                              "0"
                            )}:${String(field.value.getMinutes()).padStart(
                              2,
                              "0"
                            )}`
                          : ""
                      }
                      onChange={(e) => {
                        if (!e.target.value) return;
                        const [hStr, mStr] = e.target.value.split(":");
                        const hours = Number(hStr);
                        const minutes = Number(mStr);
                        if (isNaN(hours) || isNaN(minutes)) return;

                        const date = field.value ?? new Date();
                        date.setHours(hours, minutes);
                        field.onChange(date);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
            Create Notification
          </Button>
        </div>
      </form>
    </Form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-1">
        {label}
      </h3>
      <div className="p-4 bg-muted rounded-xl border text-sm">{children}</div>
    </div>
  );
}

function MetaItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-muted-foreground">{label}:</span>
      <span className="ml-2 font-mono text-xs text-foreground">{children}</span>
    </div>
  );
}
