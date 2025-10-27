import {
  ApiPaginatedSchema,
  ApiSuccessSchema,
  EmptyArraySchema,
} from "@/lib/zod";

import {
  messageParams,
  scheduleNotificationFormSchema,
  createSegmentSchema,
  deleteSegmentSchema,
  PushNotificationSchema,
  notificationStatsSchema,
  responseNotificationSchema,
  segmentSchema,
  SegmentsResponseSchema,
  notificationSearchQuery,
} from "./notification.schema";

export const fetchNotificationAdminSchema = {
  "@get/notification": {
    query: notificationSearchQuery,
    output: ApiPaginatedSchema(PushNotificationSchema),
  },

  "@get/notification/:message_id": {
    params: messageParams,
    output: ApiSuccessSchema(PushNotificationSchema),
  },

  "@get/notification/stats": {
    output: ApiSuccessSchema(notificationStatsSchema),
  },

  "@post/notification": {
    input: scheduleNotificationFormSchema,
    output: ApiSuccessSchema(responseNotificationSchema),
  },

  "@post/notification/cancel/:message_id": {
    params: messageParams,
    output: ApiSuccessSchema(EmptyArraySchema),
  },

  "@get/notification/segments": {
    output: ApiSuccessSchema(SegmentsResponseSchema),
  },

  "@post/notification/segments": {
    input: createSegmentSchema,
    output: ApiSuccessSchema(segmentSchema),
  },

  "@delete/notification/segments/:segment_id": {
    params: deleteSegmentSchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },

  "@delete/notification/:message_id": {
    params: messageParams,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
};
