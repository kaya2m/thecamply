'use client'

import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Camp } from '@/shared/types/camp'

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface CampMapProps {
  camps: Camp[]
  center?: [number, number]
  zoom?: number
  height?: string
  onCampClick?: (camp: Camp) => void
  selectedCampId?: string
}

// Custom camp marker icon
const createCampIcon = (isSelected: boolean = false) => {
  return L.divIcon({
    className: 'custom-camp-marker',
    html: `
      <div class="relative">
        <div class="w-8 h-8 bg-primary-600 ${isSelected ? 'ring-4 ring-primary-300' : ''} rounded-full flex items-center justify-center shadow-lg">
          <span class="text-white text-xs">⛺</span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  
  return null
}

export const CampMap: React.FC<CampMapProps> = ({
  camps,
  center = [39.0, 35.0], // Turkey center
  zoom = 6,
  height = '400px',
  onCampClick,
  selectedCampId
}) => {
  const mapRef = useRef<L.Map>(null)

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border border-secondary-200 dark:border-secondary-700">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapController center={center} zoom={zoom} />
        
        {camps.map((camp) => (
          <Marker
            key={camp.id}
            position={camp.location.coordinates}
            icon={createCampIcon(camp.id === selectedCampId)}
            eventHandlers={{
              click: () => onCampClick?.(camp)
            }}
          >
            <Popup>
              <div className="w-64">
                <div className="mb-2">
                  {camp.images[0] && (
                    <img
                      src={camp.images[0]}
                      alt={camp.name}
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                </div>
                <h3 className="font-semibold text-secondary-900 mb-1">
                  {camp.name}
                </h3>
                <div className="flex items-center space-x-1 mb-2">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium">{camp.rating}</span>
                  <span className="text-sm text-secondary-500">
                    ({camp.reviewsCount} reviews)
                  </span>
                </div>
                <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
                  {camp.description}
                </p>
                <button
                  onClick={() => onCampClick?.(camp)}
                  className="w-full bg-primary-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

// Export as dynamic component to avoid SSR issues
export default dynamic(() => Promise.resolve(CampMap), {
  ssr: false,
  loading: () => (
    <div 
      style={{ height: '400px' }} 
      className="rounded-lg bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center border border-secondary-200 dark:border-secondary-700"
    >
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-secondary-600 dark:text-secondary-400">Loading map...</p>
      </div>
    </div>
  )
})