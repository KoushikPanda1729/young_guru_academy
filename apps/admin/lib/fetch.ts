import { createFetch, createSchema } from "@better-fetch/fetch";
import { ApiErrorSchema } from "./zod";
import { fetchCallAdminSchema } from "@/features/call/helpers/call.path";
import { fetchOverviewAdminSchema } from "@/features/overview/overview.path";
import { fetchQuestAdminSchema } from "@/features/quest/quest.path";
import {
  fetchFaqAdminSchema,
  fetchPolicyAdminSchema,
} from "@/features/website/website.path";
import { fetchQuestionAdminSchema } from "@/features/question/question.path";
import { fetchTestAdminSchema } from "@/features/test/test.path";
import { fetchNotificationAdminSchema } from "@/features/notification/notification.path";
import { fetchUserAdminSchema } from "@/features/user/user.path";
import {
  fetchContentAdminSchema,
  fetchCourseAdminSchema,
  fetchFolderAdminSchema,
} from "@/features/course/helpers/course.path";
import { fetchCouponAdminSchema } from "@/features/coupon/helpers/coupon.path";
import { fetchShortsAdminSchema } from "@/features/shorts/helpers/shorts.path";
import { fetchPollsAdminSchema } from "@/features/polls/helpers/polls.path";
import { fetchPostAdminSchema } from "@/features/post/helpers/post.path";
import { fetchReviewAdminSchema } from "@/features/reviews/helpers/reviews.path";
import { fetchTransactionSchema } from "@/features/transaction/helpers/transaction-path";
import { fetchBackendAdditionSchema } from "@/features/ba/helpers/ba-path";
import { fetchAdminBannerSchema } from "../features/banner/helpers/banner.path";

export const schema = createSchema(
  {
    ...fetchCallAdminSchema,
    ...fetchOverviewAdminSchema,
    ...fetchQuestAdminSchema,
    ...fetchQuestionAdminSchema,
    ...fetchTestAdminSchema,
    ...fetchFaqAdminSchema,
    ...fetchPolicyAdminSchema,
    ...fetchNotificationAdminSchema,
    ...fetchUserAdminSchema,
    ...fetchCourseAdminSchema,
    ...fetchFolderAdminSchema,
    ...fetchContentAdminSchema,
    ...fetchCouponAdminSchema,
    ...fetchShortsAdminSchema,
    ...fetchPollsAdminSchema,
    ...fetchPostAdminSchema,
    ...fetchReviewAdminSchema,
    ...fetchTransactionSchema,
    ...fetchBackendAdditionSchema,
    ...fetchAdminBannerSchema,
  },
  {
    strict: true,
  }
);

export const $adminFetch = createFetch({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin`,
  timeout: 15000,
  credentials: "include",
  mode: "cors",
  throw: true,
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
  schema: schema,
});

export const $fetch = createFetch({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
  timeout: 15000,
  credentials: "include",
  mode: "cors",
  throw: true,
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

export const $upload = createFetch({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin`,
  timeout: 300000,
  retry: {
    type: "linear",
    attempts: 2,
    delay: 1000,
  },
  defaultError: ApiErrorSchema,
  credentials: "include",
  mode: "cors",

  headers: {
    "x-client-type": "desktop",
  },
});
