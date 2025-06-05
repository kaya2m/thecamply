'use client'

import React from 'react'
import {
  FunnelIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { useCampStore } from '@/shared/stores/campStore'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/shared/utils/cn'
import type { Camp, CampFilters as CampFiltersType } from '@/shared/types/camp'

interface CampFiltersProps {
  isOpen: boolean
  onClose: () => void
}

const categoryOptions: { value: Camp['category']; label: string }[] = [
  { value: 'tent', label: 'Tent Camping' },
  { value: 'rv', label: 'RV Camping' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'glamping', label: 'Glamping' },
  { value: 'wild', label: 'Wild Camping' }
]

const priceRangeOptions: { value: Camp['priceRange']; label: string }[] = [
  { value: '$', label: 'Budget ($)' },
  { value: '$$', label: 'Moderate ($$)' },
  { value: '$$$', label: 'Premium ($$$)' }
]

const amenityOptions = [
  'Fresh Water',
  'Toilets',
  'Showers',
  'Fire Pits',
  'Picnic Tables',
  'Parking',
  'Wifi',
  'Restaurant',
  'Beach Access',
  'Hiking Trails',
  'Mountain Views',
  'Security'
]

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'distance', label: 'Nearest First' },
  { value: 'price', label: 'Price' },
  { value: 'newest', label: 'Newest' }
]

export const CampFilters: React.FC<CampFiltersProps> = ({
  isOpen,
  onClose
}) => {
  const { filters, setFilters } = useCampStore()

  const updateFilter = <K extends keyof CampFiltersType>(
    key: K,
    value: CampFiltersType[K]
  ) => {
    setFilters({ [key]: value })
  }

  const toggleArrayFilter = <T,>(
    key: keyof CampFiltersType,
    value: T,
    currentArray: T[] = []
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    setFilters({ [key]: newArray.length > 0 ? newArray : undefined })
  }

  const clearFilters = () => {
    setFilters({})
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category?.length) count++
    if (filters.priceRange?.length) count++
    if (filters.rating) count++
    if (filters.amenities?.length) count++
    if (filters.sortBy) count++
    return count
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Camps"
      size="lg"
    >
      <div className="space-y-6">
        {/* Active filters count */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex items-center justify-between">
            <Badge variant="primary">
              {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
            </Badge>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Category */}
        <div>
          <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-3">
            Camp Type
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {categoryOptions.map(option => (
              <button
                key={option.value}
                onClick={() => toggleArrayFilter('category', option.value, filters.category)}
                className={cn(
                  'p-3 text-left rounded-lg border transition-colors',
                  filters.category?.includes(option.value)
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50'
                    : 'border-secondary-200 hover:border-secondary-300 dark:border-secondary-600'
                )}
              >
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-3">
            Price Range
          </h3>
          <div className="flex flex-wrap gap-2">
            {priceRangeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => toggleArrayFilter('priceRange', option.value, filters.priceRange)}
                className={cn(
                  'px-4 py-2 rounded-lg border transition-colors',
                  filters.priceRange?.includes(option.value)
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                    : 'border-secondary-200 text-secondary-700 hover:border-secondary-300 dark:border-secondary-600 dark:text-secondary-300'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-3">
            Minimum Rating
          </h3>
          <div className="flex space-x-2">
            {[3, 3.5, 4, 4.5].map(rating => (
              <button
                key={rating}
                onClick={() => updateFilter('rating', filters.rating === rating ? undefined : rating)}
                className={cn(
                  'flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors',
                  filters.rating === rating
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50'
                    : 'border-secondary-200 hover:border-secondary-300 dark:border-secondary-600'
                )}
              >
                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  {rating}+
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-3">
            Amenities
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {amenityOptions.map(amenity => (
              <label
                key={amenity}
                className="flex items-center space-x-2 p-2 rounded hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.amenities?.includes(amenity) || false}
                  onChange={() => toggleArrayFilter('amenities', amenity, filters.amenities)}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-3">
            Sort By
          </h3>
          <div className="space-y-2">
            {sortOptions.map(option => (
              <label
                key={option.value}
                className="flex items-center space-x-2 p-2 rounded hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer"
              >
                <input
                  type="radio"
                  name="sortBy"
                  value={option.value}
                  checked={filters.sortBy === option.value}
                  onChange={(e) => updateFilter('sortBy', e.target.value as any)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200 dark:border-secondary-700">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  )
}