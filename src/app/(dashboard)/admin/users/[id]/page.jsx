// src/app/(dashboard)/admin/users/[id]/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  useGetUserByIdAdminQuery,
  useUpdateUserByAdminMutation,
} from "@/redux/api/userApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { H1, H2, H3, H4, P } from "@/components/ui/Typography";
import {
  FaArrowLeft,
  FaUserShield,
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaSave,
  FaCheckDouble,
  FaEye,
  FaTrashAlt,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCheckCircle,
  FaBan,
  FaExternalLinkAlt,
} from "react-icons/fa";

// Master list of all admin pages categorized for page-wise permission management
const ADMIN_PAGE_CATEGORIES = [
  {
    category: "Core Operations & LMS",
    pages: [
      {
        id: "admin_dashboard",
        title: "Admin Dashboard",
        path: "/admin",
        module: "analytics",
        description: "System overview, visitor analytics, key metrics and summaries",
      },
      {
        id: "blogs",
        title: "Blogs & Articles",
        path: "/admin/blogs",
        module: "blogs",
        description: "Publish, edit and manage industry articles and blog posts",
      },
      {
        id: "courses",
        title: "Courses & Curricula",
        path: "/admin/courses",
        module: "courses",
        description: "Course lessons, modules, pricing and video curricula",
      },
      {
        id: "certificates",
        title: "Certificates Issuance",
        path: "/admin/certificates",
        module: "certificates",
        description: "Learner certificates, serial validation and issue records",
      },
      {
        id: "users",
        title: "User Registry & Management",
        path: "/admin/users",
        module: "users",
        description: "Platform accounts, roles, access levels and user profiles",
      },
    ],
  },
  {
    category: "Communication & Marketing",
    pages: [
      {
        id: "messages",
        title: "Messages & Inquiries",
        path: "/admin/messages",
        module: "messages",
        description: "Contact form inquiries, customer support and communication",
      },
      {
        id: "comments",
        title: "Comments Moderation",
        path: "/admin/comments",
        module: "comments",
        description: "Public blog reader comments, moderation and replies",
      },
      {
        id: "advertisements",
        title: "Advertisements & Banners",
        path: "/admin/advertisements",
        module: "advertisements",
        description: "Hero promo banners, sidebars and sponsored placements",
      },
      {
        id: "sms",
        title: "Bulk SMS Broadcasting",
        path: "/admin/sms",
        module: "sms",
        description: "SMS gateway dispatch, templates and delivery tracking",
      },
      {
        id: "email",
        title: "Email Campaigns",
        path: "/admin/email",
        module: "email",
        description: "Email broadcasts, newsletters and subscriber lists",
      },
    ],
  },
  {
    category: "Data & Commercial Services",
    pages: [
      {
        id: "subscriptions",
        title: "Subscription Management",
        path: "/admin/subscriptions",
        module: "subscriptions",
        description: "Paid subscription tiers, membership validity and records",
      },
      {
        id: "database",
        title: "Large Database Directory",
        path: "/admin/database",
        module: "database",
        description: "LPG industry directory, company records and dataset files",
      },
      {
        id: "archive",
        title: "Archives & Documents",
        path: "/admin/archive",
        module: "archive",
        description: "Archived materials, historical documents and reports",
      },
    ],
  },
  {
    category: "Public Website CMS Pages",
    pages: [
      {
        id: "pages_home",
        title: "Home Page CMS",
        path: "/admin/pages/home",
        module: "pages_home",
        description: "Home hero slider, stats, featured sections and welcome text",
      },
      {
        id: "pages_about",
        title: "About Us CMS",
        path: "/admin/pages/about",
        module: "pages_about",
        description: "Mission, vision, leadership team and company profile content",
      },
      {
        id: "pages_blogs",
        title: "Blog Listing Page CMS",
        path: "/admin/pages/blogs",
        module: "pages_blogs",
        description: "Public blog catalog header, featured banners and categories",
      },
      {
        id: "pages_contact",
        title: "Contact Us CMS",
        path: "/admin/pages/contact",
        module: "pages_contact",
        description: "Official addresses, hotline numbers, email and maps",
      },
      {
        id: "pages_safety",
        title: "Safety Guidelines CMS",
        path: "/admin/pages/safety-guidelines",
        module: "pages_safety",
        description: "LPG cylinder safety manuals, handling guides and checklists",
      },
      {
        id: "pages_market",
        title: "LPG Market Updates CMS",
        path: "/admin/pages/market-updates",
        module: "pages_market",
        description: "Government pricing notices, market revisions and updates",
      },
      {
        id: "pages_courses",
        title: "Training & Quiz CMS",
        path: "/admin/pages/courses",
        module: "pages_courses",
        description: "LMS public landing page banner, introduction and FAQs",
      },
      {
        id: "pages_acts",
        title: "Acts & Rules CMS",
        path: "/admin/pages/acts-and-rules",
        module: "pages_acts",
        description: "Energy regulatory acts, gazette publications and rules",
      },
      {
        id: "pages_terms",
        title: "Terms & Conditions CMS",
        path: "/admin/pages/terms",
        module: "pages_terms",
        description: "Website terms of service, disclaimers and legal terms",
      },
      {
        id: "pages_privacy",
        title: "Privacy Policy CMS",
        path: "/admin/pages/privacy",
        module: "pages_privacy",
        description: "Data privacy regulations, cookie usage and privacy policy",
      },
      {
        id: "pages_faq",
        title: "FAQ & Help Center CMS",
        path: "/admin/pages/faq",
        module: "pages_faq",
        description: "Frequently asked questions and support answers",
      },
    ],
  },
];

