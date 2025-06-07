'use client'

import React, { useState, useEffect } from 'react'
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MapIcon
} from '@heroicons/react/24/outline'
import { useCampStore } from '@/shared/stores/campStore'
import { CampCard } from '@/components/camp/CampCard'
import { CampFilters } from '@/components/camp/CampFilters'
import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/shared/utils/cn'
import dynamic from 'next/dynamic'
import type { Camp } from '@/shared/types/camp'

const CampMap = dynamic(() => import('@/components/camp/CampMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-secondary-100 dark:bg-secondary-800 rounded-lg animate-pulse" />
})

export default function ExplorePage() {
  const { camps, loading, error, searchQuery, setSearchQuery, fetchCamps } = useCampStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null)

  useEffect(() => {
    fetchCamps()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCampClick = (camp: Camp) => {
    setSelectedCamp(camp)
    if (viewMode !== 'map') {
      setViewMode('map')
    }
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={() => fetchCamps()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-5 mt-5">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          Discover Amazing Camps
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Find the perfect camping spot for your next adventure
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search camps by name, location, or amenities..."
              value={searchQuery}
              onSearch={handleSearch}
              size="lg"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </Button>
            <div className="flex items-center border border-secondary-200 dark:border-secondary-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                    : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100'
                )}
                aria-label="Grid view"
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                    : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100'
                )}
                aria-label="List view"
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={cn(
                  'p-2 rounded transition-colors',
                  viewMode === 'map'
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                    : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100'
                )}
                aria-label="Map view"
              >
                <MapIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {searchQuery && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              Searching for:
            </span>
            <Badge variant="primary">
              {searchQuery}
            </Badge>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          {loading ? 'Loading...' : `${camps.length} camp${camps.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Content */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CampMap
              camps={camps}
              height="600px"
              onCampClick={handleCampClick}
              selectedCampId={selectedCamp?.id}
            />
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
              Camps on Map
            </h3>
            {camps.map(camp => (
              <div
                key={camp.id}
                className={cn(
                  'p-4 rounded-lg border cursor-pointer transition-colors',
                  selectedCamp?.id === camp.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50'
                    : 'border-secondary-200 hover:border-secondary-300 dark:border-secondary-700'
                )}
                onClick={() => setSelectedCamp(camp)}
              >
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100">
                  {camp.name}
                </h4>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  {camp.location.name}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-sm font-medium">{camp.rating}</span>
                  <span className="text-sm text-secondary-500 ml-1">
                    ({camp.reviewsCount})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        )}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-secondary-800 rounded-lg p-6 animate-pulse">
                <div className="aspect-[4/3] bg-secondary-200 dark:bg-secondary-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4"></div>
                  <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2"></div>
                  <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-full"></div>
                </div>
              </div>
            ))
          ) : camps.length > 0 ? (
            camps.map(camp => (
              <CampCard
                key={camp.id}
                camp={camp}
                variant={viewMode}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-secondary-500 dark:text-secondary-400 mb-4">
                No camps found matching your criteria
              </p>
              <Button onClick={() => fetchCamps()}>
                Show All Camps
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Filters Modal */}
      <CampFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  )
}