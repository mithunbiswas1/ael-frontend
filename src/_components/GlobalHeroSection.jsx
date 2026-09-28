// src/_components/GlobalHeroSection.jsx
"use client";

import VisualHeroBanner from "@/components/ui/VisualHeroBanner";

/**
 * GlobalHeroSection aliases VisualHeroBanner for seamless backward compatibility.
 */
export default function GlobalHeroSection(props) {
  return <VisualHeroBanner {...props} />;
}
