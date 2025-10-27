// import { statement } from "@/features/auth/core/access";
// import { isValidIndianNumber } from "@/lib/zod";
// import { z } from "zod";

// export const MemberSchema = z.object({
//   user: z.object({
//     id: z.string(),
//     name: z.string(),
//     email: z.string().email(),
//     image: z.string().nullable().optional(),
//   }),
//   id: z.string(),
//   organizationId: z.string(),
//   userId: z.string(),
//   role: z.string(),
//   createdAt: z.date(),
// });

// export const MembersResponseSchema = z
//   .object({
//     members: z.array(MemberSchema),
//     total: z.number(),
//   })
//   .optional();

// const permissionSchema = z.object(
//   Object.fromEntries(
//     Object.entries(statement).map(([module, actions]) => [
//       module,
//       z.object(
//         Object.fromEntries(
//           actions.map((action) => [action, z.boolean().default(false)])
//         )
//       ),
//     ])
//   )
// )

// const baseFields = {
//   name: z.string().min(1),
//   email: z.string().min(1),
//   password: z.string().min(8).max(20),
//   phoneNumber: z
//     .string()
//     .refine(isValidIndianNumber, {
//       message: "Please enter a valid Indian phone number",
//     }),
// }

// export const createMemberSchema = z.discriminatedUnion("role", [
//   z.object({
//     ...baseFields,
//     role: z.literal("admin"),
//   }),
//   z.object({
//     ...baseFields,
//     role: z.literal("member"),
//     permissions: permissionSchema,
//   }),
// ])
// export type MembersResponse = z.infer<typeof MembersResponseSchema>;
// export type MemberType = z.infer<typeof MemberSchema>
// export type CreateMemberInput = z.infer<typeof createMemberSchema>
