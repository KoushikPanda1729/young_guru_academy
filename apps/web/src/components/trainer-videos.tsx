"use client";

import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { brico } from "./fonts";

const trainerVideos = [
  {
    url: "https://www.youtube.com/watch?v=RspV9xg1T44",
    embedId: "RspV9xg1T44",
    title: "Training Session 1",
  },
  {
    url: "https://www.youtube.com/watch?v=sju21iJBuyE",
    embedId: "sju21iJBuyE",
    title: "Training Session 2",
  },
  {
    url: "https://www.youtube.com/watch?v=NOuL104PkKc",
    embedId: "NOuL104PkKc",
    title: "Training Session 3",
  },
  {
    url: "https://www.youtube.com/watch?v=txnt8rRYsUA",
    embedId: "txnt8rRYsUA",
    title: "Training Session 4",
  },
  {
    url: "https://www.youtube.com/watch?v=Fixrdd0O6GI",
    embedId: "Fixrdd0O6GI",
    title: "Training Session 5",
  },
  {
    url: "https://www.youtube.com/watch?v=y9K4QxX83sI",
    embedId: "y9K4QxX83sI",
    title: "Training Session 6",
  },
];

export default function TrainerVideosSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>(
    Array(trainerVideos.length).fill(null)
  );

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      // Only scroll if no video is playing
      if (!isVideoPlaying) {
        emblaApi.scrollNext();
      }
    }, 6000);

    return () => clearInterval(autoplay);
  }, [emblaApi, isVideoPlaying]);

  // Load YouTube IFrame API
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  // Initialize YouTube players
  useEffect(() => {
    // @ts-ignore - YouTube API is loaded dynamically
    window.onYouTubeIframeAPIReady = () => {
      iframeRefs.current.forEach((iframe, index) => {
        if (iframe) {
          // @ts-ignore - YouTube API
          new window.YT.Player(iframe, {
            events: {
              onStateChange: (event: any) => {
                // 1 = playing
                if (event.data === 1) {
                  setIsVideoPlaying(true);

                  // Pause all other videos when this one starts playing
                  iframeRefs.current.forEach((ref, refIndex) => {
                    if (ref && refIndex !== index) {
                      try {
                        // @ts-ignore
                        const player = window.YT?.get?.(ref.id);
                        if (player?.getPlayerState?.() === 1) {
                          player.pauseVideo();
                        }
                      } catch {
                        // Ignore errors
                      }
                    }
                  });
                } else {
                  // Check if any other video is still playing
                  // If all are paused/ended, set to false
                  setTimeout(() => {
                    const anyPlaying = iframeRefs.current.some((ref) => {
                      if (!ref) return false;
                      try {
                        // @ts-ignore
                        const player = window.YT?.get?.(ref.id);
                        return player?.getPlayerState?.() === 1;
                      } catch {
                        return false;
                      }
                    });
                    setIsVideoPlaying(anyPlaying);
                  }, 100);
                }
              },
            },
          });
        }
      });
    };
  }, []);

  return (
    <section
      id="trainer-videos"
      className="relative overflow-hidden py-16 md:py-24"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.2),transparent_60%)]" />
        <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[length:20px_20px] bg-grid-foreground/[0.02]" />
      </div>

      {/* Heading */}
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative mb-12 text-center md:mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={cn(
              "mb-4 cursor-crosshair bg-gradient-to-b from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-4xl font-bold text-transparent sm:text-7xl",
              brico.className
            )}
          >
            How our{" "}
            <span className="bg-primary from-foreground via-rose-300 to-primary bg-clip-text text-transparent dark:bg-gradient-to-b">
              trainers train
            </span>
          </motion.h2>

          <motion.p
            className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Watch our expert trainers in action and discover their proven
            teaching methods that help you master English fluency.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {trainerVideos.map((video, index) => (
              <div
                key={`${video.url}-${index}`}
                className="flex justify-center px-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-[320px] sm:w-[360px] md:w-[400px] lg:w-[460px] overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-md backdrop-blur-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                    <iframe
                      id={`youtube-player-${index}`}
                      src={`https://www.youtube.com/embed/${video.embedId}?enablejsapi=1`}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
