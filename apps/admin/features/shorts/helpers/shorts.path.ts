import {
  ApiPaginatedSchema,
  ApiSuccessSchema,
  IdParamSchema,
  pageQuery,
} from "@/lib/zod";
import {
  createShortsSchema,
  reorderShortsSchema,
  shortSchema,
  shortsOutputSchema,
  videoSchema,
} from "./shorts.schema";
import z from "zod";

export const fetchShortsAdminSchema = {
  "@get/shorts": {
    query: pageQuery,
    output: ApiPaginatedSchema(shortsOutputSchema),
  },
  "@post/shorts": {
    input: createShortsSchema,
    output: ApiSuccessSchema(videoSchema),
  },
  "@patch/shorts/reorder": {
    input: reorderShortsSchema,
    output: ApiSuccessSchema(z.number()),
  },
  "@delete/shorts/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(shortSchema),
  },
  "@patch/shorts/:id": {
    params: IdParamSchema,
    input: createShortsSchema,
    output: ApiSuccessSchema(shortSchema),
  },
};
