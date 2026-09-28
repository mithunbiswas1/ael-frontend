// src/app/(home)/_client/NewsletterForm.jsx
"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NewsletterForm({ dict = {}, locale = "en" }) {
  const isBn = locale === "bn";
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error(
        isBn
          ? "অনুগ্রহ করে আপনার নাম ও ইমেইল ঠিকানা প্রদান করুন"
          : "Please provide both name and email address"
      );
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(
        isBn
          ? "আমাদের নিরাপত্তা নিউজলেটার সাবস্ক্রাইব করার জন্য ধন্যবাদ!"
          : "Thank you for subscribing to our safety newsletter!"
      );
      setFormData({ name: "", phone: "", email: "" });
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10 mt-4 space-y-2.5">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input
          type="text"
          placeholder={isBn ? "আপনার নাম" : "Your Name"}
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          variant="dark"
          required
        />
        <Input
          type="tel"
          placeholder={isBn ? "মোবাইল নম্বর" : "Phone Number"}
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          variant="dark"
        />
      </div>

      <Input
        type="email"
        placeholder={isBn ? "ইমেইল ঠিকানা" : "Email Address"}
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        variant="dark"
        required
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={loading}
        className="text-xs"
      >
        <span>
          {loading
            ? isBn
              ? "সাবস্ক্রাইব হচ্ছে..."
              : "Subscribing..."
            : dict?.button || (isBn ? "এখনই সাবস্ক্রাইব করুন" : "Subscribe Now")}
        </span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </form>
  );
}
