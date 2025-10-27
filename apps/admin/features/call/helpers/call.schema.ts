import { flagConfig } from "@t2p-admin/ui/config/flag";
import { getSortingStateParser } from "@t2p-admin/ui/lib/parsers";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import z from "zod";
import { sortingItemSchema } from "../../../lib/zod";

export enum CallStatus {
  SEARCHING = "SEARCHING",
  CONNECTED = "CONNECTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  TIMED_OUT = "TIMED_OUT",
}

export const AudioCallSchema = z.object({
  id: z.string(),
  topic: z.string().nullable().default("N/A"),
  levelRestriction: z.string().nullable().default("N/A"),
  createdAt: z.string().optional(),
  waitDurationSecs: z.number().nullable(),
  roomDurationSecs: z.number().nullable(),
  status: z.enum([
    "SEARCHING",
    "CONNECTED",
    "COMPLETED",
    "CANCELLED",
    "TIMED_OUT",
  ]),
  studentName: z.string(),
  partnerName: z.string(),
});

export const statusSchema = z
  .union([
    z.enum([
      "SEARCHING",
      "CONNECTED",
      "COMPLETED",
      "CANCELLED",
      "TIMED_OUT",
      "all",
    ]),
    z.array(
      z.enum([
        "SEARCHING",
        "CONNECTED",
        "COMPLETED",
        "CANCELLED",
        "TIMED_OUT",
        "all",
      ])
    ),
  ])
  .transform((val) => (Array.isArray(val) ? val[0] : val))
  .default("all");

export const callStatsSchema = z.object({
  totalCount: z.number().default(0),
  todaysCalls: z.number().default(0),
  monthlyCalls: z.number().default(0),
  weeklyCalls: z.number().default(0),
});

export const callSearchParams = {
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value)
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<CallType>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  search: parseAsString.withDefault(""),
  status: parseAsStringEnum([
    "SEARCHING",
    "CONNECTED",
    "COMPLETED",
    "CANCELLED",
    "TIMED_OUT",
    "all",
  ]).withDefault("all"),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
};

export const callSearchParamsSchema = z.object({
  filterFlag: z.string().optional().nullable(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().default(10),
  sort: z.union([
    z.string(),
    z.array(sortingItemSchema).default([{ id: "createdAt", desc: true }]),
  ]),
  search: z.string().default(""),
  status: statusSchema,
  createdAt: z.array(z.coerce.number()).default([]),
  joinOperator: z.enum(["and", "or"]).default("and"),
});

export type CallSearchParams = z.infer<typeof callSearchParamsSchema>;
export type CallType = z.infer<typeof AudioCallSchema>;
