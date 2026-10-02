// src/app/(dashboard)/admin/blogs/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetAdminBlogsQuery,
  useDeleteBlogMutation,
} from "@/redux/api/blogApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Pagination from "@/components/ui/Pagination";
import BlogFilterBar from "./_components/BlogFilterBar";
import BlogTable from "./_components/BlogTable";
import { BLOG_CATEGORIES } from "./_components/BlogForm";

export default function AdminBlogsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteBlogTarget, setDeleteBlogTarget] = useState(null);

  const { data: blogResponse, isLoading, refetch } = useGetAdminBlogsQuery({
    q: searchTerm,
    category: selectedCategory,
    page,
    limit: 10,
  });

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const blogs = blogResponse?.data?.data || [];
  const pagination = blogResponse?.data?.pagination || {};

  const handleOpenCreate = () => {
    router.push("/admin/blogs/add");
  };

  const handleEdit = (blog) => {
    router.push(`/admin/blogs/edit/${blog._id}`);
  };

  const handleDeleteClick = (id) => {
    const target = blogs.find((b) => b._id === id);
    setDeleteBlogTarget(target || { _id: id, titleEn: "Selected Article" });
  };

  const handleConfirmDelete = async () => {
    if (!deleteBlogTarget?._id) return;
    try {
      await deleteBlog(deleteBlogTarget._id).unwrap();
      toast.success("Article deleted successfully");
      setDeleteBlogTarget(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete article");
    }
  };

  return (
    <PermissionGuard module="blogs" action="view">
      <title>Articles & Blog Management | Safe LPG Admin</title>
      <div className="space-y-6">
        <BlogFilterBar
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setPage(1);
          }}
          categories={BLOG_CATEGORIES}
          onOpenCreate={handleOpenCreate}
        />

        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <BlogTable
            blogs={blogs}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages || 1}
            totalItems={pagination.total}
            pageSize={10}
            onPageChange={setPage}
          />
        </div>

        {/* UI Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={Boolean(deleteBlogTarget)}
          onClose={() => setDeleteBlogTarget(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Article"
          description="Are you sure you want to delete this article? This will remove it from the platform."
          itemTitle={deleteBlogTarget?.titleEn || deleteBlogTarget?.titleBn || ""}
          confirmText="Delete Article"
        />
      </div>
    </PermissionGuard>
  );
}
