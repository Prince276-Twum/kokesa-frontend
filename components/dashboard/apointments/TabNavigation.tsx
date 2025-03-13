// components/ui/TabNavigation.tsx
import React from "react";

export interface TabOption {
  /**
   * Unique identifier for the tab
   */
  id: string;
  /**
   * Display label for the tab
   */
  label: string;
  /**
   * Optional badge count
   */
  count?: number;
  /**
   * Optional icon component
   */
  icon?: React.ReactNode;
  /**
   * Whether the tab is disabled
   */
  disabled?: boolean;
}

export interface TabNavigationProps {
  /**
   * Array of tab options
   */
  tabs: TabOption[];
  /**
   * ID of the currently active tab
   */
  activeTab: string;
  /**
   * Handler for tab change events
   */
  onTabChange: (tabId: string) => void;
  /**
   * Tab appearance variant
   */
  variant?: "underline" | "pills" | "buttons";
  /**
   * Tab size
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to stretch tabs to full width
   */
  fullWidth?: boolean;
  /**
   * Optional CSS class
   */
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={`flex space-x-4 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-3 py-1 transition-colors ${
            activeTab === tab.id
              ? "text-primary border-b-2 border-primary font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
