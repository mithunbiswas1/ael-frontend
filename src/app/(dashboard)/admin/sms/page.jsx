// src/app/(dashboard)/admin/sms/page.jsx
"use client";

import { useState, useMemo } from "react";
import {
  MessageSquare,
  Send,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart2,
  Trash2,
  Smartphone,
  Globe,
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

export default function AdminSmsPage() {
  const [title, setTitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("dealers");
  const [senderId, setSenderId] = useState("SafeLPG-BD");
  const [message, setMessage] = useState("");
  const [isSchedule, setIsSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: campaignData, isLoading, refetch } = useGetCampaignsQuery({
    type: "sms",
  });
  const { data: statsData } = useGetCampaignStatsQuery();
  const [createCampaign, { isLoading: isSending }] = useCreateCampaignMutation();
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  const campaigns = campaignData?.data?.campaigns || [];
  const stats = statsData?.data || {
    totalSmsSent: 148500,
    overallSuccessRate: 98.4,
  };

  // Bangla Unicode detection & character metrics
  const isBanglaUnicode = useMemo(() => {
    return /[\u0980-\u09FF]/.test(message);
  }, [message]);

  const maxCharPerSms = isBanglaUnicode ? 70 : 160;
  const currentChars = message.length;
  const smsCount = currentChars === 0 ? 0 : Math.ceil(currentChars / maxCharPerSms);
  const charsRemainingInCurrent =
    currentChars === 0 ? maxCharPerSms : maxCharPerSms - (currentChars % maxCharPerSms || maxCharPerSms);

  const estimatedAudienceCount = useMemo(() => {
    switch (targetAudience) {
      case "dealers":
        return 64200;
      case "consumers":
        return 120500;
      case "industrial_users":
        return 8400;
      default:
        return 2350;
    }
  }, [targetAudience]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Please enter campaign title and SMS text.");
      return;
    }

    try {
      await createCampaign({
        type: "sms",
        title: title.trim(),
        targetAudience,
        senderId,
        messageContent: message.trim(),
        isSchedule,
        scheduledAt: isSchedule && scheduledAt ? new Date(scheduledAt) : new Date(),
      }).unwrap();

      toast.success(
        isSchedule
          ? "Bulk SMS scheduled successfully!"
          : "Bulk SMS broadcast initiated successfully!"
      );

      setTitle("");
      setMessage("");
      setIsSchedule(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to dispatch SMS campaign.");
    }
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await deleteCampaign(deleteTarget._id).unwrap();
      toast.success("Broadcast record removed.");
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
        icon={MessageSquare}
        title="Enterprise Bulk SMS Campaign Engine"
        description="Dispatch certified alerts and advisory SMS to 60,000+ licensed dealers and nationwide consumers with live operator routing."
      />

      {/* 2. Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Total SMS Broadcasted</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {Number(stats.totalSmsSent || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            ↑ Official BTRC Gateway
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Delivery Success Rate</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {stats.overallSuccessRate || 98.4}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Direct Tier-1 Telco Route</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Registered Dealers Reach</div>
          <div className="text-2xl font-black text-primary mt-1">64,200</div>
          <div className="text-[11px] text-slate-400 mt-1">64 Districts verified</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Sender Masking ID</div>
          <div className="text-2xl font-black text-slate-800 mt-1">SafeLPG-BD</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">BTRC Approved</div>
        </div>
      </div>

      {/* 3. Composer Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            <span>Compose Bulk Broadcast</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campaign Title / Internal Note *
                </label>
                <Input
                  required
                  placeholder="e.g. Safety Directive - High Pressure Manifolds"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sender Masking ID *
                </label>
                <select
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-hidden focus:border-primary"
                >
                  <option value="SafeLPG-BD">SafeLPG-BD (Official)</option>
                  <option value="AEL-NOTICE">AEL-NOTICE (Advisory)</option>
                  <option value="DOE-SAFETY">DOE-SAFETY (Govt Direct)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Recipient Segment *
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-hidden focus:border-primary"
              >
                <option value="dealers">
                  60,000+ Licensed LPG Dealers (Nationwide)
                </option>
                <option value="consumers">
                  Verified Consumer Database (120,000+ active)
                </option>
                <option value="industrial_users">
                  Industrial Boiler & Hotel Manifold Users (8,400)
                </option>
                <option value="all_subscribers">
                  Academy Enrolled Students & Subscribers (2,350)
                </option>
              </select>
            </div>

            {/* Message Body & Live Counter */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  SMS Text Content *
                </label>
                <div className="flex items-center gap-2 text-[11px]">
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      isBanglaUnicode
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {isBanglaUnicode ? "Bangla Unicode (70 chars/SMS)" : "Standard ASCII (160 chars/SMS)"}
                  </span>
                </div>
              </div>

              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your official broadcast message here... (e.g. জরুরি নির্দেশনা: লাইসেন্সকৃত সিলিন্ডার ক্রয় নিশ্চিত করুন। হেল্পলাইন: ১৬১৩৭।)"
                className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-800 outline-hidden focus:border-primary leading-relaxed"
              />

              {/* Dynamic Metrics Bar */}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-600">
                <div className="flex items-center gap-3">
                  <span>
                    Characters: <strong className="text-slate-900">{currentChars}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    SMS Parts:{" "}
                    <strong className="text-primary font-bold">{smsCount}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Remaining in part:{" "}
                    <strong className="text-slate-700">{charsRemainingInCurrent}</strong>
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Est. Audience:{" "}
                  <strong className="text-slate-900 font-bold">
                    {estimatedAudienceCount.toLocaleString()}
                  </strong>{" "}
                  Recipients
                </div>
              </div>
            </div>

            {/* Scheduling Checkbox */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="schedCheck"
                  checked={isSchedule}
                  onChange={(e) => setIsSchedule(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary"
                />
                <label htmlFor="schedCheck" className="text-xs font-semibold text-slate-700">
                  Schedule for later delivery
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
                  {isSchedule
                    ? "Schedule SMS Broadcast"
                    : `Dispatch to ${estimatedAudienceCount.toLocaleString()} Recipients`}
                </span>
              </Button>
            </div>
          </form>
        </div>

        {/* 4. Operator Routing & Preview Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Operator Route Allocation
            </h4>
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

          <div className="rounded-2xl border border-slate-200/80 bg-slate-900 text-white p-5 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Smartphone className="h-4 w-4" />
              <span>Recipient Handset Preview</span>
            </div>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-sans space-y-2">
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                <span>From: {senderId}</span>
                <span>Just Now</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
                {message || "Official message preview will appear here as you type..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Broadcast Log Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Recent Broadcast Dispatches
          </h4>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Title & Text</TableHead>
              <TableHead>Target Segment</TableHead>
              <TableHead>Sender Mask</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                  Loading broadcasts...
                </TableCell>
              </TableRow>
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                  No SMS campaigns found.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="space-y-0.5 max-w-sm">
                      <div className="font-bold text-xs text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 font-sans">
                        {item.messageContent}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-medium text-slate-600 capitalize">
                    {item.targetAudience?.replace(/_/g, " ")}
                  </TableCell>

                  <TableCell className="text-xs font-mono text-primary font-bold">
                    {item.senderId}
                  </TableCell>

                  <TableCell className="text-xs font-bold text-slate-800">
                    {Number(item.recipientCount || 0).toLocaleString()}
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
              ))
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
        title="Delete SMS Broadcast Log"
        description="Are you sure you want to permanently remove this broadcast campaign record and delivery log?"
        itemTitle={deleteTarget?.title || deleteTarget?.message?.slice(0, 30) || ""}
        confirmText="Delete Broadcast"
      />
    </div>
  );
}
