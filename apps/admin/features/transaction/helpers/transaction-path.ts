import { ApiPaginatedSchema, ApiSuccessSchema } from "../../../lib/zod";
import {
  PaymentSchema,
  transactionSearchParamsSchema,
  TransactionStatsDataSchema,
} from "./transaction-schema";

export const fetchTransactionSchema = {
  "@get/transactions": {
    query: transactionSearchParamsSchema,
    output: ApiPaginatedSchema(PaymentSchema),
  },
  "@get/transactions/stats": {
    query: transactionSearchParamsSchema,
    output: ApiSuccessSchema(TransactionStatsDataSchema),
  },
};
