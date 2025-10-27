import {
  ApiPaginatedSchema,
  ApiSuccessSchema,
  IdParamSchema,
  pageQuery,
} from "@/lib/zod";

import { createPollSchema, pollResponseSchema } from "./polls.schema";

export const fetchPollsAdminSchema = {
  "@get/polls": {
    query: pageQuery,
    output: ApiPaginatedSchema(pollResponseSchema),
  },
  "@post/polls": {
    input: createPollSchema,
    output: ApiSuccessSchema(pollResponseSchema),
  },
  "@delete/polls/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(pollResponseSchema),
  },
  "@patch/polls/:id": {
    params: IdParamSchema,
    input: createPollSchema,
    output: ApiSuccessSchema(pollResponseSchema),
  },
  "@patch/polls/:id/open": {
    params: IdParamSchema,
    output: ApiSuccessSchema(pollResponseSchema),
  },
  "@patch/polls/:id/close": {
    params: IdParamSchema,
    output: ApiSuccessSchema(pollResponseSchema),
  },
};
