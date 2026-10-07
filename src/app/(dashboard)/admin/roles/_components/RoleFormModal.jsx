// src/app/(dashboard)/admin/roles/_components/RoleFormModal.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SearchInput } from "@/components/ui/SearchInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { H3, H4, P } from "@/components/ui/Typography";
import { ROLE_PERMISSION_CATEGORIES } from "../_constants/roleMatrixCategories";
import {
  FaShieldAlt,
  FaCheckDouble,
  FaTimes,
  FaEye,
  FaSave,
  FaCheck,
  FaLayerGroup,
  FaInfoCircle,
} from "react-icons/fa";

const ACTION_LABELS = {
  view: { label: "View", color: "text-blue-600", bg: "bg-blue-50" },
  create: { label: "Create", color: "text-emerald-600", bg: "bg-emerald-50" },
  edit: { label: "Edit", color: "text-amber-600", bg: "bg-amber-50" },
  delete: { label: "Delete", color: "text-rose-600", bg: "bg-rose-50" },
};

export default function RoleFormModal({
  isOpen,
  onClose,
  role,
  onSave,
  isSaving,
}) {
  const isEditing = Boolean(role && role._id);

  const [formData, setFormData] = useState({
    name: "",
    label: "",
    description: "",
  });

  const [permissions, setPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("ALL");

  // Flattened pages list
  const allFlatPages = useMemo(() => {
    return ROLE_PERMISSION_CATEGORIES.flatMap((c) => c.pages);
  }, []);

  // Initialize form state when role changes or modal opens
  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        label: role.label || "",
        description: role.description || "",
      });
      setPermissions(Array.isArray(role.permissions) ? role.permissions : []);
    } else {
      setFormData({
        name: "",
        label: "",
        description: "",
      });
      setPermissions([]);
    }
    setSearchQuery("");
    setActiveCategoryFilter("ALL");
  }, [role, isOpen]);

  // Handle label change and auto-slugify name if creating
  const handleLabelChange = (val) => {
    setFormData((prev) => {
      const next = { ...prev, label: val };
      if (!isEditing) {
        next.name = val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "");
      }
      return next;
    });
  };

  // Helper: check if action is enabled for page
  const hasAction = (pagePath, actionKey) => {
    const perm = permissions.find((p) => p.page === pagePath);
    return Boolean(perm && perm.actions && perm.actions.includes(actionKey));
  };

  // Helper: check if all supported actions are enabled for a page
  const isPageFullAccess = (pageItem) => {
    return pageItem.actions.every((actionKey) => hasAction(pageItem.path, actionKey));
  };

  // Toggle single action for a page
  const toggleAction = (pageItem, actionKey) => {
    setPermissions((prev) => {
      const existingIdx = prev.findIndex((p) => p.page === pageItem.path);

      if (existingIdx === -1) {
        return [
          ...prev,
          {
            page: pageItem.path,
            module: pageItem.module,
            description: pageItem.description || "",
            actions: [actionKey],
          },
        ];
      }

      const existingPerm = prev[existingIdx];
      const currentlyHas = existingPerm.actions.includes(actionKey);

      let nextActions;
      if (currentlyHas) {
        nextActions = existingPerm.actions.filter((a) => a !== actionKey);
      } else {
        nextActions = [...existingPerm.actions, actionKey];
      }

      if (nextActions.length === 0) {
        return prev.filter((p) => p.page !== pageItem.path);
      }

      const updated = [...prev];
      updated[existingIdx] = {
        ...existingPerm,
        description: pageItem.description || existingPerm.description || "",
        actions: nextActions,
      };
      return updated;
    });
  };

  // Toggle all actions for a specific page
  const togglePageAllActions = (pageItem) => {
    const isFull = isPageFullAccess(pageItem);

    setPermissions((prev) => {
      if (isFull) {
        // Remove page
        return prev.filter((p) => p.page !== pageItem.path);
      } else {
        // Grant all supported actions
        const existingIdx = prev.findIndex((p) => p.page === pageItem.path);
        const newPerm = {
          page: pageItem.path,
          module: pageItem.module,
          description: pageItem.description || "",
          actions: [...pageItem.actions],
        };

        if (existingIdx === -1) {
          return [...prev, newPerm];
        } else {
          const updated = [...prev];
          updated[existingIdx] = newPerm;
          return updated;
        }
      }
    });
  };

  // Global Quick Action: Grant All Permissions
  const handleGrantAll = () => {
    const allPerms = allFlatPages.map((pg) => ({
      page: pg.path,
      module: pg.module,
      description: pg.description || "",
      actions: [...pg.actions],
    }));
    setPermissions(allPerms);
    toast.success("Granted full permissions across all pages!");
  };

  // Global Quick Action: View-Only All
  const handleViewOnlyAll = () => {
    const viewPerms = allFlatPages
      .filter((pg) => pg.actions.includes("view"))
      .map((pg) => ({
        page: pg.path,
        module: pg.module,
        description: pg.description || "",
        actions: ["view"],
      }));
    setPermissions(viewPerms);
    toast.success("Set all pages to View-Only permission!");
  };

  // Global Quick Action: Clear All
  const handleClearAll = () => {
    setPermissions([]);
    toast.info("Cleared all role permissions.");
  };

  // Category Quick Action: Toggle Category
  const toggleCategory = (categoryItem, enable) => {
    const categoryPaths = new Set(categoryItem.pages.map((p) => p.path));

    setPermissions((prev) => {
      if (!enable) {
        return prev.filter((p) => !categoryPaths.has(p.page));
      }

      const cleanPrev = prev.filter((p) => !categoryPaths.has(p.page));
      const categoryPerms = categoryItem.pages.map((pg) => ({
        page: pg.path,
        module: pg.module,
        description: pg.description || "",
        actions: [...pg.actions],
      }));
      return [...cleanPrev, ...categoryPerms];
    });
  };

  // Filter categories based on search and category filter
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ROLE_PERMISSION_CATEGORIES.map((cat) => {
      if (activeCategoryFilter !== "ALL" && cat.category !== activeCategoryFilter) {
        return { ...cat, pages: [] };
      }

      const matchingPages = cat.pages.filter((pg) => {
        if (!query) return true;
        return (
          pg.title.toLowerCase().includes(query) ||
          pg.description.toLowerCase().includes(query) ||
          pg.path.toLowerCase().includes(query) ||
          pg.module.toLowerCase().includes(query)
        );
      });

      return {
        ...cat,
        pages: matchingPages,
      };
    }).filter((cat) => cat.pages.length > 0);
  }, [searchQuery, activeCategoryFilter]);

  // Total active permissions count
  const totalEnabledPages = permissions.filter(
    (p) => p.actions && p.actions.length > 0
  ).length;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.label.trim()) {
      toast.error("Please provide a display name for the role");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please provide a valid role identifier code");
      return;
    }

    const payload = {
      name: formData.name.toLowerCase().trim(),
      label: formData.label.trim(),
      description: formData.description.trim(),
      permissions,
    };

    onSave(payload);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={isSaving ? () => {} : onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FaShieldAlt className="h-5 w-5" />
          </div>
          <div>
            <H3 className="text-base font-bold text-slate-900">
              {isEditing ? `Edit Role: ${role.label || role.name}` : "Create New Custom Role"}
            </H3>
            <P className="text-xs text-slate-500">
              {isEditing
                ? "Update display title, description and granular page permissions."
                : "Define organizational role name and assign page access privileges."}
            </P>
          </div>
        </div>
      }
      showCloseButton={!isSaving}
    >
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
        {/* Basic Details */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Role Display Label"
              placeholder="e.g. Publisher Admin, Support Officer"
              value={formData.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              required
              disabled={isSaving}
            />

            <div>
              <Input
                label="Role Identifier Code"
                placeholder="e.g. publisher_admin"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                  })
                }
                required
                disabled={isEditing || isSaving}
              />
              {isEditing ? (
                <p className="mt-1 text-[11px] text-slate-400">
                  System key is permanently fixed for existing roles to maintain database integrity.
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">
                  Unique programmatic identifier (lowercase and underscores).
                </p>
              )}
            </div>
          </div>

          <Textarea
            label="Role Purpose / Description"
            placeholder="Describe the operational scope, responsibilities and intended personnel for this role..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            disabled={isSaving}
          />
        </div>

        {/* Permission Matrix Header & Quick Actions */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <H4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Granular Permissions Matrix</span>
                <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-bold">
                  {totalEnabledPages} of {allFlatPages.length} Pages Enabled
                </span>
              </H4>
              <P className="text-xs text-slate-500 mt-0.5">
                Check individual action privileges for each admin module and CMS page.
              </P>
            </div>

            {/* Global Presets */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGrantAll}
                disabled={isSaving}
                className="text-[11px] h-8"
              >
                <FaCheckDouble className="mr-1 h-3 w-3 text-emerald-600" /> Grant All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewOnlyAll}
                disabled={isSaving}
                className="text-[11px] h-8"
              >
                <FaEye className="mr-1 h-3 w-3 text-blue-600" /> View Only
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={isSaving}
                className="text-[11px] h-8 text-rose-600 hover:text-rose-700"
              >
                <FaTimes className="mr-1 h-3 w-3" /> Clear
              </Button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <div className="flex-1 w-full">
              <SearchInput
                placeholder="Search modules (e.g. blogs, market updates, courses)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveCategoryFilter("ALL")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer ${
                  activeCategoryFilter === "ALL"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                All Categories
              </button>
              {ROLE_PERMISSION_CATEGORIES.map((c) => (
                <button
                  key={c.category}
                  type="button"
                  onClick={() => setActiveCategoryFilter(c.category)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors cursor-pointer ${
                    activeCategoryFilter === c.category
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {c.category.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions Categories List */}
        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <FaInfoCircle className="mx-auto h-7 w-7 text-slate-400 mb-2" />
              <P className="text-xs font-semibold text-slate-600">
                No modules match &quot;{searchQuery}&quot;
              </P>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategoryFilter("ALL");
                }}
                className="mt-2 text-xs text-primary"
              >
                Reset filters
              </Button>
            </div>
          ) : (
            filteredCategories.map((categoryItem) => {
              const activeCountInCategory = categoryItem.pages.filter((pg) => {
                const perm = permissions.find((p) => p.page === pg.path);
                return Boolean(perm && perm.actions && perm.actions.length > 0);
              }).length;

              return (
                <div
                  key={categoryItem.category}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <FaLayerGroup className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-bold text-slate-900">
                        {categoryItem.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {activeCountInCategory} / {categoryItem.pages.length} enabled
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => toggleCategory(categoryItem, true)}
                        className="text-primary hover:underline font-bold cursor-pointer"
                      >
                        Enable All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => toggleCategory(categoryItem, false)}
                        className="text-slate-500 hover:text-rose-600 font-bold cursor-pointer"
                      >
                        Disable All
                      </button>
                    </div>
                  </div>

                  {/* Pages Table */}
                  <div className="divide-y divide-slate-100">
                    {categoryItem.pages.map((pageItem) => {
                      const fullAccess = isPageFullAccess(pageItem);

                      return (
                        <div
                          key={pageItem.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 gap-3 hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Page Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {pageItem.title}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {pageItem.path}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              {pageItem.description}
                            </p>
                          </div>

                          {/* Action Checkboxes & Row Toggle */}
                          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                            {/* Action Checkboxes */}
                            <div className="flex items-center gap-3">
                              {pageItem.actions.map((actKey) => {
                                const checked = hasAction(pageItem.path, actKey);
                                const style = ACTION_LABELS[actKey] || {
                                  label: actKey,
                                  color: "text-slate-600",
                                  bg: "bg-slate-50",
                                };

                                return (
                                  <label
                                    key={actKey}
                                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors border ${
                                      checked
                                        ? `${style.bg} ${style.color} border-slate-300`
                                        : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleAction(pageItem, actKey)}
                                      disabled={isSaving}
                                      className="rounded border-slate-300 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                                    />
                                    <span>{style.label}</span>
                                  </label>
                                );
                              })}
                            </div>

                            {/* Row All Toggle */}
                            <button
                              type="button"
                              onClick={() => togglePageAllActions(pageItem)}
                              disabled={isSaving}
                              className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors cursor-pointer shrink-0 ${
                                fullAccess
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {fullAccess ? "Full Access" : "Grant All"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            className="gap-2"
          >
            <FaSave className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving Role..." : isEditing ? "Update Role" : "Create Role"}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
