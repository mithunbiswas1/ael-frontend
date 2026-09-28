// src/components/ui/SearchableSelect.jsx
"use client";

import { useState, useRef, useEffect, useMemo, forwardRef } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

const sizeStyles = {
  sm: "h-9 text-xs pl-3 pr-8",
  md: "h-10 text-xs sm:text-sm pl-3.5 pr-9",
  lg: "h-11 text-sm pl-4 pr-10",
};

export const SearchableSelect = forwardRef(
  (
    {
      value,
      onChange = () => {},
      label,
      required = false,
      id,
      name,
      placeholder = "Select or search...",
      options = [],
      size = "sm",
      error,
      disabled = false,
      className,
      containerClassName,
      labelClassName,
      searchable = true,
      clearable = false,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    // Normalize options from array or children
    const normalizedOptions = useMemo(() => {
      if (Array.isArray(options) && options.length > 0) {
        return options.map((opt) => {
          if (typeof opt === "object" && opt !== null) {
            return {
              value: opt.value !== undefined ? String(opt.value) : (opt.id || opt.name || ""),
              label: opt.label || opt.name || opt.title || opt.method_name || String(opt.value || ""),
              disabled: Boolean(opt.disabled),
            };
          }
          return { value: String(opt), label: String(opt), disabled: false };
        });
      }

      if (children) {
        const extracted = [];
        const extract = (node) => {
          if (!node) return;
          if (Array.isArray(node)) {
            node.forEach(extract);
            return;
          }
          if (node.type === "option") {
            const optVal = node.props.value !== undefined ? String(node.props.value) : String(node.props.children || "");
            const optLabel = node.props.children ? String(node.props.children) : optVal;
            if (optVal !== "" || node.props.children) {
              extracted.push({
                value: optVal,
                label: optLabel,
                disabled: Boolean(node.props.disabled),
              });
            }
          } else if (node.props?.children) {
            extract(node.props.children);
          }
        };
        extract(children);
        return extracted;
      }

      return [];
    }, [options, children]);

    // Find currently selected option
    const stringValue = value !== undefined && value !== null ? String(value) : "";
    const selectedOption = normalizedOptions.find((opt) => opt.value === stringValue);

    // In-field search input state
    const [inputValue, setInputValue] = useState(selectedOption ? selectedOption.label : "");
    const [isTyping, setIsTyping] = useState(false);

    // Sync input text when value or options change (when not actively typing)
    useEffect(() => {
      if (!isTyping) {
        setInputValue(selectedOption ? selectedOption.label : "");
      }
    }, [selectedOption, isTyping]);

    // Filter options based on in-field input text
    const filteredOptions = useMemo(() => {
      if (!isTyping || !inputValue.trim()) return normalizedOptions;
      const lower = inputValue.toLowerCase().trim();
      return normalizedOptions.filter(
        (opt) =>
          opt.label.toLowerCase().includes(lower) ||
          opt.value.toLowerCase().includes(lower)
      );
    }, [normalizedOptions, inputValue, isTyping]);

    // Close on outside click and restore label
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
          setIsTyping(false);
          setInputValue(selectedOption ? selectedOption.label : "");
          setHighlightedIndex(-1);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedOption]);

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (disabled) return;

      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
          inputRef.current?.select();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          } else if (filteredOptions.length > 0) {
            handleSelect(filteredOptions[0]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setIsTyping(false);
          setInputValue(selectedOption ? selectedOption.label : "");
          inputRef.current?.blur();
          break;
        case "Tab":
          setIsOpen(false);
          setIsTyping(false);
          setInputValue(selectedOption ? selectedOption.label : "");
          break;
      }
    };

    // Scroll highlighted item into view
    useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const item = listRef.current.children[highlightedIndex];
        if (item) {
          item.scrollIntoView({ block: "nearest" });
        }
      }
    }, [highlightedIndex]);

    const handleSelect = (option) => {
      if (option.disabled) return;
      const syntheticEvent = {
        target: {
          name: name || id || "",
          value: option.value,
        },
      };
      setInputValue(option.label);
      setIsTyping(false);
      setIsOpen(false);
      setHighlightedIndex(-1);
      onChange(syntheticEvent, option.value);
    };

    const handleClear = (e) => {
      e.stopPropagation();
      setInputValue("");
      setIsTyping(false);
      const syntheticEvent = {
        target: {
          name: name || id || "",
          value: "",
        },
      };
      onChange(syntheticEvent, "");
      inputRef.current?.focus();
    };

    const handleInputChange = (e) => {
      if (!searchable) return;
      setInputValue(e.target.value);
      setIsTyping(true);
      setHighlightedIndex(0);
      if (!isOpen) {
        setIsOpen(true);
      }
    };

    const handleInputFocus = () => {
      if (disabled) return;
      setIsOpen(true);
      // Select all existing text so typing replaces it easily
      setTimeout(() => {
        inputRef.current?.select();
      }, 50);
    };

    return (
      <div className={cn("w-full relative", containerClassName)} ref={containerRef}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-xs font-bold text-slate-700 mb-1.5",
              labelClassName
            )}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {/* Hidden input to ensure native form / FormData compatibility */}
        <input type="hidden" name={name || id} value={stringValue} />

        <div className="relative w-full">
          {/* In-field Input for Direct Typing & Search */}
          <div
            className={cn(
              "relative flex items-center w-full rounded-lg border border-slate-200 bg-white transition-all shadow-2xs cursor-text",
              isOpen && "border-primary ring-1 ring-primary/20",
              error && "border-red-500 ring-red-500/20",
              disabled && "opacity-50 cursor-not-allowed bg-slate-50",
              className
            )}
            onClick={() => {
              if (!disabled) {
                inputRef.current?.focus();
                setIsOpen(true);
              }
            }}
          >
            <input
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
              }}
              id={id}
              type="text"
              readOnly={!searchable || disabled}
              disabled={disabled}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              autoComplete="off"
              className={cn(
                "w-full bg-transparent font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none cursor-pointer",
                searchable && "cursor-text",
                sizeStyles[size] || sizeStyles.sm
              )}
              {...props}
            />

            {/* Right icons: Clear & Chevron */}
            <div className="absolute right-2 flex items-center gap-1 shrink-0">
              {clearable && stringValue && !disabled && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={handleClear}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Clear"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <button
                type="button"
                tabIndex={-1}
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!disabled) {
                    if (isOpen) {
                      setIsOpen(false);
                      setIsTyping(false);
                      setInputValue(selectedOption ? selectedOption.label : "");
                    } else {
                      inputRef.current?.focus();
                      setIsOpen(true);
                    }
                  }
                }}
                className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    isOpen && "rotate-180 text-primary"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Floating Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 top-full mt-1 z-50 w-full min-w-[200px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 animate-in fade-in zoom-in-95 duration-100">
              {/* Option List */}
              <div
                ref={listRef}
                role="listbox"
                className="max-h-56 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200"
              >
                {filteredOptions.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400">
                    No matching options found for &quot;{inputValue}&quot;
                  </div>
                ) : (
                  filteredOptions.map((option, idx) => {
                    const isSelected = option.value === stringValue;
                    const isHighlighted = idx === highlightedIndex;

                    return (
                      <button
                        key={`${option.value}-${idx}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        disabled={option.disabled}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur before select
                          handleSelect(option);
                        }}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left transition-all cursor-pointer",
                          isSelected
                            ? "bg-primary/10 text-primary font-bold"
                            : isHighlighted
                            ? "bg-slate-100/80 text-slate-900"
                            : "text-slate-700 hover:bg-slate-50",
                          option.disabled && "opacity-40 cursor-not-allowed"
                        )}
                      >
                        <span className="truncate flex-1">{option.label}</span>
                        {isSelected && (
                          <Check className="ml-2 h-3.5 w-3.5 text-primary shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";
export default SearchableSelect;