const AVAILABLE_ACTIONS = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
];

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin (Full Unrestricted Platform Control)" },
  { value: "admin", label: "Admin (Standard Administrative Officer)" },
  { value: "course_admin", label: "Course Admin (LMS & Quiz Manager)" },
  { value: "editor", label: "Editor (Content & Article Author)" },
  { value: "moderator", label: "Moderator (Community & Comment Approver)" },
  { value: "author", label: "Author / Contributor" },
  { value: "subscriber", label: "Subscriber (Paid Enrolled Member)" },
  { value: "general_user", label: "General User (Standard Registered Account)" },
  { value: "customer", label: "Customer" },
];

const ROLE_COLOR_MAP = {
  super_admin: "bg-purple-100 text-purple-900 border-purple-300",
  admin: "bg-blue-100 text-blue-900 border-blue-300",
  course_admin: "bg-indigo-100 text-indigo-900 border-indigo-300",
  editor: "bg-teal-100 text-teal-900 border-teal-300",
  moderator: "bg-cyan-100 text-cyan-900 border-cyan-300",
  author: "bg-amber-100 text-amber-900 border-amber-300",
  subscriber: "bg-emerald-100 text-emerald-900 border-emerald-300",
  general_user: "bg-slate-100 text-slate-800 border-slate-300",
  customer: "bg-slate-100 text-slate-800 border-slate-300",
};

