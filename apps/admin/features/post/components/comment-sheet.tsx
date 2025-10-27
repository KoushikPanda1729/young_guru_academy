"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@t2p-admin/ui/components/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@t2p-admin/ui/components/avatar";
import { Separator } from "@t2p-admin/ui/components/separator";
import { ScrollArea } from "@t2p-admin/ui/components/scroll-area";
import { IconHeart, IconMessageCircle } from "@tabler/icons-react";
import { format } from "date-fns";
import { PostType } from "../helpers/post.schema";

interface LikesSheetProps {
  post: PostType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LikesSheet({ post, isOpen, onClose }: LikesSheetProps) {
  const likes = post?.likedBy || [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[500px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <IconHeart className="size-5 text-red-500 fill-red-500" />
            <SheetTitle className="text-lg font-semibold">
              Likes ({likes.length})
            </SheetTitle>
          </div>
          <SheetDescription>People who liked this post</SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="h-[calc(100vh-140px)] pr-4">
          {likes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <IconHeart className="size-12 mb-3 opacity-20" />
              <p className="text-sm">No likes yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {likes.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="size-10">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    {user.createdAt && (
                      <p className="text-xs text-muted-foreground">
                        {format(
                          new Date(user.createdAt),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface CommentsSheetProps {
  post: PostType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentsSheet({ post, isOpen, onClose }: CommentsSheetProps) {
  const comments = post?.commentedBy || [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[600px]">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <IconMessageCircle className="size-5 text-primary" />
            <SheetTitle className="text-lg font-semibold">
              Comments ({comments.length})
            </SheetTitle>
          </div>
          <SheetDescription>Comments on this post</SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="h-[calc(100vh-140px)] pr-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <IconMessageCircle className="size-12 mb-3 opacity-20" />
              <p className="text-sm">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage
                      src={comment.image || undefined}
                      alt={comment.name}
                    />
                    <AvatarFallback>
                      {comment.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm">{comment.name}</p>
                      {comment.createdAt && (
                        <p className="text-xs text-muted-foreground shrink-0">
                          {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                        </p>
                      )}
                    </div>
                    {comment.content && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
