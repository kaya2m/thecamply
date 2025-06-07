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
        set((state) => {
          state.loading = true
          state.error = null
        })

        try {
          // C# controller endpoint: GET /api/users/by-username/{username}
          const apiResponse = await apiClient.get<UserProfileResponse>(`/users/by-username/${username}`)
          const userProfile = mapApiUserToProfile(apiResponse)
          debugger
          set((state) => {
            state.profileUser = userProfile
            state.loading = false
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to fetch user profile'
            state.loading = false
          })
        }
      },

      fetchUserPosts: async (userId: string, page = 1) => {
        set((state) => {
          state.postsLoading = true
          if (page === 1) state.userPosts = []
        })

        try {
          // Bu endpoint için ayrı bir posts controller'ı olması gerekiyor
          // Eğer posts controller'ınız varsa: GET /api/posts/by-user/{userId}
          const response = await apiClient.get<PostsResponse>(`/posts/by-user/${userId}?page=${page}&pageSize=10`)
          debugger
          set((state) => {
            if (page === 1) {
              state.userPosts = response.items
            } else {
              state.userPosts.push(...response.items)
            }
            state.postsLoading = false
          })
        } catch (error) {
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
          // C# controller endpoint: GET /api/users/{id}/followers
          const response = await apiClient.get<PagedList<UserSummaryResponse>>(`/api/users/${userId}/followers?page=${page}&pageSize=${pageSize}`)
          
          set((state) => {
            if (page === 1) {
              state.followers = response.items
            } else {
              state.followers.push(...response.items)
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
          // C# controller endpoint: GET /api/users/{id}/following
          const response = await apiClient.get<PagedList<UserSummaryResponse>>(`/api/users/${userId}/following?page=${page}&pageSize=${pageSize}`)
          
          set((state) => {
            if (page === 1) {
              state.following = response.items
            } else {
              state.following.push(...response.items)
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
          // C# controller endpoint: POST /api/users/{id}/follow
          await apiClient.post(`/api/users/${userId}/follow`)
          
          set((state) => {
            if (state.profileUser && state.profileUser.id === userId) {
              state.profileUser.stats.followersCount += 1
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
          // C# controller endpoint: DELETE /api/users/{id}/follow
          await apiClient.delete(`/api/users/${userId}/follow`)
          
          set((state) => {
            if (state.profileUser && state.profileUser.id === userId) {
              state.profileUser.stats.followersCount -= 1
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
          // C# controller endpoint: PUT /api/users/me
          const updatedApiUser = await apiClient.put<UserProfileResponse>('/api/users/me', data)
          const updatedProfile = mapApiUserToProfile(updatedApiUser)
          
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
          
          // Bu endpoint için ayrı bir endpoint eklemeniz gerekebilir
          // Örnek: POST /api/users/me/avatar
          const result = await apiClient.upload<{ url: string }>('/api/users/me/avatar', formData)
          
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
          
          // Bu endpoint için ayrı bir endpoint eklemeniz gerekebilir
          // Örnek: POST /api/users/me/cover-photo
          const result = await apiClient.upload<{ url: string }>('/api/users/me/cover-photo', formData)
          
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
        set((state) => {
          state.profileUser = null
          state.userPosts = []
          state.followers = []
          state.following = []
          state.error = null
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