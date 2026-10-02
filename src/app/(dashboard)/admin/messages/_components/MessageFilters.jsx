// src/app/(dashboard)/admin/messages/_components/MessageFilters.jsx
"use client";

import { FaSearch } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function MessageFilters({
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
        {["all", "unread", "read", "replied"].map((st) => (
          <Button
            key={st}
            type="button"
            variant={statusFilter === st ? "primary" : "secondary"}
            size="xs"
            onClick={() => setStatusFilter(st)}
            className="capitalize text-xs font-bold"
          >
            {st}
          </Button>
        ))}
      </div>

      <div className="w-full sm:w-72">
        <Input
          placeholder="Search by name, email, subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<FaSearch className="h-3 w-3 text-slate-400" />}
        />
      </div>
    </div>
  );
}
