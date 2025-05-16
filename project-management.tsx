"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { CheckCircle2, Clock, Filter, PlusCircle, Search, XCircle, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart } from "@/components/ui/chart"
import DashboardLayout from "./dashboard-layout"
import { toast } from "@/components/ui/use-toast"

// Define types for our data
type ProjectStatus = "Planned" | "In Progress" | "On Hold" | "Completed"

type MilestoneStatus = "Pending" | "In Progress" | "Completed" | "Delayed"

type Milestone = {
  id: string
  title: string
  description: string
  dueDate: string
  completedDate?: string
  status: MilestoneStatus
}

type InventoryUsage = {
  id: string
  itemId: string
  itemName: string
  quantity: number
  dateUsed: string
  usedBy: string
}

type RiskLevel = "Low" | "Medium" | "High" | "Critical"

type RiskStatus = "Open" | "Mitigated" | "Closed" | "Accepted"

type Risk = {
  id: string
  title: string
  description: string
  level: RiskLevel
  status: RiskStatus
  identifiedDate: string
  mitigationPlan?: string
  resolvedDate?: string
  owner: string
}

type Task = {
  id: string
  title: string
  description: string
  assignedTo: string
  dueDate: string
  status: "To Do" | "In Progress" | "Completed"
  milestoneId: string
}

type User = {
  id: string
  name: string
  email: string
}

const MOCK_USERS: User[] = [
  { id: "u1", name: "John Doe", email: "john@example.com" },
  { id: "u2", name: "Jane Smith", email: "jane@example.com" },
  { id: "u3", name: "Robert Johnson", email: "robert@example.com" },
]

type Project = {
  id: string
  name: string
  location: string
  county: string
  capacity: string
  status: ProjectStatus
  startDate: string
  targetCompletionDate: string
  actualCompletionDate?: string
  progress: number
  milestones: Milestone[]
  inventoryUsage: InventoryUsage[]
  risks: Risk[]
  tasks: Task[]
  users?: User[]
}

// Template milestones for new projects
const TEMPLATE_MILESTONES = [
  { title: "Site Assessment", description: "Initial site assessment and feasibility study" },
  { title: "Permit Acquisition", description: "Obtain necessary permits and approvals" },
  { title: "Material Procurement", description: "Procure solar panels and other equipment" },
  { title: "Installation Start", description: "Begin installation of mounting structures and panels" },
  { title: "Electrical Work", description: "Complete electrical wiring and connections" },
  { title: "Testing", description: "System testing and quality assurance" },
  { title: "Grid Connection", description: "Connect system to the grid and finalize" },
  { title: "Handover", description: "Final inspection and client handover" },
]

// Mock inventory items
const MOCK_INVENTORY = [
  { id: "INV-1001", name: "Solar Panel 250W", category: "Solar Panels", quantity: 25 },
  { id: "INV-1002", name: "Inverter 3kW", category: "Inverters", quantity: 12 },
  { id: "INV-1003", name: "Battery 12V 200Ah", category: "Batteries", quantity: 18 },
  { id: "INV-1004", name: "Mounting Bracket", category: "Mounting Systems", quantity: 40 },
  { id: "INV-1005", name: "Solar Cable 10m", category: "Cables & Wiring", quantity: 60 },
]

