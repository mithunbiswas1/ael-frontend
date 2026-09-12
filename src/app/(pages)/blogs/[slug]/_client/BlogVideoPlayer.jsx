"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { toast } from "sonner";

export default function BlogVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
      <button
        type="button"
        onClick={() => {
          setIsPlaying(true);
          toast.info("Video playback demonstration started.");
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-xl transition-all hover:bg-white active:scale-95"
        title="Play Demonstration Video"
      >
        <Play className="h-6 w-6 fill-current translate-x-0.5" />
      </button>
    </div>
  );
}
