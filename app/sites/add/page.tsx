"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import SiteMap from "@/components/site-map"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, LocateFixed, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { postLocations } from "@/app/api/locations"

// Mock data for counties in Kenya
const KENYA_COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Kiambu",
  "Uasin Gishu",
  "Meru",
  "Kakamega",
  "Kilifi",
  "Machakos",
  "Nyeri",
  "Bungoma",
  "Garissa",
]

export default function AddSitePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    county: "",
    address: "",
    coordinates: {
      lat: "",
      lng: "",
    },
  })

  // Map state
  const [mapCoordinates, setMapCoordinates] = useState<{ lat?: number; lng?: number }>({})
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "lat" || name === "lng") {
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: value,
        },
      }))

      // Update map if coordinates change
      const lat = name === "lat" ? Number.parseFloat(value) : Number.parseFloat(formData.coordinates.lat)
      const lng = name === "lng" ? Number.parseFloat(value) : Number.parseFloat(formData.coordinates.lng)

      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCoordinates({ lat, lng })
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle map location selection
  const handleLocationSelect = (lat: number, lng: number) => {
    setMapCoordinates({ lat, lng })
    setFormData((prev) => ({
      ...prev,
      coordinates: {
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
      },
    }))
  }

  // Simulate geocoding search
  const handleLocationSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearchingLocation(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock response - in a real app, this would come from a geocoding API
      const mockLocation = {
        lat: -1.2921 + (Math.random() * 2 - 1),
        lng: 36.8219 + (Math.random() * 2 - 1),
      }

      setMapCoordinates(mockLocation)
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          lat: mockLocation.lat.toFixed(6),
          lng: mockLocation.lng.toFixed(6),
        },
      }))

      setIsSearchingLocation(false)
    }, 1500)
  }

  // Use device location
  const handleUseCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      })
      return
    }

    setIsSearchingLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setMapCoordinates({ lat: latitude, lng: longitude })
        setFormData((prev) => ({
          ...prev,
          coordinates: {
            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6),
          },
        }))
        setIsSearchingLocation(false)
      },
      (error) => {
        toast({
          title: "Location error",
          description: `Could not get your location: ${error.message}`,
          variant: "destructive",
        })
        setIsSearchingLocation(false)
      },
    )
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.name || !formData.county || !formData.coordinates.lat || !formData.coordinates.lng) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      await postLocations({
        name: formData.name,
        county: formData.county,
        address: formData.address,
        latitude: parseFloat(formData.coordinates.lat),
        longitude: parseFloat(formData.coordinates.lng),
      })
      toast({
        title: "Site Added",
        description: `${formData.name} has been successfully added.`,
      })
      router.push("/sites")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to add site.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Site</h1>
            <p className="text-muted-foreground">Create a new solar installation site with location details</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/sites")}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Site
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left column - Form fields */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic details for this installation site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Site Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter site name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="county">
                      County <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.county} onValueChange={(value) => handleSelectChange("county", value)}>
                      <SelectTrigger id="county">
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {KENYA_COUNTIES.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter physical address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lat">
                        Latitude <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lat"
                        name="lat"
                        placeholder="e.g. -1.2921"
                        value={formData.coordinates.lat}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lng">
                        Longitude <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lng"
                        name="lng"
                        placeholder="e.g. 36.8219"
                        value={formData.coordinates.lng}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Find Location</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search for a location..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleLocationSearch()}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleLocationSearch}
                        disabled={isSearchingLocation || !searchQuery.trim()}
                      >
                        {isSearchingLocation ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <MapPin className="mr-2 h-4 w-4" />
                        )}
                        Search
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleUseCurrentLocation}
                    disabled={isSearchingLocation}
                  >
                    {isSearchingLocation ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LocateFixed className="mr-2 h-4 w-4" />
                    )}
                    Use Current Location
                  </Button>

                  <Alert>
                    <MapPin className="h-4 w-4" />
                    <AlertTitle>Location Selection</AlertTitle>
                    <AlertDescription>You can also click directly on the map to set the location.</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Map preview */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Location Preview</CardTitle>
                  <CardDescription>Preview the site location on the map</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <SiteMap
                    latitude={mapCoordinates.lat}
                    longitude={mapCoordinates.lng}
                    zoom={mapCoordinates.lat && mapCoordinates.lng ? 14 : 6}
                    height="500px"
                    onLocationSelect={handleLocationSelect}
                  />
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground pt-4">
                  {mapCoordinates.lat && mapCoordinates.lng ? (
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Selected coordinates: {mapCoordinates.lat.toFixed(6)}, {mapCoordinates.lng.toFixed(6)}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      No location selected. Click on the map to select a location.
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.push("/sites")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Site
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
