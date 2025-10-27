import { ApiPaginatedSchema, ApiSuccessSchema, EmptyArraySchema, IdParamSchema, IdsBodySchema, TableQuerySchema } from "@/lib/zod";
import { QuestSchema, QuestStatsSchema, scheduleQuestFormSchema, signedURLParams, UpdateQuestSchema, UrlSchema } from "./quest.schema";

export const fetchQuestAdminSchema = {
    "@get/quest" : {
        query: TableQuerySchema,
        output: ApiPaginatedSchema(QuestSchema)
    },
    "@get/quest/:id": {
        params: IdParamSchema,
        output: ApiSuccessSchema(QuestSchema)
    },
    "@get/quest/stats": {
        output: ApiSuccessSchema(QuestStatsSchema)
    },
    "@get/quest/signed-url": {
        query: signedURLParams,
        output: ApiSuccessSchema(UrlSchema)
    },
    "@post/quest": {
        input: scheduleQuestFormSchema,
        output: ApiSuccessSchema(QuestSchema)
    },
    "@delete/quest": {
        input: IdsBodySchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@delete/quest/:id" : {
        params: IdParamSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/quest/:id": {
        params: IdParamSchema,
        input: UpdateQuestSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/quest/archive": {
        input: IdsBodySchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/quest/archive/:id": {
        params: IdParamSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/quest/unarchive": {
        input: IdsBodySchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
    "@patch/quest/unarchive/:id": {
        params: IdParamSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    },
}