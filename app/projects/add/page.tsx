"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, CheckCircle2, ChevronRight, MapPin, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters" }),
  location: z.string().min(3, { message: "Location is required" }),
  county: z.string().min(1, { message: "County is required" }),
  capacity: z.string().min(1, { message: "Capacity is required" }),
  status: z.enum(["Planned", "In Progress", "On Hold", "Completed"]),
  startDate: z.date({ required_error: "Start date is required" }),
  targetCompletionDate: z.date({ required_error: "Target completion date is required" }),
  description: z.string().optional(),
  clientName: z.string().min(1, { message: "Client name is required" }),
  clientContact: z.string().min(1, { message: "Client contact is required" }),
  budget: z.string().min(1, { message: "Budget is required" }),
  siteCoordinates: z.string().optional(),
  projectManager: z.string().min(1, { message: "Project manager is required" }),
  technicalLead: z.string().optional(),
})

// Mock data for counties in Kenya
const COUNTIES = [
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
  "Nyeri",
  "Turkana",
  "Garissa",
  "Bungoma",
  "Kajiado",
]

// Mock data for project managers
const PROJECT_MANAGERS = ["John Doe", "Jane Smith", "Robert Johnson", "Emily Williams", "Michael Brown"]

export default function AddProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      county: "",
      capacity: "",
      status: "Planned",
      description: "",
      clientName: "",
      clientContact: "",
      budget: "",
      siteCoordinates: "",
      projectManager: "",
      technicalLead: "",
    },
  })

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // In a real application, you would send this data to your API
      console.log("Form values:", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Project created successfully",
        description: `Project "${values.name}" has been added to the system.`,
      })

      // Navigate back to projects page
      router.push("/projects")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error creating project",
        description: "There was an error creating the project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Project</h1>
          <p className="text-muted-foreground">Create a new solar installation project</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/projects")}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? (
              <>Processing...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Project
              </>
            )}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="location">Location & Site</TabsTrigger>
              <TabsTrigger value="timeline">Timeline & Status</TabsTrigger>
              <TabsTrigger value="team">Team & Client</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Enter the basic information about the solar installation project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Nairobi Solar Project 1" {...field} />
                        </FormControl>
                        <FormDescription>A descriptive name for the project</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the project scope and objectives"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System Capacity</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <Input placeholder="e.g., 5.5" {...field} />
                              <div className="flex items-center bg-muted px-3 rounded-r-md border border-l-0 border-input">
                                kW
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Budget</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <div className="flex items-center bg-muted px-3 rounded-l-md border border-r-0 border-input">
                                KES
                              </div>
                              <Input placeholder="e.g., 750000" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <div></div>
                  <Button type="button" onClick={() => document.getElementById("location-tab")?.click()}>
                    Next: Location & Site
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Location Information</CardTitle>
                  <CardDescription>Specify the location details for the installation site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location/Address</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 123 Solar Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="county"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>County</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a county" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Counties</SelectLabel>
                                {COUNTIES.map((county) => (
                                  <SelectItem key={county} value={county}>
                                    {county}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="siteCoordinates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPS Coordinates (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input placeholder="e.g., -1.2921,36.8219" {...field} />
                            <Button
                              type="button"
                              variant="outline"
                              className="ml-2"
                              onClick={() => {
                                if (navigator.geolocation) {
                                  navigator.geolocation.getCurrentPosition(
                                    (position) => {
                                      const coords = `${position.coords.latitude},${position.coords.longitude}`
                                      form.setValue("siteCoordinates", coords)
                                    },
                                    (error) => {
                                      console.error("Error getting location:", error)
                                      toast({
                                        title: "Location Error",
                                        description: "Could not get your current location.",
                                        variant: "destructive",
                                      })
                                    },
                                  )
                                }
                              }}
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              Get Current
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>Enter the GPS coordinates for precise site location</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="h-[200px] rounded-md border border-dashed border-muted-foreground/50 flex items-center justify-center bg-muted/30">
                    <div className="text-center">
                      <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Map preview will be available after coordinates are entered
                      </p>
                      <Button type="button" variant="link" className="mt-2" onClick={() => router.push("/sites/add")}>
                        Add detailed site information
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button type="button" variant="outline" onClick={() => document.getElementById("basic-tab")?.click()}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => document.getElementById("timeline-tab")?.click()}>
                    Next: Timeline & Status
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                  <CardDescription>Set the timeline and current status of the project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetCompletionDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Target Completion Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => {
                                  const startDate = form.getValues("startDate")
                                  return startDate ? date < startDate : false
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Planned">Planned</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-md border p-4 bg-muted/30">
                    <h4 className="text-sm font-medium mb-2">Milestone Templates</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Standard milestones will be automatically created for this project after saving.
                    </p>
                    <div className="space-y-2">
                      {["Site Assessment", "Permit Acquisition", "Material Procurement", "Installation Start"].map(
                        (milestone) => (
                          <div key={milestone} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm">{milestone}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("location-tab")?.click()}
                  >
                    Back
                  </Button>
                  <Button type="button" onClick={() => document.getElementById("team-tab")?.click()}>
                    Next: Team & Client
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team & Client Information</CardTitle>
                  <CardDescription>Assign team members and enter client details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="projectManager"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Manager</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select project manager" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROJECT_MANAGERS.map((manager) => (
                                <SelectItem key={manager} value={manager}>
                                  {manager}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="technicalLead"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technical Lead (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select technical lead" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROJECT_MANAGERS.map((manager) => (
                                <SelectItem key={manager} value={manager}>
                                  {manager}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., ABC Corporation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., +254 712 345 678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="rounded-md border p-4 bg-muted/30">
                    <h4 className="text-sm font-medium mb-2">Team Assignment</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Additional team members can be assigned after project creation.
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={() => router.push("/users")}>
                      Manage Team Members
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("timeline-tab")?.click()}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Project
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
