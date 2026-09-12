"use client";

import { useState } from "react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your inquiry has been submitted successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Full Name"
          required
          placeholder="e.g. Md. Anwar Hossain"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          variant="filled"
        />

        <Input
          label="Email Address"
          type="email"
          required
          placeholder="e.g. anwar@domain.com"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          variant="filled"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Phone Number"
          type="tel"
          required
          placeholder="e.g. 01700-000000"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          variant="filled"
        />

        <Select
          label="Inquiry Subject"
          required
          value={formData.subject}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, subject: e.target.value }))
          }
          placeholder="Select Topic"
          variant="filled"
          options={[
            { value: "Safety Incident Inquiry", label: "Safety Incident Inquiry" },
            { value: "Training & LMS Certification", label: "Training & LMS Certification" },
            { value: "Dealer Regulatory Compliance", label: "Dealer Regulatory Compliance" },
            { value: "Auto Gas Operational Safety", label: "Auto Gas Operational Safety" },
            { value: "General Support", label: "General Support" },
          ]}
        />
      </div>

      <Textarea
        label="Your Message"
        required
        rows={4}
        placeholder="Provide details about your query or incident context..."
        value={formData.message}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, message: e.target.value }))
        }
        variant="filled"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Submit Message"}
      </button>
    </form>
  );
}
