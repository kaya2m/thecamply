'use client'

import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  PhotoIcon,
  CameraIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/shared/utils/cn'
import { useAuthStore } from '@/lib/store/auth/authStore'
import { useUserStore } from '@/lib/store/user/userStore'

interface EditProfileFormData {
  name: string
  surname: string
  username: string
  bio: string
  location: string
  website: string
  phone: string
  dateOfBirth: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { updateProfile, uploadAvatar, uploadCoverPhoto, loading } = useUserStore()
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm<EditProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      surname: user?.surname || '',
      username: user?.username || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
    }
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      setAvatarFile(file)
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      setCoverFile(file)
      const previewUrl = URL.createObjectURL(file)
      setCoverPreview(previewUrl)
    }
  }

  const removeCover = () => {
    setCoverFile(null)
    setCoverPreview(null)
    if (coverInputRef.current) {
      coverInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      // Upload avatar if changed
      if (avatarFile) {
        await uploadAvatar(avatarFile)
      }

      // Upload cover photo if changed
      if (coverFile) {
        await uploadCoverPhoto(coverFile)
      }

      // Update profile data
      await updateProfile({
        name: data.name,
        surname: data.surname,
        // username: data.username,s
        bio: data.bio,
        // location: data.location,
        // website: data.website,
        // phone: data.phone,
        // dateOfBirth: data.dateOfBirth
      })

      // Redirect to profile
      router.push(`/${data.username}`)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </Button>
        
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
          Edit Profile
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-2">
          Update your profile information and photos
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Photos Section */}
        <Card>
          <CardHeader title="Photos" />
          
          {/* Cover Photo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
              Cover Photo
            </label>
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg overflow-hidden relative">
                {coverPreview ? (
                  <Image
                    src={coverPreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                ) : user.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt="Current cover"
                    fill
                    className="object-cover"
                  />
                ) : null}
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => coverInputRef.current?.click()}
                      className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                    >
                      <PhotoIcon className="h-5 w-5 mr-2" />
                      Change Cover
                    </Button>
                    
                    {(coverPreview || user.profileImageUrl) && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={removeCover}
                        className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                      >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
              Recommended size: 1200x300px. Maximum file size: 10MB.
            </p>
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
              Profile Picture
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar
                  src={avatarPreview || user.profileImageUrl}
                  alt={`${user.name} ${user.surname}`}
                  size="xl"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-lg"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  Change Avatar
                </Button>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
                  Recommended size: 400x400px. Maximum file size: 5MB.
                </p>
              </div>
              
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader title="Basic Information" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              placeholder="Your first name"
              error={errors.name?.message}
              {...register('name', {
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters'
                }
              })}
            />
            
            <Input
              label="Last Name"
              placeholder="Your last name"
              error={errors.surname?.message}
              {...register('surname', {
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters'
                }
              })}
            />
          </div>

          <Input
            label="Username"
            placeholder="your_username"
            error={errors.username?.message}
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores'
              }
            })}
          />

          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            rows={4}
            error={errors.bio?.message}
            {...register('bio', {
              maxLength: {
                value: 500,
                message: 'Bio must be less than 500 characters'
              }
            })}
          />
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader title="Contact & Location" />
          
          <div className="space-y-6">
            <Input
              label="Location"
              placeholder="City, Country"
              error={errors.location?.message}
              {...register('location')}
            />
            
            <Input
              label="Website"
              type="url"
              placeholder="https://yourwebsite.com"
              error={errors.website?.message}
              {...register('website', {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Please enter a valid URL starting with http:// or https://'
                }
              })}
            />
            
            <Input
              label="Phone"
              type="tel"
              placeholder="+90 555 123 4567"
              error={errors.phone?.message}
              {...register('phone')}
            />
            
            <Input
              label="Date of Birth"
              type="date"
              error={errors.dateOfBirth?.message}
              {...register('dateOfBirth')}
            />
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader title="Privacy Settings" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100">
                  Private Account
                </h4>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Only people you approve can see your posts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={user.isPrivate}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100">
                  Show Email
                </h4>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Display your email address on your profile
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={user.preferences.privacy.showEmail}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-secondary-200 dark:border-secondary-700">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            loading={loading}
            loadingText="Saving..."
            disabled={!isDirty && !avatarFile && !coverFile}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}