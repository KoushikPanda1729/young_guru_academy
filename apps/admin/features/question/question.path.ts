import { ApiPaginatedSchema, ApiSuccessSchema, EmptyArraySchema, IdParamSchema, IdsBodySchema, TableQuerySchema } from "@/lib/zod";
import { createQuestionSchema, QuestionSchema, questionStatsSchema } from "./question.schema";
import { signedKeyParams, signedURLParams, UrlSchema } from "@/features/quest/quest.schema";

export const fetchQuestionAdminSchema = {
    "@get/question" : {
        query: TableQuerySchema,
        output: ApiPaginatedSchema(QuestionSchema)
    },
    "@get/question/:id": {
        params: IdParamSchema,
        output: ApiSuccessSchema(QuestionSchema)
    },
    "@get/question/signed-url": {
        query: signedURLParams,
        output: ApiSuccessSchema(UrlSchema)
    },
    "@get/question/stats": {
        output: ApiSuccessSchema(questionStatsSchema)
    },
    "@post/question/create": {
        input: createQuestionSchema,
        output: ApiSuccessSchema(QuestionSchema)
    },
    "@post/question/excel": {
        query: signedKeyParams,
    },
    "@delete/question": {
        input: IdsBodySchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@delete/question/:id" : {
        params: IdParamSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/question/:id": {
        params: IdParamSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/question/archive": {
        input: IdsBodySchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/question/archive/:id": {
        params: IdParamSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/question/unarchive": {
        input: IdsBodySchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/question/unarchive/:id": {
        params: IdParamSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
}