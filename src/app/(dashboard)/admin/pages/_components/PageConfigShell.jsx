// src/app/(dashboard)/admin/pages/_components/PageConfigShell.jsx
"use client";

import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { H1, H4, P } from "@/components/ui/Typography";
import { FaSave, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";

export default function PageConfigShell({
  pageKey,
  title,
  subtitle,
  previewUrl,
  tabs = [],
  activeTab,
  onTabChange,
  onSave,
  isSaving = false,
  children,
}) {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LinkButton
              href="/admin"
              variant="ghost"
              size="xs"
              className="text-slate-500 hover:text-slate-800 p-0 h-auto"
            >
              <FaArrowLeft className="h-3 w-3 mr-1" />
              <span>Admin</span>
            </LinkButton>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono font-bold text-primary uppercase">
              {pageKey}
            </span>
          </div>
          <H4 className="text-xl sm:text-2xl font-black text-slate-900">
            {title}
          </H4>
        </div>

        <div className="flex items-center justify-end gap-2.5 self-end sm:self-auto">
          {previewUrl && (
            <LinkButton
              href={previewUrl}
              target="_blank"
              variant="header-outline"
              size="sm"
              className="gap-1.5 text-xs font-bold"
            >
              <FaExternalLinkAlt className="h-3 w-3 text-slate-400" />
              <span>View Public Page</span>
            </LinkButton>
          )}

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="gap-2 font-bold"
          >
            {isSaving ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <FaSave className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs Row */}
      {tabs.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                type="button"
                variant={isActive ? "primary" : "secondary"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`gap-2 whitespace-nowrap text-xs font-bold transition-all ${isActive ?"" :"text-slate-600 hover:text-slate-900"
                  }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>
      )}

      {/* Tab Body */}
      <div>{children}</div>
    </div>
  );
}
