// src/app/(dashboard)/admin/certificates/_components/CertificateFormModal.jsx
"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FaSave, FaAward } from "react-icons/fa";

const GRADE_OPTIONS = [
  { value: "Pass (90%)", label: "Pass (90%)" },
  { value: "Pass (85%)", label: "Pass (85%)" },
  { value: "Distinction (95%)", label: "Distinction (95%)" },
  { value: "Merit (80%)", label: "Merit (80%)" },
  { value: "Executive Pass (100%)", label: "Executive Pass (100%)" },
];

export default function CertificateFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  formData,
  setFormData,
  isEditing,
  courses = [],
}) {
  const courseOptions = [
    { value: "", label: "Custom Course Title (Enter manually below)" },
    ...courses.map((c) => ({
      value: c.title,
      label: `[ID: ${c.courseId}] ${c.title}`,
    })),
  ];

  const handleCourseSelect = (e) => {
    const selectedTitle = e.target.value;
    if (!selectedTitle) return;
    const foundCourse = courses.find((c) => c.title === selectedTitle);
    if (foundCourse) {
      setFormData((prev) => ({
        ...prev,
        courseTitle: foundCourse.title,
      }));
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={isEditing ? "Edit Certificate Record" : "Issue New Certificate"}
      description="Issue or configure official digital certificates verifiable in the registry."
    >
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        {/* Top: Certificate ID & Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Certificate ID / Unique Code *"
            value={formData.certificateId}
            onChange={(e) =>
              setFormData({
                ...formData,
                certificateId: e.target.value.toUpperCase(),
              })
            }
            placeholder="e.g. CERT-LPG-004"
            required
            disabled={isEditing}
          />

          <Select
            label="Certification Grade"
            value={formData.grade || "Pass (90%)"}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            options={GRADE_OPTIONS}
          />
        </div>

        {/* Recipient Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Recipient Full Name *"
            value={formData.studentName}
            onChange={(e) =>
              setFormData({ ...formData, studentName: e.target.value })
            }
            placeholder="e.g. Mohammad Tariqul Islam"
            required
          />
          <Input
            label="Student Registration No (Optional)"
            value={formData.studentRegNo || ""}
            onChange={(e) =>
              setFormData({ ...formData, studentRegNo: e.target.value })
            }
            placeholder="e.g. AIT4937"
          />
        </div>

        {/* Quick select course */}
        {courses.length > 0 && !isEditing && (
          <Select
            label="Load from LMS Course (Optional)"
            onChange={handleCourseSelect}
            options={courseOptions}
            placeholder="Pick a course to auto-fill title..."
          />
        )}

        {/* Course Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Course Curriculum Title *"
            value={formData.courseTitle}
            onChange={(e) =>
              setFormData({ ...formData, courseTitle: e.target.value })
            }
            placeholder="e.g. HVAC Systems Design & Technical Engineering"
            required
          />
          <Input
            label="Training Duration (Optional)"
            value={formData.duration || ""}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            placeholder="e.g. MARCH 15 2024 TO JUN 11 2024"
          />
        </div>

        {/* Authorities & Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Authorized Signatory"
            value={formData.authorizedBy}
            onChange={(e) =>
              setFormData({ ...formData, authorizedBy: e.target.value })
            }
            placeholder="e.g. Mr. Mathew"
          />
          <Input
            label="Validity Period"
            value={formData.validTill}
            onChange={(e) =>
              setFormData({ ...formData, validTill: e.target.value })
            }
            placeholder="Lifetime Validity"
          />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="gap-2"
          >
            <FaAward className="h-3.5 w-3.5" />
            <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Issue Certificate"}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
