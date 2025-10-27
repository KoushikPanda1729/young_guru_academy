import { EnglishLevel } from "@/components/data-table/schema";
import z from "zod";
import { filterItemSchema, sortingItemSchema } from "../../lib/zod";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import { flagConfig } from "@t2p-admin/ui/config/flag";
import {
  getFiltersStateParser,
  getSortingStateParser,
} from "@t2p-admin/ui/lib/parsers";

export const courseEnrolledSchema = z.object({
  courseId: z.string(),
  courseName: z.string(),
  enrolledAt: z.coerce.date(),
  expiredAt: z.coerce.date().nullable(),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().nullable(),
  banned: z.boolean(),
  createdAt: z.coerce.date(),
  level: z.string().nullable().optional(),
  preferredTime: z.string().nullable().optional(),
  averageRating: z.coerce.number().nullable().optional(),
  dob: z.coerce.date().nullable().optional(),
  education: z.string().nullable().optional(),
  location: z.string(),
  status: z.enum(["active", "inactive"]),
  courseEnrolled: z.array(courseEnrolledSchema),
});

export const statusSchema = z
  .union([
    z.enum(["active", "inactive", "all"]),
    z.array(z.enum(["active", "inactive", "all"])),
  ])
  .transform((val) => (Array.isArray(val) ? val[0] : val))
  .default("all");

// Role schema: single enum or array, transformed to single value
export const roleSchema = z
  .union([
    z.enum(["user", "admin", "all"]),
    z.array(z.enum(["user", "admin", "all"])),
  ])
  .transform((val) => (Array.isArray(val) ? val[0] : val))
  .default("all");

export const userSearchParams = {
  filterFlag: parseAsStringEnum(
    flagConfig.featureFlags.map((flag) => flag.value)
  ),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<UserType>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  search: parseAsString.withDefault(""),
  status: parseAsStringEnum(["active", "inactive", "all"]).withDefault("all"),
  level: parseAsArrayOf(
    parseAsStringEnum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
  ).withDefault([]),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
};

export const userSearchQuery = z.object({
  filterFlag: z.enum(["advancedFilters", "commandFilters"]).nullable(),
  page: z.coerce.number().int().default(1),
  perPage: z.coerce.number().int().default(10),
  sort: z.union([
    z.string(),
    z.array(sortingItemSchema).default([{ id: "createdAt", desc: true }]),
  ]),
  search: z.string().default(""),
  status: statusSchema,
  level: z.array(z.nativeEnum(EnglishLevel)).default([]),
  createdAt: z.array(z.coerce.number()).default([]),
  filters: z.union([z.string(), z.array(filterItemSchema).default([])]),
  joinOperator: z.enum(["and", "or"]).default("and"),
});

export const SearchUserResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phoneNumber: z.string().nullable(),
    image: z.string().nullable(),
    role: z.string(),
    banned: z.boolean(),
    createdAt: z.coerce.date(),
  })
);

export const SearchUserSchema = z.object({
  search: z
    .string({
      required_error: "Search query is required",
    })
    .trim()
    .min(1, "Search query cannot be empty"),
});

export type SearchUserInput = z.infer<typeof SearchUserSchema>;
export type SearchUserOutput = z.infer<typeof SearchUserResponseSchema>;

export const userStatsSchema = z.object({
  totalUsers: z.coerce.number(),
  totalBanned: z.coerce.number(),
  totalAdmins: z.coerce.number(),
});

export type UserSearchQuery = z.infer<typeof userSearchQuery>;
export type UserType = z.infer<typeof userSchema>;
export type UserStats = z.infer<typeof userStatsSchema>;
