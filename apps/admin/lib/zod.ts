import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { dataTableConfig } from "@t2p-admin/ui/config/data-table";

export function isValidIndianNumber(val: string): boolean {
  const phone = parsePhoneNumberFromString(val, "IN");
  return !!(phone && phone.isValid() && phone.country === "IN");
}

export const LoginFormSchema = z.object({
  phoneNumber: z.string().refine(isValidIndianNumber, {
    message: "Please enter a valid Indian phone number",
  }),
});

export const phoneVerifyFormSchema = z.object({
  phoneNumber: z.string().refine(isValidIndianNumber, {
    message: "Please enter a valid Indian phone number",
  }),
  code: z
    .string()
    .length(4, "Verification code must be 4 digits")
    .regex(/^\d+$/, "Verification code must be numeric"),
});

export const ApiBaseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  message: z.string(),
  timestamp: z.coerce.date(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const ApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ApiBaseSchema.extend({
    success: z.literal(true),
    data: dataSchema.nullable(),
  });

export const ApiErrorSchema = ApiBaseSchema.extend({
  success: z.literal(false),
  statusCode: z.number(),
  message: z.string(),
  timestamp: z.string().datetime(),
  errors: z.array(z.unknown()).optional(),
  data: z.unknown().optional(),
  environment: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const ApiPaginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  ApiBaseSchema.extend({
    success: z.literal(true),
    data: z.array(itemSchema),
    meta: z.object({
      pagination: PaginationSchema,
    }),
  });

export const IdParamSchema = z.object({
  id: z.string().min(1),
});

export const IdsBodySchema = z.object({
  ids: z.array(z.string().min(1)),
});

export const NoContentSchema = z.undefined();
export const EmptyArraySchema = z.array(z.unknown()).length(0);

export const TableQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  offset: z.coerce.number().min(0).default(0),
  sortBy: z.string().default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  filterField: z.string().optional(),
  filterOperator: z
    .enum(["contains", "lt", "eq", "ne", "lte", "gt", "gte"])
    .optional(),
  filterValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

export const pageQuery = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number(),
});

export const EmailPasswordLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
});

export const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;
export type SortItemSchema = z.infer<typeof sortingItemSchema>;

export type IdType = z.infer<typeof IdParamSchema>;
export type IdsType = z.infer<typeof IdsBodySchema>;
export type ApiSuccessType<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof ApiSuccessSchema<T>>
>;
export type ApiErrorType = z.infer<typeof ApiErrorSchema>;
export type TableQuery = z.infer<typeof TableQuerySchema>;
export type PageQueryType = z.infer<typeof pageQuery>;
