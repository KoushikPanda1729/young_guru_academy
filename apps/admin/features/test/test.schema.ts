import { EnglishLevel } from "@/components/data-table/schema";
import z from "zod";

const OptionSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const AnswerSchema = z.object({
  option: z.string(),
  answer: z.string(),
});

const TestQuestionSchema = z.object({
  questionId: z.string(),
  question: z.string(),
  options: z.array(OptionSchema),
  userAnswer: AnswerSchema.nullable(),
  correctAnswer: AnswerSchema.nullable(),
  isCorrect: z.boolean().nullable(),
  skipped: z.boolean(),
});

export const TestHistorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.string().datetime(),
  studentName: z.string(),
  score: z.number().nullable(),
  level: z.nativeEnum(EnglishLevel).nullable(),
  archived: z.boolean(),
  questions: z.array(TestQuestionSchema),
});

export const TestHistoryQuerySchema = z.object({
  userId: z.string().optional(),

  level: z
    .union([z.nativeEnum(EnglishLevel), z.array(z.nativeEnum(EnglishLevel))])
    .optional()
    .transform((v) => (Array.isArray(v) ? v : v ? [v] : undefined)),

  archived: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .optional()
    .transform((v) => (typeof v === "string" ? v === "true" : v)),

  scoreMin: z.coerce.number().int().nonnegative().optional(),
  scoreMax: z.coerce.number().int().nonnegative().optional(),

  attemptedFrom: z.coerce.date().optional(),
  attemptedTo: z.coerce.date().optional(),

  q: z.string().trim().min(1).optional(),

  sortBy: z.enum(["createdAt", "score", "level"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const TestStatsSchema = z.object({
  totalCount: z.number().default(0),
  todaysTotal: z.number().default(0),
  weeklyTotal: z.number().default(0),
  monthlyTotal: z.number().default(0),
});

export type TestHistoryQueryType = z.infer<typeof TestHistoryQuerySchema>;
export type TestHistoryType = z.infer<typeof TestHistorySchema>;
export type TestStatsType = z.infer<typeof TestStatsSchema>;
