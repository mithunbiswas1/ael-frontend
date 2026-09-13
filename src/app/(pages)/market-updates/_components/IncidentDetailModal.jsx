import { X, Download } from "lucide-react";
import { toast } from "sonner";

export default function IncidentDetailModal({
  activeModalIncident,
  setActiveModalIncident,
}) {
  if (!activeModalIncident) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      onClick={() => setActiveModalIncident(null)}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">
                {activeModalIncident.id}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  activeModalIncident.status === "Resolved"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {activeModalIncident.status}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                {activeModalIncident.type}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Recorded Date: {activeModalIncident.date}
            </div>
          </div>

          <button
            onClick={() => setActiveModalIncident(null)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-3.5 text-xs">
          <div>
            <span className="font-bold text-slate-700">Location:</span>{" "}
            <span className="text-slate-900">
              {activeModalIncident.specificLocation}
            </span>
          </div>

          <div>
            <span className="font-bold text-slate-700">Severity Rating:</span>{" "}
            <span
              className={`font-semibold ${
                activeModalIncident.severity === "Critical"
                  ? "text-red-600"
                  : activeModalIncident.severity === "High"
                  ? "text-amber-600"
                  : "text-blue-600"
              }`}
            >
              {activeModalIncident.severity}
            </span>
          </div>

          <div>
            <span className="font-bold text-slate-700">Conducted By:</span>{" "}
            <span className="text-slate-900 font-medium">
              {activeModalIncident.conductedBy}
            </span>
          </div>

          <div>
            <span className="font-bold text-slate-700">Casualties & Impact:</span>{" "}
            <span className="text-slate-900">
              {activeModalIncident.casualties}
            </span>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
            <span className="font-bold text-slate-800 block mb-1">
              Incident Narrative & Investigation Notes:
            </span>
            <p className="text-slate-600 leading-relaxed">
              {activeModalIncident.details}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-blue-50/70 p-3 border border-blue-100">
            <div className="text-xs text-blue-900 font-semibold">
              Linked Inquiry Dossier:{" "}
              <strong>{activeModalIncident.investigationReport}</strong>
            </div>
            <button
              onClick={() => {
                toast.success(
                  `Downloading dossier ${activeModalIncident.investigationReport}.pdf`
                );
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end border-t border-slate-100 pt-3">
          <button
            onClick={() => setActiveModalIncident(null)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
