// src/app/(dashboard)/admin/sms/_components/SmsComposer.jsx
"use client";

import { Send, Smartphone } from "lucide-react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SmsComposer({
  title,
  setTitle,
  message,
  setMessage,
  isBanglaUnicode,
  currentChars,
  smsCount,
  charsRemainingInCurrent,
  isSending,
  onSubmit,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Send className="h-4 w-4 text-primary" />
          <span>Compose Bulk SMS Broadcast</span>
        </h3>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
          Sends directly to all users&apos; registered phone numbers
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Campaign Title *
          </label>
          <Input
            required
            placeholder="e.g. LPG Cylinder Safety Alert / Price Update"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSending}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">
              SMS Message Content *
            </label>
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                isBanglaUnicode
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {isBanglaUnicode
                ? "Bangla Unicode (70 chars/SMS)"
                : "Standard GSM ASCII (160 chars/SMS)"}
            </span>
          </div>

          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
            placeholder="Write your SMS message here... (e.g. জরুরি নোটিশ: সিলিন্ডারের নিরাপত্তা ভাল্ব ও মেয়াদ যাচাই করুন। হেল্পলাইন: ১৬১৩৭।)"
            className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-800 outline-hidden focus:border-primary leading-relaxed disabled:bg-slate-100"
          />

          {/* Clean Character & Part Counter */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600">
            <div className="flex items-center gap-2">
              <span>
                Characters: <strong className="text-slate-900">{currentChars}</strong>
              </span>
              <span>•</span>
              <span>
                SMS Parts:{" "}
                <strong className="text-primary font-bold">{smsCount || 1}</strong>
              </span>
              <span>•</span>
              <span>
                Remaining in part:{" "}
                <strong className="text-slate-700">{charsRemainingInCurrent}</strong>
              </span>
            </div>

            <span className="text-[11px] text-slate-400 font-medium">
              Delivered via SMS Gateway
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button
            type="submit"
            variant="primary"
            size="default"
            isLoading={isSending}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Dispatch SMS Campaign</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
