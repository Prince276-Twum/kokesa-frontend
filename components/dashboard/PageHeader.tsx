// components/common/PageHeader.tsx
import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  emoji?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  emoji,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          {title} {emoji && <span>{emoji}</span>}
        </h1>
        {subtitle && <p className="text-gray-550">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 mt-2 sm:mt-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
