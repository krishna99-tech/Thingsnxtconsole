import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BarChart2, 
  Users, 
  Smartphone, 
  Settings, 
  CreditCard, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight,
  Zap,
  Mail
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Analytics", path: "/analytics", icon: BarChart2 },
  { name: "Users", path: "/users", icon: Users },
  { name: "Devices", path: "/devices", icon: Smartphone },
  { name: "Broadcasts", path: "/broadcasts", icon: Mail },
  { name: "Payments", path: "/payments", icon: CreditCard },
  { name: "Security", path: "/security", icon: ShieldCheck },
  { name: "Settings", path: "/settings", icon: Settings },
];

export const Sidebar = ({ isOpen, toggle }) => {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? "280px" : "80px" }}
      className={cn(
        "relative h-screen glass border-r bg-black/40 border-white/5 flex flex-col transition-all duration-300 z-50",
        !isOpen && "items-center"
      )}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <Zap size={24} fill="currentColor" />
        </div>
        {isOpen && (
          <motion.h1 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-xl font-bold tracking-tight text-white/90"
          >
            IOT Console
          </motion.h1>
        )}
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" 
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              )}
            >
              <item.icon size={22} className={cn(isActive && "text-blue-400")} />
              {isOpen && (
                <span className="font-medium whitespace-nowrap overflow-hidden">
                  {item.name}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className="absolute left-16 bg-black/90 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-white/10">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/80 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </motion.aside>
  );
};
