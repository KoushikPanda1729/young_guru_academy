'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@t2p-admin/ui/components/accordion';
import { brico } from './fonts';
import { useAction } from '@/hooks/useAction';

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
      duration: 0.4,
    },
  }),
};

export default function FaqSection() {
  const { faqs, loading, error, fetchFaqs } = useAction();

  
  React.useEffect(() => {
    const abort = new AbortController();
    void fetchFaqs({ signal: abort.signal });
    return () => abort.abort();
  }, [fetchFaqs]);
  const accordionItems = React.useMemo(() => {
    if (!faqs) return [];
    return faqs.map((f) => ({
      id: f.id,
      title: f.question?.trim() || 'Untitled FAQ',
      content: f.answer?.trim() || '',
    }));
  }, [faqs]);

  const hasFaqs = accordionItems.length > 0;

  return (
    <section id="faq" className="py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        {/* Heading */}
        <div className="mb-10 text-center">
          <motion.h2
            className={cn(
              'mb-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/80 to-foreground/40 md:text-5xl',
              brico.className
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked{' '}
            <span className="bg-primary bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to know about Talk2Partner and how to improve your spoken English through live conversations and expert-led courses.
          </motion.p>
        </div>

        {/* Body */}
        <motion.div
          className="relative mx-auto max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="absolute -left-4 -top-4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-4 -right-4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          {/* Loading State */}
          {loading && (
            <div className="w-full rounded-xl border border-border/40 bg-card/30 p-8 text-center text-muted-foreground">
              Loading FAQs…
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="w-full rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-center text-destructive">
              Failed to load FAQs: {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && !hasFaqs && (
            <div className="w-full rounded-xl border border-border/40 bg-card/30 p-8 text-center text-muted-foreground">
              No FAQs available right now. Please check back later.
            </div>
          )}

          {/* FAQ List */}
          {!loading && !error && hasFaqs && (
            <Accordion
              type="single"
              collapsible
              className="w-full rounded-xl border border-border/40 bg-card/30 p-2 backdrop-blur-sm"
              defaultValue={accordionItems[0]?.id}
            >
              {accordionItems.map((item, index) => (
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
                      'my-1 overflow-hidden rounded-lg border-none bg-card/50 px-2 shadow-sm transition-all',
                      'data-[state=open]:bg-card/80 data-[state=open]:shadow-md'
                    )}
                  >
                    <AccordionTrigger
                      className={cn(
                        'group flex flex-1 items-center justify-between gap-4 py-4 text-left text-base font-medium',
                        'outline-none transition-all duration-300 hover:text-primary hover:no-underline',
                        'focus-visible:ring-2 focus-visible:ring-primary/50',
                        'data-[state=open]:text-primary data-[state=open]:no-underline'
                      )}
                    >
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent
                      className={cn(
                        'overflow-hidden pb-4 pt-0 text-muted-foreground',
                        'data-[state=open]:animate-accordion-down',
                        'data-[state=closed]:animate-accordion-up'
                      )}
                    >
                      <div className="pt-3">{item.content}</div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          )}
        </motion.div>
      </div>
    </section>
  );
}
