// src/components/ui/AdminPageHeader.jsx
"use client";

import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { H3 } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

export function AdminPageHeader({
  icon: Icon,
  title,
  description,
  badge,
  action,
  actions,
  actionLabel,
  onActionClick,
  actionHref,
  actionIcon: ActionIcon = FaPlus,
  actionVariant = "primary",
  actionDisabled = false,
  secondaryActionLabel,
  secondaryActionHref,
  secondaryActionOnClick,
  secondaryActionIcon: SecondaryIcon,
  secondaryActionVariant = "header-outline",
  secondaryActionDisabled = false,
  className,
  children,
}) {
  const hasPrimary = Boolean(actionLabel && (onActionClick || actionHref));
  const hasSecondary = Boolean(
    secondaryActionLabel && (secondaryActionOnClick || secondaryActionHref)
  );

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5",
        className
      )}
    >
      {/* Left: Icon, Title, Badge & Subtitle */}
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="h-6 w-6 text-primary shrink-0" />}
          <H3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
            {title}
          </H3>
          {badge !== undefined && badge !== null && (
            <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary shrink-0">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Right: Actions Group */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Custom action / actions prop (if passed) */}
        {action || actions}

        {/* Standard Secondary Action (Outline / Auxiliary) */}
        {hasSecondary &&
          (secondaryActionHref ? (
            <LinkButton
              href={secondaryActionHref}
              variant={secondaryActionVariant}
              size="sm"
              disabled={secondaryActionDisabled}
              className="text-xs font-bold gap-1.5"
            >
              {SecondaryIcon && <SecondaryIcon className="h-3.5 w-3.5" />}
              <span>{secondaryActionLabel}</span>
            </LinkButton>
          ) : (
            <Button
              type="button"
              onClick={secondaryActionOnClick}
              variant={secondaryActionVariant}
              size="sm"
              disabled={secondaryActionDisabled}
              className="text-xs font-bold gap-1.5"
            >
              {SecondaryIcon && <SecondaryIcon className="h-3.5 w-3.5" />}
              <span>{secondaryActionLabel}</span>
            </Button>
          ))}

        {/* Standard Primary Action (Create / Primary) */}
        {hasPrimary &&
          (actionHref ? (
            <LinkButton
              href={actionHref}
              variant={actionVariant}
              size="sm"
              disabled={actionDisabled}
              className="text-xs font-bold gap-1.5"
            >
              {ActionIcon && <ActionIcon className="h-3.5 w-3.5" />}
              <span>{actionLabel}</span>
            </LinkButton>
          ) : (
            <Button
              type="button"
              onClick={onActionClick}
              variant={actionVariant}
              size="sm"
              disabled={actionDisabled}
              className="text-xs font-bold gap-1.5"
            >
              {ActionIcon && <ActionIcon className="h-3.5 w-3.5" />}
              <span>{actionLabel}</span>
            </Button>
          ))}

        {/* Children (if passed) */}
        {children}
      </div>
    </div>
  );
}

export default AdminPageHeader;
