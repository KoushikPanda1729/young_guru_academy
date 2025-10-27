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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@t2p-admin/ui/components/select";
import { Switch } from "@t2p-admin/ui/components/switch";
import {
  IconEdit,
  IconEye,
  IconLoader2,
  IconX,
  IconPercentage,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { format } from "date-fns";
import {
  CreateCouponInput,
  CreateCouponOutput,
  createCouponSchema,
} from "../helpers/coupon.schema";
import { useUser } from "@/features/user/hooks/useUser";
import { useCourse } from "@/features/course/hooks/useCourse";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@t2p-admin/ui/components/popover";
import { cn } from "@t2p-admin/ui/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@t2p-admin/ui/components/calendar";
import { CourseType } from "@/features/course/helpers/course.schema";
import { formatPrice } from "@/features/course/helpers/format-price";
import { MultiAsyncSelect, Option } from "../../../components/async-select";

interface CouponSheetProps {
  coupon: CreateCouponOutput | null;
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "create";
  onModeChange: (mode: "view" | "edit") => void;
  onSave: (data: CreateCouponInput) => Promise<void>;
  isLoading?: boolean;
  availableCourses?: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
  }>;
}

export function CouponSheet({
  coupon,
  isOpen,
  onClose,
  mode,
  onModeChange,
  onSave,
  isLoading = false,
  availableCourses = [],
}: CouponSheetProps) {
  const form = useForm<CreateCouponInput>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      maxDiscount: undefined,
      minOrderAmount: undefined,
      usageLimit: undefined,
      userUsageLimit: undefined,
      isActive: true,
      validFrom: new Date(),
      validUntil: undefined,
      userIds: [],
      courseIds: [],
    },
  });

  React.useEffect(() => {
    if (mode === "create") {
      form.reset({
        code: "",
        name: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: 0,
        maxDiscount: undefined,
        minOrderAmount: undefined,
        usageLimit: undefined,
        userUsageLimit: undefined,
        isActive: true,
        validFrom: new Date(),
        validUntil: undefined,
        userIds: [],
        courseIds: [],
      });
    } else if (coupon) {
      form.reset({
        code: coupon.code || "",
        name: coupon.name || "",
        description: coupon.description || "",
        discountType: coupon.discountType || "PERCENTAGE",
        discountValue: coupon.discountValue || 0,
        maxDiscount: coupon.maxDiscount || undefined,
        minOrderAmount: coupon.minOrderAmount || undefined,
        usageLimit: coupon.usageLimit || undefined,
        userUsageLimit: coupon.userUsageLimit || undefined,
        isActive: coupon.isActive ?? true,
        validFrom: coupon.validFrom || new Date(),
        validUntil: coupon.validUntil || undefined,
        userIds: coupon.users?.map((u) => u.id) || [],
        courseIds: coupon.courses?.map((course) => course.id) || [],
      });
    }
  }, [coupon, form, mode]);

  const handleSubmit = async (data: CreateCouponInput) => {
    try {
      await onSave(data);
      onModeChange("view");
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Auto-generate code from name
  const watchName = form.watch("name");
  React.useEffect(() => {
    if (watchName && mode === "create") {
      const code = watchName
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "")
        .substring(0, 20);
      form.setValue("code", code);
    }
  }, [watchName, form, mode]);

  if (!coupon && mode !== "create") return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-[700px] overflow-y-auto px-6 py-4">
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
                  ? "View Coupon"
                  : mode === "edit"
                    ? "Edit Coupon"
                    : "Create Coupon"}
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
              ? "View coupon details and information."
              : mode === "edit"
                ? "Edit coupon details and save changes."
                : "Create a new coupon with discount rules and restrictions"}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-2" />

        <div className="mt-4">
          {mode === "view" ? (
            <CouponViewMode coupon={coupon!} />
          ) : (
            <CouponEditMode
              form={form}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isCreateMode={mode === "create"}
              onSuccess={handleClose}
              availableCourses={availableCourses}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function CouponViewMode({ coupon }: { coupon: CreateCouponOutput }) {
  const formatDiscount = (type: string, value: number) => {
    return type === "PERCENTAGE" ? `{value}%` : formatPrice(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={coupon.isActive ? "default" : "secondary"}>
          {coupon.isActive ? "Active" : "Inactive"}
        </Badge>
        <Badge variant="outline" className="gap-1">
          {coupon.discountType === "PERCENTAGE" ? (
            <IconPercentage className="size-3" />
          ) : (
            <IconCurrencyDollar className="size-3" />
          )}
          {formatDiscount(coupon.discountType, coupon.discountValue)}
        </Badge>
        {coupon.usageCount > 0 && (
          <Badge variant="secondary">{coupon.usageCount} uses</Badge>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Code
            </h3>
            <div className="p-4 bg-muted rounded-xl border text-sm leading-relaxed font-mono font-bold">
              {coupon.code}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Name
            </h3>
            <div className="p-4 bg-muted rounded-xl border text-sm leading-relaxed font-medium">
              {coupon.name}
            </div>
          </div>
        </div>

        {coupon.description && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Description
            </h3>
            <div className="p-4 bg-muted rounded-xl border text-sm leading-relaxed">
              {coupon.description}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Discount
            </h3>
            <div className="p-4 bg-muted rounded-xl border">
              <div className="flex items-center gap-2">
                {coupon.discountType === "PERCENTAGE" ? (
                  <IconPercentage className="size-4 text-primary" />
                ) : (
                  <IconCurrencyDollar className="size-4 text-primary" />
                )}
                <span className="text-lg font-semibold text-primary">
                  {formatDiscount(coupon.discountType, coupon.discountValue)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {coupon.discountType === "PERCENTAGE"
                  ? "Percentage off"
                  : "Fixed amount off"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Usage
            </h3>
            <div className="p-4 bg-muted rounded-xl border">
              <span className="text-lg font-semibold">
                {coupon.usageCount}
                {coupon.usageLimit && ` / ${coupon.usageLimit}`}
              </span>
              <p className="text-xs text-muted-foreground mt-1">Times used</p>
            </div>
          </div>
        </div>

        {(coupon.maxDiscount || coupon.minOrderAmount) && (
          <div className="grid grid-cols-2 gap-4">
            {coupon.maxDiscount && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-1">
                  Max Discount
                </h3>
                <p className="text-sm text-foreground">
                  {formatPrice(coupon.maxDiscount)}
                </p>
              </div>
            )}
            {coupon.minOrderAmount && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-1">
                  Min Order Amount
                </h3>
                <p className="text-sm text-foreground">
                  {formatPrice(coupon.minOrderAmount)}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-1">
              Valid From
            </h3>
            <p className="text-sm text-foreground">
              {format(new Date(coupon.validFrom), "PPP")}
            </p>
          </div>
          {coupon.validUntil && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-1">
                Valid Until
              </h3>
              <p className="text-sm text-foreground">
                {format(new Date(coupon.validUntil), "PPP")}
              </p>
            </div>
          )}
        </div>

        {coupon.users && coupon.users.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Assigned Users ({coupon.users.length})
            </h3>
            <div className="p-4 bg-muted rounded-xl border space-y-2">
              {coupon.users.map((user) => (
                <div key={user.id} className="p-2 bg-background rounded border">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {user.phoneNumber && (
                    <p className="text-xs text-muted-foreground">
                      {user.phoneNumber}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {coupon.courses && coupon.courses.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Applicable Courses ({coupon.courses.length})
            </h3>
            <div className="p-4 bg-muted rounded-xl border space-y-2">
              {coupon.courses.map((course) => (
                <div
                  key={course.id}
                  className="flex justify-between items-center p-2 bg-background rounded border"
                >
                  <div>
                    <p className="text-sm font-medium">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.slug}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(course.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3">
            Metadata
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">ID:</span>
              <span className="ml-2 font-mono text-xs text-foreground">
                {coupon.id}
              </span>
            </div>
            {coupon.createdAt && (
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2 text-foreground">
                  {format(new Date(coupon.createdAt), "PPP 'at' p")}
                </span>
              </div>
            )}
            {coupon.updatedAt && (
              <div>
                <span className="text-muted-foreground">Updated:</span>
                <span className="ml-2 text-foreground">
                  {format(new Date(coupon.updatedAt), "PPP 'at' p")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CouponEditMode({
  form,
  onSubmit,
  isLoading,
  isCreateMode,
  onSuccess,
  availableCourses = [],
}: {
  form: UseFormReturn<CreateCouponInput>;
  onSubmit: (data: CreateCouponInput) => Promise<void>;
  isLoading: boolean;
  isCreateMode: boolean;
  onSuccess?: () => void;
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
  const watchDiscountType = form.watch("discountType");

  const handleFormSubmit = async (data: CreateCouponInput) => {
    try {
      await onSubmit(data);
      form.reset();
      onSuccess?.();
    } catch (err) {
      console.error("Submission failed", err);
    }
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
      icon: undefined,
    }));
  }, [searchUserData, users]);

  const courseOptions: Option[] = React.useMemo(() => {
    const coursesToUse = courses || availableCourses;
    if (!coursesToUse) return [];
    return coursesToUse.map((course: CourseType) => ({
      label: `${course.title} - ${formatPrice(course.price)}`,
      value: course.id,
      icon: undefined,
    }));
  }, [courses, availableCourses]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter coupon name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="COUPON_CODE"
                    className="font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter coupon description..."
                  className="min-h-[80px] resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Discount Settings */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">
                      Fixed Amount ($)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Discount Value *{" "}
                  {watchDiscountType === "PERCENTAGE" ? "(%)" : "($)"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={watchDiscountType === "PERCENTAGE" ? "100" : undefined}
                    placeholder={
                      watchDiscountType === "PERCENTAGE" ? "10" : "50.00"
                    }
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
        </div>

        {/* Limits */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxDiscount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Discount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="100.00"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minOrderAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Order Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="50.00"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Usage Limits */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="usageLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Usage Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="100"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userUsageLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Per User Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Validity Period */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valid From *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP p")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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

          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Valid Until</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP p")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
        </div>

        {/* User Selection - Multi Select */}
        <FormField
          control={form.control}
          name="userIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Users</FormLabel>
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
                  maxCount={3}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Course Selection - Multi Select */}
        <FormField
          control={form.control}
          name="courseIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Courses</FormLabel>
              <FormControl>
                <MultiAsyncSelect
                  async
                  loading={isCourseLoading}
                  options={courseOptions}
                  value={field.value || []}
                  placeholder={
                    isCourseLoading
                      ? "Loading courses..."
                      : CourseError
                        ? "Error loading courses"
                        : courseOptions.length === 0
                          ? "No courses available"
                          : "Select courses..."
                  }
                  onValueChange={field.onChange}
                  maxCount={3}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable or disable this coupon
                </div>
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
            {isCreateMode ? "Create Coupon" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
