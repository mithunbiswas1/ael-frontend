// src/components/ui/AdminPageHeader.jsx
"use client";

import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { H3, P } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

export function AdminPageHeader({
  icon: Icon,
  title,
  description,
  badge,
  action,
  actionLabel,
  onActionClick,
  actionIcon: ActionIcon = FaPlus,
  actionVariant = "primary",
  actionDisabled = false,
  className,
  children,
}) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-6 w-6 text-primary shrink-0" />}
          <H3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </H3>
          {badge !== undefined && badge !== null && (
            <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {badge}
            </span>
          )}
        </div>
      </div>

      {action ||
        (actionLabel && (
          <Button
            type="button"
            onClick={onActionClick}
            variant={actionVariant}
            size="default"
            disabled={actionDisabled}
            className="gap-2"
          >
            {ActionIcon && <ActionIcon className="h-3.5 w-3.5" />}
            <span>{actionLabel}</span>
          </Button>
        )) ||
        children}
    </div>
  );
}

export default AdminPageHeader;
