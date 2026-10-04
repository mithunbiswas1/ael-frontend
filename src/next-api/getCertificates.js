// src/next-api/getCertificates.js

import { API_BASE_URL } from "@/config/base-url";
import { VERIFIED_CERTIFICATES as fallbackCerts } from "@/app/(pages)/verify-certificate/_components/VerifyFormSection";

export async function verifyCertificateOnline(certId) {
  if (!certId) return null;
  const cleanId = certId.trim().toUpperCase();

  try {
    const res = await fetch(`${API_BASE_URL}certificates/verify/${cleanId}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        const item = json.data;
        return {
          id: item.certificateId,
          certificateId: item.certificateId,
          studentName: item.studentName,
          studentNameBn: item.studentNameBn,
          courseTitle: item.courseTitle,
          courseTitleBn: item.courseTitleBn,
          issueDate: item.issueDate,
          issueDateBn: item.issueDateBn,
          validTill: item.validTill,
          validTillBn: item.validTillBn,
          grade: item.grade,
          status: item.status,
          authorizedBy: item.authorizedBy,
          issuingAuthority: item.issuingAuthority,
          ...item,
        };
      }
    }
  } catch (err) {
    console.warn("[verifyCertificateOnline] Backend offline, falling back:", err.message);
  }

  return fallbackCerts[cleanId] || null;
}
