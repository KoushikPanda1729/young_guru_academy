import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

function isValidIndianNumber(val: string): boolean {
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
  timestamp: z.string().datetime(),
  meta: z.record(z.unknown()).optional(),
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
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z.string().default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  filterField: z.string().optional(),
  filterOperator: z
    .enum(["contains", "lt", "eq", "ne", "lte", "gt", "gte"])
    .optional(),
  filterValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

export const paymentDataSchema = z.object({
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  gatewayResponse: z.any().optional(),
});

export const OrderIdParams = z.object({
  orderId: z.string().min(1),
});

export const PaymentStatus = z.enum([
  "CREATED",
  "AUTHORIZED",
  "CAPTURED",
  "FAILED",
  "REFUNDED",
]);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

export const GatewayResponseSchema = z.object({
  gatewayResponse: z.any(),
  status: PaymentStatus,
  id: z.string(),
  orderId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string().nullable(),
  method: z.string().nullable(),
  razorpayPaymentId: z.string(),
  razorpayOrderId: z.string(),
  amount: z.number(),
  currency: z.string(),
  razorpaySignature: z.string().nullable(),
  isVerified: z.boolean(),
  fee: z.number().nullable(),
  tax: z.number().nullable(),
  cardId: z.string().nullable(),
  bank: z.string().nullable(),
  wallet: z.string().nullable(),
  vpa: z.string().nullable(),
  errorCode: z.string().nullable(),
  errorDescription: z.string().nullable(),
  razorpayCreatedAt: z.coerce.date().nullable(),
  capturedAt: z.coerce.date().nullable(),
});

enum DurationUnit {
  days = "days",
  months = "months",
  years = "years",
  lifetime = "lifetime",
}

export const createOrderSchema = z.object({
  amount: z.number().int().positive({
    message: "Amount must be a positive integer",
  }),
  currency: z.string().length(3, {
    message: "Currency must be a valid 3-letter ISO code",
  }),
  customer: z.object({
    id: z.string().min(1),
    name: z.string().min(1, "Customer name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(7).max(15).optional(),
  }),
  items: z.array(
    z.object({
      price: z.number().positive(),
      courseId: z.string(),
      courseName: z.string(),
      coursePrice: z.number(),
      originalPrice: z.number(),
      durationUnit: z.nativeEnum(DurationUnit),
      durationValue: z.number().int().nullable().optional(),
      finalPrice: z.number(),
    })
  ),
  couponCode: z.string().optional(),
  notes: z.record(z.string()).optional(),
  ipAddress: z.string().ip({ version: "v4" }).optional(),
  idempotencyKey: z.string().min(1),
  userAgent: z.string().optional(),
});
export const updateOrderStatus = z.object({
  status: z.enum([
    "CREATED",
    "ATTEMPTED",
    "PAID",
    "PARTIALLY_PAID",
    "FAILED",
    "CANCELLED",
    "EXPIRED",
    "REFUNDED",
  ]),
});

export const couponSchema = z.object({
  id: z.string(),
  description: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string().nullable(),
  name: z.string(),
  code: z.string(),
  discountType: z.string(),
  discountValue: z.number(),
  maxDiscount: z.number().nullable(),
  minOrderAmount: z.number().nullable(),
  usageLimit: z.number().nullable(),
  usageCount: z.number(),
  userUsageLimit: z.number().nullable(),
  isActive: z.boolean(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date().nullable(),
});

export const courseCouponSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  couponId: z.string(),
  courseId: z.string(),
  coupon: couponSchema,
});

export const ApplyCouponSchema = z.object({
  couponCode: z.string(),
  orderAmount: z.number().min(1),
  courseId: z.string(),
});

export const enrollmentSchema = z.object({
  id: z.string(),
});

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  mrp: z.number().nullable().optional(),
  price: z.number().nullable().optional(),
  isPublished: z.boolean(),
  thumbnail: z.string().nullable().optional(),
  durationUnit: z.nativeEnum(DurationUnit),
  durationValue: z.number().int().nullable().optional(),
  slug: z.string(),
  courseCoupons: z.array(z.unknown()), // refine later if coupons have a shape
  enrollments: z.array(z.unknown()), // refine later if enrollments have a shape
  isPurchased: z.boolean().default(false),
});

export const FolderContentSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
  courseId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  contents: z.array(z.unknown()), // refine later
});

export const CourseDetailsSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  mrp: z.number().nullable().optional(),
  price: z.number().nullable().optional(),
  isPublished: z.boolean(),
  durationValue: z.number().int().nullable().optional(),
  durationUnit: z.nativeEnum(DurationUnit),
  thumbnail: z.string().nullable().optional(),
  collectionId: z.string(),
  totalDuration: z.number().nullable(),
  totalStudents: z.number(),
  totalLessons: z.number(),
  averageRating: z.number().nullable(),
  totalReviews: z.number(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  publishedAt: z.string().datetime().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),

  folders: z.array(z.lazy(() => FolderContentSchema)),
  enrollments: z.array(enrollmentSchema),
  courseCoupons: z.array(courseCouponSchema),

  // extra flags
  isEnrolled: z.boolean(),
  isPurchased: z.boolean().default(false),
});

export const CouponValidationResultSchema = z.object({
  isValid: z.boolean(),
  coupon: couponSchema.nullable().optional(),
  discountAmount: z.number(),
  finalAmount: z.number(),
  error: z.string().nullable().optional(),
});

export const coursesSchema = z.array(CourseSchema).nullable();
export type CourseDetails = z.infer<typeof CourseDetailsSchema>;
export type Course = z.infer<typeof CourseSchema>;

export const OrderStatusEnum = z.enum([
  "CREATED",
  "ATTEMPTED",
  "PAID",
  "PARTIALLY_PAID",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
  "REFUNDED",
]);

export const PaymentPlatformEnum = z.enum(["WEB", "MOBILE", "API", "ADMIN"]);

export const orderSchema = z
  .object({
    id: z.string(),
    status: OrderStatusEnum,
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string().nullable(),
    ipAddress: z.string().nullable(),
    userAgent: z.string().nullable(),
    razorpayOrderId: z.string(),
    amount: z.number(),
    currency: z.string(),
    razorpayCreatedAt: z.date().nullable(),
    receipt: z.string().nullable(),
    guestEmail: z.string().nullable(),
    guestPhone: z.string().nullable(),
    guestName: z.string().nullable(),
    couponId: z.string().nullable(),
    discountAmount: z.number(),
    platform: PaymentPlatformEnum,
    notes: z.any().nullable(),
  })
  .nullable();

export const signedURLParams = z.object({
  type: z.enum(["get", "put", "delete"]),
  key: z.string(),
});

export const UrlSchema = z.object({
  url: z.string().url(),
});

export const orderResponseSchema = z.object({
  orderId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
});

export type SignedURLParamsType = z.infer<typeof signedURLParams>;
export type ApplyCouponType = z.infer<typeof ApplyCouponSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderStatus>;

export type GatewayResponse = z.infer<typeof GatewayResponseSchema>;

export type PaymentDataType = z.infer<typeof paymentDataSchema>;
export type OrderIdType = z.infer<typeof OrderIdParams>;
export type IdType = z.infer<typeof IdParamSchema>;
export type IdsType = z.infer<typeof IdsBodySchema>;
export type ApiSuccessType<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof ApiSuccessSchema<T>>
>;
export type ApiErrorType = z.infer<typeof ApiErrorSchema>;
export type TableQuery = z.infer<typeof TableQuerySchema>;
