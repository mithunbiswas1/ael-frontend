// src/app/(dashboard)/admin/_components/RecentTransactionsTable.jsx
"use client";

import { CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

export default function RecentTransactionsTable({ transactions }) {
  const safeList = transactions || [];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <span>Recent Billing Transactions</span>
        </h4>
        <Link
          href="/admin/subscriptions?tab=transactions"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <Table containerClassName="border-0 rounded-none overflow-x-auto" className="w-full text-left text-xs">
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Plan / Course</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-slate-400">
                No recent transactions found.
              </TableCell>
            </TableRow>
          ) : (
            safeList.map((tx) => (
              <TableRow key={tx._id || tx.transactionId} className="hover:bg-slate-50/60">
                <TableCell>
                  <div className="font-bold text-slate-900">
                    {tx.customerDetails?.fullName || "AEL Student"}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {tx.customerDetails?.phone || tx.customerDetails?.email || "—"}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-700">
                  {tx.planName || tx.plan || "Monthly Subscription"}
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  ৳{Number(tx.amount || 0).toLocaleString()}
                </TableCell>
                <TableCell className="uppercase text-[10px] font-mono text-slate-500">
                  {tx.paymentMethod || "SSLCommerz"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      tx.status === "paid" || tx.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {tx.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
