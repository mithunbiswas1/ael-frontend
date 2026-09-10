// src/app/(pages)/courses/[id]/quiz/page.jsx
"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  AlertTriangle,
  RotateCcw,
  Download,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { H1, H2, H3, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Is LPG vapor heavier or lighter than atmospheric air?",
    options: [
      { text: "Lighter than air; it immediately rises to the ceiling", isCorrect: false },
      { text: "Heavier than air; it settles in low ground depressions and floor corners", isCorrect: true },
      { text: "Identical density; it instantly diffuses uniformly without settling", isCorrect: false },
      { text: "Depends on whether the cylinder is filled with pure butane", isCorrect: false },
    ],
    explanation:
      "LPG vapor is 1.5 to 2.0 times denser than air, meaning it accumulates near floors, drains, and basements in the event of a leak.",
  },
  {
    id: 2,
    question: "What is the recommended safe method to test for suspected LPG gas leaks around valves or regulators?",
    options: [
      { text: "Lighting a matchstick or candle to observe minor flame flickers", isCorrect: false },
      { text: "Applying liquid soap-and-water solution with a sponge and looking for bubbling", isCorrect: true },
      { text: "Spraying chemical perfume to neutralize the mercaptan odor", isCorrect: false },
      { text: "Tapping the regulator body with a metal wrench to listen for pitch changes", isCorrect: false },
    ],
    explanation:
      "Never use an open flame to detect gas leaks! A soap-and-water solution is safe, non-combustible, and immediately reveals leaks by forming expanding bubbles.",
  },
  {
    id: 3,
    question: "What immediate action should be taken first if you detect a strong gas odor in your home kitchen?",
    options: [
      { text: "Turn on the electric exhaust fan immediately to vent the room", isCorrect: false },
      { text: "Turn off the cylinder regulator switch and open all doors and windows for natural ventilation", isCorrect: true },
      { text: "Switch on all kitchen lights to inspect the pipe joints", isCorrect: false },
      { text: "Shake the cylinder vigorously to verify the remaining gas level", isCorrect: false },
    ],
    explanation:
      "Do NOT touch any electrical switches or exhaust fans because the electrical contact spark can ignite the gas-air mixture. Shut off the regulator and open windows.",
  },
  {
    id: 4,
    question: "How should an LPG cylinder be stored during normal daily operation?",
    options: [
      { text: "In a horizontal resting position inside a sealed lower cupboard", isCorrect: false },
      { text: "Strictly upright on a level floor, in a well-ventilated area away from heat sources", isCorrect: true },
      { text: "Suspended off the floor near an electrical water heater", isCorrect: false },
      { text: "In an underground pit or floor drainage trench", isCorrect: false },
    ],
    explanation:
      "Cylinders must always be kept strictly vertical and upright so that only vapor—not liquid—reaches the pressure regulator.",
  },
  {
    id: 5,
    question: "What is the nationwide emergency hotline number in Bangladesh for urgent LPG fire or explosive hazards?",
    options: [
      { text: "16137 (AEL National Emergency Safety Support)", isCorrect: true },
      { text: "99999 (Private Ambulance Association)", isCorrect: false },
      { text: "100 (Postal Support)", isCorrect: false },
      { text: "105 (Railway Inquiry)", isCorrect: false },
    ],
    explanation:
      "The dedicated 24/7 National Emergency LPG Support Hotline is 16137, operational nationwide in partnership with Civil Defense.",
  },
];

