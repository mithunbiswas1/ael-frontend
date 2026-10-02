// src/app/(dashboard)/admin/sms/_components/SmsPreviewPanel.jsx
"use client";

import { Smartphone, Radio } from "lucide-react";

export default function SmsPreviewPanel({ senderId, message }) {
  return (
    <div className="space-y-4">
      {/* Operator Route Allocation */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Operator Route Allocation
          </h4>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <Radio className="h-3 w-3 animate-pulse" />
            Active BTRC SS7
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Grameenphone (GP)</span>
              <span className="font-bold text-slate-800">48%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "48%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Robi & Airtel</span>
              <span className="font-bold text-slate-800">30%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: "30%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Banglalink</span>
              <span className="font-bold text-slate-800">18%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "18%" }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-600 mb-1">
              <span>Teletalk Bangladesh</span>
              <span className="font-bold text-slate-800">4%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "4%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recipient Handset Mockup Preview */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-900 text-white p-5 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Smartphone className="h-4 w-4" />
          <span>Recipient Handset Preview</span>
        </div>

        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-sans space-y-2">
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between border-b border-slate-800/80 pb-1.5">
            <span>From: {senderId || "SafeLPG-BD"}</span>
            <span>Just Now</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed break-words whitespace-pre-wrap min-h-12">
            {message || "Official message preview will appear here as you type..."}
          </p>
        </div>
      </div>
    </div>
  );
}
