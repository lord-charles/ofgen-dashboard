"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SiteMap from "@/components/site-map"
import {
  MapPin,
  Edit,
  ExternalLink,
  Building,
  Sun,
  AlertTriangle,
  Users,
  FileText,
  BarChart2,
  ArrowLeft,
  Plus,
  Printer,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data - in a real application, you would fetch this from your API
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
    performance: {
      currentOutput: "6.2",
      dailyGeneration: "45.8",
      monthlyGeneration: "1350",
      yearlyGeneration: "9870",
      efficiency: 92,
      co2Saved: "4.5",
      peakOutput: "8.1",
      uptime: 99.2,
    },
    weather: {
      condition: "Sunny",
      temperature: "27",
      humidity: "65",
      windSpeed: "12",
      solarIrradiance: "850",
      forecast: [
        { day: "Today", condition: "Sunny", max: "28", min: "19" },
        { day: "Tomorrow", condition: "Partly Cloudy", max: "26", min: "18" },
        { day: "Wed", condition: "Cloudy", max: "25", min: "17" },
      ],
    },
    alerts: [
      {
        id: "alert-1",
        type: "warning",
        message: "Inverter efficiency below threshold",
        date: "2024-04-20T08:15:00Z",
        resolved: false,
      },
      {
        id: "alert-2",
        type: "info",
        message: "Scheduled maintenance upcoming",
        date: "2024-04-18T14:30:00Z",
        resolved: true,
      },
    ],
    team: [
      {
        id: "user-1",
        name: "John Mwangi",
        role: "Site Manager",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "john.m@ofgen.co.ke",
      },
      {
        id: "user-2",
        name: "Sarah Kamau",
        role: "Maintenance Engineer",
        avatar: "/placeholder.svg?height=40&width=40",
        email: "sarah.k@ofgen.co.ke",
      },
    ],
    serviceOrders: [
      {
        id: "SO-2024-056",
        type: "Maintenance",
        status: "Completed",
        date: "2024-01-10T10:00:00Z",
      },
      {
        id: "SO-2024-102",
        type: "Panel Replacement",
        status: "Scheduled",
        date: "2024-07-15T09:00:00Z",
      },
    ],
  }
}

