"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@t2p-admin/ui/components/button";
import { Badge } from "@t2p-admin/ui/components/badge";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@t2p-admin/ui/components/card";
import { Eye } from "lucide-react";
import { api } from "@/lib/api";
import { Course } from "@/lib/zod";

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [signedBannerUrl, setSignedBannerUrl] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    const getSignedUrl = async () => {
      if (course.thumbnail && typeof course.thumbnail === "string") {
        try {
          const res = await api.courses.getSignedUrl({
            type: "get",
            key: course.thumbnail,
          });
          if (res.data?.url) {
            setSignedBannerUrl(res.data.url);
          } else {
            setSignedBannerUrl(null);
          }
        } catch (error) {
          console.error("Failed to get signed banner URL", error);
          setSignedBannerUrl(null);
        }
      }
    };

    getSignedUrl();
  }, [course.thumbnail]);

  return (
    <Card className="overflow-hidden rounded-xl shadow-md border pt-0">
      {/* Image */}
      <div className="relative aspect-video w-full">
        {signedBannerUrl ? (
          <Image
            src={signedBannerUrl}
            alt={course.title}
            fill
            className="rounded-t-xl object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-t-xl">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-700 flex items-center justify-center">
                <Eye className="w-8 h-8" />
              </div>
              <span className="text-sm font-medium">No Preview</span>
            </div>
          </div>
        )}

        {/* Duration Badge */}
        {course.durationValue && course.durationUnit && (
          <Badge className="absolute top-3 left-3 bg-yellow-400 text-black rounded-full px-3 py-1 text-sm font-medium">
            {course.durationValue} {course.durationUnit}
          </Badge>
        )}
      </div>

      {/* Text Content */}
      <CardHeader>
        <CardTitle className="text-primary font-semibold text-lg">
          {course.title}
        </CardTitle>
        {course.description && (
          <CardDescription className="text-muted-foreground text-sm">
            {course.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Pricing */}
        <div className="flex items-center gap-2">
          {course.price !== null && course.price !== undefined ? (
            <>
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(course.price)}
              </span>
              {course.mrp !== null && course.mrp! > course.price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(course.mrp!)}
                </span>
              )}
            </>
          ) : (
            <span className="text-lg font-semibold text-green-600">Free</span>
          )}
        </div>

        {/* Action Button */}
        {course.isPurchased ? (
          <Button asChild className="px-6">
            <Link href={`#`}>Invoice</Link>
          </Button>
        ) : (
          <Button asChild className="px-6">
            <Link href={`/dashboard/courses/${course.id}`}>Enroll Now</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
