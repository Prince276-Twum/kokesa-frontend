// components/ui/ViewToggle.tsx
import React from "react";
import {
  Calendar,
  List,
  Grid,
  LayoutGrid,
  Table,
  Columns,
  Rows,
} from "lucide-react";

export type ViewIcon =
  | "calendar"
  | "list"
  | "grid"
  | "layout"
  | "table"
  | "columns"
  | "rows";

export interface ViewOption {
  /**
   * Unique identifier for the view
   */
  id: string;
  /**
   * Display label (used for tooltip)
   */
  label: string;
  /**
   * Icon to display
   */
  icon: ViewIcon;
  /**
   * Optional badge count
   */
  count?: number;
}

// Map of available icons
const icons: Record<
  ViewIcon,
  React.FC<{ size?: number | string; className?: string }>
> = {
  calendar: Calendar,
  list: List,
  grid: Grid,
  layout: LayoutGrid,
  table: Table,
  columns: Columns,
  rows: Rows,
};

export interface ViewToggleProps {
  /**
   * Available view options
   */
  options: ViewOption[];
  /**
   * Currently active view ID
   */
  activeView: string;
  /**
   * Handler for view change events
   */
  onViewChange: (view: string) => void;
  /**
   * Whether to show option labels next to icons
   */
  showLabels?: boolean;
  /**
   * Appearance style
   */
  variant?: "default" | "pills" | "tabs";
  /**
   * Optional CSS class
   */
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  options,
  activeView,
  onViewChange,
  showLabels = false,
  variant = "default",
  className = "",
}) => {
  // Validate that options array is not empty
  if (!options || options.length === 0) {
    console.warn("ViewToggle: No options provided");
    return null;
  }

  // Get classes based on variant
  const getContainerClasses = () => {
    switch (variant) {
      case "pills":
        return "p-1 bg-gray-100 rounded-lg";
      case "tabs":
        return "border-b border-gray-200";
      default:
        return "";
    }
  };

  const getButtonClasses = (isActive: boolean) => {
    const baseClasses =
      "flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-opacity-50";

    switch (variant) {
      case "pills":
        return `${baseClasses} px-3 py-1.5 rounded-md ${
          isActive
            ? "bg-white text-primary shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`;
      case "tabs":
        return `${baseClasses} px-3 py-2 -mb-px ${
          isActive
            ? "text-primary border-b-2 border-primary font-medium"
            : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
        }`;
      default:
        return `${baseClasses} p-2 rounded ${
          isActive
            ? "bg-gray-100 text-primary"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }`;
    }
  };

  return (
    <div className={`flex items-center ${getContainerClasses()} ${className}`}>
      {options.map((option) => {
        const IconComponent = icons[option.icon];
        const isActive = activeView === option.id;

        return (
          <button
            key={option.id}
            className={getButtonClasses(isActive)}
            onClick={() => onViewChange(option.id)}
            aria-label={`${option.label} view`}
            aria-pressed={isActive}
            title={!showLabels ? option.label : undefined}
          >
            <IconComponent size={18} className={showLabels ? "mr-2" : ""} />

            {showLabels && (
              <span className="text-sm font-medium">{option.label}</span>
            )}

            {option.count !== undefined && (
              <span
                className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-primary-light text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ViewToggle;
