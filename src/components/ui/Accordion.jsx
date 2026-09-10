// src/components/ui/Accordion.jsx
"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef(
  ({ className, variant = "card", ...props }, ref) => (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        variant === "card"
          ? "rounded-lg border border-slate-200/90 bg-white transition-all overflow-hidden data-[state=open]:border-primary/50 data-[state=open]:shadow-2xs"
          : "border-b border-slate-200",
        className
      )}
      {...props}
    />
  )
);

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(
  (
    {
      className,
      children,
      iconType = "chevron", // "chevron" | "plus"
      variant = "card",
      ...props
    },
    ref
  ) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "group flex flex-1 items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900 transition-colors hover:bg-slate-50/70",
          variant === "card" ? "p-4" : "py-4",
          className
        )}
        {...props}
      >
        <span className="pr-4">{children}</span>

        {iconType === "plus" ? (
          <Plus className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-45 group-data-[state=open]:text-primary" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary" />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef(
  ({ className, children, variant = "card", ...props }, ref) => (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden text-xs sm:text-sm text-slate-600 transition-all",
        "data-[state=closed]:animate-accordion-up",
        "data-[state=open]:animate-accordion-down",
        variant === "card" ? "border-t border-slate-100 bg-white p-4" : "pb-4 pt-1",
        className
      )}
      {...props}
    >
      <div className="leading-relaxed whitespace-pre-line">{children}</div>
    </AccordionPrimitive.Content>
  )
);

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
