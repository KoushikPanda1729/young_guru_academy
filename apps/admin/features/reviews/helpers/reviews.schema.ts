import { z } from "zod";

export const EnglishLevelEnum = z.enum([
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
]);
export const FeedbackTypeEnum = z.enum(["REVIEW", "REPORT"]);

const UserBriefSchema = z.object({
  name: z.string(),
  image: z.string().nullable(),
  email: z.string(),
  phoneNumber: z.string().nullable(),
});

const StudentProfileBriefSchema = z.object({
  userId: z.string(),
  level: EnglishLevelEnum,
  averageRating: z.number().nullable(),
  user: UserBriefSchema,
});

const AudioCallBriefSchema = z.object({
  id: z.string(),
});

export const StudentFeedbackItemSchema = z.object({
  id: z.string().cuid(),
  type: FeedbackTypeEnum,
  reviewerId: z.string(),
  studentId: z.string(),
  roomId: z.string(),
  rating: z.number().int(),
  review: z.string().nullable(),
  createdAt: z.coerce.date(),
  reviewer: StudentProfileBriefSchema,
  student: StudentProfileBriefSchema,
  room: AudioCallBriefSchema,
});

export const StudentFeedbackItemsSchema = z.array(StudentFeedbackItemSchema);

export type StudentFeedbackItem = z.infer<typeof StudentFeedbackItemSchema>;
export type StudentFeedbackItems = z.infer<typeof StudentFeedbackItemsSchema>;
