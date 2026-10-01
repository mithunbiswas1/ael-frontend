// src/app/(dashboard)/admin/blogs/add/page.jsx
"use client";

import PermissionGuard from "@/components/ui/PermissionGuard";
import BlogForm from "../_components/BlogForm";

export default function AddBlogPage() {
  return (
    <PermissionGuard module="blogs" action="create">
      <title>Write New Article & SEO | Safe LPG Admin</title>
      <div className="max-w-7xl mx-auto py-2">
        <BlogForm isEdit={false} />
      </div>
    </PermissionGuard>
  );
}
