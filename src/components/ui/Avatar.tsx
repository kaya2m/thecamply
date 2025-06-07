import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/shared/utils/cn'
import type { BaseProps } from '@/shared/types/ui'

interface AvatarProps extends BaseProps {
  src?: string
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  online?: boolean
}

const avatarSizes = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback,
  online,
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  console.log('Avatar rendered:', { src, alt, size, fallback, online })
  const initials = fallback || alt.split(' ').map(n => n[0]).join('').toUpperCase()

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  return (
    <div className={cn('relative inline-block', className)} {...props}>
      <div
        className={cn(
          'relative rounded-full overflow-hidden bg-secondary-200 dark:bg-secondary-700',
          avatarSizes[size]
        )}
      >
        {src && !imageError ? (
          <>
            <Image
              src={src}
              alt={alt}
              fill
              className={cn(
                'object-cover transition-opacity duration-200',
                imageLoading ? 'opacity-0' : 'opacity-100'
              )}
              sizes={
                size === 'xs' ? '24px' :
                size === 'sm' ? '32px' :
                size === 'md' ? '40px' :
                size === 'lg' ? '48px' : '64px'
              }
              onError={handleImageError}
              onLoad={handleImageLoad}
              priority={size === 'lg' || size === 'xl'}
            />
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-secondary-300 border-t-primary-500" />
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-secondary-600 dark:text-secondary-300">
            {initials}
          </div>
        )}
      </div>
      {online && (
        <span className="absolute -bottom-0 -right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white dark:ring-secondary-800" />
      )}
    </div>
  )
}