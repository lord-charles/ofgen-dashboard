"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { MapPin, Search, Plus, Filter, Eye, Edit, ExternalLink, Upload } from "lucide-react"
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

// Mock data for sites
const MOCK_SITES = Array.from({ length: 50 }, (_, i) => {
  const id = `SITE-${1000 + i}`
  const counties = [
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
  ]
  const county = counties[Math.floor(Math.random() * counties.length)]
  const isActive = Math.random() > 0.2

  // Generate random coordinates within Kenya
  const latitude = -1.2921 + (Math.random() * 2 - 1)
  const longitude = 36.8219 + (Math.random() * 2 - 1)

  return {
    id,
    name: `${county} Solar Site ${i + 1}`,
    county,
    address: `${i + 1} Solar Avenue, ${county}`,
    capacity: (Math.random() * 9 + 1).toFixed(2),
    latitude,
    longitude,
    isActive,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
  }
})

export default function SitesPage() {
  const router = useRouter()
  const [sites, setSites] = useState(MOCK_SITES)
  const [searchTerm, setSearchTerm] = useState("")
  const [countyFilter, setCountyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSite, setSelectedSite] = useState<(typeof MOCK_SITES)[0] | null>(null)
  const [showMapDialog, setShowMapDialog] = useState(false)

  const sitesPerPage = 10

  // Get unique counties for filtering
  const counties = Array.from(new Set(sites.map((site) => site.county)))

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
  const handleViewOnMap = (site: (typeof MOCK_SITES)[0]) => {
    setSelectedSite(site)
    setShowMapDialog(true)
  }

  // Open in Google Maps
  const openInGoogleMaps = (latitude: number, longitude: number) => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank")
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
                  <TableHead>Site ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead>Capacity (kW)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSites.length > 0 ? (
                  currentSites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">{site.id}</TableCell>
                      <TableCell>{site.name}</TableCell>
                      <TableCell>{site.county}</TableCell>
                      <TableCell>{site.capacity}</TableCell>
                      <TableCell>
                        <Badge
                          variant={site.isActive ? "default" : "secondary"}
                          className={site.isActive ? "bg-green-600" : "bg-slate-600"}
                        >
                          {site.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleViewOnMap(site)}>
                          <MapPin className="h-4 w-4" />
                          <span className="sr-only">View on map</span>
                        </Button>
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
                            <DropdownMenuItem onClick={() => openInGoogleMaps(site.latitude, site.longitude)}>
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      No sites found matching your filters.
                    </TableCell>
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
                latitude={selectedSite.latitude}
                longitude={selectedSite.longitude}
                zoom={14}
                height="100%"
                interactive={false}
                markers={[
                  {
                    id: selectedSite.id,
                    name: selectedSite.name,
                    latitude: selectedSite.latitude,
                    longitude: selectedSite.longitude,
                    popupContent: (
                      <div>
                        <h3 className="font-medium">{selectedSite.name}</h3>
                        <p className="text-xs">{selectedSite.address}</p>
                        <p className="text-xs text-muted-foreground mt-1">Capacity: {selectedSite.capacity} kW</p>
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
              onClick={() => selectedSite && openInGoogleMaps(selectedSite.latitude, selectedSite.longitude)}
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
