"use client";

import React from "react";
import { api } from "@/lib/api";
import { CourseCard } from "@/components/course-card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function CoursesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: () => api.courses.getCourses(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-muted-foreground">
        No courses available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.data.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
