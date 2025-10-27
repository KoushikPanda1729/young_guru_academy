import { z } from "zod";

export const CouponVisibilityEnum = z.enum(["PUBLIC", "PRIVATE"]);

export const createCouponSchema = z.object({
  code: z.string().min(3).max(50),
  name: z.string().min(3).max(100),
  description: z.string().max(255).nullable().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number().positive(),
  maxDiscount: z.number().nullable().optional(),
  minOrderAmount: z.number().nullable().optional(),
  usageLimit: z.number().nullable().optional(),
  userUsageLimit: z.number().nullable().optional(),
  isActive: z.boolean(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date().optional(),
  userIds: z.array(z.string()).optional(),
  courseIds: z.array(z.string()).optional(),
});

export const couponSchema = createCouponSchema.extend({
  id: z.string(),
  usageCount: z.number().default(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const updateCouponSchema = createCouponSchema
  .extend({ id: z.string().min(1) })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const courseResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  price: z.number(),
});

export const couponResponseSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number(),
  maxDiscount: z.number().nullable(),
  minOrderAmount: z.number().nullable(),
  usageLimit: z.number().nullable(),
  usageCount: z.number().default(0),
  userUsageLimit: z.number().nullable(),
  isActive: z.boolean(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date().nullable(),
  users: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      phoneNumber: z.string().nullable(),
    })
  ),
  courses: z.array(courseResponseSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const deleteCouponSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number(),
  maxDiscount: z.number().nullable(),
  minOrderAmount: z.number().nullable(),
  usageLimit: z.number().nullable(),
  usageCount: z.number(),
  userUsageLimit: z.number().nullable(),
  isActive: z.boolean(),
  validFrom: z.date(),
  validUntil: z.coerce.date().nullable().optional(),
  userIds: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CouponType = z.infer<typeof couponSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type CreateCouponOutput = z.infer<typeof couponResponseSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
