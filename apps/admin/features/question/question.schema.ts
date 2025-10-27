import { isFileList } from "@/features/quest/quest.schema";
import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: z.string(),
  options: z.object({
    A: z.string().min(1),
    B: z.string().min(1),
    C: z.string().min(1),
    D: z.string().min(1),
  }),
  answer: z.string(),
  archived: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const QuestionQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  archived: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return undefined;
  }, z.boolean().optional()),
  sortBy: z.enum(["createdAt", "updatedAt", "question", "category"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});
export const UpdateQuestionSchema = QuestionSchema.omit({ id: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const createQuestionSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  category: z.string().min(1, "Category is required"),
  options: z.object({
    A: z.string(),
    B: z.string(),
    C: z.string(),
    D: z.string(),
  }),
  answer: z.string().min(1, "Answer is required"),
});

export const questionStatsSchema = z.object({
  totalCount: z.number().default(0),
  CategoryACount: z.number().default(0),
  CategoryBCount: z.number().default(0),
  CategoryCCount: z.number().default(0),
});

export const uploadExcelSchema = z.object({
  excel: isFileList,
});

export const questionsArray = z.object({
  questions: z.array(QuestionSchema),
});

export const QuestionFormSchema = z.union([
  createQuestionSchema,
  UpdateQuestionSchema,
]);

export type QuestionQueryType = z.infer<typeof QuestionQuerySchema>;
export type QuestionType = z.infer<typeof QuestionSchema>;
export type CreateQuestionType = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionType = z.infer<typeof UpdateQuestionSchema>;
export type QuestionFormType = z.infer<typeof QuestionFormSchema>;
export type UploadExcelType = z.infer<typeof uploadExcelSchema>;
export type QuestionStatsType = z.infer<typeof questionStatsSchema>;
