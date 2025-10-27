import { z } from "zod";

export enum BannerType {
  COURSE = "COURSE",
  EXTERNAL = "EXTERNAL",
  YOUTUBE = "YOUTUBE",
  QUEST = "QUEST",
}

export const bannerSchema = z.object({
  image: z.string(),
  type: z.nativeEnum(BannerType),
  target: z.string(),
  id: z.string(),
  order: z.coerce.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createBannerSchema = z.object({
  image: z.string().url({ message: "Image must be a valid URL" }),
  type: z.nativeEnum(BannerType),
  target: z.string(),
});
export type CreateBannerInput = z.infer<typeof createBannerSchema>;

/**
 * Update banner schema
 */
export const updateBannerSchema = createBannerSchema.partial();
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;

/**
 * Reorder banners schema (used for drag-drop reorder updates)
 */
export const reorderBannersSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string().min(1, "Banner ID is required"),
      order: z.number().int().nonnegative(),
    })
  ),
});
export type ReorderBannersInput = z.infer<typeof reorderBannersSchema>;
export type Banner = z.infer<typeof bannerSchema>;

export const BANNER_TYPE_OPTIONS = [
  { label: "Course", value: BannerType.COURSE },
  { label: "External", value: BannerType.EXTERNAL },
  { label: "YouTube", value: BannerType.YOUTUBE },
  { label: "Quest", value: BannerType.QUEST },
];
