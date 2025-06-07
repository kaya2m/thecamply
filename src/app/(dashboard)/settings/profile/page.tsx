'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  UserIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/lib/store/auth/authStore'

export default function ProfileSettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleEditProfile = () => {
    router.push('/profile/edit')
  }

  const handleChangePassword = () => {
    router.push('/settings/password')
  }

  const handleNotificationSettings = () => {
    router.push('/settings/notifications')
  }

  const handlePrivacySettings = () => {
    router.push('/settings/privacy')
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Delete account')
    }
  }

  if (!user) {
    return null
  }

  const settingsSections = [
    {
      title: 'Profile',
      description: 'Manage your profile information and photos',
      icon: UserIcon,
      action: handleEditProfile,
      buttonText: 'Edit Profile'
    },
    {
      title: 'Account Settings',
      description: 'Change your password and email preferences',
      icon: CogIcon,
      action: handleChangePassword,
      buttonText: 'Change Password'
    },
    {
      title: 'Notifications',
      description: 'Control what notifications you receive',
      icon: BellIcon,
      action: handleNotificationSettings,
      buttonText: 'Manage'
    },
    {
      title: 'Privacy & Security',
      description: 'Control who can see your content and contact you',
      icon: ShieldCheckIcon,
      action: handlePrivacySettings,
      buttonText: 'Settings'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
          Profile Settings
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Current Profile Overview */}
      <Card className="mb-8">
        <CardHeader title="Current Profile" />
        <div className="flex items-center space-x-6">
          <Avatar
            src={user.profileImageUrl}
            alt={`${user.name} ${user.surname}`}
            size="lg"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
              {user.name} {user.surname}
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              @{user.username}
            </p>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              {user.email}
            </p>
          </div>
          <Button
            onClick={() => router.push(`/${user.username}`)}
            variant="outline"
          >
            View Profile
          </Button>
        </div>
      </Card>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, index) => {
          const Icon = section.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                      {section.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={section.action}
                  variant="outline"
                >
                  {section.buttonText}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Danger Zone */}
      <Card className="mt-8 border-red-200 dark:border-red-800">
        <CardHeader title="Danger Zone" />
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 dark:text-red-100">
                Delete Account
              </h4>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                Once you delete your account, there is no going back. This will permanently delete your profile, posts, and all associated data.
              </p>
            </div>
            <Button
              onClick={handleDeleteAccount}
              variant="danger"
              className="flex items-center space-x-2"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Delete Account</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}