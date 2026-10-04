// src/app/(dashboard)/admin/newsletter/_components/BroadcastCampaignDialog.jsx
"use client";

import { Send } from "lucide-react";
import { Dialog, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { P } from "@/components/ui/Typography";

export default function BroadcastCampaignDialog({
  isOpen,
  onClose,
  broadcastForm,
  setBroadcastForm,
  onSubmit,
  isBroadcasting,
  stats,
}) {
  const safeStats = stats || {
    totalActive: 0,
    totalRegistered: 0,
    totalWebsite: 0,
  };

  const recipientCount =
    broadcastForm.targetAudience === "registered"
      ? safeStats.totalRegistered
      : broadcastForm.targetAudience === "newsletter"
      ? safeStats.totalWebsite
      : safeStats.totalActive;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Broadcast Campaign to Subscribers"
    >
      <form onSubmit={onSubmit}>
        <DialogBody className="space-y-4">
          <P className="text-xs text-slate-500">
            Dispatch an instant email campaign broadcast. All registered users and newsletter users will receive the message.
          </P>

          {/* Target Audience Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Target Audience</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() =>
                  setBroadcastForm((prev) => ({ ...prev, targetAudience: "all" }))
                }
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  broadcastForm.targetAudience === "all"
                    ? "border-primary bg-primary/5 text-primary font-bold shadow-2xs"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>All Users</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
                    {safeStats.totalActive}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Registered & Newsletter
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setBroadcastForm((prev) => ({ ...prev, targetAudience: "registered" }))
                }
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  broadcastForm.targetAudience === "registered"
                    ? "border-primary bg-primary/5 text-primary font-bold shadow-2xs"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Registered Users</span>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">
                    {safeStats.totalRegistered}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                  User account members
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setBroadcastForm((prev) => ({ ...prev, targetAudience: "newsletter" }))
                }
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  broadcastForm.targetAudience === "newsletter"
                    ? "border-primary bg-primary/5 text-primary font-bold shadow-2xs"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Newsletter Users</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">
                    {safeStats.totalWebsite}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Website subscribers
                </div>
              </button>
            </div>
          </div>

          {/* Campaign Title (Single Field) */}
          <Input
            label="Campaign / Announcement Title *"
            placeholder="e.g. Special Safety Directive Issued by Department of Explosives"
            value={broadcastForm.title}
            onChange={(e) =>
              setBroadcastForm((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />

          {/* Email Subject Line */}
          <Input
            label="Email Subject Line *"
            placeholder="e.g. [AEL SafeLPG] Urgent Safety Bulletin Regarding Cylinder Hydro-Testing"
            value={broadcastForm.subject}
            onChange={(e) =>
              setBroadcastForm((prev) => ({ ...prev, subject: e.target.value }))
            }
            required
          />

          {/* Newsletter Message Content (Single Field) */}
          <Textarea
            label="Newsletter Message Content *"
            rows={5}
            placeholder="Write the newsletter message, key points, announcements or safety instructions..."
            value={broadcastForm.summary}
            onChange={(e) =>
              setBroadcastForm((prev) => ({ ...prev, summary: e.target.value }))
            }
            required
          />

          {/* Action CTA Link (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Action Button Label (Optional)"
              placeholder="e.g. View Guidelines"
              value={broadcastForm.ctaText}
              onChange={(e) =>
                setBroadcastForm((prev) => ({ ...prev, ctaText: e.target.value }))
              }
            />

            <Input
              label="Action Target URL (Optional)"
              placeholder="e.g. /safety-guidelines"
              value={broadcastForm.ctaUrl}
              onChange={(e) =>
                setBroadcastForm((prev) => ({ ...prev, ctaUrl: e.target.value }))
              }
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isBroadcasting || recipientCount === 0}
            isLoading={isBroadcasting}
            icon={Send}
          >
            Dispatch Campaign ({recipientCount} Recipients)
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
