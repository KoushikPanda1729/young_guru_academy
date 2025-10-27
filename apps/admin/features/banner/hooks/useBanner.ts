import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import type {
  CreateBannerInput,
  UpdateBannerInput,
  ReorderBannersInput,
} from "../helpers/banner.schema";
import { IdType } from "../../../lib/zod";

export function useBanner() {
  const queryClient = useQueryClient();

  const {
    data: banners,
    isLoading,
    refetch: refetchBanners,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => await api.banner.getBanners(),
  });

  // Create a banner
  const createBanner = useMutation({
    mutationFn: (body: CreateBannerInput) => api.banner.createBanner(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });

  // Update a banner
  const updateBanner = useMutation({
    mutationFn: ({
      params,
      body,
    }: {
      params: IdType;
      body: UpdateBannerInput;
    }) => api.banner.updateBannerById(params, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });

  // Delete a banner
  const deleteBanner = useMutation({
    mutationFn: (params: { id: string }) => api.banner.deleteBannerById(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });

  // Reorder banners
  const reorderBanners = useMutation({
    mutationFn: (body: ReorderBannersInput) => api.banner.reorderBanners(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["banners"] }),
  });

  return {
    banners: banners?.data,
    isLoading,
    refetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
  };
}
