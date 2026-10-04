// src/app/(dashboard)/admin/newsletter/_components/AddSubscriberDialog.jsx
"use client";

import { useState } from "react";
import { UserPlus, Upload, FileText, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { Dialog, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { toast } from "sonner";
import {
  useCreateNewsletterSubscriberMutation,
  useBulkCreateNewsletterSubscribersMutation,
} from "@/redux/api/newsletterApi";

export default function AddSubscriberDialog({ isOpen, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState("single"); // "single" | "bulk"

  // Single subscriber form state
  const [singleForm, setSingleForm] = useState({
    email: "",
    name: "",
    phone: "",
    isActive: true,
  });

  // Bulk CSV / Text state
  const [bulkText, setBulkText] = useState("");
  const [parsedRows, setParsedRows] = useState([]);
  const [fileName, setFileName] = useState("");

  const [createSubscriber, { isLoading: isCreatingSingle }] =
    useCreateNewsletterSubscriberMutation();
  const [bulkCreateSubscribers, { isLoading: isCreatingBulk }] =
    useBulkCreateNewsletterSubscribersMutation();

  // Helper to parse CSV/text lines into structured objects
  const parseCsvText = (text) => {
    if (!text || !text.trim()) {
      setParsedRows([]);
      return;
    }

    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const rows = [];

    lines.forEach((line, idx) => {
      // Split by comma (ignoring commas inside quotes if any)
      const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));
      const first = parts[0] || "";

      // Skip header row if it contains the word "email" literally
      if (idx === 0 && first.toLowerCase() === "email") {
        return;
      }

      // Check if first part looks like email, or maybe second part
      let email = "";
      let name = "";
      let phone = "";

      if (first.includes("@")) {
        email = first;
        name = parts[1] || "";
        phone = parts[2] || "";
      } else if (parts[1] && parts[1].includes("@")) {
        name = first;
        email = parts[1];
        phone = parts[2] || "";
      } else {
        email = first;
        name = parts[1] || "";
        phone = parts[2] || "";
      }

      const isValidEmail = Boolean(email && email.includes("@") && email.includes("."));

      rows.push({
        id: idx,
        email: email.toLowerCase(),
        name,
        phone,
        isValid: isValidEmail,
      });
    });

    setParsedRows(rows);
  };

  const handleBulkTextChange = (e) => {
    const val = e.target.value;
    setBulkText(val);
    parseCsvText(val);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result || "";
      setBulkText(content);
      parseCsvText(content);
    };
    reader.readAsText(file);
  };

  // Submit Single
  const handleSubmitSingle = async (e) => {
    e.preventDefault();
    if (!singleForm.email || !singleForm.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const res = await createSubscriber({
        email: singleForm.email.trim(),
        name: singleForm.name.trim(),
        phone: singleForm.phone.trim(),
        isActive: singleForm.isActive,
      }).unwrap();

      toast.success(res?.message || "Newsletter subscriber added successfully!");
      setSingleForm({ email: "", name: "", phone: "", isActive: true });
      onRefresh?.();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add subscriber");
    }
  };

  // Submit Bulk
  const handleSubmitBulk = async (e) => {
    e.preventDefault();
    const validRows = parsedRows.filter((r) => r.isValid);

    if (validRows.length === 0) {
      toast.error("No valid email addresses found to import");
      return;
    }

    try {
      const payload = validRows.map((r) => ({
        email: r.email,
        name: r.name,
        phone: r.phone,
      }));

      const res = await bulkCreateSubscribers({ subscribers: payload }).unwrap();
      toast.success(res?.message || `Successfully imported ${validRows.length} subscribers!`);
      setBulkText("");
      setParsedRows([]);
      setFileName("");
      onRefresh?.();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to bulk import subscribers");
    }
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Add Newsletter Subscribers"
    >
      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-slate-200 px-6 pt-2 bg-slate-50/50">
        <button
          type="button"
          onClick={() => setActiveTab("single")}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === "single"
            ? "border-primary text-primary bg-white shadow-2xs rounded-t-lg"
            : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
          <UserPlus className="h-4 w-4" />
          <span>Single Subscriber</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bulk")}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${activeTab === "bulk"
            ? "border-primary text-primary bg-white shadow-2xs rounded-t-lg"
            : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
        >
          <Upload className="h-4 w-4" />
          <span>Bulk CSV Upload</span>
        </button>
      </div>

      {activeTab === "single" ? (
        /* SINGLE SUBSCRIBER FORM */
        <form onSubmit={handleSubmitSingle}>
          <DialogBody className="space-y-4">
            <p className="text-xs text-slate-500">
              Add an individual subscriber to the newsletter database. Only the email address is mandatory.
            </p>

            <Input
              label="Email Address *"
              type="email"
              placeholder="e.g. subscriber@example.com"
              value={singleForm.email}
              onChange={(e) =>
                setSingleForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name (Optional)"
                placeholder="e.g. Md. Rahim Khan"
                value={singleForm.name}
                onChange={(e) =>
                  setSingleForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <Input
                label="Phone Number (Optional)"
                placeholder="e.g. +8801712345678"
                value={singleForm.phone}
                onChange={(e) =>
                  setSingleForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div>
                <p className="text-xs font-bold text-slate-800">Active Subscription</p>
                <p className="text-[11px] text-slate-500">
                  When active, this subscriber will receive newsletter broadcasts.
                </p>
              </div>
              <Switch
                checked={singleForm.isActive}
                onCheckedChange={(checked) =>
                  setSingleForm((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isCreatingSingle || !singleForm.email}
              isLoading={isCreatingSingle}
              icon={UserPlus}
            >
              Add Subscriber
            </Button>
          </DialogFooter>
        </form>
      ) : (
        /* BULK CSV / TEXT UPLOAD */
        <form onSubmit={handleSubmitBulk}>
          <DialogBody className="space-y-4">
            {/* Guide Card */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <FileText className="h-4 w-4" />
                <span>CSV / Text File Structure</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Columns order: <strong className="text-slate-900 font-mono">email, name, phone</strong>
                <br />
                <span className="text-emerald-700 font-semibold">
                  Note: Only <code>email</code> is required. <code>name</code> and <code>phone</code> are optional.
                </span>
              </p>
            </div>

            {/* File Upload Zone */}
            <div className="flex items-center gap-3">
              <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer group">
                <Upload className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors mb-1" />
                <span className="text-xs font-bold text-slate-700">
                  {fileName ? (
                    <span className="text-primary font-mono">{fileName}</span>
                  ) : (
                    "Upload .CSV or .TXT file"
                  )}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Click to select CSV from computer
                </span>
                <input
                  type="file"
                  accept=".csv,.txt,.tsv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {bulkText && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBulkText("");
                    setParsedRows([]);
                    setFileName("");
                  }}
                  className="text-red-500 hover:text-red-700 shrink-0"
                  icon={Trash2}
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Direct Paste Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Or Paste Multiple Email Lines Directly:
              </label>
              <textarea
                rows={4}
                value={bulkText}
                onChange={handleBulkTextChange}
                placeholder={`user1@gmail.com, Rahim Khan, 01711223344\nuser2@example.com, Sarah Ahmed\nuser3@org.bd`}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Live Parsing Stats & Preview Table */}
            {parsedRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Parsed Preview</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{validCount} Valid</span>
                    </span>
                    {invalidCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                        <AlertCircle className="h-3 w-3" />
                        <span>{invalidCount} Invalid/Skipped</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold sticky top-0">
                      <tr>
                        <th className="py-1.5 px-3">#</th>
                        <th className="py-1.5 px-3">Email (Required)</th>
                        <th className="py-1.5 px-3">Name</th>
                        <th className="py-1.5 px-3">Phone</th>
                        <th className="py-1.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedRows.slice(0, 50).map((row, i) => (
                        <tr
                          key={row.id}
                          className={row.isValid ? "hover:bg-slate-50/60" : "bg-red-50/30"}
                        >
                          <td className="py-1.5 px-3 text-slate-400 font-mono">{i + 1}</td>
                          <td className="py-1.5 px-3 font-mono font-semibold text-slate-800">
                            {row.email || "<empty>"}
                          </td>
                          <td className="py-1.5 px-3 text-slate-600">{row.name || "-"}</td>
                          <td className="py-1.5 px-3 text-slate-600 font-mono">{row.phone || "-"}</td>
                          <td className="py-1.5 px-3 text-right">
                            {row.isValid ? (
                              <span className="text-emerald-600 font-bold">Valid</span>
                            ) : (
                              <span className="text-rose-500 font-bold">Invalid</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedRows.length > 50 && (
                    <div className="p-2 text-center text-[10px] text-slate-400 border-t border-slate-100 bg-slate-50">
                      Showing first 50 of {parsedRows.length} total parsed entries...
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isCreatingBulk || validCount === 0}
              isLoading={isCreatingBulk}
              icon={Upload}
            >
              Import {validCount} Subscriber{validCount === 1 ? "" : "s"}
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  );
}
