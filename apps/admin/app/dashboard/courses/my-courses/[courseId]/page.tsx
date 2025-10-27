"use client";

import { useEffect, useState, useCallback } from "react";
import { IconBook, IconFolderPlus } from "@tabler/icons-react";
import { Header } from "@/components/dashboard/page-header";
import FolderList from "@/features/course/components/folder-list";
import { CourseFolderType } from "@/features/course/helpers/folder.schema";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { Button } from "@t2p-admin/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@t2p-admin/ui/components/dialog";
import { Input } from "@t2p-admin/ui/components/input";
import { Label } from "@t2p-admin/ui/components/label";
import { toast } from "sonner";
import { Plus, RefreshCw } from "lucide-react";

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [folders, setFolders] = useState<CourseFolderType[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const loadFolders = useCallback(async () => {
    if (!courseId) return;

    setLoading(true);
    try {
      const foldersResponse = await api.courses.folder.getFolders({
        id: courseId,
      });
      setFolders(
        (foldersResponse.data || []).sort((a, b) => a.order - b.order)
      );
    } catch (error) {
      console.error("Failed to load folders:", error);
      toast.error("Failed to load folders");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  const handleLock = useCallback(
    async (id: string) => {
      try {
        await api.courses.folder.lockFolder({ id: courseId, folderId: id });
        setFolders((prev) =>
          prev.map((f) => (f.id === id ? { ...f, lock: true } : f))
        );
        toast.success("Folder locked successfully");
      } catch (error) {
        console.error("Failed to lock folder:", error);
        toast.error("Failed to lock folder");
      }
    },
    [courseId]
  );

  const handleUnlock = useCallback(
    async (id: string) => {
      try {
        await api.courses.folder.unlockFolder({ id: courseId, folderId: id });
        setFolders((prev) =>
          prev.map((f) => (f.id === id ? { ...f, lock: false } : f))
        );
        toast.success("Folder unlocked successfully");
      } catch (error) {
        console.error("Failed to unlock folder:", error);
        toast.error("Failed to unlock folder");
      }
    },
    [courseId]
  );

  const handleRename = useCallback(
    async (id: string, newName: string) => {
      try {
        await api.courses.folder.updateFolder(
          { id: courseId, folderId: id },
          { name: newName }
        );

        setFolders((prev) =>
          prev.map((f) => (f.id === id ? { ...f, name: newName } : f))
        );

        toast.success("Folder renamed successfully");
      } catch (error) {
        console.error("Failed to rename folder:", error);
        toast.error("Failed to rename folder");
      }
    },
    [courseId]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await api.courses.folder.deleteFolder({ id: courseId, folderId: id });

        // Just remove the folder - backend handles order automatically
        setFolders((prev) => prev.filter((f) => f.id !== id));

        toast.success("Folder deleted successfully");
      } catch (error) {
        console.error("Failed to delete folder:", error);
        toast.error("Failed to delete folder");
      }
    },
    [courseId]
  );

  const handleReorder = useCallback(
    async (reorderedFolders: CourseFolderType[]) => {
      try {
        // Optimistic update
        setFolders(reorderedFolders);

        await api.courses.folder.reorderFolders(
          { id: courseId },
          {
            folderOrders: reorderedFolders.map((folder, index) => ({
              id: folder.id,
              order: index,
            })),
          }
        );

        toast.success("Folders reordered successfully");
      } catch (error) {
        console.error("Failed to reorder folders:", error);
        toast.error("Failed to reorder folders");
        // Revert on error
        loadFolders();
      }
    },
    [courseId, loadFolders]
  );

  const handleCreate = useCallback(async () => {
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const newFolder = await api.courses.folder.createFolder(
        { id: courseId },
        {
          name: newName.trim(),
        }
      );

      setFolders((prev) =>
        [...prev, newFolder.data!].sort((a, b) => a.order - b.order)
      );

      setNewName("");
      setCreateOpen(false);
      toast.success("Folder created successfully");
    } catch (error) {
      console.error("Failed to create folder:", error);
      toast.error("Failed to create folder");
    } finally {
      setCreating(false);
    }
  }, [courseId, newName]);

  const handleRefresh = useCallback(async () => {
    await loadFolders();
    toast.success("Folders refreshed");
  }, [loadFolders]);

  const handleCreateOpen = useCallback(() => {
    setNewName("");
    setCreateOpen(true);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <Header
        icon={<IconBook className="w-6 h-6 text-primary" />}
        title={"Course Folders"}
        description="Organize your course content with folders. Drag to reorder."
        onRefresh={handleRefresh}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={handleCreateOpen}
              size="sm"
              className="gap-2 hover:gap-3 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              New Folder
            </Button>
          </div>
        }
      />

      <div className="flex-1 container max-w-7xl mx-auto px-6 py-6">
        <div className="max-w-4xl">
          <FolderList
            folders={folders}
            onRename={handleRename}
            onDelete={handleDelete}
            onReorder={handleReorder}
            onCreateFolder={handleCreateOpen}
            onLock={handleLock}
            onUnlock={handleUnlock}
            loading={loading}
          />
        </div>
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconFolderPlus className="w-5 h-5 text-primary" />
              Create New Folder
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                placeholder="Enter folder name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={creating}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newName.trim()) {
                    handleCreate();
                  }
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Folder will be added at the end automatically.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newName.trim() || creating}
              className="gap-2"
            >
              {creating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Folder
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
