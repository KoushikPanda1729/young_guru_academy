"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@t2p-admin/ui/components/dialog";
import { Button } from "@t2p-admin/ui/components/button";
import { FileText, Download, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import { CourseContentType } from "../helpers/course.schema";
import { FileOutput } from "../helpers/folder.schema";

interface FileViewSheetProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  folderId: string;
  contentId: string;
  initialContent?: CourseContentType;
}

export function FileViewSheet({
  open,
  onClose,
  courseId,
  folderId,
  contentId,
  initialContent,
}: FileViewSheetProps) {
  const [content, setContent] = useState<CourseContentType | null>(
    initialContent || null
  );
  const [file, setFile] = useState<FileOutput["file"] | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const fetchFileDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.courses.folder.content.getFile({
          id: courseId,
          folderId,
          contentId,
        });

        if (!res.data) {
          if (!cancelled) setError("File details not found.");
          return;
        }

        const { file: fetchedFile, ...rest } = res.data;

        if (!cancelled) {
          setContent(rest);
          setFile(fetchedFile);
        }

        if (!fetchedFile?.key) {
          if (!cancelled) setError("File key not found for this content.");
          return;
        }

        // Fetch the signed URL
        const signedUrlRes = await api.courses.getSignedUrl({
          type: "get",
          key: fetchedFile.key,
        });

        if (!cancelled) {
          if (signedUrlRes.data?.url) {
            setFileUrl(signedUrlRes.data.url);
          } else {
            setError("Failed to get file URL.");
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching file details:", err);
          setError("Failed to load file. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFileDetails();

    return () => {
      cancelled = true;
    };
  }, [open, courseId, folderId, contentId]); // <-- do NOT include 'file' or 'initialContent' here

  const handleDownload = () => {
    if (fileUrl) window.open(fileUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {content?.title || "View File"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {content?.description || "No description provided."}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden p-6">
          {loading && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Loading file...
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full text-destructive text-center">
              {error}
            </div>
          )}
          {!loading && !error && fileUrl && (
            <iframe
              src={fileUrl}
              title={content?.title || "File preview"}
              className="w-full h-full border rounded-md"
              style={{ minHeight: "300px" }}
            />
          )}
          {!loading && !error && !fileUrl && (
            <div className="flex items-center justify-center h-full text-muted-foreground text-center">
              No file available for preview.
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-end gap-2 flex-shrink-0">
          {fileUrl && (
            <>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(fileUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" /> Open in New Tab
              </Button>
            </>
          )}
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
