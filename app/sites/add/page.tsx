"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import SiteMap from "@/components/site-map"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { MapPin, Search, LocateFixed, Loader2 } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  const [activeTab, setActiveTab] = useState("details")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    county: "",
    address: "",
    latitude: "",
    longitude: "",
    capacity: "",
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    isActive: true,
  })

  // Map state
  const [mapCoordinates, setMapCoordinates] = useState<{ lat?: number; lng?: number }>({})
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Load Leaflet CSS on client-side only
  useEffect(() => {
    // Import Leaflet CSS
    import('leaflet/dist/leaflet.css')
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Update map if coordinates change
    if (name === "latitude" || name === "longitude") {
      const lat = name === "latitude" ? Number.parseFloat(value) : Number.parseFloat(formData.latitude)
      const lng = name === "longitude" ? Number.parseFloat(value) : Number.parseFloat(formData.longitude)

      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCoordinates({ lat, lng })
      }
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle map location selection
  const handleLocationSelect = (lat: number, lng: number) => {
    setMapCoordinates({ lat, lng })
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
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
        latitude: mockLocation.lat.toFixed(6),
        longitude: mockLocation.lng.toFixed(6),
      }))

      setIsSearchingLocation(false)
    }, 1500)
  }

  // Use device location
  const handleUseCurrentLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
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
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.name || !formData.county || !formData.latitude || !formData.longitude) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Site Added",
        description: `${formData.name} has been successfully added.`,
      })
      setIsSubmitting(false)
      router.push("/sites")
    }, 1500)
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Site Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left column - Form fields */}
              <div className="space-y-6">
                <TabsContent value="details" className="space-y-4">
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

                      <div className="space-y-2">
                        <Label htmlFor="capacity">System Capacity (kW)</Label>
                        <Input
                          id="capacity"
                          name="capacity"
                          type="number"
                          step="0.01"
                          placeholder="e.g. 5.5"
                          value={formData.capacity}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Enter site description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                        />
                        <Label htmlFor="isActive">Site is active</Label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="location" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Location Information</CardTitle>
                      <CardDescription>Set the GPS coordinates for this installation site</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="latitude">
                            Latitude <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="latitude"
                            name="latitude"
                            placeholder="e.g. -1.2921"
                            value={formData.latitude}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="longitude">
                            Longitude <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="longitude"
                            name="longitude"
                            placeholder="e.g. 36.8219"
                            value={formData.longitude}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <Separator />

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
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>Add contact details for the site manager or owner</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Name</Label>
                        <Input
                          id="contactName"
                          name="contactName"
                          placeholder="Enter contact name"
                          value={formData.contactName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          name="contactPhone"
                          placeholder="Enter phone number"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email Address</Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
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
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
