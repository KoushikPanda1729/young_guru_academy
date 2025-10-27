import z from "zod";

export const FaqSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  status: z.enum(["draft", "published", "archived"]),
  archived: z.boolean().optional(),
});

export const ArrayOfFaqSchema = z.array(FaqSchema);

export const UpdateFaqSchema = FaqSchema.omit({ id: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const PolicySchema = z.object({
  id: z.string().min(1),
  type: z.enum(["TERMS", "PRIVACY", "REFUND", "COOKIE", "OTHERS"]),
  content: z
    .string()
    .min(10, "Policy content must be at least 10 characters long"),
  status: z.enum(["draft", "published"]).default("draft"),
  updatedAt: z.string().datetime(),
});

export const UpdatePolicySchema = PolicySchema.omit({ id: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const CreatePolicySchema = z.object({
  type: z.enum(["TERMS", "PRIVACY", "REFUND", "COOKIE", "OTHERS"]),
  content: z
    .string()
    .min(10, "Policy content must be at least 10 characters long"),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const CreateFaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  status: z.enum(["draft", "published", "archieved"]),
  archived: z.boolean().optional(),
});

export const PolicyQuerySchema = z.object({
  type: z.enum(["TERMS", "PRIVACY", "REFUND", "COOKIE", "OTHERS"]),
});

export type createFaqType = z.infer<typeof CreateFaqSchema>;
export type updateFaqType = z.infer<typeof UpdateFaqSchema>;
export type FaqType = z.infer<typeof FaqSchema>;
export type PolicyQueryType = z.infer<typeof PolicyQuerySchema>;
export type createPolicyType = z.infer<typeof CreatePolicySchema>;
export type updatePolicyType = z.infer<typeof UpdatePolicySchema>;
export type PolicyType = z.infer<typeof PolicySchema>;
