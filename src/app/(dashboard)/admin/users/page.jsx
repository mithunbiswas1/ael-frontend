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
import UserFilterBar from "./_components/UserFilterBar";
import UserTable from "./_components/UserTable";
import UserEditModal from "./_components/UserEditModal";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [page, setPage] = useState(1);

  const queryParams = {
    search: searchTerm || undefined,
    role: selectedRole !== "ALL" ? selectedRole : undefined,
    page,
    limit: 20,
  };

  const { data: usersData, isLoading, refetch } = useGetUsersQuery(queryParams);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserByAdminMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserByAdminMutation();

  const [editingUser, setEditingUser] = useState(null);

  const users = usersData?.data?.users || usersData?.data || [];
  const pagination = usersData?.data?.pagination || {};
  const totalCount = pagination.totalCount || users.length;

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

  const handleDeleteClick = async (user) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete user "${user.fullName || user.userName}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(user._id).unwrap();
      toast.success("User deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  return (
    <PermissionGuard module="users" action="view">
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

        <UserTable
          users={users}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        {/* User Edit Modal */}
        <UserEditModal
          user={editingUser}
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
          isUpdating={isUpdating}
        />
      </div>
    </PermissionGuard>
  );
}
