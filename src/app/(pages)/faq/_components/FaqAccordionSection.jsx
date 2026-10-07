// src/app/(pages)/faq/_components/FaqAccordionSection.jsx
"use client";

import { useState } from "react";
import { Search, Phone, ArrowRight } from "lucide-react";
import Input from "@/components/ui/Input";
import { LinkButton } from "@/components/ui/LinkButton";
import { H3, P } from "@/components/ui/Typography";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { useDictionary } from "@/context/DictionaryContext";

export default function FaqAccordionSection({ items = [] }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const faqDict = dict?.faq || {};

  const rawItems = Array.isArray(items) ? [...items] : [];
  // LIFO: newest added first show
  const sortedItems = rawItems.sort((a, b) => {
    const aTime = Number(a?.id) || 0;
    const bTime = Number(b?.id) || 0;
    if (aTime && bTime) return bTime - aTime;
    return 0;
  });

  const faqItems =
    sortedItems.length > 0
      ? sortedItems.map((item) => ({
          question: isBn && item.questionBn ? item.questionBn : (item.question || ""),
          answer: isBn && item.answerBn ? item.answerBn : (item.answer || ""),
        }))
      : [];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqItems.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.question?.toLowerCase().includes(q) ||
      item.answer?.toLowerCase().includes(q)
    );
  });

  return (
    <section className="relative z-20 -mt-8 mx-auto w-full max-w-4xl px-4 pb-20">
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-8 shadow-2xs">
        {/* Search Box */}
        <div className="mb-6">
          <Input
            placeholder={
              faqDict.searchPlaceholder ||
              (isBn
                ? "প্রশ্ন বা কিওয়ার্ড লিখে অনুসন্ধান করুন (যেমনঃ লিক, রেগুলেটর, লাইসেন্স)..."
                : "Type your question or search keywords (e.g. leak, regulator, license)...")
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<Search className="h-4 w-4 text-slate-400" />}
            size="md"
            className="bg-slate-50/80"
          />
        </div>

        {/* Modular Accessible Accordion Component */}
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            {isBn
              ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো প্রশ্নোত্তর পাওয়া যায়নি। অনুগ্রহ করে আমাদের সাথে সরাসরি যোগাযোগ করুন।"
              : "No questions found matching your search. Please reach out to our team directly."}
          </div>
        ) : (
          <Accordion
            type="multiple"
            defaultValue={["faq-0"]}
            className="space-y-3"
          >
            {filteredFaqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} variant="card">
                <AccordionTrigger iconType="chevron">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent variant="card">
                  <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-600">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Support CTA Callout */}
      <div className="mt-8 rounded-xl border border-slate-200/80 bg-gradient-to-r from-slate-900 to-tertiary p-6 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <H3 className="text-sm sm:text-base font-bold text-white">
            {faqDict.stillHaveQuestions || (isBn ? "আরও কোনো প্রশ্ন আছে?" : "Still have questions?")}
          </H3>
          <P color="light" size="xs" className="mt-1">
            {faqDict.contactSupportDesc ||
              (isBn
                ? "আমাদের নিরাপত্তা সমন্বয়কারী ও কারিগরি কর্মকর্তারা আপনাকে ২৪/৭ সহায়তা প্রদানে প্রস্তুত।"
                : "Our safety coordinators and technical officers are ready to assist you 24/7.")}
          </P>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <LinkButton
            href="tel:16137"
            variant="primary"
            size="sm"
            className="w-full sm:w-auto text-xs font-bold gap-1.5"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>{faqDict.callEmergency || (isBn ? "হটলাইন (১৬১৩৭)" : "Call Hotline (16137)")}</span>
          </LinkButton>
          <LinkButton
            href="/contact"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto text-xs font-bold gap-1.5 border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <span>{faqDict.contactPage || (isBn ? "যোগাযোগ করুন" : "Contact Support")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
