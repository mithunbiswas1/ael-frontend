import { FileText, ExternalLink, Download } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";

export default function InquiryReportsTable({
  inquiryReports,
  incidentData,
  setActiveModalIncident,
  handleDownloadReport,
}) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
      <div className="border-b border-slate-100 pb-4 mb-4">
        <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          <span>Incedentce REPORTS</span>
          <span className="text-xs font-medium text-slate-500 lowercase">
          </span>
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Formal investigation dockets published by authorized regulatory agencies
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Inquiry ID</TableHead>
            <TableHead>Related Incident</TableHead>
            <TableHead>Conducted By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Report</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiryReports.map((inq) => (
            <TableRow key={inq.inquiryId}>
              <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                {inq.inquiryId}
              </TableCell>
              <TableCell className="text-primary font-medium whitespace-nowrap">
                <button
                  onClick={() => {
                    const found = incidentData.find((x) => x.id === inq.relatedIncident);
                    if (found) setActiveModalIncident(found);
                  }}
                  className="hover:underline flex items-center gap-1 text-xs"
                >
                  <span>{inq.relatedIncident}</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </button>
              </TableCell>
              <TableCell className="text-slate-700 font-medium">
                {inq.agencyFull} ({inq.conductedBy})
              </TableCell>
              <TableCell className="text-slate-500 whitespace-nowrap">
                {inq.date}
              </TableCell>
              <TableCell className="text-center">
                <button
                  onClick={() => handleDownloadReport(inq)}
                  title={`Download ${inq.inquiryId} PDF (${inq.fileSize})`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-primary hover:bg-blue-50 hover:text-primary transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-blue-600" />
                  <span>PDF</span>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