export default function CourseQuizPage({ params }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          toast.warning("Time is up! Your quiz has been automatically submitted.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optIdx,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < QUIZ_QUESTIONS.length) {
      if (!confirm(`You have only answered ${answeredCount} of ${QUIZ_QUESTIONS.length} questions. Submit anyway?`)) {
        return;
      }
    }
    setIsSubmitted(true);
    toast.success("Quiz submitted successfully!");
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIdx(0);
    setSecondsRemaining(600);
  };

  // Score Calculation
  let correctCount = 0;
  QUIZ_QUESTIONS.forEach((q, idx) => {
    const selectedIdx = selectedAnswers[idx];
    if (selectedIdx !== undefined && q.options[selectedIdx].isCorrect) {
      correctCount += 1;
    }
  });

  const scorePercent = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
  const isPassed = scorePercent >= 80;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Top Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-14 pt-10 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                href={`/courses/learn/${courseId}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-3"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Classroom</span>
              </Link>
              <H1 color="white" className="leading-tight text-xl sm:text-2xl md:text-3xl">
                Official LPG Safety Assessment
              </H1>
              <P className="text-xs text-slate-400 mt-1">
                Pass mark: 80% (4 of 5 correct) • Certificate auto-generated upon passing
              </P>
            </div>

            {/* Timer Badge */}
            {!isSubmitted && (
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-white">
                <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Time Remaining</div>
                  <div className="text-base font-black tracking-wider text-amber-400 font-mono">
                    {timeString}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Quiz Body */}
      <section className="relative z-20 -mt-6 mx-auto w-full max-w-3xl px-4 pb-20">
        {!isSubmitted ? (
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
            {/* Question Counter Progress */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 text-xs font-bold text-slate-600">
              <span className="text-primary font-black uppercase tracking-wider">
                Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span>
                {Object.keys(selectedAnswers).length} answered
              </span>
            </div>

            {/* Question Text */}
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3 mb-8">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-lg border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${
                      isSelected
                        ? "border-primary bg-blue-50/70 text-slate-900 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                        isSelected
                          ? "bg-primary text-white border-primary"
                          : "border-slate-300 bg-slate-100 text-slate-600"
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIdx === 0}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIdx === QUIZ_QUESTIONS.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Award className="h-4 w-4" />
                  <span>Submit Quiz</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs"
                >
                  <span>Next Question</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Result Card */
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md">
            <div className="text-center pb-6 border-b border-slate-100">
              {isPassed ? (
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-500">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
              ) : (
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 border-2 border-red-500">
                  <XCircle className="h-10 w-10" />
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {isPassed ? "Congratulations! You Passed!" : "Assessment Incomplete"}
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                {isPassed
                  ? "You have demonstrated mastery in national LPG safety regulations and best handling practices."
                  : "You need at least 80% to qualify for the official certificate. You may review the questions below and retake."}
              </p>

              {/* Score Display */}
              <div className="mt-5 inline-flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-6 py-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Your Score</div>
                  <div className="text-2xl font-black text-slate-900">
                    {scorePercent}%
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Correct Answers</div>
                  <div className="text-lg font-bold text-slate-800">
                    {correctCount} of {QUIZ_QUESTIONS.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="my-6 flex flex-wrap items-center justify-center gap-3">
              {isPassed ? (
                <Link
                  href={`/verify-certificate?certId=CERT-LPG-${courseId}-2024`}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Award className="h-4 w-4" />
                  <span>View & Verify Your Certificate</span>
                </Link>
              ) : (
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retake Quiz Now</span>
                </button>
              )}

              <Link
                href="/courses"
                className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Browse Other Courses
              </Link>
            </div>

            {/* Answer Breakdown */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">
                Detailed Answers Breakdown
              </h3>
              <div className="space-y-4">
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const selected = selectedAnswers[idx];
                  const isQCorrect = selected !== undefined && q.options[selected].isCorrect;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border text-xs ${
                        isQCorrect
                          ? "border-emerald-200 bg-emerald-50/40"
                          : "border-red-200 bg-red-50/40"
                      }`}
                    >
                      <div className="flex items-start gap-2 font-bold text-slate-900 mb-2">
                        {isQCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <span>
                          {idx + 1}. {q.question}
                        </span>
                      </div>

                      <div className="pl-6 text-slate-600 space-y-1">
                        <div>
                          <strong>Your Answer:</strong>{" "}
                          <span className={isQCorrect ? "text-emerald-700 font-semibold" : "text-red-700 font-semibold"}>
                            {selected !== undefined ? q.options[selected].text : "Unanswered"}
                          </span>
                        </div>
                        {!isQCorrect && (
                          <div className="text-emerald-800">
                            <strong>Correct Answer:</strong>{" "}
                            {q.options.find((o) => o.isCorrect)?.text}
                          </div>
                        )}
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 mt-1">
                          <strong>Note:</strong> {q.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
