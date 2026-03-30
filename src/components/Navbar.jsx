import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Badge
} from "@heroui/react";
import { Search, Bell, Menu, X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SystemHealthModal } from "./modals/SystemHealthModal";
import { TeamSettingsModal } from "./modals/TeamSettingsModal";
import { HelpFeedbackModal } from "./modals/HelpFeedbackModal";

const notifications = [
  { id: 1, type: "error",   title: "Device Overheating",  body: "Node-A12 in Singapore Data Center",    time: "2m ago"  },
  { id: 2, type: "warning", title: "API Rate Limit",       body: "Approaching limit for Billing API",    time: "45m ago" },
  { id: 3, type: "success", title: "New Firmware Ready",   body: "Version 2.4.5 ready for deployment",  time: "1h ago"  },
  { id: 4, type: "info",    title: "User Action",          body: "Admin changed security rules",         time: "3h ago"  },
];

const notifIcon = {
  error:   <AlertCircle  size={16} className="text-rose-400"    />,
  warning: <AlertTriangle size={16} className="text-amber-400"  />,
  success: <CheckCircle2 size={16} className="text-emerald-400" />,
  info:    <Info         size={16} className="text-blue-400"    />,
};

const notifBorder = {
  error:   "border-l-rose-500",
  warning: "border-l-amber-500",
  success: "border-l-emerald-500",
  info:    "border-l-blue-500",
};

export const CustomNavbar = ({ isSidebarOpen, toggleSidebar }) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [dismissed, setDismissed] = useState([]);
  const [showHealth, setShowHealth] = useState(false);
  const [showTeam, setShowTeam]     = useState(false);
  const [showHelp, setShowHelp]     = useState(false);
  const toast = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const visible = notifications.filter(n => !dismissed.includes(n.id));
  const unreadCount = visible.length;

  const dismiss = (id) => setDismissed(prev => [...prev, id]);
  const clearAll = () => {
    setDismissed(notifications.map(n => n.id));
    setShowNotifs(false);
    toast({ title: "All notifications cleared", type: "success" });
  };

  return (
    <>
      <Navbar
        maxWidth="full"
        className="bg-black/30 backdrop-blur-md border-b border-white/5 top-0 z-40 sticky"
        aria-label="Main navigation"
      >
        <NavbarContent className="pr-3 pl-0" justify="start">
          <NavbarItem className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              aria-expanded={isSidebarOpen}
              aria-controls="sidebar-nav"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <div className="flex items-center gap-3" aria-label="App version">
              <Badge content="Pro" color="primary" variant="flat" size="sm" className="hidden sm:block">
                <span className="text-white/40 text-xs hidden sm:block">Console v2.4.1</span>
              </Badge>
            </div>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent as="div" className="items-center" justify="center">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[10rem] md:max-w-[20rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal bg-white/5 border-white/10 group-data-[focus=true]:bg-white/10 text-white/50",
            }}
            placeholder="Search console…"
            size="sm"
            startContent={<Search size={18} className="text-white/40" aria-hidden="true" />}
            type="search"
            aria-label="Search console"
          />
        </NavbarContent>

        <NavbarContent as="div" justify="end" className="gap-4">
          {/* Keyboard shortcut hint */}
          <NavbarItem className="hidden lg:flex">
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }))}
              className="flex items-center gap-1.5 text-[11px] text-white/20 border border-white/10 rounded-lg px-2.5 py-1.5 hover:border-white/20 hover:text-white/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Open command palette (Ctrl+K)"
            >
              <kbd className="font-mono">Ctrl</kbd>
              <span>+</span>
              <kbd className="font-mono">K</kbd>
            </button>
          </NavbarItem>

          {/* Notification Bell */}
          <NavbarItem className="hidden sm:flex relative">
            <button
              onClick={() => setShowNotifs(v => !v)}
              aria-label={`Notifications, ${unreadCount} unread`}
              aria-expanded={showNotifs}
              aria-controls="notifications-panel"
              className="p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 relative"
            >
              <Bell size={20} aria-hidden="true" />
              {unreadCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center"
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </NavbarItem>

          {/* User dropdown */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                color="primary"
                name="Admin User"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                aria-label="User menu"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile actions" variant="flat" className="bg-zinc-900 border border-white/10 text-white">
              <DropdownItem key="profile" className="h-14 gap-2 opacity-100">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold text-blue-400">{user?.email ?? "admin@iot-console.com"}</p>
              </DropdownItem>
              <DropdownItem key="settings"      onPress={() => navigate("/settings")}          >My Settings</DropdownItem>
              <DropdownItem key="team_settings"  onPress={() => setShowTeam(true)}              >Team Settings</DropdownItem>
              <DropdownItem key="analytics"      onPress={() => navigate("/analytics")}         >Analytics</DropdownItem>
              <DropdownItem key="system"         onPress={() => setShowHealth(true)}            >System Health</DropdownItem>
              <DropdownItem key="help_and_feedback" onPress={() => setShowHelp(true)}           >Help & Feedback</DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>Log Out</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      {/* ── Notifications Drawer ── */}
      {showNotifs && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            aria-hidden="true"
            onClick={() => setShowNotifs(false)}
          />
          {/* Panel */}
          <div
            id="notifications-panel"
            role="dialog"
            aria-label="Notifications"
            aria-modal="true"
            className="fixed top-16 right-4 z-40 w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <p className="text-sm font-bold text-white">Notifications</p>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[11px] text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                    aria-label="Clear all notifications"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setShowNotifs(false)}
                  className="text-white/30 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  aria-label="Close notifications"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            <ul role="list" className="divide-y divide-white/5 max-h-80 overflow-y-auto" aria-label="Notification list">
              {visible.length === 0 ? (
                <li className="text-center py-8 text-sm text-white/25" role="status">
                  All caught up! 🎉
                </li>
              ) : (
                visible.map(n => (
                  <li
                    key={n.id}
                    role="listitem"
                    className={`flex gap-3 px-4 py-3 border-l-2 ${notifBorder[n.type]} hover:bg-white/5 transition-colors`}
                  >
                    <span aria-hidden="true" className="mt-0.5 shrink-0">{notifIcon[n.type]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/90 leading-snug">{n.title}</p>
                      <p className="text-xs text-white/40 mt-0.5 truncate">{n.body}</p>
                      <p className="text-[10px] text-white/20 mt-1">{n.time}</p>
                    </div>
                    <button
                      onClick={() => dismiss(n.id)}
                      aria-label={`Dismiss ${n.title} notification`}
                      className="text-white/20 hover:text-white/60 transition-colors shrink-0 mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}

      {/* Render Modals */}
      <SystemHealthModal isOpen={showHealth} onClose={() => setShowHealth(false)} />
      <TeamSettingsModal isOpen={showTeam} onClose={() => setShowTeam(false)} />
      <HelpFeedbackModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
};
