// src/app/(dashboard)/admin/quizzes/page.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FaPlus, FaQuestionCircle, FaSearch } from "react-icons/fa";
import {
  useGetAllQuizzesQuery,
  useSaveQuizMutation,
  useDeleteQuizMutation,
} from "@/redux/api/quizApi";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import { Button } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import Input from "@/components/ui/Input";
import { H2, P } from "@/components/ui/Typography";
import QuizTable from "./_components/QuizTable";
import QuizFormModal from "./_components/QuizFormModal";

const INITIAL_FORM = {
  courseId: "",
  title: "LPG Safety Assessment Quiz",
  titleBn: "এলপিজি নিরাপত্তা মূল্যায়ন কুইজ",
  durationMinutes: 10,
  passPercentage: 80,
  questions: [
    {
      id: 1,
      question: "What is the primary action if an LPG smell is detected indoors?",
      questionBn: "ঘরে এলপিজি গ্যাসের গন্ধ পেলে প্রাথমিক করণীয় কী?",
      explanation: "Ventilating immediately prevents flammable gas concentration.",
      explanationBn: "তাৎক্ষণিক বাতাস চলাচলের ব্যবস্থা করলে গ্যাস ঘন হতে পারে না।",
      options: [
        { text: "Open all doors and windows immediately", textBn: "তাৎক্ষণিক সকল দরজা ও জানালা খুলে দিন", isCorrect: true },
        { text: "Turn on the exhaust fan", textBn: "এক্সহস্ট ফ্যান চালু করুন", isCorrect: false },
        { text: "Light a candle to locate leak", textBn: "মোমবাতি জ্বালিয়ে লিকেজ খুঁজুন", isCorrect: false },
        { text: "Spray water over regulator", textBn: "রেগুলেটরে পানি স্প্রে করুন", isCorrect: false },
      ],
    },
  ],
};

export default function AdminQuizzesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: quizzesData, isLoading, refetch } = useGetAllQuizzesQuery();
  const { data: coursesData } = useGetCoursesQuery({});

  const [saveQuiz, { isLoading: isSaving }] = useSaveQuizMutation();
  const [deleteQuiz, { isLoading: isDeleting }] = useDeleteQuizMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const quizzes = quizzesData?.data || [];
  const courses = coursesData?.data || [];

  const filteredQuizzes = quizzes.filter((q) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = (q.title || "").toLowerCase().includes(term);
    const titleBnMatch = (q.titleBn || "").includes(term);
    const courseIdMatch = String(q.courseId || "").toLowerCase().includes(term);
    return titleMatch || titleBnMatch || courseIdMatch;
  });

  const handleOpenCreateModal = () => {
    setEditingQuizId(null);
    setFormData(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (quiz) => {
    setEditingQuizId(quiz._id);
    setFormData({
      courseId: quiz.courseId || "",
      title: quiz.title || "",
      titleBn: quiz.titleBn || "",
      durationMinutes: quiz.durationMinutes || 10,
      passPercentage: quiz.passPercentage || 80,
      questions: quiz.questions || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.courseId) {
      toast.error("Please select a target course");
      return;
    }

    if (!formData.questions || formData.questions.length === 0) {
      toast.error("Please configure at least one question");
      return;
    }

    try {
      await saveQuiz(formData).unwrap();
      toast.success(
        editingQuizId ? "Quiz updated successfully!" : "Quiz created successfully!"
      );
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save quiz");
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this course assessment quiz?")) {
      return;
    }

    try {
      await deleteQuiz(quizId).unwrap();
      toast.success("Quiz deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete quiz");
    }
  };

  return (
    <PermissionGuard
      module="quizzes"
      action="view"
      fallback={
        <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
          <FaQuestionCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <H2 className="text-base font-bold text-slate-800">Access Restricted</H2>
          <P className="text-xs text-slate-500 mt-1">
            You do not have permission to view or manage course assessment quizzes.
          </P>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <AdminPageHeader
          icon={FaQuestionCircle}
          title="Course Assessment Quizzes"
          description="Manage dynamic evaluation questions, time limits, and certificate passing criteria for all courses."
          action={
            <PermissionGuard module="quizzes" action="create">
              <Button
                variant="primary"
                size="default"
                onClick={handleOpenCreateModal}
                className="gap-2 shadow-xs"
              >
                <FaPlus className="h-3.5 w-3.5" />
                <span>Create Course Quiz</span>
              </Button>
            </PermissionGuard>
          }
        />

        {/* Filter / Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search quizzes by title or course ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<FaSearch className="h-3 w-3 text-slate-400" />}
              className="text-xs h-9"
            />
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Showing {filteredQuizzes.length} of {quizzes.length} Quizzes
          </div>
        </div>

        {/* Quizzes Table */}
        <QuizTable
          quizzes={filteredQuizzes}
          courses={courses}
          isLoading={isLoading}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />

        {/* Create / Edit Quiz Modal */}
        <QuizFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSaving}
          formData={formData}
          setFormData={setFormData}
          isEditing={Boolean(editingQuizId)}
          courses={courses}
        />
      </div>
    </PermissionGuard>
  );
}
