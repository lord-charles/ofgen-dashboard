"use client"

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
import { Plus, Search, Eye, Edit, Calendar, MapPin, User } from "lucide-react"

// Define service order type
type ServiceOrder = {
  id: string
  title: string
  siteId: string
  siteName: string
  county: string
  type: "Installation" | "Maintenance" | "Repair" | "Inspection"
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "On Hold"
  priority: "Low" | "Medium" | "High" | "Critical"
  scheduledDate: string
  completedDate?: string
  technician: string
  technicianId: string
}

// Mock service orders data
const MOCK_SERVICE_ORDERS: ServiceOrder[] = [
  {
    id: "SO-1001",
    title: "Initial Installation - Nairobi Solar Site 1",
    siteId: "SITE-1001",
    siteName: "Nairobi Solar Site 1",
    county: "Nairobi",
    type: "Installation",
    status: "Completed",
    priority: "High",
    scheduledDate: "2025-02-15",
    completedDate: "2025-02-17",
    technician: "John Doe",
    technicianId: "TECH-001",
  },
  {
    id: "SO-1002",
    title: "Quarterly Maintenance - Mombasa Solar Site 1",
    siteId: "SITE-1002",
    siteName: "Mombasa Solar Site 1",
    county: "Mombasa",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
    scheduledDate: "2025-04-10",
    technician: "Jane Smith",
    technicianId: "TECH-002",
  },
  {
    id: "SO-1003",
    title: "Inverter Repair - Kisumu Solar Site 1",
    siteId: "SITE-1003",
    siteName: "Kisumu Solar Site 1",
    county: "Kisumu",
    type: "Repair",
    status: "In Progress",
    priority: "Critical",
    scheduledDate: "2025-03-05",
    technician: "David Mwangi",
    technicianId: "TECH-003",
  },
  {
    id: "SO-1004",
    title: "Annual Inspection - Nakuru Solar Site 1",
    siteId: "SITE-1004",
    siteName: "Nakuru Solar Site 1",
    county: "Nakuru",
    type: "Inspection",
    status: "On Hold",
    priority: "Low",
    scheduledDate: "2025-03-20",
    technician: "Sarah Ochieng",
    technicianId: "TECH-004",
  },
  {
    id: "SO-1005",
    title: "Battery Replacement - Eldoret Solar Site 1",
    siteId: "SITE-1005",
    siteName: "Eldoret Solar Site 1",
    county: "Uasin Gishu",
    type: "Maintenance",
    status: "Scheduled",
    priority: "Medium",
    scheduledDate: "2025-04-05",
    technician: "Michael Kamau",
    technicianId: "TECH-005",
  },
  {
    id: "SO-1006",
    title: "Panel Cleaning - Nairobi Solar Site 1",
    siteId: "SITE-1001",
    siteName: "Nairobi Solar Site 1",
    county: "Nairobi",
    type: "Maintenance",
    status: "Completed",
    priority: "Low",
    scheduledDate: "2025-02-25",
    completedDate: "2025-02-25",
    technician: "John Doe",
    technicianId: "TECH-001",
  },
  {
    id: "SO-1007",
    title: "System Upgrade - Mombasa Solar Site 1",
    siteId: "SITE-1002",
    siteName: "Mombasa Solar Site 1",
    county: "Mombasa",
    type: "Installation",
    status: "Cancelled",
    priority: "High",
    scheduledDate: "2025-03-15",
    technician: "Jane Smith",
    technicianId: "TECH-002",
  },
]

export default function ServiceOrdersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  // Filter service orders based on search query and filters
  const filteredServiceOrders = MOCK_SERVICE_ORDERS.filter((order) => {
    // Search filter
    const matchesSearch =
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.technician.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    // Type filter
    const matchesType = typeFilter === "all" || order.type === typeFilter

    // Priority filter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  // Get status badge color
  const getStatusBadgeColor = (status: ServiceOrder["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-600"
      case "In Progress":
        return "bg-blue-600"
      case "Scheduled":
        return "bg-amber-600"
      case "Cancelled":
        return "bg-red-600"
      case "On Hold":
        return "bg-slate-600"
      default:
        return "bg-slate-600"
    }
  }

  // Get priority badge color
  const getPriorityBadgeColor = (priority: ServiceOrder["priority"]) => {
    switch (priority) {
      case "Critical":
        return "bg-red-600"
      case "High":
        return "bg-orange-600"
      case "Medium":
        return "bg-amber-600"
      case "Low":
        return "bg-green-600"
      default:
        return "bg-slate-600"
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Service Orders</h1>
          <Button onClick={() => router.push("/service-orders/create")}>
            <Plus className="mr-2 h-4 w-4" />
            New Service Order
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter service orders by status, type, and priority</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search service orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
              </div>

              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Installation">Installation</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Orders</CardTitle>
            <CardDescription>
              Showing {filteredServiceOrders.length} of {MOCK_SERVICE_ORDERS.length} service orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServiceOrders.length > 0 ? (
                  filteredServiceOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{order.siteName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{order.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPriorityBadgeColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{order.scheduledDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span>{order.technician}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/service-orders/${order.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/service-orders/${order.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6">
                      No service orders found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
