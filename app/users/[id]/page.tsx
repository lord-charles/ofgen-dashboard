"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Edit,
  Trash2,
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Key,
  Shield,
  Users,
  Eye,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

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
  permissions?: string[]
  lastActive?: string
  createdAt: string
}

// Mock user data
const generateMockUser = (id: string): User => {
  const roles: UserRole[] = ["contractor", "engineer", "management", "client"]
  const role = roles[Math.floor(Math.random() * roles.length)]

  const firstName = ["John", "Jane", "Michael", "Sarah", "David", "Emily"][Math.floor(Math.random() * 6)]
  const lastName = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller"][Math.floor(Math.random() * 6)]
  const name = `${firstName} ${lastName}`

  const companies = ["Ofgen Solar", "SunTech Kenya", "EcoSolar Ltd", "GreenPower Inc", "Solar Solutions"]
  const company = role === "management" ? "Ofgen Solar" : companies[Math.floor(Math.random() * companies.length)]

  const projects = [
    "Nairobi Solar Project 1",
    "Mombasa Solar Project 2",
    "Kisumu Solar Project 3",
    "Nakuru Solar Project 4",
    "Eldoret Solar Project 5",
  ]

  const sites = ["Nairobi Central", "Mombasa Port", "Kisumu Lake", "Nakuru East", "Eldoret North"]

  const permissions = ["view_dashboard", "view_projects", "view_sites", "view_reports"]

  if (role === "management") {
    permissions.push("create_projects", "edit_projects", "create_users", "edit_users")
  }

  if (role === "engineer") {
    permissions.push("edit_sites")
  }

  // Generate user projects and sites based on role
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

  return {
    id,
    name,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${role === "management" ? "ofgen.co.ke" : company.toLowerCase().replace(/\s+/g, "")}.com`,
    phone: `+254 7${Math.floor(Math.random() * 100000000)}`,
    role,
    status: ["active", "inactive", "pending"][Math.floor(Math.random() * 3)] as User["status"],
    company,
    projects: userProjects,
    sites: userSites,
    permissions,
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
  }
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch user data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockUser = generateMockUser(params.id)
      setUser(mockUser)
      setLoading(false)
    }, 500)
  }, [params.id])

  // Handle delete user
  const handleDeleteUser = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "User Deleted",
        description: `${user?.name} has been successfully deleted.`,
      })
      router.push("/users")
    }, 1000)
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/users")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Loading User...</h1>
          </div>
          <div className="h-[500px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading user details...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/users")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">User Not Found</h1>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-[300px]">
              <p className="text-muted-foreground">The requested user could not be found.</p>
              <Button onClick={() => router.push("/users")} className="mt-4">
                Return to Users
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/users")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/users/edit/${user.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* User Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">{getUserInitials(user.name)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <div className="flex items-center justify-center mt-2">
                  <Badge className={getRoleBadgeColor(user.role)}>
                    <span className="flex items-center gap-1">
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </Badge>
                </div>
                <Badge variant="outline" className={`mt-2 ${getStatusBadgeColor(user.status)}`}>
                  <span className="capitalize">{user.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{user.company}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Joined {formatDate(user.createdAt)}</span>
                </div>
                {user.lastActive && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Last active {formatDate(user.lastActive)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Key className="mr-2 h-4 w-4" />
                    Reset Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Details Tabs */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects & Sites</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Summary</CardTitle>
                    <CardDescription>Overview of user account and access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Account Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">User ID</span>
                            <span>{user.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span className="capitalize">{user.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Role</span>
                            <span className="capitalize">{user.role}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created</span>
                            <span>{formatDate(user.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Access Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Projects</span>
                            <span>{user.projects?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sites</span>
                            <span>{user.sites?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Permissions</span>
                            <span>{user.permissions?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Active</span>
                            <span>{user.lastActive ? formatDate(user.lastActive) : "Never"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>User's recent actions and events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock activity data */}
                      {[
                        { action: "Logged in", date: "2 hours ago" },
                        { action: "Updated site details for Nairobi Central", date: "Yesterday" },
                        { action: "Viewed project progress report", date: "3 days ago" },
                        { action: "Added new milestone to Mombasa Solar Project", date: "1 week ago" },
                      ].map((activity, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-primary mr-3" />
                            <span>{activity.action}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{activity.date}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Activity
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Assigned Projects</CardTitle>
                    <CardDescription>Projects this user has access to</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.projects && user.projects.length > 0 ? (
                      <div className="space-y-4">
                        {user.projects.map((project, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{project}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No projects assigned to this user.</div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assigned Sites</CardTitle>
                    <CardDescription>Sites this user has access to</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.sites && user.sites.length > 0 ? (
                      <div className="space-y-4">
                        {user.sites.map((site, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{site}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No sites assigned to this user.</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Permissions</CardTitle>
                    <CardDescription>Permissions granted to this user</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.permissions && user.permissions.length > 0 ? (
                      <div className="space-y-6">
                        {/* Group permissions by category */}
                        {["Dashboard", "Projects", "Sites", "Users", "Reports"].map((category) => {
                          const categoryPermissions = user.permissions?.filter((p) =>
                            p.startsWith(category.toLowerCase().replace(/\s+/g, "_")),
                          )

                          if (!categoryPermissions || categoryPermissions.length === 0) return null

                          return (
                            <div key={category} className="space-y-2">
                              <h3 className="font-medium">{category} Permissions</h3>
                              <Separator className="my-2" />
                              <div className="grid gap-2">
                                {categoryPermissions.map((permission) => (
                                  <div key={permission} className="flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-green-600 mr-2" />
                                    <span className="capitalize">{permission.replace(/_/g, " ")}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No specific permissions assigned to this user.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>User's activity history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Mock activity data by date */}
                      {[
                        {
                          date: "Today",
                          activities: [
                            { time: "10:45 AM", action: "Logged in", details: "From Nairobi, Kenya" },
                            { time: "11:20 AM", action: "Viewed project details", details: "Nairobi Solar Project 1" },
                          ],
                        },
                        {
                          date: "Yesterday",
                          activities: [
                            { time: "3:30 PM", action: "Updated site information", details: "Nairobi Central" },
                            { time: "2:15 PM", action: "Added new milestone", details: "Mombasa Solar Project 2" },
                            { time: "9:00 AM", action: "Logged in", details: "From Nairobi, Kenya" },
                          ],
                        },
                        {
                          date: "Last Week",
                          activities: [
                            { time: "Friday, 2:00 PM", action: "Generated progress report", details: "All projects" },
                            {
                              time: "Wednesday, 11:30 AM",
                              action: "Updated user profile",
                              details: "Changed contact information",
                            },
                            { time: "Monday, 9:15 AM", action: "Logged in", details: "From Nairobi, Kenya" },
                          ],
                        },
                      ].map((day, dayIndex) => (
                        <div key={dayIndex} className="space-y-3">
                          <h3 className="font-medium">{day.date}</h3>
                          <div className="space-y-3 ml-2">
                            {day.activities.map((activity, actIndex) => (
                              <div key={actIndex} className="flex">
                                <div className="mr-4 w-16 text-xs text-muted-foreground">{activity.time}</div>
                                <div className="flex-1 border-l pl-4 -ml-px border-border">
                                  <p className="font-medium">{activity.action}</p>
                                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Load More Activity
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
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

          <div className="flex items-center gap-3 py-2">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>

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
