import React from 'react'
import { cn } from '@/shared/utils/cn'
import type { BaseProps } from '@/shared/types/ui'

interface CardProps extends BaseProps {
  padding?: boolean
  hover?: boolean
  border?: boolean
}

export const Card: React.FC<CardProps> = ({
  padding = true,
  hover = false,
  border = true,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-lg bg-white dark:bg-secondary-800',
        border && 'border border-secondary-200 dark:border-secondary-700',
        padding && 'p-6',
        hover && 'transition-shadow duration-200 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends BaseProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  action,
  className,
  children
}) => {
  return (
    <div className={cn('mb-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
              {description}
            </p>
          )}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
      {children}
    </div>
  )
}