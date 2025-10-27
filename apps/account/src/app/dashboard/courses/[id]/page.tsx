"use client";

import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { $fetch } from "@/lib/fetch";
import { formatPrice } from "@/components/course-card";
import { Button } from "@t2p-admin/ui/components/button";
import {
  Clock,
  Users,
  BookOpen,
  Star,
  Calendar,
  PlayCircle,
  CheckCircle,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { PaymentDialog } from "@/components/payment-dialog";
import { api } from "@/lib/api";

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const shareUrl =
    typeof window !== "undefined" ? window.location.origin + pathname : "";

  const {
    data: courseRes,
    isLoading: courseLoading,
    isError: courseError,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: () => api.courses.getCourseById({ id }),
    enabled: !!id,
  });

  const course = courseRes!.data;

  // Fetch signed URL if thumbnail exists
  const { data: signedUrlRes, isLoading: signedUrlLoading } = useQuery({
    queryKey: ["signed-url", course?.thumbnail],
    queryFn: () =>
      $fetch("@get/courses/signed-url", {
        query: {
          type: "get",
          key: course!.thumbnail!,
        },
      }),
    enabled: !!course?.thumbnail,
  });

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600">Course Not Found</h2>
          <p className="text-muted-foreground">
            Failed to load course. Please try again.
          </p>
          <Button onClick={() => router.refresh()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Left Column - Course Info */}
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Courses</span>
                <span>/</span>
                <span className="text-blue-600 font-medium">
                  {course.title}
                </span>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {course.isPurchased && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Purchased
                    </span>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {course.description ||
                    "Transform your skills with this comprehensive course designed for modern learners."}
                </p>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {course.totalStudents || 0}
                  </div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {course.totalLessons || 0}
                  </div>
                  <div className="text-sm text-gray-600">Lessons</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {course.durationValue || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    {course.durationUnit || "Hours"}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <Star className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {course.averageRating?.toFixed(1) || "5.0"}
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  What you&apos;ll get:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      {course.durationValue && course.durationUnit
                        ? `Valid for ${course.durationValue} ${course.durationUnit}`
                        : "Lifetime access"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Mobile</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      Certificate of completion
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Expert support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Course Preview & Purchase */}
            <div className="space-y-6">
              {/* Course Preview */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative aspect-video group cursor-pointer">
                  {signedUrlRes?.data?.url ? (
                    <Image
                      src={signedUrlRes.data.url}
                      alt={`${course.title} thumbnail`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : signedUrlLoading ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <div className="animate-pulse w-16 h-16 bg-gray-700 rounded-full mx-auto"></div>
                        <p className="text-gray-300">Loading preview...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <PlayCircle className="w-16 h-16 text-white/80 mx-auto" />
                        <p className="text-white/90 font-medium">
                          Course Preview
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="p-6 space-y-6">
                  {/* Price */}
                  <div className="text-center space-y-2">
                    {course.price ? (
                      <div className="flex items-center  justify-between">
                        <div className="flex gap-3 items-baseline">
                          <span className="text-3xl font-bold text-gray-900">
                            {formatPrice(course.price)}
                          </span>
                          {course.mrp && course.mrp > course.price && (
                            <span className="text-xl line-through text-gray-500">
                              {formatPrice(course.mrp)}
                            </span>
                          )}
                        </div>
                        {course.mrp && course.mrp > course.price && (
                          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                            Save{" "}
                            {Math.round(
                              ((course.mrp - course.price) / course.mrp) * 100
                            )}
                            %
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-green-600">
                        Free Course
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {course.isPurchased ? (
                      <Button
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Already Purchased
                      </Button>
                    ) : course.isPublished && course.price ? (
                      <PaymentDialog
                        course={course}
                        signedUrl={signedUrlRes?.data?.url}
                      />
                    ) : (
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 shadow-lg hover:shadow-xl transition-all"
                        onClick={() => {
                          alert("Enrolled successfully 🎉");
                        }}
                      >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Start Learning Free
                      </Button>
                    )}

                    {/* Secondary Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          toast.success("Sharable link copied!");
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="text-center space-y-2 text-sm text-gray-600 border-t pt-4">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Updated{" "}
                        {new Date(course.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {course.totalReviews > 0 && (
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{course.totalReviews} reviews</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
