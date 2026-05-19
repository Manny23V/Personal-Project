// different button variants w/ classnames and hover styles
const variants = {
  contained: {
    classes: "bg-blue-500 text-white",
    hover: "hover:bg-blue-600",
  },
  outlined: {
    classes: "outline outline-blue-500 text-blue-500",
    hover: "hover:bg-blue-50",
  },
  base: {
    classes: "",
    hover: "",
  },
};

// a reusable button, allowing contained, outlined, and base variants
const Button = ({ children, variant = "contained", className = "" }) => {
  // default to contained for invalid variants
  if (!variants[variant]) {
    variant = "contained";
  }

  return (
    <button
      className={`cursor-pointer py-2 px-3 rounded-xs 
      ${variants[variant].classes} 
      ${variants[variant].hover} 
      ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