export default function SiteDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [site, setSite] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real application, fetch data from an API
    const fetchSite = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        const data = getSiteDetails(params.id as string)
        setSite(data)
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

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-[400px] animate-pulse rounded-lg bg-muted"></div>
            <div className="flex flex-col gap-4">
              <div className="h-10 w-32 animate-pulse rounded-md bg-muted"></div>
              <div className="h-8 w-full animate-pulse rounded-md bg-muted"></div>
              <div className="h-8 w-2/3 animate-pulse rounded-md bg-muted"></div>
              <div className="h-8 w-1/2 animate-pulse rounded-md bg-muted"></div>
            </div>
          </div>

          <div className="h-12 w-full animate-pulse rounded-md bg-muted"></div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="h-[200px] animate-pulse rounded-lg bg-muted"></div>
            <div className="h-[200px] animate-pulse rounded-lg bg-muted"></div>
            <div className="h-[200px] animate-pulse rounded-lg bg-muted"></div>
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
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
          <h2 className="text-2xl font-bold">Site Not Found</h2>
          <p className="text-muted-foreground">The site you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push("/sites")}>Back to Sites</Button>
        </div>
      </DashboardLayout>
    )
  }

  // Open in Google Maps
  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${site.latitude},${site.longitude}`, "_blank")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-1">
        {/* Header with back button */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold md:text-3xl">{site.name}</h1>
            <Badge
              variant={site.isActive ? "default" : "secondary"}
              className={site.isActive ? "bg-green-600" : "bg-slate-600"}
            >
              {site.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => router.push(`/sites/edit/${site.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Site
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Service Order
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Map */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Site Location
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] p-0">
              <SiteMap
                latitude={site.latitude}
                longitude={site.longitude}
                zoom={15}
                height="100%"
                interactive={false}
                markers={[
                  {
                    id: site.id,
                    name: site.name,
                    latitude: site.latitude,
                    longitude: site.longitude,
                  },
                ]}
              />
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={openInGoogleMaps}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Google Maps
              </Button>
            </CardFooter>
          </Card>

          {/* Site Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Site Information
              </CardTitle>
              <CardDescription>Key details about this installation site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-sm font-medium">Site ID:</div>
                <div className="text-sm">{site.id}</div>

                <div className="text-sm font-medium">County:</div>
                <div className="text-sm">{site.county}</div>

                <div className="text-sm font-medium">Address:</div>
                <div className="text-sm">{site.address}</div>

                <div className="text-sm font-medium">Capacity:</div>
                <div className="text-sm">{site.capacity} kW</div>

                <div className="text-sm font-medium">Installation Date:</div>
                <div className="text-sm">{formatDate(site.details.installationDate)}</div>

                <div className="text-sm font-medium">Created:</div>
                <div className="text-sm">{formatDate(site.createdAt)}</div>

                <div className="text-sm font-medium">GPS Coordinates:</div>
                <div className="text-sm">
                  {site.latitude.toFixed(6)}, {site.longitude.toFixed(6)}
                </div>

                <div className="text-sm font-medium">Panel Count:</div>
                <div className="text-sm">{site.details.panelCount}</div>

                <div className="text-sm font-medium">Inverter Count:</div>
                <div className="text-sm">{site.details.inverterCount}</div>

                <div className="text-sm font-medium">Battery Storage:</div>
                <div className="text-sm">{site.details.batteryStorage} kWh</div>

                <div className="text-sm font-medium">Site Area:</div>
                <div className="text-sm">{site.details.siteArea} m²</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push(`/sites/edit/${site.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {/* <TabsTrigger value="performance">Performance</TabsTrigger> */}
            {/* <TabsTrigger value="weather">Weather</TabsTrigger> */}
            {/* <TabsTrigger value="alerts">Alerts</TabsTrigger> */}
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="service-orders">Service Orders</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-4">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Current Output */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Current Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end space-x-2">
                    <span className="text-4xl font-bold">{site.performance.currentOutput}</span>
                    <span className="text-2xl">kW</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {(
                      (Number.parseFloat(site.performance.currentOutput) / Number.parseFloat(site.capacity)) *
                      100
                    ).toFixed(1)}
                    % of capacity
                  </div>
                  <Progress
                    className="mt-4"
                    value={(Number.parseFloat(site.performance.currentOutput) / Number.parseFloat(site.capacity)) * 100}
                  />
                </CardContent>
              </Card>

              {/* Daily Generation */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Today&apos;s Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end space-x-2">
                    <span className="text-4xl font-bold">{site.performance.dailyGeneration}</span>
                    <span className="text-2xl">kWh</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {(
                      (Number.parseFloat(site.performance.dailyGeneration) / (Number.parseFloat(site.capacity) * 8)) *
                      100
                    ).toFixed(1)}
                    % of expected
                  </div>
                  <div className="mt-4 h-16 w-full bg-slate-100 dark:bg-slate-800">
                    {/* This would be a mini chart in a real app */}
                    <div className="flex h-full items-end">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary"
                          style={{
                            height: `${Math.random() * 80 + 20}%`,
                            margin: "0 1px",
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Efficiency */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">System Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end space-x-2">
                    <span className="text-4xl font-bold">{site.performance.efficiency}</span>
                    <span className="text-2xl">%</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {site.performance.efficiency >= 90 ? "Excellent" : "Good"} performance
                  </div>
                  <Progress
                    className="mt-4"
                    value={site.performance.efficiency}
                    indicator={site.performance.efficiency >= 90 ? "bg-green-500" : "bg-yellow-500"}
                  />
                </CardContent>
              </Card>

              {/* Additional Performance Metrics */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-primary" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Key performance indicators for this site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Monthly Generation</p>
                      <p className="text-2xl font-bold">{site.performance.monthlyGeneration} kWh</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Yearly Generation</p>
                      <p className="text-2xl font-bold">{site.performance.yearlyGeneration} kWh</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Peak Output</p>
                      <p className="text-2xl font-bold">{site.performance.peakOutput} kW</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">CO₂ Saved</p>
                      <p className="text-2xl font-bold">{site.performance.co2Saved} tons</p>
                    </div>
                  </div>

                  {/* Here you would add a chart showing historical data */}
                  <div className="mt-8 h-64 w-full rounded-md bg-slate-100 p-4 dark:bg-slate-800">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-medium">Energy Production (Last 30 Days)</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span className="text-xs text-muted-foreground">Energy Generated</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                          <span className="text-xs text-muted-foreground">Expected Output</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-48 w-full">
                      {/* Placeholder for chart - in a real app, use a chart library */}
                      <div className="flex h-full items-end justify-between">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div key={i} className="flex w-[2%] flex-col items-center">
                            <div
                              className="w-full bg-primary"
                              style={{
                                height: `${Math.random() * 70 + 20}%`,
                              }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Weather Tab */}
          <TabsContent value="weather" className="mt-4">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Current Weather */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-primary" />
                    Current Weather
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center pt-6">
                  <div className="mb-4 text-6xl">
                    {site.weather.condition === "Sunny" ? "☀️" : site.weather.condition === "Partly Cloudy" ? "⛅" : "☁️"}
                  </div>
                  <h3 className="mb-1 text-2xl font-bold">{site.weather.condition}</h3>
                  <p className="text-3xl">{site.weather.temperature}°C</p>
                  <div className="mt-4 grid w-full max-w-[250px] grid-cols-2 gap-y-2 text-sm">
                    <div className="text-muted-foreground">Humidity:</div>
                    <div className="text-right">{site.weather.humidity}%</div>
                    <div className="text-muted-foreground">Wind:</div>
                    <div className="text-right">{site.weather.windSpeed} km/h</div>
                    <div className="text-muted-foreground">Solar Irradiance:</div>
                    <div className="text-right">{site.weather.solarIrradiance} W/m²</div>
                  </div>
                </CardContent>
              </Card>

              {/* Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle>3-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {site.weather.forecast.map((day: any, index: number) => (
                      <div key={index} className="flex items-center justify-between rounded-lg p-2 hover:bg-muted">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">
                            {day.condition === "Sunny" ? "☀️" : day.condition === "Partly Cloudy" ? "⛅" : "☁️"}
                          </div>
                          <div>
                            <p className="font-medium">{day.day}</p>
                            <p className="text-sm text-muted-foreground">{day.condition}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{day.max}°C</p>
                          <p className="text-sm text-muted-foreground">{day.min}°C</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weather Impact */}
              <Card>
                <CardHeader>
                  <CardTitle>Weather Impact</CardTitle>
                  <CardDescription>Impact on energy production</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium">Solar Efficiency</span>
                        <span className="text-sm font-medium">Very Good</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium">Expected Output</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <Progress value={92} />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium">Weather Stability</span>
                        <span className="text-sm font-medium">Stable</span>
                      </div>
                      <Progress value={90} />
                    </div>

                    <div className="mt-6 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Current weather conditions are optimal for solar energy production.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  System Alerts
                </CardTitle>
                <CardDescription>Recent alerts and notifications for this site</CardDescription>
              </CardHeader>
              <CardContent>
                {site.alerts.length > 0 ? (
                  <div className="space-y-4">
                    {site.alerts.map((alert: any) => (
                      <div
                        key={alert.id}
                        className={`flex items-start justify-between rounded-lg border p-4 ${
                          alert.type === "warning"
                            ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
                            : "border-blue-200 bg-blue-50 dark:bg-blue-900/20"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`rounded-full p-2 ${
                              alert.type === "warning"
                                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                            }`}
                          >
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div>
                            <h4
                              className={`font-medium ${
                                alert.type === "warning"
                                  ? "text-yellow-800 dark:text-yellow-300"
                                  : "text-blue-800 dark:text-blue-300"
                              }`}
                            >
                              {alert.message}
                            </h4>
                            <p className="text-sm text-muted-foreground">{formatDateTime(alert.date)}</p>
                          </div>
                        </div>
                        <Badge
                          variant={alert.resolved ? "outline" : "secondary"}
                          className={
                            alert.resolved
                              ? "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              : "border-yellow-200 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                          }
                        >
                          {alert.resolved ? "Resolved" : "Active"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                    <div className="rounded-full bg-green-50 p-3 dark:bg-green-900/20">
                      <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/40 dark:text-green-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-check"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-medium">All Systems Normal</h3>
                    <p className="mt-1 text-center text-sm text-muted-foreground">
                      No alerts or warnings for this site. Everything is running smoothly.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Site Team
                </CardTitle>
                <CardDescription>Personnel responsible for this site</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {site.team.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Email
                      </Button>
                      <Button variant="outline" size="sm">
                        Call
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Assign Team Member
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Orders Tab */}
          <TabsContent value="service-orders" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Service Orders
                    </CardTitle>
                    <CardDescription>Maintenance and service history</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Service Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {site.serviceOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h4 className="font-medium">{order.id}</h4>
                        <p className="text-sm text-muted-foreground">{order.type}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.date)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={order.status === "Completed" ? "default" : "secondary"}
                          className={
                            order.status === "Completed"
                              ? "bg-green-600"
                              : order.status === "In Progress"
                                ? "bg-blue-600"
                                : "bg-yellow-600"
                          }
                        >
                          {order.status}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/service-orders/${order.id}`)}>
                          View
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Separator className="my-4" />

                  <div>
                    <h4 className="mb-2 font-medium">Maintenance Schedule</h4>
                    <div className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">Last Maintenance</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(site.details.lastMaintenanceDate)}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        >
                          Completed
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Next Scheduled Maintenance</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(site.details.nextMaintenanceDate)}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                        >
                          Scheduled
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/service-orders?siteId=${site.id}`)}
                >
                  View All Service History
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
