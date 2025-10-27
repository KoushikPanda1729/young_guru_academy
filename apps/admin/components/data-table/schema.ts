/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export enum CallStatus {
  CREATED = "CREATED",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
}

export const CallStatusSchema = z.nativeEnum(CallStatus);

export const AudioCallItemSchema = z.object({
  id: z.string(),
  callerId: z.string(),
  receiverId: z.string(),
  roomId: z.string(),
  status: CallStatusSchema,
  createdAt: z.preprocess((arg) => new Date(arg as any), z.date()),
  startedAt: z.preprocess((arg) => new Date(arg as any), z.date()),
  endedAt: z.preprocess((arg) => new Date(arg as any), z.date().nullable()),
  durationSecs: z.number().nullable(),
  caller: z.object({
    userId: z.string(),
    user: z.object({
      name: z.string(),
      email: z.string().email(),
      phoneNumber: z.string().nullable(),
    }),
  }),
  receiver: z.object({
    userId: z.string(),
    user: z.object({
      name: z.string(),
      email: z.string().email(),
      phoneNumber: z.string().nullable(),
    }),
  }),
  feedbacks: z.array(
    z.object({ id: z.string(), rating: z.number().nullable() })
  ),
});

export const AudioCallQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  status: CallStatusSchema.optional(),
  startDate: z.preprocess((arg) => new Date(arg as any), z.date()).optional(),
  endDate: z.preprocess((arg) => new Date(arg as any), z.date()).optional(),
  profileId: z.string().optional(),
  userId: z.string().optional(),
});

export enum NotificationType {
  PUSH = "PUSH",
}

export const NotificationTypeSchema = z.nativeEnum(NotificationType);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const NotificationItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  link: z.string().nullable(),
  type: NotificationTypeSchema,
  userId: z.string(),
  isSent: z.boolean(),
  read: z.boolean(),
  scheduledAt: z.preprocess((arg) => new Date(arg as any), z.date().nullable()),
  createdAt: z.preprocess((arg) => new Date(arg as any), z.date()),
  updatedAt: z.preprocess((arg) => new Date(arg as any), z.date()),
  user: UserSchema,
});

export const NotificationQuerySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  isSent: z.boolean().optional(),
  startDate: z.preprocess((arg) => new Date(arg as any), z.date()).optional(),
  endDate: z.preprocess((arg) => new Date(arg as any), z.date()).optional(),
  title: z.string().optional(),
});

export const QuestSchema = z.object({
  id: z.string(),
  title: z.string(),
  schedule: z.preprocess((arg) => new Date(arg as any), z.date()),
});

export enum EnglishLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export const EnglishLevelSchema = z.nativeEnum(EnglishLevel);
