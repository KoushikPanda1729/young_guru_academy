"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@t2p-admin/ui/components/button";
import { api } from "@/lib/api";
import ContentList from "@/features/course/components/content-list";
import { CourseContentType } from "@/features/course/helpers/course.schema";
import { Header } from "@/components/dashboard/page-header";
import {
  IconFilePlus,
  IconQuestionMark,
  IconVideoPlus,
} from "@tabler/icons-react";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@t2p-admin/ui/components/dropdown-menu";
import {
  FileUploadSheet,
  VideoUploadSheet,
} from "@/features/course/components/upload-sheet";
import { QuizUploadSheet } from "@/features/course/components/question-upload-sheet";
import { FileViewSheet } from "@/features/course/components/file-view-sheet";
import { VideoViewSheet } from "@/features/course/components/video-view-sheet";
import { QuizViewSheet } from "@/features/course/components/quiz-view-sheet";
import { toast } from "sonner";

type ContentType = "FILE" | "VIDEO" | "QUIZ";
type ContentMode = "view" | "edit" | null;
type ReorderPayload = { id: string; order: number };

export default function FolderPage() {
  const { courseId, folderId } = useParams<{
    courseId: string;
    folderId: string;
  }>();
  const [contents, setContents] = useState<CourseContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [folderName, setFolderName] = useState<string | null>(null);

  const [activeSheet, setActiveSheet] = useState<{
    id?: string;
    type: ContentType | null;
    mode: ContentMode;
  } | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const folderResponse = await api.courses.folder.getFolderById({
        id: courseId,
        folderId,
      });
      setFolderName(folderResponse.data?.name || "Folder Content");

      const { data } = await api.courses.folder.content.getContent({
        id: courseId,
        folderId,
      });
      setContents(data || []);
      setLoading(false);
    })();
  }, [courseId, folderId]);

  const handleLock = useCallback(
    async (id: string) => {
      try {
        await api.courses.folder.content.lockContent({
          id: courseId,
          folderId,
          contentId: id,
        });
        setContents((prev) =>
          prev.map((f) => (f.id === id ? { ...f, lock: true } : f))
        );
        toast.success("Content locked successfully");
      } catch (error) {
        console.error("Failed to lock content:", error);
        toast.error("Failed to lock content");
      }
    },
    [courseId, folderId]
  );

  const handleUnlock = useCallback(
    async (id: string) => {
      try {
        await api.courses.folder.content.unlockContent({
          id: courseId,
          folderId,
          contentId: id,
        });
        setContents((prev) =>
          prev.map((f) => (f.id === id ? { ...f, lock: false } : f))
        );
        toast.success("Content unlocked successfully");
      } catch (error) {
        console.error("Failed to unlock content:", error);
        toast.error("Failed to unlock content");
      }
    },
    [courseId, folderId]
  );

  const handleCloseSheet = useCallback(() => {
    setActiveSheet(null);
    (async () => {
      const { data } = await api.courses.folder.content.getContent({
        id: courseId,
        folderId,
      });
      setContents(data || []);
    })();
  }, [courseId, folderId]);

  const handleRename = useCallback(
    (id: string, currentName: string, currentDescription: string) => {
      const contentToEdit = contents.find((c) => c.id === id);
      if (contentToEdit) {
        setActiveSheet({
          id: contentToEdit.id,
          type: contentToEdit.type,
          mode: "edit",
        });
      }
    },
    [contents]
  );

  const handleView = useCallback(
    (id: string) => {
      const contentToView = contents.find((c) => c.id === id);
      if (contentToView) {
        setActiveSheet({
          id: contentToView.id,
          type: contentToView.type,
          mode: "view",
        });
      }
    },
    [contents]
  );

  const handleReorder = async (items: ReorderPayload[]) => {
    try {
      // Optimistic update
      setContents((prev) =>
        prev
          .map((c) => {
            const found = items.find((i) => i.id === c.id);
            return found ? { ...c, order: found.order } : c;
          })
          .sort((a, b) => a.order - b.order)
      );

      await api.courses.folder.content.reorderContent(
        { id: courseId, folderId },
        { items }
      );

      toast.success("Content reordered successfully");
    } catch (error) {
      console.error("Failed to reorder contents:", error);
      toast.error("Failed to reorder contents");
      // Reload on error
      const { data } = await api.courses.folder.content.getContent({
        id: courseId,
        folderId,
      });
      setContents(data || []);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const params = { id: courseId, folderId, contentId: id };
      await api.courses.folder.content.deleteContent(params);

      // Just remove - backend handles order automatically
      setContents((prev) => prev.filter((c) => c.id !== id));

      toast.success("Content deleted successfully");
    } catch (error) {
      console.error("Failed to delete content:", error);
      toast.error("Failed to delete content");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="shrink-0 border-b pb-4">
        <Header
          icon={<IconFilePlus className="w-6 h-6 text-primary" />}
          title={folderName || "Loading..."}
          description="Manage files, videos, and quizzes inside this folder"
          actions={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">+ New Content</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setActiveSheet({ type: "FILE", mode: "edit" })}
                >
                  <IconFilePlus className="mr-2 h-4 w-4" /> Add File
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setActiveSheet({ type: "VIDEO", mode: "edit" })
                  }
                >
                  <IconVideoPlus className="mr-2 h-4 w-4" /> Add Video
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveSheet({ type: "QUIZ", mode: "edit" })}
                >
                  <IconQuestionMark className="mr-2 h-4 w-4" /> Add Quiz
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          <ContentList
            contents={contents}
            onRename={handleRename}
            onDelete={handleDelete}
            onView={handleView}
            onUnlock={handleUnlock}
            onLock={handleLock}
            onReorder={handleReorder}
          />
        )}
      </div>

      {/* Sheets remain the same */}
      {activeSheet?.type === "FILE" && activeSheet.mode === "edit" && (
        <FileUploadSheet
          open
          onClose={handleCloseSheet}
          courseId={courseId}
          folderId={folderId}
          contents={contents}
          setContents={setContents}
          editContentId={activeSheet.id}
        />
      )}
      {activeSheet?.type === "FILE" &&
        activeSheet.mode === "view" &&
        activeSheet.id && (
          <FileViewSheet
            open
            onClose={handleCloseSheet}
            courseId={courseId}
            folderId={folderId}
            contentId={activeSheet.id}
            initialContent={contents.find((c) => c.id === activeSheet.id)}
          />
        )}

      {activeSheet?.type === "VIDEO" && activeSheet.mode === "edit" && (
        <VideoUploadSheet
          open
          onClose={handleCloseSheet}
          courseId={courseId}
          folderId={folderId}
          contents={contents}
          setContents={setContents}
          editContentId={activeSheet.id}
        />
      )}
      {activeSheet?.type === "VIDEO" &&
        activeSheet.mode === "view" &&
        activeSheet.id && (
          <VideoViewSheet
            open
            onClose={handleCloseSheet}
            courseId={courseId}
            folderId={folderId}
            contentId={activeSheet.id}
            initialContent={contents.find((c) => c.id === activeSheet.id)}
          />
        )}

      {activeSheet?.type === "QUIZ" && activeSheet.mode === "edit" && (
        <QuizUploadSheet
          open
          onClose={handleCloseSheet}
          courseId={courseId}
          folderId={folderId}
          contents={contents}
          setContents={setContents}
          editContentId={activeSheet.id}
        />
      )}
      {activeSheet?.type === "QUIZ" &&
        activeSheet.mode === "view" &&
        activeSheet.id && (
          <QuizViewSheet
            open
            onClose={handleCloseSheet}
            courseId={courseId}
            folderId={folderId}
            contentId={activeSheet.id}
            initialContent={contents.find((c) => c.id === activeSheet.id)}
          />
        )}
    </div>
  );
}
