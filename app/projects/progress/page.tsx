"use client"

import { useState } from "react"
import DashboardLayout from "@/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProjectProgressPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [countyFilter, setCountyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data for progress statistics
  const progressStats = {
    counties: [
      { name: "Nairobi", completed: 12, inProgress: 8, planned: 5, onHold: 2, total: 27 },
      { name: "Mombasa", completed: 8, inProgress: 5, planned: 4, onHold: 1, total: 18 },
      { name: "Kisumu", completed: 6, inProgress: 4, planned: 3, onHold: 1, total: 14 },
      { name: "Nakuru", completed: 5, inProgress: 6, planned: 2, onHold: 0, total: 13 },
      { name: "Kiambu", completed: 10, inProgress: 7, planned: 4, onHold: 1, total: 22 },
    ],
    monthly: [
      { name: "Jan", completed: 8, inProgress: 15, planned: 25 },
      { name: "Feb", completed: 12, inProgress: 20, planned: 22 },
      { name: "Mar", completed: 18, inProgress: 18, planned: 20 },
      { name: "Apr", completed: 24, inProgress: 15, planned: 16 },
      { name: "May", completed: 32, inProgress: 12, planned: 12 },
      { name: "Jun", completed: 38, inProgress: 10, planned: 8 },
    ],
    milestones: [
      { name: "Site Assessment", completed: 75, total: 100 },
      { name: "Permit Acquisition", completed: 62, total: 100 },
      { name: "Material Procurement", completed: 48, total: 100 },
      { name: "Installation", completed: 35, total: 100 },
      { name: "Electrical Work", completed: 28, total: 100 },
      { name: "Testing", completed: 20, total: 100 },
      { name: "Grid Connection", completed: 15, total: 100 },
      { name: "Client Handover", completed: 10, total: 100 },
    ],
    critical: [
      { project: "Nairobi Solar Project 3", milestone: "Permit Acquisition", dueDate: "2025-04-15", status: "Delayed" },
      {
        project: "Mombasa Solar Project 2",
        milestone: "Material Procurement",
        dueDate: "2025-04-20",
        status: "At Risk",
      },
      { project: "Kisumu Solar Project 1", milestone: "Grid Connection", dueDate: "2025-04-25", status: "Delayed" },
      { project: "Nakuru Solar Project 4", milestone: "Installation", dueDate: "2025-05-02", status: "At Risk" },
      { project: "Kiambu Solar Project 2", milestone: "Testing", dueDate: "2025-05-08", status: "At Risk" },
    ],
  }

  // Calculate overall progress
  const totalProjects = progressStats.counties.reduce((sum, county) => sum + county.total, 0)
  const completedProjects = progressStats.counties.reduce((sum, county) => sum + county.completed, 0)
  const inProgressProjects = progressStats.counties.reduce((sum, county) => sum + county.inProgress, 0)
  const plannedProjects = progressStats.counties.reduce((sum, county) => sum + county.planned, 0)
  const onHoldProjects = progressStats.counties.reduce((sum, county) => sum + county.onHold, 0)

  const overallProgress = Math.round((completedProjects / totalProjects) * 100)

  // Filter counties if needed
  const filteredCounties = progressStats.counties.filter((county) =>
    county.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Progress</h1>
            <p className="text-muted-foreground">
              Track milestones and progress across all solar installation projects
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="hidden md:flex">
              <Calendar className="mr-2 h-4 w-4" />
              Filter by Date
            </Button>
            <Button variant="default">Generate Report</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <Progress value={overallProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedProjects}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((completedProjects / totalProjects) * 100)}% of all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgressProjects}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((inProgressProjects / totalProjects) * 100)}% of all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Projects Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plannedProjects + onHoldProjects}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round(((plannedProjects + onHoldProjects) / totalProjects) * 100)}% of all projects
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="counties">Counties</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="critical">Critical Path</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Project Completion Trend</CardTitle>
                  <CardDescription>Monthly progress across all installation sites</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <LineChart
                      data={progressStats.monthly.map((month) => ({
                        name: month.name,
                        value: month.completed,
                      }))}
                      xAxis="name"
                      yAxis="value"
                      height={350}
                      colors={["#16a34a"]}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                  <CardDescription>Breakdown by current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Completed</div>
                        <div className="text-sm text-muted-foreground">
                          {completedProjects} ({Math.round((completedProjects / totalProjects) * 100)}%)
                        </div>
                      </div>
                      <Progress value={(completedProjects / totalProjects) * 100} className="h-2 bg-muted" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">In Progress</div>
                        <div className="text-sm text-muted-foreground">
                          {inProgressProjects} ({Math.round((inProgressProjects / totalProjects) * 100)}%)
                        </div>
                      </div>
                      <Progress value={(inProgressProjects / totalProjects) * 100} className="h-2 bg-muted" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Planned</div>
                        <div className="text-sm text-muted-foreground">
                          {plannedProjects} ({Math.round((plannedProjects / totalProjects) * 100)}%)
                        </div>
                      </div>
                      <Progress value={(plannedProjects / totalProjects) * 100} className="h-2 bg-muted" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">On Hold</div>
                        <div className="text-sm text-muted-foreground">
                          {onHoldProjects} ({Math.round((onHoldProjects / totalProjects) * 100)}%)
                        </div>
                      </div>
                      <Progress value={(onHoldProjects / totalProjects) * 100} className="h-2 bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Counties</CardTitle>
                  <CardDescription>By completion percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {progressStats.counties
                      .sort((a, b) => b.completed / b.total - a.completed / a.total)
                      .slice(0, 5)
                      .map((county, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium">{county.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {Math.round((county.completed / county.total) * 100)}%
                            </div>
                          </div>
                          <Progress value={(county.completed / county.total) * 100} className="h-2 bg-muted" />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="counties">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>County Progress</CardTitle>
                    <CardDescription>Project completion by county</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search counties..."
                        className="w-[200px] pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {filteredCounties.map((county, index) => {
                    const completionPercent = Math.round((county.completed / county.total) * 100)

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{county.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            {county.completed} of {county.total} projects complete
                          </div>
                        </div>
                        <Progress value={completionPercent} className="h-2" />
                        <div className="flex flex-wrap gap-2 text-sm">
                          <Badge variant="outline" className="bg-green-600 text-white">
                            Completed: {county.completed}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-600 text-white">
                            In Progress: {county.inProgress}
                          </Badge>
                          <Badge variant="outline" className="bg-slate-600 text-white">
                            Planned: {county.planned}
                          </Badge>
                          <Badge variant="outline" className="bg-amber-600 text-white">
                            On Hold: {county.onHold}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}

                  {filteredCounties.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No counties matching your search criteria
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones">
            <Card>
              <CardHeader>
                <CardTitle>Milestone Completion</CardTitle>
                <CardDescription>Progress across all project milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {progressStats.milestones.map((milestone, index) => {
                    const completionPercent = Math.round((milestone.completed / milestone.total) * 100)

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{milestone.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            {milestone.completed} of {milestone.total} completed ({completionPercent}%)
                          </div>
                        </div>
                        <Progress value={completionPercent} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="critical">
            <Card>
              <CardHeader>
                <CardTitle>Critical Path Items</CardTitle>
                <CardDescription>Milestones requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressStats.critical.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-1">
                        <div className="font-medium">{item.project}</div>
                        <div className="text-sm">{item.milestone}</div>
                        <div className="text-xs text-muted-foreground">Due: {item.dueDate}</div>
                      </div>
                      <Badge className={item.status === "Delayed" ? "bg-red-600" : "bg-amber-600"}>{item.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View All Critical Items</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
