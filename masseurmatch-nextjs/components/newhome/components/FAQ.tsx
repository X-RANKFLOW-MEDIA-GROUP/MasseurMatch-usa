"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What is MasseurMatch?',
    answer: 'MasseurMatch is an inclusive online directory that helps people find independent massage therapists in the United States.'
  },
  {
    question: 'Is MasseurMatch a booking platform?',
    answer: 'No. MasseurMatch does not manage bookings, payments, or schedules. Clients contact therapists directly.'
  },
  {
    question: 'How do I find a massage therapist near me?',
    answer: 'You can search by city and browse local therapist profiles optimized for your area.'
  },
  {
    question: 'What information is shown on a therapist profile?',
    answer: 'Profiles include city served, services offered, incall or outcall options, price range, photos, availability, and direct contact details.'
  },
  {
    question: 'Are therapists verified on MasseurMatch?',
    answer: 'No. MasseurMatch does not verify identities or licenses. Profiles are self-declared, and clients should confirm credentials directly.'
  },
  {
    question: 'Does MasseurMatch charge clients?',
    answer: 'No. Browsing and contacting therapists is free for clients.'
  },
  {
    question: 'How do therapists get visibility on MasseurMatch?',
    answer: 'Visibility is based on profile completeness, location relevance, and compliance with our guidelines. There are no paid tiers for placement.'
  },
  {
    question: 'Is MasseurMatch focused on LGBTQ+ and inclusion?',
    answer: 'Yes. MasseurMatch is built to support inclusive, safe visibility for LGBTQ+ massage professionals and clients.'
  }
];

function FAQItem({ faq, index }: { faq: typeof faqs[0], index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className="border-b border-white/10 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 md:py-6 flex items-center justify-between gap-3 md:gap-4 text-left group hover:opacity-80 transition-opacity"
      >
        <span className="text-lg md:text-xl font-semibold text-white pr-4 md:pr-8">
          {faq.question}
        </span>
        <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
          {isOpen ? (
            <Minus className="w-4 h-4 md:w-5 md:h-5 text-white" />
          ) : (
            <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 md:pb-6 pr-8 md:pr-14">
              <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative py-20 md:py-32 px-4 bg-black overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white uppercase tracking-wider mb-6"
          >
            Frequently Asked
          </motion.span>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.2]"
          >
            Questions & Answers
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to know about MasseurMatch
          </motion.p>
        </motion.div>

        {/* FAQ List */}
        <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-8 lg:p-12">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8 md:mt-12"
        >
          <p className="text-zinc-400 mb-4 text-sm md:text-base">Still have questions?</p>
          <button className="group relative inline-flex items-center px-6 md:px-8 py-2.5 md:py-3 bg-white/5 backdrop-blur-md border border-white/20 text-white font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-300 text-sm md:text-base">
            Contact Support
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
