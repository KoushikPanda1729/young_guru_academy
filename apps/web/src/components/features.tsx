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
import { brico } from "./fonts";

const features = [
  {
    step: "Step 1",
    title: "Personal Trainer (One on One)",
    content:
      "Individual classes focused on your personal goals with fast improvement.",
    icon: <Users className="h-6 w-6 text-primary" />,
    thumbnail: "https://img.youtube.com/vi/sju21iJBuyE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=sju21iJBuyE",
  },
  {
    step: "Step 2",
    title: "Group Trainer",
    content:
      "Classes of 15 students focused on similar goals with steady, gradual improvement.",
    icon: <Users className="h-6 w-6 text-primary" />,
    thumbnail: "https://img.youtube.com/vi/RspV9xg1T44/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=RspV9xg1T44",
  },
  {
    step: "Step 3",
    title: "Recorded Lessons",
    content:
      "Access recorded lessons anytime, anywhere. Learn at your own pace with offline availability.",
    icon: <PlayCircle className="h-6 w-6 text-primary" />,
    thumbnail: "https://img.youtube.com/vi/y9K4QxX83sI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=y9K4QxX83sI",
  },
  {
    step: "Step 4",
    title: "Offline Learning",
    content:
      "Download lessons and practice without internet connection. Learn on the go, anytime.",
    icon: <ClipboardCheck className="h-6 w-6 text-primary" />,
    thumbnail: "https://img.youtube.com/vi/Fixrdd0O6GI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=Fixrdd0O6GI",
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
            Young Guru Academy guides you step by step to become a fluent
            English speaker with expert guidance and flexible learning options.
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

          {/* Right Side - Video Thumbnail Carousel */}
          <div className="relative w-full flex justify-center">
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.a
                  key={features[currentFeature].videoUrl}
                  href={features[currentFeature].videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block w-full aspect-video rounded-xl overflow-hidden shadow-2xl group cursor-pointer"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -100, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <img
                    src={features[currentFeature].thumbnail}
                    alt={features[currentFeature].title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.a>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
