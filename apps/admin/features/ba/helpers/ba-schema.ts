import { z } from "zod";

export const BackendAdditionInputSchema = z.object({
  courseId: z.string(),
  userId: z.array(z.string()),
  amount: z.number().int(),
});

export const BackendAdditionResponse = z.object({
  courseId: z.string(),
  users: z.coerce.number(),
});

export type BackendAdditionInput = z.infer<typeof BackendAdditionInputSchema>;
export type BackendAdditionOutput = z.infer<typeof BackendAdditionResponse>;
