"use client";
import * as React from "react";
import { useState, useId, useMemo } from "react";
import { motion } from "motion/react";
import {
  IconHelpCircle,
  IconTrash,
  IconPlus,
  IconCheck,
  IconX,
  IconLoader2,
} from "@tabler/icons-react";

import { Header } from "@/components/dashboard/page-header";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@t2p-admin/ui/components/accordion";
import { Button } from "@t2p-admin/ui/components/button";
import { Input } from "@t2p-admin/ui/components/input";
import { Textarea } from "@t2p-admin/ui/components/textarea";
import { Label } from "@t2p-admin/ui/components/label";
import { Badge } from "@t2p-admin/ui/components/badge";
import { Separator } from "@t2p-admin/ui/components/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@t2p-admin/ui/components/select";
import { toast } from "sonner";
import { cn } from "@t2p-admin/ui/lib/utils";
import {
  createFaqType,
  FaqType,
  updateFaqType,
} from "@/features/website/website.schema";
import { useFaq } from "../../features/website/hook/useWebsite";

const fadeInAnimationVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * index, duration: 0.4 },
  }),
};

function createBlankFaq(): Omit<FaqType, "id"> {
  return { question: "", answer: "", status: "draft", archived: false };
}

interface DirtyMap {
  [id: string]: boolean;
}
interface LocalChanges {
  [id: string]: Partial<FaqType>;
}

