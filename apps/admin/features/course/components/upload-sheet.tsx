"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@t2p-admin/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@t2p-admin/ui/components/dialog";
import { Alert, AlertDescription } from "@t2p-admin/ui/components/alert";
import { Progress } from "@t2p-admin/ui/components/progress";
import { X, Video, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { Label } from "@t2p-admin/ui/components/label";
import { Textarea } from "@t2p-admin/ui/components/textarea";
import { Input } from "@t2p-admin/ui/components/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as tus from "tus-js-client";
import {
  CreateShortsInput,
  createShortsSchema,
  ShortsOutput,
} from "@/features/shorts/helpers/shorts.schema";
import Image from "next/image";
import { CourseContentType } from "../helpers/course.schema";
import React from "react";

export interface UploadSheetProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  folderId: string;
  contents: CourseContentType[];
  setContents: React.Dispatch<React.SetStateAction<CourseContentType[]>>;
  editContentId?: string; // optional: content to edit
}

export function FileUploadSheet({
  open,
  onClose,
  courseId,
  folderId,
  contents,
  editContentId,
  setContents,
}: UploadSheetProps & {
  contents: CourseContentType[];
  setContents: React.Dispatch<React.SetStateAction<CourseContentType[]>>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [contentId, setContentId] = useState<string | null>(null);
  const [uploadController, setUploadController] =
    useState<AbortController | null>(null);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const resetForm = useCallback(() => {
    setFile(null);
    setNewName("");
    setNewDescription("");
    setContentId(null);
    setError(null);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (editContentId) {
      const editContent = contents.find((c) => c.id === editContentId);
      if (editContent) {
        setContentId(editContent.id);
        setNewName(editContent.title || "");
        setNewDescription(editContent.description || "");
      }
    } else {
      resetForm();
    }
  }, [editContentId, contents]);

  const validateFile = useCallback(
    (selectedFile: File | null | undefined): string | null => {
      if (!selectedFile) return null; // no file to validate

      if (selectedFile.size > MAX_FILE_SIZE) {
        return "File size must be less than 50MB";
      }

      if (selectedFile.type !== "application/pdf") {
        return "Only PDF files are allowed";
      }

      return null;
    },
    [MAX_FILE_SIZE]
  );

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      setError(null);

      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        return;
      }

      setFile(selectedFile);

      if (!newName.trim()) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setNewName(nameWithoutExt);
      }
    },
    [newName, validateFile]
  );

  const handleSaveContent = useCallback(async (): Promise<string | null> => {
    if (!newName.trim()) {
      setError("Title is required");
      return null;
    }
    setCreating(true);
    setError(null);

    try {
      let response;
      if (editContentId) {
        // EDIT MODE
        response = await api.courses.folder.content.updateContent(
          { id: courseId, folderId, contentId: editContentId },
          {
            title: newName.trim(),
            description: newDescription.trim(),
          }
        );
        setContents((prev) =>
          prev.map((c) =>
            c.id === editContentId
              ? { ...c, title: newName, description: newDescription }
              : c
          )
        );
        return editContentId;
      } else {
        // CREATE MODE
        response = await api.courses.folder.content.createContent(
          { id: courseId, folderId },
          {
            title: newName.trim() || "Untitled",
            description: newDescription.trim() || "",
            order: contents.length || 0,
            type: "FILE",
          }
        );
        if (!response.data?.id) throw new Error("Invalid response from server");
        const newContent = response.data;
        setContents((prev) => [...prev, newContent]);
        setContentId(newContent.id);
        return newContent.id;
      }
    } catch (err) {
      console.error("Failed to save content:", err);
      setError(err instanceof Error ? err.message : "Failed to save content");
      return null;
    } finally {
      setCreating(false);
    }
  }, [
    courseId,
    folderId,
    newName,
    newDescription,
    contents.length,
    setContents,
    editContentId,
  ]);

  const simulateProgress = useCallback((controller: AbortController) => {
    let currentProgress = 0;
    const increment = Math.random() * 15 + 5;

    const updateProgress = () => {
      if (controller.signal.aborted) return;

      currentProgress += increment;
      if (currentProgress < 90) {
        setProgress(currentProgress);
        setTimeout(updateProgress, 100 + Math.random() * 200);
      }
    };

    updateProgress();
  }, []);

  const uploadToS3 = useCallback(
    async (file: File, controller: AbortController): Promise<string> => {
      const sanitizedName = file.name.replace(/\s+/g, "-");
      const key = `uploads/${Date.now()}-${encodeURIComponent(sanitizedName)}`;

      const { data: signedRes } = await api.courses.getSignedUrl({
        type: "put",
        key,
      });

      if (!signedRes?.url) {
        throw new Error("Failed to get signed URL");
      }

      simulateProgress(controller);

      const response = await fetch(signedRes.url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
        signal: controller.signal,
      });

      if (!response.ok) {
        console.log("Response not ok:", response);
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      setProgress(95);
      return key;
    },
    [simulateProgress]
  );

  const attachFileToContent = useCallback(
    async (contentId: string, key: string, file: File): Promise<void> => {
      const response = await api.courses.folder.content.attachFile(
        { contentId, id: courseId, folderId },
        {
          key,
          size: file.size,
          type: file.type || "application/pdf",
        }
      );
      console.log("Attach file response:", response);
      setProgress(100);
    },
    [courseId, folderId]
  );

  const handleCancelUpload = useCallback(() => {
    if (uploadController) {
      uploadController.abort();
      setUploadController(null);
    }
    setUploading(false);
    setProgress(0);
  }, [uploadController]);

  const handleClose = useCallback(() => {
    if (uploading) {
      handleCancelUpload();
    }
    resetForm();
    onClose();
  }, [uploading, handleCancelUpload, resetForm, onClose]);

  const handleUpload = useCallback(async () => {
    if (!file && !editContentId) {
      setError("Please select a file");
      return;
    }

    if (!newName.trim()) {
      setError("Title is required");
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    const controller = new AbortController();
    setUploadController(controller);

    try {
      let id = contentId;
      if (!id) {
        id = await handleSaveContent();
        if (!id) return;
      } else {
        // In edit mode, update title/description
        await handleSaveContent();
      }

      if (file) {
        const key = await uploadToS3(file, controller);
        await attachFileToContent(id, key, file);
      }
      handleClose();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Upload cancelled by user");
        setError("Upload cancelled");
      } else {
        console.error("Upload failed:", err);
        const errorMessage =
          err instanceof Error
            ? `Upload failed: ${err.message}`
            : "Failed to upload file. Please try again.";
        setError(errorMessage);
      }
    } finally {
      setUploading(false);
      setUploadController(null);
    }
  }, [
    file,
    newName,
    contentId,
    validateFile,
    handleSaveContent,
    uploadToS3,
    attachFileToContent,
    handleClose,
    editContentId,
  ]);

  const getFileIcon = useCallback((file: File) => {
    const type = file.type.toLowerCase();
    if (type.includes("pdf")) return "📄";
    return "📎";
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload File
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="file-title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="file-title"
              placeholder="Enter file title"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={uploading || creating}
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="file-description">Description</Label>
            <Textarea
              id="file-description"
              placeholder="Enter file description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              disabled={uploading || creating}
              rows={3}
              maxLength={1000}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>
              File <span className="text-red-500">*</span>
            </Label>
            <div className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
              {file ? (
                <div className="space-y-3">
                  <div className="text-4xl">{getFileIcon(file)}</div>
                  <p className="font-medium text-sm break-all">{file.name}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                    <p>{file.type || "Unknown type"}</p>
                  </div>
                  {!uploading && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium text-sm">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Only PDF files allowed (max 50MB)
                  </p>
                </div>
              )}
              {!uploading && (
                <input
                  type="file"
                  accept="application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) handleFileSelect(selectedFile);
                  }}
                  disabled={uploading || creating}
                />
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelUpload}
                >
                  Cancel Upload
                </Button>
              </div>
            </div>
          )}

          {/* Creating Content Indicator */}
          {creating && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Creating content...
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading || creating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={
              !newName.trim() ||
              (!file && !editContentId) ||
              uploading ||
              creating
            }
          >
            {creating
              ? "Creating..."
              : uploading
                ? "Uploading..."
                : "Create & Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
interface UploadProgress {
  bytesUploaded: number;
  bytesTotal: number;
  percentage: number;
}

export function VideoUploadSheet({
  open,
  onClose,
  courseId,
  folderId,
  contents,
  setContents,
  editContentId,
}: UploadSheetProps) {
  const [video, setVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    bytesUploaded: 0,
    bytesTotal: 0,
    percentage: 0,
  });
  const [uploadInstance, setUploadInstance] = useState<tus.Upload | null>(null);
  const [newName, setNewName] = useState("");
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [uploadContentId, setUploadContentId] = useState<string | null>(null);

  const isEditMode = !!editContentId;

  const MAX_FILE_SIZE = 2000 * 1024 * 1024;
  const ALLOWED_TYPES = useMemo(
    () => ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
    []
  );
  const TUS_RETRY_DELAYS = useMemo(
    () => [0, 1000, 3000, 5000, 10000, 20000],
    []
  );

  const resetForm = useCallback(() => {
    setVideo(null);
    setNewName("");
    setNewDescription("");
    setError(null);
    setUploadProgress({ bytesUploaded: 0, bytesTotal: 0, percentage: 0 });
    setUploadContentId(null);
  }, []);

  useEffect(() => {
    if (open && isEditMode && editContentId) {
      const existingContent = contents.find((c) => c.id === editContentId);
      if (existingContent) {
        setNewName(existingContent.title);
        setNewDescription(existingContent.description || "");
        setVideo(null);
        setError(null);
        setUploadProgress({ bytesUploaded: 0, bytesTotal: 0, percentage: 0 });
        setUploadContentId(editContentId);
      }
    } else if (open && !isEditMode) {
      resetForm();
    }
  }, [open, isEditMode, editContentId, contents, resetForm]);

  const validateVideo = useCallback(
    (file: File): string | null => {
      if (file.size > MAX_FILE_SIZE)
        return "Video size must be less than 500MB";
      if (!ALLOWED_TYPES.includes(file.type))
        return "Please upload a valid video file (MP4, WebM, OGG, MOV)";
      return null;
    },
    [ALLOWED_TYPES, MAX_FILE_SIZE]
  );

  const handleVideoSelect = useCallback(
    async (selectedVideo: File) => {
      setError(null);

      const validationError = validateVideo(selectedVideo);
      if (validationError) {
        setError(validationError);
        return;
      }

      try {
        const duration = await getVideoDuration(selectedVideo);
        setVideo(selectedVideo);
        setVideoDuration(duration);

        if (!newName.trim()) {
          const nameWithoutExt = selectedVideo.name.replace(/\.[^/.]+$/, "");
          setNewName(nameWithoutExt);
        }
      } catch (err) {
        console.error("Failed to get video duration:", err);
        setError("Failed to read video duration. Please try another file.");
      }
    },
    [newName, validateVideo]
  );

  const handleCreateContent = useCallback(async (): Promise<
    string | undefined
  > => {
    if (!newName.trim()) {
      setError("Title is required");
      return;
    }
    setCreating(true);
    setError(null);

    try {
      const response = await api.courses.folder.content.createContent(
        { id: courseId, folderId },
        {
          title: newName.trim(),
          description: newDescription.trim(),
          order: contents.length,
          type: "VIDEO",
        }
      );
      if (!response.data?.id) throw new Error("Invalid response from server");
      const newContent = response.data;
      setContents((prev) => [...prev, newContent]);
      setUploadContentId(newContent.id);
      return newContent.id;
    } catch (err) {
      console.error("Failed to create content:", err);
      setError(
        err instanceof Error
          ? `Failed to create content: ${err.message}`
          : "Failed to create content. Please try again."
      );
      return;
    } finally {
      setCreating(false);
    }
  }, [
    newName,
    newDescription,
    contents.length,
    courseId,
    folderId,
    setContents,
  ]);

  // NEW: Delete helper
  const safeDeleteContent = useCallback(
    async (contentId: string) => {
      try {
        await api.courses.folder.content.deleteContent({
          id: courseId,
          folderId,
          contentId,
        });
        setContents((prev) => prev.filter((c) => c.id !== contentId));
      } catch (err) {
        console.error("Failed to cleanup content:", err);
      }
    },
    [courseId, folderId, setContents]
  );

  const handleCancelUpload = useCallback(async () => {
    if (uploadInstance) {
      try {
        uploadInstance.abort();
      } catch (err) {
        console.warn(err);
      }
      setUploadInstance(null);
    }

    // NEW: Cleanup created content
    if (uploadContentId && !isEditMode) {
      const idToDelete = uploadContentId;
      setUploadContentId(null);
      await safeDeleteContent(idToDelete);
    }

    setUploading(false);
    setUploadProgress({ bytesUploaded: 0, bytesTotal: 0, percentage: 0 });
  }, [uploadInstance, uploadContentId, isEditMode, safeDeleteContent]);

  const startTusUpload = useCallback(
    async (contentId: string, videoFile: File) => {
      try {
        if (!videoDuration) return;

        const response = await api.courses.folder.content.attachVideo(
          { id: courseId, folderId, contentId },
          { title: videoFile.name, duration: videoDuration }
        );

        if (!response.data) return;
        const {
          presigned,
          libraryId,
          videoId,
          expire,
          video: responseVideo,
        } = response.data;
        if (!presigned || !libraryId || !videoId || !expire)
          throw new Error("Missing required upload parameters");

        const upload = new tus.Upload(videoFile, {
          endpoint: "https://video.bunnycdn.com/tusupload",
          retryDelays: TUS_RETRY_DELAYS,
          parallelUploads: 3,
          chunkSize: 20 * 1024 * 1024,
          removeFingerprintOnSuccess: true,
          headers: {
            AuthorizationSignature: presigned,
            AuthorizationExpire: expire.toString(),
            VideoId: videoId,
            LibraryId: libraryId.toString(),
          },
          metadata: {
            collection: responseVideo?.collectionId || "",
            filename: videoFile.name,
            filetype: videoFile.type,
            title: newName.trim(),
          },
          onError: async (err) => {
            // NEW
            setError(`Upload failed: ${err.message || "Unknown upload error"}`);
            setUploading(false);
            setUploadInstance(null);
            if (uploadContentId && !isEditMode) {
              const idToDelete = uploadContentId;
              setUploadContentId(null);
              await safeDeleteContent(idToDelete);
            }
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage =
              bytesTotal > 0
                ? Math.round((bytesUploaded / bytesTotal) * 100)
                : 0;
            setUploadProgress({ bytesUploaded, bytesTotal, percentage });
          },
          onSuccess: async () => {
            // NEW
            try {
              await api.courses.folder.content.updateContent(
                { id: courseId, folderId, contentId },
                { title: newName.trim(), description: newDescription.trim() }
              );
              setContents((prev) =>
                prev.map((c) =>
                  c.id === contentId
                    ? {
                        ...c,
                        title: newName.trim(),
                        description: newDescription.trim(),
                      }
                    : c
                )
              );
              resetForm();
              setUploading(false);
              setUploadInstance(null);
              onClose();
            } catch (err) {
              console.error("Update after upload failed:", err);
              setError("Upload finished but updating content failed.");
              if (!isEditMode) {
                await safeDeleteContent(contentId);
              }
              setUploading(false);
            }
          },
        });

        setUploadInstance(upload);

        try {
          const previousUploads = await upload.findPreviousUploads();
          if (previousUploads.length)
            upload.resumeFromPreviousUpload(previousUploads[0]);
          upload.start();
        } catch {
          upload.start();
        }
      } catch (err) {
        console.error("Failed to initialize upload:", err);
        setError(
          err instanceof Error
            ? `Failed to start upload: ${err.message}`
            : "Failed to initiate upload. Please try again."
        );
        setUploading(false);
      }
    },
    [
      videoDuration,
      courseId,
      folderId,
      TUS_RETRY_DELAYS,
      newName,
      uploadContentId,
      isEditMode,
      safeDeleteContent,
      newDescription,
      setContents,
      resetForm,
      onClose,
    ]
  );

  const handleClose = useCallback(() => {
    if (uploading) handleCancelUpload(); // NEW auto cancel
    resetForm();
    onClose();
  }, [uploading, handleCancelUpload, resetForm, onClose]);

  const handleUpload = useCallback(async () => {
    if (!newName.trim()) {
      setError("Title is required");
      return;
    }
    setUploading(true);
    setError(null);
    setUploadProgress({ bytesUploaded: 0, bytesTotal: 0, percentage: 0 });

    try {
      let idToUse = uploadContentId || editContentId;

      if (!idToUse && !isEditMode) {
        idToUse = await handleCreateContent();
        if (!idToUse) {
          setUploading(false);
          return;
        }
      }
      if (!idToUse) throw new Error("Content ID missing");

      if (isEditMode && !video) {
        await api.courses.folder.content.updateContent(
          { id: courseId, folderId, contentId: idToUse },
          { title: newName.trim(), description: newDescription.trim() }
        );
        setContents((prev) =>
          prev.map((c) =>
            c.id === idToUse
              ? {
                  ...c,
                  title: newName.trim(),
                  description: newDescription.trim(),
                }
              : c
          )
        );
        handleClose();
        return;
      }

      if (video) {
        await api.courses.folder.content.updateContent(
          { id: courseId, folderId, contentId: idToUse },
          { title: newName.trim(), description: newDescription.trim() }
        );
        setContents((prev) =>
          prev.map((c) =>
            c.id === idToUse
              ? {
                  ...c,
                  title: newName.trim(),
                  description: newDescription.trim(),
                }
              : c
          )
        );
        await startTusUpload(idToUse, video);
      }
    } catch (err) {
      console.error("Upload process failed:", err);
      setError(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
      setUploading(false);
      if (uploadContentId && !isEditMode) {
        await safeDeleteContent(uploadContentId);
        setUploadContentId(null);
      }
    }
  }, [
    video,
    newName,
    newDescription,
    uploadContentId,
    editContentId,
    isEditMode,
    handleCreateContent,
    startTusUpload,
    courseId,
    folderId,
    setContents,
    handleClose,
    safeDeleteContent,
  ]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {isEditMode ? "Edit Video" : "Upload Video"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="video-title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="video-title"
              placeholder="Enter video title"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={uploading || creating}
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="video-description">Description</Label>
            <Textarea
              id="video-description"
              placeholder="Enter video description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              disabled={uploading || creating}
              rows={3}
              maxLength={1000}
            />
          </div>

          {/* Video Upload - only in create mode */}
          {!isEditMode && (
            <div className="space-y-2">
              <Label>
                Video File <span className="text-red-500">*</span>
              </Label>
              <div className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                {video ? (
                  <div className="space-y-3">
                    <Video className="h-10 w-10 mx-auto text-primary" />
                    <p className="font-medium text-sm break-all">
                      {video.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(video.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                    {!uploading && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setVideo(null)}
                      >
                        <X className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <Video className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium text-sm">
                      Drop your video here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports MP4, WebM, OGG, MOV (max 2GB)
                    </p>
                  </div>
                )}
                {!uploading && (
                  <input
                    type="file"
                    accept={ALLOWED_TYPES.join(",")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoSelect(file);
                    }}
                    disabled={uploading || creating}
                  />
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">
                  {uploadProgress.percentage}%
                </span>
              </div>
              <Progress value={uploadProgress.percentage} className="w-full" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {(uploadProgress.bytesUploaded / 1024 / 1024).toFixed(1)} MB /{" "}
                  {(uploadProgress.bytesTotal / 1024 / 1024).toFixed(1)} MB
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelUpload}
                >
                  Cancel Upload
                </Button>
              </div>
            </div>
          )}

          {/* Creating Indicator */}
          {creating && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>{" "}
                Creating content...
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading || creating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={
              !newName.trim() ||
              uploading ||
              creating ||
              (!isEditMode && !videoDuration)
            }
          >
            {isEditMode
              ? "Save Changes"
              : creating
                ? "Creating..."
                : uploading
                  ? "Uploading..."
                  : "Create & Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.src = url;

    videoEl.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(videoEl.duration);
    };

    videoEl.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
  });
};

export interface ShortsUploadSheetProps {
  open: boolean;
  onClose: () => void;
  editShort?: ShortsOutput | null;
}

export function ShortsUploadSheet({
  open,
  onClose,
  editShort,
}: ShortsUploadSheetProps) {
  const [video, setVideo] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    bytesUploaded: 0,
    bytesTotal: 0,
    percentage: 0,
  });
  const [uploadInstance, setUploadInstance] = useState<tus.Upload | null>(null);

  const isEditMode = !!editShort;

  const form = useForm<CreateShortsInput>({
    resolver: zodResolver(createShortsSchema),
    defaultValues: {
      title: editShort?.title || "",
      description: editShort?.description || "",
    },
  });

  useEffect(() => {
    if (editShort) {
      form.reset({
        title: editShort.title || "",
        description: editShort.description || "",
      });
    } else {
      form.reset({ title: "", description: "" });
    }
    setVideo(null);
    setError(null);
    setUploadProgress({ bytesUploaded: 0, bytesTotal: 0, percentage: 0 });
  }, [editShort, form]);

  const handleVideoSelect = (selectedVideo: File) => {
    setError(null);
    const maxSize = 200 * 1024 * 1024;
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];

    if (selectedVideo.size > maxSize) {
      setError("Video size must be less than 200MB");
      return;
    }

    if (!allowedTypes.includes(selectedVideo.type)) {
      setError("Please upload a valid video file (MP4, WebM, OGG, MOV)");
      return;
    }

    setVideo(selectedVideo);
  };

  const handleUpdateShort = async (values: CreateShortsInput) => {
    if (!editShort) return;

    setUpdating(true);
    setError(null);

    try {
      const updateData: CreateShortsInput = {
        title: values.title,
        description: values.description,
      };

      await api.shorts.updateShortById({ id: editShort.videoId }, updateData);

      setUpdating(false);
      onClose();
    } catch (err) {
      console.error("Failed to update short:", err);
      setError("Failed to update short. Please try again.");
      setUpdating(false);
    }
  };

  const handleCreateShort = async (values: CreateShortsInput) => {
    if (!video) {
      setError("Please select a video file");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const short = await api.shorts.createShort(values as CreateShortsInput);

      const {
        presigned,
        libraryId,
        videoId,
        expire,
        short: shortData,
      } = short.data!;

      // Step 2: Upload video with TUS
      const upload = new tus.Upload(video, {
        endpoint: "https://video.bunnycdn.com/tusupload",
        retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
        headers: {
          AuthorizationSignature: presigned,
          AuthorizationExpire: expire.toString(),
          VideoId: videoId,
          LibraryId: libraryId.toString(),
        },
        metadata: {
          filename: video.name,
          filetype: video.type,
          title: values.title,
          collection: shortData.collectionId,
        },
        onError: (error) => {
          console.error("TUS Upload failed:", error);
          setError(`Upload failed: ${error.message}`);
          setUploading(false);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
          setUploadProgress({ bytesUploaded, bytesTotal, percentage });
        },
        onSuccess: () => {
          setVideo(null);
          setError(null);
          setUploadProgress({ bytesUploaded: 0, bytesTotal: 0, percentage: 0 });
          setUploading(false);
          onClose();
        },
      });

      setUploadInstance(upload);

      upload
        .findPreviousUploads()
        .then((previousUploads) => {
          if (previousUploads.length) {
            upload.resumeFromPreviousUpload(previousUploads[0]!);
          }
          upload.start();
        })
        .catch(() => upload.start());
    } catch (err) {
      console.error("Failed to create short or initiate upload:", err);
      setError("Failed to create short. Please try again.");
      setUploading(false);
    }
  };

  const handleSubmitForm = async (values: CreateShortsInput) => {
    if (isEditMode) {
      await handleUpdateShort(values);
    } else {
      await handleCreateShort(values);
    }
  };

  const handleCancelUpload = () => {
    if (uploadInstance) uploadInstance.abort();
    setUploading(false);
    setUploadProgress({ bytesUploaded: 0, bytesTotal: 0, percentage: 0 });
  };

  const handleClose = () => {
    if (uploading) handleCancelUpload();
    setVideo(null);
    setError(null);
    setUploadProgress({ bytesUploaded: 0, bytesTotal: 0, percentage: 0 });
    setUpdating(false);
    onClose();
  };

  const getThumbnailUrl = (videoId: string) => {
    return `https://vz-89e3d251-e65.b-cdn.net/${videoId}/thumbnail.jpg`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {isEditMode ? "Edit Short" : "Upload Short"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="space-y-6 py-4"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Enter short title"
              disabled={uploading || updating}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Enter short description"
              disabled={uploading || updating}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Current Video Preview (Edit Mode) */}
          {isEditMode && editShort && (
            <div className="space-y-2">
              <Label>Current Video</Label>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-16 h-28 bg-gray-200 rounded overflow-hidden">
                  <Image
                    width={100}
                    height={200}
                    src={getThumbnailUrl(editShort.videoId)}
                    alt={editShort.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='112' viewBox='0 0 64 112'%3E%3Crect width='64' height='112' fill='%23f3f4f6'/%3E%3Ctext x='32' y='56' text-anchor='middle' fill='%239ca3af' font-size='8' font-family='Arial'%3ENo Thumb%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {editShort.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Video ID: {editShort.videoId}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Note: Video file cannot be changed in edit mode. Only title and
                description can be updated.
              </p>
            </div>
          )}

          {/* Video Upload (Create Mode Only) */}
          {!isEditMode && (
            <div className="space-y-2">
              <Label>Video File</Label>
              <div className="relative border-2 border-dashed rounded-lg p-6 text-center">
                {video ? (
                  <div className="space-y-3">
                    <Video className="h-10 w-10 mx-auto text-primary" />
                    <p className="font-medium text-sm">{video.name}</p>
                    <p className="text-xs text-gray-500">
                      Size: {(video.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                    {!uploading && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setVideo(null)}
                      >
                        <X className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <Video className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    <p className="font-medium text-sm">
                      Drop your video here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports MP4, WebM, OGG, MOV (max 200MB)
                    </p>
                  </div>
                )}
                {!uploading && (
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const selectedVideo = e.target.files?.[0];
                      if (selectedVideo) handleVideoSelect(selectedVideo);
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">
                  {uploadProgress.percentage}%
                </span>
              </div>
              <Progress value={uploadProgress.percentage} className="w-full" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {(uploadProgress.bytesUploaded / (1024 * 1024)).toFixed(1)} MB
                  /{(uploadProgress.bytesTotal / (1024 * 1024)).toFixed(1)} MB
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelUpload}
                  className="h-6 px-2 text-xs"
                >
                  Cancel Upload
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={uploading || updating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={(!video && !isEditMode) || uploading || updating}
            >
              {uploading
                ? "Uploading..."
                : updating
                  ? "Updating..."
                  : isEditMode
                    ? "Update Short"
                    : "Create & Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
