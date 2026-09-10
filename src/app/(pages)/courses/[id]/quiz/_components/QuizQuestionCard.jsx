import { ChevronLeft, ChevronRight, Award } from "lucide-react";

export default function QuizQuestionCard({
  currentQuestionIdx,
  totalQuestions,
  currentQ,
  selectedAnswers,
  handleSelectOption,
  handlePrev,
  handleNext,
  handleSubmit,
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-8 shadow-2xs">
      {/* Question Counter Progress */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 text-xs font-bold text-slate-600">
        <span className="text-primary font-black uppercase tracking-wider">
          Question {currentQuestionIdx + 1} of {totalQuestions}
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
              className={`w-full text-left p-3.5 sm:p-4 rounded-lg border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${
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
      <div className="flex items-center justify-between border-t border-slate-100 pt-6 gap-2">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIdx === 0}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 sm:px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {currentQuestionIdx === totalQuestions - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 sm:px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Award className="h-4 w-4" />
            <span>Submit Quiz</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1 rounded-lg bg-primary px-3.5 sm:px-5 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