export default function FaqFormPage() {
  const {
    data: faqData,
    isLoading,
    error,
    refetch,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleArchive,
    handleUnarchive,
    isCreating,
    isUpdating,
    isDeleting,
  } = useFaq();

  const [dirty, setDirty] = useState<DirtyMap>({});
  const [localChanges, setLocalChanges] = useState<LocalChanges>({});
  const [newItems, setNewItems] = useState<FaqType[]>([]);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const allOpenDefault = useId();

  const items = useMemo(() => {
    const faqs = faqData?.data || [];
    const serverItems: FaqType[] = faqs.map((item) => ({
      ...item,
      ...localChanges[item.id],
    }));
    return [...newItems, ...serverItems];
  }, [faqData?.data, localChanges, newItems]);

  const publishedItems = useMemo(
    () => items.filter((i) => i.status === "published" && !i.archived),
    [items]
  );

  const markDirty = (id: string) => setDirty((d) => ({ ...d, [id]: true }));

  const handleChange = <K extends keyof FaqType>(
    id: string,
    field: K,
    value: FaqType[K]
  ) => {
    const isNewItem = newItems.some((item) => item.id === id);

    if (isNewItem) {
      setNewItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
    } else {
      setLocalChanges((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: value },
      }));
    }
    markDirty(id);
  };

  const handleAdd = () => {
    const blank: FaqType = {
      id: `new-${Math.random().toString(36).slice(2)}`,
      ...createBlankFaq(),
    };
    setNewItems((prev) => [blank, ...prev]);
    setDirty((d) => ({ ...d, [blank.id]: true }));
  };

  const handleDeleteItem = async (id: string) => {
    const isNewItem = newItems.some((item) => item.id === id);

    if (isNewItem) {
      setNewItems((prev) => prev.filter((item) => item.id !== id));
      setDirty((d) => {
        const newDirty = { ...d };
        delete newDirty[id];
        return newDirty;
      });
    } else {
      try {
        setSavingIds((prev) => new Set(prev).add(id));
        await handleDelete({ id });

        toast.success("FAQ deleted successfully");
        refetch();
        setDirty((d) => {
          const newDirty = { ...d };
          delete newDirty[id];
          return newDirty;
        });
        setLocalChanges((prev) => {
          const newChanges = { ...prev };
          delete newChanges[id];
          return newChanges;
        });
      } catch (error) {
        toast.error("Failed to delete FAQ");
        console.error(error);
      } finally {
        setSavingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    }
  };

  const handleSave = async (id: string) => {
    const isNewItem = newItems.some((item) => item.id === id);
    const item = items.find((i) => i.id === id);

    if (!item || !isValidItem(item)) return;

    setSavingIds((prev) => new Set(prev).add(id));

    try {
      if (isNewItem) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: itemId, ...dataToSave } = item;
        await handleCreate(dataToSave as createFaqType);
        setNewItems((prev) => prev.filter((i) => i.id !== id));
        refetch();
        toast.success("FAQ created successfully");
      } else {
        const changes = localChanges[id];
        if (changes) {
          await handleUpdate(id, changes as updateFaqType);
          setLocalChanges((prev) => {
            const newChanges = { ...prev };
            delete newChanges[id];
            return newChanges;
          });
          refetch();
          toast.success("FAQ updated successfully");
        }
      }
      setDirty((d) => ({ ...d, [id]: false }));
    } catch (error) {
      toast.error(`Failed to ${isNewItem ? "create" : "update"} FAQ`);
      console.error(error);
    } finally {
      setSavingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleCancel = (id: string) => {
    const isNewItem = newItems.some((item) => item.id === id);

    if (isNewItem) {
      setNewItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setLocalChanges((prev) => {
        const newChanges = { ...prev };
        delete newChanges[id];
        return newChanges;
      });
    }

    setDirty((d) => ({ ...d, [id]: false }));
  };

  const handleSaveAll = async () => {
    const dirtyIds = Object.keys(dirty).filter((id) => dirty[id]);

    for (const id of dirtyIds) {
      await handleSave(id);
    }
  };

  const handleArchiveItem = async (id: string) => {
    try {
      setSavingIds((prev) => new Set(prev).add(id));
      await handleArchive({ id });
      toast.success("FAQ archived successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to archive FAQ");
      console.error(error);
    } finally {
      setSavingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleUnarchiveItem = async (id: string) => {
    try {
      setSavingIds((prev) => new Set(prev).add(id));
      await handleUnarchive({ id });
      toast.success("FAQ unarchived successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to unarchive FAQ");
      console.error(error);
    } finally {
      setSavingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const isValidItem = (item: FaqType) =>
    item.question.trim() !== "" && item.answer.trim() !== "";

  const hasAnyDirty = Object.values(dirty).some(Boolean);

  if (isLoading && !faqData) {
    return (
      <div className="flex h-[calc(100dvh-6rem)] items-center justify-center">
        <div className="flex items-center gap-2">
          <IconLoader2 className="h-4 w-4 animate-spin" />
          <span>Loading FAQs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100dvh-6rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading FAQs: {error}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        icon={<IconHelpCircle className="size-6 text-primary" />}
        title="FAQ Management"
        description="Create and manage FAQs to help users find answers to common questions."
        showModeToggle
      />
      <div className="flex h-[calc(100dvh-6rem)] w-full items-start gap-6 px-4 pt-6 lg:px-6 overflow-hidden">
        <div className="flex h-full w-full max-w-xs shrink-0 flex-col gap-4 pr-4 md:max-w-sm border-r border-border/50">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold">Edit FAQs</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAdd}
              type="button"
            >
              <IconPlus className="mr-1 size-4" /> Add
            </Button>
          </div>
          <Separator />
          <div className="scrollbar-thin flex-1 -mr-2 flex flex-col gap-4 overflow-y-auto pr-2">
            {items.map((item) => {
              const isDirty = !!dirty[item.id];
              const isValid = isValidItem(item);
              const isSaving = savingIds.has(item.id);
              const isNewItem = newItems.some((i) => i.id === item.id);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-lg border p-3 text-sm shadow-sm transition-colors",
                    isDirty ? "border-primary" : "border-border/50",
                    isSaving && "opacity-50 pointer-events-none"
                  )}
                >
                  <div className="mb-2 space-y-1">
                    <Label htmlFor={`q-${item.id}`}>Question</Label>
                    <Input
                      id={`q-${item.id}`}
                      value={item.question}
                      placeholder="Enter question"
                      onChange={(e) =>
                        handleChange(item.id, "question", e.target.value)
                      }
                      disabled={isSaving}
                    />
                  </div>
                  <div className="mb-2 space-y-1">
                    <Label htmlFor={`a-${item.id}`}>Answer</Label>
                    <Textarea
                      id={`a-${item.id}`}
                      value={item.answer}
                      placeholder="Enter answer"
                      rows={3}
                      onChange={(e) =>
                        handleChange(item.id, "answer", e.target.value)
                      }
                      disabled={isSaving}
                    />
                  </div>
                  <div className="mb-3 space-y-1">
                    <Label htmlFor={`s-${item.id}`}>Status</Label>
                    <Select
                      value={item.status}
                      onValueChange={(val) =>
                        handleChange(
                          item.id,
                          "status",
                          val as FaqType["status"]
                        )
                      }
                      disabled={isSaving}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t pt-2">
                    <div className="flex items-center gap-2">
                      {!isNewItem && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            item.archived
                              ? handleUnarchiveItem(item.id)
                              : handleArchiveItem(item.id)
                          }
                          disabled={isSaving}
                        >
                          {item.archived ? "Unarchive" : "Archive"}
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        aria-label="Delete"
                        disabled={isSaving}
                      >
                        {isSaving && isDeleting ? (
                          <IconLoader2 className="size-4 animate-spin" />
                        ) : (
                          <IconTrash className="size-4" />
                        )}
                      </Button>
                      {isDirty && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            onClick={() => handleCancel(item.id)}
                            aria-label="Cancel"
                            disabled={isSaving}
                          >
                            <IconX className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="default"
                            type="button"
                            disabled={!isValid || isSaving}
                            onClick={() => handleSave(item.id)}
                            aria-label="Save"
                          >
                            {isSaving ? (
                              <IconLoader2 className="size-4 animate-spin" />
                            ) : (
                              <IconCheck className="size-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {hasAnyDirty && (
            <div className="pt-2">
              <Button
                className="w-full"
                onClick={handleSaveAll}
                disabled={!hasAnyDirty || isLoading}
                type="button"
              >
                {isCreating || isUpdating ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save All Changes"
                )}
              </Button>
            </div>
          )}
        </div>
        <div className="relative flex h-full flex-1 flex-col overflow-hidden pl-4">
          <div className="pointer-events-none absolute -left-4 -top-4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <motion.div
            className="flex-1 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Accordion
              key={allOpenDefault}
              type="single"
              collapsible
              className="w-full rounded-xl border border-border/40 bg-card/30 p-2 backdrop-blur-sm"
              defaultValue={publishedItems[0]?.id ?? undefined}
            >
              {items
                .filter((item) => !item.archived)
                .map((item, index) => (
                  <motion.div
                    key={item.id}
                    custom={index}
                    variants={fadeInAnimationVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                  >
                    <AccordionItem
                      value={item.id}
                      className={cn(
                        "my-1 overflow-hidden rounded-lg border-none px-2 shadow-sm transition-all",
                        item.status === "published"
                          ? "bg-card/50"
                          : "bg-muted/30 opacity-70",
                        "data-[state=open]:bg-card/80 data-[state=open]:shadow-md"
                      )}
                    >
                      <AccordionTrigger
                        className={cn(
                          "group flex flex-1 items-center justify-between gap-4 py-4 text-left text-base font-medium",
                          "outline-none transition-all duration-300 hover:text-primary hover:no-underline",
                          "focus-visible:ring-2 focus-visible:ring-primary/50",
                          "data-[state=open]:text-primary data-[state=open]:no-underline"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {item.question || "Untitled FAQ"}
                          {item.status === "draft" && (
                            <Badge variant="secondary" className="uppercase">
                              Draft
                            </Badge>
                          )}
                          {item.status === "archived" && (
                            <Badge variant="outline" className="uppercase">
                              Archived
                            </Badge>
                          )}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent
                        className={cn(
                          "overflow-hidden pb-4 pt-0 text-muted-foreground",
                          "data-[state=open]:animate-accordion-down",
                          "data-[state=closed]:animate-accordion-up"
                        )}
                      >
                        <div className="pt-3 leading-relaxed">
                          {item.answer || "No answer provided"}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </>
  );
}
