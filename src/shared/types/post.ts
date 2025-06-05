export interface Post {
  id: string
  author: {
    id: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
    isVerified: boolean
  }
  content: string
  images?: string[]
  location?: {
    name: string
    coordinates: [number, number]
  }
  tags: string[]
  createdAt: string
  updatedAt: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  visibility: 'public' | 'friends' | 'private'
}

export interface Comment {
  id: string
  postId: string
  author: {
    id: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
  }
  content: string
  createdAt: string
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

export interface CreatePostData {
  content: string
  images?: File[]
  location?: {
    name: string
    coordinates: [number, number]
  }
  tags: string[]
  visibility: 'public' | 'friends' | 'private'
}