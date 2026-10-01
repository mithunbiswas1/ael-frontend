// src/app/(dashboard)/admin/blogs/edit/[id]/page.jsx
"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import PermissionGuard from "@/components/ui/PermissionGuard";
import { useGetBlogByIdQuery } from "@/redux/api/blogApi";
import BlogForm from "../../_components/BlogForm";

export default function EditBlogPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data: blogResponse, isLoading, error } = useGetBlogByIdQuery(id);
  const blog = blogResponse?.data;

  return (
    <PermissionGuard module="blogs" action="edit">
      <title>
        {blog?.titleEn
          ? `Edit "${blog.titleEn.slice(0, 30)}..." & SEO | Safe LPG Admin`
          : "Edit Article & SEO | Safe LPG Admin"}
      </title>
      <div className="max-w-7xl mx-auto py-2">
        {isLoading ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-xs text-slate-500 font-semibold">
              Loading article data for editing...
            </p>
          </div>
        ) : error || !blog ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-rose-200 shadow-2xs">
            <AlertCircle className="mx-auto h-10 w-10 text-rose-500 mb-3" />
            <h2 className="text-sm font-bold text-slate-800">Article Not Found</h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Unable to locate the specified article for editing.
            </p>
            <Link
              href="/admin/blogs"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Articles</span>
            </Link>
          </div>
        ) : (
          <BlogForm initialData={blog} isEdit={true} />
        )}
      </div>
    </PermissionGuard>
  );
}
