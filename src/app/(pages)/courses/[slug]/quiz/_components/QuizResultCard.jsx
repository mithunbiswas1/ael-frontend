// src/app/(pages)/courses/[slug]/quiz/_components/QuizResultCard.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  BookOpen,
  Download,
  MailCheck,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export default function QuizResultCard({
  isPassed,
  scorePercent,
  correctCount,
  totalQuestions,
  passPercentage = 70,
  certificate,
  cooldownUntil,
  cooldownMinutes = 15,
  review = [],
  courseId,
  handleRetake,
  isBn,
}) {
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    if (!cooldownUntil) return;
    const updateCooldown = () => {
      const diff = new Date(cooldownUntil).getTime() - Date.now();
      setCooldownRemaining(diff > 0 ? Math.floor(diff / 1000) : 0);
    };
    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  const certId = certificate?.certificateId || `CERT-LPG-${courseId}-2026`;
  const formatCooldown = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-lg">
      <div className="text-center pb-8 border-b border-slate-100">
        {isPassed ? (
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-4 border-emerald-500 shadow-md">
            <CheckCircle2 className="h-12 w-12" />
          </div>
        ) : (
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-600 border-4 border-rose-500 shadow-md">
            <XCircle className="h-12 w-12" />
          </div>
        )}

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-slate-100 text-slate-700">
          {isPassed ? (
            <>
              <span className="text-emerald-700 font-black">
                {isBn ? "পাস মার্ক অর্জিত" : "PASSED (QUALIFIED)"}
              </span>
            </>
          ) : (
            <span className="text-rose-700 font-black">
              {isBn ? "পুনরায় চেষ্টা আবশ্যক" : "PASS CRITERIA NOT MET"}
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          {isPassed
            ? isBn
              ? "অভিনন্দন! আপনি সফলভাবে উত্তীর্ণ হয়েছেন!"
              : "Congratulations! You Passed!"
            : isBn
              ? "মূল্যায়ন অসম্পূর্ণ"
              : "Assessment Incomplete"}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
          {isPassed
            ? isBn
              ? "আপনার দক্ষতা ও জ্ঞান যাচাই করা হয়েছে। আপনার অফিসিয়াল যাচাইকৃত সার্টিফিকেট তৈরি হয়েছে এবং একটি কপি ইমেইলে পাঠানো হয়েছে।"
              : "You have verified your safety compliance knowledge. Your official certificate is generated and an electronic copy has been dispatched to your email."
            : isBn
              ? `সার্টিফিকেট অর্জনের জন্য কমপক্ষে ${passPercentage}% নম্বর আবশ্যক। আপনার বর্তমান স্কোর ${scorePercent}%। কোর্সের লেসনগুলো পুনরায় দেখে কুইজে অংশ নিন।`
              : `You need at least ${passPercentage}% to qualify for the official certificate. Your score: ${scorePercent}%. You can review the course materials and retry.`}
        </p>

        {/* Score Display Card */}
        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-slate-200 bg-slate-50/80 px-8 py-4 shadow-2xs">
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {isBn ? "আপনার প্রাপ্ত নম্বর" : "Your Score"}
            </div>
            <div
              className={`text-3xl font-black ${isPassed ? "text-emerald-600" : "text-rose-600"
                }`}
            >
              {scorePercent}%
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200 hidden sm:block" />
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {isBn ? "সঠিক উত্তর" : "Correct Answers"}
            </div>
            <div className="text-xl font-bold text-slate-800">
              {correctCount} / {totalQuestions}
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200 hidden sm:block" />
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              {isBn ? "পাস মার্ক" : "Pass Threshold"}
            </div>
            <div className="text-xl font-bold text-slate-600">
              {passPercentage}%
            </div>
          </div>
        </div>

        {/* Email Dispatched Note (When passed) */}
        {isPassed && (
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
            <MailCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              {isBn
                ? "সার্টিফিকেটের ভেরিফিকেশন লিঙ্ক ও পিডিএফ আপনার নিবন্ধিত ইমেইলে পাঠানো হয়েছে।"
                : "Official verification link & PDF notice dispatched to your registered email."}
            </span>
          </div>
        )}

        {/* Retake Notice: Next attempt will be a different question set */}
        {!isPassed && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-xl text-center">
            <RotateCcw className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>
              {isBn
                ? "রিটেক নিয়ম: আপনি এই সেটে উত্তীর্ণ হতে পারেননি। পরবর্তী রিটেক পরীক্ষায় আপনার জন্য সম্পূর্ণ ভিন্ন একটি প্রশ্ন সেট আসবে।"
                : "Retake Rule: You did not qualify in this set. A different random question set will be provided on your next attempt."}
            </span>
          </div>
        )}

        {/* Cooldown Timer Note (When failed) */}
        {!isPassed && cooldownRemaining > 0 && (
          <div className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl">
            <Clock className="h-4 w-4 text-amber-600 shrink-0 animate-spin" />
            <span>
              {isBn
                ? `কুল-ডাউন সক্রিয়: পুনরায় চেষ্টা করার বাকি সময়: ${formatCooldown(cooldownRemaining)}`
                : `Cooldown active: You can retry in ${formatCooldown(cooldownRemaining)}`}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="my-8 flex flex-wrap items-center justify-center gap-3">
        {isPassed ? (
          <>
            <Link
              href={`/verify-certificate?id=${encodeURIComponent(certId)}`}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs"
            >
              <Award className="h-4 w-4" />
              <span>
                {isBn
                  ? "সার্টিফিকেট দেখুন ও পিডিএফ ডাউনলোড করুন"
                  : "View & Download Certificate PDF"}
              </span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href={`/courses/learn/${courseId}`}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
            >
              <BookOpen className="h-4 w-4" />
              <span>
                {isBn
                  ? "কোর্সের পাঠসমূহ আবার রিভিশন দিন"
                  : "Revise Course Lessons"}
              </span>
            </Link>

            <button
              type="button"
              disabled={cooldownRemaining > 0}
              onClick={handleRetake}
              className={`flex items-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold transition shadow-xs ${cooldownRemaining > 0
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90 cursor-pointer"
                }`}
            >
              <RotateCcw className="h-4 w-4" />
              <span>
                {cooldownRemaining > 0
                  ? isBn
                    ? `অপেক্ষা করুন (${formatCooldown(cooldownRemaining)})`
                    : `Wait (${formatCooldown(cooldownRemaining)})`
                  : isBn
                    ? "নতুন সেটে পুনরায় পরীক্ষা দিন (Retake Exam)"
                    : "Retake Exam (New Question Set)"}
              </span>
            </button>
          </>
        )}

        <Link
          href="/courses"
          className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
        >
          {isBn ? "সকল কোর্স তালিকা" : "Course Catalog"}
        </Link>
      </div>

      {/* Answer Explanations Review Breakdown */}
      {review && review.length > 0 && (
        <div className="pt-8 border-t border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center justify-between">
            <span>{isBn ? "উত্তরের বিস্তারিত বিশ্লেষণ" : "Detailed Answer Explanations"}</span>
            <span className="text-slate-400 font-normal">
              {review.length} {isBn ? "টি প্রশ্ন" : "Questions"}
            </span>
          </h3>

          <div className="space-y-4">
            {review.map((item, idx) => {
              const qTitle = isBn ? item.questionBn || item.question : item.question;
              const explanationText = isBn
                ? item.explanationBn || item.explanation
                : item.explanation;

              return (
                <div
                  key={item.questionId || idx}
                  className={`p-4 sm:p-5 rounded-xl border text-xs leading-relaxed ${item.isCorrect
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-rose-200 bg-rose-50/40"
                    }`}
                >
                  <div className="flex items-start gap-2.5 font-bold text-slate-900 mb-2">
                    {item.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm">
                      {idx + 1}. {qTitle}
                    </span>
                  </div>

                  {explanationText && (
                    <div className="pl-6.5 mt-2 pt-2 border-t border-slate-200/50 text-[11px] text-slate-600">
                      <strong className="text-slate-800">
                        {isBn ? "ব্যাখ্যা / SOP রেফারেন্স:" : "Regulatory Explanation / SOP:"}
                      </strong>{" "}
                      {explanationText}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
