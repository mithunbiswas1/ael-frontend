// src/app/(pages)/courses/[id]/page.jsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GraduationCap,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  PlayCircle,
  FileText,
  ShieldCheck,
  User,
  Users,
  Star,
  ChevronRight,
  ArrowRight,
  Download,
  Share2,
  Lock,
} from "lucide-react";
import { H1, H2, H3, H4, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";

const ALL_COURSES = [
  {
    id: "1",
    title: "LPG Safety for Regular Consumers",
    slug: "1",
    description:
      "Essential safety guidelines for safe handling, soap-bubble leak testing, kitchen ventilation, and emergency incident response for household LPG users.",
    category: "Consumer Safety",
    badge: "FREE",
    badgeColor: "bg-amber-500",
    audience: "Consumers & Homemakers",
    level: "Beginner",
    duration: "1h 45m",
    totalLessons: 8,
    totalQuizzes: 1,
    rating: 4.9,
    enrolledCount: "12,480",
    price: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    instructor: {
      name: "Engr. Mahmudul Hasan",
      role: "Lead Safety Auditor, Ex-DoE",
      experience: "15+ Years Industrial Experience",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
    learningPoints: [
      "Proper positioning and upright orientation of LPG cylinders in domestic kitchens.",
      "Recognizing defective regulator O-rings and verifying pin connections.",
      "Conducting standard non-flammable soap-solution leak checks safely.",
      "Immediate action sequence when LPG gas odor (ethyl mercaptan) is detected.",
      "Preventing electrical spark ignition (switches, refrigerators, matches).",
      "Selecting certified hoses conforming to BDS/ISO national safety standards.",
    ],
    curriculum: [
      {
        moduleTitle: "Module 1: Introduction to Liquefied Petroleum Gas (LPG)",
        lessons: [
          { title: "Physical Properties & Hazards of LPG", duration: "10 mins", freePreview: true },
          { title: "Understanding Cylinder Construction & Valves", duration: "12 mins", freePreview: true },
          { title: "Safety Markings: Tare Weight, Expiry & Test Dates", duration: "14 mins", freePreview: false },
        ],
      },
      {
        moduleTitle: "Module 2: Daily Kitchen Storage & Safe Connection",
        lessons: [
          { title: "Step-by-Step Regulator Connection Protocol", duration: "15 mins", freePreview: false },
          { title: "Conducting the 2-Minute Soap Water Test", duration: "11 mins", freePreview: false },
          { title: "Ventilation Requirements & Avoidance of Closed Pits", duration: "13 mins", freePreview: false },
        ],
      },
      {
        moduleTitle: "Module 3: Emergency Management & Final Assessment",
        lessons: [
          { title: "What to Do When Gas Leak is Detected", duration: "15 mins", freePreview: false },
          { title: "Extinguishing Small Kitchen Fires: Blanket & DCP Method", duration: "15 mins", freePreview: false },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "LPG Dealer Safety & Regulatory Compliance",
    slug: "2",
    description:
      "Operational standards, DoE license conditions, stacking heights, fire mitigation requirements, and inventory safety for licensed LPG retailers across Bangladesh.",
    category: "Dealer Compliance",
    badge: "FREE",
    badgeColor: "bg-blue-600",
    audience: "Retail Dealers & Point-of-Sale Operators",
    level: "Intermediate",
    duration: "2h 30m",
    totalLessons: 10,
    totalQuizzes: 1,
    rating: 4.8,
    enrolledCount: "8,920",
    price: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    instructor: {
      name: "Sharmin Sultana",
      role: "Compliance Specialist, LOAB",
      experience: "12+ Years Regulatory Advisory",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    },
    learningPoints: [
      "Department of Explosives (DoE) licensing checklist and retail clearances.",
      "Maximum vertical stacking height limitations for empty vs full cylinders.",
      "Fire extinguisher placement, regular hydro-testing, and staff drill routines.",
      "Safe handling during unloading from delivery trucks to avoid brass valve damage.",
      "Documentation of cylinder serial numbers and batch tracking.",
      "Legal penalties regarding unauthorized cross-brand refilling.",
    ],
    curriculum: [
      {
        moduleTitle: "Module 1: Legal Framework & Explosives Rules 2004",
        lessons: [
          { title: "Statutory Requirements for Dealer Warehouses", duration: "14 mins", freePreview: true },
          { title: "Fire Service & Civil Defense NOC Procedures", duration: "16 mins", freePreview: true },
        ],
      },
      {
        moduleTitle: "Module 2: Warehouse Layout & Stacking Safety",
        lessons: [
          { title: "Distance Clearances from Property Lines & Electric Mains", duration: "15 mins", freePreview: false },
          { title: "Cylinder Floor Stacking Limits & Stability", duration: "18 mins", freePreview: false },
          { title: "Material Handling: Trolleys vs Rolling Prohibition", duration: "12 mins", freePreview: false },
        ],
      },
      {
        moduleTitle: "Module 3: Emergency Preparedness & Certification",
        lessons: [
          { title: "Emergency Water Reservoirs & Dry Chemical Powder (DCP)", duration: "20 mins", freePreview: false },
          { title: "Comprehensive Dealer Compliance Assessment", duration: "15 mins", freePreview: false },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "LPG Safety for High-Pressure Industrial Use",
    slug: "4",
    description:
      "Engineering best practices for vaporizers, manifold installations, gas leak detection telemetry, and pressure reduction stations in manufacturing plants.",
    category: "Industrial Use",
    badge: "৳ 500",
    badgeColor: "bg-emerald-600",
    audience: "Engineers, Boiler Operators & Plant Managers",
    level: "Advanced",
    duration: "3h 45m",
    totalLessons: 14,
    totalQuizzes: 1,
    rating: 4.9,
    enrolledCount: "3,410",
    price: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
    instructor: {
      name: "Dr. Kazi Ariful Islam",
      role: "Professor of Chemical Engineering (BUET)",
      experience: "20+ Years Oil & Gas Consultant",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    learningPoints: [
      "Design principles of liquid-withdrawal manifold and vaporizer skids.",
      "Flameproof (Ex-d) electrical standards for hazardous Zone 1 / Zone 2 areas.",
      "Piping isometric inspections and hydro-testing at 1.5x design pressure.",
      "Emergency Shutdown Valves (ESDV) and remote nitrogen actuation.",
      "Automated optical flame sensors and fixed gas detection arrays.",
      "Standard Operating Procedures (SOP) for hot work permits.",
    ],
    curriculum: [
      {
        moduleTitle: "Module 1: Industrial Manifolds & Vaporization Systems",
        lessons: [
          { title: "Design of Multi-Cylinder LOT (Liquid Off-Take) Banks", duration: "20 mins", freePreview: true },
          { title: "Water Bath vs Direct Fired Vaporizers Safety", duration: "25 mins", freePreview: false },
        ],
      },
      {
        moduleTitle: "Module 2: Piping Standards & Hazardous Area Classification",
        lessons: [
          { title: "Seamless Carbon Steel Pipe Specs (ASTM A106 Gr B)", duration: "22 mins", freePreview: false },
          { title: "Zone 1 vs Zone 2 Hazardous Boundaries & Ventilation", duration: "18 mins", freePreview: false },
        ],
      },
      {
        moduleTitle: "Module 3: Instrumentation & Final Examination",
        lessons: [
          { title: "ESDV Control Philosophy & Gas Telemetry Alarms", duration: "25 mins", freePreview: false },
          { title: "Certified Industrial Safety Engineer Exam", duration: "30 mins", freePreview: false },
        ],
      },
    ],
  },
];

export function generateStaticParams() {
  return ALL_COURSES.map((course) => ({
    id: course.id,
  }));
}

export default async function CourseDetailPage({ params }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  const course =
    ALL_COURSES.find((c) => c.id === courseId || c.slug === courseId) || {
      ...ALL_COURSES[0],
      id: courseId,
      title: `LPG Specialized Training Course #${courseId}`,
      description:
        "Comprehensive safety curriculum covering LPG standards, handling, emergency protocols, and verifiable certification.",
    };

  const isFree = course.price === 0;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Page Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-14 pt-10 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Breadcrumb
                dark
                items={[
                  { label: "Home", href: "/" },
                  { label: "Training & Quiz", href: "/courses" },
                  { label: course.title },
                ]}
                className="mb-4"
              />

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-blue-500/10 border border-blue-400/30 px-3 py-0.5 text-xs font-bold text-blue-400">
                  {course.category}
                </span>
                <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-0.5 text-xs font-bold text-slate-300">
                  Level: {course.level}
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-400/30 px-3 py-0.5 text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Official Certificate Included</span>
                </span>
              </div>

              <H1 color="white" className="leading-tight">
                {course.title}
              </H1>

              <P className="mt-3.5 max-w-2xl text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                {course.description}
              </P>

              <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span>{course.rating}</span>
                  <span className="text-slate-400 font-normal">
                    ({course.enrolledCount} learners)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span>{course.duration} on-demand</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-blue-400" />
                  <span>{course.totalLessons} Lessons & 1 Quiz</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span>QR Verifiable Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content & Enrollment Sidebar */}
      <section className="relative z-20 -mt-6 mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* LEFT 8 COLUMNS: Overview, Outcomes, Syllabus, Instructor */}
          <div className="space-y-6 lg:col-span-8">
            {/* Box 1: What You Will Learn */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>WHAT YOU WILL LEARN</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.learningPoints?.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-700 leading-relaxed"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2: Course Curriculum & Modules */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">
                    COURSE CURRICULUM
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {course.curriculum?.length} Modules • {course.totalLessons} Lessons • Full Lifetime Access
                  </p>
                </div>
                <span className="text-xs font-bold text-primary">
                  100% Online Self-Paced
                </span>
              </div>

              <Accordion
                type="multiple"
                defaultValue={course.curriculum?.map((_, idx) => `module-${idx}`) || []}
                className="space-y-3"
              >
                {course.curriculum?.map((module, mIdx) => (
                  <AccordionItem
                    key={mIdx}
                    value={`module-${mIdx}`}
                    variant="card"
                  >
                    <AccordionTrigger
                      iconType="chevron"
                      className="bg-slate-100/80 px-4 py-3 hover:bg-slate-200/60"
                    >
                      <div className="flex items-center gap-2">
                        <span>{module.moduleTitle}</span>
                        <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {module.lessons.length} lessons
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent variant="card" className="p-0">
                      <div className="divide-y divide-slate-100 bg-white">
                        {module.lessons.map((lesson, lIdx) => (
                          <div
                            key={lIdx}
                            className="flex items-center justify-between px-4 py-3 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              {lesson.freePreview ? (
                                <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                              ) : (
                                <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                              )}
                              <span className="font-medium text-slate-800">
                                {lesson.title}
                              </span>
                              {lesson.freePreview && (
                                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                                  Preview
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 whitespace-nowrap">
                              {lesson.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Box 3: Lead Instructor */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span>MEET YOUR INSTRUCTOR</span>
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg bg-slate-50/80 border border-slate-200/60 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {course.instructor.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary">
                    {course.instructor.role}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {course.instructor.experience}. Certified LPG safety trainer endorsed by national regulatory agencies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: Sticky Enrollment Action Card */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-md">
              {/* Media Preview */}
              <div className="relative aspect-16/9 w-full bg-slate-900">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <Link
                    href={`/courses/learn/${course.id}`}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110"
                    title="Start Learning / Preview Video"
                  >
                    <PlayCircle className="h-6 w-6" />
                  </Link>
                </div>
                <span className="absolute bottom-2 right-2 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-white">
                  Preview Course
                </span>
              </div>

              {/* Price & Action */}
              <div className="p-5">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-black text-slate-900">
                    {isFree ? "FREE" : `৳ ${course.price}`}
                  </span>
                  {!isFree && (
                    <span className="text-xs text-slate-400 line-through">
                      ৳ 1,200
                    </span>
                  )}
                  <span className="ml-auto rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                    {isFree ? "100% Scholarship" : "Special 58% Off"}
                  </span>
                </div>

                {isFree ? (
                  <Link
                    href={`/courses/learn/${course.id}`}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs"
                  >
                    <span>Start Learning Free</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    href={`/checkout?courseId=${course.id}`}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <span>Enroll Now (৳ {course.price})</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                <div className="mt-3 text-center">
                  <Link
                    href={`/courses/${course.id}/quiz`}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Already completed? Take Assessment Quiz →
                  </Link>
                </div>

                {/* Features Checklist */}
                <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
                  <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-2">
                    This training includes:
                  </div>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{course.duration} on-demand video lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>3 Downloadable safety reference guides</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Official verifiable certificate of completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Full lifetime access across mobile & desktop</span>
                  </div>
                </div>

                {/* Verification Notice */}
                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-center text-[11px] text-slate-500">
                  <span>Authorized Certificate issued by AEL & Partner Regulatory Bodies.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
