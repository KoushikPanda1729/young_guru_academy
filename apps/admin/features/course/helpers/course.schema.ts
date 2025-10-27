import z from "zod";
import { FolderParamsSchema } from "./folder.schema";

export const DurationUnit = z.enum(["days", "months", "years", "lifetime"]);
export const CourseStatus = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
  "SUSPENDED",
]);

export const courseSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(100),
  slug: z.string().min(1),
  description: z.string().nullable(),
  durationValue: z.number().nullable(),
  durationUnit: DurationUnit,
  thumbnail: z.string().nullable(),
  mrp: z.number().int(),
  price: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  collectionId: z.string().min(1),
  isPublished: z.boolean(),
  popular: z.boolean(),
  totalDuration: z.number().nullable(),
  totalStudents: z.number().int(),
  totalLessons: z.number().int(),
  totalReviews: z.number().int(),
  status: CourseStatus,
  likesCount: z.number().int(),
  publishedAt: z.coerce.date().nullable(),
});

export const isFileList =
  typeof FileList !== "undefined"
    ? z
        .instanceof(FileList)
        .refine((file) => file.length > 0, "thumbnail image is required")
    : z.any();

export const CreateCourseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  duration: z.object({
    value: z.number().nullable(),
    unit: z.enum(["days", "months", "years", "lifetime"]),
  }),
  description: z.string().min(1),
  mrp: z.number().int(),
  price: z.number().int(),
  isPublished: z.boolean(),
  thumbnail: z.union([isFileList, z.string().optional()]),
});

export const updateCourseSchema = CreateCourseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided." }
);

export const CourseContentNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["FILE", "VIDEO", "QUIZ"]),
  order: z.number(),
  data: z.unknown().nullable(),
  folderId: z.string(),
  courseId: z.string(),
});

export type CourseContentNode = z.infer<typeof CourseContentNodeSchema>;

export const CourseFolderNodeSchema: z.ZodType<{
  id: string;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  contents: CourseContentNode[];
  children: CourseFolderNode[];
}> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    order: z.number(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    contents: z.array(CourseContentNodeSchema),
    children: z.array(CourseFolderNodeSchema),
  })
);

export type CourseFolderNode = z.infer<typeof CourseFolderNodeSchema>;

export const CourseTreeSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  mrp: z.number(),
  price: z.number(),
  duration: z.string(),
  thumbnail: z.string().nullable(),
  isPublished: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  contents: z.array(CourseContentNodeSchema),
  folders: z.array(CourseFolderNodeSchema),
});

export const CreateContentSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["VIDEO", "FILE", "QUIZ"]),
  description: z.string().optional(),
  order: z.number().int().optional(),
});

export const CourseContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  lock: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  order: z.coerce.number(),
  type: z.enum(["FILE", "VIDEO", "QUIZ"]),
  courseId: z.string(),
  folderId: z.string(),
});

export type CourseContentType = z.infer<typeof CourseContentSchema>;

export const ContentParamsSchmea = FolderParamsSchema.extend({
  contentId: z.string().min(1),
});

export const createVideoSchema = z.object({
  title: z.string().min(1),
  duration: z.coerce.number(),
});

export type CreateVideoType = z.infer<typeof createVideoSchema>;

export const UpdateContentSchema = CreateContentSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided." }
);

export const VideoSchema = z.object({
  guid: z.string(),
  collectionId: z.string(),
  id: z.string(),
  duration: z.number().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateVideoResponseSchema = z.object({
  libraryId: z.number(),
  videoId: z.string(),
  presigned: z.string(),
  expire: z.number(),
  video: VideoSchema,
  content: CourseContentSchema,
});

export const reorderFoldersInputSchema = z.object({
  folderOrders: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

export const reorderContentInputSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

export type ContentParamsType = z.infer<typeof ContentParamsSchmea>;
export type CreateContentType = z.infer<typeof CreateContentSchema>;
export type UpdateContentType = z.infer<typeof UpdateContentSchema>;
export type CourseTree = z.infer<typeof CourseTreeSchema>;
export type CourseType = z.infer<typeof courseSchema>;
export type createCourseType = z.infer<typeof CreateCourseSchema>;
export type updateCourseType = z.infer<typeof updateCourseSchema>;
export type ReOrderInput = z.infer<typeof reorderFoldersInputSchema>;
export type ReOrderContentInput = z.infer<typeof reorderContentInputSchema>;
