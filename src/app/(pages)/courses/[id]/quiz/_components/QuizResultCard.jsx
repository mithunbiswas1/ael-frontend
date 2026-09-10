import Link from "next/link";
import { CheckCircle2, XCircle, Award, RotateCcw } from "lucide-react";

export default function QuizResultCard({
  isPassed,
  scorePercent,
  correctCount,
  quizQuestions,
  selectedAnswers,
  courseId,
  handleRetake,
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-8 shadow-md">
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
              {correctCount} of {quizQuestions.length}
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
            <span>View &amp; Verify Your Certificate</span>
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
          {quizQuestions.map((q, idx) => {
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
  );
}
