import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { CustomNavbar } from "../components/Navbar";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-mesh overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-hide">
        <CustomNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main id="main-content" className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

