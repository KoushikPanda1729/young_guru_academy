import { cn } from "@t2p-admin/ui/lib/utils";
import React from "react";
import Image from "next/image";
import PhoneMockup from "../../../components/phone-mockup";
import { Banner } from "../helpers/banner.schema";

interface BannerPreviewProps {
  banners: Banner[];
  orientation?: "vertical" | "horizontal";
}

export default function BannerPreview({
  banners,
  orientation = "vertical",
}: BannerPreviewProps) {
  const isVertical = orientation === "vertical";

  return (
    <PhoneMockup>
      <div className="h-full w-full overflow-hidden overflow-x-auto">
        <div
          className={cn("p-3 flex gap-3", isVertical ? "flex-col" : "flex-row")}
        >
          {banners.length > 0 ? (
            banners.map((b) => (
              <div
                key={b.id}
                className={cn(
                  "rounded-md border bg-card overflow-hidden flex-shrink-0",
                  isVertical ? "w-full" : ""
                )}
                style={{
                  width: isVertical ? "100%" : "240px",
                  height: isVertical ? "140px" : "140px",
                }}
              >
                <Image
                  src={b.image || ""}
                  alt={"Banner"}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                  width={240}
                  height={140}
                />
              </div>
            ))
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No banners yet. Add one on the left to preview here.
            </div>
          )}
        </div>
      </div>
    </PhoneMockup>
  );
}
