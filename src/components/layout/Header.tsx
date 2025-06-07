'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Bars3Icon, 
  BellIcon, 
  ChatBubbleLeftRightIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Avatar } from '@/components/ui/Avatar'
import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import { cn } from '@/shared/utils/cn'
import { useAuthStore } from '@/lib/store/auth/authStore'

interface HeaderProps {
  onMenuClick?: () => void
  showMobileMenu?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  showMobileMenu = true
}) => {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [isDark, setIsDark] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-secondary-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-secondary-700 dark:bg-secondary-900/95 dark:supports-[backdrop-filter]:bg-secondary-900/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {showMobileMenu && (
              <button
                type="button"
                onClick={onMenuClick}
                className="md:hidden rounded-lg p-2 text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-400 dark:hover:bg-secondary-800 dark:hover:text-secondary-100"
                aria-label="Open menu"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}
            
            {/* <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
                C
              </div>
              <span className="hidden sm:block text-xl font-bold text-secondary-900 dark:text-secondary-100">
                TheCamply
              </span>
            </Link> */}
          </div>

          {/* Center section - Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchInput
              placeholder="Search camps, users, stories..."
              value={searchQuery}
              onSearch={handleSearch}
              onClear={() => setSearchQuery('')}
            />
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg p-2 text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-400 dark:hover:bg-secondary-800 dark:hover:text-secondary-100"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <button
                  type="button"
                  className="relative rounded-lg p-2 text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-400 dark:hover:bg-secondary-800 dark:hover:text-secondary-100"
                  aria-label="Notifications"
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary-600"></span>
                </button>

                {/* Messages */}
                <Link
                  href="/messages"
                  className="rounded-lg p-2 text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-400 dark:hover:bg-secondary-800 dark:hover:text-secondary-100"
                  aria-label="Messages"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </Link>

                {/* User menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center rounded-lg p-1 hover:bg-secondary-100 dark:hover:bg-secondary-800">
                    <Avatar
                      src={user.profileImageUrl}
                      alt={`${user.name} ${user.surname}`}
                      size="sm"
                    />
                  </Menu.Button>

                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-secondary-800 dark:ring-secondary-700">
                      <div className="px-4 py-2 border-b border-secondary-100 dark:border-secondary-700">
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                          {user.name} {user.surname}
                        </p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                          @{user.username}
                        </p>
                      </div>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/users/${user.username}`}
                            className={cn(
                              'flex items-center px-4 py-2 text-sm',
                              active
                                ? 'bg-secondary-100 text-secondary-900 dark:bg-secondary-700 dark:text-secondary-100'
                                : 'text-secondary-700 dark:text-secondary-300'
                            )}
                          >
                            <UserCircleIcon className="mr-3 h-4 w-4" />
                            Profile
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/settings"
                            className={cn(
                              'flex items-center px-4 py-2 text-sm',
                              active
                                ? 'bg-secondary-100 text-secondary-900 dark:bg-secondary-700 dark:text-secondary-100'
                                : 'text-secondary-700 dark:text-secondary-300'
                            )}
                          >
                            <Cog6ToothIcon className="mr-3 h-4 w-4" />
                            Settings
                          </Link>
                        )}
                      </Menu.Item>

                      <div className="border-t border-secondary-100 dark:border-secondary-700">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={cn(
                                'flex w-full items-center px-4 py-2 text-sm text-left',
                                active
                                  ? 'bg-secondary-100 text-secondary-900 dark:bg-secondary-700 dark:text-secondary-100'
                                  : 'text-secondary-700 dark:text-secondary-300'
                              )}
                            >
                              <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <SearchInput
            placeholder="Search camps, users, stories..."
            value={searchQuery}
            onSearch={handleSearch}
            onClear={() => setSearchQuery('')}
            size="sm"
          />
        </div>
      </div>
    </header>
  )
}