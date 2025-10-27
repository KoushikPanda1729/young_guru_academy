'use client';

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@t2p-admin/ui/components/avatar';
import { motion } from 'motion/react';
import { brico } from './fonts';

const videoTestimonials = [
  {
    url: 'https://youtu.be/n1lB9OkAuqc',
    embedId: 'n1lB9OkAuqc',
    speaker: 'Maloti Hembram',
    avatar: '',
  },
  {
    url: 'https://youtu.be/M3UyhlJbK24',
    embedId: 'M3UyhlJbK24',
    speaker: 'Dimbeshwar Cho',
    avatar: '',
  },
  {
    url: 'https://youtu.be/ZLwAnwVL7G0',
    embedId: 'ZLwAnwVL7G0',
    speaker: 'Krishna Nichal',
    avatar: '',
  },
];

export default function TestimonialSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <section
      id="testimonial"
      className="relative overflow-hidden py-16 md:py-24">
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
              'mb-4 cursor-crosshair bg-gradient-to-b from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-4xl font-bold text-transparent sm:text-7xl',
              brico.className,
            )}
          >
            See what{' '}
            <span className="bg-primary from-foreground via-rose-300 to-primary bg-clip-text text-transparent dark:bg-gradient-to-b">
              learners are saying
            </span>
          </motion.h2>

          <motion.p
            className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Real feedback from users who&apos;ve grown confident in English speaking through Talk2Partner&apos;s expert sessions and group practice.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {videoTestimonials.map((video, index) => (
              <div key={`${video.url}-${index}`} className="flex justify-center px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-[320px] sm:w-[360px] md:w-[400px] lg:w-[460px] overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-md backdrop-blur-md"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-4">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.embedId}`}
                      title={`${video.speaker} testimonial`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <Avatar className="h-10 w-10 border border-border ring-2 ring-primary/10 ring-offset-1 ring-offset-background">
                      <AvatarImage src={video.avatar} alt={video.speaker} />
                      <AvatarFallback>{video.speaker.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{video.speaker}</p>
                    </div>
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