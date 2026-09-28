// src/app/(dashboard)/admin/blogs/page.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetAdminBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "@/redux/api/blogApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import BlogFilterBar from "./_components/BlogFilterBar";
import BlogTable from "./_components/BlogTable";
import BlogFormModal from "./_components/BlogFormModal";

const CATEGORIES = [
  { id: "seminar", labelEn: "Seminar", labelBn: "সেমিনার" },
  {
    id: "programs_of_association",
    labelEn: "Programs of Association",
    labelBn: "অ্যাসোসিয়েশনের কার্যক্রম",
  },
  {
    id: "safety_guidelines",
    labelEn: "Safety Guidelines",
    labelBn: "নিরাপত্তা নির্দেশিকা",
  },
];

const INITIAL_FORM = {
  titleEn: "",
  titleBn: "",
  slug: "",
  descriptionEn: "",
  descriptionBn: "",
  contentEn: "",
  contentBn: "",
  category: "seminar",
  categoryBn: "সেমিনার",
  image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
  authorEn: "Safe LPG Technical Committee",
  authorBn: "সেইফ এলপিজি টেকনিক্যাল কমিটি",
  readTimeEn: "5 min read",
  readTimeBn: "৫ মিনিট পাঠ",
  tags: "lpg, safety, regulations",
  isPublished: true,
};

export default function AdminBlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: blogResponse, isLoading, refetch } = useGetAdminBlogsQuery({
    q: searchTerm,
    category: selectedCategory,
  });

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const blogs = blogResponse?.data?.data || [];

  const handleOpenCreateModal = () => {
    setEditingBlogId(null);
    setFormData(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (blog) => {
    setEditingBlogId(blog._id);
    setFormData({
      titleEn: blog.titleEn || "",
      titleBn: blog.titleBn || "",
      slug: blog.slug || "",
      descriptionEn: blog.descriptionEn || "",
      descriptionBn: blog.descriptionBn || "",
      contentEn: blog.contentEn || "",
      contentBn: blog.contentBn || "",
      category: blog.category || "seminar",
      categoryBn: blog.categoryBn || "সেমিনার",
      image: blog.image || "",
      authorEn: blog.authorEn || "",
      authorBn: blog.authorBn || "",
      readTimeEn: blog.readTimeEn || "",
      readTimeBn: blog.readTimeBn || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : (blog.tags || ""),
      isPublished: blog.isPublished !== undefined ? blog.isPublished : true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titleEn || !formData.titleBn) {
      toast.error("Please enter both English and Bengali titles");
      return;
    }

    const payload = {
      ...formData,
      tags: typeof formData.tags === "string"
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : formData.tags,
    };

    try {
      if (editingBlogId) {
        await updateBlog({ id: editingBlogId, data: payload }).unwrap();
        toast.success("Article updated successfully!");
      } else {
        await createBlog(payload).unwrap();
        toast.success("New article published successfully!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save article");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteBlog(id).unwrap();
      toast.success("Article deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete article");
    }
  };

  return (
    <PermissionGuard module="blogs" action="view">
      <div className="space-y-6">
        <BlogFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={CATEGORIES}
          onOpenCreateModal={handleOpenCreateModal}
        />

        <BlogTable
          blogs={blogs}
          isLoading={isLoading}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />

        <BlogFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isSaving={isCreating || isUpdating}
          isEditing={!!editingBlogId}
          categories={CATEGORIES}
        />
      </div>
    </PermissionGuard>
  );
}
