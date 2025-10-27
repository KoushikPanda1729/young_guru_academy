import { $fetch } from "./fetch";
import {
  ApplyCouponType,
  CreateOrderInput,
  IdType,
  PaymentDataType,
  SignedURLParamsType,
  UpdateOrderInput,
} from "./zod";

export const api = {
  courses: {
    getSignedUrl: (query: SignedURLParamsType) =>
      $fetch("@get/courses/signed-url", { query }),
    getCourses: () => $fetch("@get/courses"),
    getCourseById: (params: IdType) => $fetch("@get/courses/:id", { params }),
    getMyCourses: () => $fetch("@get/courses/my"),
  },

  order: {
    createOrder: (body: CreateOrderInput) => $fetch("@post/order", { body }),
    updateOrderById: (params: IdType, body: UpdateOrderInput) =>
      $fetch("@patch/order/:id", { params, body }),
  },

  coupon: {
    applyCoupon: (body: ApplyCouponType) =>
      $fetch("@post/coupon/apply", { body }),
  },

  payment: {
    verify: (body: PaymentDataType) => $fetch("@post/payment/verify", { body }),
  },
};
