"use client"

import type React from "react"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { useMap, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

// Define types for the map components that will be dynamically imported
type MapProps = {
  center: [number, number]
  zoom: number
  children: React.ReactNode
  style: React.CSSProperties
  className?: string
}

type MarkerProps = {
  position: [number, number]
  icon: any
  children?: React.ReactNode
}

type PopupProps = {
  children: React.ReactNode
}

// Define the props for our SiteMap component
type SiteMapProps = {
  latitude?: number
  longitude?: number
  zoom?: number
  height?: string
  className?: string
  onLocationSelect?: (lat: number, lng: number) => void
  markers?: Array<{
    id: string
    name: string
    latitude: number
    longitude: number
    popupContent?: React.ReactNode
  }>
  interactive?: boolean
}

// Create a loading placeholder component
function MapPlaceholder({ height, className }: { height: string; className?: string }) {
  return (
    <div 
      className={cn("bg-muted flex items-center justify-center", className)} 
      style={{ height }}
    >
      <div className="text-center">
        <div className="animate-pulse h-8 w-8 mx-auto mb-2 rounded-full bg-muted-foreground/20"></div>
        <p>Loading map...</p>
      </div>
    </div>
  )
}

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => <div>Loading map...</div>
  }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)



// Component to recenter map when coordinates change
function ChangeMapView({ latitude, longitude, zoom }: { latitude?: number; longitude?: number; zoom?: number }) {
  const map = useMap()

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      map.setView([latitude, longitude], zoom || map.getZoom())
    }
  }, [latitude, longitude, zoom, map])

  return null
}

// Component to handle map clicks for location selection
function MapClickHandler({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      }
    },
  })

  return null
}

export default function SiteMap({
  latitude = -1.2921, // Default to Kenya's coordinates
  longitude = 36.8219,
  zoom = 6,
  height = "500px",
  className,
  onLocationSelect,
  markers = [],
  interactive = true,
}: SiteMapProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [markerIcon, setMarkerIcon] = useState<any>(null)

  // Handle hydration mismatch with Leaflet
  useEffect(() => {
    setIsMounted(true)
    
    // Import Leaflet icon only on client side
    import('leaflet').then((L) => {
      // Fix for Leaflet marker icon issue in Next.js
      setMarkerIcon(new L.Icon({
        iconUrl: "/marker-icon.png",
        iconRetinaUrl: "/marker-icon-2x.png",
        shadowUrl: "/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }))
    })
  }, [])

  if (!isMounted) {
    return <MapPlaceholder height={height} className={className} />
  }

  // Don't render the map until the marker icon is loaded
  if (!markerIcon) {
    return <MapPlaceholder height={height} className={className} />
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoom}
      style={{ height, width: "100%" }}
      className={cn("rounded-md border", className)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Show selected location marker */}
      {latitude && longitude && (
        <Marker position={[latitude, longitude]} icon={markerIcon}>
          <Popup>Selected Location</Popup>
        </Marker>
      )}

      {/* Show additional markers */}
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.latitude, marker.longitude]} icon={markerIcon}>
          <Popup>
            {marker.popupContent || (
              <div>
                <h3 className="font-medium">{marker.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </Popup>
        </Marker>
      ))}

      {/* Update map view when coordinates change */}
      <ChangeMapView latitude={latitude} longitude={longitude} zoom={zoom} />

      {/* Handle map clicks if interactive */}
      {interactive && onLocationSelect && <MapClickHandler onLocationSelect={onLocationSelect} />}
    </MapContainer>
  )
}
