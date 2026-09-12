"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import QuizHeader from "../_components/QuizHeader";
import QuizQuestionCard from "../_components/QuizQuestionCard";
import QuizResultCard from "../_components/QuizResultCard";

export const QUIZ_QUESTIONS = [
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
      { text: "16137 (Safe LPG National Emergency Safety Support)", isCorrect: true },
      { text: "99999 (Private Ambulance Association)", isCorrect: false },
      { text: "100 (Postal Support)", isCorrect: false },
      { text: "105 (Railway Inquiry)", isCorrect: false },
    ],
    explanation:
      "The dedicated 24/7 National Emergency LPG Support Hotline is 16137, operational nationwide in partnership with Civil Defense.",
  },
];

export default function QuizContent({ courseId }) {
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
      <QuizHeader
        courseId={courseId}
        isSubmitted={isSubmitted}
        timeString={timeString}
      />

      {/* 2. Quiz Body */}
      <section className="relative z-20 -mt-6 mx-auto w-full max-w-3xl px-4 pb-20">
        {!isSubmitted ? (
          <QuizQuestionCard
            currentQuestionIdx={currentQuestionIdx}
            totalQuestions={QUIZ_QUESTIONS.length}
            currentQ={currentQ}
            selectedAnswers={selectedAnswers}
            handleSelectOption={handleSelectOption}
            handlePrev={handlePrev}
            handleNext={handleNext}
            handleSubmit={handleSubmit}
          />
        ) : (
          <QuizResultCard
            isPassed={isPassed}
            scorePercent={scorePercent}
            correctCount={correctCount}
            quizQuestions={QUIZ_QUESTIONS}
            selectedAnswers={selectedAnswers}
            courseId={courseId}
            handleRetake={handleRetake}
          />
        )}
      </section>
    </main>
  );
}
