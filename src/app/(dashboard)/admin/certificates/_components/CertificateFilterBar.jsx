// src/app/(dashboard)/admin/certificates/_components/CertificateFilterBar.jsx
"use client";

import { FaAward } from "react-icons/fa";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { SearchInput } from "@/components/ui/SearchInput";

export default function CertificateFilterBar({
  searchTerm,
  onSearchChange,
  onOpenIssueModal,
  totalCount = 0,
}) {
  return (
    <div className="space-y-4">
      {/* Header & Action */}
      <AdminPageHeader
        icon={FaAward}
        title="Certificates Registry"
        description="Issue, verify, and manage government & industry-recognized safety certification credentials."
        badge={`${totalCount} Issued`}
        actionLabel="Issue New Certificate"
        onActionClick={onOpenIssueModal}
      />

      {/* Filter Row */}
      <div className="w-full sm:w-96">
        <SearchInput
          placeholder="Search by certificate ID, student, or course..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
