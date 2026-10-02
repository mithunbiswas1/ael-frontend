// src/components/ui/SafeImage.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function SafeImage({
  src,
  alt = "",
  fallbackSrc = "/default_image.jpg",
  onError,
  className = "",
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(
    src && typeof src === "string" && src.trim() !== "" ? src : fallbackSrc
  );

  useEffect(() => {
    setImgSrc(src && typeof src === "string" && src.trim() !== "" ? src : fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "Image"}
      className={className}
      onError={(e) => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
        if (e?.currentTarget) {
          e.currentTarget.src = fallbackSrc;
        }
        if (onError) onError(e);
      }}
    />
  );
}
