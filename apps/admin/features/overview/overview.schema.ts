import { z } from "zod"

export const overviewQuerySchema = z.object({
  range: z.enum(["7d", "30d", "90d", "custom", "total"]),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional()
}).superRefine((data, ctx) => {
  if (data.range === "custom") {
    if (!data.from || !data.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "`from` and `to` are required when range is 'custom'"
      })
    } else {
      const fromDate = new Date(data.from)
      const toDate = new Date(data.to)

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "`from` and `to` must be valid dates in YYYY-MM-DD format"
        })
      }

      if (fromDate > toDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "`from` date must be before or equal to `to` date"
        })
      }
    }
  }
})

const trendSchema = z.object({
  count: z.number(),
  trend: z.number(),    
  direction: z.enum(["up", "down"]),
})

const chartEntrySchema = z.object({
  date: z.string(),       
  mobile: z.number()
})

export const overviewSchema = z.object({
  user: trendSchema,
  download: trendSchema,
  audioCall: trendSchema,
  feedback: trendSchema,
  chart: z.array(chartEntrySchema),
})

export type OverviewResponse = z.infer<typeof overviewSchema>


export type overviewQueryType = z.infer<typeof overviewQuerySchema>