import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BarChart2, Users, Smartphone,
  Mail, CreditCard, ShieldCheck, Settings,
  Search, ArrowRight, Command, Hash,
} from "lucide-react";

const PAGES = [
  { label: "Dashboard",       path: "/",           icon: <LayoutDashboard size={16} />, group: "Navigate" },
  { label: "Analytics",       path: "/analytics",  icon: <BarChart2 size={16} />,       group: "Navigate" },
  { label: "User Directory",  path: "/users",      icon: <Users size={16} />,           group: "Navigate" },
  { label: "Device Fleet",    path: "/devices",    icon: <Smartphone size={16} />,      group: "Navigate" },
  { label: "Broadcast Center",path: "/broadcasts", icon: <Mail size={16} />,            group: "Navigate" },
  { label: "Payments",        path: "/payments",   icon: <CreditCard size={16} />,      group: "Navigate" },
  { label: "Security",        path: "/security",   icon: <ShieldCheck size={16} />,     group: "Navigate" },
  { label: "Settings",        path: "/settings",   icon: <Settings size={16} />,        group: "Navigate" },
];

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  // Open on Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = PAGES.filter(p =>
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback((item) => {
    navigate(item.path);
    setOpen(false);
  }, [navigate]);

  const handleKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[activeIdx]) handleSelect(filtered[activeIdx]);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[activeIdx];
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            key="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -12 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed left-1/2 top-[20%] -translate-x-1/2 z-[9991] w-full max-w-lg"
          >
            <div className="bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
                <Search size={18} className="text-white/40 shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded={open}
                  aria-autocomplete="list"
                  aria-controls="palette-list"
                  aria-activedescendant={filtered[activeIdx] ? `palette-item-${activeIdx}` : undefined}
                  placeholder="Search pages and actions..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
                  onKeyDown={handleKey}
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
                />
                <kbd className="hidden sm:flex items-center gap-1 text-[10px] text-white/20 border border-white/10 rounded px-1.5 py-0.5 font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <ul
                id="palette-list"
                role="listbox"
                ref={listRef}
                aria-label="Search results"
                className="py-2 max-h-80 overflow-y-auto"
              >
                {filtered.length === 0 ? (
                  <li className="text-center text-sm text-white/25 py-8" role="option" aria-selected="false">
                    No results for &quot;{query}&quot;
                  </li>
                ) : (
                  filtered.map((item, i) => (
                    <li
                      key={item.path}
                      id={`palette-item-${i}`}
                      role="option"
                      aria-selected={i === activeIdx}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIdx(i)}
                      className={`
                        flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors
                        ${i === activeIdx ? "bg-white/[0.08] text-white" : "text-white/60 hover:text-white hover:bg-white/5"}
                      `}
                    >
                      <span className={`${i === activeIdx ? "text-blue-400" : "text-white/30"} transition-colors`} aria-hidden="true">
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      {i === activeIdx && (
                        <ArrowRight size={14} className="text-white/30" aria-hidden="true" />
                      )}
                    </li>
                  ))
                )}
              </ul>

              {/* Footer hint */}
              <div className="px-4 py-2 border-t border-white/5 flex items-center gap-4 text-[11px] text-white/20">
                <span className="flex items-center gap-1" aria-label="Use arrow keys to navigate">
                  <kbd className="border border-white/10 rounded px-1 font-mono">↑</kbd>
                  <kbd className="border border-white/10 rounded px-1 font-mono">↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1" aria-label="Press Enter to select">
                  <kbd className="border border-white/10 rounded px-1 font-mono">↵</kbd>
                  Select
                </span>
                <span className="ml-auto flex items-center gap-1" aria-label="Press Ctrl K to open">
                  <Command size={10} />
                  <kbd className="border border-white/10 rounded px-1 font-mono">K</kbd>
                  Toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
