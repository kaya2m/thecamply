import { create } from 'zustand'
import type { Post, Comment, CreatePostData } from '@/shared/types/post'

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
}

// Mock data
const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: '2',
      username: 'mountainExplorer',
      firstName: 'Sarah',
      lastName: 'Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      isVerified: true
    },
    content: "Just spent an incredible weekend at Kaçkar Mountains! The sunrise from our campsite was absolutely breathtaking. Nothing beats waking up to nature's alarm clock. 🏔️ #KaçkarMountains #Camping #Turkey",
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800'
    ],
    location: {
      name: 'Kaçkar Mountains, Turkey',
      coordinates: [40.825, 41.109]
    },
    tags: ['KaçkarMountains', 'Camping', 'Turkey'],
    createdAt: '2024-06-01T08:30:00Z',
    updatedAt: '2024-06-01T08:30:00Z',
    likes: 42,
    comments: 8,
    shares: 3,
    isLiked: false,
    isBookmarked: true,
    visibility: 'public'
  },
  {
    id: '2',
    author: {
      id: '3',
      username: 'coastalCamper',
      firstName: 'Mehmet',
      lastName: 'Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isVerified: false
    },
    content: "Beach camping in Antalya is a whole different experience! The sound of waves as your lullaby and the sea breeze keeping you cool. Perfect spot for stargazing too! ⭐",
    images: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efcaef?w=800'
    ],
    location: {
      name: 'Antalya Coast, Turkey',
      coordinates: [36.8969, 30.7133]
    },
    tags: ['BeachCamping', 'Antalya', 'Stargazing'],
    createdAt: '2024-05-30T19:45:00Z',
    updatedAt: '2024-05-30T19:45:00Z',
    likes: 28,
    comments: 5,
    shares: 1,
    isLiked: true,
    isBookmarked: false,
    visibility: 'public'
  },
  {
    id: '3',
    author: {
      id: '4',
      username: 'forestWanderer',
      firstName: 'Elif',
      lastName: 'Demir',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      isVerified: true
    },
    content: "Pro tip: Always check the weather forecast AND the ground conditions before setting up camp. Learned this the hard way last night when unexpected rain turned our campsite into a mini lake! 😅 Still had fun though!",
    location: {
      name: 'Yedigöller National Park, Turkey',
      coordinates: [40.9543, 31.7339]
    },
    tags: ['CampingTips', 'YedigöllerNationalPark', 'WeatherTips'],
    createdAt: '2024-05-29T12:15:00Z',
    updatedAt: '2024-05-29T12:15:00Z',
    likes: 67,
    comments: 12,
    shares: 8,
    isLiked: false,
    isBookmarked: false,
    visibility: 'public'
  }
]

// Mock API functions
const mockFetchPosts = async (page: number): Promise<{ posts: Post[], hasMore: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (page === 1) {
    return { posts: mockPosts, hasMore: true }
  } else {
    return { posts: [], hasMore: false }
  }
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,

  fetchPosts: async (refresh = false) => {
    const { page: currentPage, posts: currentPosts } = get()
    const page = refresh ? 1 : currentPage

    set({ loading: true, error: null })
    
    try {
      const { posts: newPosts, hasMore } = await mockFetchPosts(page)
      
      set({
        posts: refresh ? newPosts : [...currentPosts, ...newPosts],
        page: page + 1,
        hasMore,
        loading: false
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch posts',
        loading: false
      })
    }
  },

  createPost: async (data) => {
    set({ loading: true, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newPost: Post = {
        id: Math.random().toString(36).substr(2, 9),
        author: {
          id: '1',
          username: 'outdoorExplorer',
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          isVerified: true
        },
        content: data.content,
        images: [], // In real app, would upload images and get URLs
        location: data.location,
        tags: data.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        visibility: data.visibility
      }
      
      set(state => ({
        posts: [newPost, ...state.posts],
        loading: false
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create post',
        loading: false
      })
    }
  },

  likePost: async (postId) => {
    set(state => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    }))
  },

  bookmarkPost: async (postId) => {
    set(state => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    }))
  },

  deletePost: async (postId) => {
    set(state => ({
      posts: state.posts.filter(post => post.id !== postId)
    }))
  },

  clearError: () => set({ error: null })
}))