import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { ApiError } from '@/lib/api/errors'
import type { Post, PostsResponse, CreatePostData, PostMedia, PostTag } from '@/shared/types/post'

interface FeedState {
  posts: Post[]
  loading: boolean
  error: string | null
  hasMore: boolean
  page: number
}

interface FeedStore extends FeedState {
  fetchPosts: (refresh?: boolean) => Promise<void>
  createPost: (data: CreatePostData) => Promise<void>
  likePost: (postId: string) => Promise<void>
  bookmarkPost: (postId: string) => Promise<void>
  deletePost: (postId: string) => Promise<void>
  clearError: () => void
  reset: () => void
}

// API'den gelen data'yı frontend formatına çeviren fonksiyon
const transformApiPostToFrontend = (apiPost: any): Post => {
  return {
    id: apiPost.id,
    user: {
      id: apiPost.user.id,
      name: apiPost.user.name,
      surname: apiPost.user.surname,
      username: apiPost.user.username,
      profileImageUrl: apiPost.user.profileImageUrl,
      isFollowedByCurrentUser: apiPost.user.isFollowedByCurrentUser || false
    },
    content: apiPost.content,
    media: apiPost.media || [],
    createdAt: apiPost.createdAt,
    likesCount: apiPost.likesCount || 0,
    commentsCount: apiPost.commentsCount || 0,
    tags: apiPost.tags || [],
    location: apiPost.location || null,
    isLikedByCurrentUser: apiPost.isLikedByCurrentUser || false
  }
}

// Frontend'den API'ye gönderilecek data'yı hazırlayan fonksiyon
const transformCreatePostDataToApi = (data: CreatePostData) => {
  return {
    content: data.content,
    media: data.images ? [] : [], // Images upload edilecek ve media array'e çevrilecek
    tags: data.tags.map(tag => ({ name: tag })),
    location: data.location,
    visibility: data.visibility
  }
}

