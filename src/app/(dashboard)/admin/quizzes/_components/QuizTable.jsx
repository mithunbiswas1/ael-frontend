// src/app/(dashboard)/admin/quizzes/_components/QuizTable.jsx
"use client";

import { FaEdit, FaTrash, FaQuestionCircle, FaClock, FaAward } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { H4, P } from "@/components/ui/Typography";

export default function QuizTable({
  quizzes = [],
  courses = [],
  isLoading,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <P className="mt-3 text-xs">Loading course quizzes...</P>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
        <FaQuestionCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
        <H4 className="text-sm font-bold text-slate-700">
          No quizzes configured
        </H4>
        <P className="mt-1 text-xs text-slate-500">
          Click &quot;Create Course Quiz&quot; to configure assessment questions for a course.
        </P>
      </div>
    );
  }

  // Lookup course title by courseId
  const getCourseName = (courseId) => {
    const course = courses.find((c) => String(c.courseId) === String(courseId) || String(c._id) === String(courseId));
    return course ? course.title : `Course #${courseId}`;
  };

  return (
    <Table containerClassName="shadow-xs border-slate-200/90">
      <TableHeader>
        <TableRow>
          <TableHead>Target Course</TableHead>
          <TableHead>Quiz Title (EN / BN)</TableHead>
          <TableHead>Questions</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Pass Score</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quizzes.map((quiz) => (
          <TableRow key={quiz._id}>
            <TableCell>
              <div className="space-y-0.5">
                <span className="inline-block rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold">
                  Course ID: {quiz.courseId}
                </span>
                <div className="font-semibold text-slate-800 text-xs line-clamp-1 max-w-[200px]">
                  {getCourseName(quiz.courseId)}
                </div>
              </div>
            </TableCell>

            <TableCell className="max-w-md">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 text-xs line-clamp-1">
                  {quiz.title}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 font-serif">
                  {quiz.titleBn}
                </div>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                <FaQuestionCircle className="h-3 w-3 text-primary" />
                <span>{quiz.questions?.length || 0} Questions</span>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <FaClock className="h-3 w-3 text-slate-400" />
                <span>{quiz.durationMinutes || 10} Mins</span>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <FaAward className="h-3 w-3 text-emerald-500" />
                <span>{quiz.passPercentage || 80}% Passing</span>
              </div>
            </TableCell>

            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(quiz)}
                  className="h-7 px-2.5 text-slate-600 hover:text-primary"
                  title="Edit Quiz Questions"
                >
                  <FaEdit className="h-3 w-3" />
                  <span className="ml-1 text-[11px]">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(quiz._id)}
                  className="h-7 px-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                  title="Delete Quiz"
                >
                  <FaTrash className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
