"use client";

import React from "react";
import { useForm, UseFormReturn, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@t2p-admin/ui/components/sheet";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
  IconX,
  IconLoader2,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { format } from "date-fns";
import {
  CreatePollInput,
  createPollSchema,
  PollResponse,
} from "../helpers/polls.schema";

// shadcn calendar imports
import { Calendar } from "@t2p-admin/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@t2p-admin/ui/components/popover";
import { CalendarIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@t2p-admin/ui/components/avatar";

interface PollSheetProps {
  poll: PollResponse | null;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "create";
  onModeChange: (mode: "view" | "edit") => void;
  onSave: (data: CreatePollInput) => Promise<void>;
  isLoading?: boolean;
}

export function PollSheet({
  poll,
  isOpen,
  onClose,
  mode,
  onModeChange,
  onSave,
  isLoading = false,
}: PollSheetProps) {
  const form = useForm<CreatePollInput>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      question: "",
      description: "",
      options: [{ text: "" }, { text: "" }],
      startsAt: undefined,
      endsAt: undefined,
    },
  });

  React.useEffect(() => {
    if (mode === "create") {
      form.reset({
        question: "",
        description: "",
        options: [{ text: "" }, { text: "" }],
        startsAt: undefined,
        endsAt: undefined,
      });
    } else if (poll) {
      form.reset({
        question: poll.question,
        description: poll.description || "",
        options: poll.options.map((o) => ({ text: o.text })),
        startsAt: poll.startsAt,
        endsAt: poll.endsAt || undefined,
      });
    }
  }, [poll, mode, form]);

  const handleSubmit = async (data: CreatePollInput) => {
    try {
      await onSave(data);
      onModeChange("view");
    } catch (err) {
      console.error("Error saving poll", err);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!poll && mode !== "create") return null;

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
              <SheetTitle>
                {mode === "view"
                  ? "View Poll"
                  : mode === "edit"
                    ? "Edit Poll"
                    : "Create Poll"}
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
                    <IconEdit className="size-4" /> Edit
                  </>
                ) : (
                  <>
                    <IconX className="size-4" /> Cancel
                  </>
                )}
              </Button>
            )}
          </div>
          <SheetDescription>
            {mode === "view"
              ? "View poll details and results."
              : mode === "edit"
                ? "Edit poll details and save changes."
                : "Create a new poll with question, description and options."}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-2" />

        <div className="mt-4">
          {mode === "view" ? (
            <PollViewMode poll={poll!} />
          ) : (
            <PollEditMode
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

export function PollViewMode({ poll }: { poll: PollResponse }) {
  const getInitials = (name?: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "US";

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="default">
          {poll.endsAt && poll.endsAt < new Date() ? "Closed" : "Active"}
        </Badge>
      </div>

      {/* Question */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-1">
          Question
        </h3>
        <div className="p-4 bg-muted rounded-xl border">{poll.question}</div>
      </div>

      {/* Description */}
      {poll.description && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-1">
            Description
          </h3>
          <div className="p-4 bg-muted rounded-xl border">
            {poll.description}
          </div>
        </div>
      )}

      {/* Options */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground mb-2">
          Options
        </h3>
        <div className="space-y-2">
          {poll.options.map((o) => (
            <div
              key={o.id}
              className="flex justify-between p-2 border rounded-lg bg-background"
            >
              <span>{o.text}</span>
              <span className="font-mono text-xs">{o.votesCount} votes</span>
            </div>
          ))}
        </div>
      </div>

      {/* Likes */}
      {poll.likedBy && poll.likedBy.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-2">
            Liked By ({poll.likedBy.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {poll.likedBy.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.image ?? ""} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      {poll.commentedBy && poll.commentedBy.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-2">
            Comments ({poll.commentedBy.length})
          </h3>
          <div className="space-y-2">
            {poll.commentedBy.map((c) => (
              <div key={c.id} className="p-3 border rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={c.image ?? ""} alt={c.name} />
                    <AvatarFallback>{getInitials(c.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{c.name}</span>
                  {c.createdAt && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {format(new Date(c.createdAt), "PPP")}
                    </span>
                  )}
                </div>
                {c.content && <p className="text-sm mt-1">{c.content}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="pt-4 border-t">
        <h3 className="text-xs font-semibold text-muted-foreground mb-3">
          Metadata
        </h3>
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">ID:</span>{" "}
            <span className="font-mono text-xs">{poll.id}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Created:</span>{" "}
            {format(new Date(poll.createdAt), "PPP 'at' p")}
          </p>
          {poll.updatedAt && (
            <p>
              <span className="text-muted-foreground">Updated:</span>{" "}
              {format(new Date(poll.updatedAt), "PPP 'at' p")}
            </p>
          )}
          <p>
            <span className="text-muted-foreground">Starts:</span>{" "}
            {format(new Date(poll.startsAt), "PPP 'at' p")}
          </p>
          {poll.endsAt && (
            <p>
              <span className="text-muted-foreground">Ends:</span>{" "}
              {format(new Date(poll.endsAt), "PPP 'at' p")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function PollEditMode({
  form,
  onSubmit,
  isLoading,
  isCreateMode,
  onSuccess,
}: {
  form: UseFormReturn<CreatePollInput>;
  onSubmit: (data: CreatePollInput) => Promise<void>;
  isLoading: boolean;
  isCreateMode: boolean;
  onSuccess?: () => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const handleFormSubmit = async (data: CreatePollInput) => {
    console.log(data);
    await onSubmit(data);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Question */}
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question *</FormLabel>
              <FormControl>
                <Input placeholder="Enter poll question..." {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional description..."
                  className="resize-none min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Options */}
        <div>
          <FormLabel>Options *</FormLabel>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <FormField
                  control={form.control}
                  name={`options.${index}.text`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={`Option ${index + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 2}
                >
                  <IconTrash className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => append({ text: "" })}
            >
              <IconPlus className="size-4" /> Add Option
            </Button>
          </div>
        </div>

        {/* Start Date */}
        <FormField
          control={form.control}
          name="startsAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date */}
        <FormField
          control={form.control}
          name="endsAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
            {isCreateMode ? "Create Poll" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
