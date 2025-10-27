"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@t2p-admin/ui/components/sheet";
import { Badge } from "@t2p-admin/ui/components/badge";
import { Separator } from "@t2p-admin/ui/components/separator";
import { format } from "date-fns";
import { StudentFeedbackItem } from "@/features/reviews/helpers/reviews.schema";

interface ReviewSheetProps {
  review: StudentFeedbackItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewSheet({ review, isOpen, onClose }: ReviewSheetProps) {
  if (!review) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto px-6 py-4">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle className="text-lg font-semibold">View Review</SheetTitle>
          </div>
          <SheetDescription>
            Detailed information about this student feedback.
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-2" />

        <div className="space-y-4 mt-4">
          {/* Review Type */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-1">
              Type
            </h3>
            <Badge variant={review.type === "REPORT" ? "secondary" : "default"}>
              {review.type}
            </Badge>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-1">
              Rating
            </h3>
            <p className="text-sm">{review.rating}/5</p>
          </div>

          {/* Review Text */}
          {review.review && (
            <div>
              <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                Review
              </h3>
              <div className="p-4 bg-muted rounded-xl border text-sm leading-relaxed">
                {review.review}
              </div>
            </div>
          )}

          {/* Reviewer & Student Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-1">
                Reviewer
              </h3>
              <p className="text-sm">{review.reviewer.user.name}</p>
              <p className="text-xs text-muted-foreground">{review.reviewer.user.email}</p>
              <p className="text-xs text-muted-foreground">📞 {review.reviewer.user.phoneNumber}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-1">
                Student
              </h3>
              <p className="text-sm">{review.student.user.name}</p>
              <p className="text-xs text-muted-foreground">{review.student.user.email}</p>
              <p className="text-xs text-muted-foreground">📞 {review.student.user.phoneNumber}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3">
              Metadata
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <span className="ml-2 font-mono text-xs text-foreground">{review.id}</span>
              </div>
              {review.createdAt && (
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <span className="ml-2 text-foreground">
                    {format(new Date(review.createdAt), "PPP 'at' p")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
