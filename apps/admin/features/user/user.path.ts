import { ApiPaginatedSchema, ApiSuccessSchema } from "@/lib/zod";
import {
  SearchUserResponseSchema,
  SearchUserSchema,
  userSchema,
  userSearchQuery,
  userStatsSchema,
} from "./user.schema";

export const fetchUserAdminSchema = {
  "@get/users/list": {
    query: userSearchQuery,
    output: ApiPaginatedSchema(userSchema),
  },
  "@get/users/search": {
    query: SearchUserSchema,
    output: ApiSuccessSchema(SearchUserResponseSchema),
  },
  "@get/users/stats": {
    output: ApiSuccessSchema(userStatsSchema),
  },
};
