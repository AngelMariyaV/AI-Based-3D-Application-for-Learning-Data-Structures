const VARIANTS = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300",
  secondary:
    "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 disabled:opacity-50",
  danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 disabled:opacity-50",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3 text-lg",
};

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  icon: Icon,
  disabled = false,
  fullWidth = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100
        ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {Icon && <Icon />}
      {children}
    </button>
  );
}

export default Button;
