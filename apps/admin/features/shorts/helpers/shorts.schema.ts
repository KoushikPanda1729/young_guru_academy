import { z } from "zod";

export const createShortsSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).optional(),
});
export const userSummarySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  image: z.string().optional().nullable(),
});

export const likedBySchema = userSummarySchema.extend({
  likedAt: z.coerce.date().optional(),
});

export const commentedBySchema = userSummarySchema.extend({
  content: z.string().optional(),
  createdAt: z.coerce.date().optional(),
});

export const shortsOutputSchema = z.object({
  videoId: z.string(),
  libraryId: z.number(),
  collectionId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  duration: z.number().optional(),
  order: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  likesCount: z.number(),
  commentsCount: z.number(),
  likedBy: z.array(likedBySchema),
  commentedBy: z.array(commentedBySchema),
});

export const shortSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  title: z.string(),
  order: z.number(),
  description: z.string().nullable(),
  duration: z.number().nullable(),
  guid: z.string(),
  collectionId: z.string(),
  updatedAt: z.coerce.date(),
});

export const videoSchema = z.object({
  libraryId: z.number(),
  videoId: z.string(),
  presigned: z.string(),
  expire: z.number(),
  short: shortSchema,
});

export const reorderShortsSchema = z.object({
  shortOrders: z.array(
    z.object({
      id: z.string().uuid(),
      order: z.number().int().nonnegative(),
    })
  ),
});

export type ReorderShortsInput = z.infer<typeof reorderShortsSchema>;
export type VideoOutput = z.infer<typeof videoSchema>;
export type DeleteShortsOutput = z.infer<typeof shortSchema>;
export type CreateShortsInput = z.infer<typeof createShortsSchema>;
export type ShortsOutput = z.infer<typeof shortsOutputSchema>;
