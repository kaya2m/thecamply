export interface Camp {
  id: string
  name: string
  description: string
  location: {
    name: string
    coordinates: [number, number] // [latitude, longitude]
    address?: string
  }
  images: string[]
  amenities: string[]
  rating: number
  reviewsCount: number
  priceRange: '$' | '$$' | '$$$'
  category: 'tent' | 'rv' | 'cabin' | 'glamping' | 'wild'
  features: CampFeature[]
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
  createdBy: {
    id: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
  }
  createdAt: string
  isVerified: boolean
  isFavorite: boolean
}

export interface CampFeature {
  id: string
  name: string
  icon: string
  available: boolean
}

export interface CampFilters {
  category?: Camp['category'][]
  priceRange?: Camp['priceRange'][]
  rating?: number
  amenities?: string[]
  location?: {
    center: [number, number]
    radius: number // in km
  }
  sortBy?: 'rating' | 'distance' | 'price' | 'newest'
}

export interface CampReview {
  id: string
  campId: string
  author: {
    id: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
  }
  rating: number
  title: string
  content: string
  images?: string[]
  visitDate: string
  createdAt: string
  helpful: number
  isHelpful: boolean
}