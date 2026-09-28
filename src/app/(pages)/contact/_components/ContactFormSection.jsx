"use client";

import { useState } from "react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { useDictionary } from "@/context/DictionaryContext";
import { useSubmitContactMessageMutation } from "@/redux/api/pageApi";

export default function ContactFormSection() {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const contact = dict?.contact || {};

  const [submitContactMessage, { isLoading: isSubmitting }] =
    useSubmitContactMessageMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(
        isBn
          ? "অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।"
          : "Please fill in all required fields."
      );
      return;
    }

    try {
      await submitContactMessage({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      }).unwrap();

      toast.success(
        isBn
          ? "ধন্যবাদ! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে।"
          : "Thank you! Your inquiry has been submitted successfully."
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (isBn ? "বার্তা পাঠাতে ব্যর্থ হয়েছে।" : "Failed to send message.")
      );
    }
  };

  const subjectOptions = isBn
    ? [
        { value: "Safety Incident Inquiry", label: "নিরাপত্তা ও দুর্ঘটনা সংক্রান্ত তথ্য" },
        { value: "Training & LMS Certification", label: "প্রশিক্ষণ ও সার্টিফিকেট সংক্রান্ত" },
        { value: "Dealer Regulatory Compliance", label: "ডিলার কমপ্লায়েন্স ও লাইসেন্সিং" },
        { value: "Auto Gas Operational Safety", label: "অটো গ্যাস অপারেশনাল নিরাপত্তা" },
        { value: "General Support", label: "সাধারণ সহায়তা" },
      ]
    : [
        { value: "Safety Incident Inquiry", label: "Safety Incident Inquiry" },
        { value: "Training & LMS Certification", label: "Training & LMS Certification" },
        { value: "Dealer Regulatory Compliance", label: "Dealer Regulatory Compliance" },
        { value: "Auto Gas Operational Safety", label: "Auto Gas Operational Safety" },
        { value: "General Support", label: "General Support" },
      ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7">
      <SectionHeader
        tag={isBn ? "সরাসরি যোগাযোগ" : "DIRECT INQUIRY"}
        title={isBn ? "আমাদের" : "GET IN"}
        accent={isBn ? "বার্তা পাঠান।" : "TOUCH."}
        subtitle={
          contact.formSubtitle ||
          (isBn
            ? "আপনার বার্তা পাঠান এবং আমাদের নিরাপত্তা সমন্বয়কারী কর্মকর্তা দ্রুত আপনার সাথে যোগাযোগ করবেন।"
            : "Send us a message and our safety coordination officers will follow up promptly.")
        }
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={contact.nameLabel || (isBn ? "পুরো নাম" : "Full Name")}
            required
            placeholder={
              contact.namePlaceholder || (isBn ? "উদাঃ মোঃ আনোয়ার হোসেন" : "e.g. Md. Anwar Hossain")
            }
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            variant="filled"
          />

          <Input
            label={contact.emailLabel || (isBn ? "ইমেইল ঠিকানা" : "Email Address")}
            type="email"
            required
            placeholder={
              contact.emailPlaceholder || (isBn ? "উদাঃ anwar@domain.com" : "e.g. anwar@domain.com")
            }
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            variant="filled"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={contact.phoneLabel || (isBn ? "মোবাইল নম্বর" : "Phone Number")}
            type="tel"
            required
            placeholder={contact.phonePlaceholder || "+880 1XXXXXXXXX"}
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            variant="filled"
          />

          <Select
            label={contact.subjectLabel || (isBn ? "অনুসন্ধানের বিষয়" : "Inquiry Subject")}
            required
            value={formData.subject}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, subject: e.target.value }))
            }
            placeholder={isBn ? "বিষয় নির্বাচন করুন" : "Select Topic"}
            variant="filled"
            options={subjectOptions}
          />
        </div>

        <Textarea
          label={contact.messageLabel || (isBn ? "আপনার বার্তা" : "Your Message")}
          required
          rows={4}
          placeholder={
            contact.messagePlaceholder ||
            (isBn
              ? "আপনার প্রশ্ন বা ঘটনার বিবরণ বিস্তারিতভাবে লিখুন..."
              : "Provide details about your query or incident context...")
          }
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          variant="filled"
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full text-xs font-bold uppercase tracking-wider shadow-xs"
        >
          {isSubmitting
            ? contact.submitting || (isBn ? "পাঠানো হচ্ছে..." : "Sending...")
            : contact.submitBtn || (isBn ? "বার্তা পাঠান" : "Submit Message")}
        </Button>
      </form>
    </div>
  );
}
