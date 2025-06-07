'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  BookmarkIcon,
  MapPinIcon,
  EllipsisHorizontalIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid
} from '@heroicons/react/24/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useFeedStore } from '@/shared/stores/feedStore'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/shared/utils/cn'
import type { Post } from '@/shared/types/post'

interface PostCardProps {
  post: Post
  onComment?: () => void
  onShare?: () => void
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onComment,
  onShare
}) => {
  const { likePost, bookmarkPost } = useFeedStore()
  const [imageError, setImageError] = useState<Record<string, boolean>>({})

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    return date.toLocaleDateString()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const handleLike = () => {
    likePost(post.id)
  }

  const handleBookmark = () => {
    bookmarkPost(post.id)
  }

  const handleImageError = (imageUrl: string) => {
    setImageError(prev => ({ ...prev, [imageUrl]: true }))
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: `${post.user.name || post.user.username}'s post`,
          text: post.content,
          url: window.location.href
        })
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    }
  }

  const handleComment = () => {
    if (onComment) {
      onComment()
    } else {
      // Default comment behavior - scroll to comments or open modal
      console.log('Open comments for post:', post.id)
    }
  }

  return (
    <article className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/${post.user.username}`}>
              <Avatar
                src={post.user.profileImageUrl}
                alt={`${post.user.name || ''} ${post.user.surname || ''}`}
                size="md"
              />
            </Link>
            <div>
              <div className="flex items-center space-x-1">
                <Link
                  href={`/${post.user.username}`}
                  className="font-semibold text-secondary-900 dark:text-secondary-100 hover:underline"
                >
                  {post.user.name && post.user.surname 
                    ? `${post.user.name} ${post.user.surname}`
                    : post.user.username
                  }
                </Link>
                {/* Note: isVerified field API'den gelmiyor, gerekirse ekleyebilirsiniz */}
              </div>
              <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-400">
                <Link
                  href={`/${post.user.username}`}
                  className="hover:underline"
                >
                  @{post.user.username}
                </Link>
                <span>•</span>
                <time dateTime={post.createdAt}>
                  {formatTimeAgo(post.createdAt)}
                </time>
              </div>
            </div>
          </div>

          <Menu as="div" className="relative">
            <MenuButton className="rounded-full p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300">
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-secondary-800">
              <MenuItem>
                <button 
                  className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700 w-full text-left"
                  onClick={handleShare}
                >
                  Share
                </button>
              </MenuItem>
              <MenuItem>
                <button className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700 w-full text-left">
                  Report
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>

        {/* Location */}
        {post.location && (
          <div className="mt-2 flex items-center text-sm text-secondary-600 dark:text-secondary-400">
            <MapPinIcon className="h-4 w-4 mr-1" />
            {post.location.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-secondary-900 dark:text-secondary-100 whitespace-pre-wrap">
          {post.content}
        </p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tags.map(tag => (
              <Link
                key={tag.id}
                href={`/search?q=%23${tag.slug || tag.name}`}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className={cn(
          'grid gap-1',
          post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        )}>
          {post.media.map((media, index) => (
            !imageError[media.id] && (
              <div
                key={media.id}
                className={cn(
                  'relative aspect-square overflow-hidden',
                  post.media!.length === 3 && index === 0 && 'row-span-2'
                )}
              >
                <Image
                  src={media.url}
                  alt={media.altTag || `Post image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-200"
                  onError={() => handleImageError(media.id)}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={media.thumbnailUrl || media.url}
                />
                
                {/* Media type indicator for videos */}
                {media.fileType.startsWith('video/') && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 border-t border-secondary-100 dark:border-secondary-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center space-x-2 transition-colors',
                post.isLikedByCurrentUser
                  ? 'text-red-600 hover:text-red-700'
                  : 'text-secondary-600 hover:text-red-600 dark:text-secondary-400 dark:hover:text-red-400'
              )}
            >
              {post.isLikedByCurrentUser ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">
                {formatNumber(post.likesCount)}
              </span>
            </button>

            <button
              onClick={handleComment}
              className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
            >
              <ChatBubbleOvalLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">
                {formatNumber(post.commentsCount)}
              </span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
            >
              <ShareIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>

          <button
            onClick={handleBookmark}
            className="text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
          >
            <BookmarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  )
}