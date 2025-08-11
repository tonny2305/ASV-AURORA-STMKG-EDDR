"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// minimal marker fix for default icon paths in Next
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 40],
})
L.Marker.prototype.options.icon = DefaultIcon

export default function MapTrackLeaflet({
  coords,
  latest,
  onReady,
}: {
  coords: [number, number][]
  latest: [number, number]
  onReady?: () => void
}) {
  useEffect(() => {
    onReady?.()
  }, [onReady])

  const defaultCenter: [number, number] = latest ?? [-6.2, 106.8]

  return (
    <>
      <style jsx global>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          border-radius: 0.75rem;
          outline: none;
        }
      `}</style>
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer
          // Minimalist tone map
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coords.length > 1 && (
          <Polyline
            positions={coords}
            pathOptions={{
              color: "hsl(185 85% 60%)",
              weight: 4,
              opacity: 0.85,
            }}
          />
        )}
        {latest && (
          <Marker position={latest}>
            <Popup>ASV Position</Popup>
          </Marker>
        )}
      </MapContainer>
    </>
  )
}
