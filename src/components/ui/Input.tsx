import React from 'react'
import { cn } from '@/shared/utils/cn'
import type { BaseProps } from '@/shared/types/ui'

interface InputProps extends BaseProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  id?: string
  name?: string
  autoComplete?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  'aria-describedby'?: string
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  error,
  label,
  id,
  name,
  autoComplete,
  className,
  onChange,
  onBlur,
  onFocus,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-describedby={cn(ariaDescribedBy, errorId)}
        aria-invalid={error ? 'true' : 'false'}
        className={cn(
          'block w-full rounded-lg border px-3 py-2 text-sm',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500',
          'dark:bg-secondary-800 dark:border-secondary-600 dark:text-secondary-100',
          'dark:placeholder-secondary-400'
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}