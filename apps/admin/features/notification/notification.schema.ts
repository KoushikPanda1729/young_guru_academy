import { parseAsInteger, parseAsStringEnum } from "nuqs";
import z from "zod";

export const notificationStatsSchema = z.object({
  totalNotification: z.number().int().nonnegative(),
  totalNotificationSent: z.number().int().nonnegative(),
  totalNotificationScheduled: z.number().int().nonnegative(),
});

export const responseNotificationSchema = z.object({
  success: z.boolean(),
  scheduledCount: z.number(),
  scheduledFor: z.string(),
});

export const PushNotificationSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  segments: z.array(z.string()),
  message: z.string(),
  status: z.enum(["schedule", "sent"]),
  image: z.string().url().optional().nullable(),
  actionUrl: z.string().optional().nullable(),
  schedule: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const messageParams = z.object({
  message_id: z.string().min(1),
});

export const scheduleNotificationFormSchema = z
  .object({
    segments: z.array(z.string().min(1)),
    title: z.string().optional(),
    description: z.string().min(1),
    landingScreen: z.string().optional(),
    customUrl: z.string().optional(),
    schedule: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.landingScreen === "custom") {
        return !!data.customUrl && data.customUrl.trim().length > 0;
      }
      return true;
    },
    {
      message: "Custom URL is required when landing screen is 'custom'",
      path: ["customUrl"],
    }
  );

export const createSegmentSchema = z.object({
  name: z.string(),
  description: z.string(),
  filters: z.array(
    z.object({
      field: z.literal("tag"),
      relation: z.enum([">", "<", "="]),
      key: z.string(),
      value: z.string(),
    })
  ),
});

export const segmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  app_id: z.string().uuid(),
  read_only: z.boolean(),
  is_active: z.boolean(),
  source: z.string(),
  segment_status: z.string().nullable(),
  loading_started_at: z.string().datetime().nullable(),
  loading_completed_at: z.string().datetime().nullable(),
});

export const SegmentsResponseSchema = z.object({
  total_count: z.number(),
  offset: z.number(),
  limit: z.number(),
  segments: z.array(segmentSchema),
});

export const deleteSegmentSchema = z.object({
  segment_id: z.string().min(1),
});

export const statusSchema = z
  .union([z.enum(["sent", "schedule"]), z.array(z.enum(["sent", "schedule"]))])
  .transform((val) => (Array.isArray(val) ? val[0] : val))
  .default("schedule");

export const notificationSearchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  status: parseAsStringEnum(["sent", "schedule"]).withDefault("sent"),
};

export const notificationSearchQuery = z.object({
  page: z.coerce.number().int().default(1),
  perPage: z.coerce.number().int().default(10),
  status: statusSchema,
});

export type PushNotificationType = z.infer<typeof PushNotificationSchema>;
export type NotificationMesageType = z.infer<typeof messageParams>;
export type ScheduleNotificationFormType = z.infer<
  typeof scheduleNotificationFormSchema
>;
export type PushNotificationStatsType = z.infer<typeof notificationStatsSchema>;
export type CreateSegmentType = z.infer<typeof createSegmentSchema>;
export type DeleteSegmentType = z.infer<typeof deleteSegmentSchema>;
export type NotificationType = "PUSH";
export type NotificationQuery = z.infer<typeof notificationSearchQuery>;
