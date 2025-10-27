"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@t2p-admin/ui/components/form";
import { Button } from "@t2p-admin/ui/components/button";
import { cn } from "@t2p-admin/ui/lib/utils";
import {
  uploadExcelSchema,
  UploadExcelType,
} from "@/features/question/question.schema";
import { api } from "@/lib/api";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@t2p-admin/ui/components/textarea";
import { Input } from "@t2p-admin/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@t2p-admin/ui/components/select";
import { Switch } from "@t2p-admin/ui/components/switch";

import { IconLoader2 } from "@tabler/icons-react";
import { QuestionFormType } from "@/features/question/question.schema";

export function ExcelUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);

  const form = useForm<UploadExcelType>({
    resolver: zodResolver(uploadExcelSchema),
    defaultValues: {
      excel: undefined,
    },
  });

  const { handleSubmit, control, watch, reset } = form;
  const watchExcel = watch("excel");

  useEffect(() => {
    const uploadFile = async () => {
      if (watchExcel instanceof FileList && watchExcel[0]) {
        const file = watchExcel[0];
        const key = `excel/${Date.now()}-${file.name}`;

        try {
          setUploading(true);
          const res = await api.question.getSignedUrl({ type: "put", key });
          const signedUrl = res.data?.url;
          if (!signedUrl) throw new Error("No signed URL returned");

          await fetch(signedUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          toast.success("File uploaded successfully");
          setFileName(file.name);
          setUploadedKey(key);
        } catch (error) {
          console.error("File upload failed", error);
          toast.error("File upload failed");
          setUploadedKey(null);
        } finally {
          setUploading(false);
        }
      }
    };

    uploadFile();
  }, [watchExcel]);

  const onSubmit = async () => {
    if (!uploadedKey) {
      toast.error("Please upload a file first.");
      return;
    }

    try {
      setUploading(true);
      await api.question.uploadExcel({ key: uploadedKey });
      toast.success("Excel submitted successfully!");
      reset();
      setFileName(null);
      setUploadedKey(null);

      const input = document.getElementById(
        "excel-upload"
      ) as HTMLInputElement | null;
      if (input) input.value = "";

      onSuccess?.();
    } catch (error) {
      console.error("Submit failed", error);
      toast.error("Submission failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={control}
          name="excel"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Upload Excel File
              </FormLabel>
              <FormControl>
                <div>
                  <input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        onChange(files);
                      }
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="excel-upload"
                    className={cn(
                      "w-full h-32 flex flex-col items-center justify-center text-sm text-muted-foreground",
                      "border-2 border-dashed border-muted rounded-xl cursor-pointer transition-colors",
                      "hover:bg-muted/40",
                      uploading && "opacity-50 pointer-events-none"
                    )}
                  >
                    {uploading
                      ? "Uploading..."
                      : fileName
                        ? `Selected File: ${fileName}`
                        : "Click to upload .xlsx or .xls file"}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={uploading || !uploadedKey}
        >
          {uploading ? "Uploading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

interface QuestionFormProps {
  form: UseFormReturn<QuestionFormType>;
  onSubmit: (data: QuestionFormType) => Promise<void>;
  isLoading?: boolean;
  isCreateMode?: boolean;
}

export function QuestionForm({
  form,
  onSubmit,
  isLoading = false,
  isCreateMode = false,
}: QuestionFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Question */}
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

        {/* Category */}
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

        {/* Options */}
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

        {/* Correct Answer */}
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

        {/* Archived */}
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

        {/* Submit */}
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
