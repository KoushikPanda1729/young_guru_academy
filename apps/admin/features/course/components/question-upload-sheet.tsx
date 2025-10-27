import React, { useState, useCallback, useMemo } from "react";
import { useForm, Controller, useFieldArray, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@t2p-admin/ui/components/dialog";
import { Button } from "@t2p-admin/ui/components/button";
import { Input } from "@t2p-admin/ui/components/input";
import { Textarea } from "@t2p-admin/ui/components/textarea";
import { Label } from "@t2p-admin/ui/components/label";
import { Alert, AlertDescription } from "@t2p-admin/ui/components/alert";
import { Badge } from "@t2p-admin/ui/components/badge";
import { Card, CardContent, CardHeader } from "@t2p-admin/ui/components/card";
import { ScrollArea } from "@t2p-admin/ui/components/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@t2p-admin/ui/components/tabs";
import {
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
  GripVertical,
  Plus,
} from "lucide-react"; // Import Plus icon
import { api } from "@/lib/api";
import { QuizFormType } from "../helpers/folder.schema";
import { CourseContentType } from "../helpers/course.schema";

const quizSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        options: z.object({
          a: z.string().min(1, "Option A is required"),
          b: z.string().min(1, "Option B is required"),
          c: z.string().min(1, "Option C is required"),
          d: z.string().min(1, "Option D is required"),
        }),
        answer: z.enum(["a", "b", "c", "d"]),
      })
    )
    .min(1, "At least one question is required"),
});

type QuizUploadFormType = z.infer<typeof quizSchema>;

interface UploadSheetProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  folderId: string;
  editContentId?: string;
  contents: CourseContentType[];
  setContents: React.Dispatch<React.SetStateAction<CourseContentType[]>>;
}

