import React from 'react'
import { cn } from '../../shared/utils/cn';

interface ProfileStatsProps {
  stats: {
    followersCount: number
    followingCount: number
    postsCount: number
    campsVisited?: number
    reviewsCount?: number
    likesReceived?: number
  }
  className?: string
  variant?: 'horizontal' | 'vertical'
  showAllStats?: boolean
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  className,
  variant = 'horizontal',
  showAllStats = false
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const basicStats = [
    { label: 'Posts', value: stats.postsCount },
    { label: 'Followers', value: stats.followersCount },
    { label: 'Following', value: stats.followingCount }
  ]

  const extendedStats = showAllStats ? [
    { label: 'Camps Visited', value: stats.campsVisited || 0 },
    { label: 'Reviews', value: stats.reviewsCount || 0 },
    { label: 'Likes Received', value: stats.likesReceived || 0 }
  ] : []

  const allStats = [...basicStats, ...extendedStats]

  if (variant === 'vertical') {
    return (
      <div className={cn('space-y-4', className)}>
        {allStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
              {formatNumber(stat.value)}
            </div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center space-x-6', className)}>
      {allStats.map((stat, index) => (
        <div key={index} className="text-center">
          <span className="font-semibold text-secondary-900 dark:text-secondary-100">
            {formatNumber(stat.value)}
          </span>
          <span className="text-secondary-600 dark:text-secondary-400 ml-1 text-sm">
            {stat.label.toLowerCase()}
          </span>
        </div>
      ))}
    </div>
  )
}

interface ProfileActionButtonsProps {
  isOwnProfile: boolean
  isFollowing?: boolean
  isAuthenticated: boolean
  onFollow?: () => void
  onMessage?: () => void
  onEdit?: () => void
  className?: string
}

export const ProfileActionButtons: React.FC<ProfileActionButtonsProps> = ({
  isOwnProfile,
  isFollowing = false,
  isAuthenticated,
  onFollow,
  onMessage,
  onEdit,
  className
}) => {
  if (isOwnProfile) {
    return (
      <div className={cn('flex items-center space-x-3', className)}>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 text-secondary-900 dark:text-secondary-100 rounded-lg font-medium transition-colors"
        >
          Edit Profile
        </button>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <button
        onClick={onFollow}
        className={cn(
          'px-4 py-2 rounded-lg font-medium transition-colors',
          isFollowing
            ? 'bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 text-secondary-900 dark:text-secondary-100'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        )}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
      
      <button
        onClick={onMessage}
        className="px-4 py-2 bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 text-secondary-900 dark:text-secondary-100 rounded-lg font-medium transition-colors"
      >
        Message
      </button>
    </div>
  )
}

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: Array<{
    id: string
    label: string
    count?: number
  }>
  className?: string
}   

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
  tabs,
  className
}) => {
  return (
    <div className={cn('border-b border-secondary-200 dark:border-secondary-700', className)}>
      <nav className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300'
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}