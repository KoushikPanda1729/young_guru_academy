"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { CreatePostInput, PostType } from "../helpers/post.schema";

interface UsePostSheetReturn {
  isOpen: boolean;
  currentPost: PostType | null;
  mode: "view" | "edit" | "create";
  isLoading: boolean;
  openSheet: (post?: PostType | null, mode?: "view" | "edit" | "create") => void;
  closeSheet: () => void;
  setMode: (mode: "view" | "edit" | "create") => void;
  handleSave: (data: CreatePostInput) => Promise<void>;
}

export function usePostSheet(): UsePostSheetReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostType | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | "create">("view");
  const [isLoading, setIsLoading] = useState(false);

  const openSheet = useCallback(
    (post?: PostType | null, initialMode: "view" | "edit" | "create" = "view") => {
      setCurrentPost(post ?? null);
      setMode(initialMode);
      setIsOpen(true);
    },
    []
  );

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    setCurrentPost(null);
    setMode("view");
  }, []);

  const handleSave = useCallback(
    async (data: CreatePostInput) => {
      setIsLoading(true);
      try {
        if (mode === "create") {
          const created = await api.post.createPost(data);
          setCurrentPost(created.data);
          setMode("view");
          toast.success("Post created successfully");
        } else if (currentPost) {
          const updated = await api.post.updatePostById({ id: currentPost.id }, data);
          setCurrentPost(updated.data);
          toast.success("Post updated successfully");
        }
      } catch (error) {
        console.error("Error saving post:", error);
        toast.error("Failed to save post");
      } finally {
        setIsLoading(false);
      }
    },
    [currentPost, mode]
  );

  return {
    isOpen,
    currentPost,
    mode,
    isLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  };
}
