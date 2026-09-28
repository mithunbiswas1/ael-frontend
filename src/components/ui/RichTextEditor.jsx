// src/components/ui/RichTextEditor.jsx
"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-44 w-full animate-pulse rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
      Loading Editor...
    </div>
  ),
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "link",
];

export default function RichTextEditor({
  value = "",
  onChange = () => {},
  placeholder = "Write content here...",
  className = "",
  label,
  required = false,
}) {
  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs focus-within:border-primary">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="rich-editor-content text-xs sm:text-sm"
        />
      </div>
    </div>
  );
}
