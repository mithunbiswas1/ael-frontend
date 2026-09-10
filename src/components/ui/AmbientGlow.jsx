// src/components/ui/AmbientGlow.jsx
import { cn } from "@/lib/cn";

export default function AmbientGlow({
  position = "both", // "both" | "top-left" | "bottom-right" | "center"
  color = "blue", // "blue" | "emerald" | "amber" | "cyan"
  className,
}) {
  const colorGlows = {
    blue: {
      left: "bg-blue-600/15",
      right: "bg-blue-500/10",
      center: "bg-blue-500/20",
    },
    emerald: {
      left: "bg-emerald-600/15",
      right: "bg-emerald-500/10",
      center: "bg-emerald-500/20",
    },
    amber: {
      left: "bg-amber-600/15",
      right: "bg-amber-500/10",
      center: "bg-amber-500/20",
    },
    cyan: {
      left: "bg-cyan-600/15",
      right: "bg-cyan-500/10",
      center: "bg-cyan-500/20",
    },
  };

  const selectedColor = colorGlows[color] || colorGlows.blue;

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {(position === "both" || position === "top-left") && (
        <div
          className={cn(
            "absolute -left-40 top-0 h-96 w-96 rounded-full blur-3xl",
            selectedColor.left,
          )}
        />
      )}

      {(position === "both" || position === "bottom-right") && (
        <div
          className={cn(
            "absolute -right-40 bottom-0 h-96 w-96 rounded-full blur-3xl",
            selectedColor.right,
          )}
        />
      )}

      {position === "center" && (
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full blur-3xl",
            selectedColor.center,
          )}
        />
      )}
    </div>
  );
}

export { AmbientGlow };
