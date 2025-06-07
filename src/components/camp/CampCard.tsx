'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  StarIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useCampStore } from '@/shared/stores/campStore'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/shared/utils/cn'
import type { Camp } from '@/shared/types/camp'

interface CampCardProps {
  camp: Camp
  variant?: 'grid' | 'list'
}

const categoryLabels = {
  tent: 'Tent Camping',
  rv: 'RV Camping',
  cabin: 'Cabin',
  glamping: 'Glamping',
  wild: 'Wild Camping'
}

const priceRangeLabels = {
  $: 'Budget',
  $$: 'Premium',
  $$$: 'Luxury'
}

export const CampCard: React.FC<CampCardProps> = ({
  camp,
  variant = 'grid'
}) => {
  const { toggleFavorite } = useCampStore()
  const [imageError, setImageError] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(camp.id)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={cn(
          'h-4 w-4',
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-secondary-300 dark:text-secondary-600'
        )}
      />
    ))
  }

  if (variant === 'list') {
    return (
      <Link href={`/camps/${camp.id}`}>
        <div className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex">
            {/* Image */}
            <div className="relative w-48 h-32 flex-shrink-0">
              {!imageError && camp.images[0] ? (
                <Image
                  src={camp.images[0]}
                  alt={camp.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="192px"
                />
              ) : (
                <div className="w-full h-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center">
                  <span className="text-secondary-400">No image</span>
                </div>
              )}
              {/* Favorite button */}
              <button
                onClick={handleFavoriteClick}
                className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-secondary-800/90 rounded-full shadow-sm hover:bg-white dark:hover:bg-secondary-800 transition-colors"
              >
                {camp.isFavorite ? (
                  <HeartIconSolid className="h-4 w-4 text-red-500" />
                ) : (
                  <HeartIcon className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                      {camp.name}
                    </h3>
                    {camp.isVerified && (
                      <CheckBadgeIcon className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {renderStars(camp.rating)}
                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                      {camp.rating}
                    </span>
                    <span className="text-sm text-secondary-500 dark:text-secondary-400">
                      ({camp.reviewsCount} reviews)
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {camp.location.name}
                  </div>

                  <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                    {camp.description}
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-2 ml-4">
                  <Badge variant="secondary">
                    {categoryLabels[camp.category]}
                  </Badge>
                  <Badge variant="outline">
                    {priceRangeLabels[camp.priceRange]}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/camps/${camp.id}`}>
      <div className="bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 overflow-hidden hover:shadow-lg transition-shadow group">
        {/* Image */}
        <div className="relative aspect-[4/3]">
          {!imageError && camp.images[0] ? (
            <Image
              src={camp.images[0]}
              alt={camp.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center">
              <span className="text-secondary-400">No image available</span>
            </div>
          )}
          
          {/* Overlays */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary">
              {categoryLabels[camp.category]}
            </Badge>
          </div>
          
          <div className="absolute top-3 right-3">
            <button
              onClick={handleFavoriteClick}
              className="p-2 bg-white/90 dark:bg-secondary-800/90 rounded-full shadow-sm hover:bg-white dark:hover:bg-secondary-800 transition-colors"
            >
              {camp.isFavorite ? (
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              )}
            </button>
          </div>

          {camp.isVerified && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center space-x-1 bg-white/90 dark:bg-secondary-800/90 rounded-full px-2 py-1">
                <CheckBadgeIcon className="h-4 w-4 text-primary-600" />
                <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">
                  Verified
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
            {camp.name}
          </h3>
          
          <div className="flex items-center space-x-1 mb-2">
            {renderStars(camp.rating)}
            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300 ml-1">
              {camp.rating}
            </span>
            <span className="text-sm text-secondary-500 dark:text-secondary-400">
              ({camp.reviewsCount})
            </span>
          </div>

          <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-3">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{camp.location.name}</span>
          </div>

          <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2 mb-3">
            {camp.description}
          </p>

          {/* Amenities */}
          {camp.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {camp.amenities.slice(0, 3).map(amenity => (
                <Badge key={amenity} variant="outline" size="sm">
                  {amenity}
                </Badge>
              ))}
              {camp.amenities.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{camp.amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Features */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {camp.features.slice(0, 4).map(feature => (
                <span
                  key={feature.id}
                  className={cn(
                    'text-lg',
                    feature.available ? 'opacity-100' : 'opacity-30'
                  )}
                  title={feature.name}
                >
                  {feature.icon}
                </span>
              ))}
            </div>
            
            <Badge variant="outline">
              {priceRangeLabels[camp.priceRange]}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  )
}