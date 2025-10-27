"use client";

import { useCallback, useState } from "react";
import {
  useQuery,
  useMutation,
  type UseQueryResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { PaginatedTableData } from "@/components/table/tanstack-table";
import { api } from "@/lib/api";
import { CreatePostInput, PostQuery, PostType } from "../helpers/post.schema";

interface UsePostsOptions {
  initialPageSize?: number;
  enabled?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const queryClient = useQueryClient();

  const [query, setQuery] = useState<PostQuery>({
    page: 1,
    limit: options.initialPageSize || 20,
    status: "all",
  });
  const postsQuery: UseQueryResult<PaginatedTableData<PostType>> = useQuery({
    queryKey: ["posts", query],
    queryFn: async () => {
      const response = await api.post.getPosts(query);
      const items = response.data ?? [];
      const totalCount = response.meta.pagination.total || 0;

      return {
        data: items,
        total_filtered: totalCount,
        limit: query.limit,
      };
    },
    enabled: options.enabled || true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [queryClient]);

  const { mutateAsync: deletePost } = useMutation({
    mutationFn: api.post.deletePostById,
    onSuccess: invalidateAll,
  });

  const { mutateAsync: createPost } = useMutation({
    mutationFn: api.post.createPost,
    onSuccess: invalidateAll,
  });

  const { mutateAsync: updatePost } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreatePostInput }) =>
      api.post.updatePostById({ id }, data),
    onSuccess: invalidateAll,
  });

  const { mutateAsync: reorderPosts } = useMutation({
    mutationFn: (data: { postOrders: { id: string; order: number }[] }) =>
      api.post.reorderPosts(data),
    onSuccess: invalidateAll,
  });

  const { mutateAsync: publishPost } = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.post.publishPostById({ id });
    },
  });

  const { mutateAsync: unPublishPost } = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.post.unPublishPostById({ id });
    },
  });

  const handlePublish = useCallback(
    async (post: PostType): Promise<void> => {
      if (post.endsAt && new Date(post.endsAt) < new Date()) {
        throw new Error("Cannot publish a post that has already ended.");
      }
      await publishPost(post.id);
    },
    [publishPost]
  );

  const handleUnpublish = useCallback(
    async (post: PostType): Promise<void> => {
      await unPublishPost(post.id);
    },
    [unPublishPost]
  );

  const handleReorder = useCallback(
    async (data: {
      postOrders: { id: string; order: number }[];
    }): Promise<void> => {
      await reorderPosts(data);
    },
    [reorderPosts]
  );
  const handleCreate = useCallback(
    async (data: CreatePostInput): Promise<void> => {
      await createPost(data);
    },
    [createPost]
  );

  const handleUpdate = useCallback(
    async (id: string, data: CreatePostInput): Promise<void> => {
      await updatePost({ id, data });
    },
    [updatePost]
  );

  const handleDelete = useCallback(
    async (post: PostType): Promise<void> => {
      await deletePost({ id: post.id });
    },
    [deletePost]
  );

  return {
    data: postsQuery.data ?? null,
    isLoading: postsQuery.isLoading,
    error: postsQuery.error?.message ?? null,
    setQuery,
    query,
    refetch: postsQuery.refetch,
    handleDelete,
    handleCreate,
    handleUpdate,
    handleReorder,
    handlePublish,
    handleUnpublish,
  };
}
