import { create } from 'zustand'
import type { Camp, CampFilters, CampReview } from '@/shared/types/camp'

interface CampState {
  camps: Camp[]
  selectedCamp: Camp | null
  reviews: Record<string, CampReview[]>
  filters: CampFilters
  loading: boolean
  error: string | null
  searchQuery: string
}

interface CampStore extends CampState {
  fetchCamps: (filters?: CampFilters) => Promise<void>
  fetchCampById: (id: string) => Promise<void>
  fetchCampReviews: (campId: string) => Promise<void>
  setFilters: (filters: Partial<CampFilters>) => void
  setSearchQuery: (query: string) => void
  toggleFavorite: (campId: string) => void
  clearSelectedCamp: () => void
  clearError: () => void
}

// Mock camp data
const mockCamps: Camp[] = [
  {
    id: '1',
    name: 'Kaçkar Mountains Base Camp',
    description: 'Experience the breathtaking beauty of the Kaçkar Mountains with panoramic views, crystal-clear streams, and pristine wilderness. Perfect for hiking enthusiasts and nature lovers.',
    location: {
      name: 'Kaçkar Mountains, Artvin',
      coordinates: [40.825, 41.109],
      address: 'Kaçkar Mountains National Park, Artvin, Turkey'
    },
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800',
      'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=800'
    ],
    amenities: ['Fresh Water', 'Fire Pits', 'Toilets', 'Hiking Trails', 'Mountain Views'],
    rating: 4.8,
    reviewsCount: 124,
    priceRange: '$$',
    category: 'tent',
    features: [
      { id: '1', name: 'Pet Friendly', icon: '🐕', available: true },
      { id: '2', name: 'Campfire Allowed', icon: '🔥', available: true },
      { id: '3', name: 'Swimming', icon: '🏊', available: false },
      { id: '4', name: 'Wifi', icon: '📶', available: false }
    ],
    contact: {
      phone: '+90 466 123 4567',
      website: 'https://kackar-camp.com'
    },
    createdBy: {
      id: '2',
      username: 'mountainExplorer',
      firstName: 'Sarah',
      lastName: 'Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    createdAt: '2024-01-15T10:00:00Z',
    isVerified: true,
    isFavorite: false
  },
  {
    id: '2',
    name: 'Antalya Coastal Paradise',
    description: 'Wake up to the sound of waves and enjoy stunning Mediterranean sunsets. This beachfront camping spot offers the perfect blend of sea and mountain views.',
    location: {
      name: 'Antalya Coast, Antalya',
      coordinates: [36.8969, 30.7133],
      address: 'Konyaaltı Beach Area, Antalya, Turkey'
    },
    images: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efcaef?w=800',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
    ],
    amenities: ['Beach Access', 'Showers', 'Restaurant', 'Parking', 'Security'],
    rating: 4.6,
    reviewsCount: 89,
    priceRange: '$$$',
    category: 'glamping',
    features: [
      { id: '1', name: 'Pet Friendly', icon: '🐕', available: false },
      { id: '2', name: 'Campfire Allowed', icon: '🔥', available: false },
      { id: '3', name: 'Swimming', icon: '🏊', available: true },
      { id: '4', name: 'Wifi', icon: '📶', available: true }
    ],
    contact: {
      phone: '+90 242 123 4567',
      email: 'info@antalya-camp.com',
      website: 'https://antalya-coastal-paradise.com'
    },
    createdBy: {
      id: '3',
      username: 'coastalCamper',
      firstName: 'Mehmet',
      lastName: 'Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    createdAt: '2024-02-20T14:30:00Z',
    isVerified: true,
    isFavorite: true
  },
  {
    id: '3',
    name: 'Cappadocia Valley Camp',
    description: 'Camp under the stars in the magical landscape of Cappadocia. Watch hot air balloons at sunrise and explore ancient cave churches.',
    location: {
      name: 'Göreme, Nevşehir',
      coordinates: [38.6431, 34.8318],
      address: 'Göreme National Park, Nevşehir, Turkey'
    },
    images: [
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73600?w=800',
      'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800'
    ],
    amenities: ['Balloon Tours', 'Cave Tours', 'Local Guides', 'Traditional Food', 'Photography'],
    rating: 4.9,
    reviewsCount: 156,
    priceRange: '$$',
    category: 'tent',
    features: [
      { id: '1', name: 'Pet Friendly', icon: '🐕', available: true },
      { id: '2', name: 'Campfire Allowed', icon: '🔥', available: true },
      { id: '3', name: 'Swimming', icon: '🏊', available: false },
      { id: '4', name: 'Wifi', icon: '📶', available: true }
    ],
    createdBy: {
      id: '4',
      username: 'caveExplorer',
      firstName: 'Elif',
      lastName: 'Kaya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    },
    createdAt: '2024-03-10T09:15:00Z',
    isVerified: true,
    isFavorite: false
  }
]

const mockFetchCamps = async (filters?: CampFilters): Promise<Camp[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  return mockCamps
}

export const useCampStore = create<CampStore>((set, get) => ({
  camps: [],
  selectedCamp: null,
  reviews: {},
  filters: {},
  loading: false,
  error: null,
  searchQuery: '',

  fetchCamps: async (filters) => {
    set({ loading: true, error: null })
    try {
      const camps = await mockFetchCamps(filters)
      set({ camps, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch camps',
        loading: false
      })
    }
  },

  fetchCampById: async (id) => {
    set({ loading: true, error: null })
    try {
      const camp = mockCamps.find(c => c.id === id)
      if (!camp) throw new Error('Camp not found')
      set({ selectedCamp: camp, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch camp',
        loading: false
      })
    }
  },

  fetchCampReviews: async (campId) => {
    set(state => ({
      reviews: {
        ...state.reviews,
        [campId]: []
      }
    }))
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }))
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  toggleFavorite: (campId) => {
    set(state => ({
      camps: state.camps.map(camp =>
        camp.id === campId
          ? { ...camp, isFavorite: !camp.isFavorite }
          : camp
      ),
      selectedCamp: state.selectedCamp?.id === campId
        ? { ...state.selectedCamp, isFavorite: !state.selectedCamp.isFavorite }
        : state.selectedCamp
    }))
  },

  clearSelectedCamp: () => set({ selectedCamp: null }),
  clearError: () => set({  clearSelectedCamp: () => set({ selectedCamp: null }),
  clearError: () => set({ error: null })
})
}))