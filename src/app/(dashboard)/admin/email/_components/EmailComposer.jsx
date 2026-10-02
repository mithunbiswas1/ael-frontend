// src/app/(dashboard)/admin/email/_components/EmailComposer.jsx
"use client";

import { Send } from "lucide-react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function EmailComposer({
  title,
  setTitle,
  subject,
  setSubject,
  content,
  setContent,
  isSending,
  onSubmit,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Send className="h-4 w-4 text-primary" />
          <span>Compose Email Broadcast</span>
        </h3>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          All Registered Users & Newsletter Subscribers
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Campaign Title *
            </label>
            <Input
              required
              placeholder="e.g. Q2 Industrial Safety Guidelines"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSending}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Subject Line *
            </label>
            <Input
              required
              placeholder="e.g. [Official Advisory] Mandatory Fire Safety Certifications"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSending}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email Body Content (Formatted text / HTML supported) *
          </label>
          <textarea
            required
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSending}
            placeholder="Write the full email message or announcements here... Recipient unsubscribes & branded footer are automatically injected."
            className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-800 outline-hidden focus:border-primary leading-relaxed disabled:bg-slate-100"
          />
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
            <span>Dispatch Email Campaign</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
