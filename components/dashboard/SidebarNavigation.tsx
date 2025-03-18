import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import classnames from "classnames";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface NavItem {
  icon: ReactNode;
  text: string;
  href: string;
  exact?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface SidebarNavigationProps {
  sections: NavSection[];
  logo: ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  sections,
  logo,
  user,
  onToggleCollapse,
  isCollapsed = false,
}) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Detect if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Set initial value
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Function to check if a link is active
  const isLinkActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    // For dashboard, we want to match exactly to avoid highlighting when on sub-pages
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    // For other paths, we check if the current path starts with the href
    return pathname ? pathname.endsWith(href) : false;
  };

  // On mobile, we always want to show the expanded sidebar regardless of isCollapsed state
  const effectivelyCollapsed = isCollapsed && !isMobile;

  return (
    <div
      className={classnames(
        "bg-secondary-Sidebar text-white h-full flex flex-col transition-all duration-300",
        {
          "w-20": effectivelyCollapsed,
          "w-60 lg:w-60": !effectivelyCollapsed,
          "w-full": isMobile && !effectivelyCollapsed,
        }
      )}
    >
      {/* Logo and Toggle Button */}
      <div className="p-4 flex items-center justify-between">
        <div className={effectivelyCollapsed ? "mx-auto" : ""}>{logo}</div>
        {!effectivelyCollapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white p-1 hidden lg:block"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Collapse button when sidebar is collapsed */}
      {effectivelyCollapsed && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="mx-auto mb-4 text-gray-400 hover:text-white p-1 hidden lg:block"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Main Navigation Section */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* Only render main navigation items (first section) in the main area */}
        {sections.length > 0 && (
          <div className="mt-2">
            {sections[0].title && !effectivelyCollapsed && (
              <h6 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {sections[0].title}
              </h6>
            )}

            {sections[0].items.map((item, itemIdx) => (
              <NavItemComponent
                key={itemIdx}
                icon={item.icon}
                text={item.text}
                href={item.href}
                isActive={isLinkActive(item.href, item.exact)}
                isCollapsed={effectivelyCollapsed}
              />
            ))}
          </div>
        )}
      </div>

      {/* Account/Settings Section - Placed just above user profile */}
      {sections.length > 1 && (
        <div className="mt-auto pt-2">
          {!effectivelyCollapsed && sections[1].title && (
            <h6 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {sections[1].title}
            </h6>
          )}

          {sections[1].items.map((item, itemIdx) => (
            <NavItemComponent
              key={itemIdx}
              icon={item.icon}
              text={item.text}
              href={item.href}
              isActive={isLinkActive(item.href, item.exact)}
              isCollapsed={effectivelyCollapsed}
            />
          ))}
        </div>
      )}

      {/* User Profile */}
      {user && (
        <div className="mt-4 p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                user.name.charAt(0)
              )}
            </div>

            {!effectivelyCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            )}

            {!effectivelyCollapsed && onToggleCollapse && (
              <button
                className="ml-auto text-gray-400 hover:text-white p-1 lg:hidden"
                onClick={onToggleCollapse}
                aria-label="Collapse sidebar"
              >
                <Share2 size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// NavItem sub-component
const NavItemComponent: React.FC<{
  icon: ReactNode;
  text: string;
  href: string;
  isActive: boolean;
  isCollapsed?: boolean;
}> = ({ icon, text, href, isActive = false, isCollapsed = false }) => {
  return (
    <Link
      href={href}
      className={`flex items-center py-3 px-4 ${
        isActive
          ? "bg-primary text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      } transition-colors relative group`}
    >
      <div
        className={`${isCollapsed ? "mx-auto" : "mr-3"} text-lg flex-shrink-0`}
      >
        {icon}
      </div>

      {!isCollapsed && <span className="text-sm truncate">{text}</span>}

      {/* Tooltip only on desktop when collapsed */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 whitespace-nowrap">
          {text}
        </div>
      )}
    </Link>
  );
};

export default SidebarNavigation;
