// different button variants w/ classnames and hover styles
const variants = {
  contained: {
    classes: "bg-blue-500 text-white",
    hover: "hover:bg-blue-600",
    disabledClasses: "bg-blue-300 text-white",
  },
  outlined: {
    classes: "outline outline-blue-500 text-blue-500",
    hover: "hover:bg-blue-50",
    disabledClasses: "bg-gray-200 outline outline-gray-200 text-white"
  },
  base: {
    classes: "",
    hover: "",
  },
};

// a reusable button, allowing contained, outlined, and base variants
const Button = ({
  children,
  variant = "contained",
  className = "",
  type,
  disabled,
  onClick
}) => {
  // default to contained for invalid variants
  if (!variants[variant]) {
    variant = "contained";
  }

  if (disabled) {
    return (
      <button
        className={`py-2 px-3 rounded-xs ${variants[variant].disabledClasses} ${className}`}
        disabled={true}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`block cursor-pointer py-2 px-3 rounded-xs 
      ${variants[variant].classes} 
      ${variants[variant].hover} 
      ${className}
      `}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
