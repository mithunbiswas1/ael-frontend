// src/app/(dashboard)/admin/roles/page.jsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRolePermissionsMutation,
  useDeleteRoleMutation,
} from "@/redux/api/roleApi";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { H2, H3, H4, P } from "@/components/ui/Typography";
import RoleFormModal from "./_components/RoleFormModal";
import {
  FaShieldAlt,
  FaPlus,
  FaUserShield,
  FaLock,
  FaEdit,
  FaTrashAlt,
  FaUsers,
  FaCheckCircle,
  FaInfoCircle,
  FaLayerGroup,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function RolesManagementPage() {
  const { data: rolesData, isLoading, isError, refetch } = useGetRolesQuery();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRolePermissionsMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL"); // "ALL" | "SYSTEM" | "CUSTOM"

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState(null);

  const roles = rolesData?.data || [];

  // Summary counts
  const stats = useMemo(() => {
    const total = roles.length;
    const systemCount = roles.filter((r) => r.isSystem).length;
    const customCount = roles.filter((r) => !r.isSystem).length;
    const totalUsers = roles.reduce((acc, r) => acc + (r.userCount || 0), 0);
    return { total, systemCount, customCount, totalUsers };
  }, [roles]);

  // Filtered roles
  const filteredRoles = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return roles.filter((r) => {
      // Type filter
      if (typeFilter === "SYSTEM" && !r.isSystem) return false;
      if (typeFilter === "CUSTOM" && r.isSystem) return false;

      // Search query
      if (!query) return true;
      return (
        r.name.toLowerCase().includes(query) ||
        (r.label && r.label.toLowerCase().includes(query)) ||
        (r.description && r.description.toLowerCase().includes(query))
      );
    });
  }, [roles, searchTerm, typeFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingRole(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (role) => {
    setEditingRole(role);
    setIsFormModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (role) => {
    if (role.isSystem) {
      toast.error("System roles are protected and cannot be deleted.");
      return;
    }
    if (role.userCount > 0) {
      toast.error(
        `Cannot delete role '${role.label || role.name}' because ${role.userCount} user(s) are assigned to it. Reassign them first.`
      );
      return;
    }
    setDeletingRole(role);
    setIsDeleteModalOpen(true);
  };

  // Submit Save Role (Create or Update)
  const handleSaveRole = async (payload) => {
    try {
      if (editingRole && editingRole._id) {
        await updateRole({
          id: editingRole._id,
          data: {
            label: payload.label,
            description: payload.description,
            permissions: payload.permissions,
          },
        }).unwrap();
        toast.success(`Role '${payload.label}' updated successfully!`);
      } else {
        await createRole(payload).unwrap();
        toast.success(`Custom role '${payload.label}' created successfully!`);
      }
      setIsFormModalOpen(false);
      setEditingRole(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save role definition");
    }
  };

  // Confirm Delete Role
  const handleConfirmDelete = async () => {
    if (!deletingRole) return;

    try {
      await deleteRole(deletingRole._id).unwrap();
      toast.success(`Role '${deletingRole.label || deletingRole.name}' deleted successfully!`);
      setIsDeleteModalOpen(false);
      setDeletingRole(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete role");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        icon={FaShieldAlt}
        title="Roles & Access Control"
        description="Configure custom organizational roles, manage module and page access privileges, and define granular action permissions."
        badge={`${stats.total} Roles`}
        actionLabel="Create New Role"
        onActionClick={handleOpenCreate}
      />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Defined Roles</span>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <FaShieldAlt className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{stats.total}</p>
          <p className="mt-1 text-[11px] text-slate-400">Available across platform</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">System Protected</span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <FaLock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{stats.systemCount}</p>
          <p className="mt-1 text-[11px] text-slate-400">Core architecture roles</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Custom Staff Roles</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FaLayerGroup className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{stats.customCount}</p>
          <p className="mt-1 text-[11px] text-slate-400">Custom permission scopes</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Assigned Platform Users</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <FaUsers className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{stats.totalUsers}</p>
          <p className="mt-1 text-[11px] text-slate-400">Active member accounts</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search roles by name or key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setTypeFilter("ALL")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
              typeFilter === "ALL"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            All ({roles.length})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("CUSTOM")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
              typeFilter === "CUSTOM"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Custom Roles ({stats.customCount})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("SYSTEM")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
              typeFilter === "SYSTEM"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            System Protected ({stats.systemCount})
          </button>
        </div>
      </div>

      {/* Roles Grid / Cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-slate-200">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <P className="mt-4 text-xs font-semibold text-slate-500">
            Loading configured roles & permission matrices...
          </P>
        </div>
      ) : isError ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <FaInfoCircle className="mx-auto h-10 w-10 text-rose-500 mb-2" />
          <H3 className="text-base font-bold text-slate-900">Failed to load roles</H3>
          <P className="text-xs text-slate-500 mt-1 mb-4">
            Could not fetch role definitions from the server.
          </P>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <FaShieldAlt className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <H3 className="text-base font-bold text-slate-900">No Roles Found</H3>
          <P className="text-xs text-slate-500 mt-1 mb-4">
            {searchTerm
              ? `No roles match search "${searchTerm}"`
              : "No roles found matching the selected filter."}
          </P>
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <FaPlus className="mr-1.5 h-3 w-3" /> Create First Custom Role
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoles.map((roleItem) => {
            const isSystem = roleItem.isSystem;
            const isSuperAdmin = roleItem.name === "super_admin";
            const perms = Array.isArray(roleItem.permissions) ? roleItem.permissions : [];
            const userCount = roleItem.userCount || 0;

            return (
              <div
                key={roleItem._id || roleItem.name}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Title, Key, Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <H3 className="text-base font-bold text-slate-900">
                          {roleItem.label || roleItem.name}
                        </H3>
                        {isSystem ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-[10px] font-bold">
                            <FaLock className="h-2.5 w-2.5" /> System
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                            ★ Custom
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-slate-400 mt-0.5">
                        {roleItem.name}
                      </p>
                    </div>

                    {/* Assigned User Count Badge */}
                    <Link
                      href={`/admin/users?role=${roleItem.name}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors shrink-0 group"
                      title="View all users assigned to this role"
                    >
                      <FaUsers className="h-3 w-3 text-slate-400 group-hover:text-primary transition-colors" />
                      <span>{userCount} Users</span>
                      <FaExternalLinkAlt className="h-2.5 w-2.5 text-slate-300 group-hover:text-primary" />
                    </Link>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {roleItem.description || "No description provided for this role."}
                  </p>

                  {/* Permissions Summary Pills */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
                      <span>Assigned Page Permissions</span>
                      <span>
                        {isSuperAdmin
                          ? "All Pages (Master Access)"
                          : `${perms.length} Pages Configured`}
                      </span>
                    </div>

                    {isSuperAdmin ? (
                      <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100 text-[11px] text-purple-900 font-medium flex items-center gap-2">
                        <FaShieldAlt className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                        <span>
                          Super Admin has permanent root authority across all current and future modules.
                        </span>
                      </div>
                    ) : perms.length === 0 ? (
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-400 italic">
                        No administrative pages granted (Standard member scope).
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {perms.map((p, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                            title={`Actions: ${p.actions?.join(", ") || "view"}`}
                          >
                            <span className="font-semibold capitalize">
                              {p.module?.replace(/[-_]/g, " ") || p.page?.replace("/admin/", "")}
                            </span>
                            <span className="text-slate-400">
                              ({p.actions?.length || 1})
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    {roleItem.createdAt
                      ? `Created ${new Date(roleItem.createdAt).toLocaleDateString()}`
                      : "Core system preset"}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(roleItem)}
                      className="text-xs h-8 gap-1.5"
                    >
                      <FaEdit className="h-3 w-3 text-slate-500" />
                      <span>{isSystem && !isSuperAdmin ? "Configure Matrix" : "Edit"}</span>
                    </Button>

                    {!isSystem && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDelete(roleItem)}
                        disabled={userCount > 0}
                        title={
                          userCount > 0
                            ? `Cannot delete role with ${userCount} active users`
                            : "Delete this custom role"
                        }
                        className="text-xs h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2"
                      >
                        <FaTrashAlt className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Role Modal */}
      <RoleFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRole(null);
        }}
        role={editingRole}
        onSave={handleSaveRole}
        isSaving={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingRole(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Custom Role"
        itemTitle={deletingRole?.label || deletingRole?.name}
        description="Are you sure you want to delete this custom role? This action cannot be undone."
      />
    </div>
  );
}
