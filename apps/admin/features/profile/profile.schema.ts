import z from "zod";

export enum EducationalQualification {
  TENTH_PASS = "TENTH_PASS",
  TWELFTH_PASS = "TWELFTH_PASS",
  GRADUATION = "GRADUATION",
  MASTERS = "MASTERS",
  OTHERS = "OTHERS",
}

export enum EnglishLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum DailyLimit {
  MIN_15 = "MIN_15",
  MIN_30 = "MIN_30",
  MIN_60 = "MIN_60",
  WHENEVER_FREE = "WHENEVER_FREE",
}

export enum Occupation {
  STUDENT = "STUDENT",
  WORKING_PROFESSIONAL = "WORKING_PROFESSIONAL",
  JOB_SEEKER = "JOB_SEEKER",
  HOUSEWIFE = "HOUSEWIFE",
  OTHERS = "OTHERS",
}

export enum EnglishLearningReason {
  JOB = "JOB",
  INTERVIEW = "INTERVIEW",
  COLLEGE = "COLLEGE",
  DAILY_LIFE = "DAILY_LIFE",
}

export enum FreeTime {
  SIX_AM_TO_EIGHT_AM = 'SIX_AM_TO_EIGHT_AM',
  EIGHT_AM_TO_TEN_AM = 'EIGHT_AM_TO_TEN_AM',
  TEN_AM_TO_TWELVE_PM = 'TEN_AM_TO_TWELVE_PM',
  TWELVE_PM_TO_TWO_PM = 'TWELVE_PM_TO_TWO_PM',
  TWO_PM_TO_FOUR_PM = 'TWO_PM_TO_FOUR_PM',
  FOUR_PM_TO_SIX_PM = 'FOUR_PM_TO_SIX_PM',
  SIX_PM_TO_EIGHT_PM = 'SIX_PM_TO_EIGHT_PM',
  EIGHT_PM_TO_TEN_PM = 'EIGHT_PM_TO_TEN_PM',
  AFTER_TEN_PM = 'AFTER_TEN_PM',
  ANYTIME = 'ANYTIME',
}


export const StudentProfileSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  birthDate: z.string().datetime().nullable(),
  education: z.nativeEnum(EducationalQualification).nullable(),
  
  englishLearningreason: z.nativeEnum(EnglishLearningReason),
  level: z.nativeEnum(EnglishLevel),
  occupation: z.nativeEnum(Occupation),
  freeTime: z.nativeEnum(FreeTime),
  practiceLimit: z.nativeEnum(DailyLimit),

  averageRating: z.number().nullable(),
  interests: z.array(z.string()),
  
  testHistory: z.array(z.unknown()).optional(),
  reviewsGiven: z.array(z.unknown()).optional(),
  reviewsReceived: z.array(z.unknown()).optional(),
  callerCalls: z.array(z.unknown()).optional(),
  receiverCalls: z.array(z.unknown()).optional(),
});

export const UpdateProfileSchema = StudentProfileSchema.omit({ id: true })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided." }
  );

export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>



