'use client'

import React, { useState } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/shared/utils/cn'
import type { BaseProps } from '@/shared/types/ui'

interface SearchInputProps extends BaseProps {
  placeholder?: string
  value?: string
  onSearch?: (query: string) => void
  onClear?: () => void
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const searchSizes = {
  sm: 'text-sm py-2 pl-8 pr-8',
  md: 'text-sm py-2.5 pl-10 pr-10',
  lg: 'text-base py-3 pl-12 pr-12'
}

const iconSizes = {
  sm: 'h-4 w-4 left-2.5',
  md: 'h-5 w-5 left-3',
  lg: 'h-6 w-6 left-3'
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value: controlledValue,
  onSearch,
  onClear,
  loading = false,
  size = 'md',
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState('')
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = controlledValue !== undefined ? () => {} : setInternalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onSearch?.(newValue)
  }

  const handleClear = () => {
    setValue('')
    onClear?.()
    onSearch?.('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && value) {
      handleClear()
    }
  }

  return (
    <div className={cn('relative', className)} {...props}>
      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className={cn('text-secondary-400', iconSizes[size])} />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'block w-full rounded-lg border border-secondary-300 bg-white',
          'placeholder-secondary-400 focus:border-primary-500 focus:ring-primary-500',
          'dark:bg-secondary-800 dark:border-secondary-600 dark:text-secondary-100',
          'dark:placeholder-secondary-400 dark:focus:border-primary-400',
          'transition-colors duration-200',
          searchSizes[size],
          className
        )}
      />

      {(value || loading) && (
        <div className="absolute inset-y-0 right-0 flex items-center">
          {loading ? (
            <div className="mr-3">
              <svg className="animate-spin h-4 w-4 text-secondary-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleClear}
              className="mr-3 text-secondary-400 hover:text-secondary-600 focus:outline-none"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}