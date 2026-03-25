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
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar with state */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-full">
          {/* Navbar */}
          <nav className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-4 lg:px-6">
            {/* Menu Button - Left side */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
              aria-label="Toggle menu"
            >
              <FiMenu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Title - Centered on mobile, left aligned on desktop */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-lg lg:text-xl font-bold text-gray-800 uppercase tracking-wide">
                Gazipur Shaheen Cadet Academy
              </h1>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center gap-2">
              {/* Add user menu here if needed */}
            </div>
          </nav>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-4 lg:p-6 bg-gray-50">
            <div className="">{children}</div>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
};

export default Layout;
