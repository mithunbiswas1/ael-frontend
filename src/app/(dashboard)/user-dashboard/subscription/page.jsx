// src/app/(dashboard)/user-dashboard/subscription/page.jsx
"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  FaCreditCard,
  FaCheckCircle,
  FaCrown,
  FaHistory,
  FaGraduationCap,
  FaClock,
  FaCalendarAlt,
  FaArrowRight,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";

import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { H3, P } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";
import {
  useGetMySubscriptionQuery,
  useGetSubscriptionPlansQuery,
} from "@/redux/api/subscriptionApi";
import CheckoutModal from "@/components/shared/CheckoutModal";

export default function UserSubscriptionPage() {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { user: authUser } = useSelector((state) => state.auth);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanForRenew, setSelectedPlanForRenew] = useState(null);

  const {
    data: mySubResponse,
    isLoading,
    refetch,
  } = useGetMySubscriptionQuery();

  const { data: plansResponse } = useGetSubscriptionPlansQuery();

  const subData = mySubResponse?.data;
  const userSub = subData?.subscription || authUser?.subscription || {};
  const isSubscriber = Boolean(subData?.isSubscriber);
  const rawPlans = plansResponse?.data || [];
  const history = Array.isArray(subData?.history) ? subData.history : [];
  const enrolledCourses = Array.isArray(subData?.enrolledCourses) ? subData.enrolledCourses : [];

  const remainingDays =
    userSub?.remainingDays !== undefined && userSub?.remainingDays !== null
      ? userSub.remainingDays
      : userSub?.expiresAt
        ? Math.max(
          0,
          Math.ceil(
            (new Date(userSub.expiresAt).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
          )
        )
        : null;

  const isExpired = userSub?.isExpired || (remainingDays !== null && remainingDays <= 0);
  const isExpiringSoon =
    userSub?.isExpiringSoon || (remainingDays !== null && remainingDays <= 7 && remainingDays > 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return isBn ? "প্রযোজ্য নয়" : "N/A";
    const d = new Date(dateStr);
    return isBn
      ? d.toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      : d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
  };

  const handleOpenRenew = (planObj = null) => {
    const defaultPlan =
      rawPlans.find((p) => p.planKey === (userSub?.planKey || "monthly")) ||
      rawPlans[0] ||
      null;
    setSelectedPlanForRenew(planObj || defaultPlan);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AdminPageHeader
        icon={FaCreditCard}
        title={isBn ? "আমার সাবস্ক্রিপশন ও কোর্স" : "My Subscription & Courses"}
        description={
          isBn
            ? "আপনার সাবস্ক্রিপশন মেয়াদ, অবশিষ্ট ব্যবহারের দিন এবং আজীবন কোর্স অ্যাক্সেসের বিস্তারিত।"
            : "View your subscription duration, remaining days of access, and lifetime enrolled courses."
        }
        action={
          <LinkButton
            href="/subscription"
            variant="outline"
            size="default"
            className="gap-2 bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
          >
            <FaCrown className="h-3.5 w-3.5 text-amber-500" />
            <span>{isBn ? "প্যাকেজ পরিবর্তন / নতুন প্যাকেজ" : "Browse All Plans"}</span>
          </LinkButton>
        }
      />

      {/* 2. Content Body: Loading / Cards + History */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <P className="mt-3 text-xs">
            {isBn ? "সাবস্ক্রিপশনের তথ্য লোড হচ্ছে..." : "Loading subscription details..."}
          </P>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Validity & Access Overview Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FaClock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isBn ? "সাবস্ক্রিপশন অ্যাক্সেস" : "Subscription Access"}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {isSubscriber
                        ? userSub?.planName || (isBn ? "প্রিমিয়াম প্যাকেজ" : "Premium Package")
                        : isExpired
                          ? isBn
                            ? "মেয়াদোত্তীর্ণ সাবস্ক্রিপশন"
                            : "Expired Subscription"
                          : isBn
                            ? "ফ্রি সদস্য"
                            : "Free Member"}
                    </h3>
                  </div>
                </div>

                {/* Status Badge */}
                {isSubscriber ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                    <FaCheckCircle className="h-3 w-3 text-emerald-600" />
                    <span>{isBn ? "সক্রিয় অ্যাক্সেস" : "Active Access"}</span>
                  </span>
                ) : isExpired ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
                    <FaExclamationTriangle className="h-3 w-3 text-red-600" />
                    <span>{isBn ? "মেয়াদ শেষ" : "Expired"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    <span>{isBn ? "ফ্রি টিয়ার" : "Free Tier"}</span>
                  </span>
                )}
              </div>

              {/* Main Validity Metric: কত দিন ব্যবহার করতে পারবেন */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">
                      {isBn
                        ? "কত দিন ব্যবহার করতে পারবেন (অবশিষ্ট মেয়াদ):"
                        : "Remaining duration to use:"}
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span
                        className={`text-2xl sm:text-3xl font-black ${isSubscriber ? "text-primary" : "text-slate-500"
                          }`}
                      >
                        {isSubscriber && remainingDays !== null ? (
                          remainingDays > 730 ? (
                            <span>{isBn ? "আজীবন অ্যাক্সেস" : "Lifetime Access"}</span>
                          ) : (
                            <>
                              {remainingDays}{" "}
                              <span className="text-base font-bold text-slate-700">
                                {isBn ? "দিন বাকি" : "Days Left"}
                              </span>
                            </>
                          )
                        ) : isBn ? (
                          "০ দিন"
                        ) : (
                          "0 Days"
                        )}
                      </span>
                      {userSub?.totalDays && isSubscriber && remainingDays <= 730 ? (
                        <span className="text-xs text-slate-400 font-medium">
                          ({isBn
                            ? `মোট মেয়াদ: ${userSub.totalDays} দিন`
                            : `Total: ${userSub.totalDays} days`})
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
                    <div>
                      <span className="font-semibold text-slate-400">
                        {isBn ? "শুরু: " : "Started: "}
                      </span>
                      <span className="font-bold text-slate-700">
                        {formatDate(userSub?.startDate)}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400">
                        {isBn ? "মেয়াদ শেষ: " : "Expires: "}
                      </span>
                      <span className="font-bold text-slate-700">
                        {formatDate(userSub?.expiresAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar if active */}
                {isSubscriber && userSub?.totalDays > 0 && (
                  <div className="mt-3">
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isExpiringSoon ? "bg-amber-500" : "bg-primary"
                          }`}
                        style={{
                          width: `${Math.max(
                            5,
                            Math.min(
                              100,
                              ((userSub.totalDays - (remainingDays || 0)) / userSub.totalDays) *
                              100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1">
                      <span>
                        {isBn
                          ? `ব্যবহৃত: ${Math.max(
                            0,
                            userSub.totalDays - (remainingDays || 0)
                          )} দিন`
                          : `Used: ${Math.max(
                            0,
                            userSub.totalDays - (remainingDays || 0)
                          )} days`}
                      </span>
                      <span>
                        {isBn ? `বাকি: ${remainingDays || 0} দিন` : `Left: ${remainingDays || 0} days`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
              <span className="text-xs text-slate-500">
                {isSubscriber
                  ? isBn
                    ? "মেয়াদ আরও বাড়াতে চান?"
                    : "Want to extend validity?"
                  : isBn
                    ? "সকল কোর্সে অ্যাক্সেস পেতে চান?"
                    : "Want access to all courses?"}
              </span>
              <Button
                type="button"
                variant={isExpiringSoon || !isSubscriber ? "primary" : "outline"}
                size="sm"
                onClick={() => handleOpenRenew()}
                className="gap-1.5 text-xs font-bold"
              >
                <FaRedo className="h-3 w-3" />
                <span>
                  {isSubscriber
                    ? isBn
                      ? "মেয়াদ বাড়ান / রিনিউ"
                      : "Extend / Renew"
                    : isBn
                      ? "প্যাকেজ কিনুন"
                      : "Subscribe Now"}
                </span>
              </Button>
            </div>
          </div>

          {/* 3. পারচেজ ও এনরোলমেন্ট হিস্ট্রি (Purchase & Enrollment History) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-3 text-slate-700 px-1">
              <div className="flex items-center gap-2">
                <FaHistory className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  {isBn ? "পারচেজ ও এনরোলমেন্ট হিস্ট্রি" : "Purchase & Enrollment History"}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {isBn ? `মোট রেকর্ড: ${history.length}` : `Total records: ${history.length}`}
              </span>
            </div>

            {history.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400">
                <p className="text-xs">
                  {isBn
                    ? "কোনো পারচেজ বা এনরোলমেন্ট হিস্ট্রি পাওয়া যায়নি"
                    : "No purchase or enrollment records found"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => {
                  const isCourse =
                    item.type === "course_enrollment" ||
                    item.plan === "course_single" ||
                    item.billingCycle === "lifetime";
                  const itemExpiry = item.expiryDate || item.expiresAt;
                  const itemStart = item.createdAt || item.startDate;
                  const expDate = itemExpiry ? new Date(itemExpiry) : null;
                  const now = new Date();
                  const remDays = expDate
                    ? Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                    : null;
                  const isItemActive = isCourse
                    ? true
                    : item.status === "paid" && (!expDate || expDate > now);

                  const itemDuration = isCourse
                    ? isBn
                      ? "আজীবন অ্যাক্সেস"
                      : "Lifetime Access"
                    : item.billingCycle === "monthly" || item.plan === "monthly"
                      ? isBn
                        ? "৩০ দিন (১ মাস)"
                        : "30 Days (1 Month)"
                      : item.billingCycle === "half_yearly" || item.plan === "half_yearly"
                        ? isBn
                          ? "১৮০ দিন (৬ মাস)"
                          : "180 Days (6 Months)"
                        : item.billingCycle === "yearly" || item.plan === "yearly"
                          ? isBn
                            ? "৩৬৫ দিন (১ বছর)"
                            : "365 Days (1 Year)"
                          : isBn
                            ? "আজীবন মেয়াদ"
                            : "Lifetime Duration";

                  const matchingPlanObj = rawPlans.find((p) => p.planKey === item.plan);

                  return (
                    <div
                      key={item._id || item.transactionId}
                      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Item Info with Type Badge */}
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isCourse
                                ? "bg-emerald-50 text-emerald-600"
                                : isItemActive
                                  ? "bg-primary/10 text-primary"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                          >
                            {isCourse ? (
                              <FaGraduationCap className="h-5 w-5" />
                            ) : (
                              <FaCreditCard className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Type Badge */}
                              {isCourse ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                                  <FaGraduationCap className="h-2.5 w-2.5" />
                                  <span>{isBn ? "কোর্স এনরোলমেন্ট" : "Course Enrollment"}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                                  <FaCreditCard className="h-2.5 w-2.5" />
                                  <span>{isBn ? "সাবস্ক্রিপশন" : "Subscription"}</span>
                                </span>
                              )}

                              {/* Status Badge */}
                              {isItemActive ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                  <FaCheckCircle className="h-2.5 w-2.5 text-emerald-600" />
                                  {isBn ? "সক্রিয়" : "Active"}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                  {isBn ? "মেয়াদোত্তীর্ণ" : "Expired"}
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 mt-1">
                              {isBn
                                ? item.planNameBn || item.planName
                                : item.planName || "Item"}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              TXN: {item.transactionId || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Core Fields */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l lg:border-r border-slate-100 pt-3 lg:pt-0 lg:px-6 text-xs">
                          {/* 1. কবে কেনা */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              {isBn ? "কবে কেনা" : "Purchased"}
                            </span>
                            <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                              {formatDate(itemStart)}
                            </span>
                          </div>

                          {/* 2. মেয়াদ / কত দিনের কেনা */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              {isBn ? "মেয়াদ / সময়সীমা" : "Duration"}
                            </span>
                            <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                              {itemDuration}
                            </span>
                          </div>

                          {/* 3. পরিশোধিত মূল্য */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              {isBn ? "মূল্য" : "Amount Paid"}
                            </span>
                            <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                              {Number(item.grandTotal || item.amount || 0) > 0
                                ? `৳ ${Number(
                                  item.grandTotal || item.amount
                                ).toLocaleString()}`
                                : isBn
                                  ? "ফ্রি"
                                  : "FREE"}
                            </span>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="flex items-center gap-2">
                          {isCourse ? (
                            <LinkButton
                              href={
                                item.courseSlug
                                  ? `/courses/learn/${item.courseSlug}`
                                  : "/courses"
                              }
                              variant="outline"
                              size="xs"
                              className="text-xs font-bold gap-1 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                            >
                              <span>{isBn ? "কোর্সে যান" : "Go to Course"}</span>
                              <FaArrowRight className="h-2.5 w-2.5" />
                            </LinkButton>
                          ) : (
                            <Button
                              type="button"
                              variant={isItemActive && remDays <= 7 ? "danger" : "outline"}
                              size="xs"
                              onClick={() => handleOpenRenew(matchingPlanObj)}
                              className="text-xs font-bold"
                            >
                              <span>{isBn ? "রিনিউ" : "Renew"}</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal for Renewal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlanForRenew}
        onSuccess={() => {
          setIsCheckoutOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
