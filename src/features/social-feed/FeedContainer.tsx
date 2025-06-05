'use client'

import React, { useEffect, useState } from 'react'
import { useFeedStore } from '@/shared/stores/feedStore'
import { PostCard } from '@/components/social/PostCard'
import { PostSkeleton } from '@/components/social/PostSkeleton'
import { CreatePostForm } from '@/components/social/CreatePostForm'
import { Button } from '@/components/ui/Button'
import { PlusIcon } from '@heroicons/react/24/outline'

export const FeedContainer: React.FC = () => {
  const { posts, loading, error, hasMore, fetchPosts } = useFeedStore()
  const [showCreatePost, setShowCreatePost] = useState(false)

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts(true)
    }
  }, [])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts()
    }
  }

  const handleRefresh = () => {
    fetchPosts(true)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Create post button */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 p-4">
        <Button
          onClick={() => setShowCreatePost(true)}
          fullWidth
          variant="ghost"
          className="justify-start text-secondary-500 dark:text-secondary-400"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Share your camping adventure...
        </Button>
      </div>

      {/* Posts */}
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onComment={() => console.log('Open comments for', post.id)}
          onShare={() => console.log('Share post', post.id)}
        />
      ))}

      {/* Loading skeletons */}
      {loading && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <PostSkeleton key={`skeleton-${i}`} />
          ))}
        </>
      )}

      {/* Load more button */}
      {!loading && hasMore && posts.length > 0 && (
        <div className="text-center py-6">
          <Button onClick={handleLoadMore} variant="ghost">
            Load More Posts
          </Button>
        </div>
      )}

      {/* End of feed */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-500 dark:text-secondary-400">
            You're all caught up! 🎉
          </p>
        </div>
      )}

      {/* Create post modal */}
      <CreatePostForm
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </div>
  )
}