import { overviewQueryType } from "@/features/overview/overview.schema";
import {
  ScheduleQuestFormType,
  signedKeyParamsType,
  SignedURLParamsType,
  UpdateQuestType,
} from "@/features/quest/quest.schema";
import {
  CreateQuestionType,
  UpdateQuestionType,
} from "@/features/question/question.schema";
import {} from "@/features/test/test.schema";
import { $adminFetch } from "./fetch";
import { IdType, IdsType, PageQueryType, TableQuery } from "./zod";
import {
  createFaqType,
  createPolicyType,
  PolicyQueryType,
  updateFaqType,
  updatePolicyType,
} from "@/features/website/website.schema";
import {
  CreateSegmentType,
  DeleteSegmentType,
  NotificationMesageType,
  NotificationQuery,
  ScheduleNotificationFormType,
} from "@/features/notification/notification.schema";
import { SearchUserInput, UserSearchQuery } from "@/features/user/user.schema";
import {
  ContentParamsType,
  CreateContentType,
  createCourseType,
  CreateVideoType,
  ReOrderContentInput,
  ReOrderInput,
  UpdateContentType,
  updateCourseType,
} from "@/features/course/helpers/course.schema";
import {
  CreateFolderType,
  FileType,
  FolderParamsType,
  QuizFormType,
  UpdateFolderType,
} from "@/features/course/helpers/folder.schema";
import {
  CreateCouponInput,
  UpdateCouponInput,
} from "@/features/coupon/helpers/coupon.schema";
import {
  CreateShortsInput,
  ReorderShortsInput,
} from "@/features/shorts/helpers/shorts.schema";
import { CreatePollInput } from "@/features/polls/helpers/polls.schema";
import {
  CreatePostInput,
  PostQuery,
  ReorderPostsType,
  UpdatePostInput,
} from "@/features/post/helpers/post.schema";
import { BackendAdditionInput } from "../features/ba/helpers/ba-schema";
import { TransactionQuery } from "../features/transaction/helpers/transaction-schema";
import {
  CreateBannerInput,
  ReorderBannersInput,
  UpdateBannerInput,
} from "../features/banner/helpers/banner.schema";
import { CallSearchParams } from "../features/call/helpers/call.schema";

