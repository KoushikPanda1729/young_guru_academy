import {
  AudioCallSchema,
  callSearchParamsSchema,
  callStatsSchema,
} from "./call.schema";
import {
  ApiPaginatedSchema,
  ApiSuccessSchema,
  EmptyArraySchema,
  IdParamSchema,
  IdsBodySchema,
} from "@/lib/zod";

export const fetchCallAdminSchema = {
  "@get/calls": {
    query: callSearchParamsSchema,
    output: ApiPaginatedSchema(AudioCallSchema),
  },
  "@get/calls/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(AudioCallSchema),
  },
  "@get/calls/stats": {
    output: ApiSuccessSchema(callStatsSchema),
  },
  "@delete/calls": {
    input: IdsBodySchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
  "@delete/calls/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
  "@patch/calls/archive": {
    input: IdsBodySchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
  "@patch/calls/archive/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
  "@patch/calls/unarchive": {
    input: IdsBodySchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
  "@patch/calls/unarchive/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
};
