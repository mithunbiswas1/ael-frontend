// src/app/(dashboard)/admin/courses/_components/CourseBuilderForm.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Video,
  Upload,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  Layers,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Save,
  Eye,
  Check,
} from "lucide-react";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useUploadCourseImageMutation,
  useUploadCourseVideoMutation,
} from "@/redux/api/courseApi";
import { Button } from "@/components/ui/Button";

export default function CourseBuilderForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadCourseImageMutation();
  const [uploadVideo, { isLoading: isUploadingVideo }] = useUploadCourseVideoMutation();

  const isSaving = isCreating || isUpdating;

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("modules"); // 'info' | 'modules' | 'instructor'

  // Expanded modules state: set of module indices
  const [expandedModules, setExpandedModules] = useState(() => new Set([0]));

  // Individual video upload trackers
  const [uploadingLessonKey, setUploadingLessonKey] = useState(null); // `${modIdx}_${lessonIdx}`
  const [isUploadingPromoVideo, setIsUploadingPromoVideo] = useState(false);

  // Active question tab per module: { [modIdx]: questionIdx }
  const [activeQuestionTabs, setActiveQuestionTabs] = useState({});

  // Form State
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        courseId: initialData.courseId || "",
        title: initialData.title || "",
        titleBn: initialData.titleBn || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        descriptionBn: initialData.descriptionBn || "",
        category: initialData.category || "Consumer Safety",
        categoryBn: initialData.categoryBn || "ভোক্তা নিরাপত্তা",
        badge: initialData.badge || (initialData.price > 0 ? "PREMIUM" : "FREE"),
        badgeColor: initialData.badgeColor || "bg-amber-500",
        audience: initialData.audience || "Consumers & Homemakers",
        audienceBn: initialData.audienceBn || "ভোক্তা ও গৃহিণী",
        level: initialData.level || "Beginner",
        levelBn: initialData.levelBn || "প্রাথমিক",
        duration: initialData.duration || "1h 30m",
        durationBn: initialData.durationBn || "১ ঘণ্টা ৩০ মিনিট",
        price: initialData.price || 0,
        imageUrl: initialData.imageUrl || "",
        videoUrl: initialData.videoUrl || "/sample-course-video.mp4",
        isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
        instructor: {
          name: initialData.instructor?.name || "Engr. Mahmudul Hasan",
          nameBn: initialData.instructor?.nameBn || "প্রকৌশলী মাহমুদুল হাসান",
          role: initialData.instructor?.role || "Lead Safety Auditor",
          roleBn: initialData.instructor?.roleBn || "প্রধান নিরাপত্তা নিরীক্ষক",
          experience: initialData.instructor?.experience || "15+ Years Industrial Experience",
          experienceBn: initialData.instructor?.experienceBn || "১৫+ বছরের শিল্প অভিজ্ঞতা",
          avatar: initialData.instructor?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        },
        curriculum: initialData.curriculum && initialData.curriculum.length > 0
          ? initialData.curriculum.map((mod) => ({
            moduleTitle: mod.moduleTitle || "",
            moduleTitleBn: mod.moduleTitleBn || "",
            isFree: mod.isFree || false,
            lessons: mod.lessons && mod.lessons.length > 0
              ? mod.lessons.map((l) => ({
                title: l.title || "",
                titleBn: l.titleBn || "",
                duration: l.duration || "10 mins",
                durationBn: l.durationBn || "১০ মিনিট",
                videoUrl: l.videoUrl || "",
                freePreview: l.freePreview || false,
                notes: l.notes || "",
                notesBn: l.notesBn || "",
              }))
              : [
                {
                  title: "Lesson 1: Introduction",
                  titleBn: "পাঠ ১: পরিচিতি",
                  duration: "10 mins",
                  durationBn: "১০ মিনিট",
                  videoUrl: "",
                  freePreview: false,
                  notes: "",
                  notesBn: "",
                },
              ],
            quiz: {
              title: mod.quiz?.title || "",
              titleBn: mod.quiz?.titleBn || "",
              passingScore: mod.quiz?.passingScore || 70,
              questions: mod.quiz?.questions && mod.quiz.questions.length > 0
                ? mod.quiz.questions.map((q) => ({
                  question: q.question || "",
                  questionBn: q.questionBn || "",
                  options: q.options && q.options.length === 4 ? [...q.options] : ["", "", "", ""],
                  optionsBn: q.optionsBn && q.optionsBn.length === 4 ? [...q.optionsBn] : ["", "", "", ""],
                  correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
                  explanation: q.explanation || "",
                  explanationBn: q.explanationBn || "",
                }))
                : [],
            },
          }))
          : [
            {
              moduleTitle: "Module 1: Fundamentals & Orientation",
              moduleTitleBn: "মডিউল ১: প্রাথমিক ধারণা ও নির্দেশিকা",
              isFree: true, // First module free by default for demo
              lessons: [
                {
                  title: "Lesson 1: Overview & Guidelines",
                  titleBn: "পাঠ ১: সারসংক্ষেপ ও নির্দেশিকা",
                  duration: "12 mins",
                  durationBn: "১২ মিনিট",
                  videoUrl: "/sample-course-video.mp4",
                  freePreview: true,
                  notes: "",
                  notesBn: "",
                },
              ],
              quiz: {
                title: "Module 1 Assessment Quiz",
                titleBn: "মডিউল ১ মূল্যায়ন কুইজ",
                passingScore: 70,
                questions: [],
              },
            },
          ],
      };
    }

    return {
      courseId: "",
      title: "",
      titleBn: "",
      slug: "",
      description: "",
      descriptionBn: "",
      category: "Consumer Safety",
      categoryBn: "ভোক্তা নিরাপত্তা",
      badge: "FREE",
      badgeColor: "bg-emerald-500",
      audience: "Consumers & Homemakers",
      audienceBn: "ভোক্তা ও গৃহিণী",
      level: "Beginner",
      levelBn: "প্রাথমিক",
      duration: "1h 30m",
      durationBn: "১ ঘণ্টা ৩০ মিনিট",
      price: 0,
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
      videoUrl: "/sample-course-video.mp4",
      isPublished: true,
      instructor: {
        name: "Engr. Mahmudul Hasan",
        nameBn: "প্রকৌশলী মাহমুদুল হাসান",
        role: "Lead Safety Auditor",
        roleBn: "প্রধান নিরাপত্তা নিরীক্ষক",
        experience: "15+ Years Industrial Experience",
        experienceBn: "১৫+ বছরের শিল্প অভিজ্ঞতা",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
      },
      curriculum: [
        {
          moduleTitle: "Module 1: Orientation & Basics",
          moduleTitleBn: "মডিউল ১: পরিচিতি ও প্রাথমিক ধারণা",
          isFree: true, // First module free
          lessons: [
            {
              title: "Lesson 1.1: Introduction",
              titleBn: "পাঠ ১.১: ভূমিকা ও প্রাথমিক নির্দেশনা",
              duration: "10 mins",
              durationBn: "১০ মিনিট",
              videoUrl: "/sample-course-video.mp4",
              freePreview: true,
              notes: "",
              notesBn: "",
            },
          ],
          quiz: {
            title: "Module 1 Quiz",
            titleBn: "মডিউল ১ কুইজ",
            passingScore: 70,
            questions: [],
          },
        },
      ],
    };
  });

  // Toggle Module Accordion
  const toggleModule = (index) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Image Upload Handler
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append("image", file);

    try {
      const res = await uploadImage(body).unwrap();
      const uploadedUrl = res?.data?.imageUrl;
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
        toast.success("Thumbnail uploaded successfully!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload image");
    }
  };

  // Direct Video Upload Handler for a specific lesson
  const handleLessonVideoUpload = async (file, modIdx, lessonIdx) => {
    if (!file) return;
    const key = `${modIdx}_${lessonIdx}`;
    setUploadingLessonKey(key);

    const body = new FormData();
    body.append("video", file);

    try {
      const res = await uploadVideo(body).unwrap();
      const videoUrl = res?.data?.videoUrl;
      if (videoUrl) {
        updateLesson(modIdx, lessonIdx, "videoUrl", videoUrl);
        toast.success("Lesson video file uploaded successfully!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload video");
    } finally {
      setUploadingLessonKey(null);
    }
  };

  // Direct Promo / Overview Video Upload Handler
  const handlePromoVideoUpload = async (file) => {
    if (!file) return;
    setIsUploadingPromoVideo(true);

    const body = new FormData();
    body.append("video", file);

    try {
      const res = await uploadVideo(body).unwrap();
      const videoUrl = res?.data?.videoUrl;
      if (videoUrl) {
        setFormData((prev) => ({ ...prev, videoUrl }));
        toast.success("Course overview video uploaded successfully!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload overview video");
    } finally {
      setIsUploadingPromoVideo(false);
    }
  };

  // Curriculum State Modifiers
  const addModule = () => {
    const newIdx = formData.curriculum.length;
    const newModuleNumber = newIdx + 1;
    const newModule = {
      moduleTitle: `Module ${newModuleNumber}: New Topic`,
      moduleTitleBn: `মডিউল ${newModuleNumber}: নতুন বিষয়`,
      isFree: false,
      lessons: [
        {
          title: `Lesson ${newModuleNumber}.1: Lecture`,
          titleBn: `পাঠ ${newModuleNumber}.১: লেকচার`,
          duration: "10 mins",
          durationBn: "১০ মিনিট",
          videoUrl: "",
          freePreview: false,
          notes: "",
          notesBn: "",
        },
      ],
      quiz: {
        title: `Module ${newModuleNumber} Quiz`,
        titleBn: `মডিউল ${newModuleNumber} কুইজ`,
        passingScore: 70,
        questions: [],
      },
    };

    setFormData((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, newModule],
    }));

    setExpandedModules((prev) => new Set([...prev, newIdx]));
    toast.info(`Module ${newModuleNumber} added!`);
  };

  const removeModule = (index) => {
    if (formData.curriculum.length <= 1) {
      toast.error("At least one module is required for a course.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, idx) => idx !== index),
    }));
  };

  const updateModuleField = (modIdx, field, value) => {
    setFormData((prev) => {
      const curriculum = [...prev.curriculum];
      curriculum[modIdx] = {
        ...curriculum[modIdx],
        [field]: value,
      };
      return { ...prev, curriculum };
    });
  };

  // Lesson Modifiers
  const addLesson = (modIdx) => {
    setFormData((prev) => {
      const curriculum = [...prev.curriculum];
      const currentLessons = curriculum[modIdx].lessons || [];
      const newLessonNum = currentLessons.length + 1;

      const newLesson = {
        title: `Lesson ${modIdx + 1}.${newLessonNum}: Topic Title`,
        titleBn: `পাঠ ${modIdx + 1}.${newLessonNum}: পাঠের শিরোনাম`,
        duration: "10 mins",
        durationBn: "১০ মিনিট",
        videoUrl: "",
        freePreview: curriculum[modIdx].isFree || false,
        notes: "",
        notesBn: "",
      };

      curriculum[modIdx] = {
        ...curriculum[modIdx],
        lessons: [...currentLessons, newLesson],
      };
      return { ...prev, curriculum };
    });
  };

  const removeLesson = (modIdx, lessonIdx) => {
    setFormData((prev) => {
      const curriculum = [...prev.curriculum];
      const lessons = (curriculum[modIdx].lessons || []).filter((_, idx) => idx !== lessonIdx);
      curriculum[modIdx] = { ...curriculum[modIdx], lessons };
      return { ...prev, curriculum };
    });
  };

  const updateLesson = (modIdx, lessonIdx, field, value) => {
    setFormData((prev) => {
      const curriculum = [...prev.curriculum];
      const lessons = [...(curriculum[modIdx].lessons || [])];
      lessons[lessonIdx] = { ...lessons[lessonIdx], [field]: value };
      curriculum[modIdx] = { ...curriculum[modIdx], lessons };
      return { ...prev, curriculum };
    });
  };

  // Quiz Modifiers for Module
  const addQuestionToQuiz = (modIdx) => {
    let nextIdx = 0;
    setFormData((prev) => {
      const curriculum = [...prev.curriculum];
      const quiz = curriculum[modIdx].quiz || {
        title: `Module ${modIdx + 1} Quiz`,
        titleBn: `মডিউল ${modIdx + 1} কুইজ`,
        durationMinutes: 10,
        passingScore: 80,
        questions: [],
      };

      const newQ = {
        question: "",
        questionBn: "",
        options: ["", "", "", ""],
        optionsBn: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
        explanationBn: "",
      };

      nextIdx = (quiz.questions || []).length;
      curriculum[modIdx] = {
        ...curriculum[modIdx],
        quiz: {
          ...quiz,
          questions: [...(quiz.questions || []), newQ],
        },
      };
      return { ...prev, curriculum };
    });

    setActiveQuestionTabs((prev) => ({ ...prev, [modIdx]: nextIdx }));
  };

  const removeQuestionFromQuiz = (modIdx, qIdx) => {
    setFormData((prev) => {
      const curriculum = [...prev.curriculum];
      const quiz = curriculum[modIdx].quiz;
      const questions = (quiz.questions || []).filter((_, idx) => idx !== qIdx);
      curriculum[modIdx] = {
        ...curriculum[modIdx],
        quiz: { ...quiz, questions },
      };
      return { ...prev, curriculum };
    });

    setActiveQuestionTabs((prev) => {
      const current = prev[modIdx] || 0;
      if (current >= qIdx && current > 0) {
        return { ...prev, [modIdx]: current - 1 };
      }
      return prev;
    });
  };

  const updateQuizQuestion = (modIdx, qIdx, field, value) => {
    setFormData((prev) => {
      const curriculum = [...prev.curriculum];
      const quiz = curriculum[modIdx].quiz;
      const questions = [...quiz.questions];
      questions[qIdx] = { ...questions[qIdx], [field]: value };
      curriculum[modIdx] = {
        ...curriculum[modIdx],
        quiz: { ...quiz, questions },
      };
      return { ...prev, curriculum };
    });
  };

  const updateQuizOption = (modIdx, qIdx, optIdx, lang, val) => {
    setFormData((prev) => {
      const curriculum = [...prev.curriculum];
      const quiz = curriculum[modIdx].quiz;
      const questions = [...quiz.questions];
      const field = lang === "bn" ? "optionsBn" : "options";
      const opts = [...(questions[qIdx][field] || ["", "", "", ""])];
      opts[optIdx] = val;
      questions[qIdx] = { ...questions[qIdx], [field]: opts };
      curriculum[modIdx] = {
        ...curriculum[modIdx],
        quiz: { ...quiz, questions },
      };
      return { ...prev, curriculum };
    });
  };

  // Total lessons & quizzes calculation
  const totalLessonsCount = formData.curriculum.reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0
  );
  const totalQuizzesCount = formData.curriculum.reduce(
    (acc, m) => acc + (m.quiz?.questions?.length > 0 ? 1 : 0),
    0
  );

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.title.trim()) {
      toast.error("English course title is required.");
      setActiveTab("info");
      return;
    }

    if (formData.curriculum.length === 0) {
      toast.error("Please add at least one module with lessons.");
      setActiveTab("modules");
      return;
    }

    const payload = {
      ...formData,
      titleBn: formData.titleBn || formData.title,
      descriptionBn: formData.descriptionBn || formData.description,
      totalLessons: totalLessonsCount,
      totalQuizzes: totalQuizzesCount,
      badge: formData.price > 0 ? "PREMIUM" : "FREE",
      badgeColor: formData.price > 0 ? "bg-amber-600" : "bg-emerald-600",
    };

    try {
      if (isEdit && initialData?._id) {
        await updateCourse({ id: initialData._id, data: payload }).unwrap();
        toast.success("Course and modules updated successfully!");
      } else {
        await createCourse(payload).unwrap();
        toast.success("Course with all modules & quizzes created successfully!");
      }
      router.push("/admin/courses");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save course. Please check fields.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses"
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {isEdit ? "Edit Course & Modules" : "Create New Course & Modules"}
            </h1>
            <p className="text-xs text-slate-500">
              {isEdit
                ? `Editing ID: ${formData.courseId || initialData?._id}`
                : "Add modules, multiple video lessons, and per-module quizzes in one place"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Link
            href="/admin/courses"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            className="gap-2 font-bold px-5"
          >
            <Save className="h-4 w-4" />
            <span>{isEdit ? "Update Course" : "Save & Publish Course"}</span>
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("modules")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-t border-x ${activeTab === "modules"
              ? "bg-white text-primary border-slate-200 border-b-transparent shadow-xs"
              : "bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100"
            }`}
        >
          <Layers className="h-4 w-4" />
          <span>Curriculum Modules & Quizzes</span>
          <span className="ml-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-black">
            {formData.curriculum.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-t border-x ${activeTab === "info"
              ? "bg-white text-primary border-slate-200 border-b-transparent shadow-xs"
              : "bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100"
            }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Course Details & Pricing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("instructor")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-t border-x ${activeTab === "instructor"
              ? "bg-white text-primary border-slate-200 border-b-transparent shadow-xs"
              : "bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100"
            }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Instructor & Media</span>
        </button>
      </div>

      {/* TAB 1: CURRICULUM MODULES & QUIZZES */}
      {activeTab === "modules" && (
        <div className="space-y-6">
          {/* Header & Quick stats */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Course Modules & Video Structure</span>
                <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5">
                  Multi-Module Enabled
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right text-[11px] text-slate-500 pr-2 border-r border-slate-200">
                <p className="font-bold text-slate-800">{totalLessonsCount} Lessons</p>
                <p>{totalQuizzesCount} Quizzes</p>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={addModule}
                className="gap-1.5 font-bold"
              >
                <Plus className="h-4 w-4" />
                <span>Add Module</span>
              </Button>
            </div>
          </div>

          {/* Modules List */}
          <div className="space-y-4">
            {formData.curriculum.map((module, modIdx) => {
              const isExpanded = expandedModules.has(modIdx);
              const lessonCount = module.lessons?.length || 0;
              const quizQuestionsCount = module.quiz?.questions?.length || 0;

              return (
                <div
                  key={modIdx}
                  className={`bg-white rounded-2xl border transition-all ${module.isFree
                      ? "border-emerald-300 ring-1 ring-emerald-200/50"
                      : "border-slate-200"
                    }`}
                >
                  {/* Module Header Bar */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleModule(modIdx)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                            Module {modIdx + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {module.moduleTitle || `Module ${modIdx + 1}`}
                          </span>
                          {module.isFree ? (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2.5 py-0.5 flex items-center gap-1">
                              <Check className="h-3 w-3 text-emerald-600" />
                              FREE MODULE FOR REGISTERED USERS
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5">
                              Enrolled Only
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          <span>{lessonCount} Videos/Lessons</span>
                          <span>•</span>
                          <span>{quizQuestionsCount} Quiz Questions</span>
                          {module.moduleTitleBn && (
                            <>
                              <span>•</span>
                              <span className="font-serif text-slate-600">{module.moduleTitleBn}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Free Module Toggle Button */}
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                        <input
                          type="checkbox"
                          checked={module.isFree || false}
                          onChange={(e) =>
                            updateModuleField(modIdx, "isFree", e.target.checked)
                          }
                          className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-semibold text-slate-700 text-[11px]">
                          Free Preview Module
                        </span>
                      </label>

                      <Button
                        type="button"
                        variant="danger"
                        size="xs"
                        onClick={() => removeModule(modIdx)}
                        className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border-rose-200"
                        title="Delete Module"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Module Content Body */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 space-y-6 bg-slate-50/50">
                      {/* Module Titles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Module Title *
                          </label>
                          <input
                            type="text"
                            value={module.moduleTitle}
                            onChange={(e) =>
                              updateModuleField(modIdx, "moduleTitle", e.target.value)
                            }
                            placeholder="e.g. Module 1: LPG Cylinder Fire Safety Essentials"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-hidden"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            মডিউল টাইটেল
                          </label>
                          <input
                            type="text"
                            value={module.moduleTitleBn || ""}
                            onChange={(e) =>
                              updateModuleField(modIdx, "moduleTitleBn", e.target.value)
                            }
                            placeholder="যেমন: মডিউল ১: এলপিজি সিলিন্ডার অগ্নিনিরাপত্তা নির্দেশিকা"
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-hidden font-serif"
                          />
                        </div>
                      </div>

                      {/* SECTION: Video Lessons in this Module */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                            <Video className="h-4 w-4 text-primary" />
                            <span>Module Lessons & Videos ({lessonCount})</span>
                          </h3>
                          <Button
                            type="button"
                            variant="secondary"
                            size="xs"
                            onClick={() => addLesson(modIdx)}
                            className="gap-1.5 font-bold"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Video Lesson</span>
                          </Button>
                        </div>

                        {module.lessons?.map((lesson, lIdx) => (
                          <div
                            key={lIdx}
                            className="bg-white p-4 rounded-xl border border-slate-200 space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                              <span className="font-bold text-xs text-slate-700">
                                Lesson {lIdx + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={lesson.freePreview || module.isFree || false}
                                    onChange={(e) =>
                                      updateLesson(
                                        modIdx,
                                        lIdx,
                                        "freePreview",
                                        e.target.checked
                                      )
                                    }
                                    className="h-3.5 w-3.5 text-primary rounded"
                                  />
                                  <span>Free Preview</span>
                                </label>
                                <Button
                                  type="button"
                                  variant="danger"
                                  size="xs"
                                  onClick={() => removeLesson(modIdx, lIdx)}
                                  className="p-1 text-rose-500 hover:text-white hover:bg-rose-600"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                  Lesson Title *
                                </label>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) =>
                                    updateLesson(modIdx, lIdx, "title", e.target.value)
                                  }
                                  placeholder="e.g. Lesson 1: Inspection & Leak Testing"
                                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                  Duration
                                </label>
                                <input
                                  type="text"
                                  value={lesson.duration}
                                  onChange={(e) =>
                                    updateLesson(modIdx, lIdx, "duration", e.target.value)
                                  }
                                  placeholder="e.g. 15 mins"
                                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                  পাঠের শিরোনাম
                                </label>
                                <input
                                  type="text"
                                  value={lesson.titleBn || ""}
                                  onChange={(e) =>
                                    updateLesson(modIdx, lIdx, "titleBn", e.target.value)
                                  }
                                  placeholder="যেমন: পাঠ ১: সিলিন্ডার নিরীক্ষণ ও লিকেজ টেস্ট"
                                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden font-serif"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                  সময়কাল
                                </label>
                                <input
                                  type="text"
                                  value={lesson.durationBn || ""}
                                  onChange={(e) =>
                                    updateLesson(modIdx, lIdx, "durationBn", e.target.value)
                                  }
                                  placeholder="যেমন: ১৫ মিনিট"
                                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden font-serif"
                                />
                              </div>
                            </div>

                            {/* Direct Video Upload for Lesson - NO URL LINK */}
                            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                                  <Video className="h-3.5 w-3.5 text-primary" />
                                  <span>Lesson Video File (Direct Video Upload) *</span>
                                </label>
                                {lesson.videoUrl && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    ✓ Video Uploaded
                                  </span>
                                )}
                              </div>

                              {lesson.videoUrl ? (
                                <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200">
                                  <div className="relative rounded-lg overflow-hidden bg-black max-w-sm border border-slate-300">
                                    <video
                                      src={lesson.videoUrl}
                                      controls
                                      className="w-full max-h-40 object-contain"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 pt-1">
                                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-300 transition-colors">
                                      <Upload className="h-3.5 w-3.5" />
                                      <span>Change / Re-upload Video</span>
                                      <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleLessonVideoUpload(file, modIdx, lIdx);
                                        }}
                                      />
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => updateLesson(modIdx, lIdx, "videoUrl", "")}
                                      className="text-xs text-rose-600 hover:text-rose-800 hover:underline px-2 py-1"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) handleLessonVideoUpload(file, modIdx, lIdx);
                                  }}
                                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${uploadingLessonKey === `${modIdx}_${lIdx}`
                                      ? "border-primary bg-primary/5"
                                      : "border-slate-300 bg-white hover:border-primary/60 hover:bg-slate-50"
                                    }`}
                                >
                                  {uploadingLessonKey === `${modIdx}_${lIdx}` ? (
                                    <div className="py-2 space-y-2">
                                      <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                      <p className="text-xs font-semibold text-primary">Uploading video file... Please wait</p>
                                    </div>
                                  ) : (
                                    <label className="cursor-pointer block space-y-1.5">
                                      <div className="mx-auto h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
                                        <Upload className="h-4 w-4" />
                                      </div>
                                      <p className="text-xs font-bold text-slate-800">
                                        Click to upload video or drag and drop
                                      </p>
                                      <p className="text-[11px] text-slate-500">
                                        MP4, WebM, MOV video files supported
                                      </p>
                                      <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleLessonVideoUpload(file, modIdx, lIdx);
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* SECTION: Module Quiz Attached directly to this module */}
                      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                              <HelpCircle className="h-4 w-4 text-amber-500" />
                              <span>Module Quiz ({quizQuestionsCount} Questions)</span>
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Students will be tested on this module&apos;s material right after completing its lessons.
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="secondary"
                            size="xs"
                            onClick={() => addQuestionToQuiz(modIdx)}
                            className="gap-1.5 font-bold"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Question</span>
                          </Button>
                        </div>

                        {/* Quiz Metadata (Duration, Passing Score, Titles) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Quiz Title *
                            </label>
                            <input
                              type="text"
                              value={module.quiz?.title || ""}
                              onChange={(e) => {
                                const quiz = { ...(module.quiz || {}), title: e.target.value };
                                updateModuleField(modIdx, "quiz", quiz);
                              }}
                              placeholder={`Module ${modIdx + 1} Assessment Quiz`}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              কুইজের শিরোনাম *
                            </label>
                            <input
                              type="text"
                              value={module.quiz?.titleBn || ""}
                              onChange={(e) => {
                                const quiz = { ...(module.quiz || {}), titleBn: e.target.value };
                                updateModuleField(modIdx, "quiz", quiz);
                              }}
                              placeholder={`মডিউল ${modIdx + 1} মূল্যায়ন কুইজ`}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden font-serif"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Duration (Minutes)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="180"
                              value={module.quiz?.durationMinutes || 10}
                              onChange={(e) => {
                                const quiz = {
                                  ...(module.quiz || {}),
                                  durationMinutes: Number(e.target.value) || 10,
                                };
                                updateModuleField(modIdx, "quiz", quiz);
                              }}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Pass Percentage (%)
                            </label>
                            <input
                              type="number"
                              min="10"
                              max="100"
                              value={module.quiz?.passingScore || 80}
                              onChange={(e) => {
                                const quiz = {
                                  ...(module.quiz || {}),
                                  passingScore: Number(e.target.value) || 80,
                                };
                                updateModuleField(modIdx, "quiz", quiz);
                              }}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
                            />
                          </div>
                        </div>

                        {/* Questions Manager with Tab Bar */}
                        {quizQuestionsCount === 0 ? (
                          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <HelpCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-slate-700">
                              No questions added to this module quiz yet.
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                              Add interactive multiple choice questions to evaluate learner understanding.
                            </p>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => addQuestionToQuiz(modIdx)}
                              className="gap-1.5 font-bold"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add First Question</span>
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {/* Question Tabs Bar */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                              {(module.quiz.questions || []).map((_, qIdx) => {
                                const activeQ = activeQuestionTabs[modIdx] || 0;
                                const isCurrent = activeQ === qIdx;
                                return (
                                  <button
                                    key={qIdx}
                                    type="button"
                                    onClick={() =>
                                      setActiveQuestionTabs((prev) => ({
                                        ...prev,
                                        [modIdx]: qIdx,
                                      }))
                                    }
                                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${isCurrent
                                        ? "bg-primary text-white shadow-xs"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                                      }`}
                                  >
                                    Q{qIdx + 1}
                                  </button>
                                );
                              })}

                              <button
                                type="button"
                                onClick={() => addQuestionToQuiz(modIdx)}
                                className="shrink-0 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all"
                                title="Add another question"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add Question</span>
                              </button>
                            </div>

                            {/* Active Question Editor */}
                            {(() => {
                              const activeQ = Math.min(
                                activeQuestionTabs[modIdx] || 0,
                                quizQuestionsCount - 1
                              );
                              const q = module.quiz.questions[activeQ];
                              if (!q) return null;

                              return (
                                <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
                                  {/* Question Header */}
                                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                                        Question {activeQ + 1} of {quizQuestionsCount}
                                      </span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="danger"
                                      size="xs"
                                      onClick={() => removeQuestionFromQuiz(modIdx, activeQ)}
                                      className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border-rose-200 gap-1 text-[11px]"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                      <span>Delete Question</span>
                                    </Button>
                                  </div>

                                  {/* Question Statements (EN & BN) */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                        Question Statement *
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={q.question || ""}
                                        onChange={(e) =>
                                          updateQuizQuestion(modIdx, activeQ, "question", e.target.value)
                                        }
                                        placeholder="Enter question in English..."
                                        className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-primary focus:outline-hidden resize-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                        প্রশ্ন *
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={q.questionBn || ""}
                                        onChange={(e) =>
                                          updateQuizQuestion(modIdx, activeQ, "questionBn", e.target.value)
                                        }
                                        placeholder="বাংলায় প্রশ্ন লিখুন..."
                                        className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-primary focus:outline-hidden resize-none font-serif"
                                      />
                                    </div>
                                  </div>

                                  {/* 4 Options & Correct Answer Selector */}
                                  <div className="space-y-2 pt-1">
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                      Multiple Choice Options (Select circular checkmark for the correct answer)
                                    </label>

                                    <div className="space-y-2">
                                      {[0, 1, 2, 3].map((optIdx) => {
                                        const isCorrect = q.correctAnswer === optIdx;
                                        return (
                                          <div
                                            key={optIdx}
                                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${isCorrect
                                                ? "border-emerald-300 bg-emerald-50/70 ring-1 ring-emerald-200"
                                                : "border-slate-200 bg-white"
                                              }`}
                                          >
                                            <button
                                              type="button"
                                              onClick={() =>
                                                updateQuizQuestion(modIdx, activeQ, "correctAnswer", optIdx)
                                              }
                                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${isCorrect
                                                  ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                                                  : "border-slate-300 bg-slate-100 text-slate-400 hover:border-emerald-400 hover:text-emerald-600"
                                                }`}
                                              title={isCorrect ? "Correct answer selected" : "Click to mark as correct answer"}
                                            >
                                              <Check className="h-3.5 w-3.5" />
                                            </button>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                                              <input
                                                type="text"
                                                placeholder={`Option ${optIdx + 1}`}
                                                value={q.options?.[optIdx] || ""}
                                                onChange={(e) =>
                                                  updateQuizOption(
                                                    modIdx,
                                                    activeQ,
                                                    optIdx,
                                                    "en",
                                                    e.target.value
                                                  )
                                                }
                                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-primary focus:outline-hidden"
                                              />
                                              <input
                                                type="text"
                                                placeholder={`অপশন ${optIdx + 1}`}
                                                value={q.optionsBn?.[optIdx] || ""}
                                                onChange={(e) =>
                                                  updateQuizOption(
                                                    modIdx,
                                                    activeQ,
                                                    optIdx,
                                                    "bn",
                                                    e.target.value
                                                  )
                                                }
                                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-primary focus:outline-hidden font-serif"
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Explanation / Solution Note */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-200/80">
                                    <div>
                                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                        Explanation Note
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={q.explanation || ""}
                                        onChange={(e) =>
                                          updateQuizQuestion(modIdx, activeQ, "explanation", e.target.value)
                                        }
                                        placeholder="Explain why this option is correct..."
                                        className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-primary focus:outline-hidden resize-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                        উত্তরের ব্যাখ্যা
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={q.explanationBn || ""}
                                        onChange={(e) =>
                                          updateQuizQuestion(modIdx, activeQ, "explanationBn", e.target.value)
                                        }
                                        placeholder="সঠিক উত্তরের কারণ বা ব্যাখ্যা লিখুন..."
                                        className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-primary focus:outline-hidden resize-none font-serif"
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addModule}
              className="gap-2 font-bold px-6 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Module</span>
            </Button>
          </div>
        </div>
      )}

      {/* TAB 2: COURSE DETAILS & PRICING */}
      {activeTab === "info" && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-6">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            General Course Information & Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Master Industrial Fire & Gas Safety Compliance"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কোর্সের শিরোনাম *
              </label>
              <input
                type="text"
                value={formData.titleBn}
                onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                placeholder="যেমন: শিল্প কলকারখানা ও গৃহস্থালির অগ্নিনিরাপত্তা"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-hidden font-serif"
                required
              />
            </div>
          </div>

          {/* Pricing & Free Preview Policy */}
          <div className="p-4 rounded-xl border border-secondary/20 bg-secondary/5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-secondary">
                Pricing & Monetization (BDT ৳)
              </label>
              <span className="text-[11px] font-semibold text-secondary">
                {formData.price > 0 ? "Premium Course" : "Free Course"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:border-primary focus:outline-hidden"
                  placeholder="0 for 100% Free, or enter amount (e.g. 1500)"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Enter 0 for completely free course. Enter amount in BDT for Premium courses.
                </p>
              </div>

              <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                <p className="font-semibold text-slate-800">💡 Free Module Rule:</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Even if price is set (e.g. ৳ 1,500), any module with &quot;Free Module Preview&quot;
                  enabled will be accessible to all registered users without purchasing.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-hidden"
              >
                <option value="Consumer Safety">Consumer Safety</option>
                <option value="Industrial Safety">Industrial Safety</option>
                <option value="First Aid & Emergency">First Aid & Emergency</option>
                <option value="Government Compliance">Government Compliance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Skill Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-hidden"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 2h 45m"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive safety training covering official guidelines..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-hidden resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কোর্সের বিবরণ
              </label>
              <textarea
                rows={4}
                value={formData.descriptionBn}
                onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                placeholder="বাংলাদেশ স্ট্যান্ডার্ড অনুযায়ী সম্পূর্ণ নিরাপত্তা প্রশিক্ষণ..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-hidden resize-none font-serif"
              />
            </div>
          </div>

          {/* Publishing Switch */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="isPublished" className="text-xs font-bold text-slate-800 cursor-pointer">
              Publish Course immediately to public catalog
            </label>
          </div>
        </div>
      )}

      {/* TAB 3: INSTRUCTOR & MEDIA */}
      {activeTab === "instructor" && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-6">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Course Banner, Promo Video & Instructor
          </h2>

          {/* Course Thumbnail Image Upload (Direct Upload Only - No Link) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Course Thumbnail / Banner Image
              </label>
              {formData.imageUrl && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Image Uploaded
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="relative h-24 w-40 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                <Image
                  src={formData.imageUrl || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop"}
                  alt="Course banner"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-2 w-full">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      const dummyEvent = { target: { files: [file] } };
                      handleImageFileChange(dummyEvent);
                    }
                  }}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-white hover:border-primary/60 transition-colors"
                >
                  <label className="cursor-pointer block space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      {isUploadingImage ? "Uploading thumbnail image..." : "Click or drag and drop to upload banner image"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      PNG, JPG, WebP supported
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                      disabled={isUploadingImage}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Video (Direct Upload Only - No Link) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Course Overview / Promo Video
              </label>
              {formData.videoUrl && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Video Uploaded
                </span>
              )}
            </div>

            {formData.videoUrl ? (
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="relative rounded-lg overflow-hidden bg-black max-w-md border border-slate-300">
                  <video
                    src={formData.videoUrl}
                    controls
                    className="w-full max-h-48 object-contain"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer border border-slate-300 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUploadingPromoVideo ? "Uploading..." : "Change / Replace Video"}</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePromoVideoUpload(file);
                      }}
                      disabled={isUploadingPromoVideo}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, videoUrl: "" })}
                    className="text-xs text-rose-600 hover:text-rose-800 hover:underline px-2 py-1"
                  >
                    Remove Video
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handlePromoVideoUpload(file);
                }}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isUploadingPromoVideo
                    ? "border-primary bg-primary/5"
                    : "border-slate-300 bg-slate-50 hover:border-primary/60 hover:bg-slate-100/50"
                  }`}
              >
                {isUploadingPromoVideo ? (
                  <div className="py-2 space-y-2">
                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs font-semibold text-primary">Uploading overview video... Please wait</p>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-1.5">
                    <div className="mx-auto h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
                      <Upload className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Upload course intro / promo video
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Drag and drop MP4, WebM, MOV file or click to browse
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePromoVideoUpload(file);
                      }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Instructor Details */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Instructor Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Instructor Name
                </label>
                <input
                  type="text"
                  value={formData.instructor.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructor: { ...formData.instructor, name: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  প্রশিক্ষকের নাম
                </label>
                <input
                  type="text"
                  value={formData.instructor.nameBn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructor: { ...formData.instructor, nameBn: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden font-serif"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Role / Designation
                </label>
                <input
                  type="text"
                  value={formData.instructor.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructor: { ...formData.instructor, role: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  পদবী / ভূমিকা
                </label>
                <input
                  type="text"
                  value={formData.instructor.roleBn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      instructor: { ...formData.instructor, roleBn: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden font-serif"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
