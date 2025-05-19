"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, ArrowLeft, Save } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import SiteMap from "@/components/site-map"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Same mock data function as in the details page
const getSiteDetails = (id: string) => {
  return {
    id,
    name: `Nairobi Solar Site ${id.slice(-2)}`,
    county: "Nairobi",
    address: "123 Solar Avenue, Nairobi",
    capacity: "8.5",
    isActive: true,
    createdAt: "2023-04-15T09:30:00Z",
    latitude: -1.2864,
    longitude: 36.8172,
    details: {
      siteArea: "450",
      panelCount: 32,
      inverterCount: 2,
      batteryStorage: "40",
      annualProduction: "12500",
      installationDate: "2023-05-20",
      lastMaintenanceDate: "2024-01-10",
      nextMaintenanceDate: "2024-07-10",
    },
    // ... other properties same as details page
  }
}

export default function EditSitePage() {
  const params = useParams()
  const router = useRouter()
  const [site, setSite] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formState, setFormState] = useState<any>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    // In a real application, fetch data from an API
    const fetchSite = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        const data = getSiteDetails(params.id as string)
        setSite(data)
        setFormState(data)
      } catch (error) {
        console.error("Error fetching site details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSite()
    }
  }, [params.id])

  // Handle form input changes
  const handleChange = (field: string, value: any) => {
    setFormState((prev: any) => {
      if (field.includes(".")) {
        const [section, key] = field.split(".")
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [key]: value,
          },
        }
      }
      return {
        ...prev,
        [field]: value,
      }
    })

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Handle location selection from map
  const handleLocationSelect = (lat: number, lng: number) => {
    setFormState((prev: any) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formState.name.trim()) {
      newErrors.name = "Site name is required"
    }

    if (!formState.county.trim()) {
      newErrors.county = "County is required"
    }

    if (!formState.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formState.capacity.trim()) {
      newErrors.capacity = "Capacity is required"
    } else if (isNaN(Number.parseFloat(formState.capacity)) || Number.parseFloat(formState.capacity) <= 0) {
      newErrors.capacity = "Capacity must be a positive number"
    }

    if (!formState.details.siteArea.trim()) {
      newErrors["details.siteArea"] = "Site area is required"
    } else if (
      isNaN(Number.parseFloat(formState.details.siteArea)) ||
      Number.parseFloat(formState.details.siteArea) <= 0
    ) {
      newErrors["details.siteArea"] = "Site area must be a positive number"
    }

    if (!formState.details.panelCount) {
      newErrors["details.panelCount"] = "Panel count is required"
    } else if (
      isNaN(Number.parseInt(formState.details.panelCount)) ||
      Number.parseInt(formState.details.panelCount) <= 0
    ) {
      newErrors["details.panelCount"] = "Panel count must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)
    setSuccessMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would send formState to your API
      console.log("Saving site:", formState)

      // Show success message
      setSuccessMessage("Site details updated successfully!")

      // Update local state
      setSite(formState)
    } catch (error) {
      console.error("Error saving site details:", error)
      setErrors({ form: "Failed to save changes. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted"></div>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 animate-pulse rounded-md bg-muted"></div>
                <div className="h-4 w-64 animate-pulse rounded-md bg-muted"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i}>
                      <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>
                      <div className="mt-2 h-10 animate-pulse rounded-md bg-muted"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // If site not found
  if (!site) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center gap-4 p-6">
          <AlertCircle className="h-12 w-12 text-yellow-500" />
          <h2 className="text-2xl font-bold">Site Not Found</h2>
          <p className="text-muted-foreground">The site you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push("/sites")}>Back to Sites</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-1">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold md:text-3xl">Edit {formState.name}</h1>
          </div>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
            {!saving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        {/* Success message */}
        {successMessage && (
          <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Form error */}
        {errors.form && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errors.form}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic-info" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic-info" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update the basic details of this installation site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Site Name</Label>
                    <Input
                      id="name"
                      value={formState.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Select value={formState.county} onValueChange={(value) => handleChange("county", value)}>
                      <SelectTrigger id="county" className={errors.county ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nairobi">Nairobi</SelectItem>
                        <SelectItem value="Mombasa">Mombasa</SelectItem>
                        <SelectItem value="Kisumu">Kisumu</SelectItem>
                        <SelectItem value="Nakuru">Nakuru</SelectItem>
                        <SelectItem value="Kiambu">Kiambu</SelectItem>
                        <SelectItem value="Uasin Gishu">Uasin Gishu</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.county && <p className="text-sm text-red-500">{errors.county}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formState.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className={errors.address ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="active">Site Status</Label>
                      <Switch
                        id="active"
                        checked={formState.isActive}
                        onCheckedChange={(checked) => handleChange("isActive", checked)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formState.isActive ? "This site is active and operational." : "This site is currently inactive."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technical Tab */}
            <TabsContent value="technical" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                  <CardDescription>Update technical details and specifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity (kW)</Label>
                      <Input
                        id="capacity"
                        type="text"
                        value={formState.capacity}
                        onChange={(e) => handleChange("capacity", e.target.value)}
                        className={errors.capacity ? "border-red-500" : ""}
                      />
                      {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site-area">Site Area (m²)</Label>
                      <Input
                        id="site-area"
                        type="text"
                        value={formState.details.siteArea}
                        onChange={(e) => handleChange("details.siteArea", e.target.value)}
                        className={errors["details.siteArea"] ? "border-red-500" : ""}
                      />
                      {errors["details.siteArea"] && (
                        <p className="text-sm text-red-500">{errors["details.siteArea"]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="panel-count">Number of Panels</Label>
                      <Input
                        id="panel-count"
                        type="number"
                        value={formState.details.panelCount}
                        onChange={(e) => handleChange("details.panelCount", e.target.value)}
                        className={errors["details.panelCount"] ? "border-red-500" : ""}
                      />
                      {errors["details.panelCount"] && (
                        <p className="text-sm text-red-500">{errors["details.panelCount"]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inverter-count">Number of Inverters</Label>
                      <Input
                        id="inverter-count"
                        type="number"
                        value={formState.details.inverterCount}
                        onChange={(e) => handleChange("details.inverterCount", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="battery-storage">Battery Storage (kWh)</Label>
                      <Input
                        id="battery-storage"
                        type="text"
                        value={formState.details.batteryStorage}
                        onChange={(e) => handleChange("details.batteryStorage", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="installation-date">Installation Date</Label>
                      <Input
                        id="installation-date"
                        type="date"
                        value={formState.details.installationDate.split("T")[0]}
                        onChange={(e) => handleChange("details.installationDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="annual-production">Estimated Annual Production (kWh)</Label>
                    <Input
                      id="annual-production"
                      type="text"
                      value={formState.details.annualProduction}
                      onChange={(e) => handleChange("details.annualProduction", e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      The expected annual energy production for this installation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Site Location
                  </CardTitle>
                  <CardDescription>Update the geographic location of this site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="text"
                        value={formState.latitude}
                        onChange={(e) => handleChange("latitude", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="text"
                        value={formState.longitude}
                        onChange={(e) => handleChange("longitude", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 rounded-md border p-4">
                    <p className="mb-2 text-sm font-medium">Click on the map to update location</p>
                    <div className="h-[400px]">
                      <SiteMap
                        latitude={formState.latitude}
                        longitude={formState.longitude}
                        zoom={12}
                        height="100%"
                        interactive={true}
                        onLocationSelect={handleLocationSelect}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </DashboardLayout>
  )
}
