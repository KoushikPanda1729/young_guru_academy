"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@t2p-admin/ui/components/button";
import { Input } from "@t2p-admin/ui/components/input";
import { Label } from "@t2p-admin/ui/components/label";
import { Upload, X, ExternalLink, Youtube } from "lucide-react";
import { BannerDialog } from "./banner-dialog";
import Image from "next/image";
import { Banner, BannerType } from "../helpers/banner.schema";
import { api } from "../../../lib/api";

type Option = { id: string; title: string };

export function BannerForm({
  initialValue,
  onAdd,
  onUpdate,
  courseOptions,
  questOptions,
}: {
  initialValue?: Banner;
  onAdd: (banner: Banner) => void;
  onUpdate: (banner: Banner) => void;
  courseOptions: Option[];
  questOptions: Option[];
}) {
  const [image, setImage] = useState<string>(initialValue?.image || "");
  const [uploading, setUploading] = useState(false);
  const [redirect, setRedirect] = useState<{
    type: BannerType;
    target: string;
  }>(
    initialValue
      ? { type: initialValue.type, target: initialValue.target }
      : { type: BannerType.COURSE, target: "" }
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Revoke blob URLs on cleanup
  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) URL.revokeObjectURL(image);
    };
  }, [image]);

  const canSubmit = useMemo(
    () => Boolean(image && redirect.target),
    [image, redirect]
  );

  /**
   * Uploads an image to S3 via signed URL
   */
  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      const key = `banners/${crypto.randomUUID()}-${file.name}`;
      const { data } = await api.banner.getSignedUrl({ type: "put", key });

      if (!data) return;

      await fetch(data.url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // Step 3: Construct public URL
      const publicUrl = `https://images.talk2partners.com/${key}`;
      setImage(publicUrl);
    } catch (error) {
      console.error("Failed to upload banner:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /**
   * Deletes image from S3
   */
  const deleteImage = async (imageUrl: string) => {
    try {
      const key = new URL(imageUrl).pathname.slice(1); // remove leading '/'
      await api.banner.getSignedUrl({ type: "delete", key });
    } catch (error) {
      console.warn("Failed to delete image:", error);
    }
  };

  /**
   * Handles file selection and upload
   */
  const onFileChange = async (file?: File | null) => {
    if (!file) return;
    if (image && !image.startsWith("blob:")) {
      // delete existing uploaded image
      await deleteImage(image);
    }
    await uploadImage(file);
  };

  const handleRemove = async () => {
    if (image && !image.startsWith("blob:")) {
      await deleteImage(image);
    }
    setImage("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payload: Banner = {
      id: initialValue?.id || crypto.randomUUID(),
      image,
      type: redirect.type,
      target: redirect.target,
      order: initialValue?.order ?? 0,
      createdAt: initialValue?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };

    if (initialValue) onUpdate(payload);
    else onAdd(payload);

    if (!initialValue) {
      await handleRemove();
      setRedirect({ type: BannerType.COURSE, target: "" });
    }
  };

  const getRedirectIcon = () => {
    switch (redirect.type) {
      case BannerType.YOUTUBE:
        return <Youtube className="h-4 w-4" />;
      case BannerType.EXTERNAL:
        return <ExternalLink className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRedirectLabel = () => {
    switch (redirect.type) {
      case BannerType.COURSE:
        return "Course";
      case BannerType.QUEST:
        return "Quest";
      case BannerType.EXTERNAL:
        return "External URL";
      case BannerType.YOUTUBE:
        return "YouTube URL";
      default:
        return "None";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Image Upload */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Banner Image</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Upload an image for your banner (16:9 ratio recommended)
        </p>

        {!image ? (
          <div className="relative">
            <Input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files?.[0] || null)}
              className="hidden"
              id="banner-upload"
            />
            <label
              htmlFor="banner-upload"
              className="flex flex-col items-center justify-center w-full aspect-[16/9] rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer bg-muted/30 hover:bg-muted/50"
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                {uploading ? (
                  <p className="text-sm animate-pulse">Uploading...</p>
                ) : (
                  <>
                    <Upload className="h-10 w-10" />
                    <div className="text-center">
                      <p className="font-medium">
                        Click to upload banner image
                      </p>
                      <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </>
                )}
              </div>
            </label>
          </div>
        ) : (
          <div className="relative group">
            <Image
              src={image}
              width={300}
              height={169}
              alt="Banner preview"
              className="aspect-[16/9] w-full rounded-lg object-cover border-2 border-border shadow-sm"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="shadow-lg"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Change"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                disabled={uploading}
                className="shadow-lg"
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Redirect Section */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Redirect Destination</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Choose where users go when they click the banner
        </p>

        <div className="rounded-lg border-2 border-border bg-muted/30 p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                {getRedirectIcon()}
                <span className="font-semibold text-sm">
                  {getRedirectLabel()}
                </span>
              </div>
              {redirect.target ? (
                <p className="text-sm text-muted-foreground break-all line-clamp-2">
                  {redirect.target}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No destination selected yet
                </p>
              )}
            </div>
            <Button
              type="button"
              onClick={() => setDialogOpen(true)}
              variant={redirect.target ? "outline" : "default"}
              size="sm"
              className="shrink-0"
            >
              {redirect.target ? "Change" : "Select"}
            </Button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          {!canSubmit && (
            <span>
              {!image && !redirect.target
                ? "Upload an image and select a redirect destination"
                : !image
                  ? "Upload an image to continue"
                  : "Select a redirect destination"}
            </span>
          )}
        </p>
        <Button
          type="submit"
          disabled={!canSubmit || uploading}
          size="lg"
          className="min-w-[140px]"
        >
          {uploading
            ? "Uploading..."
            : initialValue
              ? "Update Banner"
              : "Add Banner"}
        </Button>
      </div>

      <BannerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        value={redirect}
        onChange={setRedirect}
        courseOptions={courseOptions}
        questOptions={questOptions}
      />
    </form>
  );
}
