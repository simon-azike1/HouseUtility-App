export const Button = ({ children, variant = "primary", size = "md", className = "", disabled = false, ...props }) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md",
    outline: "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  const variantStyles = variants[variant] || variants.primary
  const sizeStyles = sizes[size] || sizes.md

  return (
    <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
