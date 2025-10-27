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

export default function CourseSection() {
  const [selectedHeading] = useState("What We're Currently Offering");

  const courses = [
    {
      title: "Spoken English Course",
      description:
        "This helps you to speak confidently in daily situations from travel to casual chats with friends or coworkers.",
      image: "/courses/course.jpeg",
      duration: "1 Month",
      price: "₹ 9",
      originalPrice: "₹ 899",
      link: "https://play.google.com/store/apps/details?id=com.app.talk2partners",
    },
  ];

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

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={cn(
            "max-w-7xl mx-auto gap-6",
            courses.length === 1
              ? "flex justify-center" // center single card
              : "grid lg:grid-cols-3 md:grid-cols-2" // grid for multiple
          )}
        >
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <Card className="overflow-hidden rounded-xl shadow-md border pt-0 w-[350px]">
                {/* Image */}
                <div className="relative aspect-video w-full">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="rounded-t-xl object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-yellow-400 text-black rounded-full px-3 py-1 text-sm font-medium">
                    {course.duration}
                  </Badge>
                </div>

                {/* Text Content */}
                <CardHeader>
                  <CardTitle className="text-blue-600 text-lg">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {course.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {course.originalPrice}
                    </span>
                  </div>
                  <Button asChild className="px-6">
                    <Link href={course.link}>Enroll Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
