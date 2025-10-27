import { ApiPaginatedSchema } from "../../../lib/zod";
import {
  BackendAdditionInputSchema,
  BackendAdditionResponse,
} from "./ba-schema";

export const fetchBackendAdditionSchema = {
  "@post/ba": {
    input: BackendAdditionInputSchema,
    output: ApiPaginatedSchema(BackendAdditionResponse),
  },
};
