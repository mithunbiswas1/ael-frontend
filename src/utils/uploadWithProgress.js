// src/utils/uploadWithProgress.js

import { API_BASE_URL } from "@/config/base-url";

export const MAX_VIDEO_UPLOAD_SIZE = 1024 * 1024 * 1024; // Exactly 1GB (1,073,741,824 bytes)
export const DEFAULT_UPLOAD_TIMEOUT = 15 * 60 * 1000; // 15 minutes (comfortably covers 10 minutes upload)

/**
 * Uploads large files (up to 1GB) with real-time percentage progress tracking
 * and extended timeout (15 minutes).
 *
 * @param {Object} options
 * @param {File} options.file - The File object to upload
 * @param {string} [options.fieldName="video"] - Multipart field name
 * @param {string} [options.url] - Endpoint URL (defaults to `${API_BASE_URL}courses/upload-video`)
 * @param {Function} [options.onProgress] - Callback: ({ percent, loadedMB, totalMB, loadedBytes, totalBytes }) => void
 * @param {number} [options.timeout=900000] - Timeout in milliseconds (default 15 minutes)
 * @returns {Promise<{ data: any, abort: Function }>}
 */
export function uploadVideoWithProgress({
  file,
  fieldName = "video",
  url = `${API_BASE_URL}courses/upload-video`,
  onProgress = null,
  timeout = DEFAULT_UPLOAD_TIMEOUT,
}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("কোনো ফাইল নির্বাচন করা হয়নি। / No file selected."));
    }

    if (file.size > MAX_VIDEO_UPLOAD_SIZE) {
      return reject(
        new Error(
          "ভিডিও ফাইল সাইজ সর্বোচ্চ ১জিবি (1GB) হতে পারবে। / Video file size must be within 1GB."
        )
      );
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append(fieldName, file);

    xhr.open("POST", url, true);
    xhr.timeout = timeout;

    // Attach Bearer token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }
    }

    // Real-time upload progress tracking
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
        const loadedMB = (event.loaded / (1024 * 1024)).toFixed(1);
        const totalMB = (event.total / (1024 * 1024)).toFixed(1);
        onProgress({
          percent,
          loadedMB,
          totalMB,
          loadedBytes: event.loaded,
          totalBytes: event.total,
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (onProgress) {
            onProgress({
              percent: 100,
              loadedMB: (file.size / (1024 * 1024)).toFixed(1),
              totalMB: (file.size / (1024 * 1024)).toFixed(1),
              loadedBytes: file.size,
              totalBytes: file.size,
            });
          }
          resolve(response);
        } catch (e) {
          resolve({ data: { videoUrl: xhr.responseText } });
        }
      } else {
        let errorMsg = "ভিডিও আপলোড ব্যর্থ হয়েছে। / Failed to upload video.";
        try {
          const res = JSON.parse(xhr.responseText);
          if (res?.message) errorMsg = res.message;
        } catch (_) {}
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "নেটওয়ার্ক ত্রুটি! অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করে পুনরায় চেষ্টা করুন।"
        )
      );
    };

    xhr.ontimeout = () => {
      reject(
        new Error(
          "আপলোড সময়সীমা অতিক্রম করেছে (১০+ মিনিট)। অনুগ্রহ করে ইন্টারনেট স্পিড চেক করুন।"
        )
      );
    };

    xhr.onabort = () => {
      reject(new Error("আপলোড বাতিল করা হয়েছে। / Upload cancelled."));
    };

    xhr.send(formData);
  });
}