// Mock data for projects
const generateMockProjects = (): Project[] => {
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

  const statuses: ProjectStatus[] = ["Planned", "In Progress", "On Hold", "Completed"]

  const generateMilestones = (projectId: string): Milestone[] => {
    const milestoneCount = 3 + Math.floor(Math.random() * 3) // 3-5 milestones
    const milestones: Milestone[] = []

    for (let i = 0; i < milestoneCount; i++) {
      const template = TEMPLATE_MILESTONES[i % TEMPLATE_MILESTONES.length]
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(today.getDate() + i * 14 + Math.floor(Math.random() * 10))

      const status: MilestoneStatus =
        i === 0
          ? "Completed"
          : i === 1
            ? "In Progress"
            : i === 2
              ? Math.random() > 0.5
                ? "Pending"
                : "Delayed"
              : "Pending"

      milestones.push({
        id: `${projectId}-m${i}`,
        title: template.title,
        description: template.description,
        dueDate: dueDate.toISOString().split("T")[0],
        completedDate:
          status === "Completed"
            ? new Date(dueDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 10).toISOString().split("T")[0]
            : undefined,
        status: status,
      })
    }

    return milestones
  }

  const generateInventoryUsage = (projectId: string): InventoryUsage[] => {
    const usageCount = Math.floor(Math.random() * 3) + 1 // 1-3 inventory items
    const usages: InventoryUsage[] = []

    for (let i = 0; i < usageCount; i++) {
      const inventoryItem = MOCK_INVENTORY[Math.floor(Math.random() * MOCK_INVENTORY.length)]
      const today = new Date()
      const usageDate = new Date(today)
      usageDate.setDate(today.getDate() - Math.floor(Math.random() * 30))

      usages.push({
        id: `${projectId}-inv${i}`,
        itemId: inventoryItem.id,
        itemName: inventoryItem.name,
        quantity: Math.floor(Math.random() * 5) + 1,
        dateUsed: usageDate.toISOString().split("T")[0],
        usedBy: ["John Doe", "Jane Smith", "Robert Johnson"][Math.floor(Math.random() * 3)],
      })
    }

    return usages
  }

  const generateRisks = (projectId: string): Risk[] => {
    const riskCount = Math.floor(Math.random() * 3) // 0-2 risks
    const risks: Risk[] = []
    const riskLevels: RiskLevel[] = ["Low", "Medium", "High", "Critical"]
    const riskStatuses: RiskStatus[] = ["Open", "Mitigated", "Closed", "Accepted"]

    for (let i = 0; i < riskCount; i++) {
      const today = new Date()
      const identifiedDate = new Date(today)
      identifiedDate.setDate(today.getDate() - Math.floor(Math.random() * 30))

      const status = riskStatuses[Math.floor(Math.random() * riskStatuses.length)]
      const resolvedDate =
        status === "Mitigated" || status === "Closed"
          ? new Date(identifiedDate.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 15).toISOString().split("T")[0]
          : undefined

      risks.push({
        id: `${projectId}-risk${i}`,
        title: ["Weather Delay", "Permit Issues", "Supply Chain Delay", "Technical Challenge"][
          Math.floor(Math.random() * 4)
        ],
        description: "Risk description details would go here.",
        level: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        status: status,
        identifiedDate: identifiedDate.toISOString().split("T")[0],
        mitigationPlan: status !== "Open" ? "Mitigation plan details would go here." : undefined,
        resolvedDate: resolvedDate,
        owner: ["John Doe", "Jane Smith", "Robert Johnson"][Math.floor(Math.random() * 3)],
      })
    }

    return risks
  }

  const generateTasks = (projectId: string, milestones: Milestone[]): Task[] => {
    const tasks: Task[] = []

    // Generate 1-2 tasks per milestone
    milestones.forEach((milestone) => {
      const taskCount = Math.floor(Math.random() * 2) + 1

      for (let i = 0; i < taskCount; i++) {
        const today = new Date()
        const dueDate = new Date(today)
        dueDate.setDate(today.getDate() + Math.floor(Math.random() * 14))

        tasks.push({
          id: `${projectId}-task-${milestone.id}-${i}`,
          title: `Task for ${milestone.title}`,
          description: `This is a task related to the ${milestone.title} milestone.`,
          assignedTo: ["John Doe", "Jane Smith", "Robert Johnson"][Math.floor(Math.random() * 3)],
          dueDate: dueDate.toISOString().split("T")[0],
          status: ["To Do", "In Progress", "Completed"][Math.floor(Math.random() * 3)] as
            | "To Do"
            | "In Progress"
            | "Completed",
          milestoneId: milestone.id,
        })
      }
    })

    return tasks
  }

  const projects: Project[] = []

  for (let i = 0; i < 500; i++) {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - Math.floor(Math.random() * 90))

    const targetCompletionDate = new Date(startDate)
    targetCompletionDate.setDate(startDate.getDate() + 90 + Math.floor(Math.random() * 60))

    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const progress =
      status === "Planned"
        ? Math.floor(Math.random() * 10)
        : status === "In Progress"
          ? 10 + Math.floor(Math.random() * 70)
          : status === "On Hold"
            ? 10 + Math.floor(Math.random() * 60)
            : 100

    const county = counties[Math.floor(Math.random() * counties.length)]
    const locations = [
      `${county} North`,
      `${county} South`,
      `${county} East`,
      `${county} West`,
      `${county} Central`,
      `New ${county}`,
    ]

    const projectId = `OFGEN-${1000 + i}`
    const milestones = generateMilestones(projectId)

    const project: Project = {
      id: projectId,
      name: `${county} Solar Project ${(i % 10) + 1}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      county: county,
      capacity: `${(Math.random() * 9 + 1).toFixed(2)} kW`,
      status: status,
      startDate: startDate.toISOString().split("T")[0],
      targetCompletionDate: targetCompletionDate.toISOString().split("T")[0],
      actualCompletionDate:
        status === "Completed"
          ? new Date(targetCompletionDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 14)
              .toISOString()
              .split("T")[0]
          : undefined,
      progress: progress,
      milestones: milestones,
      inventoryUsage: generateInventoryUsage(projectId),
      risks: generateRisks(projectId),
      tasks: generateTasks(projectId, milestones),
      users: [],
    }

    projects.push(project)
  }

  return projects
}

const mockProjects = generateMockProjects()

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(mockProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [countyFilter, setCountyFilter] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [isEditingMilestone, setIsEditingMilestone] = useState(false)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
  })
  const [activeTab, setActiveTab] = useState("milestones")
  const [isAddingInventory, setIsAddingInventory] = useState(false)
  const [newInventoryUsage, setNewInventoryUsage] = useState<Partial<InventoryUsage>>({
    itemId: "",
    quantity: 1,
    dateUsed: new Date().toISOString().split("T")[0],
    usedBy: "",
  })
  const [isAddingRisk, setIsAddingRisk] = useState(false)
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
    title: "",
    description: "",
    level: "Medium",
    status: "Open",
    identifiedDate: new Date().toISOString().split("T")[0],
    owner: "",
  })
  const [taskFilters, setTaskFilters] = useState({
    milestone: "all",
    status: "all",
  })
  const [showTemplateMilestones, setShowTemplateMilestones] = useState(false)
  const [selectedTemplateMilestones, setSelectedTemplateMilestones] = useState<string[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")

  const projectsPerPage = 10
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject)

  // Get unique counties for filtering
  const counties = Array.from(new Set(projects.map((project) => project.county)))

  // Filter projects based on search term and filters
  const filterProjects = () => {
    let filtered = [...projects]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(term) ||
          project.id.toLowerCase().includes(term) ||
          project.location.toLowerCase().includes(term),
      )
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    if (countyFilter !== "All") {
      filtered = filtered.filter((project) => project.county === countyFilter)
    }

    setFilteredProjects(filtered)
    setCurrentPage(1)
  }

  // Apply filters when search or filters change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    filterProjects()
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setTimeout(filterProjects, 0)
  }

  const handleCountyFilter = (value: string) => {
    setCountyFilter(value)
    setTimeout(filterProjects, 0)
  }

  // Handle milestone submission
  const handleSubmitMilestone = () => {
    if (!selectedProject || !newMilestone.title || !newMilestone.dueDate) return

    const updatedMilestone: Milestone = {
      id: `${selectedProject.id}-m${selectedProject.milestones.length + 1}`,
      title: newMilestone.title || "",
      description: newMilestone.description || "",
      dueDate: newMilestone.dueDate || "",
      status: (newMilestone.status as MilestoneStatus) || "Pending",
    }

    // Create a deep copy of the selected project with the new milestone
    const updatedProject = {
      ...selectedProject,
      milestones: [...selectedProject.milestones, updatedMilestone],
    }

    // Update the projects array
    const updatedProjects = projects.map((p) => (p.id === selectedProject.id ? updatedProject : p))

    setProjects(updatedProjects)
    setFilteredProjects(updatedProjects)
    setSelectedProject(updatedProject)
    setNewMilestone({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending",
    })
    setIsAddingMilestone(false)

    toast({
      title: "Milestone Added",
      description: `${updatedMilestone.title} has been added to ${selectedProject.name}`,
    })
  }

  // Handle milestone update
  const handleUpdateMilestone = () => {
    if (!selectedProject || !selectedMilestone || !isEditingMilestone) return

    const updatedMilestones = selectedProject.milestones.map((milestone) => {
      if (milestone.id === selectedMilestone.id) {
        return selectedMilestone
      }
      return milestone
    })

    // Create a deep copy of the selected project with the updated milestone
    const updatedProject = {
      ...selectedProject,
      milestones: updatedMilestones,
    }

    // Update the projects array
    const updatedProjects = projects.map((p) => (p.id === selectedProject.id ? updatedProject : p))

    setProjects(updatedProjects)
    setFilteredProjects(updatedProjects)
    setSelectedProject(updatedProject)
    setSelectedMilestone(null)
    setIsEditingMilestone(false)

    toast({
      title: "Milestone Updated",
      description: `${selectedMilestone.title} has been updated`,
    })
  }

  // Handle milestone deletion
  const handleDeleteMilestone = (milestoneId: string) => {
    if (!selectedProject) return

    const updatedMilestones = selectedProject.milestones.filter((milestone) => milestone.id !== milestoneId)

    // Create a deep copy of the selected project without the deleted milestone
    const updatedProject = {
      ...selectedProject,
      milestones: updatedMilestones,
    }

    // Update the projects array
    const updatedProjects = projects.map((p) => (p.id === selectedProject.id ? updatedProject : p))

    setProjects(updatedProjects)
    setFilteredProjects(updatedProjects)
    setSelectedProject(updatedProject)

    toast({
      title: "Milestone Deleted",
      description: "The milestone has been removed from this project",
    })
  }

  // Handle milestone status update
  const updateMilestoneStatus = (projectId: string, milestoneId: string, newStatus: MilestoneStatus) => {
    const updatedProjects = projects.map((project) => {
      if (project.id !== projectId) return project

      const updatedMilestones = project.milestones.map((milestone) => {
        if (milestone.id !== milestoneId) return milestone

        return {
          ...milestone,
          status: newStatus,
          completedDate: newStatus === "Completed" ? new Date().toISOString().split("T")[0] : undefined,
        }
      })

      // Calculate new progress based on completed milestones
      const completedMilestones = updatedMilestones.filter((m) => m.status === "Completed").length
      const newProgress = Math.round((completedMilestones / updatedMilestones.length) * 100)

      return {
        ...project,
        milestones: updatedMilestones,
        progress: newProgress,
        status: newProgress === 100 ? "Completed" : project.status,
      }
    })

    setProjects(updatedProjects)
    setFilteredProjects(updatedProjects)

    // Update selected project if it's the one being modified
    if (selectedProject && selectedProject.id === projectId) {
      const updatedProject = updatedProjects.find((p) => p.id === projectId)
      if (updatedProject) setSelectedProject(updatedProject)
    }
  }

  // Handle adding inventory usage
  const handleAddInventoryUsage = () => {
    if (!selectedProject || !newInventoryUsage.itemId || !newInventoryUsage.quantity) return

    const inventoryItem = MOCK_INVENTORY.find((item) => item.id === newInventoryUsage.itemId)
    if (!inventoryItem) return

    const updatedInventoryUsage: InventoryUsage = {
      id: `${selectedProject.id}-inv${selectedProject.inventoryUsage.length + 1}`,
      itemId: newInventoryUsage.itemId || "",
      itemName: inventoryItem.name,
      quantity: newInventoryUsage.quantity || 0,
      dateUsed: newInventoryUsage.dateUsed || new Date().toISOString().split("T")[0],
      usedBy: newInventoryUsage.usedBy || "",
    }

    // Create a deep copy of the selected project with the new inventory usage
    const updatedProject = {
      ...selectedProject,
      inventoryUsage: [...selectedProject.inventoryUsage, updatedInventoryUsage],
    }

    // Update the projects array
    const updatedProjects = projects.map((p) => (p.id === selectedProject.id ? updatedProject : p))

    setProjects(updatedProjects)
    setFilteredProjects(updatedProjects)
    setSelectedProject(updatedProject)
    setNewInventoryUsage({
      itemId: "",
      quantity: 1,
      dateUsed: new Date().toISOString().split("T")[0],
      usedBy: "",
    })
    setIsAddingInventory(false)

    toast({
      title: "Inventory Usage Added",
      description: `${inventoryItem.name} has been added to ${selectedProject.name}`,
    })
  }

  // Handle adding risk
  const handleAddRisk = () => {
    if (!selectedProject || !newRisk.title || !newRisk.description) return

    const updatedRisk: Risk = {
      id: `${selectedProject.id}-risk${selectedProject.risks.length + 1}`,
      title: newRisk.title || "",
      description: newRisk.description || "",
      level: (newRisk.level as RiskLevel) || "Medium",
      status: (newRisk.status as RiskStatus) || "Open",
      identifiedDate: newRisk.identifiedDate || new Date().toISOString().split("T")[0],
      mitigationPlan: newRisk.mitigationPlan,
      resolvedDate: newRisk.resolvedDate,
      owner: newRisk.owner || "",
    }

    // Create a deep copy of the selected project with the new risk
    const updatedProject = {
      ...selectedProject,
      risks: [...selectedProject.risks, updatedRisk],
    }

    // Update the projects array
    const updatedProjects = projects.map((p) => (p.id === selectedProject.id ? updatedProject : p))

    setProjects(updatedProjects)
    setFilteredProjects(updatedProjects)
    setSelectedProject(updatedProject)
    setNewRisk({
      title: "",
      description: "",
      level: "Medium",
      status: "Open",
      identifiedDate: new Date().toISOString().split("T")[0],
      owner: "",
    })
    setIsAddingRisk(false)

    toast({
      title: "Risk Added",
      description: `${updatedRisk.title} has been added to ${selectedProject.name}`,
    })
  }

  // Handle updating risk status
  const updateRiskStatus = (riskId: string, newStatus: RiskStatus) => {
    if (!selectedProject) return

    const updatedRisks = selectedProject.risks.map((risk) => {
      if (risk.id !== riskId) return risk

      return {
        ...risk,
        status: newStatus,
        resolvedDate:
          newStatus === "Mitigated" || newStatus === "Closed"
            ? new Date().toISOString().split("T")[0]
            : risk.resolvedDate,
      }
    })

    // Create a deep copy of the selected project with the updated risks
    const updatedProject = {
      ...selectedProject,
      risks: updatedRisks,
    }

    // Update the projects array
    const updatedProjects = projects.map((p) => (p.id === selectedProject.id ? updatedProject : p))

    setProjects(updatedProjects)
    setFilteredProjects(updatedProjects)
    setSelectedProject(updatedProject)
  }

  // Filter tasks based on milestone and status
  const getFilteredTasks = () => {
    if (!selectedProject) return []

    return selectedProject.tasks.filter((task) => {
      const matchesMilestone = taskFilters.milestone === "all" || task.milestoneId === taskFilters.milestone
      const matchesStatus = taskFilters.status === "all" || task.status === taskFilters.status
      return matchesMilestone && matchesStatus
    })
  }

  // Handle adding template milestones
  const handleAddTemplateMilestones = () => {
    if (!selectedProject || selectedTemplateMilestones.length === 0) return

    const newMilestones = selectedTemplateMilestones
      .map((templateTitle, index) => {
        const template = TEMPLATE_MILESTONES.find((t) => t.title === templateTitle)
        if (!template) return null

        const today = new Date()
        const dueDate = new Date(today)
        dueDate.setDate(today.getDate() + (index + 1) * 14) // Space out due dates by 2 weeks

        return {
          id: `${selectedProject.id}-m${selectedProject.milestones.length + index + 1}`,
          title: template.title,
          description: template.description,
          dueDate: dueDate.toISOString().split("T")[0],
          status: "Pending" as MilestoneStatus,
        }
      })
      .filter(Boolean) as Milestone[]

    // Create a deep copy of the selected project with the new milestones
    const updatedProject = {
      ...selectedProject,
      milestones: [...selectedProject.milestones, ...newMilestones],
    }

    // Update the projects array
    const updatedProjects = projects.map((p) => (p.id === selectedProject.id ? updatedProject : p))

    setProjects(updatedProjects)
    setFilteredProjects(updatedProjects)
    setSelectedProject(updatedProject)
    setSelectedTemplateMilestones([])
    setShowTemplateMilestones(false)

    toast({
      title: "Template Milestones Added",
      description: `${newMilestones.length} milestones have been added to ${selectedProject.name}`,
    })
  }

  const handleAddUserToProject = () => {
    if (!selectedProject || !selectedUserId) return
    const user = MOCK_USERS.find((u) => u.id === selectedUserId)
    if (!user) return
    if (selectedProject.users?.some((u) => u.id === user.id)) return

    const updatedProject = {
      ...selectedProject,
      users: [...(selectedProject.users || []), user],
    }
    const updatedProjects = projects.map((p) => (p.id === selectedProject.id ? updatedProject : p))
    setProjects(updatedProjects)
    setFilteredProjects(updatedProjects)
    setSelectedProject(updatedProject)
    setSelectedUserId("")
    toast({
      title: "User Assigned",
      description: `${user.name} has been assigned to ${selectedProject.name}`,
    })
  }

  // Statistics for the dashboard
  const statistics = {
    total: projects.length,
    completed: projects.filter((p) => p.status === "Completed").length,
    inProgress: projects.filter((p) => p.status === "In Progress").length,
    planned: projects.filter((p) => p.status === "Planned").length,
    onHold: projects.filter((p) => p.status === "On Hold").length,
    averageProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length),
  }

  // Generate chart data for progress by county
  const progressByCounty = counties.map((county) => {
    const countyProjects = projects.filter((p) => p.county === county)
    const averageProgress = countyProjects.reduce((sum, p) => sum + p.progress, 0) / countyProjects.length

    return {
      name: county,
      value: Math.round(averageProgress),
    }
  })

  // Function to handle opening the sheet and setting the selected project
  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setIsSheetOpen(true)
    // Reset all form states when opening a new project
    setIsAddingMilestone(false)
    setIsEditingMilestone(false)
    setSelectedMilestone(null)
    setIsAddingInventory(false)
    setIsAddingRisk(false)
    setActiveTab("milestones")
  }

  // Function to handle closing the sheet
  const handleSheetClose = () => {
    setIsSheetOpen(false)
    // Optional: Reset selected project when sheet is closed
    // setSelectedProject(null)
  }

  // Prevent scrolling when sheet is open
  useEffect(() => {
    const body = document.body
    if (isSheetOpen) {
      const scrollY = window.scrollY
      body.style.position = "fixed"
      body.style.top = `-${scrollY}px`
      body.style.width = "100%"
      body.style.overflowY = "scroll"

      return () => {
        body.style.position = ""
        body.style.top = ""
        body.style.width = ""
        body.style.overflowY = ""
        window.scrollTo(0, scrollY)
      }
    }
  }, [isSheetOpen])

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground">
            Track and manage solar installation projects and milestones across all sites
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
              <p className="text-xs text-muted-foreground">Across {counties.length} counties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statistics.completed}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((statistics.completed / statistics.total) * 100)}% of all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statistics.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((statistics.inProgress / statistics.total) * 100)}% of all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Planned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statistics.planned}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((statistics.planned / statistics.total) * 100)}% of all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.averageProgress}%</div>
              <Progress value={statistics.averageProgress} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Project Management Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Project List</TabsTrigger>
            <TabsTrigger value="analytics">Progress Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search projects by name, ID, or location..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Select value={statusFilter} onValueChange={handleStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="All">All Statuses</SelectItem>
                          <SelectItem value="Planned">Planned</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Select value={countyFilter} onValueChange={handleCountyFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by county" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>County</SelectLabel>
                          <SelectItem value="All">All Counties</SelectItem>
                          {counties.map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Filter className="mr-2 h-4 w-4" />
                          More Filters
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Advanced Filters</DialogTitle>
                          <DialogDescription>Filter projects by various criteria</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="progress" className="col-span-4">
                              Minimum Progress
                            </Label>
                            <div className="col-span-4">
                              <div className="flex items-center gap-4">
                                <Input id="progress" type="range" min="0" max="100" />
                                <span>0%</span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date-from" className="col-span-4">
                              Start Date Range
                            </Label>
                            <Input id="date-from" type="date" className="col-span-2" placeholder="From" />
                            <Input id="date-to" type="date" className="col-span-2" placeholder="To" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Reset</Button>
                          <Button>Apply Filters</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project ID</TableHead>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Target Completion</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentProjects.length > 0 ? (
                      currentProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.id}</TableCell>
                          <TableCell>{project.name}</TableCell>
                          <TableCell>{project.location}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                project.status === "Completed"
                                  ? "bg-green-600"
                                  : project.status === "In Progress"
                                    ? "bg-blue-600"
                                    : project.status === "On Hold"
                                      ? "bg-amber-600"
                                      : "bg-slate-600"
                              }
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress} className="h-2 w-[60px]" />
                              <span className="text-xs">{project.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{project.targetCompletionDate}</TableCell>

                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(project)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No projects found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t p-2">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, filteredProjects.length)} of{" "}
                    {filteredProjects.length} projects
                  </p>
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
                      // Show pages around the current page
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
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Progress by County</CardTitle>
                  <CardDescription>Average project completion percentage by county</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <LineChart data={progressByCounty} xAxis="name" yAxis="value" height={400} colors={["#16a34a"]} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                  <CardDescription>Number of projects by status category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <div className="flex flex-col h-full justify-center">
                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-green-600"></div>
                              <span>Completed</span>
                            </div>
                            <span className="font-medium">{statistics.completed}</span>
                          </div>
                          <Progress value={(statistics.completed / statistics.total) * 100} className="h-2 mt-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                              <span>In Progress</span>
                            </div>
                            <span className="font-medium">{statistics.inProgress}</span>
                          </div>
                          <Progress value={(statistics.inProgress / statistics.total) * 100} className="h-2 mt-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
                              <span>Planned</span>
                            </div>
                            <span className="font-medium">{statistics.planned}</span>
                          </div>
                          <Progress value={(statistics.planned / statistics.total) * 100} className="h-2 mt-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-amber-600"></div>
                              <span>On Hold</span>
                            </div>
                            <span className="font-medium">{statistics.onHold}</span>
                          </div>
                          <Progress value={(statistics.onHold / statistics.total) * 100} className="h-2 mt-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Milestone Updates</CardTitle>
                <CardDescription>Recently updated project milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Milestone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated Date</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* This would typically be populated with real data - showing mock data for now */}
                    {[1, 2, 3, 4, 5].map((_, i) => {
                      const project = projects[i * 10]
                      const milestone = project.milestones[0]
                      return (
                        <TableRow key={i}>
                          <TableCell>{project.name}</TableCell>
                          <TableCell>{milestone.title}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                milestone.status === "Completed"
                                  ? "bg-green-600"
                                  : milestone.status === "In Progress"
                                    ? "bg-blue-600"
                                    : milestone.status === "Delayed"
                                      ? "bg-red-600"
                                      : "bg-slate-600"
                              }
                            >
                              {milestone.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{milestone.completedDate || milestone.dueDate}</TableCell>
                          <TableCell>{project.location}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Details Sheet */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (!open) handleSheetClose()
          setIsSheetOpen(open)
        }}
      >
        <SheetContent side="right" className="w-full sm:w-[640px] md:w-[768px] h-full p-0 flex flex-col">
          {selectedProject && (
            <>
              <div className="px-6 py-6 border-b">
                <SheetHeader>
                  <SheetTitle>Project Details</SheetTitle>
                  <SheetDescription>
                    {selectedProject.id} - {selectedProject.name}
                  </SheetDescription>
                </SheetHeader>
              </div>
              <ScrollArea className="flex-1 px-6 py-6">
                <div className="space-y-6 pb-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold">Status</h4>
                      <Badge
                        className={
                          selectedProject.status === "Completed"
                            ? "bg-green-600"
                            : selectedProject.status === "In Progress"
                              ? "bg-blue-600"
                              : selectedProject.status === "On Hold"
                                ? "bg-amber-600"
                                : "bg-slate-600"
                        }
                      >
                        {selectedProject.status}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Progress</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={selectedProject.progress} className="h-2 w-[100px]" />
                        <span>{selectedProject.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Location</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.location}, {selectedProject.county}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Capacity</h4>
                      <p className="text-sm text-muted-foreground">{selectedProject.capacity}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Start Date</h4>
                      <p className="text-sm text-muted-foreground">{selectedProject.startDate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Target Completion</h4>
                      <p className="text-sm text-muted-foreground">{selectedProject.targetCompletionDate}</p>
                    </div>
                  </div>

                  {/* Project Details Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="overflow-x-auto whitespace-nowrap">
                      <TabsList className="inline-flex min-w-max gap-2">
                        <TabsTrigger value="milestones">Milestones</TabsTrigger>
                        {/* <TabsTrigger value="inventory">Inventory</TabsTrigger> */}
                        {/* <TabsTrigger value="risks">Risk Register</TabsTrigger> */}
                        {/* <TabsTrigger value="tasks">Tasks</TabsTrigger> */}
                        <TabsTrigger value="users">Users</TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Milestones Tab */}
                    <TabsContent value="milestones">
                      <div className="flex flex-col gap-4 mb-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Milestones</h3>
                          <div className="flex gap-2">
                            <Dialog open={showTemplateMilestones} onOpenChange={setShowTemplateMilestones}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Add Template Milestones
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-h-[70vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Add Template Milestones</DialogTitle>
                                  <DialogDescription>Select template milestones to add to this project</DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  {TEMPLATE_MILESTONES.map((template, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                      <input
                                        type="checkbox"
                                        id={`template-${index}`}
                                        checked={selectedTemplateMilestones.includes(template.title)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedTemplateMilestones([...selectedTemplateMilestones, template.title])
                                          } else {
                                            setSelectedTemplateMilestones(
                                              selectedTemplateMilestones.filter((title) => title !== template.title),
                                            )
                                          }
                                        }}
                                        className="rounded border-gray-300"
                                      />
                                      <div>
                                        <Label htmlFor={`template-${index}`} className="font-medium">
                                          {template.title}
                                        </Label>
                                        <p className="text-sm text-muted-foreground">{template.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setShowTemplateMilestones(false)}>
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleAddTemplateMilestones}
                                    disabled={selectedTemplateMilestones.length === 0}
                                  >
                                    Add Selected Milestones
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {/* <Button variant="outline" size="sm" onClick={() => setIsAddingMilestone(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Custom Milestone
                          </Button> */}
                          </div>
                        </div>

                        {isAddingMilestone ? (
                          <Card className="mb-4">
                            <CardHeader>
                              <CardTitle className="text-sm">Add New Milestone</CardTitle>
                              <CardDescription>Create a new milestone for this project</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="title">Title</Label>
                                  <Input
                                    id="title"
                                    value={newMilestone.title}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="description">Description</Label>
                                  <Textarea
                                    id="description"
                                    value={newMilestone.description}
                                    onChange={(e) =>
                                      setNewMilestone({
                                        ...newMilestone,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="due-date">Due Date</Label>
                                  <Input
                                    id="due-date"
                                    type="date"
                                    value={newMilestone.dueDate}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="status">Status</Label>
                                  <Select
                                    value={newMilestone.status}
                                    onValueChange={(value) =>
                                      setNewMilestone({
                                        ...newMilestone,
                                        status: value as MilestoneStatus,
                                      })
                                    }
                                  >
                                    <SelectTrigger id="status">
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pending">Pending</SelectItem>
                                      <SelectItem value="In Progress">In Progress</SelectItem>
                                      <SelectItem value="Completed">Completed</SelectItem>
                                      <SelectItem value="Delayed">Delayed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button variant="outline" onClick={() => setIsAddingMilestone(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleSubmitMilestone}>Add Milestone</Button>
                            </CardFooter>
                          </Card>
                        ) : null}

                        {isEditingMilestone && selectedMilestone ? (
                          <Card className="mb-4">
                            <CardHeader>
                              <CardTitle className="text-sm">Edit Milestone</CardTitle>
                              <CardDescription>Update milestone details</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-title">Title</Label>
                                  <Input
                                    id="edit-title"
                                    value={selectedMilestone.title}
                                    onChange={(e) =>
                                      setSelectedMilestone({
                                        ...selectedMilestone,
                                        title: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={selectedMilestone.description}
                                    onChange={(e) =>
                                      setSelectedMilestone({
                                        ...selectedMilestone,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-due-date">Due Date</Label>
                                  <Input
                                    id="edit-due-date"
                                    type="date"
                                    value={selectedMilestone.dueDate}
                                    onChange={(e) =>
                                      setSelectedMilestone({
                                        ...selectedMilestone,
                                        dueDate: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select
                                    value={selectedMilestone.status}
                                    onValueChange={(value) =>
                                      setSelectedMilestone({
                                        ...selectedMilestone,
                                        status: value as MilestoneStatus,
                                      })
                                    }
                                  >
                                    <SelectTrigger id="edit-status">
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pending">Pending</SelectItem>
                                      <SelectItem value="In Progress">In Progress</SelectItem>
                                      <SelectItem value="Completed">Completed</SelectItem>
                                      <SelectItem value="Delayed">Delayed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsEditingMilestone(false)
                                  setSelectedMilestone(null)
                                }}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateMilestone}>Save Changes</Button>
                            </CardFooter>
                          </Card>
                        ) : null}

                        <div className="space-y-4">
                          {selectedProject.milestones.map((milestone) => (
                            <Card key={milestone.id} className="relative w-full max-w-full">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <CardTitle className="text-sm font-medium break-words whitespace-normal">{milestone.title}</CardTitle>
                                    <CardDescription className="break-words whitespace-normal">
                                      Due: {milestone.dueDate}
                                      {milestone.completedDate && <> · Completed: {milestone.completedDate}</>}
                                    </CardDescription>
                                  </div>
                                  <Badge
                                    className={
                                      milestone.status === "Completed"
                                        ? "bg-green-600"
                                        : milestone.status === "In Progress"
                                          ? "bg-blue-600"
                                          : milestone.status === "Delayed"
                                            ? "bg-red-600"
                                            : "bg-slate-600"
                                    }
                                  >
                                    {milestone.status}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground break-words whitespace-pre-line">{milestone.description}</p>
                              </CardContent>
                              <CardFooter className="flex justify-between">
                                <div className="flex gap-2">
                                  {milestone.status !== "Completed" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateMilestoneStatus(selectedProject.id, milestone.id, "Completed")}
                                    >
                                      <CheckCircle2 className="mr-1 h-3 w-3" />
                                      Mark Complete
                                    </Button>
                                  )}
                                  {milestone.status === "Pending" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        updateMilestoneStatus(selectedProject.id, milestone.id, "In Progress")
                                      }
                                    >
                                      <Clock className="mr-1 h-3 w-3" />
                                      Start
                                    </Button>
                                  )}
                                  {milestone.status === "In Progress" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateMilestoneStatus(selectedProject.id, milestone.id, "Delayed")}
                                    >
                                      <XCircle className="mr-1 h-3 w-3" />
                                      Mark Delayed
                                    </Button>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedMilestone(milestone)
                                      setIsEditingMilestone(true)
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteMilestone(milestone.id)}>
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                  </Button>
                                </div>
                              </CardFooter>
                            </Card>
                          ))}

                          {selectedProject.milestones.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              No milestones have been added to this project yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Other tabs content */}
                    {/* ... */}
                    <TabsContent value="users">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Assigned Users</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(selectedProject.users || []).map((user) => (
                            <Badge key={user.id}>{user.name}</Badge>
                          ))}
                          {(selectedProject.users || []).length === 0 && (
                            <span className="text-muted-foreground text-sm">No users assigned yet.</span>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 max-w-md">
                          <Input
                            type="search"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                          />
                          <div className="max-h-48 overflow-y-auto border rounded-md bg-background">
                            {MOCK_USERS.filter(
                              u =>
                                !selectedProject.users?.some(assigned => assigned.id === u.id) &&
                                (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                            ).map(user => (
                              <div key={user.id} className="flex items-center justify-between px-3 py-2 border-b last:border-b-0">
                                <div>
                                  <span className="font-medium">{user.name}</span>
                                  <span className="ml-2 text-xs text-muted-foreground">{user.email}</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedUserId(user.id)
                                    handleAddUserToProject()
                                  }}
                                  disabled={selectedProject.users?.some(u => u.id === user.id)}
                                >
                                  Assign
                                </Button>
                              </div>
                            ))}
                            {MOCK_USERS.filter(
                              u =>
                                !selectedProject.users?.some(assigned => assigned.id === u.id) &&
                                (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                            ).length === 0 && (
                              <div className="px-3 py-2 text-muted-foreground text-sm">No users found.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  )
}
