"use client";
import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { CourseType, createCourseType, updateCourseType } from "../helpers/course.schema";

interface UseCourseSheetReturn {
  isOpen: boolean;
  currentCourse: CourseType | null;
  mode: "view" | "edit" | "create";
  isLoading: boolean;
  openSheet: (course?: CourseType | null, mode?: "view" | "edit" | "create") => void;
  closeSheet: () => void;
  setMode: (mode: "view" | "edit") => void;
  handleSave: (data: createCourseType | updateCourseType) => Promise<void>;
}

export function useCourseSheet(): UseCourseSheetReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<CourseType | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | "create">("view");
  const [isLoading, setIsLoading] = useState(false);

  const openSheet = useCallback(
    (course?: CourseType | null, initialMode: "view" | "edit" | "create" = "view") => {
      setCurrentCourse(course ?? null);
      setMode(initialMode);
      setIsOpen(true);
    },
    [],
  );

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    setCurrentCourse(null);
    setMode("view");
  }, []);

  const changeMode = useCallback((newMode: "view" | "edit") => {
    setMode(newMode);
  }, []);

  const handleSave = useCallback(
    async (data: createCourseType | updateCourseType) => {
      setIsLoading(true);
      try {
        if (mode === "create") {
          const createdCourse = await api.courses.createCourse(data as createCourseType);
          setCurrentCourse(createdCourse.data);
          setMode("view");
          toast.success("Course created successfully!");
        } else if (currentCourse && mode === "edit") {
          const updatePayload: updateCourseType = {
            ...data,
          };

          await api.courses.updateCourseById(
            { id: currentCourse.id },
            updatePayload 
          );

          setCurrentCourse((prev) =>
            prev
              ? {
                  ...prev,
                  ...updatePayload,
                  thumbnail: updatePayload.thumbnail !== undefined ? updatePayload.thumbnail : prev.thumbnail,
                }
              : null,
          );
          setMode("view");
          toast.success("Course updated successfully!");
        }
      } catch (error) {
        console.error("Error saving course:", error);
        toast.error("Failed to save course. Please try again.");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [currentCourse, mode],
  );

  return {
    isOpen,
    currentCourse,
    mode,
    isLoading,
    openSheet,
    closeSheet,
    setMode: changeMode, // Exporting changeMode as setMode for consistency with CourseSheetProps
    handleSave,
  };
}