"use client";

import { PolicyType, useAction } from "@/hooks/useAction";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

interface Props {
  policyType: PolicyType;
}

export function PolicyClient({ policyType }: Props) {
  const {
    loading,
    error,
    fetchPolicy,
    policy,
    getPolicyAsMarkdown,
    reset,
  } = useAction();

  React.useEffect(() => {
    const abort = new AbortController();
    fetchPolicy(policyType, { signal: abort.signal });
    return () => abort.abort();
  }, [policyType, fetchPolicy]);

  const renderContent = () => {
    if (loading && !policy) {
      return (
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading policy…
        </p>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col gap-2 text-sm text-red-600">
          <p>Failed to load policy: {error}</p>
          <button
            onClick={() => {
              reset();
              fetchPolicy(policyType);
            }}
            className="underline text-blue-600 hover:text-blue-800"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!policy) {
      return <p className="text-muted-foreground">Policy not found.</p>;
    }

    const md = getPolicyAsMarkdown(policy);

    return Array.isArray(md) ? (
      <div className="space-y-12 prose prose-neutral max-w-none break-words sm:prose-base prose-sm sm:prose lg:prose-lg">
        {md.map((m, i) => (
          <article key={i}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSlug, rehypeAutolinkHeadings]}
            >
              {m}
            </ReactMarkdown>
          </article>
        ))}
      </div>
    ) : (
      <article className="prose prose-neutral max-w-none break-words prose-sm sm:prose-base lg:prose-lg prose-headings:scroll-mt-20">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug, rehypeAutolinkHeadings]}
        >
          {md}
        </ReactMarkdown>
      </article>
    );
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto mt-10 sm:mt-20">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
