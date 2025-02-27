interface Props {
  checked?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

const Switch = ({
  checked = false,
  onClick,
  className = "",
  disabled = false,
  ariaLabel = "Toggle switch",
}: Props) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer 
        rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${checked ? "bg-primary" : "bg-gray-200"}
        ${className}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 rounded-full 
          bg-white shadow-lg transform transition duration-200 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0"}
          ${disabled ? "cursor-not-allowed" : ""}
        `}
      />
    </button>
  );
};

export default Switch;
