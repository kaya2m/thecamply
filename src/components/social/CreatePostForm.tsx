'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  PhotoIcon,
  MapPinIcon,
  XMarkIcon,
  GlobeAltIcon,
  UserGroupIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { useFeedStore } from '@/shared/stores/feedStore'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { cn } from '@/shared/utils/cn'
import type { CreatePostData } from '@/shared/types/post'
import { useAuthStore } from '@/lib/store/auth/authStore'

interface CreatePostFormProps {
  isOpen: boolean
  onClose: () => void
}

const visibilityOptions = [
  { value: 'public', label: 'Public', icon: GlobeAltIcon, description: 'Anyone can see this post' },
  { value: 'friends', label: 'Friends', icon: UserGroupIcon, description: 'Only your friends can see this post' },
  { value: 'private', label: 'Private', icon: LockClosedIcon, description: 'Only you can see this post' }
] as const

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuthStore()
  const { createPost, loading } = useFeedStore()
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [visibility, setVisibility] = useState<'public' | 'friends' | 'private'>('public')
  const [location, setLocation] = useState<{ name: string; coordinates: [number, number] } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<{ content: string; tags: string }>()

  const content = watch('content', '')
  const maxLength = 500

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + selectedImages.length > 4) {
      alert('You can only upload up to 4 images')
      return
    }
    setSelectedImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: { content: string; tags: string }) => {
    if (!data.content.trim()) return

    const tags = data.tags
      .split(/[,\s]+/)
      .map(tag => tag.replace(/^#/, '').trim())
      .filter(tag => tag.length > 0)

    const postData: CreatePostData = {
      content: data.content.trim(),
      images: selectedImages,
      location: location ?? undefined,
      tags,
      visibility
    }

    await createPost(postData)
    
    if (!useFeedStore.getState().error) {
      reset()
      setSelectedImages([])
      setLocation(null)
      setVisibility('public')
      onClose()
    }
  }

  if (!user) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Post"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* User info */}
        <div className="flex items-center space-x-3">
          <Avatar
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            size="md"
          />
          <div>
            <p className="font-semibold text-secondary-900 dark:text-secondary-100">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              @{user.username}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Textarea
            placeholder="Share your camping adventure..."
            rows={4}
            {...register('content', {
              required: 'Please write something',
              maxLength: {
                value: maxLength,
                message: `Content must be ${maxLength} characters or less`
              }
            })}
            error={errors.content?.message}
          />
          <div className="flex justify-between text-sm">
            <span className="text-secondary-500 dark:text-secondary-400">
              Share your camping experiences, tips, or discoveries
            </span>
            <span className={cn(
              'font-medium',
              content.length > maxLength * 0.9
                ? 'text-red-600'
                : content.length > maxLength * 0.7
                ? 'text-yellow-600'
                : 'text-secondary-500 dark:text-secondary-400'
            )}>
              {content.length}/{maxLength}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <input
            type="text"
            placeholder="Tags (separated by commas or spaces) e.g. camping, turkey, hiking"
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-800 dark:border-secondary-600 dark:text-secondary-100"
            {...register('tags')}
          />
        </div>

        {/* Images */}
        {selectedImages.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Selected ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-5 w-5 text-primary-600" />
              <span className="text-sm text-secondary-700 dark:text-secondary-300">
                {location.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLocation(null)}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Visibility */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Who can see this post?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {visibilityOptions.map(option => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setVisibility(option.value)}
                  className={cn(
                    'p-3 rounded-lg border text-left transition-colors',
                    visibility === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/50'
                      : 'border-secondary-200 hover:border-secondary-300 dark:border-secondary-600'
                  )}
                >
                  <Icon className="h-5 w-5 mb-2 text-primary-600" />
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    {option.label}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center space-x-2">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={selectedImages.length >= 4}
              />
              <div className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
                selectedImages.length >= 4
                  ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-400 dark:hover:bg-secondary-600'
              )}>
                <PhotoIcon className="h-5 w-5" />
              </div>
            </label>

            <button
              type="button"
              onClick={() => {
                // In a real app, this would open a location picker
                setLocation({
                  name: 'Antalya, Turkey',
                  coordinates: [36.8969, 30.7133]
                })
              }}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary-100 text-secondary-600 hover:bg-secondary-200 dark:bg-secondary-700 dark:text-secondary-400 dark:hover:bg-secondary-600 transition-colors"
            >
              <MapPinIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!content.trim() || content.length > maxLength}
            >
              Post
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}