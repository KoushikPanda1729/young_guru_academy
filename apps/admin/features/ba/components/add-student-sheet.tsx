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
import { Button } from "@t2p-admin/ui/components/button";
import { Separator } from "@t2p-admin/ui/components/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@t2p-admin/ui/components/select";
import { IconEdit, IconLoader2 } from "@tabler/icons-react";
import { useUser } from "@/features/user/hooks/useUser";
import { useCourse } from "@/features/course/hooks/useCourse";
import {
  MultiSelect,
  MultiSelectOption,
} from "@t2p-admin/ui/components/multi-select";
import { formatPrice } from "@/features/course/helpers/format-price";
import {
  BackendAdditionInput,
  BackendAdditionInputSchema,
} from "../helpers/ba-schema";
import { MultiAsyncSelect, Option } from "../../../components/async-select";

interface BackendAdditionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: BackendAdditionInput) => Promise<void>;
  isLoading?: boolean;
  availableCourses?: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
  }>;
}

export function BackendAdditionSheet({
  isOpen,
  onClose,
  onCreate,
  isLoading = false,
  availableCourses = [],
}: BackendAdditionSheetProps) {
  const form = useForm<BackendAdditionInput>({
    resolver: zodResolver(BackendAdditionInputSchema),
    defaultValues: {
      userId: [],
      courseId: "",
      amount: 0,
    },
  });

  const handleSubmit = async (data: BackendAdditionInput) => {
    try {
      await onCreate(data);
      handleClose();
    } catch (error) {
      console.error("Error creating backend addition:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-[700px] overflow-y-auto px-6 py-4">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <IconEdit className="size-5 text-primary" />
            <SheetTitle className="text-lg font-semibold">
              Create Backend Addition
            </SheetTitle>
          </div>
          <SheetDescription>
            Create a new backend addition entry for a user and course.
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-3" />

        <BackendAdditionCreateForm
          form={form}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          availableCourses={availableCourses}
        />
      </SheetContent>
    </Sheet>
  );
}

function BackendAdditionCreateForm({
  form,
  onSubmit,
  isLoading,
  availableCourses = [],
}: {
  form: UseFormReturn<BackendAdditionInput>;
  onSubmit: (data: BackendAdditionInput) => Promise<void>;
  isLoading: boolean;
  availableCourses: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
  }>;
}) {
  const {
    setSearchUser,
    searchUserData,
    users,
    searchUserLoading: isUserLoading,
  } = useUser();

  const {
    data: courses,
    isLoading: isCourseLoading,
    error: CourseError,
  } = useCourse();

  const handleFormSubmit = async (data: BackendAdditionInput) => {
    await onSubmit(data);
    form.reset();
  };

  const userOptions: Option[] = React.useMemo(() => {
    const searchUserArray = searchUserData?.data;
    const allUsersArray = users?.data;

    const usersToDisplay =
      Array.isArray(searchUserArray) && searchUserArray.length > 0
        ? searchUserArray
        : allUsersArray;

    if (!usersToDisplay) return [];

    return usersToDisplay.map((user) => ({
      label: `${user.name} (${user.email})`,
      value: user.id,
    }));
  }, [searchUserData, users]);

  const courseOptions: Option[] = React.useMemo(() => {
    const coursesToUse = courses || availableCourses;
    if (!coursesToUse) return [];
    return coursesToUse.map((course) => ({
      label: `${course.title} - ${formatPrice(course.price)}`,
      value: course.id,
    }));
  }, [courses, availableCourses]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* User Selection */}
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Users *</FormLabel>
              <FormControl>
                <MultiAsyncSelect
                  async
                  loading={isUserLoading}
                  options={userOptions}
                  value={field.value || []}
                  placeholder={
                    isUserLoading
                      ? "Loading users..."
                      : userOptions.length === 0
                        ? "No users available"
                        : "Select users..."
                  }
                  onSearch={setSearchUser}
                  onValueChange={field.onChange}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course Selection */}
        <FormField
          control={form.control}
          name="courseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Course *</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isCourseLoading || !!CourseError}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseOptions.map((course) => (
                      <SelectItem key={course.value} value={course.value}>
                        {course.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter amount"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading && <IconLoader2 className="size-4 animate-spin" />}
            Create Entry
          </Button>
        </div>
      </form>
    </Form>
  );
}
