import { IdParamSchema } from "@/lib/zod";
import z from "zod";

export const FolderSchema = z.object({
  name: z.string().min(1),
  order: z.number().int().optional(),
});

export const CourseContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  lock: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  order: z.coerce.number(),
  type: z.enum(["FILE", "VIDEO", "QUIZ"]),
  courseId: z.string(),
  folderId: z.string(),
});

export const getFolderSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  lock: z.boolean(),
  order: z.coerce.number().int(),
  courseId: z.string().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const FolderParamsSchema = IdParamSchema.extend({
  folderId: z.string().min(1),
});

export const UpdateFolderSchema = FolderSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided." }
);

export const fileSchema = z.object({
  key: z.string().min(1),
  type: z.string().min(1),
  size: z.number().positive(),
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const inputFileSchema = z.object({
  key: z.string().min(1),
  type: z.string().min(1),
  size: z.number().positive(),
});

export const responseFileSchema = z
  .object({
    file: fileSchema.nullable(),
  })
  .and(CourseContentSchema);

// Single question schema
export const quizQuestionSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  options: z.object({
    a: z.string(),
    b: z.string(),
    c: z.string(),
    d: z.string(),
  }),
  answer: z.enum(["a", "b", "c", "d"]),
});

// Quiz entity (basic info)
export const basicEntitySchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// Question as returned from DB
const questionSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  question: z.string(),
  options: z.object({
    a: z.string(),
    b: z.string(),
    c: z.string(),
    d: z.string(),
  }),
  answer: z.enum(["a", "b", "c", "d"]),
  quizId: z.string(),
});

export const quizReturnSchema = basicEntitySchema.extend({
  questions: z.array(questionSchema),
});

export const successSchema = z.object({
  success: z.boolean(),
});

export const videoSchema = z.object({
  id: z.string(),
  duration: z.number().nonnegative(),
  guid: z.string(),
  collectionId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const videoResponseSchema = z
  .object({
    video: videoSchema,
  })
  .and(CourseContentSchema);

export const quizResponseSchema = z
  .object({
    quiz: quizReturnSchema.nullable(),
  })
  .and(CourseContentSchema);

export type QuizOutputType = z.infer<typeof quizResponseSchema>;
export type QuizFormType = z.infer<typeof quizQuestionSchema>;
export type QuizFormArrayType = z.infer<typeof quizReturnSchema>;
export type QuizReturnType = z.infer<typeof quizReturnSchema>;

export type FileType = z.infer<typeof inputFileSchema>;
export type FileOutput = z.infer<typeof responseFileSchema>;
export type VideoOutputType = z.infer<typeof videoResponseSchema>;
export type FolderParamsType = z.infer<typeof FolderParamsSchema>;
export type UpdateFolderType = z.infer<typeof UpdateFolderSchema>;
export type CourseFolderType = z.infer<typeof getFolderSchema>;
export type CreateFolderType = z.infer<typeof FolderSchema>;
