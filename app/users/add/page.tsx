"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Save, X, Upload, Users, Shield, Key, Eye } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for projects and sites
const MOCK_PROJECTS = [
  "Nairobi Solar Project 1",
  "Mombasa Solar Project 2",
  "Kisumu Solar Project 3",
  "Nakuru Solar Project 4",
  "Eldoret Solar Project 5",
  "Nairobi Solar Project 6",
  "Mombasa Solar Project 7",
  "Kisumu Solar Project 8",
]

const MOCK_SITES = [
  "Nairobi Central",
  "Mombasa Port",
  "Kisumu Lake",
  "Nakuru East",
  "Eldoret North",
  "Nairobi South",
  "Mombasa South",
  "Kisumu West",
  "Nakuru West",
  "Eldoret South",
]

// Permission structure
type Permission = {
  id: string
  name: string
  description: string
  category: string
}

const PERMISSIONS: Permission[] = [
  // Dashboard permissions
  { id: "view_dashboard", name: "View Dashboard", description: "Can view the main dashboard", category: "Dashboard" },
  { id: "view_analytics", name: "View Analytics", description: "Can view analytics data", category: "Dashboard" },

  // Projects permissions
  { id: "view_projects", name: "View Projects", description: "Can view project details", category: "Projects" },
  { id: "create_projects", name: "Create Projects", description: "Can create new projects", category: "Projects" },
  { id: "edit_projects", name: "Edit Projects", description: "Can edit existing projects", category: "Projects" },
  { id: "delete_projects", name: "Delete Projects", description: "Can delete projects", category: "Projects" },

  // Sites permissions
  { id: "view_sites", name: "View Sites", description: "Can view site details", category: "Sites" },
  { id: "create_sites", name: "Create Sites", description: "Can create new sites", category: "Sites" },
  { id: "edit_sites", name: "Edit Sites", description: "Can edit existing sites", category: "Sites" },
  { id: "delete_sites", name: "Delete Sites", description: "Can delete sites", category: "Sites" },

  // Users permissions
  { id: "view_users", name: "View Users", description: "Can view user details", category: "Users" },
  { id: "create_users", name: "Create Users", description: "Can create new users", category: "Users" },
  { id: "edit_users", name: "Edit Users", description: "Can edit existing users", category: "Users" },
  { id: "delete_users", name: "Delete Users", description: "Can delete users", category: "Users" },

  // Reports permissions
  { id: "view_reports", name: "View Reports", description: "Can view reports", category: "Reports" },
  { id: "create_reports", name: "Create Reports", description: "Can create new reports", category: "Reports" },
  { id: "export_reports", name: "Export Reports", description: "Can export reports", category: "Reports" },
]

// Default permissions by role
const DEFAULT_PERMISSIONS = {
  contractor: ["view_dashboard", "view_projects", "view_sites"],
  engineer: ["view_dashboard", "view_projects", "view_sites", "edit_sites", "view_reports"],
  management: PERMISSIONS.map((p) => p.id),
  client: ["view_dashboard", "view_projects", "view_sites", "view_reports"],
}

export default function AddUserPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    company: "",
    status: "active",
    sendInvite: true,
    avatar: "",
    projects: [] as string[],
    sites: [] as string[],
    permissions: [] as string[],
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    if (name === "role") {
      // Set default permissions based on role
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        permissions: DEFAULT_PERMISSIONS[value as keyof typeof DEFAULT_PERMISSIONS] || [],
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle project selection
  const handleProjectChange = (project: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        projects: [...prev.projects, project],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p !== project),
      }))
    }
  }

  // Handle site selection
  const handleSiteChange = (site: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        sites: [...prev.sites, site],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        sites: prev.sites.filter((s) => s !== site),
      }))
    }
  }

  // Handle permission selection
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        permissions: [...prev.permissions, permissionId],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((p) => p !== permissionId),
      }))
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

  // Get role icon
  const getRoleIcon = (role: string) => {
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
        return null
    }
  }

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.name || !formData.email || !formData.role) {
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
        title: "User Added",
        description: `${formData.name} has been successfully added.`,
      })
      setIsSubmitting(false)
      router.push("/users")
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
            <p className="text-muted-foreground">Create a new user account and set permissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/users")}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save User
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">User Details</TabsTrigger>
            <TabsTrigger value="projects">Projects & Sites</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the user's basic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={formData.avatar} alt={formData.name} />
                      <AvatarFallback className="text-lg">
                        {formData.name ? getUserInitials(formData.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" type="button">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Enter company name"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Role & Status</CardTitle>
                  <CardDescription>Set the user's role and account status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">
                      User Role <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contractor">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Contractor</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="engineer">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Engineer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="management">
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            <span>Management</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="client">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>Client</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Account Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select account status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="sendInvite"
                      checked={formData.sendInvite}
                      onCheckedChange={(checked) => handleSwitchChange("sendInvite", checked)}
                    />
                    <Label htmlFor="sendInvite">Send invitation email to user</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assign Projects</CardTitle>
                  <CardDescription>Select the projects this user can access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {MOCK_PROJECTS.map((project) => (
                      <div key={project} className="flex items-center space-x-2">
                        <Checkbox
                          id={`project-${project}`}
                          checked={formData.projects.includes(project)}
                          onCheckedChange={(checked) => handleProjectChange(project, checked === true)}
                        />
                        <Label htmlFor={`project-${project}`}>{project}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assign Sites</CardTitle>
                  <CardDescription>Select the sites this user can access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {MOCK_SITES.map((site) => (
                      <div key={site} className="flex items-center space-x-2">
                        <Checkbox
                          id={`site-${site}`}
                          checked={formData.sites.includes(site)}
                          onCheckedChange={(checked) => handleSiteChange(site, checked === true)}
                        />
                        <Label htmlFor={`site-${site}`}>{site}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Permissions</CardTitle>
                  <CardDescription>Set the permissions for this user</CardDescription>
                </CardHeader>
                <CardContent>
                  {formData.role && (
                    <Alert className="mb-4">
                      {getRoleIcon(formData.role)}
                      <AlertTitle className="capitalize">{formData.role} Role</AlertTitle>
                      <AlertDescription>
                        Default permissions for {formData.role} role have been applied. You can customize them below.
                      </AlertDescription>
                    </Alert>
                  )}

                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                      {/* Group permissions by category */}
                      {Array.from(new Set(PERMISSIONS.map((p) => p.category))).map((category) => (
                        <div key={category} className="space-y-2">
                          <h3 className="font-medium">{category} Permissions</h3>
                          <Separator className="my-2" />
                          <div className="grid gap-2">
                            {PERMISSIONS.filter((p) => p.category === category).map((permission) => (
                              <div key={permission.id} className="flex items-start space-x-2">
                                <Checkbox
                                  id={`permission-${permission.id}`}
                                  checked={formData.permissions.includes(permission.id)}
                                  onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                                />
                                <div className="grid gap-0.5">
                                  <Label htmlFor={`permission-${permission.id}`}>{permission.name}</Label>
                                  <p className="text-sm text-muted-foreground">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => router.push("/users")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save User
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
