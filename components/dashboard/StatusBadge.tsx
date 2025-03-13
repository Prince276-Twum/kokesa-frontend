// components/common/StatusBadge.tsx
import React, { useMemo } from "react";

export type StatusType =
  | "available"
  | "busy"
  | "offline"
  | "away"
  | "onLeave"
  | "default"
  | "pending"
  | "confirmed"
  | "completed"
  | "canceled"
  | "no_show"
  | "paid"
  | "unpaid"
  | "refunded"
  | "partially_paid";

interface StatusBadgeProps {
  /**
   * The status to display
   */
  status: StatusType | string;
  /**
   * Optional custom label text (if not provided, uses default based on status)
   */
  label?: string;
  /**
   * Optional CSS class
   */
  className?: string;
  /**
   * Size of the badge
   */
  size?: "xs" | "sm" | "md" | "lg";
  /**
   * Whether to show a status dot
   */
  showDot?: boolean;
  /**
   * Optional on click handler
   */
  onClick?: () => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className = "",
  size = "sm",
  showDot = true,
  onClick,
}) => {
  // Map status strings to normalized status type
  // Allows handling of different case formats from backend
  const normalizedStatus = useMemo(() => {
    // Convert to lowercase for case-insensitive matching
    const statusLower = status.toLowerCase();

    // Handle variations in naming
    if (
      statusLower === "available" ||
      statusLower === "accept" ||
      statusLower === "confirmed"
    ) {
      return "available";
    } else if (
      statusLower === "busy" ||
      statusLower === "cancel" ||
      statusLower === "canceled"
    ) {
      return "busy";
    } else if (statusLower === "away" || statusLower === "reschedule") {
      return "away";
    } else if (statusLower === "pending") {
      return "pending";
    } else if (statusLower === "completed") {
      return "completed";
    } else if (statusLower === "no_show" || statusLower === "no-show") {
      return "no_show";
    } else if (statusLower === "paid") {
      return "paid";
    } else if (statusLower === "unpaid") {
      return "unpaid";
    } else if (statusLower === "refunded") {
      return "refunded";
    } else if (
      statusLower === "partially_paid" ||
      statusLower === "partially-paid"
    ) {
      return "partially_paid";
    } else if (statusLower === "offline") {
      return "offline";
    } else if (
      statusLower === "onleave" ||
      statusLower === "on-leave" ||
      statusLower === "on_leave"
    ) {
      return "onLeave";
    } else {
      return "default";
    }
  }, [status]);

  // Default text based on status if not provided
  const defaultText: Record<string, string> = {
    available: "Available",
    busy: "Busy",
    offline: "Offline",
    away: "Away",
    onLeave: "On Leave",
    default: "Default",
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    canceled: "Canceled",
    no_show: "No Show",
    paid: "Paid",
    unpaid: "Unpaid",
    refunded: "Refunded",
    partially_paid: "Partially Paid",
  };

  // Status styles for background, text, and dot
  const statusStyles: Record<
    string,
    { bg: string; text: string; dot: string }
  > = {
    available: {
      bg: "bg-green-100",
      text: "text-green-800",
      dot: "bg-green-500",
    },
    busy: {
      bg: "bg-red-100",
      text: "text-red-800",
      dot: "bg-red-500",
    },
    offline: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      dot: "bg-gray-500",
    },
    away: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      dot: "bg-yellow-500",
    },
    onLeave: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-400",
    },
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      dot: "bg-amber-500",
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-800",
      dot: "bg-green-500",
    },
    no_show: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      dot: "bg-purple-500",
    },
    paid: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      dot: "bg-emerald-500",
    },
    unpaid: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      dot: "bg-gray-500",
    },
    refunded: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      dot: "bg-blue-500",
    },
    partially_paid: {
      bg: "bg-cyan-100",
      text: "text-cyan-800",
      dot: "bg-cyan-500",
    },
    default: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      dot: "bg-gray-500",
    },
  };

  // Size styles
  const sizeStyles = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-sm",
  };

  const displayText = label || defaultText[normalizedStatus] || status;
  const style = statusStyles[normalizedStatus] || statusStyles.default;

  return (
    <span
      className={`rounded-full inline-flex items-center font-medium ${
        style.bg
      } ${style.text} ${sizeStyles[size]} ${
        onClick ? "cursor-pointer hover:opacity-90" : ""
      } ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {showDot && (
        <span
          className={`mr-1 inline-block rounded-full h-1.5 w-1.5 ${style.dot}`}
          aria-hidden="true"
        />
      )}
      {displayText}
    </span>
  );
};

export default StatusBadge;
