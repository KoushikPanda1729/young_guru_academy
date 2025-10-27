"use client";

import * as React from "react";
import {useState, useCallback, useEffect, useMemo} from "react";
import type {SerializedEditorState} from "lexical";
import {IconHelpCircle} from "@tabler/icons-react";
import {Header} from "@/components/dashboard/page-header";
import {Editor} from "@t2p-admin/ui/blocks/editor-00/editor";
import {
  deserializeContentToLexical,
  EMPTY_SERIALIZED,
  serializeLexicalToString,
} from "@/components/lexcial";
import {Button} from "@t2p-admin/ui/components/button";
import {Badge} from "@t2p-admin/ui/components/badge";
import {Tabs, TabsList, TabsTrigger} from "@t2p-admin/ui/components/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@t2p-admin/ui/components/select";
import { 
  PolicyType,
} from "@/features/website/website.schema";
import { usePolicy } from "@/features/website/hook/useWebsite";

type PolicyTypeEnum = "TERMS" | "PRIVACY" | "REFUND" | "COOKIE" | "OTHERS";

const POLICY_TYPE_OPTIONS = [
  { value: "TERMS" as const, label: "Terms of Service" },
  { value: "PRIVACY" as const, label: "Privacy Policy" },
  { value: "REFUND" as const, label: "Refund Policy" },
  { value: "COOKIE" as const, label: "Cookie Policy" },
  { value: "OTHERS" as const, label: "Other Policies" },
];

interface PolicyTypeSwitcherProps {
  value: PolicyTypeEnum;
  onChange: (val: PolicyTypeEnum) => void;
  badgeCounts?: Partial<Record<PolicyTypeEnum, number>>;
  className?: string;
  label?: string;
}

