// src/components/shared/CommentSection.jsx
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { toast } from "sonner";
import {
  FaComments,
  FaReply,
  FaPaperPlane,
  FaLock,
  FaUserCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { H3, P } from "@/components/ui/Typography";
import {
  useGetCommentsByTargetQuery,
  useAddCommentMutation,
} from "@/redux/api/commentApi";

export default function CommentSection({
  targetId,
  targetType = "blog",
  targetTitle = "",
  locale = "en",
}) {
  const isBn = locale === "bn";
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  // Synchronously load user ID so on full page reload pending comments remain visible
  const [storedUserId, setStoredUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const u = JSON.parse(localStorage.getItem("user") || "null");
        if (u?._id || u?.id) {
          setStoredUserId(u._id || u.id);
        }
      } catch (e) { }
    }
  }, []);

  const activeUserId = user?._id || user?.id || storedUserId;

  const { data: commentsResponse, isLoading, refetch } = useGetCommentsByTargetQuery(
    { targetId, targetType, userId: activeUserId || undefined },
    { skip: !targetId }
  );

  const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation();

  const [content, setContent] = useState("");
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const comments = Array.isArray(commentsResponse?.data) ? commentsResponse.data : [];

  const handlePostComment = async (e, parentId = null) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error(isBn ? "মন্তব্য করতে অনুগ্রহ করে লগইন করুন।" : "Please sign in to post a comment.");
      return;
    }

    const textToSubmit = parentId ? replyContent : content;
    if (!textToSubmit || !textToSubmit.trim()) {
      toast.error(isBn ? "অনুগ্রহ করে মন্তব্যের বিবরণ লিখুন।" : "Please write a comment.");
      return;
    }

    try {
      await addComment({
        targetId,
        targetType,
        targetTitle,
        content: textToSubmit.trim(),
        parentId,
      }).unwrap();

      toast.success(
        isBn
          ? "আপনার মন্তব্য জমা দেওয়া হয়েছে। অ্যাডমিন অনুমোদনের পর তা ব্লগে প্রকাশিত হবে।"
          : "Your comment has been submitted and is pending admin approval."
      );

      if (parentId) {
        setReplyingToId(null);
        setReplyContent("");
      } else {
        setContent("");
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || (isBn ? "মন্তব্য পাঠাতে সমস্যা হয়েছে।" : "Failed to post comment"));
    }
  };

  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FaComments className="h-4 w-4" />
          </div>
          <div>
            <H3 className="text-base sm:text-lg font-bold text-slate-900">
              {isBn ? "আলোচনা ও মন্তব্য" : "Discussion & Comments"}
            </H3>
            <P className="text-xs text-slate-500">
              {isBn
                ? "শুধুমাত্র নিবন্ধিত সাবস্ক্রাইবাররা আলোচনায় অংশ নিতে পারেন।"
                : "Interactive comments section for verified subscribers."}
            </P>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-700">
          {comments.length} {isBn ? "টি মন্তব্য" : "Comments"}
        </span>
      </div>

      {/* Main Comment Input Box */}
      {isLoggedIn ? (
        <form onSubmit={(e) => handlePostComment(e, null)} className="mb-8 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-bold text-white text-[10px]">
              {(user?.fullName || user?.userName || "U")[0].toUpperCase()}
            </span>
            <span>
              {isBn ? "মন্তব্য লিখুন:" : "Comment as:"}{" "}
              <strong className="text-primary">{user?.fullName || user?.userName}</strong>
            </span>
          </div>

          <Textarea
            rows={3}
            placeholder={
              isBn
                ? "আপনার মতামত বা অভিজ্ঞতা লিখুন (প্রতি ঘণ্টায় সর্বোচ্চ ৫টি মন্তব্য)..."
                : "Share your thoughts or observations (max 5 comments/hour)..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-xs"
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting || !content.trim()}
              className="gap-2 shadow-xs"
            >
              <FaPaperPlane className="h-3 w-3" />
              <span>{isSubmitting ? (isBn ? "পাঠানো হচ্ছে..." : "Posting...") : isBn ? "মন্তব্য জমা দিন" : "Post Comment"}</span>
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5 text-center">
          <FaLock className="mx-auto h-6 w-6 text-primary mb-2" />
          <p className="text-xs font-bold text-slate-800">
            {isBn
              ? "মন্তব্য করার জন্য সাবস্ক্রাইবার লগইন প্রয়োজন"
              : "Subscriber Login Required to Comment"}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
            {isBn
              ? "আলোচনায় অংশ নিতে এবং মন্তব্য প্রদান করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।"
              : "Sign in with your subscriber account to join the discussion and share regulatory feedback."}
          </p>
          <Link
            href="/login"
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-all"
          >
            <span>{isBn ? "লগইন করুন" : "Sign In to Comment"}</span>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-5">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">
            {isBn ? "মন্তব্য লোড হচ্ছে..." : "Loading comments..."}
          </div>
        ) : comments.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            {isBn
              ? "এখনও কোনো মন্তব্য করা হয়নি। প্রথম মন্তব্যকারী হোন!"
              : "No comments yet. Be the first to share your thoughts!"}
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:border-slate-200"
            >
              {/* Comment Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-bold text-xs text-slate-700">
                    {(comment.userFullName || comment.userName || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-xs text-slate-900">
                        {comment.userFullName || comment.userName}
                      </p>
                      {comment.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>{isBn ? "অনুমোদনের অপেক্ষায় (শুধু আপনি দেখতে পাচ্ছেন)" : "Pending Review (Only visible to you)"}</span>
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString(
                        isBn ? "bn-BD" : "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {isLoggedIn && comment.status === "approved" && (
                  <button
                    type="button"
                    onClick={() =>
                      setReplyingToId(
                        replyingToId === comment._id ? null : comment._id
                      )
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <FaReply className="h-2.5 w-2.5" />
                    <span>{isBn ? "উত্তর দিন" : "Reply"}</span>
                  </button>
                )}
              </div>

              {/* Comment Content */}
              <p className="mt-2.5 text-xs text-slate-700 leading-relaxed pl-10 whitespace-pre-line">
                {comment.content}
              </p>

              {/* Reply Form (1-level deep) */}
              {replyingToId === comment._id && (
                <form
                  onSubmit={(e) => handlePostComment(e, comment._id)}
                  className="mt-3 ml-10 space-y-2 border-l-2 border-primary/30 pl-3 pt-1"
                >
                  <Textarea
                    rows={2}
                    placeholder={
                      isBn
                        ? `@${comment.userName}-কে উত্তর লিখুন...`
                        : `Reply to @${comment.userName}...`
                    }
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="text-xs"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setReplyingToId(null)}
                      className="text-xs"
                    >
                      {isBn ? "বাতিল" : "Cancel"}
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="xs"
                      disabled={isSubmitting || !replyContent.trim()}
                    >
                      {isSubmitting ? (isBn ? "পাঠানো হচ্ছে..." : "Replying...") : isBn ? "উত্তর জমা দিন" : "Send Reply"}
                    </Button>
                  </div>
                </form>
              )}

              {/* Nested Replies Rendering */}
              {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <div className="mt-3 ml-8 space-y-2.5 border-l-2 border-slate-200 pl-3 pt-1">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply._id}
                      className="rounded-lg bg-white p-3 border border-slate-200/80 shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-bold text-[10px] text-primary">
                          {(reply.userFullName || reply.userName || "U")[0].toUpperCase()}
                        </div>
                        <p className="font-bold text-[11px] text-slate-800">
                          {reply.userFullName || reply.userName}
                        </p>
                        {reply.status === "pending" && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[8px] font-bold text-amber-700 border border-amber-200">
                            <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                            <span>{isBn ? "অনুমোদনের অপেক্ষায়" : "Pending Approval"}</span>
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-slate-400">
                          {new Date(reply.createdAt).toLocaleDateString(
                            isBn ? "bn-BD" : "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 pl-8 whitespace-pre-line">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
