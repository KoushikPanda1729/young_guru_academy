import z from "zod";

export const createPollSchema = z
  .object({
    question: z.string().min(3, "Question must be at least 3 characters long"),
    description: z.string().optional(),
    options: z
      .array(z.object({ text: z.string().min(1) }))
      .min(2, "At least 2 options"),
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
  })
  .refine(
    (data) => !data.startsAt || !data.endsAt || data.endsAt > data.startsAt,
    {
      message: "End date must be after start date",
      path: ["endsAt"],
    }
  );

export const pollResponseSchema = z.object({
  id: z.string(),
  question: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date().nullable().optional(),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      votesCount: z.number(),
    })
  ),
  isClosed: z.boolean(),
  totalVotes: z.number(),
  likesCount: z.number().optional(),
  commentsCount: z.number().optional(),
  likedBy: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string().nullable().optional(),
        createdAt: z.coerce.date(),
      })
    )
    .optional(),
  commentedBy: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        content: z.string(),
        image: z.string().nullable().optional(),
        createdAt: z.coerce.date(),
      })
    )
    .optional(),
});

export type PollResponse = z.infer<typeof pollResponseSchema>;
export type CreatePollInput = z.infer<typeof createPollSchema>;
