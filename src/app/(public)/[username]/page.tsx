'use client'

import React, { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import {
  MapPinIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  UserMinusIcon,
  ChatBubbleLeftRightIcon,
  EllipsisHorizontalIcon,
  CheckBadgeIcon,
  CameraIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/shared/utils/cn'
import { useAuthStore } from '@/lib/store/auth/authStore'
import { PostCard } from '@/components/social/PostCard'
import { PostSkeleton } from '@/components/social/PostSkeleton'
import { useUserStore } from '@/lib/store/user/userStore'

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { user: currentUser, isAuthenticated } = useAuthStore()
  const {
    profileUser,
    userPosts,
    loading,
    error,
    fetchUserProfile,
    fetchUserPosts,
    followUser,
    unfollowUser
  } = useUserStore()

  const [activeTab, setActiveTab] = useState<'posts' | 'camps' | 'reviews' | 'favorites'>('posts')
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
  }, [username, params])

  useEffect(() => {
      if (currentUser?.id) {
        fetchUserPosts(currentUser.id)
    }
  }, [username, fetchUserProfile, fetchUserPosts, profileUser])

  useEffect(() => {
  }, [profileUser, error])

  useEffect(() => {
    if (profileUser && currentUser) {
      setIsFollowing(Math.random() > 0.5)
    }
  }, [profileUser, currentUser])
