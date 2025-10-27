"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@t2p-admin/ui/components/dialog";
import { Button } from "@t2p-admin/ui/components/button";
import { HelpCircle } from "lucide-react";
import { api } from "@/lib/api";
import { CourseContentType } from "../helpers/course.schema";
import { Card } from "@t2p-admin/ui/components/card";
import { Badge } from "@t2p-admin/ui/components/badge";
import { ScrollArea } from "@t2p-admin/ui/components/scroll-area";
import { QuizOutputType } from "../helpers/folder.schema";

interface QuizViewSheetProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  folderId: string;
  contentId: string;
  initialContent?: CourseContentType;
}

export function QuizViewSheet({
  open,
  onClose,
  courseId,
  folderId,
  contentId,
  initialContent,
}: QuizViewSheetProps) {
  const [content, setContent] = useState<CourseContentType | null>(
    initialContent || null
  );
  const [quizQuestions, setQuizQuestions] = useState<
    QuizOutputType["quiz"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const fetchQuizDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.courses.folder.content.getQuiz({
          id: courseId,
          folderId,
          contentId,
        });

        if (cancelled) return;

        if (!res.data) {
          setError("Quiz details not found.");
          setQuizQuestions(null);
          return;
        }

        const quiz = res.data.quiz ?? null;
        setQuizQuestions(quiz);

        setContent({
          id: res.data.id,
          courseId: res.data.courseId,
          folderId: res.data.folderId,
          title: res.data.title,
          description: res.data.description ?? "",
          lock: res.data.lock ?? true,
          type: res.data.type,
          order: res.data.order,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
        });

        if (!quiz) {
          setError("Quiz questions not found for this content.");
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching quiz details:", err);
        setError("Failed to load quiz. Please try again.");
        setQuizQuestions(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchQuizDetails();

    return () => {
      cancelled = true;
    };
  }, [open, courseId, folderId, contentId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {content?.title || "View Quiz"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {content?.description || "No description provided."}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-6 py-4">
          <ScrollArea className="h-full pr-4">
            {loading && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading quiz...
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-full text-destructive text-center">
                {error}
              </div>
            )}
            {!loading &&
              !error &&
              (quizQuestions?.questions?.length ?? 0) === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground text-center">
                  This quiz has no questions.
                </div>
              )}
            {!loading &&
              !error &&
              (quizQuestions?.questions?.length ?? 0) > 0 && (
                <div className="space-y-6 pb-4">
                  {quizQuestions?.questions.map((q, i) => (
                    <Card key={q.id} className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Badge>Q{i + 1}</Badge>
                        </div>
                        <h3 className="text-lg font-medium">
                          {q.question || (
                            <span className="text-muted-foreground italic">
                              No question entered
                            </span>
                          )}
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(q.options).map(([k, v]) => (
                            <div
                              key={k}
                              className={`p-3 rounded-lg border flex items-center gap-2 ${
                                q.answer === k
                                  ? "bg-green-100 border-green-500 text-green-900 font-semibold"
                                  : "bg-muted/30"
                              }`}
                            >
                              <span className="font-semibold text-sm w-4 shrink-0">
                                {k.toUpperCase()}:
                              </span>
                              <span className="flex-1">
                                {v || (
                                  <span className="italic text-muted-foreground">
                                    No option entered
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
          </ScrollArea>
        </div>

        <div className="px-6 py-4 border-t flex items-center justify-end gap-2 flex-shrink-0">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
