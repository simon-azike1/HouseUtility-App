// Card Component
export const Card = ({ children, variant = "default", className = "", ...props }) => {
  const baseStyles = "rounded-lg transition-all duration-200"

  const variants = {
    default: "bg-white border border-gray-200 shadow-sm",
    bordered: "bg-white border-2 border-blue-500",
    elevated: "bg-white shadow-lg hover:shadow-xl",
  }

  const variantStyles = variants[variant] || variants.default

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </div>
  )
}

// CardHeader Component
export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

// CardTitle Component
export const CardTitle = ({ children, className = "", ...props }) => {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`} {...props}>
      {children}
    </h3>
  )
}

// CardDescription Component
export const CardDescription = ({ children, className = "", ...props }) => {
  return (
    <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
      {children}
    </p>
  )
}

// CardContent Component
export const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

// CardFooter Component
export const CardFooter = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 pt-4 border-t border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  )
}
