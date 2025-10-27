import { ApiPaginatedSchema, ApiSuccessSchema, EmptyArraySchema, IdParamSchema, TableQuerySchema } from "@/lib/zod";
import { StudentFeedbackItemSchema } from "./reviews.schema";

export const fetchReviewAdminSchema = {
    "@get/reviews" : {
        query: TableQuerySchema,
        output: ApiPaginatedSchema(StudentFeedbackItemSchema)
    },
    "@delete/reviews/:id": {
        params: IdParamSchema,
        output: ApiSuccessSchema(EmptyArraySchema)
    }
}