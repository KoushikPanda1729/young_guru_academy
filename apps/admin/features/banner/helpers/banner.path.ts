import { ApiSuccessSchema, IdParamSchema } from "../../../lib/zod";
import { signedURLParams, UrlSchema } from "../../quest/quest.schema";
import {
  bannerSchema,
  createBannerSchema,
  reorderBannersSchema,
  updateBannerSchema,
} from "./banner.schema";

export const fetchAdminBannerSchema = {
  "@get/banners": {
    output: ApiSuccessSchema(bannerSchema.array()),
  },
  "@post/banners": {
    input: createBannerSchema,
    output: ApiSuccessSchema(bannerSchema),
  },
  "@get/banners/signed-url": {
    query: signedURLParams,
    output: ApiSuccessSchema(UrlSchema),
  },
  "@patch/banners/:id": {
    params: IdParamSchema,
    input: updateBannerSchema,
    output: ApiSuccessSchema(bannerSchema),
  },
  "@delete/banners/:id": {
    params: IdParamSchema,
    output: ApiSuccessSchema(bannerSchema),
  },
  "@patch/banners/reorder": {
    input: reorderBannersSchema,
    output: ApiSuccessSchema(bannerSchema),
  },
};
