import { cn } from "@/lib/utils"

interface LoadingProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'card' | 'avatar' | 'text' | 'image'
  size?: 'sm' | 'md' | 'lg'
}

function Loading({ 
  className, 
  variant = 'default', 
  size = 'md',
  ...props 
}: LoadingProps) {
  const baseClasses = "relative overflow-hidden bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-md"
  
  const variantClasses = {
    default: "bg-gray-200",
    card: "bg-gray-100",
    avatar: "rounded-full bg-gray-200",
    text: "bg-gray-200 h-4",
    image: "bg-gray-200"
  }
  
  const sizeClasses = {
    sm: "h-3",
    md: "h-4", 
    lg: "h-6"
  }

  return (
    <div
      className={cn(
        baseClasses,
        variant === 'text' ? sizeClasses[size] : variant === 'avatar' ? '' : '',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]"></div>
    </div>
  )
}

// Specialized loading components for common use cases
function LoadingCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("space-y-4 p-6", className)} {...props}>
      <Loading className="h-6 w-3/4" variant="text" />
      <Loading className="h-4 w-full" variant="text" />
      <Loading className="h-4 w-2/3" variant="text" />
    </div>
  )
}

function LoadingAvatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Loading 
      className={cn("h-8 w-8", className)} 
      variant="avatar" 
      {...props} 
    />
  )
}

function LoadingText({ lines = 3, className, ...props }: React.ComponentProps<"div"> & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Loading 
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
          variant="text"
        />
      ))}
    </div>
  )
}

function LoadingImage({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Loading 
      className={cn("h-48 w-full", className)} 
      variant="image" 
      {...props} 
    />
  )
}

function LoadingSpinner({ 
  className, 
  size = 'md',
  variant = 'primary',
  ...props 
}: React.ComponentProps<"div"> & { 
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'gradient' | 'minimal'
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-15 h-15'
  }

  const variantClasses = {
    primary: "border-primary/20 border-t-primary",
    secondary: "border-gray-300 border-t-gray-600",
    gradient: "border-transparent border-t-transparent bg-gradient-to-r from-primary/20 via-primary to-primary/20 animate-spin",
    minimal: "border-gray-200 border-t-gray-400"
  }

  return (
    <div 
      className={cn(
        "relative rounded-full border-2 animate-spin",
        variant === 'gradient' ? variantClasses[variant] : variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {variant === 'gradient' && (
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary/60 animate-spin" 
             style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      )}
    </div>
  )
}

function LoadingDots({ 
  className, 
  size = 'md',
  variant = 'primary',
  ...props 
}: React.ComponentProps<"div"> & { 
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'gradient' | 'minimal'
}) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3', 
    lg: 'w-4 h-4'
  }

  const variantClasses = {
    primary: "bg-primary",
    secondary: "bg-gray-600",
    gradient: "bg-gradient-to-r from-primary to-primary/60",
    minimal: "bg-gray-400"
  }

  return (
    <div 
      className={cn(
        "flex space-x-1.5 items-center justify-center",
        className
      )}
      {...props}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-bounce",
            variantClasses[variant],
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )
}

export {
  Loading, LoadingAvatar, LoadingCard, LoadingDots, LoadingImage, LoadingSpinner, LoadingText
}