export const useFeedStore = create<FeedStore>()(
  devtools(
    immer((set, get) => ({
      posts: [],
      loading: false,
      error: null,
      hasMore: true,
      page: 1,

      fetchPosts: async (refresh = false) => {
        const { page: currentPage, posts: currentPosts } = get()
        const targetPage = refresh ? 1 : currentPage

        console.log('[FeedStore] Fetching posts:', { refresh, targetPage })

        set((state) => {
          state.loading = true
          state.error = null
          if (refresh) {
            state.posts = []
            state.page = 1
          }
        })

        try {
          // API'den posts'ları çek
          const response = await apiClient.get<PostsResponse>(
            API_ENDPOINTS.FEED.POSTS,
            {
              page: targetPage,
              pageSize: 10
            }
          )

          console.log('[FeedStore] Posts API response:', response)

          if (!response.data) {
            throw new Error('Invalid response format')
          }

          const { items, hasNextPage } = response.data
          const transformedPosts = items.map(transformApiPostToFrontend)

          set((state) => {
            if (refresh) {
              state.posts = transformedPosts
            } else {
              state.posts.push(...transformedPosts)
            }
            state.page = targetPage + 1
            state.hasMore = hasNextPage
            state.loading = false
          })

        } catch (error) {
          console.error('[FeedStore] Failed to fetch posts:', error)
          
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to fetch posts'
            state.loading = false
          })
        }
      },

      createPost: async (data: CreatePostData) => {
        console.log('[FeedStore] Creating post:', data)

        set((state) => {
          state.loading = true
          state.error = null
        })

        try {
          // Önce media upload et (eğer varsa)
          let uploadedMedia: PostMedia[] = []
          if (data.images && data.images.length > 0) {
            for (const image of data.images) {
              try {
                const formData = new FormData()
                formData.append('file', image)
                
                // Media upload endpoint'i - API'nizde böyle bir endpoint olmalı
                const uploadResponse = await apiClient.upload<{ 
                  id: string, 
                  url: string, 
                  thumbnailUrl: string,
                  fileType: string,
                  width: number,
                  height: number 
                }>('/media/upload', formData)
                
                uploadedMedia.push({
                  id: uploadResponse.id,
                  url: uploadResponse.url,
                  thumbnailUrl: uploadResponse.thumbnailUrl,
                  fileType: uploadResponse.fileType,
                  width: uploadResponse.width,
                  height: uploadResponse.height,
                  description: null,
                  altTag: null
                })
              } catch (uploadError) {
                console.error('Failed to upload image:', uploadError)
              }
            }
          }

          // Post'u oluştur
          const postData = {
            content: data.content,
            media: uploadedMedia,
            tags: data.tags.map(tag => ({ name: tag })),
            location: data.location,
            visibility: data.visibility
          }

          const response = await apiClient.post<Post>(
            API_ENDPOINTS.FEED.CREATE_POST,
            postData
          )

          if (!response.data) {
            throw new Error('Invalid response format')
          }

          const newPost = transformApiPostToFrontend(response.data)

          set((state) => {
            state.posts.unshift(newPost)
            state.loading = false
          })

          console.log('[FeedStore] Post created successfully:', newPost)

        } catch (error) {
          console.error('[FeedStore] Failed to create post:', error)
          
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to create post'
            state.loading = false
          })
          throw error
        }
      },

      likePost: async (postId: string) => {
        console.log('[FeedStore] Toggling like for post:', postId)

        // Optimistic update
        const currentPost = get().posts.find(p => p.id === postId)
        if (!currentPost) return

        const wasLiked = currentPost.isLikedByCurrentUser

        set((state) => {
          const post = state.posts.find(p => p.id === postId)
          if (post) {
            post.isLikedByCurrentUser = !post.isLikedByCurrentUser
            post.likesCount += post.isLikedByCurrentUser ? 1 : -1
          }
        })

        try {
          // API'ye like/unlike isteği gönder
          if (wasLiked) {
            await apiClient.delete(API_ENDPOINTS.FEED.LIKE_POST(postId))
          } else {
            await apiClient.post(API_ENDPOINTS.FEED.LIKE_POST(postId))
          }

        } catch (error) {
          console.error('[FeedStore] Failed to toggle like:', error)
          
          // Revert optimistic update on error
          set((state) => {
            const post = state.posts.find(p => p.id === postId)
            if (post) {
              post.isLikedByCurrentUser = wasLiked
              post.likesCount += wasLiked ? 1 : -1
            }
          })

          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to update like'
          })
        }
      },

      bookmarkPost: async (postId: string) => {
        console.log('[FeedStore] Toggling bookmark for post:', postId)

        try {
          // API'ye bookmark isteği gönder
          await apiClient.post(API_ENDPOINTS.FEED.BOOKMARK_POST(postId))

          // Note: isBookmarked field'ı Post interface'inde yok, 
          // gerekirse ekleyebilirsiniz veya ayrı bir state'te tutabilirsiniz

        } catch (error) {
          console.error('[FeedStore] Failed to toggle bookmark:', error)
          
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to update bookmark'
          })
        }
      },

      deletePost: async (postId: string) => {
        console.log('[FeedStore] Deleting post:', postId)

        try {
          await apiClient.delete(API_ENDPOINTS.FEED.POST_DETAIL(postId))

          set((state) => {
            state.posts = state.posts.filter(post => post.id !== postId)
          })

        } catch (error) {
          console.error('[FeedStore] Failed to delete post:', error)
          
          set((state) => {
            state.error = error instanceof ApiError ? error.message : 'Failed to delete post'
          })
          throw error
        }
      },

      clearError: () => {
        set((state) => {
          state.error = null
        })
      },

      reset: () => {
        set((state) => {
          state.posts = []
          state.loading = false
          state.error = null
          state.hasMore = true
          state.page = 1
        })
      }
    })),
    {
      name: 'feed-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)

// Selector hooks for better performance
export const useFeedPosts = () => useFeedStore((state) => state.posts)
export const useFeedLoading = () => useFeedStore((state) => state.loading)
export const useFeedError = () => useFeedStore((state) => state.error)
export const useFeedHasMore = () => useFeedStore((state) => state.hasMore)