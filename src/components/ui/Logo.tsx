'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/shared/utils/cn'

// Logo Props Interface
interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  theme?: 'light' | 'dark' | 'auto'
  href?: string
  className?: string
  priority?: boolean
  clickable?: boolean
}

// Logo boyutları
const logoSizes = {
  xs: { width: 20, height: 20, text: 'text-sm' },
  sm: { width: 28, height: 28, text: 'text-base' },
  md: { width: 36, height: 36, text: 'text-lg' },
  lg: { width: 44, height: 44, text: 'text-xl' },
  xl: { width: 56, height: 56, text: 'text-2xl' },
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  theme = 'auto',
  href = '/',
  className,
  priority = false,
  clickable = true,
}) => {
  const { width, height, text } = logoSizes[size]

  const getLogoSrc = () => {
    if (variant === 'icon') {
      if (theme === 'dark') return '/logo/camply-logo.svg'
      if (theme === 'light') return '/logo/camply-logo-ligth.svg'
      return '/logo/camply-logo.svg'
    }

    if (variant === 'text') {
      return '/logo/camply-logo-ligth.svg'
    }

    // Full logo için
    if (theme === 'dark') return '/logo/camply-logo.svg'
    if (theme === 'light') return '/logo/camply-logo-ligth.svg'
    return '/logo/camply-logo.svg'
  }

  const LogoContent = () => (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Logo Image */}
      {(variant === 'full' || variant === 'icon') && (
        <div className="relative flex-shrink-0">
          <Image
            src={getLogoSrc()}
            alt="TheCamply Logo"
            width={width}
            height={height}
            priority={priority}
            className="object-contain"
            style={{ width: 'auto', height: height }}
          />
        </div>
      )}

      {/* Text */}
      {(variant === 'full' || variant === 'text') && (
        <span
          className={cn(
            'font-bold',
            text,
            theme === 'dark'
              ? 'text-white'
              : theme === 'light'
                ? 'text-secondary-900'
                : 'text-secondary-900 dark:text-white'
          )}
        >
          The
          <span
            className={cn(
              theme === 'dark'
                ? 'text-primary-200'
                : theme === 'light'
                  ? 'text-primary-600'
                  : 'text-primary-600 dark:text-primary-200'
            )}
          >
            Camply
          </span>
        </span>
      )}
    </div>
  )

  // Clickable ise Link ile wrap et
  if (clickable && href) {
    return (
      <Link
        href={href}
        className="inline-flex transition-opacity hover:opacity-80"
      >
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}

export const ResponsiveLogo: React.FC<Omit<LogoProps, 'variant'>> = (props) => {
  return (
    <>
      {/* Desktop: Full logo */}
      <div className="hidden sm:block">
        <Logo variant="full" {...props} />
      </div>

      {/* Mobile: Icon only */}
      <div className="sm:hidden">
        <Logo variant="icon" {...props} />
      </div>
    </>
  )
}

export const BrandLogo: React.FC<
  { collapsed?: boolean } & Omit<LogoProps, 'variant'>
> = ({ collapsed = false, ...props }) => {
  return (
    <Logo
      variant={collapsed ? 'icon' : 'full'}
      size={collapsed ? 'sm' : 'md'}
      {...props}
    />
  )
}

export const ThemeAwareLogo: React.FC<Omit<LogoProps, 'theme'>> = (props) => {
  return (
    <div className="flex items-center space-x-2">
      {/* Light mode'da dark logo görünür */}
      <div className="block dark:hidden">
        <Logo theme="light" {...props} />
      </div>

      {/* Dark mode'da light logo görünür */}
      <div className="hidden dark:block">
        <Logo theme="dark" {...props} />
      </div>
    </div>
  )
}

export default Logo
