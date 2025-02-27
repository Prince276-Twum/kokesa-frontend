// components/UI/Modal.tsx
import React, { ReactNode, useEffect } from "react";
import { MdClose } from "react-icons/md";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  size = "md",
  className = "",
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Modal size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center">
            {icon && <div className="text-primary text-xl mr-3">{icon}</div>}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
          {children}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;

// Usage Example:
/*
const [isModalOpen, setIsModalOpen] = useState(false);

<button onClick={() => setIsModalOpen(true)}>Open Modal</button>

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
  icon={<MdInfo />}
  size="md"
>
  <div className="p-5">
    <p>Modal content goes here</p>
  </div>
  <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
    <Button el="button" secondary onClick={() => setIsModalOpen(false)}>Cancel</Button>
    <Button el="button" primary>Save</Button>
  </div>
</Modal>
*/
