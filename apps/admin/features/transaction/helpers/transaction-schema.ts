import { flagConfig } from "@t2p-admin/ui/config/flag";
import {
  getFiltersStateParser,
  getSortingStateParser,
} from "@t2p-admin/ui/lib/parsers";
import {
  createStandardSchemaV1,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import z from "zod";
import { filterItemSchema, sortingItemSchema } from "../../../lib/zod";

export const TransactionStatsDataSchema = z
  .object({
    type: z.string(),
    from: z.coerce.date().optional().nullable(),
    to: z.coerce.date().optional().nullable(),
    totalAmount: z.number(),
    count: z.number(),
    averageOrderValue: z.number(),
    lifetimeRevenue: z.number(),
    totalTransactions: z.number(),
  })
  .nullable();

export const PaymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  invoiceUrl: z.string().nullable(),
  name: z.string().nullable(),
  userId: z.string().nullable(),
  type: z.enum(["MANUAL", "RAZORPAY"]),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  courses: z.array(z.string()),
  createdAt: z.coerce.date(),
});

export const transactionSearchParams = {
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value)
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Transactions>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  search: parseAsString.withDefault(""),
  type: parseAsStringEnum(["RAZORPAY", "MANUAL", "ALL"]).withDefault("ALL"),
  courses: parseAsString.withDefault(""),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
};

export const standardTransactionSearchParams = createStandardSchemaV1(
  transactionSearchParams,
  {
    partialOutput: true,
  }
);

export const transactionSearchParamsSchema = z.object({
  filterFlag: z.string().optional().nullable(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(10),
  sort: z.union([
    z.string(),
    z.array(sortingItemSchema).default([{ id: "createdAt", desc: true }]),
  ]),
  search: z.string().default(""),
  type: z
    .union([
      z.enum(["RAZORPAY", "MANUAL", "ALL"]),
      z.array(z.enum(["RAZORPAY", "MANUAL", "ALL"])),
    ])
    .transform((val) => (Array.isArray(val) ? val[0] : val))
    .default("ALL"),
  courses: z
    .union([z.string(), z.array(z.string())])
    .default("")
    .transform((val) => (Array.isArray(val) ? val.join(",") : val)),
  createdAt: z.array(z.coerce.number()).default([]),
  filters: z.union([z.string(), z.array(filterItemSchema).default([])]),
  joinOperator: z.enum(["and", "or"]).default("and"),
});

export type TransactionQuery = z.infer<typeof transactionSearchParamsSchema>;
export type TransactionStats = z.infer<typeof TransactionStatsDataSchema>;
export type Transactions = z.infer<typeof PaymentSchema>;
