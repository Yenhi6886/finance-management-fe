import React, { useState } from 'react'
import { UserIcon } from 'lucide-react'

const Avatar = ({ 
  src, 
  alt = "Avatar", 
  size = "md", 
  className = "",
  fallbackIcon: FallbackIcon = UserIcon,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-24 h-24"
  }

  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6", 
    xl: "w-8 h-8",
    "2xl": "w-12 h-12"
  }

  const baseClasses = "rounded-full object-cover flex items-center justify-center"
  const sizeClass = sizeClasses[size] || sizeClasses.md
  const iconSizeClass = iconSizeClasses[size] || iconSizeClasses.md

  // Show fallback if no src, image error, or empty src
  if (!src || imageError) {
    return (
      <div 
        className={`${baseClasses} ${sizeClass} bg-primary-100 dark:bg-primary-900 ${className}`}
        {...props}
      >
        <FallbackIcon className={`${iconSizeClass} text-primary-600 dark:text-primary-400`} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${baseClasses} ${sizeClass} ${className}`}
      onError={() => setImageError(true)}
      {...props}
    />
  )
}

export { Avatar }
