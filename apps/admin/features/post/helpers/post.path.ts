import { ApiPaginatedSchema, ApiSuccessSchema, IdParamSchema } from "@/lib/zod";

import {
  createPostSchema,
  postQuerySchema,
  postSchema,
  reorderPostsSchema,
  updatePostSchema,
} from "./post.schema";
import z from "zod";

export const fetchPostAdminSchema = {
  "@get/posts": {
    query: postQuerySchema,
    output: ApiPaginatedSchema(postSchema),
  },
  "@post/posts": {
    input: createPostSchema,
    output: ApiSuccessSchema(postSchema),
  },
  "@patch/posts/reorder": {
    input: reorderPostsSchema,
    output: ApiSuccessSchema(z.number()),
  },
  "@delete/posts/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(postSchema),
  },
  "@patch/posts/:id": {
    params: IdParamSchema,
    input: updatePostSchema,
    output: ApiSuccessSchema(postSchema),
  },
  "@patch/posts/:id/publish": {
    params: IdParamSchema,
    output: ApiSuccessSchema(postSchema),
  },
  "@patch/posts/:id/unpublish": {
    params: IdParamSchema,
    output: ApiSuccessSchema(postSchema),
  },
};