export const api = {
  call: {
    getCalls: (query: CallSearchParams) => $adminFetch("@get/calls", { query }),
    getCallById: (params: IdType) => $adminFetch("@get/calls/:id", { params }),
    getCallStats: () => $adminFetch("@get/calls/stats"),
    deleteCalls: (body: IdsType) => $adminFetch("@delete/calls", { body }),
    deleteCallById: (params: IdType) =>
      $adminFetch("@delete/calls/:id", { params }),
    archiveCalls: (body: IdsType) =>
      $adminFetch("@patch/calls/archive", { body }),
    archiveCallById: (params: IdType) =>
      $adminFetch("@patch/calls/archive/:id", { params }),
    unarchiveCalls: (body: IdsType) =>
      $adminFetch("@patch/calls/unarchive", { body }),
    unarchiveCallById: (params: IdType) =>
      $adminFetch("@patch/calls/unarchive/:id", { params }),
  },

  quest: {
    getQuests: (query: TableQuery) => $adminFetch("@get/quest", { query }),
    getQuestById: (params: IdType) => $adminFetch("@get/quest/:id", { params }),
    getQuestStats: () => $adminFetch("@get/quest/stats"),
    getSignedUrl: (query: SignedURLParamsType) =>
      $adminFetch("@get/quest/signed-url", { query }),
    createQuest: (body: ScheduleQuestFormType) =>
      $adminFetch("@post/quest", { body }),
    deleteQuests: (body: IdsType) => $adminFetch("@delete/quest", { body }),
    deleteQuestById: (params: IdType) =>
      $adminFetch("@delete/quest/:id", { params }),
    updateQuestById: (params: IdType, body: UpdateQuestType) =>
      $adminFetch("@patch/quest/:id", { params, body }),
    archiveQuests: (body: IdsType) =>
      $adminFetch("@patch/quest/archive", { body }),
    archiveQuestById: (params: IdType) =>
      $adminFetch("@patch/quest/archive/:id", { params }),
    unarchiveQuests: (body: IdsType) =>
      $adminFetch("@patch/quest/unarchive", { body }),
    unarchiveQuestById: (params: IdType) =>
      $adminFetch("@patch/quest/unarchive/:id", { params }),
  },

  question: {
    getQuestions: (query: TableQuery) =>
      $adminFetch("@get/question", { query }),
    getQuestionStats: () => $adminFetch("@get/question/stats"),
    getQuestionById: (params: IdType) =>
      $adminFetch("@get/question/:id", { params }),
    getSignedUrl: (query: SignedURLParamsType) =>
      $adminFetch("@get/question/signed-url", { query }),
    createQuestion: (body: CreateQuestionType) =>
      $adminFetch("@post/question/create", { body }),
    uploadExcel: (query: signedKeyParamsType) =>
      $adminFetch("@post/question/excel", { query }),
    deleteQuestions: (body: IdsType) =>
      $adminFetch("@delete/question", { body }),
    deleteQuestionById: (params: IdType) =>
      $adminFetch("@delete/question/:id", { params }),
    updateQuestionById: (params: IdType, body: UpdateQuestionType) =>
      $adminFetch("@patch/question/:id", { params, body }),
    archiveQuestions: (body: IdsType) =>
      $adminFetch("@patch/question/archive", { body }),
    archiveQuestionById: (params: IdType) =>
      $adminFetch("@patch/question/archive/:id", { params }),
    unarchiveQuestions: (body: IdsType) =>
      $adminFetch("@patch/question/unarchive", { body }),
    unarchiveQuestionById: (params: IdType) =>
      $adminFetch("@patch/question/unarchive/:id", { params }),
  },

  test: {
    getTests: (query: TableQuery) => $adminFetch("@get/test", { query }),
    getTestById: (params: IdType) => $adminFetch("@get/test/:id", { params }),
    getTestStats: () => $adminFetch("@get/test/stats"),
    deleteTests: (body: IdsType) => $adminFetch("@delete/test", { body }),
    deleteTestById: (params: IdType) =>
      $adminFetch("@delete/test/:id", { params }),
    archiveTests: (body: IdsType) =>
      $adminFetch("@patch/test/archive", { body }),
    archiveTestById: (params: IdType) =>
      $adminFetch("@patch/test/archive/:id", { params }),
    unarchiveTests: (body: IdsType) =>
      $adminFetch("@patch/test/unarchive", { body }),
    unarchiveTestById: (params: IdType) =>
      $adminFetch("@patch/test/unarchive/:id", { params }),
  },

  faq: {
    getFaqs: () => $adminFetch("@get/website/faq"),
    createFaq: (body: createFaqType) =>
      $adminFetch("@post/website/faq", { body }),
    deleteFaqs: (body: IdsType) => $adminFetch("@delete/website/faq", { body }),
    deleteFaqById: (params: IdType) =>
      $adminFetch("@delete/website/faq/:id", { params }),
    updateFaqById: (params: IdType, body: updateFaqType) =>
      $adminFetch("@patch/website/faq/:id", { params, body }),
    archiveFaqs: (body: IdsType) =>
      $adminFetch("@patch/website/faq/archive", { body }),
    archiveFaqById: (params: IdType) =>
      $adminFetch("@patch/website/faq/archive/:id", { params }),
    unarchiveFaqs: (body: IdsType) =>
      $adminFetch("@patch/website/faq/unarchive", { body }),
    unarchiveFaqById: (params: IdType) =>
      $adminFetch("@patch/website/faq/unarchive/:id", { params }),
  },

  policy: {
    getPolicy: (query: PolicyQueryType) =>
      $adminFetch("@get/website/policy", { query }),
    createPolicy: (body: createPolicyType) =>
      $adminFetch("@post/website/policy", { body }),
    updatePolicyById: (params: IdType, body: updatePolicyType) =>
      $adminFetch("@patch/website/policy/:id", { params, body }),
  },

  overview: {
    getOverview: (query: overviewQueryType) =>
      $adminFetch("@get/overview", { query }),
  },

  notification: {
    getNotifications: (query: NotificationQuery) =>
      $adminFetch("@get/notification", { query }),
    getNotificationById: (params: NotificationMesageType) =>
      $adminFetch("@get/notification/:message_id", { params }),
    getNotificationStats: () => $adminFetch("@get/notification/stats"),
    createNotification: (body: ScheduleNotificationFormType) =>
      $adminFetch("@post/notification", { body }),
    cancelNotificationById: (params: NotificationMesageType) =>
      $adminFetch("@post/notification/cancel/:message_id", { params }),
    deleteNotificationById: (params: NotificationMesageType) =>
      $adminFetch("@delete/notification/:message_id", { params }),
    getSegments: () => $adminFetch("@get/notification/segments"),
    createSegment: (body: CreateSegmentType) =>
      $adminFetch("@post/notification/segments", { body }),
    deleteSegmentById: (params: DeleteSegmentType) =>
      $adminFetch("@delete/notification/segments/:segment_id", { params }),
  },

  user: {
    getUserList: (query: UserSearchQuery) =>
      $adminFetch("@get/users/list", { query }),
    getUserSearch: (query: SearchUserInput) =>
      $adminFetch("@get/users/search", { query }),
    getUserStats: () => $adminFetch("@get/users/stats"),
  },

  post: {
    getPosts: (query: PostQuery) => $adminFetch("@get/posts", { query }),
    createPost: (body: CreatePostInput) => $adminFetch("@post/posts", { body }),
    reorderPosts: (body: ReorderPostsType) =>
      $adminFetch("@patch/posts/reorder", { body }),
    updatePostById: (params: IdType, body: UpdatePostInput) =>
      $adminFetch("@patch/posts/:id", { params, body }),
    deletePostById: (params: IdType) =>
      $adminFetch("@delete/posts/:id", { params }),
    publishPostById: (params: IdType) =>
      $adminFetch("@patch/posts/:id/publish", { params }),
    unPublishPostById: (params: IdType) =>
      $adminFetch("@patch/posts/:id/unpublish", { params }),
  },

  banner: {
    getSignedUrl: (query: SignedURLParamsType) =>
      $adminFetch("@get/banners/signed-url", { query }),
    getBanners: () => $adminFetch("@get/banners"),
    createBanner: (body: CreateBannerInput) =>
      $adminFetch("@post/banners", { body }),
    updateBannerById: (params: IdType, body: UpdateBannerInput) =>
      $adminFetch("@patch/banners/:id", { params, body }),
    deleteBannerById: (params: { id: string }) =>
      $adminFetch("@delete/banners/:id", { params }),
    reorderBanners: (body: ReorderBannersInput) =>
      $adminFetch("@patch/banners/reorder", { body }),
  },

  poll: {
    getPolls: (query: PageQueryType) => $adminFetch("@get/polls", { query }),
    createPoll: (body: CreatePollInput) => $adminFetch("@post/polls", { body }),
    deletePollById: (params: IdType) =>
      $adminFetch("@delete/polls/:id", { params }),
    updatePollById: (params: IdType, body: CreatePollInput) =>
      $adminFetch("@patch/polls/:id", { params, body }),
    openPollById: (params: IdType) =>
      $adminFetch("@patch/polls/:id/open", { params }),
    closePollById: (params: IdType) =>
      $adminFetch("@patch/polls/:id/close", { params }),
  },

  shorts: {
    getShorts: (query: PageQueryType) => $adminFetch("@get/shorts", { query }),
    createShort: (body: CreateShortsInput) =>
      $adminFetch("@post/shorts", { body }),
    reorderShorts: (body: ReorderShortsInput) =>
      $adminFetch("@patch/shorts/reorder", { body }),
    deleteShortById: (params: IdType) =>
      $adminFetch("@delete/shorts/:id", { params }),
    updateShortById: (params: IdType, body: CreateShortsInput) =>
      $adminFetch("@patch/shorts/:id", { params, body }),
  },

  coupons: {
    getCoupons: (query: TableQuery) => $adminFetch("@get/coupon", { query }),
    getCouponById: (params: IdType) =>
      $adminFetch("@get/coupon/:id", { params }),
    createCoupon: (body: CreateCouponInput) =>
      $adminFetch("@post/coupon", { body }),
    updateCouponById: (params: IdType, body: UpdateCouponInput) =>
      $adminFetch("@patch/coupon/:id", { params, body }),
    deleteCouponById: (params: IdType) =>
      $adminFetch("@delete/coupon/:id", { params }),
  },

  courses: {
    getCourses: (query: TableQuery) => $adminFetch("@get/courses", { query }),
    getCourseById: (params: IdType) =>
      $adminFetch("@get/courses/:id", { params }),
    createCourse: (body: createCourseType) =>
      $adminFetch("@post/courses", { body }),
    updateCourseById: (params: IdType, body: updateCourseType) =>
      $adminFetch("@patch/courses/:id", { params, body }),
    deleteCourseById: (params: IdType) =>
      $adminFetch("@delete/courses/:id", { params }),
    publishCourseById: (params: IdType) =>
      $adminFetch("@patch/courses/:id/publish", { params }),
    unPublishCourseById: (params: IdType) =>
      $adminFetch("@patch/courses/:id/unPublish", { params }),
    popularCourseById: (params: IdType) =>
      $adminFetch("@patch/courses/:id/popular", { params }),
    unPopularCourseById: (params: IdType) =>
      $adminFetch("@patch/courses/:id/unpopular", { params }),

    folder: {
      getFolders: (params: IdType) =>
        $adminFetch("@get/courses/:id/folders", { params }),
      getFolderById: (params: FolderParamsType) =>
        $adminFetch("@get/courses/:id/folders/:folderId", { params }),
      createFolder: (params: IdType, body: CreateFolderType) =>
        $adminFetch("@post/courses/:id/folders", { params, body }),
      updateFolder: (params: FolderParamsType, body: UpdateFolderType) =>
        $adminFetch("@patch/courses/:id/folders/:folderId", { params, body }),
      deleteFolder: (params: FolderParamsType) =>
        $adminFetch("@delete/courses/:id/folders/:folderId", { params }),
      reorderFolders: (params: IdType, body: ReOrderInput) =>
        $adminFetch("@patch/courses/:id/folders/reorder", { params, body }),
      lockFolder: (params: FolderParamsType) =>
        $adminFetch("@patch/courses/:id/folders/:folderId/lock", { params }),
      unlockFolder: (params: FolderParamsType) =>
        $adminFetch("@patch/courses/:id/folders/:folderId/unlock", { params }),

      content: {
        getContent: (params: FolderParamsType) =>
          $adminFetch("@get/courses/:id/folders/:folderId/contents", {
            params,
          }),
        getContentById: (params: ContentParamsType) =>
          $adminFetch(
            "@get/courses/:id/folders/:folderId/contents/:contentId",
            { params }
          ),
        createContent: (params: FolderParamsType, body: CreateContentType) =>
          $adminFetch("@post/courses/:id/folders/:folderId/contents", {
            params,
            body,
          }),
        updateContent: (params: ContentParamsType, body: UpdateContentType) =>
          $adminFetch(
            "@patch/courses/:id/folders/:folderId/contents/:contentId",
            { params, body }
          ),
        deleteContent: (params: ContentParamsType) =>
          $adminFetch(
            "@delete/courses/:id/folders/:folderId/contents/:contentId",
            { params }
          ),
        reorderContent: (params: FolderParamsType, body: ReOrderContentInput) =>
          $adminFetch("@patch/courses/:id/folders/:folderId/contents/reorder", {
            params,
            body,
          }),
        lockContent: (params: ContentParamsType) =>
          $adminFetch(
            "@patch/courses/:id/folders/:folderId/contents/:contentId/lock",
            { params }
          ),
        unlockContent: (params: ContentParamsType) =>
          $adminFetch(
            "@patch/courses/:id/folders/:folderId/contents/:contentId/unlock",
            { params }
          ),

        attachFile: (params: ContentParamsType, body: FileType) =>
          $adminFetch(
            "@post/courses/:id/folders/:folderId/contents/:contentId/file",
            { params, body }
          ),
        updateFile: (params: ContentParamsType, body: FileType) =>
          $adminFetch(
            "@put/courses/:id/folders/:folderId/contents/:contentId/file",
            { params, body }
          ),
        deleteFile: (params: ContentParamsType) =>
          $adminFetch(
            "@delete/courses/:id/folders/:folderId/contents/:contentId/file",
            { params }
          ),
        getFile: (params: ContentParamsType) =>
          $adminFetch(
            "@get/courses/:id/folders/:folderId/contents/:contentId/file",
            { params }
          ),

        attachVideo: (params: ContentParamsType, body: CreateVideoType) =>
          $adminFetch(
            "@post/courses/:id/folders/:folderId/contents/:contentId/video",
            { params, body }
          ),
        // updateVideo: (params: ContentParamsType, body: UpdateVideoType) =>
        //   $adminFetch("@patch/courses/:id/folders/:folderId/contents/:contentId/video", { params, body }),
        deleteVideo: (params: ContentParamsType) =>
          $adminFetch(
            "@delete/courses/:id/folders/:folderId/contents/:contentId/video",
            { params }
          ),
        getVideo: (params: ContentParamsType) =>
          $adminFetch(
            "@get/courses/:id/folders/:folderId/contents/:contentId/video",
            { params }
          ),

        attachQuiz: (
          params: ContentParamsType,
          body: { questions: QuizFormType[] }
        ) =>
          $adminFetch(
            "@post/courses/:id/folders/:folderId/contents/:contentId/quiz",
            { params, body }
          ),
        updateQuiz: (params: ContentParamsType, body: QuizFormType) =>
          $adminFetch(
            "@patch/courses/:id/folders/:folderId/contents/:contentId/quiz",
            { params, body }
          ),
        deleteQuiz: (params: ContentParamsType) =>
          $adminFetch(
            "@delete/courses/:id/folders/:folderId/contents/:contentId/quiz",
            { params }
          ),
        getQuiz: (params: ContentParamsType) =>
          $adminFetch(
            "@get/courses/:id/folders/:folderId/contents/:contentId/quiz",
            { params }
          ),
      },
    },

    getSignedUrl: (query: SignedURLParamsType) =>
      $adminFetch("@get/courses/signed-url", { query }),
  },

  review: {
    getReviews: (query: TableQuery) => $adminFetch("@get/reviews", { query }),

    deleteReviewById: (params: IdType) =>
      $adminFetch("@delete/reviews/:id", { params }),
  },

  transaction: {
    getStats: (query: TransactionQuery) =>
      $adminFetch("@get/transactions/stats", { query }),
    getTransactionList: (query: TransactionQuery) =>
      $adminFetch("@get/transactions", { query }),
  },

  ba: {
    addAccess: (body: BackendAdditionInput) =>
      $adminFetch("@post/ba", { body }),
  },
};
