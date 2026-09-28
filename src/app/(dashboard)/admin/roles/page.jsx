// src/app/(dashboard)/admin/roles/page.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetRolesQuery,
  useUpdateRolePermissionsMutation,
  useCreateRoleMutation,
} from "@/redux/api/roleApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import { FaShieldAlt } from "react-icons/fa";
import { H2, P } from "@/components/ui/Typography";
import RolesHeader from "./_components/RolesHeader";
import RolesTable from "./_components/RolesTable";
import PermissionMatrixModal from "./_components/PermissionMatrixModal";
import CreateRoleModal from "./_components/CreateRoleModal";

const ALL_MODULES = [
  { id: "courses", label: "Courses & LMS" },
  { id: "quizzes", label: "Assessment Quizzes" },
  { id: "certificates", label: "Certificates" },
  { id: "blogs", label: "Articles & Blogs" },
  { id: "market_updates", label: "Market & Incidents" },
  { id: "roles", label: "Roles & Permissions" },
  { id: "users", label: "User Management" },
  { id: "analytics", label: "Platform Analytics" },
  { id: "settings", label: "System Settings" },
];

const ACTIONS = ["view", "create", "edit", "delete"];

export default function RolesManagementPage() {
  const { data: rolesData, isLoading, refetch } = useGetRolesQuery();
  const [updateRolePermissions, { isLoading: isUpdating }] =
    useUpdateRolePermissionsMutation();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();

  const [selectedRole, setSelectedRole] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({
    name: "",
    label: "",
    description: "",
  });

  const roles = rolesData?.data || [];

  const handleEditRole = (role) => {
    setSelectedRole(JSON.parse(JSON.stringify(role)));
  };

  const handleTogglePermission = (moduleId, action) => {
    if (!selectedRole) return;
    if (selectedRole.name === "super_admin") {
      toast.info("Super Admin has permanent full access to all modules.");
      return;
    }

    const currentPermissions = selectedRole.permissions || [];
    const moduleIndex = currentPermissions.findIndex(
      (p) => p.module === moduleId
    );

    let updatedPermissions = [...currentPermissions];

    if (moduleIndex === -1) {
      updatedPermissions.push({
        module: moduleId,
        actions: [action],
      });
    } else {
      const currentModule = updatedPermissions[moduleIndex];
      const hasAction = currentModule.actions.includes(action);

      let newActions;
      if (hasAction) {
        newActions = currentModule.actions.filter((a) => a !== action);
      } else {
        newActions = [...currentModule.actions, action];
      }

      if (newActions.length === 0) {
        updatedPermissions = updatedPermissions.filter(
          (p) => p.module !== moduleId
        );
      } else {
        updatedPermissions[moduleIndex] = {
          ...currentModule,
          actions: newActions,
        };
      }
    }

    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions,
    });
  };

  const hasPermission = (moduleId, action) => {
    if (!selectedRole) return false;
    if (selectedRole.name === "super_admin") return true;
    const mod = (selectedRole.permissions || []).find(
      (p) => p.module === moduleId
    );
    return mod ? mod.actions.includes(action) : false;
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      await updateRolePermissions({
        roleName: selectedRole.name,
        permissions: selectedRole.permissions,
      }).unwrap();
      toast.success(
        `Permissions updated successfully for ${selectedRole.label}`
      );
      setSelectedRole(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update permissions");
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleForm.name || !newRoleForm.label) {
      toast.error("Role key and label are required");
      return;
    }
    try {
      await createRole({
        ...newRoleForm,
        permissions: [],
      }).unwrap();
      toast.success("Custom role created successfully");
      setIsCreateModalOpen(false);
      setNewRoleForm({ name: "", label: "", description: "" });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create role");
    }
  };

  return (
    <PermissionGuard
      module="roles"
      action="view"
      fallback={
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <FaShieldAlt className="mx-auto h-12 w-12 text-amber-500 mb-3" />
          <H2 className="text-lg font-bold text-slate-900">Access Restricted</H2>
          <P className="text-sm text-slate-500 mt-1">
            Super Administrator privileges are required to view or configure platform roles.
          </P>
        </div>
      }
    >
      <div className="space-y-6">
        <RolesHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />

        <RolesTable
          roles={roles}
          isLoading={isLoading}
          onConfigureAccess={handleEditRole}
        />

        <PermissionMatrixModal
          selectedRole={selectedRole}
          onClose={() => setSelectedRole(null)}
          allModules={ALL_MODULES}
          actions={ACTIONS}
          hasPermission={hasPermission}
          onTogglePermission={handleTogglePermission}
          onSave={handleSavePermissions}
          isUpdating={isUpdating}
        />

        <CreateRoleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          newRoleForm={newRoleForm}
          setNewRoleForm={setNewRoleForm}
          onSubmit={handleCreateRole}
          isCreating={isCreating}
        />
      </div>
    </PermissionGuard>
  );
}
