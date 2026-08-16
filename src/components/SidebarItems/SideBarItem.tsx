// components/SidebarItem.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { TSidebarItem } from "./sidebar.const";

const SidebarItem = ({ item }: { item: TSidebarItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Check if current path matches any child link
  const isChildActive = item.children?.some(
    (child) => child.link && pathname === child.link,
  );

  // Auto open if a child is active
  if (isChildActive && !isOpen) {
    setIsOpen(true);
  }

  if (item.children) {
    return (
      <li className="w-full">
        <div className="w-full">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 ${
              isOpen
                ? "bg-primary/10 text-primary"
                : "hover:bg-base-200 text-base-content"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`text-xl ${isOpen ? "text-primary" : ""}`}>
                {item.icon}
              </span>
              <span className="is-drawer-close:hidden text-sm font-medium truncate">
                {item.name}
              </span>
            </div>
            <span className="is-drawer-close:hidden text-sm">
              {isOpen ? <IoChevronUp /> : <IoChevronDown />}
            </span>
          </button>

          {/* Submenu */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen ? "max-h-96 mt-1" : "max-h-0"
            }`}
          >
            <ul className="ml-4 space-y-0.5 border-l-2 border-base-300 pl-2">
              {item.children.map((child, idx) => {
                const isActive = child.link && pathname === child.link;

                return (
                  <li key={idx}>
                    <Link
                      href={child.link || "#"}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-content"
                          : "hover:bg-base-200 text-base-content"
                      }`}
                    >
                      <span
                        className={`text-lg ${isActive ? "text-primary-content" : ""}`}
                      >
                        {child.icon}
                      </span>
                      <span className="is-drawer-close:hidden text-sm truncate">
                        {child.name}
                      </span>

                      {/* Active indicator */}
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-content" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </li>
    );
  }

  // Regular menu item without children
  const isActive = item.link && pathname === item.link;

  return (
    <li className="w-full">
      <Link
        href={item.link || "#"}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-primary text-primary-content"
            : "hover:bg-base-200 text-base-content"
        }`}
      >
        <span className={`text-xl ${isActive ? "text-primary-content" : ""}`}>
          {item.icon}
        </span>
        <span className="is-drawer-close:hidden text-sm font-medium truncate">
          {item.name}
        </span>

        {/* Active indicator */}
        {isActive && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-content" />
        )}
      </Link>
    </li>
  );
};

export default SidebarItem;