const SortableQuestionCard = React.memo(
  ({
    id,
    index,
    control,
    questions,
    onRemove,
    totalQuestions,
    isExpanded,
  }: {
    id: string;
    index: number;
    control: Control<QuizUploadFormType>;
    questions: QuizFormType[];
    onRemove: (index: number) => void;
    totalQuestions: number;
    isExpanded: boolean;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = { transform: CSS.Transform.toString(transform), transition };
    const currentQuestion = questions[index];

    const isValid = useMemo(() => {
      // Check if currentQuestion exists and its properties are valid
      if (!currentQuestion) return false;

      const { question, options } = currentQuestion;

      return (
        question?.trim() &&
        Object.values(options || {}).every((opt) => opt?.trim())
      );
    }, [currentQuestion]);

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={isDragging ? "opacity-50" : ""}
      >
        <Card
          className={`transition-all duration-200 ${
            isExpanded
              ? "ring-2 ring-primary/20 border-primary/20"
              : "border-border"
          } ${isDragging ? "shadow-lg" : ""}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    {...attributes}
                    {...listeners}
                    className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Badge
                    variant={isValid ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {isValid ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    Q{index + 1}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {totalQuestions > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(index)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {!isExpanded && currentQuestion?.question && (
              <div className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {currentQuestion.question}
              </div>
            )}
          </CardHeader>

          {isExpanded && (
            <CardContent className="space-y-4">
              {/* Question text */}
              <Controller
                name={`questions.${index}.question`}
                control={control}
                render={({ field, fieldState }) => (
                  <div className="space-y-2">
                    <Label>Question *</Label>
                    <Textarea
                      {...field}
                      placeholder="Enter your question"
                      rows={3}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Options */}
              <div className="space-y-3">
                <Label>Answer Options *</Label>
                {(["a", "b", "c", "d"] as const).map((key) => (
                  <div key={key} className="flex items-center gap-3">
                    <Controller
                      name={`questions.${index}.answer`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="radio"
                          value={key}
                          checked={field.value === key}
                          onChange={() => field.onChange(key)}
                          className={`h-4 w-4 focus:ring-primary border-gray-300 ${
                            field.value === key
                              ? "accent-green-500 text-green-500"
                              : ""
                          }`}
                        />
                      )}
                    />
                    <Controller
                      name={`questions.${index}.options.${key}`}
                      control={control}
                      render={({ field, fieldState }) => {
                        const isCorrect = questions[index]?.answer === key;
                        return (
                          <div
                            className={`flex-1 border space-y-1 rounded-md transition-colors ${
                              isCorrect ? "border-green-400" : ""
                            }`}
                          >
                            <Input
                              {...field}
                              placeholder={`Option ${key.toUpperCase()}`}
                            />
                            {fieldState.error && (
                              <p className="text-xs text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }
);
SortableQuestionCard.displayName = "SortableQuestionCard";

// ──────────────────────────────
// QuizUploadSheet
// ──────────────────────────────
export function QuizUploadSheet({
  open,
  onClose,
  courseId,
  folderId,
  contents,
  editContentId,
  setContents,
}: UploadSheetProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
    new Set([0])
  );
  const [activeTab, setActiveTab] = useState("create");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [createdContentId, setCreatedContentId] = useState<string | null>(null);

  const isEditMode = !!editContentId;

  const form = useForm<QuizUploadFormType>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      questions: [
        {
          question: "",
          options: { a: "", b: "", c: "", d: "" },
          answer: "a",
        },
      ],
    },
    mode: "onChange",
  });
  const { handleSubmit, control, watch, reset, formState } = form;
  const { fields, remove, insert } = useFieldArray({
    control,
    name: "questions",
  });
  const questions = watch("questions");

  React.useEffect(() => {
    if (open && isEditMode && editContentId) {
      setSaving(false);
      setError(null);
      const fetchQuizForEdit = async () => {
        try {
          const res = await api.courses.folder.content.getQuiz({
            id: courseId,
            folderId,
            contentId: editContentId,
          });
          const existingContent = res.data;

          if (
            existingContent &&
            existingContent.type === "QUIZ" &&
            existingContent.quiz
          ) {
            setNewName(existingContent.title);
            setNewDescription(existingContent.description || "");
            reset({
              questions:
                existingContent.quiz.questions.length > 0
                  ? existingContent.quiz.questions
                  : [
                      {
                        question: "",
                        options: { a: "", b: "", c: "", d: "" },
                        answer: "a",
                      },
                    ],
            });
            setCreatedContentId(editContentId); // Set the content ID so `onSubmit` uses it for update
            setExpandedQuestions(
              new Set(existingContent.quiz.questions.map((_, i) => i))
            ); // Expand all questions in edit mode
          } else {
            console.error(
              "Quiz content not found or is not a quiz type:",
              editContentId
            );
            setError(
              "Could not load quiz for editing. It might not exist or be a different type."
            );
            onClose(); // Close if unable to load for edit
          }
        } catch (err) {
          console.error("Failed to fetch quiz for editing:", err);
          setError("Failed to load quiz for editing. Please try again.");
          onClose();
        }
      };
      fetchQuizForEdit();
    } else if (open && !isEditMode) {
      // Reset for creation mode
      reset({
        questions: [
          {
            question: "",
            options: { a: "", b: "", c: "", d: "" },
            answer: "a",
          },
        ],
      });
      setNewName("");
      setNewDescription("");
      setCreatedContentId(null);
      setExpandedQuestions(new Set([0]));
      setError(null);
    }
  }, [open, isEditMode, editContentId, courseId, folderId, reset, onClose]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleCreateContent = useCallback(async () => {
    if (isEditMode && createdContentId) {
      return createdContentId;
    }
    if (!newName.trim()) {
      setError("Title is required");
      return null;
    }

    try {
      const response = await api.courses.folder.content.createContent(
        { id: courseId, folderId },
        {
          title: newName,
          description: newDescription,
          order: contents.length,
          type: "QUIZ",
        }
      );

      const newContent = response.data;

      if (!newContent) {
        setError("Failed to create content item.");
        return null;
      }

      setContents((prev) => [...prev, newContent]);
      setCreatedContentId(newContent.id);

      return newContent.id;
    } catch (createErr) {
      console.error("Error creating content item:", createErr);
      setError("Failed to create the quiz content item. Please try again.");
      return null;
    }
  }, [
    newName,
    newDescription,
    courseId,
    folderId,
    contents.length,
    setContents,
    createdContentId,
    isEditMode,
  ]);

  const onSubmit = async (data: QuizUploadFormType) => {
    setError(null);
    setSaving(true);
    try {
      if (!newName.trim()) {
        setError("Quiz title is required before saving.");
        setSaving(false);
        return;
      }

      let contentIdToUse = createdContentId;
      if (!contentIdToUse) {
        contentIdToUse = await handleCreateContent();
        if (!contentIdToUse) {
          // handleCreateContent will set error if it fails
          setSaving(false);
          return;
        }
      }

      if (isEditMode && contentIdToUse) {
        await api.courses.folder.content.updateContent(
          { id: courseId, folderId, contentId: contentIdToUse },
          { title: newName.trim(), description: newDescription.trim() }
        );
        // Update local state to reflect changes
        setContents((prev) =>
          prev.map((c) =>
            c.id === contentIdToUse
              ? {
                  ...c,
                  title: newName.trim(),
                  description: newDescription.trim(),
                }
              : c
          )
        );
      }

      await api.courses.folder.content.attachQuiz(
        // This method should handle updates too
        { id: courseId, folderId, contentId: contentIdToUse },
        { questions: data.questions }
      );

      setContents((prev) =>
        prev.map((c) =>
          c.id === contentIdToUse
            ? {
                ...c,
                quiz: { questions: data.questions },
              }
            : c
        )
      );

      // Reset form and state after successful submission
      reset();
      setNewName("");
      setNewDescription("");
      setCreatedContentId(null);
      setExpandedQuestions(new Set([0])); // Reset expanded questions to the first one
      onClose(); // Close the dialog
    } catch (err) {
      console.error(err);
      setError("Failed to save quiz questions. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const validationSummary = useMemo(() => {
    const total = questions.length;
    const valid = questions.filter(
      (q) =>
        q.question?.trim() &&
        Object.values(q.options || {}).every((opt) => opt?.trim()) && // Ensure options object exists
        q.answer // Ensure an answer is selected (enum already handles validity)
    ).length;
    const hasFormErrors = Object.keys(formState.errors).length > 0;

    return {
      total,
      valid,
      invalid: total - valid,
      hasFormErrors,
    };
  }, [questions, formState.errors]);

  console.log(validationSummary, newName.trim(), questions);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{isEditMode ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex min-h-0">
          {" "}
          {/* Removed px-6 here to keep it inside the div below */}
          {/* Left Panel: Title + Description - Fixed at top */}
          <div className="space-y-4 px-6 pt-4 border-r min-w-80 max-w-sm">
            <div className="space-y-3">
              <Label htmlFor="quiz-title">Title *</Label>
              <Input
                id="quiz-title"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter quiz title"
                className={
                  !newName.trim() && validationSummary.hasFormErrors
                    ? "border-destructive"
                    : ""
                }
              />
              {!newName.trim() && validationSummary.hasFormErrors && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Quiz title is required.
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="quiz-description">Description</Label>
              <Textarea
                id="quiz-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter quiz description"
                rows={2}
              />
            </div>
          </div>
          {/* Right Panel: Tabs - Scrollable content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col min-h-0 px-6 py-4"
          >
            <div className="flex items-center justify-between">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="create">Create & Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <div className="flex justify-center mt-4 mb-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    insert(questions.length, {
                      question: "",
                      options: { a: "", b: "", c: "", d: "" },
                      answer: "a",
                    });
                    setExpandedQuestions((prev) => {
                      const copy = new Set(prev);
                      copy.add(questions.length); // Add the index of the new question
                      return copy;
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Question
                </Button>
              </div>
            </div>

            <TabsContent
              value="create"
              className="flex-1 flex flex-col min-h-0 mt-0"
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="h-full flex flex-col min-h-0"
              >
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ScrollArea className="h-full pr-4">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                    >
                      <SortableContext
                        items={fields.map((f) => f.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4 pb-4">
                          {fields.map((field, index) => (
                            <SortableQuestionCard
                              key={field.id}
                              id={field.id}
                              index={index}
                              control={control}
                              questions={questions}
                              onRemove={remove}
                              totalQuestions={fields.length}
                              isExpanded={expandedQuestions.has(index)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </ScrollArea>
                </div>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 min-h-0 mt-0">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6 pb-4">
                  {questions.length === 0 && (
                    <p className="text-muted-foreground text-center py-10">
                      No questions to preview yet.
                    </p>
                  )}
                  {questions.map((q, i) => (
                    <Card key={i} className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Badge>Q{i + 1}</Badge>
                        </div>
                        <h3 className="text-lg font-medium">
                          {q.question || (
                            <span className="text-muted-foreground italic">
                              No question entered
                            </span>
                          )}
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(q.options).map(([k, v]) => (
                            <div
                              key={k}
                              className={`p-3 rounded-lg border flex items-center gap-2 ${
                                q.answer === k
                                  ? "bg-green-100 border-green-500 text-green-900 font-semibold"
                                  : "bg-muted/30"
                              }`}
                            >
                              <span className="font-semibold text-sm w-4 shrink-0">
                                {k.toUpperCase()}:
                              </span>{" "}
                              <span className="flex-1">
                                {v || (
                                  <span
                                    className={`italic ${
                                      q.answer === k
                                        ? "text-green-900 font-bold"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    No option entered
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-4 border-t bg-background">
          <Button onClick={onClose} variant="outline" type="button">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={saving || !formState.isValid || !newName.trim()}
            type="submit" // Ensure this is type submit to trigger form validation
          >
            <Save className="h-4 w-4 mr-2" />
            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Quiz"
                : "Create & Save Quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
