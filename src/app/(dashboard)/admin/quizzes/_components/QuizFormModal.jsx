// src/app/(dashboard)/admin/quizzes/_components/QuizFormModal.jsx
"use client";

import { useState } from "react";
import { FaPlus, FaTrash, FaCheck, FaQuestionCircle } from "react-icons/fa";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

function Label({ children, className = "", ...props }) {
  return (
    <label
      className={`block text-xs font-semibold text-slate-700 mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

export default function QuizFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  formData,
  setFormData,
  isEditing,
  courses = [],
}) {
  const [activeQuestionTab, setActiveQuestionTab] = useState(0);

  const handleAddQuestion = () => {
    const newQ = {
      id: (formData.questions?.length || 0) + 1,
      question: "",
      questionBn: "",
      explanation: "",
      explanationBn: "",
      options: [
        { text: "", textBn: "", isCorrect: true },
        { text: "", textBn: "", isCorrect: false },
        { text: "", textBn: "", isCorrect: false },
        { text: "", textBn: "", isCorrect: false },
      ],
    };
    setFormData((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), newQ],
    }));
    setActiveQuestionTab((formData.questions?.length || 0));
  };

  const handleRemoveQuestion = (idx) => {
    if ((formData.questions?.length || 0) <= 1) return;
    setFormData((prev) => {
      const nextQ = prev.questions.filter((_, i) => i !== idx);
      return {
        ...prev,
        questions: nextQ.map((q, i) => ({ ...q, id: i + 1 })),
      };
    });
    if (activeQuestionTab >= idx && activeQuestionTab > 0) {
      setActiveQuestionTab((prev) => prev - 1);
    }
  };

  const handleUpdateQuestion = (idx, field, value) => {
    setFormData((prev) => {
      const nextQ = [...(prev.questions || [])];
      nextQ[idx] = { ...nextQ[idx], [field]: value };
      return { ...prev, questions: nextQ };
    });
  };

  const handleUpdateOption = (qIdx, optIdx, field, value) => {
    setFormData((prev) => {
      const nextQ = [...(prev.questions || [])];
      const nextOpts = [...nextQ[qIdx].options];
      nextOpts[optIdx] = { ...nextOpts[optIdx], [field]: value };
      nextQ[qIdx] = { ...nextQ[qIdx], options: nextOpts };
      return { ...prev, questions: nextQ };
    });
  };

  const handleSetCorrectOption = (qIdx, optIdx) => {
    setFormData((prev) => {
      const nextQ = [...(prev.questions || [])];
      const nextOpts = nextQ[qIdx].options.map((opt, i) => ({
        ...opt,
        isCorrect: i === optIdx,
      }));
      nextQ[qIdx] = { ...nextQ[qIdx], options: nextOpts };
      return { ...prev, questions: nextQ };
    });
  };

  const currentQ = formData.questions?.[activeQuestionTab] || null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={isEditing ? "Edit Course Assessment Quiz" : "Create New Course Assessment Quiz"}
      description="Configure dynamic assessment questions for course completion & certificate evaluation."
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Top: Course & Quiz Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 pb-5">
          <Select
            label="Target Course"
            required
            placeholder="Select Course..."
            searchPlaceholder="Search courses..."
            value={formData.courseId || ""}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
            options={courses.map((c) => ({
              value: c.courseId,
              label: `[ID: ${c.courseId}] ${c.title}`,
            }))}
          />

          <div>
            <Label className="text-xs font-semibold text-slate-700">Duration (Minutes)</Label>
            <Input
              type="number"
              min="1"
              max="180"
              value={formData.durationMinutes || 10}
              onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-700">Pass Percentage (%)</Label>
            <Input
              type="number"
              min="10"
              max="100"
              value={formData.passPercentage || 80}
              onChange={(e) => setFormData({ ...formData, passPercentage: Number(e.target.value) })}
              className="mt-1"
            />
          </div>
        </div>

        {/* Bilingual Quiz Titles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-semibold text-slate-700">Quiz Title *</Label>
            <Input
              placeholder="e.g. LPG Safety Assessment Quiz"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-700">কুইজের শিরোনাম *</Label>
            <Input
              placeholder="যেমন: এলপিজি নিরাপত্তা মূল্যায়ন কুইজ"
              value={formData.titleBn || ""}
              onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
              required
              className="mt-1 font-serif"
            />
          </div>
        </div>

        {/* Questions Manager */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FaQuestionCircle className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Questions ({formData.questions?.length || 0})
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddQuestion}
              className="h-7 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/5"
            >
              <FaPlus className="h-3 w-3 mr-1" />
              Add Question
            </Button>
          </div>

          {/* Question Tabs Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {(formData.questions || []).map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveQuestionTab(idx)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  activeQuestionTab === idx
                    ? "bg-primary text-white shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Q{idx + 1}
              </button>
            ))}
          </div>

          {/* Active Question Editor */}
          {currentQ ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-slate-800 uppercase">
                  Editing Question #{activeQuestionTab + 1}
                </span>
                {(formData.questions?.length || 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(activeQuestionTab)}
                    className="flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-700"
                  >
                    <FaTrash className="h-3 w-3" />
                    <span>Delete Question</span>
                  </button>
                )}
              </div>

              {/* Question Text EN & BN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-semibold text-slate-600">
                    Question *
                  </Label>
                  <textarea
                    rows={2}
                    value={currentQ.question || ""}
                    onChange={(e) =>
                      handleUpdateQuestion(activeQuestionTab, "question", e.target.value)
                    }
                    placeholder="Enter question in English..."
                    required
                    className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 shadow-2xs focus:border-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-slate-600">
                    প্রশ্ন *
                  </Label>
                  <textarea
                    rows={2}
                    value={currentQ.questionBn || ""}
                    onChange={(e) =>
                      handleUpdateQuestion(activeQuestionTab, "questionBn", e.target.value)
                    }
                    placeholder="বাংলায় প্রশ্ন লিখুন..."
                    required
                    className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 shadow-2xs focus:border-primary focus:outline-hidden font-serif"
                  />
                </div>
              </div>

              {/* 4 Multiple Choice Options */}
              <div className="space-y-2.5 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Multiple Choice Options (Select the checkmark for the correct answer)
                </div>

                {(currentQ.options || []).map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className={`flex items-center gap-2 rounded-lg border p-2.5 transition-colors ${
                      opt.isCorrect
                        ? "border-emerald-300 bg-emerald-50/50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSetCorrectOption(activeQuestionTab, optIdx)}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${
                        opt.isCorrect
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                          : "border-slate-300 bg-white text-slate-400 hover:border-emerald-400"
                      }`}
                      title={opt.isCorrect ? "Correct answer" : "Mark as correct"}
                    >
                      <FaCheck className="h-3 w-3" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                      <Input
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt.text || ""}
                        onChange={(e) =>
                          handleUpdateOption(activeQuestionTab, optIdx, "text", e.target.value)
                        }
                        required
                        className="text-xs h-8"
                      />
                      <Input
                        placeholder={`বিকল্প ${optIdx + 1}`}
                        value={opt.textBn || ""}
                        onChange={(e) =>
                          handleUpdateOption(activeQuestionTab, optIdx, "textBn", e.target.value)
                        }
                        required
                        className="text-xs h-8 font-serif"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <Label className="text-[11px] font-semibold text-slate-600">
                    Explanation
                  </Label>
                  <Input
                    placeholder="Why this answer is correct..."
                    value={currentQ.explanation || ""}
                    onChange={(e) =>
                      handleUpdateQuestion(activeQuestionTab, "explanation", e.target.value)
                    }
                    className="mt-1 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-slate-600">
                    ব্যাখ্যা
                  </Label>
                  <Input
                    placeholder="সঠিক উত্তরের ব্যাখ্যা..."
                    value={currentQ.explanationBn || ""}
                    onChange={(e) =>
                      handleUpdateQuestion(activeQuestionTab, "explanationBn", e.target.value)
                    }
                    className="mt-1 text-xs font-serif"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              No questions added yet. Click &quot;Add Question&quot; above.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isSubmitting}
          >
            {isEditing ? "Save Changes" : "Create Assessment Quiz"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
