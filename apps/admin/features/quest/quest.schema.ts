import z from "zod";

export const QuestSchema = z.object({
  id: z.string(),
  banner: z.string(),
  title: z.string(),
  description: z.string(),
  archived: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UpdateQuestSchema = QuestSchema.omit({ id: true })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided." }
  );

export const QuestStatsSchema = z.object({
  totalCount: z.number().default(0),
  ArchievedQuestTotal: z.number().default(0)
})

export const QuestQuerySchema = z.object({
  archived: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .optional()
    .transform((v) => (typeof v === "string" ? v === "true" : v)),

  q: z.string().trim().min(1).optional(),

  sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),

  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const isFileList = typeof FileList !== "undefined"
  ? z.instanceof(FileList).refine((file) => file.length > 0, "Banner image is required")
  : z.any();


export const scheduleQuestFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  banner: z.union([
    isFileList,
    z.string().optional(),
  ]),
});

export const signedURLParams = z.object({
    type: z.enum(["get", "put", "delete"]),
    key: z.string()
})

export const UrlSchema = z.object({
    url: z.string().url()
})

export const signedKeyParams = signedURLParams.pick({ key: true })


export type QuestQueryType = z.infer<typeof QuestQuerySchema>
export type ScheduleQuestFormType = z.infer<typeof scheduleQuestFormSchema>
export type UpdateQuestType = z.infer<typeof UpdateQuestSchema>
export type UrlType = z.infer<typeof UrlSchema>
export type SignedURLParamsType = z.infer<typeof signedURLParams>
export type signedKeyParamsType = z.infer<typeof signedKeyParams>
export type QuestType = z.infer<typeof QuestSchema>
export type QuestStatsType = z.infer<typeof QuestStatsSchema>

