// src/app/(dashboard)/admin/users/page.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetUsersQuery,
  useUpdateUserByAdminMutation,
  useDeleteUserByAdminMutation,
} from "@/redux/api/userApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Pagination from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import UserFilterBar from "./_components/UserFilterBar";
import UserTable from "./_components/UserTable";
import UserEditModal from "./_components/UserEditModal";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const queryParams = {
    search: searchTerm || undefined,
    role: selectedRole !== "ALL" ? selectedRole : undefined,
    page,
    limit: 10,
  };

  const {
    data: usersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersQuery(queryParams);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserByAdminMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserByAdminMutation();

  const [editingUser, setEditingUser] = useState(null);

  const users = usersData?.data?.users || (Array.isArray(usersData?.data) ? usersData.data : []);
  const pagination = usersData?.data?.pagination || {};
  const totalCount = pagination.totalCount ?? users.length;

  const handleEditClick = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = async (formData) => {
    if (!editingUser) return;
    try {
      await updateUser({
        userId: editingUser._id,
        data: formData,
      }).unwrap();
      toast.success("User updated successfully!");
      setEditingUser(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteTarget(user);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await deleteUser(deleteTarget._id).unwrap();
      toast.success("User deleted successfully!");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  return (
    <PermissionGuard
      module="users"
      action="view"
      fallback={
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-bold text-slate-800">Access Restricted</p>
          <p className="text-xs text-slate-500 mt-1">
            Administrator privileges are required to view and manage user accounts.
          </p>
        </div>
      }
    >
      <div className="space-y-6">
        <UserFilterBar
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
          selectedRole={selectedRole}
          onRoleChange={(val) => {
            setSelectedRole(val);
            setPage(1);
          }}
          totalUsers={totalCount}
        />

        {isError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
            <p className="text-sm font-bold text-rose-700">Failed to load user list</p>
            <p className="text-xs text-rose-600 mt-1">
              {error?.data?.message || error?.error || "Please verify that you are logged in with an active administrator session."}
            </p>
            <Button
              type="button"
              variant="danger-soft"
              size="xs"
              onClick={() => refetch()}
              className="mt-3"
            >
              Retry Loading
            </Button>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <UserTable
            users={users}
            isLoading={isLoading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />

          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages || 1}
            totalItems={totalCount}
            pageSize={10}
            onPageChange={setPage}
          />
        </div>

        {/* User Edit Modal */}
        <UserEditModal
          user={editingUser}
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
          isUpdating={isUpdating}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete User Account"
          description="Are you sure you want to permanently delete this user account? This action will revoke all access and cannot be undone."
          itemTitle={deleteTarget?.fullName || deleteTarget?.userName || deleteTarget?.email || ""}
          confirmText="Delete User"
        />
      </div>
    </PermissionGuard>
  );
}
