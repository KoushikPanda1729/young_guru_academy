import { CallStatus } from "@/components/data-table/schema";
import { PaginatedResponse, TableQuery, TableStatus } from "./table";

// ----------------------- Test History -----------------------

export interface TestHistory {
  id: string;
  score: number;
  attemptedAt: string;
  studentName: string;
  archived: boolean;
}

export interface TestHistoryApiResponse {
  id: string;
  score: number;
  attemptedAt: string;
  student: {
    name: string;
  };
  archived: boolean;
}

export interface TestStore {
  testHistories: PaginatedResponse<TestHistory> | null;
  currentTestHistory: TestHistory | null;
  status: TableStatus;
  error: string | null;
  lastQuery: TableQuery<
    "studentName" | "score" | "attemptedAt" | "archived"
  > | null;

  fetchTestHistories: (
    query: TableQuery<"studentName" | "score" | "attemptedAt" | "archived">
  ) => Promise<void>;

  fetchTestHistoryById: (id: string) => Promise<void>;
  deleteTestHistoryById: (id: string) => Promise<boolean>;
  deleteManyTestHistories: (ids: string[]) => Promise<boolean>;

  archiveTestHistoryById: (id: string) => Promise<boolean>;
  archiveManyTestHistories: (ids: string[]) => Promise<boolean>;

  unarchiveTestHistoryById: (id: string) => Promise<boolean>;
  unarchiveManyTestHistories: (ids: string[]) => Promise<boolean>;

  resetCurrentTestHistory: () => void;
  resetStore: () => void;
  refreshTestHistories: () => Promise<void>;
}

// ----------------------- Question -----------------------

export interface QuestionOption {
  a: string;
  b: string;
  c: string;
  d: string;
}

export interface Question {
  id: string;
  question: string;
  category: string;
  options: QuestionOption;
  answer: string;
  archived: boolean;
  createdAt: Date;
}

export type QuestionFields = "question" | "category" | "answer" | "archived";

export interface QuestionStore {
  questions: PaginatedResponse<Question> | null;
  questionById: Question | null;
  status: TableStatus;
  error: string | null;
  lastQuery: TableQuery<QuestionFields> | null;

  fetchQuestions: (query: TableQuery<QuestionFields>) => Promise<void>;
  getQuestionById: (id: string) => Promise<boolean>;
  createQuestion: (
    data: Omit<Question, "id" | "createdAt">
  ) => Promise<boolean>;
  updateQuestion: (
    data: Partial<Omit<Question, "id">> & { _id: string }
  ) => Promise<boolean>;
  deleteQuestion: (id: string) => Promise<boolean>;
  deleteManyQuestions: (ids: string[]) => Promise<boolean>;
  addQuestionsFromExcel: (file: File) => Promise<boolean>;

  archiveQuestionById: (id: string) => Promise<boolean>;
  unarchiveQuestionById: (id: string) => Promise<boolean>;

  clearQuestionById: () => void;
  resetStore: () => void;
  refreshQuestions: () => Promise<void>;
}

// ----------------------- Audio Call -----------------------

export type AudioCallItem = {
  id: string;
  startedAt: Date;
  createdAt: Date;
  endedAt: Date | null;
  durationSecs: number | null;
  status: CallStatus;
  callerName: string;
  receiverName: string;
  rating: number | null;
  archived: boolean;
};

export type AudioCallApiResponse = {
  id: string;
  startedAt: string;
  createdAt: string;
  endedAt: string | null;
  durationSecs: number | null;
  archived: boolean;
  status: CallStatus;
  caller: {
    user: {
      name: string;
    };
  };
  receiver: {
    user: {
      name: string;
    };
  };
  feedbacks: {
    rating: number | null;
    id: string;
  }[];
};

export type AudioCallQuery = TableQuery<
  "callerName" | "receiverName" | "status"
>;

export interface AudioCallStore {
  audioCalls: PaginatedResponse<AudioCallItem> | null;
  currentCall: AudioCallItem | null;
  status: TableStatus;
  error: string | null;
  lastQuery: AudioCallQuery | null;

  fetchCalls: (query: AudioCallQuery) => Promise<void>;
  fetchCallById: (id: string) => Promise<void>;

  archiveCallById: (id: string) => Promise<boolean>;
  unarchiveCallById: (id: string) => Promise<boolean>;
  archiveManyCalls: (ids: string[]) => Promise<boolean>;
  unarchiveManyCalls: (ids: string[]) => Promise<boolean>;
  deleteCallById: (id: string) => Promise<boolean>;
  deleteManyCalls: (ids: string[]) => Promise<boolean>;

  resetCurrentCall: () => void;
  resetStore: () => void;
  refreshCalls: () => Promise<void>;
}

// ----------------------- Website Store -----------------------

export type FaqItem = {
  id: string;
  question: string;
  status: "draft" | "published" | "archived";
  answer: string;
  archived: boolean;
};

export type FaqFields = "question" | "answer" | "archived" | "status";

export type PolicyFields = "type" | "content" | "archived" | "status";

export type WebsiteStore = {
  faqs: PaginatedResponse<FaqItem> | null;
  status: TableStatus;
  error: string | null;
  lastFaqQuery: TableQuery<FaqFields> | null;

  fetchFaqs: (query: TableQuery<FaqFields>) => Promise<void>;

  createFaq: (data: Omit<FaqItem, "id">) => Promise<boolean>;
  updateFaq: (data: Partial<FaqItem>) => Promise<boolean>;
  deleteFaq: (id: string) => Promise<boolean>;
  deleteManyFaqs: (ids: string[]) => Promise<boolean>;

  archiveFaqById: (id: string) => Promise<boolean>;
  unarchiveFaqById: (id: string) => Promise<boolean>;
  archiveManyFaqs: (ids: string[]) => Promise<boolean>;
  unarchiveManyFaqs: (ids: string[]) => Promise<boolean>;

  resetStore: () => void;
};

// ----------------------- Policy Store -----------------------

export const POLICY_TYPE_OPTIONS = [
  { value: "TERMS", label: "Terms of Service" },
  { value: "PRIVACY", label: "Privacy Policy" },
  { value: "REFUND", label: "Refund Policy" },
  { value: "COOKIE", label: "Cookie Policy" },
  { value: "OTHERS", label: "Custom / Other" },
];

export enum PolicyType {
  TERMS = "TERMS",
  PRIVACY = "PRIVACY",
  REFUND = "REFUND",
  COOKIE = "COOKIE",
  OTHERS = "OTHERS",
}

export type PolicyItem = {
  id: string;
  type: PolicyType;
  status: "draft" | "published" | "archived";
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type PolicyStore = {
  policy: PolicyItem | null;
  status: TableStatus;
  error: string | null;

  fetchPolicies: (type: PolicyType) => Promise<void>;
  createPolicy: (
    data: Omit<PolicyItem, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updatePolicy: (
    data: Partial<Omit<PolicyItem, "createdAt" | "updatedAt">>
  ) => Promise<boolean>;
};
