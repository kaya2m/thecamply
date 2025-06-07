import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/api/errors'

import type { Post, PostsResponse } from '@/shared/types/post'
import { mapApiUserToProfile, PagedList, UpdateProfileRequest, UserProfile, UserProfileResponse, UserSummaryResponse } from '@/lib/types/auth'

interface UserState {
  profileUser: UserProfile | null
  userPosts: Post[]
  followers: UserSummaryResponse[]
  following: UserSummaryResponse[]
  loading: boolean
  error: string | null
  postsLoading: boolean
  followersLoading: boolean
  followingLoading: boolean
}

interface UserStore extends UserState {
  fetchUserProfile: (username: string) => Promise<void>
  fetchUserPosts: (userId: string, page?: number) => Promise<void>
  fetchFollowers: (userId: string, page?: number, pageSize?: number) => Promise<void>
  fetchFollowing: (userId: string, page?: number, pageSize?: number) => Promise<void>
  followUser: (userId: string) => Promise<void>
  unfollowUser: (userId: string) => Promise<void>
  updateProfile: (data: UpdateProfileRequest) => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
  uploadCoverPhoto: (file: File) => Promise<void>
  clearProfile: () => void
  clearError: () => void
}

export const useUserStore = create<UserStore>()(
  devtools(
    immer((set, get) => ({
      profileUser: null,
      userPosts: [],
      followers: [],
      following: [],
      loading: false,
      error: null,
      postsLoading: false,
      followersLoading: false,
      followingLoading: false,

      fetchUserProfile: async (username: string) => {
        console.log('[UserStore] Fetching profile for username:', username)
        
        set((state) => {
          state.loading = true
          state.error = null
        })

        try {
          const apiResponse = await apiClient.get<UserProfileResponse>(`/users/by-username/${username}`)
          debugger
          if (!apiResponse) {
            throw new Error('Invalid API response format')
          }

          const userProfile = mapApiUserToProfile(apiResponse)
          set((state) => {
            state.profileUser = userProfile
            state.loading = false
          })
        } catch (error) {
          console.error('[UserStore] Profile fetch failed:', error)
          let errorMessage = 'Failed to fetch user profile'
          if (error instanceof ApiError) {
            if (error.status === 404) {
              errorMessage = 'User not found'
            } else {
              errorMessage = error.message
            }
          } else if (error instanceof Error) {
            errorMessage = error.message
          }
          set((state) => {
            state.error = errorMessage
            state.loading = false
            state.profileUser = null
          })
          throw error
        }
      },

      fetchUserPosts: async (userId: string, page = 1) => {
        set((state) => {
          state.postsLoading = true
          if (page === 1) state.userPosts = []
        })

        try {
          const response = await apiClient.get<PostsResponse>(`/posts/by-user/${userId}?page=${page}&pageSize=10`)
          if (!response) {
          }

          set((state) => {
            if (page === 1) {
              state.userPosts = response.items
            } else {
              state.userPosts.push(...response.items)
            }
            state.postsLoading = false
          })
        } catch (error) {
          console.error('[UserStore] Posts fetch failed:', error)
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to fetch user posts'
            state.postsLoading = false
          })
        }
      },

      fetchFollowers: async (userId: string, page = 1, pageSize = 20) => {
        set((state) => {
          state.followersLoading = true
          state.error = null
        })

        try {
          const response = await apiClient.get<PagedList<UserSummaryResponse>>(`/users/${userId}/followers?page=${page}&pageSize=${pageSize}`)
          if (!response || !response.data) {
            throw new Error('Invalid followers response format')
          }
          set((state) => {
            if (page === 1) {
              state.followers = response.data.items
            } else {
              state.followers.push(...response.data.items)
            }
            state.followersLoading = false
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to fetch followers'
            state.followersLoading = false
          })
        }
      },

      fetchFollowing: async (userId: string, page = 1, pageSize = 20) => {
        set((state) => {
          state.followingLoading = true
          state.error = null
        })

        try {
          const response = await apiClient.get<PagedList<UserSummaryResponse>>(`/users/${userId}/following?page=${page}&pageSize=${pageSize}`)
          if (!response || !response.data) {
            throw new Error('Invalid following response format')
          }
          set((state) => {
            if (page === 1) {
              state.following = response.data.items
            } else {
              state.following.push(...response.data.items)
            }
            state.followingLoading = false
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to fetch following'
            state.followingLoading = false
          })
        }
      },

      followUser: async (userId: string) => {
        try {
          await apiClient.post(`/users/${userId}/follow`)
          set((state) => {
            if (state.profileUser && state.profileUser.id === userId) {
              state.profileUser.stats.followersCount += 1
              state.profileUser.isFollowedByCurrentUser = true
            }
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to follow user'
          })
          throw error
        }
      },

      unfollowUser: async (userId: string) => {
        try {
          await apiClient.delete(`/users/${userId}/follow`)
          set((state) => {
            if (state.profileUser && state.profileUser.id === userId) {
              state.profileUser.stats.followersCount -= 1
              state.profileUser.isFollowedByCurrentUser = false
            }
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to unfollow user'
          })
          throw error
        }
      },

      updateProfile: async (data: UpdateProfileRequest) => {
        set((state) => {
          state.loading = true
          state.error = null
        })

        try {
          const response = await apiClient.put<UserProfileResponse>('/users/me', data)
          if (!response || !response) {
            throw new Error('Invalid profile update response')
          }
          const updatedProfile = mapApiUserToProfile(response)
          set((state) => {
            state.profileUser = updatedProfile
            state.loading = false
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to update profile'
            state.loading = false
          })
          throw error
        }
      },

      uploadAvatar: async (file: File) => {
        set((state) => {
          state.loading = true
          state.error = null
        })

        try {
          const formData = new FormData()
          formData.append('avatar', file)
          const result = await apiClient.upload<{ url: string }>('/users/me/avatar', formData)
          if (!result || !result.url) {
            throw new Error('Invalid avatar upload response')
          }
          set((state) => {
            if (state.profileUser) {
              state.profileUser.profileImageUrl = result.url
            }
            state.loading = false
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to upload avatar'
            state.loading = false
          })
          throw error
        }
      },

      uploadCoverPhoto: async (file: File) => {
        set((state) => {
          state.loading = true
          state.error = null
        })

        try {
          const formData = new FormData()
          formData.append('cover', file)
          
          const result = await apiClient.upload<{ url: string }>('/users/me/cover-photo', formData)
          
          if (!result || !result.url) {
            throw new Error('Invalid cover photo upload response')
          }
          
          set((state) => {
            if (state.profileUser) {
              state.profileUser.coverPhoto = result.url
            }
            state.loading = false
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to upload cover photo'
            state.loading = false
          })
          throw error
        }
      },

      clearProfile: () => {
        console.log('[UserStore] Clearing profile data')
        set((state) => {
          state.profileUser = null
          state.userPosts = []
          state.followers = []
          state.following = []
          state.error = null
          state.loading = false
          state.postsLoading = false
          state.followersLoading = false
          state.followingLoading = false
        })
      },

      clearError: () => {
        set((state) => {
          state.error = null
        })
      }
    })),
    {
      name: 'user-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)