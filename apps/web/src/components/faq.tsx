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

const defaultFaqs = [
  {
    id: 'faq-1',
    question: 'Is course me kon admission le sakta hai?',
    answer: 'Is course me koi bhi admission le sakta hai chahe aap working ho, Student ho ya House wife ho.',
  },
  {
    id: 'faq-2',
    question: 'Demo Session?',
    answer: 'Demo Session 👇\n\nGroup Batch :- https://youtu.be/RspV9xg1T44?si=wLECHuopCdKqOlk1\n\nPersonal Batch:- https://youtu.be/sju21iJBuyE?si=aoe3OdIBAZsuor8I\n\nFeedback :- https://youtu.be/5FpKVes9XDs',
  },
  {
    id: 'faq-3',
    question: 'P.t & G.t mein kya difference hai?',
    answer: 'Personal Trainer\n\n• Personal Trainer (One on One) me Individual class hoti hai.\n• Personal Trainer (One on One) me Student ke individual Goal par focus kiya jata hai.\n• Personal Trainer (One on One) me Fast Improvement aata hai.\n\nGroup Trainer\n\n• Group Trainer me 15 Students ki class hoti hai.\n• Group Trainer me Students ke Similar Goals par focus kiya jata hai.\n• Group Trainer me Improvement Dheere Dheere hota hai.',
  },
  {
    id: 'faq-4',
    question: 'Trainer kon rahenge?',
    answer: 'Apko highly Qualified & Experienced Trainer Teach karenge. jo Hindi medium ke students ki problem ko achhe se samjhte hain.',
  },
  {
    id: 'faq-5',
    question: 'Apne abtak kitne students ko teach kiya hai?',
    answer: 'Young Guru Academy Online Institute hai jo students ko English Spoken, Personality Development, Interview Preparation, Career Counselling aur Educational Skills provide karta hai. jo West Vinod Nagar, Mandawali, Delhi me hai. Young Guru Academy 2015 se Students ko teach kar rahi hai. Humne abtak India aur Gulf country ke 1.5 Lakh Students ko teach kiya hai. Humne develop environment create kiya hua hai jhan aap avashaya English seekhkar khud ko Improve kar paynge. Hum Zero se lekar Advanced Level tak English Spoken Class provide karte hain.',
  },
  {
    id: 'faq-6',
    question: 'Teaching Mode?',
    answer: 'Hum apko Hinglish (Hindi + English) language me teach karenge. jisse aap Easily content ko samjhkar apni English improve kar paynge.',
  },
  {
    id: 'faq-7',
    question: 'Kya main is batch ko join karne ke baad English bol paunga / paungi?',
    answer: 'Yes, Agar aap hamare Trainer ko 100% follow karte hain aur Daily One Hour Self Study karte hain.',
  },
  {
    id: 'faq-8',
    question: 'Kya course complete karne ke baad mujhe certificate milega?',
    answer: 'Yes, Course complete karne ke baad apka ek test hoga usme jo bhi apke marks ayenge vo Grade mention karke apko certificate provide kiya jayga.',
  },
  {
    id: 'faq-9',
    question: 'Fee Structure?',
    answer: 'Aap is number par call kar sakte hain :- +91 – 9560998990. Hamare counsellor apko course ki complete information de denge.',
  },
];

export default function FaqSection() {
  const { faqs, loading, error, fetchFaqs } = useAction();

  
  React.useEffect(() => {
    const abort = new AbortController();
    void fetchFaqs({ signal: abort.signal });
    return () => abort.abort();
  }, [fetchFaqs]);
  const accordionItems = React.useMemo(() => {
    // Use backend FAQs if available, otherwise use default FAQs
    // If there's an error, also fall back to default FAQs
    const faqsToUse = (faqs && faqs.length > 0) ? faqs : defaultFaqs;
    return faqsToUse.map((f) => ({
      id: f.id,
      title: f.question?.trim() || 'Untitled FAQ',
      content: f.answer?.trim() || '',
    }));
  }, [faqs]);

  const hasFaqs = accordionItems.length > 0;

  // Always show FAQs (default or from API), never show error or loading states

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
            Everything you need to know about Young Guru Academy and how to transform your skills through flexible online courses with expert guidance.
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

          {/* FAQ List - Always show (using default FAQs if API fails) */}
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
                      'overflow-hidden pb-4 pt-0 text-muted-foreground whitespace-pre-line',
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
        </motion.div>
      </div>
    </section>
  );
}
