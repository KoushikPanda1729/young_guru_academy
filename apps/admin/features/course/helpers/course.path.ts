import {
  ApiPaginatedSchema,
  ApiSuccessSchema,
  IdParamSchema,
  TableQuerySchema,
} from "@/lib/zod";
import {
  courseSchema,
  CreateContentSchema,
  CreateCourseSchema,
  updateCourseSchema,
  ContentParamsSchmea,
  UpdateContentSchema,
  CourseContentSchema,
  CreateVideoResponseSchema,
  createVideoSchema,
  reorderFoldersInputSchema,
  reorderContentInputSchema,
} from "./course.schema";
import { signedURLParams, UrlSchema } from "@/features/quest/quest.schema";
import {
  basicEntitySchema,
  FolderParamsSchema,
  FolderSchema,
  getFolderSchema,
  inputFileSchema,
  quizResponseSchema,
  responseFileSchema,
  successSchema,
  UpdateFolderSchema,
  videoResponseSchema,
} from "./folder.schema";

export const fetchCourseAdminSchema = {
  "@get/courses": {
    query: TableQuerySchema,
    output: ApiPaginatedSchema(courseSchema),
  },
  "@get/courses/signed-url": {
    query: signedURLParams,
    output: ApiSuccessSchema(UrlSchema),
  },
  "@patch/courses/:id/popular": {
    params: IdParamSchema,
    output: ApiSuccessSchema(courseSchema),
  },
  "@patch/courses/:id/unpopular": {
    params: IdParamSchema,
    output: ApiSuccessSchema(courseSchema),
  },
  "@post/courses": {
    input: CreateCourseSchema,
    output: ApiSuccessSchema(courseSchema),
  },
  "@get/courses/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(courseSchema),
  },
  "@delete/courses/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(courseSchema),
  },
  "@patch/courses/:id": {
    params: IdParamSchema,
    input: updateCourseSchema,
    output: ApiSuccessSchema(courseSchema),
  },
  "@patch/courses/:id/publish": {
    params: IdParamSchema,
    output: ApiSuccessSchema(courseSchema),
  },
  "@patch/courses/:id/unPublish": {
    params: IdParamSchema,
    output: ApiSuccessSchema(courseSchema),
  },
};

export const fetchFolderAdminSchema = {
  "@get/courses/:id/folders": {
    params: IdParamSchema,
    output: ApiSuccessSchema(getFolderSchema.array()),
  },
  "@get/courses/:id/folders/:folderId": {
    params: FolderParamsSchema,
    output: ApiSuccessSchema(getFolderSchema),
  },
  "@post/courses/:id/folders": {
    params: IdParamSchema,
    input: FolderSchema,
    output: ApiSuccessSchema(getFolderSchema),
  },
  "@patch/courses/:id/folders/:folderId": {
    params: FolderParamsSchema,
    input: UpdateFolderSchema,
    output: ApiSuccessSchema(getFolderSchema),
  },
  "@patch/courses/:id/folders/:folderId/lock": {
    params: FolderParamsSchema,
    output: ApiSuccessSchema(getFolderSchema),
  },
  "@patch/courses/:id/folders/:folderId/unlock": {
    params: FolderParamsSchema,
    output: ApiSuccessSchema(getFolderSchema),
  },
  "@patch/courses/:id/folders/reorder": {
    params: IdParamSchema,
    input: reorderFoldersInputSchema,
    output: ApiSuccessSchema(getFolderSchema.array()),
  },
  "@delete/courses/:id/folders/:folderId": {
    params: FolderParamsSchema,
    output: ApiSuccessSchema(getFolderSchema),
  },
};

export const fetchContentAdminSchema = {
  "@post/courses/:id/folders/:folderId/contents": {
    params: FolderParamsSchema,
    input: CreateContentSchema,
    output: ApiSuccessSchema(CourseContentSchema),
  },
  "@get/courses/:id/folders/:folderId/contents": {
    params: FolderParamsSchema,
    output: ApiSuccessSchema(CourseContentSchema.array()),
  },
  "@get/courses/:id/folders/:folderId/contents/:contentId": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(CourseContentSchema),
  },
  "@patch/courses/:id/folders/:folderId/contents/:contentId": {
    params: ContentParamsSchmea,
    input: UpdateContentSchema,
    output: ApiSuccessSchema(CourseContentSchema),
  },
  "@patch/courses/:id/folders/:folderId/contents/:contentId/lock": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(CourseContentSchema),
  },
  "@patch/courses/:id/folders/:folderId/contents/:contentId/unlock": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(CourseContentSchema),
  },
  "@patch/courses/:id/folders/:folderId/contents/reorder": {
    params: FolderParamsSchema,
    input: reorderContentInputSchema,
    output: ApiSuccessSchema(CourseContentSchema.array()),
  },
  "@delete/courses/:id/folders/:folderId/contents/:contentId": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(CourseContentSchema),
  },

  "@get/courses/:id/folders/:folderId/contents/:contentId/file": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(responseFileSchema),
  },
  "@post/courses/:id/folders/:folderId/contents/:contentId/file": {
    params: ContentParamsSchmea,
    input: inputFileSchema,
    output: ApiSuccessSchema(responseFileSchema),
  },
  "@put/courses/:id/folders/:folderId/contents/:contentId/file": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(responseFileSchema),
  },
  "@delete/courses/:id/folders/:folderId/contents/:contentId/file": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(responseFileSchema),
  },

  "@get/courses/:id/folders/:folderId/contents/:contentId/video": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(videoResponseSchema),
  },
  "@post/courses/:id/folders/:folderId/contents/:contentId/video": {
    params: ContentParamsSchmea,
    input: createVideoSchema,
    output: ApiSuccessSchema(CreateVideoResponseSchema),
  },
  "@patch/courses/:id/folders/:folderId/contents/:contentId/video": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(CourseContentSchema),
  },
  "@delete/courses/:id/folders/:folderId/contents/:contentId/video": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(CourseContentSchema),
  },

  "@get/courses/:id/folders/:folderId/contents/:contentId/quiz": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(quizResponseSchema),
  },
  "@post/courses/:id/folders/:folderId/contents/:contentId/quiz": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(basicEntitySchema),
  },
  "@patch/courses/:id/folders/:folderId/contents/:contentId/quiz": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(basicEntitySchema),
  },
  "@delete/courses/:id/folders/:folderId/contents/:contentId/quiz": {
    params: ContentParamsSchmea,
    output: ApiSuccessSchema(successSchema),
  },
};