function PolicyTypeSwitcher({
  value,
  onChange,
  badgeCounts,
  className,
  label = "Policy type",
}: PolicyTypeSwitcherProps) {
  const options = React.useMemo(() => POLICY_TYPE_OPTIONS, []);
  const handleChange = useCallback(
    (val: string) => onChange(val as PolicyTypeEnum),
    [onChange]
  );
  return (
    <div className={className ?? "grid gap-2 max-w-sm"}>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger id="policy-type-select" size="sm" className="w-fit @4xl/main:hidden">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
              {badgeCounts?.[opt.value] != null && (
                <span className="ml-2 text-muted-foreground">
                  ({badgeCounts[opt.value]})
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Tabs value={value} onValueChange={handleChange} className="hidden @4xl/main:block">
        <TabsList>
          {options.map((opt) => (
            <TabsTrigger key={opt.value} value={opt.value} className="flex items-center gap-1">
              {opt.label}
              {badgeCounts?.[opt.value] != null && (
                <Badge variant="secondary" className="ml-1">
                  {badgeCounts[opt.value]}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

type CacheEntry = {
  policy: PolicyType | null;
  editor: SerializedEditorState;
  dirty: boolean;
};

export default function PolicyFormPage() {
  const [policyType, setPolicyType] = useState<PolicyTypeEnum>("TERMS");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const {
    data: currentPolicy,
    isLoading,
    error,
    refetch,
    createPolicy,
    updatePolicy,
  } = usePolicy({ type: policyType });

  const [cache, setCache] = useState<Record<PolicyTypeEnum, CacheEntry>>({
    TERMS: {policy: null, editor: EMPTY_SERIALIZED, dirty: false},
    PRIVACY: {policy: null, editor: EMPTY_SERIALIZED, dirty: false},
    REFUND: {policy: null, editor: EMPTY_SERIALIZED, dirty: false},
    COOKIE: {policy: null, editor: EMPTY_SERIALIZED, dirty: false},
    OTHERS: {policy: null, editor: EMPTY_SERIALIZED, dirty: false},
  });

  const cacheEntry = cache[policyType];

  useEffect(() => {
    if (currentPolicy !== undefined) {
      setCache((prev) => {
        const next = {...prev};
        const editor =
            currentPolicy?.data?.content != null
                ? deserializeContentToLexical(currentPolicy.data.content)
                : EMPTY_SERIALIZED;
        next[policyType] = {
          policy: currentPolicy.data || null,
          editor,
          dirty: false
        };
        return next;
      });
    }
  }, [currentPolicy, policyType]);

  const currentStatusLabel = cacheEntry.policy?.status ?? "draft";
  const currentEditorState = cacheEntry.editor;

  const handleEditorChange = useCallback(
    (next: SerializedEditorState) => {
      setCache((prev) => {
        const entry = prev[policyType];
        return {
          ...prev,
          [policyType]: {...entry, editor: next, dirty: true},
        };
      });
    },
    [policyType]
  );

  const clearDirtyFor = useCallback((t: PolicyTypeEnum) => {
    setCache((prev) => {
      const entry = prev[t];
      if (!entry) return prev;
      return {
        ...prev,
        [t]: {...entry, dirty: false},
      };
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const entry = cache[policyType];
      const content = serializeLexicalToString(entry.editor);
      
      if (entry.policy?.id) {
        await updatePolicy({
          id: entry.policy.id,
          data: { 
            content,
            type: entry.policy.type 
          }
        });
      } else {
        await createPolicy({
          type: policyType,
          status: "draft",
          content,
        });
      }
      
      clearDirtyFor(policyType);
      await refetch();
    } catch (error) {
      console.error('Error saving policy:', error);
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, cache, policyType, updatePolicy, createPolicy, clearDirtyFor, refetch]);

  const handlePublish = useCallback(async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      const entry = cache[policyType];
      const content = serializeLexicalToString(entry.editor);
      
      if (entry.policy?.id) {
        await updatePolicy({
          id: entry.policy.id,
          data: { content, status: "published" }
        });
      } else {
        await createPolicy({
          type: policyType,
          status: "published",
          content,
        });
      }
      
      clearDirtyFor(policyType);
      await refetch();
    } catch (error) {
      console.error('Error publishing policy:', error);
    } finally {
      setIsPublishing(false);
    }
  }, [isPublishing, cache, policyType, updatePolicy, createPolicy, clearDirtyFor, refetch]);

  const badgeCounts = useMemo<Partial<Record<PolicyTypeEnum, number>>>(() => {
    const out: Partial<Record<PolicyTypeEnum, number>> = {};
    (Object.keys(cache) as PolicyTypeEnum[]).forEach((t) => {
      const e = cache[t];
      out[t] = e.policy ? 1 : 0;
    });
    return out;
  }, [cache]);

  const isDirty = cacheEntry.dirty;

  const disableSave = isLoading || isSaving || !isDirty;
  const disablePublish = isLoading || isPublishing;

  const editorKey = React.useMemo(() => {
    const policy = cacheEntry.policy;
    return policy
      ? `${policyType}:${policy.updatedAt ?? policy.id}`
      : `${policyType}:new`;
  }, [policyType, cacheEntry.policy]);

  return (
    <div className="flex flex-col gap-4 min-h-screen max-h-screen">
      <Header
        icon={<IconHelpCircle className="size-6 text-primary" />}
        title="Policy Management"
        description="Create and manage a policy document for your site."
        showModeToggle
      />
      <div className="container-wrapper section-soft flex-1">
        <div className="container overflow-hidden h-full flex flex-col">
          <div className="flex flex-row items-center justify-between pb-2">
            <PolicyTypeSwitcher
              value={policyType}
              onChange={setPolicyType}
              badgeCounts={badgeCounts}
            />
            <div className="flex flex-row gap-2 py-2">
              <Button onClick={handleSave} disabled={disableSave}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={handlePublish} disabled={disablePublish}>
                {isPublishing ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 pb-4 overflow-y-auto">
            <div className="text-sm text-muted-foreground">
              Current status: <span className="font-medium capitalize">{currentStatusLabel}</span>
            </div>
            {error && (
              <div className="text-sm text-destructive">
                {error instanceof Error ? error.message : 'An error occurred'}
              </div>
            )}
            {isLoading && (
              <div className="text-sm text-muted-foreground">Loading policy...</div>
            )}
            <div className="border rounded-md overflow-hidden">
              <Editor
                key={editorKey}
                editorSerializedState={currentEditorState}
                onSerializedChange={handleEditorChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}