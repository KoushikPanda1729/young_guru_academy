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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@t2p-admin/ui/components/form";
import { Input } from "@t2p-admin/ui/components/input";
import { Textarea } from "@t2p-admin/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@t2p-admin/ui/components/select";
import { Button } from "@t2p-admin/ui/components/button";
import { Badge } from "@t2p-admin/ui/components/badge";
import { Separator } from "@t2p-admin/ui/components/separator";
import { Switch } from "@t2p-admin/ui/components/switch";
import { IconEdit, IconEye, IconLoader2, IconX } from "@tabler/icons-react";
import {
  QuestionFormSchema,
  QuestionFormType,
  type QuestionType,
} from "@/features/question/question.schema";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@t2p-admin/ui/components/tabs";
import { ExcelUploadForm } from "@/components/forms/question-form";

interface QuestionSheetProps {
  question: QuestionType | null;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "create";
  onModeChange: (mode: "view" | "edit") => void;
  onSave: (data: QuestionFormType) => Promise<void>;
  isLoading?: boolean;
}

export function QuestionSheet({
  question,
  isOpen,
  onClose,
  mode,
  onModeChange,
  onSave,
  isLoading = false,
}: QuestionSheetProps) {
  const form = useForm<QuestionFormType>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      question: "",
      category: "",
      options: { A: "", B: "", C: "", D: "" },
      answer: "",
      archived: false,
    },
  });

  React.useEffect(() => {
    if (mode === "create") {
      form.reset({
        question: "",
        category: "",
        options: { A: "", B: "", C: "", D: "" },
        answer: "",
        archived: false,
      });
    } else if (question) {
      form.reset({
        question: question.question || "",
        category: question.category || "",
        options: {
          A: question.options?.A || "",
          B: question.options?.B || "",
          C: question.options?.C || "",
          D: question.options?.B || "",
        },
        answer: question.answer || "",
        archived: question.archived || false,
      });
    }
  }, [question, form, mode]);

  const handleSubmit = async (data: QuestionFormType) => {
    try {
      await onSave(data);
      onModeChange("view");
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!question && mode !== "create") return null;

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
                  ? "View Question"
                  : mode === "edit"
                    ? "Edit Question"
                    : "Create Question"}
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
              ? "View question details and information."
              : mode === "edit"
                ? "Edit question details and save changes."
                : "Create a new question or upload in bulk."}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-2" />

        <Tabs defaultValue="single" className="mt-4">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="single">Single</TabsTrigger>
            <TabsTrigger value="excel">Excel</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            {mode === "view" ? (
              <QuestionViewMode question={question!} />
            ) : (
              <QuestionEditMode
                form={form}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isCreateMode={mode === "create"}
              />
            )}
          </TabsContent>

          <TabsContent value="excel">
            <ExcelUploadForm onSuccess={handleClose} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function QuestionViewMode({ question }: { question: QuestionType }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Badge variant={question.archived ? "secondary" : "default"}>
          {question.archived ? "Archived" : "Active"}
        </Badge>
        <Badge variant="outline">{question.category}</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Question
          </h3>
          <div className="p-4 bg-muted rounded-xl border text-sm leading-relaxed">
            {question.question}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Options
          </h3>
          <div className="space-y-2">
            {Object.entries(question.options || {}).map(([key, value]) => (
              <div
                key={key}
                className={`p-3 rounded-xl border transition-colors ${
                  question.answer?.toLowerCase() === key.toLowerCase()
                    ? "border-primary/30 bg-primary/10"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                      question.answer?.toLowerCase() === key.toLowerCase()
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {key.toUpperCase()}
                  </div>
                  <p className="text-sm leading-relaxed flex-1">{value}</p>
                  {question.answer?.toLowerCase() === key.toLowerCase() && (
                    <Badge variant="default">Correct</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-1">
              Category
            </h3>
            <p className="text-sm text-foreground">{question.category}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-1">
              Status
            </h3>
            <p className="text-sm text-foreground">
              {question.archived ? "Archived" : "Active"}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3">
            Metadata
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">ID:</span>
              <span className="ml-2 font-mono text-xs text-foreground">
                {question.id}
              </span>
            </div>
            {question.createdAt && (
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2 text-foreground">
                  {new Date(question.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {question.updatedAt && (
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <span className="ml-2 text-foreground">
                  {new Date(question.updatedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionEditMode({
  form,
  onSubmit,
  isLoading,
  isCreateMode,
}: {
  form: UseFormReturn<QuestionFormType>;
  onSubmit: (data: QuestionFormType) => Promise<void>;
  isLoading: boolean;
  isCreateMode: boolean;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the question text..."
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A">Category A</SelectItem>
                  <SelectItem value="B">Category B</SelectItem>
                  <SelectItem value="C">Category C</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">
            Answer Options *
          </h3>
          {(["A", "B", "C", "D"] as const).map((option) => (
            <FormField
              key={option}
              control={form.control}
              name={`options.${option}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option {option.toUpperCase()}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter option ${option.toUpperCase()}...`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correct Answer *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the correct answer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="a">Option A</SelectItem>
                  <SelectItem value="b">Option B</SelectItem>
                  <SelectItem value="c">Option C</SelectItem>
                  <SelectItem value="d">Option D</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="archived"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Archived</FormLabel>
                <FormDescription>
                  Archive this question to hide it from active use.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
            {isCreateMode ? "Create Question" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
