"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  LogIn,
  Users,
  Mic,
  ClipboardCheck,
  MessageCircle,
  PlayCircle,
} from "lucide-react";
import PhoneMockup from "./ui/phone-mockup";
import { brico } from "./fonts";

const features = [
  {
    step: "Step 1",
    title: "Join the Platform",
    content: "Login or register to get started and track your progress.",
    icon: <LogIn className="h-6 w-6 text-primary" />,
    image: "/images/step1.png",
  },
  {
    step: "Step 2",
    title: "Take Placement & Practice Tests",
    content: "Evaluate your communication level and track improvements.",
    icon: <ClipboardCheck className="h-6 w-6 text-primary" />,
    image: "/images/step2.png",
  },
  {
    step: "Step 3",
    title: "Find Practice Partners",
    content: "Connect with other learners for real-time English conversations.",
    icon: <Users className="h-6 w-6 text-primary" />,
    image: "/images/phone.png",
  },
  {
    step: "Step 4",
    title: "Start Voice Calling",
    content: "Engage in live audio conversations with human partners.",
    icon: <Mic className="h-6 w-6 text-primary" />,
    image: "/images/step4.png",
  },
  {
    step: "Step 5",
    title: "Give & Receive Feedback",
    content:
      "Get personalized feedback to improve fluency, clarity, and confidence.",
    icon: <MessageCircle className="h-6 w-6 text-primary" />,
    image: "/images/step5.png",
  },
  {
    step: "Step 6",
    title: "Watch Courses & Practice",
    content:
      "Unlock expert-led courses, learn at your own pace, and practice daily.",
    icon: <PlayCircle className="h-6 w-6 text-primary" />,
    image: "/images/step6.png",
  },
];

export default function FeatureSections() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (4000 / 100));
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress]);

  return (
    <section
      id="features"
      className="relative z-10 py-24 md:py-32 bg-background"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Heading Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={cn(
              "mb-4 cursor-crosshair bg-gradient-to-b from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl",
              brico.className
            )}
          >
            Practice{" "}
            <span className="bg-primary from-foreground via-rose-300 to-primary bg-clip-text text-transparent dark:bg-gradient-to-b">
              English
            </span>{" "}
            with Confidence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-4 text-muted-foreground text-lg"
          >
            Talk2Partners&trade; guides you step by step to become a fluent
            English speaker.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Mobile View - only current feature visible */}
          <div className="block md:hidden space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={features[currentFeature].step}
                className="flex items-center gap-6 md:gap-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 md:h-14 md:w-14 border-primary bg-primary/10 text-primary [box-shadow:0_0_15px_rgba(0,102,255,0.3)] scale-110">
                  {features[currentFeature].icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold md:text-2xl">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {features[currentFeature].content}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop View - all features visible with highlight */}
          <div className="hidden md:block space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 md:gap-8"
                initial={{ opacity: 0.3, x: -20 }}
                animate={{
                  opacity: index === currentFeature ? 1 : 0.3,
                  x: 0,
                  scale: index === currentFeature ? 1.05 : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 md:h-14 md:w-14",
                    index === currentFeature
                      ? "scale-110 border-primary bg-primary/10 text-primary [box-shadow:0_0_15px_rgba(0,102,255,0.3)]"
                      : "border-muted-foreground bg-muted"
                  )}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold md:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side - PhoneMockup with image */}
          <div className="relative w-full flex justify-center">
            <PhoneMockup>
              <AnimatePresence mode="wait">
                <motion.img
                  key={features[currentFeature].image}
                  src={features[currentFeature].image}
                  alt={features[currentFeature].title}
                  className="absolute inset-0 h-[580px] w-full object-contain"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </PhoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}
