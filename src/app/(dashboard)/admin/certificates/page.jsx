// src/app/(dashboard)/admin/certificates/page.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetCertificatesQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
} from "@/redux/api/certificateApi";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import CertificateFilterBar from "./_components/CertificateFilterBar";
import CertificateTable from "./_components/CertificateTable";
import CertificateFormModal from "./_components/CertificateFormModal";

const INITIAL_FORM = {
  certificateId: "",
  studentName: "",
  studentNameBn: "",
  courseTitle: "",
  courseTitleBn: "",
  grade: "Pass (90%)",
  authorizedBy: "Engr. Mahmudul Hasan (DoE Lead Auditor)",
  validTill: "Lifetime Validity",
};

export default function AdminCertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: certsData,
    isLoading,
    refetch,
  } = useGetCertificatesQuery({ q: searchTerm || undefined });
  const { data: coursesData } = useGetCoursesQuery({});

  const [createCert, { isLoading: isCreating }] = useCreateCertificateMutation();
  const [updateCert, { isLoading: isUpdating }] = useUpdateCertificateMutation();
  const [deleteCert, { isLoading: isDeleting }] = useDeleteCertificateMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const certificates = certsData?.data || [];
  const courses = coursesData?.data || [];

  const handleOpenIssueModal = () => {
    setEditingCertId(null);
    setFormData({
      ...INITIAL_FORM,
      certificateId: `CERT-LPG-${String(Math.floor(100 + Math.random() * 900))}`,
    });
    setIsModalOpen(true);
  };

  const handleEditCert = (cert) => {
    setEditingCertId(cert._id);
    setFormData({
      certificateId: cert.certificateId || "",
      studentName: cert.studentName || "",
      studentNameBn: cert.studentNameBn || "",
      courseTitle: cert.courseTitle || "",
      courseTitleBn: cert.courseTitleBn || "",
      grade: cert.grade || "Pass (90%)",
      authorizedBy: cert.authorizedBy || "",
      validTill: cert.validTill || "Lifetime Validity",
    });
    setIsModalOpen(true);
  };

  const handleDeleteCert = async (cert) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to revoke and delete certificate "${cert.certificateId}" for ${cert.studentName}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteCert(cert._id).unwrap();
      toast.success("Certificate revoked and deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete certificate");
    }
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    try {
      if (editingCertId) {
        await updateCert({
          id: editingCertId,
          data: formData,
        }).unwrap();
        toast.success("Certificate updated successfully!");
      } else {
        await createCert(formData).unwrap();
        toast.success("Certificate issued successfully!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save certificate");
    }
  };

  return (
    <PermissionGuard module="certificates" action="view">
      <div className="space-y-6">
        <CertificateFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onOpenIssueModal={handleOpenIssueModal}
          totalCount={certificates.length}
        />

        <CertificateTable
          certificates={certificates}
          isLoading={isLoading}
          onEdit={handleEditCert}
          onDelete={handleDeleteCert}
        />

        <CertificateFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitModal}
          isSubmitting={isCreating || isUpdating}
          formData={formData}
          setFormData={setFormData}
          isEditing={Boolean(editingCertId)}
          courses={courses}
        />
      </div>
    </PermissionGuard>
  );
}