export default function UserPermissionsSlugPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id;

  const {
    data: userData,
    isLoading: isFetchingUser,
    refetch,
  } = useGetUserByIdAdminQuery(userId, { skip: !userId });

  const [updateUser, { isLoading: isSaving }] = useUpdateUserByAdminMutation();

  const user = userData?.data;

  // Local state for role and permissions
  const [selectedRole, setSelectedRole] = useState("general_user");
  const [isActive, setIsActive] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize state when user data is loaded
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role || "general_user");
      setIsActive(user.is_active !== false);
      setPermissions(Array.isArray(user.permissions) ? user.permissions : []);
      setHasChanges(false);
    }
  }, [user]);

  // Flattened pages list
  const allFlatPages = useMemo(() => {
    return ADMIN_PAGE_CATEGORIES.flatMap((c) => c.pages);
  }, []);

  // Helper: check if action is allowed for page
  const hasActionPermission = (pagePath, actionKey) => {
    if (selectedRole === "super_admin") return true;
    const pagePerm = permissions.find((p) => p.page === pagePath);
    return pagePerm ? pagePerm.actions.includes(actionKey) : false;
  };

  // Helper: check if page has any permissions granted
  const isPageEnabled = (pagePath) => {
    if (selectedRole === "super_admin") return true;
    const pagePerm = permissions.find((p) => p.page === pagePath);
    return Boolean(pagePerm && pagePerm.actions.length > 0);
  };

  // Toggle single action on a page
  const handleToggleAction = (pageItem, actionKey) => {
    if (selectedRole === "super_admin") {
      toast.info("Super Admin has unrestricted full access to all pages.");
      return;
    }

    setHasChanges(true);
    setPermissions((prev) => {
      const existingIdx = prev.findIndex((p) => p.page === pageItem.path);

      if (existingIdx === -1) {
        // Add new page permission with this action
        return [
          ...prev,
          {
            page: pageItem.path,
            module: pageItem.module,
            actions: [actionKey],
          },
        ];
      }

      const currentPerm = prev[existingIdx];
      const hasAction = currentPerm.actions.includes(actionKey);

      let updatedActions;
      if (hasAction) {
        updatedActions = currentPerm.actions.filter((a) => a !== actionKey);
      } else {
        updatedActions = [...currentPerm.actions, actionKey];
      }

      if (updatedActions.length === 0) {
        // Remove page if no actions remaining
        return prev.filter((p) => p.page !== pageItem.path);
      }

      const updated = [...prev];
      updated[existingIdx] = {
        ...currentPerm,
        actions: updatedActions,
      };
      return updated;
    });
  };

  // Toggle full access for an entire page
  const handleToggleWholePage = (pageItem) => {
    if (selectedRole === "super_admin") return;

    setHasChanges(true);
    setPermissions((prev) => {
      const existing = prev.find((p) => p.page === pageItem.path);
      const isCurrentlyFull =
        existing &&
        AVAILABLE_ACTIONS.every((act) => existing.actions.includes(act.key));

      if (isCurrentlyFull) {
        // Revoke page completely
        return prev.filter((p) => p.page !== pageItem.path);
      } else {
        // Grant all 4 actions on this page
        const filtered = prev.filter((p) => p.page !== pageItem.path);
        return [
          ...filtered,
          {
            page: pageItem.path,
            module: pageItem.module,
            actions: AVAILABLE_ACTIONS.map((a) => a.key),
          },
        ];
      }
    });
  };

  // Batch action: Grant full access to all admin pages
  const handleGrantAll = () => {
    if (selectedRole === "super_admin") return;
    setHasChanges(true);
    const fullPermissions = allFlatPages.map((pg) => ({
      page: pg.path,
      module: pg.module,
      actions: AVAILABLE_ACTIONS.map((a) => a.key),
    }));
    setPermissions(fullPermissions);
    toast.success("Granted full permissions on all admin pages!");
  };

  // Batch action: Grant read-only access to all admin pages
  const handleGrantReadOnly = () => {
    if (selectedRole === "super_admin") return;
    setHasChanges(true);
    const viewOnlyPermissions = allFlatPages.map((pg) => ({
      page: pg.path,
      module: pg.module,
      actions: ["view"],
    }));
    setPermissions(viewOnlyPermissions);
    toast.success("Set all pages to View Only access!");
  };

  // Batch action: Revoke all page permissions
  const handleRevokeAll = () => {
    if (selectedRole === "super_admin") return;
    setHasChanges(true);
    setPermissions([]);
    toast.info("All custom page permissions revoked.");
  };

  // Save changes
  const handleSave = async () => {
    if (!userId) return;

    try {
      await updateUser({
        userId,
        data: {
          role: selectedRole,
          is_active: isActive,
          permissions,
        },
      }).unwrap();

      toast.success(
        `User ${user?.fullName || user?.userName} role & permissions updated successfully!`
      );
      setHasChanges(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user permissions");
    }
  };

  if (isFetchingUser) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-slate-200">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <P className="mt-4 text-xs font-semibold text-slate-500">
          Loading user access profile...
        </P>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <FaBan className="mx-auto h-12 w-12 text-rose-500 mb-3" />
        <H2 className="text-base font-bold text-slate-900">User Not Found</H2>
        <P className="text-xs text-slate-500 mt-1 mb-4">
          The requested user record could not be found or has been removed.
        </P>
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            <FaArrowLeft className="mr-1.5 h-3 w-3" /> Back to User Registry
          </Button>
        </Link>
      </div>
    );
  }

  const initials = (user.fullName || user.userName || "U")
    .slice(0, 2)
    .toUpperCase();

  const isSuperAdminRole = selectedRole === "super_admin";

  return (
    <PermissionGuard module="users" action="edit">
      <div className="space-y-6 pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-primary transition-colors"
          >
            <FaArrowLeft className="h-3 w-3" />
            <span>Back to User Registry</span>
          </Link>

          {/* Quick status indicator */}
          {hasChanges && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Access Changes
            </span>
          )}
        </div>

        {/* User Profile Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* User Identity Details */}
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-primary/10">
                {user.image?.url ||
                  user.profilePhoto?.url ||
                  (typeof user.image === "string" && user.image) ? (
                  <Image
                    src={user.image?.url || user.profilePhoto?.url || user.image}
                    alt={user.fullName || user.userName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-bold text-lg text-primary">
                    {initials}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <H3 className="text-xl font-bold text-slate-900">
                    {user.fullName || "Unnamed User"}
                  </H3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-bold uppercase ${ROLE_COLOR_MAP[selectedRole] || ROLE_COLOR_MAP.general_user
                      }`}
                  >
                    <FaUserShield className="h-3 w-3" />
                    {selectedRole.replace("_", " ")}
                  </span>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                      <FaCheckCircle className="h-2.5 w-2.5" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                      <FaBan className="h-2.5 w-2.5" /> Inactive
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  @{user.userName || "no-username"}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <FaEnvelope className="h-3 w-3 text-slate-400" />
                    {user.email || "No email assigned"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono">
                    <FaPhone className="h-3 w-3 text-slate-400" />
                    {user.phone || "No phone"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-400">
                    <FaCalendarAlt className="h-3 w-3" />
                    Joined{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Role & Account Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="w-full sm:w-64">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Assign System Role
                </label>
                <Select
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    setHasChanges(true);
                  }}
                  options={ROLE_OPTIONS}
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Account Status
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsActive(!isActive);
                    setHasChanges(true);
                  }}
                  className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${isActive
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                    : "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100"
                    }`}
                >
                  {isActive ? (
                    <>
                      <FaCheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <FaBan className="h-3.5 w-3.5 text-rose-600" />
                      <span>Suspended</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col justify-end">
                <span className="block text-[11px] font-bold text-transparent select-none mb-1">
                  Save
                </span>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="h-10 px-5 text-xs font-bold gap-2 whitespace-nowrap"
                >
                  <FaSave className="h-3.5 w-3.5" />
                  <span>{isSaving ? "Saving Changes..." : "Save User Access"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Super Admin Notice Banner */}
        {isSuperAdminRole && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
            <FaShieldAlt className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <H4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                Super Admin Privilege Override Active
              </H4>
              <P className="text-xs text-purple-800 mt-0.5 leading-relaxed">
                Users assigned the <strong>Super Admin</strong> role have permanent, unrestricted
                master access to all pages, content modules, LMS courses, quiz grading, user
                accounts, system settings, and operations. Page permissions below are bypassed for
                this user.
              </P>
            </div>
          </div>
        )}

        {/* Action Controls & Batch Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div>
            <H3 className="text-sm font-bold text-slate-900">
              Admin Page Access & Action Permissions
            </H3>
          </div>

          {!isSuperAdminRole && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleGrantAll}
                className="gap-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 border-emerald-300"
              >
                <FaCheckDouble className="h-3 w-3" />
                <span>Grant All Pages</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleGrantReadOnly}
                className="gap-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 border-blue-300"
              >
                <FaEye className="h-3 w-3" />
                <span>Read Only (All)</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleRevokeAll}
                className="gap-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 border-rose-300"
              >
                <FaTrashAlt className="h-3 w-3" />
                <span>Revoke All</span>
              </Button>
            </div>
          )}
        </div>

        {/* Page Categories & Granular Matrices */}
        <div className="space-y-6">
          {ADMIN_PAGE_CATEGORIES.map((catGroup) => (
            <div
              key={catGroup.category}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <H4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  {catGroup.category}
                </H4>
                <span className="text-[11px] font-semibold text-slate-500">
                  {catGroup.pages.length} Pages
                </span>
              </div>

              {/* Pages Table */}
              <div className="divide-y divide-slate-100">
                {catGroup.pages.map((pg) => {
                  const isEnabled = isPageEnabled(pg.path);

                  return (
                    <div
                      key={pg.id}
                      className={`p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${isEnabled ? "bg-white" : "bg-slate-50/40"
                        }`}
                    >
                      {/* Page Info */}
                      <div className="max-w-md">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-xs ${isEnabled ? "text-slate-900" : "text-slate-500"
                              }`}
                          >
                            {pg.title}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {pg.path}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {pg.description}
                        </p>
                      </div>

                      {/* Granular Action Checkboxes */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        {/* Page master toggle */}
                        <button
                          type="button"
                          disabled={isSuperAdminRole}
                          onClick={() => handleToggleWholePage(pg)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${isSuperAdminRole || isEnabled
                            ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary hover:text-white"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                            } ${isSuperAdminRole ? "opacity-75 cursor-not-allowed" : ""}`}
                        >
                          {isEnabled || isSuperAdminRole ? (
                            <>
                              <FaCheck className="h-3 w-3" />
                              <span>Enabled</span>
                            </>
                          ) : (
                            <>
                              <FaTimes className="h-3 w-3 text-slate-400" />
                              <span>Disabled</span>
                            </>
                          )}
                        </button>

                        {/* 4 Standard Action Checkboxes */}
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                          {AVAILABLE_ACTIONS.map((action) => {
                            const isActionChecked = hasActionPermission(pg.path, action.key);

                            return (
                              <label
                                key={action.key}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer select-none transition-colors ${isSuperAdminRole || isActionChecked
                                  ? "bg-white text-slate-900 border border-slate-300 font-bold"
                                  : "text-slate-400 hover:text-slate-700"
                                  } ${isSuperAdminRole ? "cursor-not-allowed opacity-80" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  disabled={isSuperAdminRole}
                                  checked={isSuperAdminRole || isActionChecked}
                                  onChange={() => handleToggleAction(pg, action.key)}
                                  className="h-3.5 w-3.5 rounded text-primary focus:ring-primary border-slate-300 cursor-pointer"
                                />
                                <span className="capitalize">{action.label}</span>
                              </label>
                            );
                          })}
                        </div>

                        {/* Direct Page Link Preview */}
                        <Link
                          href={pg.path}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-100 transition-colors"
                          title={`Preview page ${pg.path}`}
                        >
                          <FaExternalLinkAlt className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">
              User: <span className="text-primary font-bold">{user.fullName || user.userName}</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">
              Role: <strong className="text-slate-900 capitalize">{selectedRole.replace("_", " ")}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/users">
              <Button type="button" variant="ghost" size="sm">
                Cancel
              </Button>
            </Link>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="gap-2 font-bold px-6"
            >
              <FaSave className="h-3.5 w-3.5" />
              <span>{isSaving ? "Saving..." : "Save Role & Permissions"}</span>
            </Button>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
