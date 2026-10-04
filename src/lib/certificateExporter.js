// src/lib/certificateExporter.js
"use client";

import { toast } from "sonner";

/**
 * Loads an external script dynamically if not already loaded.
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"));
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve();
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Ensures html2canvas-pro (with support for modern CSS color functions: lab, oklch) is available
 */
async function ensureHtml2Canvas() {
  if (typeof window === "undefined") {
    throw new Error("No window context");
  }

  // If already loaded and supports modern color functions
  if (window.html2canvas && window.html2canvas.__supportsModernColors) {
    return window.html2canvas;
  }

  // Remove any legacy cdnjs html2canvas script tag if present
  const oldScript = document.querySelector(
    'script[src*="cdnjs.cloudflare.com/ajax/libs/html2canvas"]'
  );
  if (oldScript) {
    oldScript.remove();
  }

  // Load html2canvas-pro (local vendor first, with jsdelivr CDN fallback)
  try {
    await loadScript("/vendor/html2canvas-pro.min.js");
  } catch (err) {
    console.warn("Local html2canvas-pro load failed, trying CDN fallback:", err);
    await loadScript(
      "https://cdn.jsdelivr.net/npm/html2canvas-pro@latest/dist/html2canvas-pro.min.js"
    );
  }

  const h2c = window.html2canvas;
  if (!h2c) {
    throw new Error("html2canvas-pro library failed to initialize");
  }
  h2c.__supportsModernColors = true;
  return h2c;
}

/**
 * Ensures jsPDF is available in window
 */
async function ensureJsPdf() {
  if (typeof window !== "undefined" && window.jspdf?.jsPDF) {
    return window.jspdf.jsPDF;
  }
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  if (!window.jspdf?.jsPDF) {
    throw new Error("jsPDF library failed to initialize");
  }
  return window.jspdf.jsPDF;
}

/**
 * Capture certificate element as high-resolution HTML5 canvas
 */
async function captureCertificateCanvas(element) {
  const html2canvas = await ensureHtml2Canvas();

  // Capture with crystal-clear 3x resolution and modern color support
  const canvas = await html2canvas(element, {
    scale: 3, // 3x pixel ratio for crystal-clear 300 DPI print quality
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#FAF8F5",
    logging: false,
    windowWidth: 1400,
    onclone: (clonedDoc, clonedElement) => {
      if (clonedElement) {
        clonedElement.style.boxShadow = "none";
        clonedElement.style.margin = "0";
      }
    },
  });

  return canvas;
}

/**
 * Direct Image Download (.PNG) of ONLY the certificate
 */
export async function downloadCertificateAsImage(element, filename = "certificate") {
  if (!element) {
    toast.error("Certificate element not found for export");
    return;
  }

  const toastId = toast.loading("Generating high-resolution certificate image...");
  try {
    const canvas = await captureCertificateCanvas(element);
    const imgData = canvas.toDataURL("image/png", 1.0);

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = imgData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Certificate image downloaded successfully!", { id: toastId });
  } catch (err) {
    console.error("[downloadCertificateAsImage]", err);
    toast.error("Failed to generate image. Please try again.", { id: toastId });
  }
}

/**
 * Direct PDF Download (.PDF) of ONLY the certificate
 */
export async function downloadCertificateAsPdf(element, filename = "certificate") {
  if (!element) {
    toast.error("Certificate element not found for export");
    return;
  }

  const toastId = toast.loading("Rendering official certificate PDF...");
  try {
    const [canvas, jsPDF] = await Promise.all([
      captureCertificateCanvas(element),
      ensureJsPdf(),
    ]);

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Standard A4 Landscape: 297mm width x 210mm height
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    pdf.addImage(imgData, "JPEG", 0, 0, 297, 210, undefined, "FAST");
    pdf.save(`${filename}.pdf`);

    toast.success("Certificate PDF downloaded successfully!", { id: toastId });
  } catch (err) {
    console.error("[downloadCertificateAsPdf]", err);
    toast.error("Failed to generate PDF. Please try again.", { id: toastId });
  }
}

/**
 * Clean Print of ONLY the certificate (using isolated iframe)
 */
export function printCertificateOnly(element) {
  if (!element) {
    toast.error("Certificate element not found for print");
    return;
  }

  try {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Certificate</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: #FAF8F5;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100vw;
              height: 100vh;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #cert-container {
              width: 100%;
              height: 100%;
              max-width: 100%;
              max-height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          </style>
        </head>
        <body>
          <div id="cert-container">
            ${element.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  } catch (err) {
    console.error("[printCertificateOnly]", err);
    // Fallback to window.print()
    window.print();
  }
}
