import { ApiPaginatedSchema, ApiSuccessSchema, IdParamSchema, TableQuerySchema } from "@/lib/zod";
import { couponResponseSchema, createCouponSchema, updateCouponSchema } from "./coupon.schema";

export const fetchCouponAdminSchema = {
  "@get/coupon": {
    query: TableQuerySchema,
    output: ApiPaginatedSchema(couponResponseSchema), // updated to return full coupon + courses
  },
  "@get/coupon/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(couponResponseSchema),
  },
  "@post/coupon": {
    input: createCouponSchema,
    output: ApiSuccessSchema(couponResponseSchema),
  },
  "@delete/coupon/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(couponResponseSchema),
  },
  "@patch/coupon/:id": {
    params: IdParamSchema,
    input: updateCouponSchema,
    output: ApiSuccessSchema(couponResponseSchema),
  },
};
