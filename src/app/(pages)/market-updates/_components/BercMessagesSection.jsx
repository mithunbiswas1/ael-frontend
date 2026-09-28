"use client";

import { useState, useMemo } from "react";
import { Search, RotateCcw, BellRing } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { H2, P } from "@/components/ui/Typography";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { useDictionary } from "@/context/DictionaryContext";

export default function BercMessagesSection({ bercMessages = [] }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const mu = dict?.marketUpdates || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const messagesList = Array.isArray(bercMessages) ? bercMessages : [];

  const localizedMessages = useMemo(() => {
    return messagesList.map((msg) => ({
      ...msg,
      title: isBn ? msg.titleBn || msg.title : msg.title,
      summary: isBn ? msg.summaryBn || msg.summary : msg.summary,
      tag: isBn ? msg.tagBn || msg.tag : msg.tag,
      date: isBn ? msg.dateBn || msg.date : msg.date,
    }));
  }, [messagesList, isBn]);

  const filteredMessages = useMemo(() => {
    return localizedMessages.filter((msg) => {
      return (
        !searchTerm ||
        msg.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [localizedMessages, searchTerm]);

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage) || 1;
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <H2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BellRing className="h-4 w-4 text-amber-600" />
            <span>{mu.bercTab || (isBn ? "বিইআরসি বার্তা" : "Message from BERC")}</span>
          </H2>
          <P color="muted" size="xs" className="mt-0.5">
            {isBn
              ? "বাংলাদেশ এনার্জি রেগুলেটরি কমিশন কর্তৃক জারিকৃত অফিসিয়াল সার্কুলার ও নোটিশ"
              : "Official circulars and notices from Bangladesh Energy Regulatory Commission"}
          </P>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetFilters}
          className="gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{mu.resetFilters || (isBn ? "ফিল্টার রিসেট" : "Reset Filters")}</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 mb-4">
        <Input
          type="text"
          placeholder={
            isBn
              ? "আইডি, শিরোনাম বা ট্যাগ দিয়ে খুঁজুন..."
              : "Search by ID, title, tag..."
          }
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          prefix={<Search className="h-3.5 w-3.5" />}
          size="sm"
          className="bg-white text-xs h-9"
        />
      </div>

      {/* Messages Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{isBn ? "সার্কুলার আইডি" : "Circular ID"}</TableHead>
            <TableHead>{isBn ? "শিরোনাম" : "Title"}</TableHead>
            <TableHead>{isBn ? "ট্যাগ" : "Tag"}</TableHead>
            <TableHead>{isBn ? "তারিখ" : "Date"}</TableHead>
            <TableHead className="text-center">{isBn ? "অ্যাকশন" : "View"}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedMessages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-xs text-slate-500">
                {isBn
                  ? "কোনো বিইআরসি বার্তা খুঁজে পাওয়া যায়নি।"
                  : "No BERC circulars match your search criteria."}
              </TableCell>
            </TableRow>
          ) : (
            paginatedMessages.map((msg) => (
              <TableRow key={msg.id} className="hover:bg-slate-50/70">
                <TableCell className="font-mono text-xs font-bold text-slate-900">
                  {msg.id}
                </TableCell>
                <TableCell>
                  <div className="font-bold text-slate-900 line-clamp-1">
                    {msg.title}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {msg.summary}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    {msg.tag}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 whitespace-nowrap">
                  {msg.date}
                </TableCell>
                <TableCell className="text-center">
                  <LinkButton
                    href={`/market-updates/${msg.slug}`}
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-xs font-bold text-slate-600 hover:border-primary hover:bg-blue-50 hover:text-primary"
                  >
                    {isBn ? "দেখুন" : "View"}
                  </LinkButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <span>
          {isBn ? "পৃষ্ঠা " : "Page "}
          <strong className="text-slate-900">{currentPage}</strong>{" "}
          {isBn ? "এর মধ্যে " : "of "}
          <strong className="text-slate-900">{totalPages}</strong>
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 px-2.5"
          >
            &lt;
          </Button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <Button
                key={pageNum}
                variant={isActive ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className="h-8 w-8 p-0"
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 px-2.5"
          >
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}
