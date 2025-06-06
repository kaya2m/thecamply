'use client'

import React, { useEffect, useState } from 'react'
import { useCampStore } from '@/shared/stores/campStore'
import { SearchInput } from '@/components/ui/SearchInput'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/shared/utils/cn'
import {
  ListBulletIcon,
  XMarkIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import type { Camp } from '@/shared/types/camp'

const CampMap = dynamic(() => import('@/components/camp/CampMap'), {
  ssr: false,
  loading: () => (
    <div className="h-screen bg-secondary-100 dark:bg-secondary-800 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-secondary-600 dark:text-secondary-400">Loading map...</p>
      </div>
    </div>
  )
})

export default function MapPage() {
  const { camps, loading, error, searchQuery, setSearchQuery, fetchCamps } = useCampStore()
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.0, 35.0]) // Turkey center
  const [mapZoom, setMapZoom] = useState(6)

  useEffect(() => {
    if (camps.length === 0) {
      fetchCamps()
    }
  }, [camps.length, fetchCamps])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCampClick = (camp: Camp) => {
    setSelectedCamp(camp)
    setMapCenter(camp.location.coordinates)
    setMapZoom(12)
  }

  const handleCampCardClick = (camp: Camp) => {
    setSelectedCamp(camp)
    setMapCenter(camp.location.coordinates)
    setMapZoom(12)
  }

  const filteredCamps = camps.filter(camp =>
    searchQuery === '' ||
    camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camp.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    camp.amenities.some(amenity => 
      amenity.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPinIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
            Failed to load map
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => fetchCamps()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex relative">
      {/* Sidebar */}
      <div className={cn(
        'bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-700 flex flex-col transition-all duration-300 ease-in-out z-20',
        showSidebar ? 'w-96' : 'w-0 overflow-hidden'
      )}>
        {/* Search header */}
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
              Explore Camps
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(false)}
              className="hover:bg-secondary-100 dark:hover:bg-secondary-800"
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>
          
          <SearchInput
            placeholder="Search camps..."
            value={searchQuery}
            onSearch={handleSearch}
            loading={loading}
            className="mb-3"
          />

          {/* Quick stats */}
          <div className="flex items-center justify-between text-sm text-secondary-600 dark:text-secondary-400">
            <span>
              {loading ? 'Loading...' : `${filteredCamps.length} camps found`}
            </span>
            {selectedCamp && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCamp(null)
                  setMapCenter([39.0, 35.0])
                  setMapZoom(6)
                }}
              >
                Clear selection
              </Button>
            )}
          </div>
        </div>

        {/* Camp list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-secondary-200 dark:bg-secondary-700 rounded-lg mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4"></div>
                    <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCamps.length > 0 ? (
            <div className="p-4 space-y-3">
              {filteredCamps.map((camp) => (
                <Card
                  key={camp.id}
                  className={cn(
                    'p-4 cursor-pointer hover:shadow-md transition-all duration-200 border',
                    selectedCamp?.id === camp.id
                      ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700'
                      : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600'
                  )}
                >
                  <div
                    className="flex space-x-3 cursor-pointer"
                    onClick={() => handleCampCardClick(camp)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleCampCardClick(camp)
                      }
                    }}
                  >
                    {/* Camp image */}
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={camp.images[0]}
                        alt={camp.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-camp.png' // Fallback image
                        }}
                      />
                    </div>
                    
                    {/* Camp info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 truncate text-sm">
                          {camp.name}
                        </h3>
                        {camp.isVerified && (
                          <Badge variant="success" size="sm" className="ml-2 flex-shrink-0">
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-secondary-600 dark:text-secondary-400 mb-2 truncate">
                        <MapPinIcon className="h-3 w-3 inline mr-1" />
                        {camp.location.name}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <StarIcon className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                            <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">
                              {camp.rating}
                            </span>
                          </div>
                          <Badge variant="outline" size="sm">
                            {camp.category}
                          </Badge>
                        </div>
                        
                        <Badge variant="secondary" size="sm">
                          {camp.priceRange}
                        </Badge>
                      </div>
                      
                      {/* Amenities preview */}
                      {camp.amenities.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                            {camp.amenities.slice(0, 2).join(', ')}
                            {camp.amenities.length > 2 && ` +${camp.amenities.length - 2} more`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <MapPinIcon className="h-12 w-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                No camps found
              </h3>
              <p className="text-secondary-500 dark:text-secondary-400 mb-4">
                {searchQuery 
                  ? `No camps match "${searchQuery}". Try adjusting your search.`
                  : 'No camps available in this area.'
                }
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 flex-shrink-0">
          <div className="text-xs text-secondary-500 dark:text-secondary-400 text-center">
            💡 Click on map markers or camp cards to view details
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative">
        {/* Toggle sidebar button (when sidebar is hidden) */}
        {!showSidebar && (
          <div className="absolute top-4 left-4 z-30">
            <Button
              onClick={() => setShowSidebar(true)}
              className="shadow-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 hover:bg-secondary-50 dark:hover:bg-secondary-700"
              size="sm"
            >
              <ListBulletIcon className="h-5 w-5 mr-2" />
              Show List ({filteredCamps.length})
            </Button>
          </div>
        )}

        {/* Map controls */}
        <div className="absolute top-4 right-4 z-30 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white dark:bg-secondary-800 shadow-lg"
            onClick={() => {
              setMapCenter([39.0, 35.0])
              setMapZoom(6)
              setSelectedCamp(null)
            }}
          >
            Reset View
          </Button>
          
          {selectedCamp && (
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg p-3 max-w-xs">
              <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 text-sm mb-1">
                {selectedCamp.name}
              </h4>
              <p className="text-xs text-secondary-600 dark:text-secondary-400 mb-2">
                {selectedCamp.location.name}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <StarIcon className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                  <span className="text-xs font-medium">{selectedCamp.rating}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Navigate to camp details
                    window.open(`/camps/${selectedCamp.id}`, '_blank')
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Map component */}
        <CampMap
          camps={filteredCamps}
          height="100vh"
          onCampClick={handleCampClick}
          selectedCampId={selectedCamp?.id}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
    </div>
  )
}