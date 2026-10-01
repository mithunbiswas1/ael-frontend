// src/components/ui/DeleteConfirmationModal.jsx
"use client";

import { forwardRef } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { H3, P } from "./Typography";

export const DeleteConfirmationModal = forwardRef(function DeleteConfirmationModal(
  {
    isOpen = false,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    description = "Are you sure you want to permanently delete this item? This action cannot be undone.",
    confirmText = "Delete Permanently",
    cancelText = "Cancel",
    isLoading = false,
    itemTitle = "",
    variant = "danger", // "danger" | "warning"
    icon = null,
  },
  ref
) {
  const isWarning = variant === "warning";

  return (
    <Dialog
      ref={ref}
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      maxWidth="md"
      showCloseButton={!isLoading}
    >
      <div className="p-6 sm:p-7 text-center space-y-4">
        {/* Warning Icon Badge */}
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border shadow-2xs ${
            isWarning
              ? "bg-amber-50 border-amber-200 text-amber-600"
              : "bg-rose-50 border-rose-100 text-rose-600"
          }`}
        >
          {icon ? (
            icon
          ) : (
            <FaTrashAlt
              className={`h-6 w-6 animate-in zoom-in-75 duration-200 ${
                isWarning ? "text-amber-500" : "text-rose-500"
              }`}
            />
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <H3 className="text-base sm:text-lg font-bold text-slate-900">
            {title}
          </H3>
          <P className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            {description}
          </P>
          {itemTitle && (
            <div className="mt-2.5 inline-block max-w-full truncate rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200">
              &quot;{itemTitle}&quot;
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={isWarning ? "secondary" : "danger"}
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto gap-2 text-white shadow-xs ${
              isWarning
                ? "bg-amber-600 hover:bg-amber-700 text-white border-transparent"
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {icon ? icon : <FaTrashAlt className="h-3.5 w-3.5" />}
                <span>{confirmText}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
});

export default DeleteConfirmationModal;
