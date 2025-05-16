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
import { Search, Filter, Eye, Edit, Trash2, MoreHorizontal, UserPlus, Users, Shield, Key } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// User types
type UserRole = "contractor" | "engineer" | "management" | "client"

type User = {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  status: "active" | "inactive" | "pending"
  avatar?: string
  company?: string
  projects?: string[]
  sites?: string[]
  lastActive?: string
  createdAt: string
}

// Mock data for users
const generateMockUsers = (): User[] => {
  const roles: UserRole[] = ["contractor", "engineer", "management", "client"]
  const statuses: User["status"][] = ["active", "inactive", "pending"]
  const companies = ["Ofgen Solar", "SunTech Kenya", "EcoSolar Ltd", "GreenPower Inc", "Solar Solutions"]
  const projects = [
    "Nairobi Solar Project 1",
    "Mombasa Solar Project 2",
    "Kisumu Solar Project 3",
    "Nakuru Solar Project 4",
    "Eldoret Solar Project 5",
  ]
  const sites = [
    "Nairobi Central",
    "Mombasa Port",
    "Kisumu Lake",
    "Nakuru East",
    "Eldoret North",
    "Nairobi South",
    "Mombasa South",
  ]

  const users: User[] = []

  // Generate 50 mock users
  for (let i = 0; i < 50; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)]
    const firstName = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Linda", "William", "Elizabeth"][
      Math.floor(Math.random() * 10)
    ]
    const lastName = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Miller",
      "Davis",
      "Garcia",
      "Rodriguez",
      "Wilson",
    ][Math.floor(Math.random() * 10)]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${role === "management" ? "ofgen.co.ke" : companies[Math.floor(Math.random() * companies.length)].toLowerCase().replace(/\s+/g, "")}.com`

    // Assign random projects and sites based on role
    let userProjects: string[] = []
    const userSites: string[] = []

    if (role === "contractor" || role === "engineer") {
      // Assign 1-3 projects
      const projectCount = 1 + Math.floor(Math.random() * 3)
      for (let j = 0; j < projectCount; j++) {
        const project = projects[Math.floor(Math.random() * projects.length)]
        if (!userProjects.includes(project)) {
          userProjects.push(project)
        }
      }

      // Assign 1-4 sites
      const siteCount = 1 + Math.floor(Math.random() * 4)
      for (let j = 0; j < siteCount; j++) {
        const site = sites[Math.floor(Math.random() * sites.length)]
        if (!userSites.includes(site)) {
          userSites.push(site)
        }
      }
    } else if (role === "client") {
      // Clients typically have 1 project
      userProjects = [projects[Math.floor(Math.random() * projects.length)]]

      // And 1-2 sites
      const siteCount = 1 + Math.floor(Math.random() * 2)
      for (let j = 0; j < siteCount; j++) {
        const site = sites[Math.floor(Math.random() * sites.length)]
        if (!userSites.includes(site)) {
          userSites.push(site)
        }
      }
    }

    // Create the user
    users.push({
      id: `USER-${1000 + i}`,
      name,
      email,
      phone: `+254 7${Math.floor(Math.random() * 100000000)}`,
      role,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      company: role === "management" ? "Ofgen Solar" : companies[Math.floor(Math.random() * companies.length)],
      projects: userProjects.length > 0 ? userProjects : undefined,
      sites: userSites.length > 0 ? userSites : undefined,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
    })
  }

  return users
}

const MOCK_USERS = generateMockUsers()

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const usersPerPage = 10

  // Filter users based on search, role, status, and active tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesTab = activeTab === "all" || user.role === activeTab

    return matchesSearch && matchesRole && matchesStatus && matchesTab
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // Handle delete user
  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.id !== selectedUser.id))
      setShowDeleteDialog(false)
      setSelectedUser(null)
    }
  }

  // Get role badge color
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "contractor":
        return "bg-blue-600"
      case "engineer":
        return "bg-purple-600"
      case "management":
        return "bg-green-600"
      case "client":
        return "bg-amber-600"
      default:
        return "bg-slate-600"
    }
  }

  // Get status badge color
  const getStatusBadgeColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-600"
      case "inactive":
        return "bg-slate-600"
      case "pending":
        return "bg-amber-600"
      default:
        return "bg-slate-600"
    }
  }

  // Get role icon
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "contractor":
        return <Users className="h-4 w-4" />
      case "engineer":
        return <Shield className="h-4 w-4" />
      case "management":
        return <Key className="h-4 w-4" />
      case "client":
        return <Eye className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <Button onClick={() => router.push("/users/add")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>{filteredUsers.length} users found</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="w-[200px] pl-8"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="contractor">Contractors</SelectItem>
                    <SelectItem value="engineer">Engineers</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="client">Clients</SelectItem>
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
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="contractor">Contractors</TabsTrigger>
              <TabsTrigger value="engineer">Engineers</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
              <TabsTrigger value="client">Clients</TabsTrigger>
            </TabsList>
          </Tabs>

          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          <span className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{user.role}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>{user.company || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                          <span className="capitalize">{user.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.projects ? (
                          <div className="flex flex-col">
                            <span>{user.projects.length}</span>
                            {user.projects.length > 0 && (
                              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {user.projects[0]}
                                {user.projects.length > 1 ? ` +${user.projects.length - 1} more` : ""}
                              </span>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{user.lastActive ? formatDate(user.lastActive) : "-"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/users/${user.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/users/edit/${user.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowDeleteDialog(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No users found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
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

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="flex items-center gap-3 py-2">
              <Avatar>
                <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                <AvatarFallback>{getUserInitials(selectedUser.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedUser.name}</div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
