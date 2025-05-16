"use client"

import { useState, useEffect } from "react"
import { addDays, subDays } from "date-fns"
import DashboardLayout from "@/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GanttChart, type GanttProject } from "@/components/gantt-chart"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Filter } from "lucide-react"

export default function GanttChartPage() {
  const [projects, setProjects] = useState<GanttProject[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Generate mock data for Gantt chart
  useEffect(() => {
    const generateMockData = (): GanttProject[] => {
      const today = new Date()
      const projectsData: GanttProject[] = []

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

      const statuses: ("Completed" | "In Progress" | "Planned" | "On Hold" | "Delayed")[] = [
        "Completed",
        "In Progress",
        "Planned",
        "On Hold",
        "Delayed",
      ]

      // Create 10-15 projects
      const numProjects = 10 + Math.floor(Math.random() * 6)
      for (let i = 0; i < numProjects; i++) {
        const county = counties[Math.floor(Math.random() * counties.length)]
        const projectId = `OFGEN-${1000 + i}`

        // Create 3-8 tasks per project
        const tasks: GanttProject["tasks"] = []
        const numTasks = 3 + Math.floor(Math.random() * 6)

        let currentStartDate = subDays(today, 30 + Math.floor(Math.random() * 30))

        for (let j = 0; j < numTasks; j++) {
          const taskId = `${projectId}-T${j + 1}`
          const taskStatus = statuses[Math.floor(Math.random() * statuses.length)]
          const taskProgress =
            taskStatus === "Completed"
              ? 100
              : taskStatus === "In Progress"
                ? 20 + Math.floor(Math.random() * 60)
                : taskStatus === "Planned"
                  ? 0
                  : taskStatus === "On Hold"
                    ? 10 + Math.floor(Math.random() * 40)
                    : 5 + Math.floor(Math.random() * 20)

          const taskDuration = 3 + Math.floor(Math.random() * 14)
          const startDate = j === 0 ? currentStartDate : addDays(currentStartDate, 1 + Math.floor(Math.random() * 3))
          const endDate = addDays(startDate, taskDuration)

          // Update the current start date for the next task
          currentStartDate = endDate

          // Create 0-2 milestones per task
          const milestones = []
          const numMilestones = Math.floor(Math.random() * 3)

          for (let k = 0; k < numMilestones; k++) {
            const milestoneDate = addDays(startDate, Math.floor((taskDuration * (k + 1)) / (numMilestones + 1)))

            milestones.push({
              id: `${taskId}-M${k + 1}`,
              name: k === 0 ? "Start" : k === numMilestones - 1 ? "Finish" : "Checkpoint",
              date: milestoneDate,
              completed: milestoneDate < today,
            })
          }

          tasks.push({
            id: taskId,
            name: [
              "Site Assessment",
              "Permit Acquisition",
              "Material Procurement",
              "Installation",
              "Electrical Work",
              "Testing",
              "Grid Connection",
              "Client Handover",
            ][j % 8],
            startDate,
            endDate,
            progress: taskProgress,
            status: taskStatus,
            milestones: milestones.length > 0 ? milestones : undefined,
          })
        }

        projectsData.push({
          id: projectId,
          name: `${county} Solar Project ${i + 1}`,
          tasks,
        })
      }

      return projectsData
    }

    setProjects(generateMockData())
    setLoading(false)
  }, [])

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle task click
  const handleTaskClick = (projectId: string, taskId: string) => {
    setSelectedProject(projectId)
    // You could open a detail view/modal here
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Gantt Chart</h1>
          <p className="text-muted-foreground">Visualize project timelines and milestone progress</p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>Visual timeline of all solar installation projects</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative w-60">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      More Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Options</SheetTitle>
                      <SheetDescription>Apply additional filters to the Gantt chart</SheetDescription>
                    </SheetHeader>
                    {/* Additional filter options would go here */}
                    <div className="py-4 space-y-4">{/* County filter, date range, etc. */}</div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-8 text-center">Loading project timeline data...</div>
            ) : (
              <GanttChart projects={filteredProjects} onTaskClick={handleTaskClick} className="border-0" />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
