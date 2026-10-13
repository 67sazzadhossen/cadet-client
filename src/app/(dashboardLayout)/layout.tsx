// app/dashboard/layout.tsx
"use client";
import PrivateRoute from "@/components/privateRoute/PrivateRoute";

import { FiMenu } from "react-icons/fi";
import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/SidebarItems/SideBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <PrivateRoute>
      <div className="dashboard-theme relative flex h-dvh overflow-hidden">
        <span className="dashboard-accent-ball -left-24 -top-20" />
        <span className="dashboard-accent-ball -bottom-24 right-0" />
        {/* Sidebar with state */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="relative z-10 flex h-full min-w-0 flex-1 flex-col">
          {/* Navbar */}
          <nav className="m-2 flex h-14 items-center rounded-2xl border border-blue-200/20 bg-blue-950/35 px-3 shadow-xl backdrop-blur-xl sm:m-3 lg:px-5">
            {/* Menu Button - Left side */}
            <button
              onClick={toggleSidebar}
              className="mr-3 rounded-lg p-2 text-blue-100 transition-colors hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            {/* Title - Centered on mobile, left aligned on desktop */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="truncate text-sm font-bold uppercase tracking-[0.12em] text-blue-50 sm:text-lg lg:text-xl">
                Gazipur Shaheen Cadet Academy
              </h1>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center gap-2">
              {/* Add user menu here if needed */}
            </div>
          </nav>

          {/* Page Content */}
          <div className="dashboard-content relative z-10 flex-1 overflow-auto px-2 pb-3 sm:px-3 lg:px-5 lg:pb-5">
            <div className="mx-auto w-full max-w-[1800px]">{children}</div>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
};

export default Layout;
