// components/UI/Card.tsx
import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

// Main Card Component
export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`rounded-xl overflow-hidden bg-white shadow-md border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

// Card Header Component
export const CardHeader = ({
  children,
  icon,
  title,
  subtitle,
  className = "",
}: CardHeaderProps) => {
  return (
    <div className={`p-5 border-b border-gray-200 bg-gray-50 ${className}`}>
      <div className="flex items-center">
        {icon && <div className="text-primary text-xl mr-3">{icon}</div>}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
};

// Card Body Component
export const CardBody = ({ children, className = "" }: CardBodyProps) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

// Card Footer Component
export const CardFooter = ({ children, className = "" }: CardFooterProps) => {
  return (
    <div className={`p-5 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

// Usage Example:
/*
<Card>
  <CardHeader 
    icon={<MdLocationOn />} 
    title="Location" 
    subtitle="Set your business location"
  />
  <CardBody>
    Content goes here
  </CardBody>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
*/
