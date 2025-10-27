"use client";

import { IconPhoto, IconPlus } from "@tabler/icons-react";
import { Button } from "@t2p-admin/ui/components/button";
import { toast } from "sonner";
import { useEffect } from "react";
import { CreatePostInput, PostType } from "../helpers/post.schema";
import { usePostSheet } from "../hooks/usePostSheet";
import { PostSheet } from "./post-sheet";
import { usePosts } from "../hooks/usePost";
import { PostGrid } from "./post-card";
import { Shell } from "@t2p-admin/ui/components/extra/shell";
import { Header } from "../../../components/dashboard/page-header";

export default function PostClient() {
  const {
    data,
    isLoading,
    error,
    refetch,
    handleReorder,
    handlePublish,
    handleUnpublish,
    handleDelete,
  } = usePosts({
    initialPageSize: 10,
    enabled: true,
  });

  const {
    isOpen,
    currentPost,
    mode,
    isLoading: isSheetLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  } = usePostSheet();

  const handleSheetSave = async (data: CreatePostInput) => {
    await handleSave(data);
    await refetch();
  };

  const handleEdit = (post: PostType) => {
    openSheet(post, "edit");
  };

  const handleDeletePost = async (post: PostType) => {
    try {
      await handleDelete(post);
      toast.success("Post deleted successfully");
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete post");
    }
  };

  const handlePublishPost = async (post: PostType) => {
    try {
      await handlePublish(post);
      toast.success("Post published successfully");
      await refetch();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to publish post"
      );
    }
  };

  const handleUnpublishPost = async (post: PostType) => {
    try {
      await handleUnpublish(post);
      toast.success("Post unpublished successfully");
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to unpublish post");
    }
  };

  const handleReorderPosts = async (
    postOrders: { id: string; order: number }[]
  ) => {
    try {
      await handleReorder({ postOrders });
      toast.success("Post order updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reorder posts");
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <>
      <Header
        icon={<IconPhoto className="size-6 text-primary" />}
        title="Post Management"
        description="Manage and organize Posts"
        onRefresh={handleRefresh}
        refreshing={isLoading}
        actions={
          <Button
            size="sm"
            className="gap-2"
            onClick={() => openSheet(undefined, "create")}
          >
            <IconPlus className="size-4" />
            Add Post
          </Button>
        }
      />

      <PostSheet
        post={currentPost}
        isOpen={isOpen}
        onClose={closeSheet}
        mode={mode}
        onModeChange={setMode}
        onSave={handleSheetSave}
        isLoading={isSheetLoading}
      />

      <Shell>
        {data && data.data && (
          <PostGrid
            posts={data.data}
            onEdit={handleEdit}
            onDelete={handleDeletePost}
            onPublish={handlePublishPost}
            onUnpublish={handleUnpublishPost}
            onReorder={handleReorderPosts}
          />
        )}
      </Shell>
    </>
  );
}
