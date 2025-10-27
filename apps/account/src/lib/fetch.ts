import { createFetch, createSchema } from "@better-fetch/fetch";
import {
  ApiErrorSchema,
  ApiSuccessSchema,
  ApplyCouponSchema,
  CouponValidationResultSchema,
  CourseDetailsSchema,
  coursesSchema,
  createOrderSchema,
  GatewayResponseSchema,
  IdParamSchema,
  orderResponseSchema,
  paymentDataSchema,
  signedURLParams,
  updateOrderStatus,
  UrlSchema,
} from "./zod";

export const fetchSchema = createSchema(
  {
    "@get/courses/signed-url": {
      query: signedURLParams,
      output: ApiSuccessSchema(UrlSchema),
    },
    "@get/courses": {
      output: ApiSuccessSchema(coursesSchema),
    },
    "@get/courses/:id": {
      params: IdParamSchema,
      output: ApiSuccessSchema(CourseDetailsSchema),
    },
    "@get/courses/my": {
      output: ApiSuccessSchema(coursesSchema),
    },
    "@post/coupon/apply": {
      input: ApplyCouponSchema,
      output: ApiSuccessSchema(CouponValidationResultSchema),
    },
    "@post/order": {
      input: createOrderSchema,
      output: ApiSuccessSchema(orderResponseSchema),
    },
    "@patch/order/:id": {
      params: IdParamSchema,
      input: updateOrderStatus,
    },
    "@post/payment/verify": {
      input: paymentDataSchema,
      output: ApiSuccessSchema(GatewayResponseSchema),
    },
  },
  {
    strict: true,
  }
);

export const $fetch = createFetch({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
  timeout: 15000,
  credentials: "include",
  mode: "cors",
  throw: true,
  schema: fetchSchema,
  defaultError: ApiErrorSchema,
  retry: {
    type: "exponential",
    attempts: 3,
    baseDelay: 500,
    maxDelay: 5000,
  },
  headers: {
    "x-client-type": "desktop",
  },
});