debugger
  // Show debug info if no user found
  if (!loading && !profileUser && !error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            User Profile Debug
          </h1>
          <div className="space-y-2 text-left bg-secondary-100 dark:bg-secondary-800 p-4 rounded">
            <p><strong>Requested username:</strong> {username}</p>
            <p><strong>Params:</strong> {JSON.stringify(params)}</p>
            <p><strong>Loading:</strong> {loading.toString()}</p>
            <p><strong>Error:</strong> {error || 'null'}</p>
            <p><strong>Profile User:</strong> {profileUser ? 'Found' : 'Not found'}</p>
          </div>
          <div className="mt-6">
            <p className="text-secondary-600 dark:text-secondary-400 mb-4">
              Available test usernames:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/outdoorExplorer'}
              >
                outdoorExplorer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/mountainExplorer'}
              >
                mountainExplorer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/coastalCamper'}
              >
                coastalCamper
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (loading) {
    return <ProfileSkeleton />
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Profile Not Found</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            User "{username}" could not be found.
          </p>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-6">
            Error: {error}
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </Card>
      </div>
    )
  }

  if (!profileUser) {
    notFound()
  }

  const isOwnProfile = currentUser?.username === profileUser.username

  const handleFollow = async () => {
    if (!isAuthenticated) return
    
    try {
      if (isFollowing) {
        await unfollowUser(profileUser.id)
        setIsFollowing(false)
      } else {
        await followUser(profileUser.id)
        setIsFollowing(true)
      }
    } catch (error) {
      console.error('Follow/unfollow failed:', error)
    }
  }

  const handleMessage = () => {
    window.location.href = `/messages?user=${profileUser.username}`
  }

  const formatJoinDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const tabs = [
    { id: 'posts', label: 'Posts', count: profileUser.stats.postsCount },
    { id: 'camps', label: 'Camps', count: profileUser.stats.campsVisited },
    { id: 'reviews', label: 'Reviews', count: profileUser.stats.reviewsCount },
    { id: 'favorites', label: 'Favorites', count: 0 }
  ] as const

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-2">
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 md:h-64 bg-gradient-to-br from-primary-500 to-accent-500 rounded-t-lg relative overflow-hidden">
            {profileUser.coverPhoto && (
              <Image
                src={profileUser.coverPhoto}
                alt="Cover"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                onError={(e) => {
                  console.error('Cover photo failed to load:', profileUser.coverPhoto)
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            {/* Overlay for better content visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            {isOwnProfile && (
              <button className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
                <CameraIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Profile Info */}
        <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6 ">
              {/* Avatar */}
              <div className="relative  md:mb-0 z-20">
                <Avatar
                  src={profileUser.profileImageUrl}
                  alt={`${profileUser.name} ${profileUser.surname}`}
                  size="xxl"
                />
                {isOwnProfile && (
                  <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg z-10">
                    <CameraIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                        {profileUser.name} {profileUser.surname}
                      </h1>
                      {profileUser.isVerified && (
                        <CheckBadgeIcon className="h-6 w-6 md:h-7 md:w-7 text-primary-600" />
                      )}
                    </div>
                    <p className="text-secondary-600 dark:text-secondary-400 mb-2">
                      @{profileUser.username}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm">
                      <div>
                        <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                          {profileUser.stats.followersCount}
                        </span>
                        <span className="text-secondary-600 dark:text-secondary-400 ml-1">
                          followers
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                          {profileUser.stats.followingCount}
                        </span>
                        <span className="text-secondary-600 dark:text-secondary-400 ml-1">
                          following
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                          {profileUser.stats.likesReceived}
                        </span>
                        <span className="text-secondary-600 dark:text-secondary-400 ml-1">
                          likes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 mt-4 md:mt-0 relative z-10">
                    {isOwnProfile ? (
                      <Button variant="outline" onClick={() => window.location.href = '/profile/edit'}>
                        Edit Profile
                      </Button>
                    ) : isAuthenticated ? (
                      <>
                        <Button
                          variant={isFollowing ? "outline" : "primary"}
                          onClick={handleFollow}
                          className="flex items-center space-x-2"
                        >
                          {isFollowing ? (
                            <>
                              <UserMinusIcon className="h-4 w-4" />
                              <span>Unfollow</span>
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="h-4 w-4" />
                              <span>Follow</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={handleMessage}
                          className="flex items-center space-x-2"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          <span>Message</span>
                        </Button>
                      </>
                    ) : null}
                    
                    <button className="p-2 text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors">
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio and Details */}
            <div className="mt-6 space-y-3 relative z-10">
              {profileUser.bio && (
                <p className="text-secondary-700 dark:text-secondary-300 text-lg">
                  {profileUser.bio}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600 dark:text-secondary-400">
                {profileUser.location && (
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{profileUser.location}</span>
                  </div>
                )}
                {profileUser.website && (
                  <div className="flex items-center space-x-1">
                    <GlobeAltIcon className="h-4 w-4" />
                    <a 
                      href={profileUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      {profileUser.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <CalendarDaysIcon className="h-4 w-4" />
                  <span>Joined {formatJoinDate(profileUser.joinDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Content Tabs */}
      <div className="mb-8">
        <div className="border-b border-secondary-200 dark:border-secondary-700">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 dark:text-secondary-400 dark:hover:text-secondary-300'
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge variant="secondary" size="sm" className="ml-2">
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <PostSkeleton key={i} />
              ))
            ) : userPosts.length > 0 ? (
              userPosts.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onComment={() => console.log('Comment on', post.id)}
                  onShare={() => console.log('Share', post.id)}
                />
              ))
            ) : (
              <EmptyState
                title="No posts yet"
                description={
                  isOwnProfile
                    ? "You haven't shared any camping adventures yet. Create your first post!"
                    : `${profileUser.name} hasn't shared any posts yet.`
                }
                action={
                  isOwnProfile ? (
                    <Button>Create First Post</Button>
                  ) : null
                }
              />
            )}
          </div>
        )}

        {activeTab === 'camps' && (
          <EmptyState
            title="No camps visited yet"
            description={
              isOwnProfile
                ? "Start exploring and mark the camps you've visited!"
                : `${profileUser.name} hasn't marked any visited camps yet.`
            }
          />
        )}

        {activeTab === 'reviews' && (
          <EmptyState
            title="No reviews yet"
            description={
              isOwnProfile
                ? "Share your camping experiences by writing reviews!"
                : `${profileUser.name} hasn't written any reviews yet.`
            }
          />
        )}

        {activeTab === 'favorites' && (
          <EmptyState
            title="No favorites yet"
            description={
              isOwnProfile
                ? "Save your favorite camps and posts here!"
                : `${profileUser.name} hasn't favorited anything yet.`
            }
          />
        )}
      </div>
    </div>
  )
}

// Helper Components
function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8 animate-pulse">
        <div className="h-48 md:h-64 bg-secondary-300 dark:bg-secondary-700 rounded-t-lg"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16 md:-mt-20">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary-300 dark:bg-secondary-700 rounded-full mb-4 md:mb-0"></div>
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-secondary-300 dark:bg-secondary-700 rounded w-1/3"></div>
              <div className="h-4 bg-secondary-300 dark:bg-secondary-700 rounded w-1/4"></div>
              <div className="h-4 bg-secondary-300 dark:bg-secondary-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description: string
  action?: React.ReactNode
}

function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-secondary-300 dark:text-secondary-600 mb-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1h8z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
        {title}
      </h3>
      <p className="text-secondary-500 dark:text-secondary-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action}
    </div>
  )
}