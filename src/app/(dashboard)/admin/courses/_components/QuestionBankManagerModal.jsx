// src/app/(dashboard)/admin/courses/_components/QuestionBankManagerModal.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Settings,
  Layers,
  Save,
  Clock,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  useGetQuestionBankQuery,
  useAddQuestionToBankMutation,
  useUpdateQuestionInBankMutation,
  useDeleteQuestionFromBankMutation,
  useUpdateQuizSettingsMutation,
} from "@/redux/api/quizApi";

export default function QuestionBankManagerModal({
  isOpen,
  onClose,
  course,
}) {
  const courseId = course?.courseId || course?._id;

  const {
    data: bankData,
    isLoading,
    refetch,
  } = useGetQuestionBankQuery(courseId, { skip: !isOpen || !courseId });

  const [addQuestionToBank, { isLoading: isAdding }] = useAddQuestionToBankMutation();
  const [updateQuestionInBank, { isLoading: isUpdating }] = useUpdateQuestionInBankMutation();
  const [deleteQuestionFromBank, { isLoading: isDeleting }] = useDeleteQuestionFromBankMutation();
  const [updateQuizSettings, { isLoading: isSavingSettings }] = useUpdateQuizSettingsMutation();

  const quizConfig = bankData?.data || {};
  const questionBank = quizConfig.questionBank || [];

  // Active Tab: 'questions' | 'settings'
  const [activeTab, setActiveTab] = useState("questions");

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    title: "",
    durationMinutes: 15,
    passPercentage: 70,
    questionsPerQuiz: 20,
    cooldownMinutes: 15,
    timerEnabled: true,
    shuffleOptions: true,
  });

  useEffect(() => {
    if (quizConfig) {
      setSettingsForm({
        title: quizConfig.title || "LPG Safety Assessment Quiz",
        durationMinutes: quizConfig.durationMinutes || 15,
        passPercentage: quizConfig.passPercentage || 70,
        questionsPerQuiz: quizConfig.questionsPerQuiz || 20,
        cooldownMinutes: quizConfig.cooldownMinutes || 15,
        timerEnabled: quizConfig.timerEnabled ?? true,
        shuffleOptions: quizConfig.shuffleOptions ?? true,
      });
    }
  }, [quizConfig]);

  // Question editing / creation form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionFormData, setQuestionFormData] = useState({
    type: "single", // "single" | "multiple" | "true_false"
    question: "",
    questionBn: "",
    options: [
      { text: "", textBn: "", isCorrect: true },
      { text: "", textBn: "", isCorrect: false },
    ],
    explanation: "",
    explanationBn: "",
  });

  const handleOpenAddForm = () => {
    setEditingQuestionId(null);
    setQuestionFormData({
      type: "single",
      question: "",
      questionBn: "",
      options: [
        { text: "", textBn: "", isCorrect: true },
        { text: "", textBn: "", isCorrect: false },
        { text: "", textBn: "", isCorrect: false },
        { text: "", textBn: "", isCorrect: false },
      ],
      explanation: "",
      explanationBn: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (q) => {
    setEditingQuestionId(q.id || q._id);
    setQuestionFormData({
      type: q.type || "single",
      question: q.question || "",
      questionBn: q.questionBn || "",
      options:
        Array.isArray(q.options) && q.options.length > 0
          ? q.options.map((opt) => ({
            id: opt.id || opt._id,
            text: opt.text || "",
            textBn: opt.textBn || "",
            isCorrect: Boolean(opt.isCorrect),
          }))
          : [
            { text: "", textBn: "", isCorrect: true },
            { text: "", textBn: "", isCorrect: false },
          ],
      explanation: q.explanation || "",
      explanationBn: q.explanationBn || "",
    });
    setIsFormOpen(true);
  };

  const handleTypeChange = (newType) => {
    if (newType === "true_false") {
      setQuestionFormData((prev) => ({
        ...prev,
        type: newType,
        options: [
          { text: "True", textBn: "সত্য", isCorrect: true },
          { text: "False", textBn: "মিথ্যা", isCorrect: false },
        ],
      }));
    } else {
      setQuestionFormData((prev) => ({
        ...prev,
        type: newType,
        options:
          prev.options.length >= 2
            ? prev.options
            : [
              { text: "", textBn: "", isCorrect: true },
              { text: "", textBn: "", isCorrect: false },
            ],
      }));
    }
  };

  const handleOptionCorrectToggle = (optIdx) => {
    if (questionFormData.type === "multiple") {
      // Toggle checkbox
      setQuestionFormData((prev) => {
        const nextOpts = [...prev.options];
        nextOpts[optIdx].isCorrect = !nextOpts[optIdx].isCorrect;
        return { ...prev, options: nextOpts };
      });
    } else {
      // Single choice or true/false (radio behavior)
      setQuestionFormData((prev) => {
        const nextOpts = prev.options.map((opt, i) => ({
          ...opt,
          isCorrect: i === optIdx,
        }));
        return { ...prev, options: nextOpts };
      });
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionFormData.question.trim()) {
      toast.error("Please enter the question text");
      return;
    }

    const hasCorrect = questionFormData.options.some((o) => o.isCorrect);
    if (!hasCorrect) {
      toast.error("At least one option must be marked as correct");
      return;
    }

    try {
      if (editingQuestionId) {
        await updateQuestionInBank({
          courseId,
          questionId: editingQuestionId,
          data: questionFormData,
        }).unwrap();
        toast.success("Question updated successfully");
      } else {
        await addQuestionToBank({
          courseId,
          data: questionFormData,
        }).unwrap();
        toast.success("Question added to bank");
      }
      setIsFormOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save question");
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!confirm("Are you sure you want to remove this question from the question bank?")) return;
    try {
      await deleteQuestionFromBank({ courseId, questionId: qId }).unwrap();
      toast.success("Question removed from bank");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete question");
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateQuizSettings({
        courseId,
        data: settingsForm,
      }).unwrap();
      toast.success("Quiz settings updated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update quiz settings");
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={`Question Bank & Quiz Manager: ${course?.title || ""}`}
    >
      <div className="p-6 space-y-6">
        {/* Top Stats & Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("questions");
                setIsFormOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${activeTab === "questions"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Question Bank ({questionBank.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("settings");
                setIsFormOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${activeTab === "settings"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Assessment Rules & Timer</span>
            </button>
          </div>

          {activeTab === "questions" && !isFormOpen && (
            <Button
              type="button"
              size="sm"
              onClick={handleOpenAddForm}
              className="gap-1.5 text-xs font-bold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Question</span>
            </Button>
          )}
        </div>

        {/* TAB 1: QUESTION BANK LIST & FORM */}
        {activeTab === "questions" && (
          <div>
            {isFormOpen ? (
              <form onSubmit={handleSaveQuestion} className="space-y-4 rounded-xl border border-slate-200 p-5 bg-slate-50/50">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-sm text-slate-900">
                    {editingQuestionId ? "Edit Question" : "Create New Question"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* Question Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Question Type *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "single", label: "Single Choice" },
                      { id: "multiple", label: "Multiple Choice (Multi-select)" },
                      { id: "true_false", label: "True / False" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleTypeChange(t.id)}
                        className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${questionFormData.type === t.id
                            ? "border-primary bg-primary/10 text-primary shadow-2xs"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Question Text *"
                    required
                    value={questionFormData.question}
                    onChange={(e) =>
                      setQuestionFormData((prev) => ({ ...prev, question: e.target.value }))
                    }
                    placeholder="e.g. What is the safe clearance distance for LPG storage?"
                  />

                  <Input
                    label="প্রশ্নের বিবরণ"
                    value={questionFormData.questionBn}
                    onChange={(e) =>
                      setQuestionFormData((prev) => ({ ...prev, questionBn: e.target.value }))
                    }
                    placeholder="উদাঃ এলপিজি সিলিন্ডার মজুদের নিরাপদ দূরত্ব কত?"
                  />
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Answer Options (Check the correct answer) *
                    </label>
                    {questionFormData.type !== "true_false" && (
                      <button
                        type="button"
                        onClick={() =>
                          setQuestionFormData((prev) => ({
                            ...prev,
                            options: [
                              ...prev.options,
                              { text: "", textBn: "", isCorrect: false },
                            ],
                          }))
                        }
                        className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        + Add Another Option
                      </button>
                    )}
                  </div>

                  {questionFormData.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleOptionCorrectToggle(oIdx)}
                        className={`p-1.5 rounded-md border flex items-center justify-center shrink-0 cursor-pointer ${opt.isCorrect
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-100 text-slate-400 border-slate-300 hover:border-slate-400"
                          }`}
                        title="Mark as correct answer"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>

                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => {
                          const nextOpts = [...questionFormData.options];
                          nextOpts[oIdx].text = e.target.value;
                          setQuestionFormData((prev) => ({ ...prev, options: nextOpts }));
                        }}
                        placeholder={`Option ${oIdx + 1}`}
                        className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-primary"
                      />

                      <input
                        type="text"
                        value={opt.textBn || ""}
                        onChange={(e) => {
                          const nextOpts = [...questionFormData.options];
                          nextOpts[oIdx].textBn = e.target.value;
                          setQuestionFormData((prev) => ({ ...prev, options: nextOpts }));
                        }}
                        placeholder={`বিকল্প ${oIdx + 1}`}
                        className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded focus:outline-none focus:border-primary"
                      />

                      {questionFormData.type !== "true_false" && questionFormData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuestionFormData((prev) => ({
                              ...prev,
                              options: prev.options.filter((_, i) => i !== oIdx),
                            }));
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <Textarea
                    label="Explanation / SOP Reference"
                    rows={2}
                    value={questionFormData.explanation}
                    onChange={(e) =>
                      setQuestionFormData((prev) => ({ ...prev, explanation: e.target.value }))
                    }
                    placeholder="Explains why this answer is correct according to DoE standards..."
                  />

                  <Textarea
                    label="ব্যাখ্যার বিবরণ"
                    rows={2}
                    value={questionFormData.explanationBn}
                    onChange={(e) =>
                      setQuestionFormData((prev) => ({ ...prev, explanationBn: e.target.value }))
                    }
                    placeholder="বিস্ফোরক পরিদপ্তরের কোন ধারা বা নির্দেশিকা অনুযায়ী এটি সঠিক..."
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isAdding || isUpdating}
                  >
                    {isAdding || isUpdating ? "Saving..." : "Save Question"}
                  </Button>
                </div>
              </form>
            ) : questionBank.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                <HelpCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Question Bank is Empty</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Add questions to this course pool. The system will draw a random subset of questions on each student quiz attempt.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleOpenAddForm}
                  className="mt-4 gap-1.5 text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add First Question</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                {questionBank.map((q, idx) => {
                  const qId = q.id || q._id;
                  const qType = q.type || "single";
                  return (
                    <div
                      key={qId || idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="font-mono text-xs font-bold text-slate-400 shrink-0 mt-0.5">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-slate-900 leading-snug">
                                {q.question}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${qType === "multiple"
                                    ? "bg-purple-100 text-purple-700"
                                    : qType === "true_false"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                              >
                                {qType}
                              </span>
                            </div>
                            {q.questionBn && (
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {q.questionBn}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditForm(q)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Question"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(qId)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Question"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Options Preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-6 pt-1">
                        {q.options?.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 border ${opt.isCorrect
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-bold"
                                : "bg-slate-50 border-slate-200 text-slate-600"
                              }`}
                          >
                            {opt.isCorrect ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0" />
                            )}
                            <span className="truncate">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ASSESSMENT SETTINGS */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Assessment Title"
                value={settingsForm.title}
                onChange={(e) =>
                  setSettingsForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />

              <Input
                label="Random Questions Count per Quiz (e.g. 20 from pool)"
                type="number"
                min="1"
                value={settingsForm.questionsPerQuiz}
                onChange={(e) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    questionsPerQuiz: Number(e.target.value),
                  }))
                }
              />

              <Input
                label="Passing Score (%)"
                type="number"
                min="1"
                max="100"
                value={settingsForm.passPercentage}
                onChange={(e) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    passPercentage: Number(e.target.value),
                  }))
                }
              />

              <Input
                label="Quiz Duration (Minutes)"
                type="number"
                min="1"
                value={settingsForm.durationMinutes}
                onChange={(e) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    durationMinutes: Number(e.target.value),
                  }))
                }
              />

              <Input
                label="Failed Retry Cool-down (Minutes)"
                type="number"
                min="0"
                value={settingsForm.cooldownMinutes}
                onChange={(e) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    cooldownMinutes: Number(e.target.value),
                  }))
                }
              />
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.timerEnabled}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, timerEnabled: e.target.checked }))
                  }
                  className="rounded border-slate-300 text-primary"
                />
                <span>Enable Countdown Timer with automatic submit on expiry</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.shuffleOptions}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, shuffleOptions: e.target.checked }))
                  }
                  className="rounded border-slate-300 text-primary"
                />
                <span>Shuffle answer options on every quiz attempt (Anti-cheat)</span>
              </label>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-200">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSavingSettings}
                className="gap-2 font-bold"
              >
                <Save className="h-4 w-4" />
                <span>{isSavingSettings ? "Saving Settings..." : "Save Quiz Rules"}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </Dialog>
  );
}
