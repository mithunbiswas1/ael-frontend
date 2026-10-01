// src/app/(dashboard)/admin/page.jsx
"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import {
  FaNewspaper,
  FaGraduationCap,
  FaUserShield,
  FaUsers,
  FaArrowRight,
  FaShieldAlt,
  FaReceipt,
  FaPlus,
} from "react-icons/fa";
import { H1, H3, P } from "@/components/ui/Typography";

export default function AdminDashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const isInstructor = user?.role === "instructor";

  const adminStatCards = [
    {
      title: "Articles & Blogs",
      desc: "Manage bilingual technical articles and publications",
      href: "/admin/blogs",
      icon: FaNewspaper,
      color: "bg-primary/10 text-primary border-primary/20",
    },
    {
      title: "LMS Academy Courses",
      desc: "Course catalog, video curricula, and lessons",
      href: "/admin/courses",
      icon: FaGraduationCap,
      color: "bg-secondary/10 text-secondary border-secondary/20",
    },
    {
      title: "Roles & Permissions",
      desc: "Granular view, create, edit, delete access matrices",
      href: "/admin/roles",
      icon: FaUserShield,
      color: "bg-primary/10 text-primary border-primary/20",
    },
    {
      title: "User Registry",
      desc: "Manage customer accounts, subscribers, and staff",
      href: "/admin/users",
      icon: FaUsers,
      color: "bg-slate-100 text-slate-700 border-slate-200",
    },
  ];

  const instructorStatCards = [
    {
      title: "My Courses",
      desc: "Manage your course catalog, video lessons, and curriculum",
      href: "/admin/courses",
      icon: FaGraduationCap,
      color: "bg-secondary/10 text-secondary border-secondary/20",
    },
    {
      title: "Course Enrollments & Sales",
      desc: "View enrolled students, purchases, and tuition revenue",
      href: "/admin/courses/enrollments",
      icon: FaReceipt,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Create New Course",
      desc: "Build and publish a new training module",
      href: "/admin/courses/add",
      icon: FaPlus,
      color: "bg-primary/10 text-primary border-primary/20",
    },
    {
      title: "Live Course Catalog",
      desc: "Preview how your courses look to public learners",
      href: "/courses",
      icon: FaGraduationCap,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
  ];

  const statCards = isInstructor ? instructorStatCards : adminStatCards;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-tertiary via-primary to-tertiary rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <H1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome, {user?.fullName || "Administrator"}
          </H1>
          <P className="text-sm text-white/80 mt-1 max-w-xl">
            National LPG Regulatory & Educational Platform administrative control suite. Select a module below to proceed.
          </P>
        </div>
      </div>

      {/* Grid of administrative modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200/90 hover:border-primary transition group"
            >
              <div className={`p-3.5 rounded-xl border ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <H3 className="text-base font-bold text-slate-900 group-hover:text-primary transition">
                    {card.title}
                  </H3>
                  <FaArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition" />
                </div>
                <P className="text-xs text-slate-500 mt-1">{card.desc}</P>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
