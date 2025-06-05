'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  StarIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  CheckBadgeIcon,
  ArrowLeftIcon,
  CameraIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useCampStore } from '@/shared/stores/campStore'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/shared/utils/cn'
import dynamic from 'next/dynamic'

const CampMap = dynamic(() => import('@/components/camp/CampMap'), {
  ssr: false,
  loading: () => <div className="h-64 bg-secondary-100 dark:bg-secondary-800 rounded-lg animate-pulse" />
})

export default function CampDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { selectedCamp, loading, error, fetchCampById, toggleFavorite } = useCampStore()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showAllImages, setShowAllImages] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchCampById(params.id as string)
    }
  }, [params.id, fetchCampById])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded w-1/4"></div>
          <div className="aspect-[2/1] bg-secondary-200 dark:bg-secondary-700 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-6 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2"></div>
            <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-full"></div>
            <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !selectedCamp) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error || 'Camp not found'}
        </p>
        <Button onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  const camp = selectedCamp

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: camp.name,
        text: camp.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Show toast notification
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={cn(
          'h-5 w-5',
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-secondary-300 dark:text-secondary-600'
        )}
      />
    ))
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Back to results</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[2/1] rounded-lg overflow-hidden">
              <Image
                src={camp.images[selectedImageIndex] || camp.images[0]}
                alt={camp.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              
              {camp.images.length > 1 && (
                <button
                  onClick={() => setShowAllImages(true)}
                  className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-black/70 transition-colors"
                >
                  <CameraIcon className="h-4 w-4" />
                  <span>{camp.images.length} photos</span>
                </button>
              )}
            </div>
            
            {camp.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {camp.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      'relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0',
                      selectedImageIndex === index && 'ring-2 ring-primary-500'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${camp.name} photo ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Camp info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                    {camp.name}
                  </h1>
                  {camp.isVerified && (
                    <CheckBadgeIcon className="h-8 w-8 text-primary-600" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(camp.rating)}
                    <span className="font-semibold text-secondary-900 dark:text-secondary-100 ml-1">
                      {camp.rating}
                    </span>
                    <span className="text-secondary-600 dark:text-secondary-400">
                      ({camp.reviewsCount} reviews)
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {camp.category}
                  </Badge>
                  <Badge variant="outline">
                    {camp.priceRange}
                  </Badge>
                </div>

                <div className="flex items-center text-secondary-600 dark:text-secondary-400">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {camp.location.name}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                >
                  <ShareIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(camp.id)}
                  className={camp.isFavorite ? 'text-red-500' : ''}
                >
                  {camp.isFavorite ? (
                    <HeartIconSolid className="h-5 w-5" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <p className="text-secondary-700 dark:text-secondary-300 text-lg leading-relaxed">
              {camp.description}
            </p>
          </div>

          {/* Features */}
          <Card>
            <CardHeader title="What this place offers" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {camp.features.map(feature => (
                <div
                  key={feature.id}
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg',
                    feature.available
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'bg-red-50 dark:bg-red-900/20 opacity-60'
                  )}
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className={cn(
                    'text-sm font-medium',
                    feature.available
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  )}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader title="Amenities" />
            <div className="flex flex-wrap gap-2">
              {camp.amenities.map(amenity => (
                <Badge key={amenity} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Map */}
          <Card>
            <CardHeader title="Location" />
            <CampMap
              camps={[camp]}
              center={camp.location.coordinates}
              zoom={12}
              height="300px"
            />
            <div className="mt-4 text-sm text-secondary-600 dark:text-secondary-400">
              <p>{camp.location.address}</p>
            </div>
          </Card>

          {/* Host info */}
          <Card>
            <CardHeader title="Hosted by" />
            <div className="flex items-center space-x-4">
              <Avatar
                src={camp.createdBy.avatar}
                alt={`${camp.createdBy.firstName} ${camp.createdBy.lastName}`}
                size="lg"
              />
              <div>
                <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                  {camp.createdBy.firstName} {camp.createdBy.lastName}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  @{camp.createdBy.username}
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                  Member since {new Date(camp.createdAt).getFullYear()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact card */}
          <Card>
            <CardHeader title="Contact Information" />
            <div className="space-y-3">
              {camp.contact?.phone && (
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-secondary-400" />
                  <a
                    href={`tel:${camp.contact.phone}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    {camp.contact.phone}
                  </a>
                </div>
              )}
              {camp.contact?.website && (
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="h-5 w-5 text-secondary-400" />
                  <a
                    href={camp.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button fullWidth size="lg">
              Contact Host
            </Button>
            <Button variant="ghost" fullWidth>
              Share Location
            </Button>
          </div>

          {/* Reviews summary */}
          <Card>
            <CardHeader 
              title="Reviews" 
              action={
                <Link href={`/camps/${camp.id}/reviews`}>
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </Link>
              } 
            />
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                {camp.rating}
              </div>
              <div className="flex justify-center items-center space-x-1 mb-2">
                {renderStars(camp.rating)}
              </div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Based on {camp.reviewsCount} reviews
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}