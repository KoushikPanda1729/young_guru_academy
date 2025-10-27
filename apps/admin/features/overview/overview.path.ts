import { ApiSuccessSchema } from "@/lib/zod";
import { overviewQuerySchema, overviewSchema } from "./overview.schema";

export const fetchOverviewAdminSchema = {
    "@get/overview" : {
        query: overviewQuerySchema,
        output: ApiSuccessSchema(overviewSchema)
    },
}