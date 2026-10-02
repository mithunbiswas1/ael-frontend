// src/app/(pages)/newsletter/unsubscribe/_components/UnsubscribeModal.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailWarning, CheckCircle2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import Input from "@/components/ui/Input";
import { H3, P } from "@/components/ui/Typography";
import {
  useUnsubscribeNewsletterMutation,
  useSubscribeNewsletterMutation,
} from "@/redux/api/newsletterApi";

export default function UnsubscribeModal({ initialEmail = "", locale = "en" }) {
  const router = useRouter();
  const isBn = locale === "bn";

  const [email, setEmail] = useState(initialEmail);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const [unsubscribe, { isLoading: isUnsubscribing }] =
    useUnsubscribeNewsletterMutation();
  const [resubscribe, { isLoading: isResubscribing }] =
    useSubscribeNewsletterMutation();

  // Handle Unsubscribe Action
  const handleConfirmUnsubscribe = async (e) => {
    e?.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error(
        isBn
          ? "অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা প্রদান করুন"
          : "Please provide a valid email address"
      );
      return;
    }

    try {
      await unsubscribe({ email: email.trim().toLowerCase() }).unwrap();
      setIsUnsubscribed(true);
      toast.success(
        isBn
          ? "আপনি সফলভাবে নিউজলেটার আনসাবস্ক্রাইব করেছেন।"
          : "You have been successfully unsubscribed from the newsletter."
      );
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (isBn
            ? "আনসাবস্ক্রাইব ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
            : "Failed to unsubscribe. Please try again.")
      );
    }
  };

  // Handle Resubscribe Action
  const handleResubscribe = async () => {
    try {
      await resubscribe({ email: email.trim().toLowerCase() }).unwrap();
      setIsUnsubscribed(false);
      toast.success(
        isBn
          ? "আপনাকে আবারও নিউজলেটারে স্বাগতম!"
          : "Welcome back! You have resubscribed to the newsletter."
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resubscribe");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    router.push("/");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-slate-50/50">
      {/* Fallback card if modal is dismissed */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <Mail className="h-6 w-6" />
        </div>
        <H3 className="mt-4 text-lg font-bold text-slate-900">
          {isBn ? "নিউজলেটার সেটিংস" : "Newsletter Preferences"}
        </H3>
        <P className="mt-1 text-xs text-slate-500">
          {isBn
            ? "আপনার নিউজলেটার সাবস্ক্রিপশন পরিচালনা করুন"
            : "Manage your email subscriptions and safety notifications"}
        </P>
        <div className="mt-6 flex flex-col gap-2.5">
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsOpen(true)}
            fullWidth
          >
            {isBn ? "আনসাবস্ক্রাইব পপআপ খুলুন" : "Open Unsubscribe Dialog"}
          </Button>
          <LinkButton href="/" variant="outline" fullWidth>
            {isBn ? "হোমপেজে ফিরে যান" : "Return to Homepage"}
          </LinkButton>
        </div>
      </div>

      {/* Main Unsubscribe Confirmation Popup Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        maxWidth="md"
        showCloseButton={true}
        title={
          isUnsubscribed
            ? isBn
              ? "আনসাবস্ক্রিপশন সম্পন্ন"
              : "Unsubscribed Successfully"
            : isBn
              ? "নিউজলেটার আনসাবস্ক্রাইব করবেন?"
              : "Unsubscribe from Newsletter?"
        }
      >
        {!isUnsubscribed ? (
          <form onSubmit={handleConfirmUnsubscribe}>
            <DialogBody className="space-y-4">
              {/* Alert Badge Icon */}
              <div className="flex items-center gap-3 rounded-xl bg-rose-50 border border-rose-200/70 p-3.5 text-rose-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                  <MailWarning className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">
                    {isBn ? "নিউজলেটার আনসাবস্ক্রিপশন" : "Stop Email Updates"}
                  </h4>
                  <p className="text-[11px] text-rose-700/90 mt-0.5 leading-relaxed">
                    {isBn
                      ? "আপনি কি নিশ্চিত যে আপনি আর কোনো নিরাপত্তা নির্দেশিকা বা মূল্য সংক্রান্ত বুলেটিন পেতে চান না?"
                      : "Are you sure you want to stop receiving safety directives, BERC price notices, and industry updates?"}
                  </p>
                </div>
              </div>

              {/* Email Address Input / Display */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "আপনার ইমেইল ঠিকানা *" : "Your Email Address *"}
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={isUnsubscribing}
                />
              </div>

              <P className="text-[11px] text-slate-400 leading-relaxed">
                {isBn
                  ? "আনসাবস্ক্রাইব করার পর আপনি যেকোনো সময় আমাদের ওয়েবসাইট থেকে পুনরায় সাবস্ক্রাইব করতে পারবেন।"
                  : "You can resubscribe at any time from our website footer whenever you wish to receive updates again."}
              </P>
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
              >
                <span>{isBn ? "না, সাবস্ক্রাইব রাখুন" : "No, Keep My Subscription"}</span>
              </Button>

              <Button
                type="submit"
                variant="danger"
                size="sm"
                disabled={isUnsubscribing}
                isLoading={isUnsubscribing}
              >
                <span>{isBn ? "হ্যাঁ, আনসাবস্ক্রাইব করুন" : "Yes, Unsubscribe"}</span>
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div>
            <DialogBody className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <H3 className="text-base font-bold text-slate-900">
                {isBn
                  ? "সফলভাবে আনসাবস্ক্রাইব করা হয়েছে"
                  : "You Have Been Unsubscribed"}
              </H3>
              <P className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {isBn ? (
                  <>
                    <strong className="font-semibold text-slate-800">{email}</strong> ইমেইলে আর কোনো স্বয়ংক্রিয় নিউজলেটার ইমেইল পাঠানো হবে না।
                  </>
                ) : (
                  <>
                    No further automated newsletter emails will be sent to{" "}
                    <strong className="font-semibold text-slate-800">{email}</strong>.
                  </>
                )}
              </P>
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResubscribe}
                disabled={isResubscribing}
                isLoading={isResubscribing}
              >
                <span>{isBn ? "পুনরায় সাবস্ক্রাইব করুন" : "Resubscribe"}</span>
              </Button>

              <LinkButton href="/" variant="primary" size="sm">
                <span>{isBn ? "হোমপেজে ফিরে যান" : "Return to Homepage"}</span>
              </LinkButton>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </div>
  );
}
