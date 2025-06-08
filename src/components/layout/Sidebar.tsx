'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  MapIcon,
  BookOpenIcon,
  UsersIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  MapIcon as MapIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  UsersIcon as UsersIconSolid,
  BellIcon as BellIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid
} from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/Button'
import { cn } from '@/shared/utils/cn'
import { useAuthStore } from '@/lib/store/auth/authStore'
import Logo from '../ui/Logo'
import { Avatar } from '../ui/Avatar'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  activeIcon: React.ComponentType<{ className?: string }>
  requiresAuth?: boolean
  badge?: number
}

const navigation: NavigationItem[] = [
  {
    name: 'Feed',
    href: '/feed',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
    requiresAuth: true
  },
  {
    name: 'Explore',
    href: '/explore',
    icon: MagnifyingGlassIcon,
    activeIcon: MagnifyingGlassIconSolid
  },
  {
    name: 'Map',
    href: '/map',
    icon: MapIcon,
    activeIcon: MapIconSolid
  },
  {
    name: 'Stories',
    href: '/stories',
    icon: BookOpenIcon,
    activeIcon: BookOpenIconSolid
  },
  {
    name: 'Community',
    href: '/community',
    icon: UsersIcon,
    activeIcon: UsersIconSolid
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: BellIcon,
    activeIcon: BellIconSolid,
    requiresAuth: true,
    badge: 3
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: ChatBubbleLeftRightIcon,
    activeIcon: ChatBubbleLeftRightIconSolid,
    requiresAuth: true,
    badge: 1
  }
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose
}) => {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()

  const filteredNavigation = navigation.filter(item => 
    !item.requiresAuth || isAuthenticated
  )

  const NavLink: React.FC<{ item: NavigationItem }> = ({ item }) => {
    const isActive = pathname === item.href
    const Icon = isActive ? item.activeIcon : item.icon

    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
            : 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-800 dark:hover:text-secondary-100'
        )}
      >
        <Icon className="mr-3 h-6 w-6 flex-shrink-0" />
        {item.name}
        {item.badge && item.badge > 0 && (
          <span className="ml-auto inline-flex items-center justify-center rounded-full bg-primary-600 px-2 py-1 text-xs font-medium text-white">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-secondary-900 transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'border-r border-secondary-200 dark:border-secondary-700'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-secondary-200 dark:border-secondary-700">
              <Logo
                className="h-8 w-8 text-primary-600 dark:text-primary-400"
                aria-label="Camply Logo"
                variant='icon'
                size='lg'
                href='/'
                clickable = {true}
                priority={true}
                theme='auto' >
              </Logo>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            {filteredNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>

          {/* Create Post Button */}
          {isAuthenticated && (
            <div className="p-3 border-t border-secondary-200 dark:border-secondary-700">
              <Button
                fullWidth
                className="justify-center"
                onClick={() => {
                  // Handle create post modal
                }}
              >
                <PlusIcon className="mr-2 h-5 w-5" />
                Create Post
              </Button>
            </div>
          )}

          {/* User Profile (if authenticated) */}
          {isAuthenticated && user && (
            <div className="p-3 border-t border-secondary-200 dark:border-secondary-700">
              <Link
                href={`/${user.username}`}
                className="flex items-center space-x-3 rounded-lg p-3 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                onClick={onClose}
              >
                <Avatar
                  src={user.profileImageUrl}
                  alt={`${user.name} ${user.surname}`}
                  size="sm">
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                    {user.name}  {user.surname}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                    @{user.username}
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}