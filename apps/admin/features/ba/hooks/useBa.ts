"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import type { BackendAdditionInput } from "../helpers/ba-schema"; // adjust path as needed
import { useTransaction } from "../../transaction/hooks/useTransaction";

export function useBa() {
  const [error, setError] = useState<string>("");
  const { refetch } = useTransaction();

  const { mutate: addAccess, isPending: isAdding } = useMutation({
    mutationFn: async (body: BackendAdditionInput) =>
      await api.ba.addAccess(body),
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      setError(err?.message ?? "Something went wrong");
    },
  });

  return {
    addAccess,
    isAdding,
    error,
    setError,
  };
}
