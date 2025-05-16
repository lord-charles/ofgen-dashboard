"use client"

import { useState, useRef, useEffect } from "react"
import {
  format,
  addDays,
  startOfMonth,
  eachDayOfInterval,
  isSameDay,
  subMonths,
  addMonths,
  differenceInDays,
} from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type GanttTask = {
  id: string
  name: string
  startDate: Date
  endDate: Date
  progress: number
  status: "Completed" | "In Progress" | "Planned" | "On Hold" | "Delayed"
  dependencies?: string[]
  assignee?: string
  milestones?: {
    id: string
    name: string
    date: Date
    completed: boolean
  }[]
}

export type GanttProject = {
  id: string
  name: string
  tasks: GanttTask[]
}

type GanttChartProps = {
  projects: GanttProject[]
  onTaskClick?: (projectId: string, taskId: string) => void
  className?: string
}

const CELL_WIDTH = 40
const LABEL_WIDTH = 220
const ROW_HEIGHT = 40
const HEADER_HEIGHT = 60
const MILESTONE_SIZE = 12

export function GanttChart({ projects, onTaskClick, className }: GanttChartProps) {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const [visibleDays, setVisibleDays] = useState(60)
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Initialize all projects as expanded
  useEffect(() => {
    const expanded: Record<string, boolean> = {}
    projects.forEach((project) => {
      expanded[project.id] = true
    })
    setExpandedProjects(expanded)
  }, [projects])

  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (entry) {
          setContainerWidth(entry.contentRect.width)
          const newVisibleDays = Math.floor((entry.contentRect.width - LABEL_WIDTH) / CELL_WIDTH)
          if (newVisibleDays > 0) {
            setVisibleDays(newVisibleDays)
          }
        }
      })

      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }
  }, [])

  // Calculate date range
  const startDate = startOfMonth(currentDate)
  const endDate = addDays(startDate, visibleDays)
  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate })

  // Navigation functions
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(today)

  // Toggle project expansion
  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }))
  }

  // Calculate task position and width
  const getTaskPosition = (task: GanttTask) => {
    const start = Math.max(differenceInDays(task.startDate, startDate), 0)
    const end = Math.min(differenceInDays(task.endDate, startDate), visibleDays)
    const width = Math.max(end - start, 1) * CELL_WIDTH

    return {
      left: start * CELL_WIDTH,
      width,
    }
  }

  // Get milestone position
  const getMilestonePosition = (date: Date) => {
    return differenceInDays(date, startDate) * CELL_WIDTH
  }

  // Get status color
  const getStatusColor = (status: GanttTask["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-600 border-green-700"
      case "In Progress":
        return "bg-blue-600 border-blue-700"
      case "Planned":
        return "bg-slate-600 border-slate-700"
      case "On Hold":
        return "bg-amber-600 border-amber-700"
      case "Delayed":
        return "bg-red-600 border-red-700"
      default:
        return "bg-slate-600 border-slate-700"
    }
  }

  return (
    <Card className={cn("p-0 overflow-hidden", className)}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="text-lg font-semibold">Project Timeline</div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{format(currentDate, "MMMM yyyy")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => date && setCurrentDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-none" onClick={goToToday}>
              <span className="sr-only">Go to today</span>
              <span className="text-xs">Today</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-none border-l-0"
              onClick={goToPreviousMonth}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none border-l-0" onClick={goToNextMonth}>
              <span className="sr-only">Next month</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center">
            <Label htmlFor="zoom" className="mr-2 text-xs">
              Days:
            </Label>
            <Input
              id="zoom"
              type="number"
              min={14}
              max={180}
              value={visibleDays}
              onChange={(e) => setVisibleDays(Number(e.target.value))}
              className="w-16 h-8"
            />
          </div>
        </div>
      </div>

      <div ref={containerRef} className="overflow-hidden">
        <ScrollArea>
          <div className="flex">
            {/* Left panel - Task labels */}
            <div className="flex-shrink-0" style={{ width: LABEL_WIDTH }}>
              <div style={{ height: HEADER_HEIGHT }} className="border-b flex items-end px-4 pb-2 font-medium">
                Projects / Tasks
              </div>

              {projects.map((project) => {
                const isExpanded = expandedProjects[project.id]

                return (
                  <div key={project.id}>
                    <div
                      className="flex items-center px-4 border-b cursor-pointer hover:bg-muted/50"
                      style={{ height: ROW_HEIGHT }}
                      onClick={() => toggleProject(project.id)}
                    >
                      <div className={`mr-2 transform transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <div className="font-medium truncate">{project.name}</div>
                    </div>

                    {isExpanded &&
                      project.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center px-4 border-b pl-8"
                          style={{ height: ROW_HEIGHT }}
                        >
                          <div
                            className="whitespace-normal break-words overflow-hidden text-ellipsis pr-2 w-full min-w-0"
                            style={{ lineHeight: '1.2', maxWidth: '100%' }}
                            title={task.name}
                          >
                            {task.name}
                          </div>
                        </div>
                      ))}
                  </div>
                )
              })}
            </div>

            {/* Right panel - Timeline */}
            <div className="relative flex-grow">
              <div className="sticky top-0 z-10 bg-card">
                {/* Timeline Header */}
                <div className="flex border-b" style={{ height: HEADER_HEIGHT }}>
                  {daysInRange.map((date, index) => {
                    // First day of month or first day in range
                    const isMonthStart = index === 0 || date.getDate() === 1
                    const isToday = isSameDay(date, today)

                    return (
                      <div
                        key={date.toISOString()}
                        className={cn("flex flex-col items-center border-r", isToday && "bg-primary/10")}
                        style={{ width: CELL_WIDTH }}
                      >
                        {isMonthStart && (
                          <div className="w-full text-xs font-medium text-center py-1 border-b">
                            {format(date, "MMM")}
                          </div>
                        )}
                        <div
                          className={cn(
                            "w-full flex-grow flex items-center justify-center text-xs",
                            isToday && "font-bold text-primary",
                          )}
                        >
                          {format(date, "d")}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Timeline Body */}
              <div>
                {projects.map((project) => {
                  const isExpanded = expandedProjects[project.id]

                  return (
                    <div key={project.id}>
                      {/* Project row */}
                      <div className="relative border-b" style={{ height: ROW_HEIGHT }}>
                        {/* Today indicator */}
                        {differenceInDays(today, startDate) >= 0 &&
                          differenceInDays(today, startDate) <= visibleDays && (
                            <div
                              className="absolute top-0 bottom-0 border-l-2 border-primary z-10"
                              style={{ left: `${differenceInDays(today, startDate) * CELL_WIDTH}px` }}
                            />
                          )}
                      </div>

                      {/* Task rows */}
                      {isExpanded &&
                        project.tasks.map((task) => {
                          const { left, width } = getTaskPosition(task)
                          const statusColor = getStatusColor(task.status)

                          return (
                            <div key={task.id} className="relative border-b" style={{ height: ROW_HEIGHT }}>
                              {/* Task bar */}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn("absolute h-6 rounded-md border cursor-pointer", statusColor)}
                                      style={{
                                        left: `${left}px`,
                                        width: `${width}px`,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                      }}
                                      onClick={() => onTaskClick?.(project.id, task.id)}
                                    >
                                      <div
                                        className="h-full bg-current opacity-20 rounded-md"
                                        style={{ width: `${task.progress}%` }}
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="space-y-1">
                                      <p className="font-medium">{task.name}</p>
                                      <p className="text-xs">
                                        {format(task.startDate, "MMM d")} - {format(task.endDate, "MMM d")}
                                      </p>
                                      <p className="text-xs">Progress: {task.progress}%</p>
                                      <Badge className={cn("mt-1", statusColor)}>{task.status}</Badge>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              {/* Milestones */}
                              {task.milestones?.map((milestone) => {
                                const milestoneLeft = getMilestonePosition(milestone.date)

                                if (milestoneLeft >= 0 && milestoneLeft <= visibleDays * CELL_WIDTH) {
                                  return (
                                    <TooltipProvider key={milestone.id}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div
                                            className={cn(
                                              "absolute transform -translate-x-1/2 -translate-y-1/2 z-20",
                                              "rounded-full border-2",
                                              milestone.completed
                                                ? "bg-green-600 border-green-700"
                                                : "bg-red-600 border-red-700",
                                            )}
                                            style={{
                                              left: `${milestoneLeft}px`,
                                              top: "50%",
                                              width: MILESTONE_SIZE,
                                              height: MILESTONE_SIZE,
                                            }}
                                          />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <div>
                                            <p className="font-medium">{milestone.name}</p>
                                            <p className="text-xs">{format(milestone.date, "MMM d, yyyy")}</p>
                                            <Badge className={milestone.completed ? "bg-green-600" : "bg-red-600"}>
                                              {milestone.completed ? "Completed" : "Pending"}
                                            </Badge>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )
                                }

                                return null
                              })}

                              {/* Today indicator */}
                              {differenceInDays(today, startDate) >= 0 &&
                                differenceInDays(today, startDate) <= visibleDays && (
                                  <div
                                    className="absolute top-0 bottom-0 border-l-2 border-primary z-10"
                                    style={{ left: `${differenceInDays(today, startDate) * CELL_WIDTH}px` }}
                                  />
                                )}
                            </div>
                          )
                        })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </Card>
  )
}
