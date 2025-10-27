import { ApiPaginatedSchema, ApiSuccessSchema, EmptyArraySchema, IdParamSchema, IdsBodySchema, TableQuerySchema } from "@/lib/zod";
import { TestHistorySchema, TestStatsSchema } from "./test.schema";

export const fetchTestAdminSchema = {
    "@get/test" : {
        query: TableQuerySchema,
        output: ApiPaginatedSchema(TestHistorySchema)
    },
    "@get/test/:id": {
        params: IdParamSchema,
        output: ApiSuccessSchema(TestHistorySchema)
    },
    "@get/test/stats": {
        output: ApiSuccessSchema(TestStatsSchema)
    },
    "@delete/test": {
        input: IdsBodySchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@delete/test/:id" : {
        params: IdParamSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/test/archive": {
        input: IdsBodySchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/test/archive/:id": {
        params: IdParamSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/test/unarchive": {
        input: IdsBodySchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/test/unarchive/:id": {
        params: IdParamSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
}