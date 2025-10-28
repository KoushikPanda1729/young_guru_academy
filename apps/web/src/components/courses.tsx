"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@t2p-admin/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@t2p-admin/ui/components/card";
import { Badge } from "@t2p-admin/ui/components/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

type CourseType = "group" | "personal" | "recorded";

export default function CourseSection() {
  const [selectedHeading] = useState("What We're Currently Offering");
  const [activeTab, setActiveTab] = useState<CourseType>("group");

  const coursesData = {
    group: [
      {
        title: "Group Batch - Basic",
        description: "Perfect for beginners starting their journey.",
        image: "/courses/course.jpeg",
        duration: "3 Months",
        price: "₹ 299",
        originalPrice: "₹ 999",
        link: "https://play.google.com/store/apps/details?id=co.classplus.yga",
        includes: ["Live Sessions on Zoom", "Chat Support 10 AM – 8 PM"],
        learningMaterial: ["50 Grammar Videos", "800 Vocabularies"],
        outcomes: ["Basic conversations", "Simple sentences"],
      },
      {
        title: "Group Batch - Intermediate",
        description: "Build confidence in speaking English.",
        image: "/courses/course.jpeg",
        duration: "4 - 6 Months",
        price: "₹ 499",
        originalPrice: "₹ 1,999",
        link: "https://play.google.com/store/apps/details?id=co.classplus.yga",
        includes: ["Live Sessions on Zoom", "Chat Support 10 AM – 8 PM"],
        learningMaterial: ["75 Grammar Videos", "1400 Vocabularies"],
        outcomes: ["Speak confidently", "Daily conversations"],
      },
      {
        title: "Group Batch - Advanced",
        description: "Master fluent English communication.",
        image: "/courses/course.jpeg",
        duration: "6 - 8 Months",
        price: "₹ 799",
        originalPrice: "₹ 2,999",
        link: "https://play.google.com/store/apps/details?id=co.classplus.yga",
        includes: ["Live Sessions on Zoom", "Advanced Materials"],
        learningMaterial: ["100 Grammar Videos", "2000 Vocabularies"],
        outcomes: ["Fluent communication", "Professional speaking"],
      },
    ],
    personal: [
      {
        title: "Personal Coach - Starter",
        description: "Get started with personalized attention.",
        image: "/courses/course.jpeg",
        duration: "1 Month",
        price: "₹ 999",
        originalPrice: "₹ 2,499",
        link: "https://play.google.com/store/apps/details?id=co.classplus.yga",
        includes: ["One-on-One Sessions", "Flexible Scheduling"],
        learningMaterial: ["Custom Materials", "50 Grammar Videos"],
        outcomes: ["Personal goals", "Quick improvement"],
      },
      {
        title: "Personal Coach - Pro",
        description: "Complete transformation package.",
        image: "/courses/course.jpeg",
        duration: "3 - 4 Months",
        price: "₹ 1,999",
        originalPrice: "₹ 4,999",
        link: "https://play.google.com/store/apps/details?id=co.classplus.yga",
        includes: ["One-on-One Sessions", "Flexible Scheduling"],
        learningMaterial: ["Custom Materials", "75 Grammar Videos"],
        outcomes: ["Professional skills", "Interview prep"],
      },
      {
        title: "Personal Coach - Premium",
        description: "Intensive coaching for excellence.",
        image: "/courses/course.jpeg",
        duration: "6 Months",
        price: "₹ 3,499",
        originalPrice: "₹ 7,999",
        link: "https://play.google.com/store/apps/details?id=co.classplus.yga",
        includes: ["One-on-One Sessions", "Priority Support"],
        learningMaterial: ["Premium Materials", "100 Grammar Videos"],
        outcomes: ["Expert level fluency", "Business English"],
      },
    ],
    recorded: [
      {
        title: "Recorded Course - Essentials",
        description: "Essential lessons for quick learning.",
        image: "/courses/course.jpeg",
        duration: "6 Months Access",
        price: "₹ 49",
        originalPrice: "₹ 499",
        link: "https://play.google.com/store/apps/details?id=co.classplus.yga",
        includes: ["6 Months Access", "Offline Download"],
        learningMaterial: ["40 Grammar Videos", "800 Vocabularies"],
        outcomes: ["Basic foundation", "Self-learning"],
      },
      {
        title: "Recorded Course - Complete",
        description: "Complete course with lifetime access.",
        image: "/courses/course.jpeg",
        duration: "Lifetime Access",
        price: "₹ 99",
        originalPrice: "₹ 899",
        link: "https://play.google.com/store/apps/details?id=co.classplus.yga",
        includes: ["Lifetime Access", "Offline Download"],
        learningMaterial: ["75 Grammar Videos", "1400 Vocabularies"],
        outcomes: ["Strong foundation", "Self-paced learning"],
      },
      {
        title: "Recorded Course - Master",
        description: "Premium content for mastery.",
        image: "/courses/course.jpeg",
        duration: "Lifetime Access",
        price: "₹ 199",
        originalPrice: "₹ 1,499",
        link: "https://play.google.com/store/apps/details?id=co.classplus.yga",
        includes: ["Lifetime Access", "Premium Content"],
        learningMaterial: ["120 Grammar Videos", "2500 Vocabularies"],
        outcomes: ["Complete mastery", "Advanced skills"],
      },
    ],
  };

  const courses = coursesData[activeTab];

  return (
    <section
      id="courses"
      className="relative flex w-full items-center justify-center overflow-hidden py-16"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="relative mx-auto max-w-4xl text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={cn(
              "mb-4 cursor-crosshair bg-gradient-to-b from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl"
            )}
          >
            {selectedHeading.split(" ").map((word, index) => (
              <span key={index}>
                {["Offering", "Providing", "Courses", "Path"].includes(word) ? (
                  <span className="bg-primary from-foreground via-blue-300 to-primary bg-clip-text text-transparent dark:bg-gradient-to-b">
                    {word}
                  </span>
                ) : (
                  word
                )}{" "}
              </span>
            ))}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8 mt-2 text-muted-foreground sm:text-lg"
          >
            Choose the perfect course package for your English learning goals.
            <br className="hidden sm:block" />
            Start your journey toward confident speaking today.
          </motion.p>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setActiveTab("group")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === "group"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Group Batch
            </button>
            <button
              onClick={() => setActiveTab("personal")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === "personal"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Personal Coach
            </button>
            <button
              onClick={() => setActiveTab("recorded")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === "recorded"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Recorded Course
            </button>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0"
        >
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex justify-center"
            >
              <Card className="overflow-hidden rounded-xl shadow-md border pt-0 w-full max-w-[400px] h-[700px] flex flex-col">
                {/* Image */}
                <div className="relative w-full h-74 flex-shrink-0">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="rounded-t-xl object-fill"
                  />
                  <Badge className="absolute top-2 left-2 bg-yellow-400 text-black rounded-full px-2 py-0.5 text-xs font-medium">
                    {course.duration}
                  </Badge>
                </div>

                {/* Text Content */}
                <CardHeader className="pb-2 pt-3 px-4 flex-shrink-0">
                  <CardTitle className="text-blue-600 text-xl leading-tight">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm leading-tight">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                {/* Batch Details */}
                <div className="px-4 space-y-2 pb-3 flex-1">
                  {course.includes && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        Batch Includes
                      </h4>
                      <ul className="space-y-0">
                        {course.includes.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start leading-tight"
                          >
                            <span className="mr-1 text-primary">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.learningMaterial && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        Learning Material
                      </h4>
                      <ul className="space-y-0">
                        {course.learningMaterial.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start leading-tight"
                          >
                            <span className="mr-1">📚</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.outcomes && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        After Completion
                      </h4>
                      <ul className="space-y-0">
                        {course.outcomes.map((item, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start leading-tight"
                          >
                            <span className="mr-1">🎯</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <CardFooter className="flex flex-col items-start gap-2  pt-3 px-6 mb-4 flex-shrink-0 mt-auto border border-white">
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {course.price}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {course.originalPrice}
                      </span>
                    </div>
                    <Button
                      asChild
                      className="px-3 sm:px-4 py-1 h-8 text-xs sm:text-sm flex-shrink-0 ml-2"
                    >
                      <Link href={course.link}>Enroll Now</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
