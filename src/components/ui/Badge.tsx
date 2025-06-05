import React from 'react'
import { cn } from '@/shared/utils/cn'
import type { BaseProps } from '@/shared/types/ui'

interface BadgeProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const badgeVariants = {
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300',
  secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  outline: 'border border-secondary-300 text-secondary-700 dark:border-secondary-600 dark:text-secondary-300'
}

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}