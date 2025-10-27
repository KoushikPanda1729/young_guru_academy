"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@t2p-admin/ui/components/sheet";
import { Button } from "@t2p-admin/ui/components/button";
import { Separator } from "@t2p-admin/ui/components/separator";
import { Badge } from "@t2p-admin/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@t2p-admin/ui/components/card";
import {
  IconEye,
  IconX,
  IconCheck,
  IconX as IconWrong,
  IconCircleDashed,
  IconCalendar,
  IconUser,
  IconClipboard,
  IconChartBar,
} from "@tabler/icons-react";
import type { TestHistoryType } from "@/features/test/test.schema";

interface TestSheetProps {
  test: TestHistoryType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TestSheet({ test, isOpen, onClose }: TestSheetProps) {
  if (!test) return null;

  const totalQuestions = test.questions.length;
  const answeredQuestions = test.questions.filter((q) => !q.skipped).length;
  const skippedQuestions = test.questions.filter((q) => q.skipped).length;
  const correctAnswers = test.questions.filter(
    (q) => q.isCorrect === true
  ).length;
  const incorrectAnswers = answeredQuestions - correctAnswers;
  const accuracy =
    answeredQuestions > 0
      ? ((correctAnswers / answeredQuestions) * 100).toFixed(1)
      : "0";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[800px] overflow-y-auto px-0">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-muted/30">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <IconEye className="size-5 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-xl font-bold">
                    Test Review
                  </SheetTitle>
                  <SheetDescription className="text-xs mt-1">
                    Detailed analysis and answer review
                  </SheetDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <IconX className="size-5" />
              </Button>
            </div>
          </SheetHeader>
        </div>

        {/* Test Information */}
        <div className="px-6 py-5 space-y-4 bg-background">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <IconUser className="size-4" />
                <span>Student</span>
              </div>
              <p className="text-lg font-semibold">{test.studentName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={test.archived ? "secondary" : "default"}
                className="text-xs"
              >
                {test.archived ? "Archived" : "Active"}
              </Badge>
              {test.level && (
                <Badge variant="outline" className="text-xs font-medium">
                  {test.level}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconCalendar className="size-4" />
              <div>
                <p className="text-xs">Attempted</p>
                <p className="text-foreground font-medium">
                  {test.createdAt
                    ? new Date(test.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-xs">
                  {test.createdAt
                    ? new Date(test.createdAt).toLocaleTimeString()
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconClipboard className="size-4" />
              <div>
                <p className="text-xs">Test ID</p>
                <p className="text-foreground font-mono text-xs">
                  {test.id.slice(0, 12)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Performance Metrics */}
        <div className="px-6 py-5 bg-muted/20">
          <div className="flex items-center gap-2 mb-4">
            <IconChartBar className="size-5 text-primary" />
            <h3 className="font-semibold text-base">Performance Overview</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="border-2">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {test.score ?? "N/A"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Final Score
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 dark:border-green-900">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <IconCheck className="size-5 text-green-600" />
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {correctAnswers}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Correct
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 dark:border-red-900">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <IconWrong className="size-5 text-red-600" />
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {incorrectAnswers}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Incorrect
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 dark:border-orange-900">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <IconCircleDashed className="size-5 text-orange-600" />
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {skippedQuestions}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Skipped
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Card className="bg-background/50">
              <CardContent className="p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Accuracy Rate
                </span>
                <span className="text-lg font-bold text-primary">
                  {accuracy}%
                </span>
              </CardContent>
            </Card>
            <Card className="bg-background/50">
              <CardContent className="p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Completion
                </span>
                <span className="text-lg font-bold">
                  {answeredQuestions}/{totalQuestions}
                </span>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Questions Section */}
        <div className="px-6 py-5 space-y-4 bg-background">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Question Analysis</h3>
            <Badge variant="outline" className="text-xs">
              {totalQuestions} Questions
            </Badge>
          </div>

          <div className="space-y-3">
            {test.questions.map((question, index) => (
              <Card
                key={question.questionId}
                className={`overflow-hidden transition-all ${
                  question.skipped
                    ? "border-orange-200 dark:border-orange-900"
                    : question.isCorrect
                      ? "border-green-200 dark:border-green-900"
                      : "border-red-200 dark:border-red-900"
                }`}
              >
                <CardHeader className="pb-3 bg-muted/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        #{index + 1}
                      </Badge>
                      {question.skipped ? (
                        <Badge
                          variant="secondary"
                          className="gap-1.5 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300"
                        >
                          <IconCircleDashed className="size-3.5" />
                          Skipped
                        </Badge>
                      ) : question.isCorrect ? (
                        <Badge className="gap-1.5 bg-green-600 hover:bg-green-700">
                          <IconCheck className="size-3.5" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1.5">
                          <IconWrong className="size-3.5" />
                          Incorrect
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-sm font-medium leading-relaxed mt-2">
                    {question.question}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-4 space-y-2">
                  {question.options.map((option) => {
                    const isUserAnswer =
                      question.userAnswer?.option === option.key;
                    const isCorrectAnswer =
                      question.correctAnswer?.option === option.key;

                    return (
                      <div
                        key={option.key}
                        className={`p-3 rounded-md border transition-all ${
                          isCorrectAnswer
                            ? "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-sm"
                            : isUserAnswer && !question.isCorrect
                              ? "border-red-500 bg-red-50 dark:bg-red-950/30 shadow-sm"
                              : "border-border bg-muted/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Badge
                            variant="outline"
                            className={`min-w-[28px] justify-center font-bold ${
                              isCorrectAnswer ||
                              (isUserAnswer && question.isCorrect)
                                ? "bg-green-100 dark:bg-green-950 border-green-500"
                                : isUserAnswer
                                  ? "bg-red-100 dark:bg-red-950 border-red-500"
                                  : ""
                            }`}
                          >
                            {option.key}
                          </Badge>
                          <p className="flex-1 text-sm leading-relaxed">
                            {option.value}
                          </p>
                          <div className="flex gap-1">
                            {isCorrectAnswer && (
                              <Badge
                                variant="default"
                                className="bg-green-600 text-[10px] px-2"
                              >
                                ✓ Correct
                              </Badge>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <Badge
                                variant="destructive"
                                className="text-[10px] px-2"
                              >
                                Selected
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Answer Details */}
                  {!question.skipped && (
                    <div className="mt-4 pt-3 border-t space-y-1.5 text-xs">
                      {question.userAnswer && (
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-muted-foreground min-w-[100px]">
                            Student Answer:
                          </span>
                          <span className="font-mono">
                            {question.userAnswer.option} —{" "}
                            {question.userAnswer.answer}
                          </span>
                        </div>
                      )}
                      {question.correctAnswer && (
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-muted-foreground min-w-[100px]">
                            Correct Answer:
                          </span>
                          <span className="font-mono text-green-600 dark:text-green-400">
                            {question.correctAnswer.option} —{" "}
                            {question.correctAnswer.answer}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
