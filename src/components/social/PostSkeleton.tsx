import React from 'react'
import { cn } from '@/shared/utils/cn'

export const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-secondary-200 dark:bg-secondary-700 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4"></div>
            <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3 space-y-2">
        <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-full"></div>
        <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4"></div>
        <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2"></div>
      </div>

      {/* Image placeholder */}
      <div className="h-64 bg-secondary-200 dark:bg-secondary-700"></div>

      {/* Actions */}
      <div className="p-4 border-t border-secondary-100 dark:border-secondary-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="h-5 w-12 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
            <div className="h-5 w-12 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
            <div className="h-5 w-12 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
          </div>
          <div className="h-5 w-5 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}