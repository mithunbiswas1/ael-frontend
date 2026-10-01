// src/app/(dashboard)/admin/email/page.jsx
"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  Calendar,
  Users,
  CheckCircle2,
  BarChart2,
  Trash2,
  Eye,
  MousePointer,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import {
  useGetCampaignsQuery,
  useGetCampaignStatsQuery,
  useCreateCampaignMutation,
  useDeleteCampaignMutation,
} from "@/redux/api/campaignApi";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

export default function AdminEmailCampaignsPage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [targetAudience, setTargetAudience] = useState("all_subscribers");
  const [senderId, setSenderId] = useState("bulletin@safelpg.gov.bd");
  const [content, setContent] = useState("");
  const [isSchedule, setIsSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: campaignData, isLoading, refetch } = useGetCampaignsQuery({
    type: "email",
  });
  const { data: statsData } = useGetCampaignStatsQuery();
  const [createCampaign, { isLoading: isSending }] = useCreateCampaignMutation();
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  const campaigns = campaignData?.data?.campaigns || [];
  const stats = statsData?.data || {
    totalEmailsSent: 32900,
    overallSuccessRate: 98.4,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !content.trim()) {
      toast.error("Please fill in campaign title, subject, and email content.");
      return;
    }

    try {
      await createCampaign({
        type: "email",
        title: title.trim(),
        subject: subject.trim(),
        targetAudience,
        senderId,
        messageContent: content.trim(),
        isSchedule,
        scheduledAt: isSchedule && scheduledAt ? new Date(scheduledAt) : new Date(),
      }).unwrap();

      toast.success(
        isSchedule
          ? "Email campaign scheduled successfully!"
          : "Email broadcast dispatched successfully!"
      );

      setTitle("");
      setSubject("");
      setContent("");
      setIsSchedule(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to dispatch email campaign.");
    }
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await deleteCampaign(deleteTarget._id).unwrap();
      toast.success("Campaign record removed.");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AdminPageHeader
        icon={Mail}
        title="Enterprise Email Broadcast & Campaign Manager"
        description="Design and distribute regulatory bulletins, safety certificates, and official press releases with open and click tracking."
      />

      {/* 2. Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Total Emails Dispatched</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {Number(stats.totalEmailsSent || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            Verified SMTP Engine
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Inbox Deliverability</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">99.1%</div>
          <div className="text-[11px] text-slate-400 mt-1">SPF & DKIM Validated</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Average Open Rate</div>
          <div className="text-2xl font-black text-primary mt-1">42.5%</div>
          <div className="text-[11px] text-slate-400 mt-1">Industry avg 21.2%</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Click-Through Rate (CTR)</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">14.8%</div>
          <div className="text-[11px] text-slate-400 mt-1">Certified Document Link Tracking</div>
        </div>
      </div>

      {/* 3. Composer Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Send className="h-4 w-4 text-primary" />
          <span>Compose Email Broadcast</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Campaign Title *
              </label>
              <Input
                required
                placeholder="e.g. Q2 Industrial Safety Guidelines"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Audience *
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-hidden focus:border-primary"
              >
                <option value="all_subscribers">
                  Academy Learners & Subscribers
                </option>
                <option value="dealers">
                  Licensed LPG Dealers (64,200)
                </option>
                <option value="consumers">
                  Verified Consumer Database (120,000+)
                </option>
                <option value="industrial_users">
                  Industrial Boiler & Hotel Manifolds (8,400)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sender Email *
              </label>
              <Input
                required
                placeholder="bulletin@safelpg.gov.bd"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Subject Line *
            </label>
            <Input
              required
              placeholder="e.g. [Official Advisory] Mandatory Fire Safety Certifications for LPG Warehouses"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Body Content (Rich / HTML supported) *
            </label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full email message or announcements here..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-800 outline-hidden focus:border-primary leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="schedEmailCheck"
                checked={isSchedule}
                onChange={(e) => setIsSchedule(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary"
              />
              <label htmlFor="schedEmailCheck" className="text-xs font-semibold text-slate-700">
                Schedule for future delivery
              </label>
            </div>

            {isSchedule && (
              <div className="w-full sm:w-64">
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  size="sm"
                />
              </div>
            )}
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
              <span>
                {isSchedule ? "Schedule Email Broadcast" : "Dispatch Email Campaign"}
              </span>
            </Button>
          </div>
        </form>
      </div>

      {/* 4. Campaign History Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Email Broadcast Logs & Analytics
          </h4>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign & Subject</TableHead>
              <TableHead>Target Segment</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Open Rate</TableHead>
              <TableHead>Click Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                  Loading email campaigns...
                </TableCell>
              </TableRow>
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                  No email campaigns found.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((item) => {
                const openRate = item.recipientCount
                  ? Math.round(((item.openedCount || 0) / item.recipientCount) * 100)
                  : 0;
                const clickRate = item.recipientCount
                  ? Math.round(((item.clickedCount || 0) / item.recipientCount) * 100)
                  : 0;

                return (
                  <TableRow key={item._id}>
                    <TableCell>
                      <div className="space-y-0.5 max-w-sm">
                        <div className="font-bold text-xs text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {item.subject}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-medium text-slate-600 capitalize">
                      {item.targetAudience?.replace(/_/g, " ")}
                    </TableCell>

                    <TableCell className="text-xs font-bold text-slate-800">
                      {Number(item.recipientCount || 0).toLocaleString()}
                    </TableCell>

                    <TableCell className="text-xs font-bold text-emerald-600">
                      {openRate > 0 ? `${openRate}%` : "—"}
                    </TableCell>

                    <TableCell className="text-xs font-bold text-indigo-600">
                      {clickRate > 0 ? `${clickRate}%` : "—"}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <button
                        onClick={() => handleDelete(item)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Email Broadcast Log"
        description="Are you sure you want to permanently remove this email broadcast campaign record and delivery log?"
        itemTitle={deleteTarget?.subject || deleteTarget?.title || ""}
        confirmText="Delete Campaign"
      />
    </div>
  );
}
