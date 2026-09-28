// src/app/(dashboard)/admin/roles/_components/CreateRoleModal.jsx
"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function CreateRoleModal({
  isOpen,
  onClose,
  newRoleForm,
  setNewRoleForm,
  onSubmit,
  isCreating,
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Create New Custom Role"
      description="Define a custom permission bundle for operators or staff."
    >
      <form onSubmit={onSubmit} className="p-6 space-y-4">
          <Input
            label="System Key (lowercase, underscores)"
            required
            placeholder="e.g. content_moderator"
            value={newRoleForm.name}
            onChange={(e) =>
              setNewRoleForm({
                ...newRoleForm,
                name: e.target.value.toLowerCase().replace(/\s+/g, "_"),
              })
            }
          />

          <Input
            label="Display Label"
            required
            placeholder="e.g. Content Moderator"
            value={newRoleForm.label}
            onChange={(e) =>
              setNewRoleForm({ ...newRoleForm, label: e.target.value })
            }
          />

          <Textarea
            label="Role Description"
            rows={3}
            placeholder="Describe the responsibilities of this role..."
            value={newRoleForm.description}
            onChange={(e) =>
              setNewRoleForm({ ...newRoleForm, description: e.target.value })
            }
          />

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isCreating}
              variant="primary"
              size="sm"
              className="gap-2"
            >
              {isCreating && (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              <span>Create Role</span>
            </Button>
          </div>
        </form>
    </Dialog>
  );
}
