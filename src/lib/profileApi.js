// src/lib/profileApi.js
import { API_BASE_URL } from "@/config/base-url";

export async function getCustomerProfile() {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const res = await fetch(`${API_BASE_URL}profile`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch customer profile");
  }
  return res.json();
}

export async function updateCustomerProfile(data) {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const isFormData = data instanceof FormData;
  const res = await fetch(`${API_BASE_URL}update-profile`, {
    method: "PATCH",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update profile");
  }
  return res.json();
}

export async function updateCustomerPassword(passwordData) {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const res = await fetch(`${API_BASE_URL}update-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(passwordData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update password");
  }
  return res.json();
}

export function createProfileFormData(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
}
