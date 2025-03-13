// components/common/Panel.tsx
import React, { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  title?: string | ReactNode;
  action?: ReactNode;
  className?: string;
  noPadding?: boolean;
  noBodyPadding?: boolean;
  headerClassName?: string;
  bodyClassName?: string;
  icon?: ReactNode;
}

const Panel: React.FC<PanelProps> = ({
  children,
  title,
  action,
  className = "",
  noPadding = false,
  noBodyPadding = false,
  headerClassName = "",
  bodyClassName = "",
  icon,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {(title || action) && (
        <div
          className={`flex justify-between items-center border-b border-gray-100 ${
            noPadding ? "" : "px-5 md:px-6 py-4 md:py-5"
          } ${headerClassName}`}
        >
          {title && (
            <h2 className="font-semibold flex items-center">
              {icon && <span className="mr-2">{icon}</span>}
              {title}
            </h2>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div
        className={`${
          noBodyPadding || noPadding ? "" : "px-5 md:px-6 py-5 md:py-6"
        } ${bodyClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Panel;
