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
} from "react-icons/fa";
import { H1, H3, P } from "@/components/ui/Typography";

export default function AdminDashboardPage() {
  const { user } = useSelector((state) => state.auth);

  const statCards = [
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

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-tertiary via-primary to-tertiary rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-white/90 backdrop-blur-md mb-2">
            <FaShieldAlt className="text-amber-400" /> Enterprise RBAC Portal
          </span>
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
              className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-primary hover:shadow-md transition group"
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
