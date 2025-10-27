"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type {
  CreateCouponInput,
  UpdateCouponInput,
  CreateCouponOutput,
} from "../helpers/coupon.schema";

interface UseCouponSheetReturn {
  isOpen: boolean;
  currentCoupon: CreateCouponOutput | null;
  mode: "view" | "edit" | "create";
  isLoading: boolean;
  openSheet: (
    coupon?: CreateCouponOutput | null,
    mode?: "view" | "edit" | "create"
  ) => void;
  closeSheet: () => void;
  setMode: (mode: "view" | "edit" | "create") => void;
  handleSave: (data: CreateCouponInput | UpdateCouponInput) => Promise<void>;
}


export function useCouponSheet(): UseCouponSheetReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<CreateCouponOutput | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | "create">("view");
  const [isLoading, setIsLoading] = useState(false);

  const openSheet = useCallback(
    (
      coupon?: CreateCouponOutput | null,
      initialMode: "view" | "edit" | "create" = "view"
    ) => {
      setCurrentCoupon(coupon ?? null);
      setMode(initialMode);
      setIsOpen(true);
    },
    []
  );

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    setCurrentCoupon(null);
    setMode("view");
  }, []);

  const handleSave = useCallback(
    async (data: CreateCouponInput | UpdateCouponInput) => {
      setIsLoading(true);
      try {
        if (mode === "create") {
          const created = await api.coupons.createCoupon(data as CreateCouponInput);
          setCurrentCoupon(created.data);
          setMode("view");
          toast.success("Coupon created successfully");
        } else if (currentCoupon) {
          const updateData: UpdateCouponInput = data as UpdateCouponInput;
          const updated = await api.coupons.updateCouponById(
            { id: currentCoupon.id },
            updateData
          );
          setCurrentCoupon(updated.data);
          toast.success("Coupon updated successfully");
        }
      } catch (error) {
        console.error("Error saving coupon:", error);
        toast.error("Failed to save coupon");
      } finally {
        setIsLoading(false);
      }
    },
    [currentCoupon, mode]
  );

  return {
    isOpen,
    currentCoupon,
    mode,
    isLoading,
    openSheet,
    closeSheet,
    setMode,
    handleSave,
  };
}
