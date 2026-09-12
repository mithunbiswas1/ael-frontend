"use client";

import { useState } from "react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";

export default function AcademyBulletinForm() {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Thank you for subscribing to training updates!");
    setNewsletterEmail("");
  };

  return (
    <form onSubmit={handleNewsletter} className="mt-2 flex max-w-md gap-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={newsletterEmail}
        onChange={(e) => setNewsletterEmail(e.target.value)}
        required
        className="flex-1"
      />
      <button
        type="submit"
        className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
      >
        Subscribe
      </button>
    </form>
  );
}
