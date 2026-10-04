// src/app/(dashboard)/admin/certificates/_components/CertificatePreviewModal.jsx
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  FaPrint,
  FaFilePdf,
  FaImage,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Dialog, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import CertificateDocument from "@/components/shared/CertificateDocument";
import {
  downloadCertificateAsPdf,
  downloadCertificateAsImage,
  printCertificateOnly,
} from "@/lib/certificateExporter";

export default function CertificatePreviewModal({ isOpen, onClose, certificate }) {
  const printRef = useRef(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  if (!certificate) return null;

  const filename = `Certificate-${certificate.certificateId || "AEL"}-${(
    certificate.studentName || "recipient"
  ).replace(/[^a-zA-Z0-9]/g, "_")}`;

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsExportingPdf(true);
    try {
      await downloadCertificateAsPdf(printRef.current, filename);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!printRef.current) return;
    setIsExportingImage(true);
    try {
      await downloadCertificateAsImage(printRef.current, filename);
    } finally {
      setIsExportingImage(false);
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    printCertificateOnly(printRef.current);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="5xl"
      title="Official Certificate Document Preview"
      description={`Cryptographically verified certificate • ID: ${
        certificate.certificateId || "N/A"
      }`}
      headerRight={
        <div className="flex items-center gap-2">
          <Link
            href={`/verify-certificate?id=${certificate.certificateId}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <FaExternalLinkAlt className="h-3 w-3" />
            <span>Verify Online</span>
          </Link>
        </div>
      }
    >
      <DialogBody className="p-3 sm:p-6 bg-slate-100/60 max-h-[75vh] overflow-y-auto">
        {/* Certificate Canvas Container */}
        <div className="flex justify-center items-center w-full">
          <CertificateDocument
            ref={printRef}
            certificate={certificate}
            className="rounded-xl shadow-xl border border-slate-200"
          />
        </div>
      </DialogBody>

      <DialogFooter className="flex flex-wrap items-center justify-between gap-3 bg-white border-t border-slate-200 px-6 py-4">
        <p className="text-xs text-slate-500 font-sans">
          Download clean PDF or PNG image of only this certificate.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isExportingPdf || isExportingImage}
          >
            Close
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            disabled={isExportingPdf || isExportingImage}
            icon={FaPrint}
          >
            <span>Print</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadImage}
            isLoading={isExportingImage}
            disabled={isExportingImage || isExportingPdf}
            icon={FaImage}
            className="text-amber-800 border-amber-300 hover:bg-amber-50"
          >
            <span>Download Image (PNG)</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleDownloadPdf}
            isLoading={isExportingPdf}
            disabled={isExportingPdf || isExportingImage}
            icon={FaFilePdf}
            className="bg-[#7C481A] hover:bg-[#5C3411] text-white border-transparent shadow-xs"
          >
            <span>Download PDF</span>
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
