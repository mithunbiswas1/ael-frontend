// src/app/(home)/_client/NewsletterForm.jsx
"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NewsletterForm() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please provide both name and email address");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you for subscribing to our safety newsletter!");
      setFormData({ name: "", phone: "", email: "" });
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10 mt-4 space-y-2.5">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          variant="dark"
          required
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          variant="dark"
        />
      </div>

      <Input
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
        variant="dark"
        required
      />

      <Button type="submit" variant="primary" fullWidth disabled={loading} className="text-xs">
        <span>{loading ? "Subscribing..." : "Subscribe Now"}</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </form>
  );
}
