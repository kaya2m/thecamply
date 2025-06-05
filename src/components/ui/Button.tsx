import React from 'react'
import { cn } from '@/shared/utils/cn'
import type { ButtonVariant, ButtonSize, BaseProps, LoadingProps } from '@/shared/types/ui'

interface ButtonProps extends BaseProps, LoadingProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  'aria-label'?: string
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700',
  ghost: 'text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500 dark:text-secondary-300 dark:hover:bg-secondary-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  link: 'text-primary-600 hover:text-primary-700 focus:ring-primary-500 underline',
    outline: 'border border-secondary-300 text-secondary-900 hover:bg-secondary-100 focus:ring-secondary-500 dark:border-secondary-700 dark:text-secondary-100 dark:hover:bg-secondary-800'
}

const buttonSizes: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  loading = false,
  loadingText = 'Loading...',
  type = 'button',
  className,
  children,
  onClick,
  'aria-label': ariaLabel,
  ...props
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {loading ? loadingText : children}
    </button>
  )
}