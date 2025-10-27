/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { z } from "zod";
import {
  policyContentToMarkdown,
  deserializeContentToLexical,
} from "@/lib/lexical-to-markdown";
import type { SerializedEditorState } from "lexical";

export type PolicyType = "TERMS" | "PRIVACY" | "REFUND" | "COOKIE" | "OTHERS";

interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
  message: string;
}

export interface PolicyItem {
  id: string;
  type: PolicyType;
  content: string; // serialized lexical string from backend
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/* ----------------------------- Zod Schemas ------------------------------ */

const PolicyItemSchema = z.object({
  id: z.string(),
  type: z.enum(["TERMS", "PRIVACY", "REFUND", "COOKIE", "OTHERS"]),
  content: z.string(),
});

const FaqItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});


const ApiEnvelopeSchema = <T extends z.ZodTypeAny>(inner: T) =>
  z.object({
    statusCode: z.number(),
    data: inner,
    message: z.string(),
  });

const API_BASE =
  (typeof window !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL) || "";

function joinUrl(base: string, path: string) {
  if (!base) return path;
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

async function apiFetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<ApiEnvelope<T>> {
  const res = await fetch(input, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-client-type": "desktop",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Invalid JSON from ${String(input)}`);
  }

  return json as ApiEnvelope<T>;
}

interface UseActionState {
  loading: boolean;
  error: string | null;
  policy: PolicyItem | null;
  faqs: FaqItem[] | null;
}

interface UseActionReturn extends UseActionState {
  fetchPolicy: (
    type: PolicyType,
    opts?: { signal?: AbortSignal }
  ) => Promise<PolicyItem | null>;
  fetchFaqs: (
    opts?: { signal?: AbortSignal }
  ) => Promise<FaqItem[] | null>;
  getPolicyAsMarkdown: (policy: PolicyItem | null) => string;
  getPolicyLexical: (policy: PolicyItem | null) => SerializedEditorState | null;
  reset: () => void;
}


export function useAction(): UseActionReturn {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [policy, setPolicy] = React.useState<PolicyItem | null>(null);
  const [faqs, setFaqs] = React.useState<FaqItem[] | null>(null);

  const reset = React.useCallback(() => {
    setLoading(false);
    setError(null);
    setPolicy(null);
    setFaqs(null);
  }, []);

  const fetchPolicy = React.useCallback(
    async (type: PolicyType, opts?: { signal?: AbortSignal }) => {
      setLoading(true);
      setError(null);
      try {
        const url = joinUrl(
          API_BASE,
          `/api/v1/website/policy?type=${encodeURIComponent(type)}`
        );
        const envelope = await apiFetch<unknown>(url, { signal: opts?.signal });
        const parsed = ApiEnvelopeSchema(PolicyItemSchema).safeParse(envelope);

        if (!parsed.success) {
          throw new Error("Unexpected policy response shape.");
        }

        setPolicy(parsed.data.data);
        return parsed.data.data;
      } catch (err: any) {
        if (err?.name === "AbortError") return null;
        setError(err?.message ?? "Failed to fetch policy.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchFaqs = React.useCallback(
    async (opts?: { signal?: AbortSignal }) => {
      setLoading(true);
      setError(null);
      try {
        const url = joinUrl(API_BASE, `/api/v1/website/faq`);
        const envelope = await apiFetch<unknown>(url, { signal: opts?.signal });
        console.log(envelope)
        const parsed = ApiEnvelopeSchema(z.array(FaqItemSchema)).safeParse(envelope);
        
        if (!parsed.success) {
          throw new Error("Unexpected FAQ response shape.");
        }


        setFaqs(parsed.data.data);
        return parsed.data.data;
      } catch (err: any) {
        if (err?.name === "AbortError") return null;
        setError(err?.message ?? "Failed to fetch FAQs.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getPolicyAsMarkdown = React.useCallback(
    (policy: PolicyItem | null): string => {
      if (!policy) return "";
      return policyContentToMarkdown(policy.content);
    },
    []
  );

  const getPolicyLexical = React.useCallback(
    (policy: PolicyItem | null): SerializedEditorState | null => {
      if (!policy) return null;
      return deserializeContentToLexical(policy.content);
    },
    []
  );

  return {
    loading,
    error,
    policy,
    faqs,
    fetchPolicy,
    fetchFaqs,
    getPolicyAsMarkdown,
    getPolicyLexical,
    reset,
  };
}
