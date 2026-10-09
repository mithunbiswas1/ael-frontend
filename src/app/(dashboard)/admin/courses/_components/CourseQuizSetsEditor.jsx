// src/app/(dashboard)/admin/courses/_components/CourseQuizSetsEditor.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  HelpCircle,
  Plus,
  Trash2,
  Save,
  Clock,
  CheckCircle2,
  Layers,
  Settings,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import {
  useGetAdminQuizFullQuery,
  useSaveQuizSetsMutation,
} from "@/redux/api/quizApi";

export default function CourseQuizSetsEditor({ courseId, courseTitle }) {
  const {
    data: quizFullData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminQuizFullQuery(courseId, {
    skip: !courseId,
  });

  const [saveQuizSets, { isLoading: isSaving }] = useSaveQuizSetsMutation();

  const [quizSettings, setQuizSettings] = useState({
    title: "LPG Safety Assessment Quiz",
    titleBn: "এলপিজি নিরাপত্তা মূল্যায়ন কুইজ",
    durationMinutes: 15,
    passPercentage: 70,
    timerEnabled: true,
    shuffleOptions: true,
    cooldownMinutes: 0,
  });

  const [questionSets, setQuestionSets] = useState([
    {
      setId: "set_1",
      setName: "Set 1",
      setNameBn: "সেট ১",
      description: "",
      questions: [],
    },
  ]);

  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [expandedQuestionMap, setExpandedQuestionMap] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Sync data when loaded
  useEffect(() => {
    if (quizFullData?.data) {
      const q = quizFullData.data;
      setQuizSettings({
        title: q.title || "LPG Safety Assessment Quiz",
        titleBn: q.titleBn || "এলপিজি নিরাপত্তা মূল্যায়ন কুইজ",
        durationMinutes: q.durationMinutes !== undefined ? q.durationMinutes : 15,
        passPercentage: q.passPercentage !== undefined ? q.passPercentage : 70,
        timerEnabled: q.timerEnabled ?? true,
        shuffleOptions: q.shuffleOptions ?? true,
        cooldownMinutes: q.cooldownMinutes !== undefined ? q.cooldownMinutes : 0,
      });

      if (Array.isArray(q.questionSets) && q.questionSets.length > 0) {
        setQuestionSets(
          q.questionSets.map((s, idx) => ({
            setId: s.setId || `set_${idx + 1}`,
            setName: s.setName || `Set ${idx + 1}`,
            setNameBn: s.setNameBn || `সেট ${idx + 1}`,
            description: s.description || "",
            questions: Array.isArray(s.questions)
              ? s.questions.map((question, qIdx) => ({
                  id: question.id || `q_${qIdx + 1}`,
                  question: question.question || "",
                  questionBn: question.questionBn || "",
                  type: question.type || "single",
                  options: Array.isArray(question.options) && question.options.length > 0
                    ? question.options.map((opt, oIdx) => ({
                        id: opt.id || `opt_${oIdx + 1}`,
                        text: opt.text || "",
                        textBn: opt.textBn || "",
                        isCorrect: Boolean(opt.isCorrect),
                      }))
                    : [
                        { id: "opt_1", text: "", textBn: "", isCorrect: true },
                        { id: "opt_2", text: "", textBn: "", isCorrect: false },
                      ],
                  explanation: question.explanation || "",
                  explanationBn: question.explanationBn || "",
                  points: question.points || 1,
                }))
              : [],
          }))
        );
      }
    }
  }, [quizFullData]);

  const activeSet = questionSets[activeSetIndex] || questionSets[0];

  // Add a new set
  const handleAddSet = () => {
    const newIndex = questionSets.length + 1;
    const newSet = {
      setId: `set_${Date.now()}`,
      setName: `Set ${newIndex}`,
      setNameBn: `সেট ${newIndex}`,
      description: "",
      questions: [
        {
          id: `q_${Date.now()}_1`,
          question: "",
          questionBn: "",
          type: "single",
          options: [
            { id: `opt_${Date.now()}_1`, text: "", textBn: "", isCorrect: true },
            { id: `opt_${Date.now()}_2`, text: "", textBn: "", isCorrect: false },
          ],
          explanation: "",
          explanationBn: "",
          points: 1,
        },
      ],
    };

    setQuestionSets((prev) => [...prev, newSet]);
    setActiveSetIndex(questionSets.length);
    toast.success(`Set ${newIndex} added successfully!`);
  };

  // Prompt delete set (opens confirmation modal)
  const promptDeleteSet = (indexToDelete) => {
    if (questionSets.length <= 1) {
      toast.error("At least one question set must remain.");
      return;
    }
    const setName = questionSets[indexToDelete]?.setName || `Set ${indexToDelete + 1}`;
    setDeleteTarget({
      type: "set",
      index: indexToDelete,
      itemTitle: setName,
      title: "Delete Question Set",
      description: `Are you sure you want to delete "${setName}"? All questions in this set will be permanently removed.`,
      confirmText: "Delete Set",
    });
  };

  // Prompt delete question (opens confirmation modal)
  const promptDeleteQuestion = (qIndex) => {
    const qObj = activeSet?.questions?.[qIndex];
    const preview = qObj?.question?.trim()
      ? (qObj.question.length > 55 ? `${qObj.question.slice(0, 55)}...` : qObj.question)
      : `Question #${qIndex + 1}`;

    setDeleteTarget({
      type: "question",
      qIndex,
      itemTitle: preview,
      title: "Delete Question",
      description: "Are you sure you want to remove this question from this set? This action cannot be undone.",
      confirmText: "Delete Question",
    });
  };

  // Confirm delete from modal
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "set") {
      const { index, itemTitle } = deleteTarget;
      setQuestionSets((prev) => prev.filter((_, idx) => idx !== index));
      if (activeSetIndex >= index && activeSetIndex > 0) {
        setActiveSetIndex(activeSetIndex - 1);
      }
      toast.success(`${itemTitle} deleted.`);
    } else if (deleteTarget.type === "question") {
      const { qIndex } = deleteTarget;
      setQuestionSets((prev) => {
        const updated = [...prev];
        const targetQuestions = updated[activeSetIndex]?.questions?.filter(
          (_, idx) => idx !== qIndex
        );
        updated[activeSetIndex] = {
          ...updated[activeSetIndex],
          questions: targetQuestions,
        };
        return updated;
      });
      toast.success("Question deleted.");
    }

    setDeleteTarget(null);
  };

  // Update set header (name, bn name)
  const handleUpdateActiveSetField = (field, value) => {
    setQuestionSets((prev) => {
      const updated = [...prev];
      updated[activeSetIndex] = {
        ...updated[activeSetIndex],
        [field]: value,
      };
      return updated;
    });
  };

  // Add question to active set
  const handleAddQuestionToActiveSet = () => {
    const qCount = (activeSet?.questions?.length || 0) + 1;
    const newQ = {
      id: `q_${Date.now()}`,
      question: "",
      questionBn: "",
      type: "single",
      options: [
        { id: `opt_${Date.now()}_1`, text: "", textBn: "", isCorrect: true },
        { id: `opt_${Date.now()}_2`, text: "", textBn: "", isCorrect: false },
        { id: `opt_${Date.now()}_3`, text: "", textBn: "", isCorrect: false },
        { id: `opt_${Date.now()}_4`, text: "", textBn: "", isCorrect: false },
      ],
      explanation: "",
      explanationBn: "",
      points: 1,
    };

    setQuestionSets((prev) => {
      const updated = [...prev];
      const targetQuestions = [...(updated[activeSetIndex]?.questions || [])];
      targetQuestions.push(newQ);
      updated[activeSetIndex] = {
        ...updated[activeSetIndex],
        questions: targetQuestions,
      };
      return updated;
    });

    // Expand the newly added question
    setExpandedQuestionMap((prev) => ({
      ...prev,
      [`${activeSetIndex}_${(activeSet?.questions?.length || 0)}`]: true,
    }));

    toast.success(`Question #${qCount} added to ${activeSet?.setName || "Set"}`);
  };



  // Update question field
  const handleUpdateQuestion = (qIndex, field, value) => {
    setQuestionSets((prev) => {
      const updated = [...prev];
      const targetQuestions = [...(updated[activeSetIndex]?.questions || [])];
      targetQuestions[qIndex] = {
        ...targetQuestions[qIndex],
        [field]: value,
      };
      updated[activeSetIndex] = {
        ...updated[activeSetIndex],
        questions: targetQuestions,
      };
      return updated;
    });
  };

  // Update option in question
  const handleUpdateOption = (qIndex, optIndex, field, value) => {
    setQuestionSets((prev) => {
      const updated = [...prev];
      const targetQuestions = [...(updated[activeSetIndex]?.questions || [])];
      const q = { ...targetQuestions[qIndex] };
      const opts = [...(q.options || [])];
      opts[optIndex] = {
        ...opts[optIndex],
        [field]: value,
      };
      q.options = opts;
      targetQuestions[qIndex] = q;
      updated[activeSetIndex] = {
        ...updated[activeSetIndex],
        questions: targetQuestions,
      };
      return updated;
    });
  };

  // Set correct answer (radio for single / true_false, checkbox for multiple)
  const handleSelectCorrectOption = (qIndex, optIndex) => {
    setQuestionSets((prev) => {
      const updated = [...prev];
      const targetQuestions = [...(updated[activeSetIndex]?.questions || [])];
      const q = { ...targetQuestions[qIndex] };
      const opts = (q.options || []).map((opt, idx) => {
        if (q.type === "multiple") {
          return idx === optIndex ? { ...opt, isCorrect: !opt.isCorrect } : opt;
        } else {
          return { ...opt, isCorrect: idx === optIndex };
        }
      });
      q.options = opts;
      targetQuestions[qIndex] = q;
      updated[activeSetIndex] = {
        ...updated[activeSetIndex],
        questions: targetQuestions,
      };
      return updated;
    });
  };

  // Add option to question
  const handleAddOptionToQuestion = (qIndex) => {
    setQuestionSets((prev) => {
      const updated = [...prev];
      const targetQuestions = [...(updated[activeSetIndex]?.questions || [])];
      const q = { ...targetQuestions[qIndex] };
      const opts = [...(q.options || [])];
      opts.push({
        id: `opt_${Date.now()}_${opts.length + 1}`,
        text: "",
        textBn: "",
        isCorrect: false,
      });
      q.options = opts;
      targetQuestions[qIndex] = q;
      updated[activeSetIndex] = {
        ...updated[activeSetIndex],
        questions: targetQuestions,
      };
      return updated;
    });
  };

  // Remove option from question
  const handleRemoveOptionFromQuestion = (qIndex, optIndex) => {
    setQuestionSets((prev) => {
      const updated = [...prev];
      const targetQuestions = [...(updated[activeSetIndex]?.questions || [])];
      const q = { ...targetQuestions[qIndex] };
      if (q.options?.length <= 2) {
        toast.error("A question must have at least 2 options.");
        return prev;
      }
      const opts = q.options.filter((_, idx) => idx !== optIndex);
      q.options = opts;
      targetQuestions[qIndex] = q;
      updated[activeSetIndex] = {
        ...updated[activeSetIndex],
        questions: targetQuestions,
      };
      return updated;
    });
  };

  // Toggle question accordion
  const toggleQuestionAccordion = (key) => {
    setExpandedQuestionMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Save all quiz sets & settings
  const handleSaveAll = async () => {
    if (!courseId) {
      toast.error("Please save the course first before configuring quiz sets.");
      return;
    }

    // Validation: Ensure questions have questions and options
    for (let sIdx = 0; sIdx < questionSets.length; sIdx++) {
      const set = questionSets[sIdx];
      if (set.questions.length === 0) {
        toast.warning(`${set.setName || `Set ${sIdx + 1}`} has no questions. Please add at least 1 question.`);
      }
    }

    try {
      const payload = {
        title: quizSettings.title,
        titleBn: quizSettings.titleBn,
        durationMinutes: Number(quizSettings.durationMinutes) || 15,
        passPercentage: Number(quizSettings.passPercentage) || 70,
        timerEnabled: Boolean(quizSettings.timerEnabled),
        shuffleOptions: Boolean(quizSettings.shuffleOptions),
        cooldownMinutes: Number(quizSettings.cooldownMinutes) || 0,
        questionSets: questionSets.map((s, idx) => ({
          setId: s.setId,
          setName: s.setName?.trim() || `Set ${idx + 1}`,
          setNameBn: s.setNameBn?.trim() || `সেট ${idx + 1}`,
          description: s.description || "",
          questions: (s.questions || []).map((q) => ({
            id: q.id,
            question: q.question?.trim() || q.questionBn?.trim() || "Question",
            questionBn: q.questionBn?.trim() || q.question?.trim() || "প্রশ্ন",
            type: q.type || "single",
            options: (q.options || []).map((opt) => ({
              id: opt.id,
              text: opt.text?.trim() || opt.textBn?.trim() || "",
              textBn: opt.textBn?.trim() || opt.text?.trim() || "",
              isCorrect: Boolean(opt.isCorrect),
            })),
            explanation: q.explanation?.trim() || "",
            explanationBn: q.explanationBn?.trim() || "",
            points: Number(q.points) || 1,
          })),
        })),
      };

      await saveQuizSets({ courseId, data: payload }).unwrap();
      toast.success("All Question Sets & assessment settings saved successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save quiz sets");
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-3 text-xs text-slate-500 font-semibold">Loading Question Sets configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Final Assessment Question Sets
            </h2>
            <Badge variant="pill-secondary" size="xs">
              {questionSets.length} {questionSets.length === 1 ? "Set" : "Sets"}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Create multiple Question Sets (Set 1, Set 2, Set 3...). When a student takes the final exam, the system randomly serves one unattempted set. If they fail, their retake exam will dynamically pick another question set.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSaveAll}
          isLoading={isSaving}
          variant="primary"
          size="sm"
          icon={Save}
        >
          <span>Save Question Sets</span>
        </Button>
      </div>

      {/* Global Assessment Settings Accordion / Card */}
      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Settings className="h-4 w-4 text-primary" />
          <span>General Exam Rules & Parameters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Quiz Title</label>
            <Input
              value={quizSettings.title}
              onChange={(e) => setQuizSettings((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. LPG Safety Assessment"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">কুইজ টাইটেল</label>
            <Input
              value={quizSettings.titleBn}
              onChange={(e) => setQuizSettings((prev) => ({ ...prev, titleBn: e.target.value }))}
              placeholder="যেমন: এলপিজি নিরাপত্তা মূল্যায়ন কুইজ"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Duration (Minutes)</label>
            <Input
              type="number"
              min="1"
              max="180"
              value={quizSettings.durationMinutes}
              onChange={(e) => setQuizSettings((prev) => ({ ...prev, durationMinutes: Number(e.target.value) }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Pass Percentage (%)</label>
            <Input
              type="number"
              min="10"
              max="100"
              value={quizSettings.passPercentage}
              onChange={(e) => setQuizSettings((prev) => ({ ...prev, passPercentage: Number(e.target.value) }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Retake Cooldown (Minutes)</label>
            <Input
              type="number"
              min="0"
              max="1440"
              value={quizSettings.cooldownMinutes}
              onChange={(e) => setQuizSettings((prev) => ({ ...prev, cooldownMinutes: Number(e.target.value) }))}
              placeholder="0 = Immediate retake"
            />
            <p className="text-[10px] text-slate-400">Set 0 to let student retake immediately with another set</p>
          </div>

          <div className="flex items-center gap-4 pt-5">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={quizSettings.timerEnabled}
                onChange={(e) => setQuizSettings((prev) => ({ ...prev, timerEnabled: e.target.checked }))}
                className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span>Timer Countdown</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={quizSettings.shuffleOptions}
                onChange={(e) => setQuizSettings((prev) => ({ ...prev, shuffleOptions: e.target.checked }))}
                className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span>Shuffle Options</span>
            </label>
          </div>
        </div>
      </div>

      {/* QUESTION SETS TAB BAR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
          {/* Sets tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {questionSets.map((set, idx) => {
              const isActive = idx === activeSetIndex;
              const qCount = set.questions?.length || 0;
              return (
                <button
                  key={set.setId || idx}
                  type="button"
                  onClick={() => setActiveSetIndex(idx)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <Layers className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{set.setName || `Set ${idx + 1}`}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {qCount} Qs
                  </span>
                </button>
              );
            })}

            {/* + Add Set Button */}
            <Button
              type="button"
              onClick={handleAddSet}
              variant="outline"
              size="xs"
              icon={Plus}
              className="border-dashed border-primary/40 text-primary hover:bg-primary/5"
            >
              <span>+ Add Question Set</span>
            </Button>
          </div>

          {/* Delete active set button */}
          {questionSets.length > 1 && (
            <Button
              type="button"
              onClick={() => promptDeleteSet(activeSetIndex)}
              variant="danger"
              size="xs"
              icon={Trash2}
            >
              <span>Delete {activeSet?.setName || "Set"}</span>
            </Button>
          )}
        </div>

        {/* ACTIVE SET CARD */}
        {activeSet && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-2xs">
            {/* Set info row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Set Label / Title
                </label>
                <Input
                  value={activeSet.setName || ""}
                  onChange={(e) => handleUpdateActiveSetField("setName", e.target.value)}
                  placeholder="e.g. Set 1 or Assessment Set A"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  সেট লেবেল / টাইটেল
                </label>
                <Input
                  value={activeSet.setNameBn || ""}
                  onChange={(e) => handleUpdateActiveSetField("setNameBn", e.target.value)}
                  placeholder="যেমন: সেট ১"
                />
              </div>
            </div>

            {/* Questions in active set */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Questions in {activeSet.setName || "this set"}
                  </h3>
                  <Badge variant="pill-primary" size="xs">
                    {activeSet.questions?.length || 0} Questions
                  </Badge>
                </div>

                <Button
                  type="button"
                  onClick={handleAddQuestionToActiveSet}
                  variant="primary"
                  size="xs"
                  icon={Plus}
                >
                  <span>Add Question to {activeSet.setName || "Set"}</span>
                </Button>
              </div>

              {activeSet.questions?.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <HelpCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No questions in this set yet</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click &quot;Add Question to {activeSet.setName}&quot; to create your first assessment question.
                  </p>
                  <Button
                    type="button"
                    onClick={handleAddQuestionToActiveSet}
                    variant="outline"
                    size="xs"
                    icon={Plus}
                    className="mt-3"
                  >
                    <span>+ Add First Question</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeSet.questions.map((q, qIdx) => {
                    const accKey = `${activeSetIndex}_${qIdx}`;
                    const isExpanded = expandedQuestionMap[accKey] !== false; // expanded by default

                    return (
                      <div
                        key={q.id || qIdx}
                        className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all hover:border-slate-300"
                      >
                        {/* Question Accordion Header */}
                        <div
                          onClick={() => toggleQuestionAccordion(accKey)}
                          className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer select-none border-b border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-[11px]">
                              {qIdx + 1}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                                {q.question || q.questionBn || `Question #${qIdx + 1}`}
                              </p>
                              {q.questionBn && (
                                <p className="text-[10px] text-slate-500 line-clamp-1 font-serif">
                                  {q.questionBn}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 text-slate-600 font-semibold uppercase">
                              {q.type || "single"}
                            </span>

                            <Button
                              type="button"
                              variant="danger-soft"
                              size="icon-xs"
                              onClick={() => promptDeleteQuestion(qIdx)}
                              title="Delete Question"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>

                            <button
                              type="button"
                              onClick={() => toggleQuestionAccordion(accKey)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Question Accordion Body */}
                        {isExpanded && (
                          <div className="p-4 space-y-4 bg-white">
                            {/* Question prompts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700">
                                  Question *
                                </label>
                                <Input
                                  value={q.question || ""}
                                  onChange={(e) => handleUpdateQuestion(qIdx, "question", e.target.value)}
                                  placeholder="e.g. What is the safe storage distance for LPG cylinders?"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700">
                                  প্রশ্ন
                                </label>
                                <Input
                                  value={q.questionBn || ""}
                                  onChange={(e) => handleUpdateQuestion(qIdx, "questionBn", e.target.value)}
                                  placeholder="যেমন: এলপিজি সিলিন্ডার নিরাপদে রাখার সঠিক দূরত্ব কত?"
                                />
                              </div>
                            </div>

                            {/* Question Type & Points */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700">
                                  Question Type
                                </label>
                                <select
                                  value={q.type || "single"}
                                  onChange={(e) => handleUpdateQuestion(qIdx, "type", e.target.value)}
                                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                                >
                                  <option value="single">Single Choice (1 Correct Option)</option>
                                  <option value="multiple">Multiple Choice (Multiple Correct)</option>
                                  <option value="true_false">True / False</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700">Points</label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={q.points || 1}
                                  onChange={(e) => handleUpdateQuestion(qIdx, "points", Number(e.target.value))}
                                />
                              </div>
                            </div>

                            {/* Options List */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <span>Options & Correct Answer</span>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    (Click radio/checkbox to set correct answer)
                                  </span>
                                </label>

                                <button
                                  type="button"
                                  onClick={() => handleAddOptionToQuestion(qIdx)}
                                  className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                                >
                                  + Add Option
                                </button>
                              </div>

                              <div className="space-y-2.5">
                                {(q.options || []).map((opt, oIdx) => (
                                  <div
                                    key={opt.id || oIdx}
                                    className={`flex items-start gap-2 p-2 rounded-xl border transition-colors ${
                                      opt.isCorrect
                                        ? "bg-emerald-50/60 border-emerald-300"
                                        : "bg-slate-50/50 border-slate-200"
                                    }`}
                                  >
                                    {/* Selection radio/checkbox */}
                                    <div className="pt-2.5 pl-1">
                                      <input
                                        type={q.type === "multiple" ? "checkbox" : "radio"}
                                        name={`correct_${q.id || qIdx}`}
                                        checked={Boolean(opt.isCorrect)}
                                        onChange={() => handleSelectCorrectOption(qIdx, oIdx)}
                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 rounded cursor-pointer"
                                      />
                                    </div>

                                    {/* Option EN */}
                                    <div className="flex-1 space-y-1">
                                      <Input
                                        value={opt.text || ""}
                                        onChange={(e) => handleUpdateOption(qIdx, oIdx, "text", e.target.value)}
                                        placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                        className="text-xs py-1.5"
                                      />
                                    </div>

                                    {/* Option BN */}
                                    <div className="flex-1 space-y-1">
                                      <Input
                                        value={opt.textBn || ""}
                                        onChange={(e) => handleUpdateOption(qIdx, oIdx, "textBn", e.target.value)}
                                        placeholder={`অপশন ${String.fromCharCode(65 + oIdx)}`}
                                        className="text-xs py-1.5 font-serif"
                                      />
                                    </div>

                                    {/* Remove option button */}
                                    {q.options.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveOptionFromQuestion(qIdx, oIdx)}
                                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                        title="Remove Option"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Explanation (Optional) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-600">
                                  Explanation
                                </label>
                                <Textarea
                                  rows={2}
                                  value={q.explanation || ""}
                                  onChange={(e) => handleUpdateQuestion(qIdx, "explanation", e.target.value)}
                                  placeholder="Explain why this answer is correct..."
                                  className="text-xs"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-600">
                                  ব্যাখ্যা
                                </label>
                                <Textarea
                                  rows={2}
                                  value={q.explanationBn || ""}
                                  onChange={(e) => handleUpdateQuestion(qIdx, "explanationBn", e.target.value)}
                                  placeholder="সঠিক উত্তরের ব্যাখ্যা লিখুন..."
                                  className="text-xs font-serif"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom save bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                type="button"
                onClick={handleAddQuestionToActiveSet}
                variant="outline"
                size="sm"
                icon={Plus}
              >
                <span>Add Another Question</span>
              </Button>

              <Button
                type="button"
                onClick={handleSaveAll}
                isLoading={isSaving}
                variant="primary"
                size="sm"
                icon={Save}
              >
                <span>Save Question Sets</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.title || "Confirm Deletion"}
        description={deleteTarget?.description || "Are you sure you want to permanently delete this item? This action cannot be undone."}
        itemTitle={deleteTarget?.itemTitle || ""}
        confirmText={deleteTarget?.confirmText || "Delete Permanently"}
      />
    </div>
  );
}
