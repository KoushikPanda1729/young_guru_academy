"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CalendarDays,
  MessageSquare,
  ThumbsUp,
  GripVertical,
} from "lucide-react";
import { Badge } from "@t2p-admin/ui/components/badge";
import { Button } from "@t2p-admin/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@t2p-admin/ui/components/card";
import { Separator } from "@t2p-admin/ui/components/separator";
import Image from "next/image";
import { PostType } from "../helpers/post.schema";
import { CommentsSheet, LikesSheet } from "./comment-sheet";

type PostStatus = "draft" | "published";

function formatDate(value?: string | Date) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: PostStatus }) {
  const styleMap: Record<PostStatus, string> = {
    draft: "bg-muted text-muted-foreground",
    published: "bg-primary text-primary-foreground",
  };
  return (
    <Badge className={`rounded-md ${styleMap[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

interface SortablePostCardProps {
  post: PostType;
  onEdit: (post: PostType) => void;
  onDelete: (post: PostType) => void;
  onPublish: (post: PostType) => void;
  onUnpublish: (post: PostType) => void;
  onViewLikes: (post: PostType) => void;
  onViewComments: (post: PostType) => void;
}

function SortablePostCard({
  post,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onViewLikes,
  onViewComments,
}: SortablePostCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isPublished = post.isPublished;

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="overflow-hidden h-full">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              className="cursor-grab active:cursor-grabbing mt-1 touch-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="text-pretty text-base">
                {post.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 flex-wrap">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm">{formatDate(post.createdAt)}</span>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <StatusBadge status={isPublished ? "published" : "draft"} />
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {post.imageUrl && (
          <div className="px-6">
            <div className="overflow-hidden rounded-lg border bg-card">
              <Image
                src={post.imageUrl}
                alt=""
                width={400}
                height={176}
                className="h-44 w-full object-cover"
              />
            </div>
          </div>
        )}

        <CardContent className="mt-3 space-y-4">
          {post.content && (
            <p className="text-sm text-muted-foreground text-pretty line-clamp-3">
              {post.content}
            </p>
          )}
        </CardContent>

        <CardFooter className="justify-between">
          <div className="flex items-center gap-5 text-muted-foreground">
            <button
              onClick={() => onViewLikes(post)}
              className="inline-flex items-center gap-1.5 text-sm hover:text-foreground transition-colors cursor-pointer"
            >
              <ThumbsUp className="h-4 w-4" />
              {post.likesCount ?? 0}
              <span className="sr-only">likes</span>
            </button>
            <button
              onClick={() => onViewComments(post)}
              className="inline-flex items-center gap-1.5 text-sm hover:text-foreground transition-colors cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              {post.commentsCount ?? 0}
              <span className="sr-only">comments</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                isPublished ? onUnpublish(post) : onPublish(post)
              }
            >
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button size="sm" onClick={() => onEdit(post)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(post)}
            >
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

interface PostGridProps {
  posts: PostType[];
  onEdit: (post: PostType) => void;
  onDelete: (post: PostType) => void;
  onPublish: (post: PostType) => void;
  onUnpublish: (post: PostType) => void;
  onReorder: (postOrders: { id: string; order: number }[]) => void;
}

export function PostGrid({
  posts: initialPosts,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onReorder,
}: PostGridProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [likesSheetOpen, setLikesSheetOpen] = useState(false);
  const [commentsSheetOpen, setCommentsSheetOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPosts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        const postOrders = newItems.map((item, index) => ({
          id: item.id,
          order: index + 1,
        }));

        onReorder(postOrders);

        return newItems;
      });
    }
  };

  const handleViewLikes = (post: PostType) => {
    setSelectedPost(post);
    setLikesSheetOpen(true);
  };

  const handleViewComments = (post: PostType) => {
    setSelectedPost(post);
    setCommentsSheetOpen(true);
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg">No posts found</p>
        <p className="text-sm">Create your first post to get started</p>
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={posts.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <SortablePostCard
                key={post.id}
                post={post}
                onEdit={onEdit}
                onDelete={onDelete}
                onPublish={onPublish}
                onUnpublish={onUnpublish}
                onViewLikes={handleViewLikes}
                onViewComments={handleViewComments}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <LikesSheet
        post={selectedPost}
        isOpen={likesSheetOpen}
        onClose={() => {
          setLikesSheetOpen(false);
          setSelectedPost(null);
        }}
      />

      <CommentsSheet
        post={selectedPost}
        isOpen={commentsSheetOpen}
        onClose={() => {
          setCommentsSheetOpen(false);
          setSelectedPost(null);
        }}
      />
    </>
  );
}
