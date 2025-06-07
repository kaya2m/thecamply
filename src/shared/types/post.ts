export interface PostMedia {
  id: string
  url: string
  thumbnailUrl: string
  fileType: string
  description?: string | null
  altTag?: string | null
  width: number
  height: number
}

// Tag interface for post tags
export interface PostTag {
  id: string
  name: string
  slug: string
  usageCount: number
}

// Location interface for post location
export interface PostLocation {
  name: string
  coordinates: [number, number]
}

// User interface for post author
export interface PostAuthor {
  id: string
  name?: string | null
  surname?: string | null
  username: string
  profileImageUrl?: string 
  isFollowedByCurrentUser: boolean
}

// Main Post interface
export interface Post {
  id: string
  user: PostAuthor
  content: string
  media: PostMedia[]
  createdAt: string
  likesCount: number
  commentsCount: number
  tags: PostTag[]
  location?: PostLocation | null
  isLikedByCurrentUser: boolean
}

// Paginated response interface for posts
export interface PostsResponse {
  items: Post[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

// Legacy Post interface (backward compatibility)
export interface LegacyPost {
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