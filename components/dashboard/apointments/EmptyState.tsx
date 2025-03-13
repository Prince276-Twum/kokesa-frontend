// components/common/EmptyState.tsx
import React from "react";

interface EmptyStateProps {
  /**
   * Icon to display
   */
  icon: React.ReactNode;
  /**
   * Title text
   */
  title: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Primary action button
   */
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  /**
   * Secondary action button
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /**
   * Additional CSS class
   */
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-8 text-center ${className}`}
    >
      <div className="flex flex-col items-center">
        <div className="text-gray-300 mb-4">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        {description && <p className="text-gray-500 mb-4">{description}</p>}

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                {primaryAction.label}
              </button>
            )}

            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
