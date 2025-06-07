import React from 'react'
import { FeedContainer } from '@/features/social-feed/FeedContainer'

export default function FeedPage() {
  return (
    <div>
      {/* <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Your Feed
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Discover the latest camping adventures from your community
        </p>
      </div> */}
      
      <FeedContainer />
    </div>
  )
}