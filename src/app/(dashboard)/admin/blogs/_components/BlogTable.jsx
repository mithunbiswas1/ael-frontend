// src/app/(dashboard)/admin/blogs/_components/BlogTable.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash, FaEye, FaGlobeAmericas } from "react-icons/fa";
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
import { getMediaUrl } from "@/utils/mediaUrl";

export default function BlogTable({
  blogs = [],
  isLoading,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <P className="mt-3 text-xs">Loading articles...</P>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
        <H4 className="text-sm font-bold text-slate-700">
          No articles found
        </H4>
        <P className="mt-1 text-xs text-slate-500">
          Try adjusting your search criteria or create a new article.
        </P>
      </div>
    );
  }

  return (
    <Table containerClassName="border-slate-200/90">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Thumbnail</TableHead>
          <TableHead>Title & Overview (EN / BN)</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blogs.map((blog) => (
          <TableRow key={blog._id}>
            <TableCell>
              <div className="relative h-11 w-14 overflow-hidden rounded-lg bg-slate-100 shrink-0">
                <Image
                  src={getMediaUrl(blog.image, "/default_image.jpg")}
                  alt={blog.titleEn || "Blog thumbnail"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/default_image.jpg";
                  }}
                />
              </div>
            </TableCell>

            <TableCell className="max-w-md">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-xs line-clamp-1">
                  {blog.titleEn}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 font-serif">
                  {blog.titleBn}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="font-mono text-[10px] text-slate-400">
                    /{blog.slug}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] text-slate-400">
                    {blog.readTimeEn || "5 min read"}
                  </span>
                  {blog.metaTitle || blog.metaDescription ? (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                      SEO Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-700 border border-amber-200">
                      Default SEO
                    </span>
                  )}
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                {blog.category}
              </span>
            </TableCell>

            <TableCell>
              <div className="text-xs font-semibold text-slate-800">
                {blog.authorEn}
              </div>
              <div className="text-[10px] text-slate-400">
                {blog.authorBn}
              </div>
            </TableCell>

            <TableCell>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  blog.isPublished !== false
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {blog.isPublished !== false ? "Published" : "Draft"}
              </span>
            </TableCell>

            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Link
                  href={`/blogs/${blog.slug}`}
                  target="_blank"
                  className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
                  title="View Public Article"
                >
                  <FaEye className="h-3 w-3" />
                </Link>

                <Link
                  href={`/admin/blogs/edit/${blog._id}`}
                  className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-primary transition-colors border border-slate-200"
                  title="Edit Article"
                >
                  <FaEdit className="h-3 w-3" />
                </Link>

                <Button
                  type="button"
                  onClick={() => onDelete(blog._id)}
                  variant="danger"
                  size="xs"
                  className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-200"
                  title="Delete Article"
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
