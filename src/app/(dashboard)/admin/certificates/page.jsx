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
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Pagination from "@/components/ui/Pagination";
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
  const [page, setPage] = useState(1);
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
  const [deleteCertTarget, setDeleteCertTarget] = useState(null);

  const certificates = certsData?.data || [];
  const courses = coursesData?.data || [];
  const totalCerts = certificates.length;
  const totalPages = Math.ceil(totalCerts / 10) || 1;
  const paginatedCerts = certificates.slice((page - 1) * 10, page * 10);

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

  const handleDeleteCert = (cert) => {
    setDeleteCertTarget(cert);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCertTarget?._id) return;
    try {
      await deleteCert(deleteCertTarget._id).unwrap();
      toast.success("Certificate revoked and deleted successfully!");
      setDeleteCertTarget(null);
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
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
          onOpenIssueModal={handleOpenIssueModal}
          totalCount={certificates.length}
        />

        <div className="space-y-4">
          <CertificateTable
            certificates={paginatedCerts}
            isLoading={isLoading}
            onEdit={handleEditCert}
            onDelete={handleDeleteCert}
          />

          {totalCerts > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalCerts}
              pageSize={10}
              onPageChange={setPage}
            />
          )}
        </div>

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

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={Boolean(deleteCertTarget)}
          onClose={() => setDeleteCertTarget(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Revoke & Delete Certificate"
          description="Are you sure you want to revoke and delete this official certificate? The verification QR code will immediately be invalidated."
          itemTitle={
            deleteCertTarget
              ? `${deleteCertTarget.certificateId} (${deleteCertTarget.studentName})`
              : ""
          }
          confirmText="Revoke & Delete"
        />
      </div>
    </PermissionGuard>
  );
}
