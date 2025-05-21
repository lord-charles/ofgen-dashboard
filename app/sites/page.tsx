"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  MapPin,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  ExternalLink,
  Upload,
  BarChart3,
  Zap,
  Calendar,
  MapPinned,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import SiteMap from "@/components/site-map"
import { Progress } from "@/components/ui/progress"
import { fetchLocations } from "../api/locations"

// Define the type for a site/location
interface Site {
  id: string
  name: string
  county: string
  address: string
  capacity?: string
  isActive?: boolean
  createdAt?: string
  coordinates: {
    lat: number
    lng: number
  }
}

export default function SitesPage() {
  const router = useRouter()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [countyFilter, setCountyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showMapDialog, setShowMapDialog] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)

  const sitesPerPage = 10

  // Get unique counties for filtering
  const counties = Array.from(new Set(sites.map((site) => site.county)))

  // Calculate summary metrics
  const totalSites = sites.length
  const activeSites = sites.filter((site) => site.isActive).length
  // Fix: handle optional fields for capacity and createdAt
  const totalCapacity = sites.reduce((sum, site) => sum + Number.parseFloat(site.capacity ?? '0'), 0).toFixed(2)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentSites = sites.filter((site) => site.createdAt && new Date(site.createdAt) > thirtyDaysAgo).length

  // Get county distribution (top 5)
  const countyDistribution = counties
    .map((county) => ({
      name: county,
      count: sites.filter((site) => site.county === county).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Filter sites based on search and filters
  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCounty = countyFilter === "all" || site.county === countyFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && site.isActive) ||
      (statusFilter === "inactive" && !site.isActive)

    return matchesSearch && matchesCounty && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredSites.length / sitesPerPage)
  const indexOfLastSite = currentPage * sitesPerPage
  const indexOfFirstSite = indexOfLastSite - sitesPerPage
  const currentSites = filteredSites.slice(indexOfFirstSite, indexOfLastSite)

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // View site on map
  const handleViewOnMap = (site: Site) => {
    setSelectedSite(site)
    setShowMapDialog(true)
  }

  // Open in Google Maps
  const openInGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank")
  }

  useEffect(() => {
    const loadSites = async () => {
      try {
        const data = await fetchLocations()
        setSites(data)
      } catch (error) {
        // Optionally handle error, e.g. show toast
        setSites([])
      } finally {
        setLoading(false)
      }
    }
    loadSites()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading sites...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Installation Sites</h1>
            <p className="text-muted-foreground">Manage and monitor all solar installation sites</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/sites/batch-upload")}>
              <Upload className="mr-2 h-4 w-4" />
              Batch Upload
            </Button>
            <Button onClick={() => router.push("/sites/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Site
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Sites Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
              <MapPinned className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSites}</div>
              <p className="text-xs text-muted-foreground">Across {counties.length} counties</p>
            </CardContent>
          </Card>

          {/* Active Sites Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sites</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSites}</div>
              <div className="flex items-center space-x-2">
                <Progress value={(activeSites / totalSites) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">{Math.round((activeSites / totalSites) * 100)}%</div>
              </div>
            </CardContent>
          </Card>

          {/* Total Capacity Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCapacity} kW</div>
              <p className="text-xs text-muted-foreground">
                Avg {(Number.parseFloat(totalCapacity) / totalSites).toFixed(2)} kW per site
              </p>
            </CardContent>
          </Card>

          {/* Recent Additions Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Additions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentSites}</div>
              <p className="text-xs text-muted-foreground">Added in the last 30 days</p>
            </CardContent>
          </Card>
        </div>

        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Installation Sites</CardTitle>
                <CardDescription>{filteredSites.length} sites found</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search sites..."
                    className="w-[200px] pl-8"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>

                <Select value={countyFilter} onValueChange={setCountyFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by county" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Counties</SelectItem>
                    {counties.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead>Site ID</TableHead> */}
                  <TableHead>Name</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSites.length > 0 ? (
                  currentSites.map((site) => (
                    <TableRow key={site.name}>
                      <TableCell className="font-medium">{site.name}</TableCell>
                      <TableCell>{site.county}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{site.address}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-xs">
                            {site.coordinates.lat.toFixed(4)}, {site.coordinates.lng.toFixed(4)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-1"
                            onClick={() => handleViewOnMap(site)}
                          >
                            <Eye className="h-3 w-3" />
                            <span className="sr-only">View on map</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-more-horizontal"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/sites/${site.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/sites/edit/${site.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openInGoogleMaps(site.coordinates.lat, site.coordinates.lng)}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open in Google Maps
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    {/* <TableCell colSpan={6} className="h-24 text-center">
                      No sites found matching your filters.
                    </TableCell> */}
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstSite + 1}-{Math.min(indexOfLastSite, filteredSites.length)} of{" "}
                {filteredSites.length} sites
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1
                    if (totalPages > 5) {
                      if (currentPage > 3) {
                        pageNum = currentPage - 3 + i
                      }
                      if (pageNum > totalPages - 4 && currentPage > totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      }
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum}>
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Dialog */}
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Site Location</DialogTitle>
            <DialogDescription>
              {selectedSite?.name} - {selectedSite?.address}
            </DialogDescription>
          </DialogHeader>

          <div className="h-[500px]">
            {selectedSite && (
              <SiteMap
                latitude={selectedSite.coordinates.lat}
                longitude={selectedSite.coordinates.lng}
                zoom={14}
                height="100%"
                interactive={false}
                markers={[
                  {
                    id: selectedSite.id,
                    name: selectedSite.name,
                    latitude: selectedSite.coordinates.lat,
                    longitude: selectedSite.coordinates.lng,
                    popupContent: (
                      <div>
                        <h3 className="font-medium">{selectedSite.name}</h3>
                        <p className="text-xs">{selectedSite.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedSite.coordinates.lat.toFixed(6)}, {selectedSite.coordinates.lng.toFixed(6)}
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                selectedSite && openInGoogleMaps(selectedSite.coordinates.lat, selectedSite.coordinates.lng)
              }
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in Google Maps
            </Button>
            <Button onClick={() => setShowMapDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
