import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  imageUrl: z.string().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});

export const userBriefSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  createdAt: z.coerce.date().optional(),
  content: z.string().optional(),
});

export const postSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  title: z.string(),
  content: z.string().nullable(),
  imageUrl: z.string().nullable(),
  startsAt: z.coerce.date(),
  isPublished: z.boolean(),
  endsAt: z.coerce.date().nullable(),
  likesCount: z.number(),
  commentsCount: z.number(),
  likedBy: z.array(
    userBriefSchema.pick({ id: true, name: true, image: true, createdAt: true })
  ),
  commentedBy: z.array(
    userBriefSchema.pick({
      id: true,
      name: true,
      image: true,
      content: true,
      createdAt: true,
    })
  ),
});

export const reorderPostsSchema = z.object({
  postOrders: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().nonnegative("Order must be a positive integer"),
    })
  ),
});

export const postQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["all", "draft", "published"]).default("all"),
});

export type ReorderPostsType = z.infer<typeof reorderPostsSchema>;
export type PostQuery = z.infer<typeof postQuerySchema>;
export type PostType = z.infer<typeof postSchema>;

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
