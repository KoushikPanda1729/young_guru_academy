import {
  ApiSuccessSchema,
  EmptyArraySchema,
  IdParamSchema,
  IdsBodySchema,
} from "@/lib/zod";
import {
  ArrayOfFaqSchema,
  CreateFaqSchema,
  CreatePolicySchema,
  FaqSchema,
  PolicyQuerySchema,
  PolicySchema,
  UpdateFaqSchema,
  UpdatePolicySchema,
} from "./website.schema";

export const fetchFaqAdminSchema = {
  "@get/website/faq": {
    output: ApiSuccessSchema(ArrayOfFaqSchema),
  },
  "@post/website/faq": {
    input: CreateFaqSchema,
    output: ApiSuccessSchema(FaqSchema),
  },
  "@delete/website/faq": {
    input: IdsBodySchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
  "@delete/website/faq/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
  "@patch/website/faq/:id": {
    params: IdParamSchema,
    input: UpdateFaqSchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
  "@patch/website/faq/archive": {
    input: IdsBodySchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
  "@patch/website/faq/archive/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
  "@patch/website/faq/unarchive": {
    input: IdsBodySchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
  "@patch/website/faq/unarchive/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
};

export const fetchPolicyAdminSchema = {
  "@get/website/policy": {
    query: PolicyQuerySchema,
    output: ApiSuccessSchema(PolicySchema),
  },
  "@post/website/policy": {
    input: CreatePolicySchema,
    output: ApiSuccessSchema(PolicySchema),
  },
  "@patch/website/policy/:id": {
    params: IdParamSchema,
    input: UpdatePolicySchema,
    output: ApiSuccessSchema(EmptyArraySchema),
  },
};
