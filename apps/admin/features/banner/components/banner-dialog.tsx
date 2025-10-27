"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@t2p-admin/ui/components/dialog";
import { Button } from "@t2p-admin/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@t2p-admin/ui/components/tabs";
import { Label } from "@t2p-admin/ui/components/label";
import { Input } from "@t2p-admin/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@t2p-admin/ui/components/select";
import { BannerType } from "../helpers/banner.schema";

type Option = { id: string; title: string };

type Redirect = {
  type: BannerType;
  target: string;
};

export function BannerDialog({
  open,
  onOpenChange,
  value,
  onChange,
  courseOptions,
  questOptions,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  value?: Redirect;
  onChange: (v: Redirect) => void;
  courseOptions: Option[];
  questOptions: Option[];
}) {
  const initialTab: BannerType = value?.type ?? BannerType.COURSE;
  const [tab, setTab] = useState<BannerType>(initialTab);

  useEffect(() => {
    if (open) setTab(value?.type ?? BannerType.COURSE);
  }, [open, value?.type]);

  const [courseId, setCourseId] = useState("");
  const [questId, setQuestId] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    if (!value) return;
    switch (value.type) {
      case BannerType.COURSE:
        setCourseId(value.target);
        break;
      case BannerType.QUEST:
        setQuestId(value.target);
        break;
      case BannerType.EXTERNAL:
        setExternalUrl(value.target);
        break;
      case BannerType.YOUTUBE:
        setYoutubeUrl(value.target);
        break;
    }
  }, [value]);

  const canApply = useMemo(() => {
    switch (tab) {
      case BannerType.COURSE:
        return Boolean(courseId);
      case BannerType.QUEST:
        return Boolean(questId);
      case BannerType.EXTERNAL:
        return /^https?:\/\//i.test(externalUrl);
      case BannerType.YOUTUBE:
        return /^https?:\/\//i.test(youtubeUrl);
      default:
        return false;
    }
  }, [tab, courseId, questId, externalUrl, youtubeUrl]);

  const handleApply = () => {
    const next: Redirect =
      tab === BannerType.COURSE
        ? { type: BannerType.COURSE, target: courseId }
        : tab === BannerType.QUEST
          ? { type: BannerType.QUEST, target: questId }
          : tab === BannerType.EXTERNAL
            ? { type: BannerType.EXTERNAL, target: externalUrl }
            : { type: BannerType.YOUTUBE, target: youtubeUrl };

    onChange(next);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select redirect</DialogTitle>
          <DialogDescription>
            Choose where this banner should send the user.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as BannerType)}
          className="space-y-2"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value={BannerType.COURSE}>Course</TabsTrigger>
            <TabsTrigger value={BannerType.QUEST}>Quest</TabsTrigger>
            <TabsTrigger value={BannerType.EXTERNAL}>External</TabsTrigger>
            <TabsTrigger value={BannerType.YOUTUBE}>YouTube</TabsTrigger>
          </TabsList>

          {/* --- Course Tab --- */}
          <TabsContent value={BannerType.COURSE} className="space-y-2">
            <Label htmlFor="course">Select course</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger id="course">
                <SelectValue placeholder="Pick a course" />
              </SelectTrigger>
              <SelectContent>
                {courseOptions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>

          {/* --- Quest Tab --- */}
          <TabsContent value={BannerType.QUEST} className="space-y-2">
            <Label htmlFor="quest">Select quest</Label>
            <Select value={questId} onValueChange={setQuestId}>
              <SelectTrigger id="quest">
                <SelectValue placeholder="Pick a quest" />
              </SelectTrigger>
              <SelectContent>
                {questOptions.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TabsContent>

          {/* --- External URL Tab --- */}
          <TabsContent value={BannerType.EXTERNAL} className="space-y-2">
            <Label htmlFor="external">External URL</Label>
            <Input
              id="external"
              inputMode="url"
              placeholder="https://example.com"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
            />
          </TabsContent>

          {/* --- YouTube Tab --- */}
          <TabsContent value={BannerType.YOUTUBE} className="space-y-2">
            <Label htmlFor="youtube">YouTube URL</Label>
            <Input
              id="youtube"
              inputMode="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!canApply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
