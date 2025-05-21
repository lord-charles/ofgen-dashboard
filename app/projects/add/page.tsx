"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Plus, Save, Search, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { createProject } from "../../api/projects"

// Define the form schema with Zod
const inventoryUsageSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  itemName: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  dateUsed: z.date({ required_error: "Date used is required" }),
})

const riskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  level: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Open", "Closed"]),
  identifiedDate: z.date({ required_error: "Identified date is required" }),
  mitigationPlan: z.string().optional(),
  resolvedDate: z.date().optional().nullable(),
  owner: z.string().min(1, "Owner is required"),
})

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  assignedTo: z.string().min(1, "Assigned to is required"),
  dueDate: z.date({ required_error: "Due date is required" }),
  status: z.enum(["In Progress", "Completed", "Delayed"]),
  milestoneId: z.string().min(1, "Milestone ID is required"),
})

const formSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters" }),
  location: z.string().min(3, { message: "Location is required" }),
  county: z.string().min(1, { message: "County is required" }),
  capacity: z.string().min(1, { message: "Capacity is required" }),
  status: z.enum(["In Progress", "Completed", "On Hold"]),
  startDate: z.date({ required_error: "Start date is required" }),
  targetCompletionDate: z.date({ required_error: "Target completion date is required" }),
  actualCompletionDate: z.date().optional().nullable(),
  progress: z.coerce.number().min(0).max(100, { message: "Progress must be between 0 and 100" }),
  inventoryUsage: z.array(inventoryUsageSchema).optional().default([]),
  risks: z.array(riskSchema).optional().default([]),
  tasks: z.array(taskSchema).optional().default([]),
  users: z.array(z.string()).optional().default([]),
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
]

// Mock data for users
const USERS = [
  { id: "user1", name: "John Doe", role: "Project Manager" },
  { id: "user2", name: "Jane Smith", role: "Engineer" },
  { id: "user3", name: "Robert Johnson", role: "Technician" },
  { id: "user4", name: "Emily Williams", role: "Site Manager" },
  { id: "user5", name: "Michael Brown", role: "Contractor" },
]

// Mock data for milestones
const MILESTONES = [
  { id: "milestone1", title: "Site Assessment" },
  { id: "milestone2", title: "Permit Acquisition" },
  { id: "milestone3", title: "Material Procurement" },
  { id: "milestone4", title: "Installation" },
  { id: "milestone5", title: "Testing" },
]

// Mock data for inventory items
const INVENTORY_ITEMS = [
  { id: "INV001", name: "Solar Panel 250W", category: "Panels", stock: 120, unit: "piece" },
  { id: "INV002", name: "Solar Panel 300W", category: "Panels", stock: 85, unit: "piece" },
  { id: "INV003", name: "Solar Panel 350W", category: "Panels", stock: 50, unit: "piece" },
  { id: "INV004", name: "Inverter 3kW", category: "Inverters", stock: 30, unit: "piece" },
  { id: "INV005", name: "Inverter 5kW", category: "Inverters", stock: 25, unit: "piece" },
  { id: "INV006", name: "Battery 12V 100Ah", category: "Batteries", stock: 60, unit: "piece" },
  { id: "INV007", name: "Battery 12V 200Ah", category: "Batteries", stock: 45, unit: "piece" },
  { id: "INV008", name: "Mounting Bracket Type A", category: "Mounting", stock: 200, unit: "set" },
  { id: "INV009", name: "Mounting Bracket Type B", category: "Mounting", stock: 150, unit: "set" },
  { id: "INV010", name: "Solar Cable 4mm²", category: "Cables", stock: 500, unit: "meter" },
  { id: "INV011", name: "Solar Cable 6mm²", category: "Cables", stock: 400, unit: "meter" },
  { id: "INV012", name: "MC4 Connector", category: "Connectors", stock: 300, unit: "pair" },
  { id: "INV013", name: "DC Circuit Breaker 20A", category: "Protection", stock: 80, unit: "piece" },
  { id: "INV014", name: "AC Circuit Breaker 32A", category: "Protection", stock: 75, unit: "piece" },
  { id: "INV015", name: "Charge Controller 30A", category: "Controllers", stock: 40, unit: "piece" },
]

export default function AddProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      county: "",
      capacity: "",
      status: "In Progress",
      progress: 0,
      inventoryUsage: [],
      risks: [],
      tasks: [],
      users: [],
    },
  })

  // Set up field arrays for dynamic sections
  const {
    fields: inventoryFields,
    append: appendInventory,
    remove: removeInventory,
  } = useFieldArray({
    control: form.control,
    name: "inventoryUsage",
  })

  const {
    fields: riskFields,
    append: appendRisk,
    remove: removeRisk,
  } = useFieldArray({
    control: form.control,
    name: "risks",
  })

  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    control: form.control,
    name: "tasks",
  })

  const {
    fields: userFields,
    append: appendUser,
    remove: removeUser,
  } = useFieldArray({
    control: form.control,
    name: "users",
  })

  // Filter inventory items based on search term
  const filteredInventoryItems = INVENTORY_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      await createProject(values)
      toast({
        title: "Project created successfully",
        description: `Project \"${values.name}\" has been added to the system.`,
      })
      router.push("/projects")
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error?.message || "There was an error creating the project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add inventory item from search
  const handleAddInventoryItem = (item: (typeof INVENTORY_ITEMS)[0]) => {
    appendInventory({
      itemId: item.id,
      itemName: item.name,
      quantity: 1,
      dateUsed: new Date(),
    })
    setSearchTerm("")
    setIsSearchOpen(false)
    toast({
      title: "Item added",
      description: `${item.name} has been added to the project inventory.`,
    })
  }

  // Check if an item is already added to inventory
  const isItemAlreadyAdded = (itemId: string) => {
    return form.getValues("inventoryUsage").some((item) => item.itemId === itemId)
  }

  // Add new risk
  const handleAddRisk = () => {
    appendRisk({
      title: "",
      description: "",
      level: "Medium",
      status: "Open",
      identifiedDate: new Date(),
      mitigationPlan: "",
      resolvedDate: null,
      owner: "",
    })
    setActiveTab("risks")
  }

  // Add new task
  const handleAddTask = () => {
    appendTask({
      title: "",
      description: "",
      assignedTo: "",
      dueDate: new Date(),
      status: "In Progress",
      milestoneId: "",
    })
    setActiveTab("tasks")
  }

  // Add new user
  const handleAddUser = () => {
    appendUser("")
    setActiveTab("team")
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Usage</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Enter the basic information about the solar installation project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Nairobi Solar Project 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a county" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COUNTIES.map((county) => (
                                <SelectItem key={county} value={county}>
                                  {county}
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
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="On Hold">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="progress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Progress (%)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="actualCompletionDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Actual Completion Date</FormLabel>
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
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date (optional)</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Only required for completed projects</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button type="button" variant="outline" onClick={() => router.push("/projects")}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("inventory")}>
                    Next: Inventory Usage
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Inventory Usage Tab */}
            <TabsContent value="inventory" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Usage</CardTitle>
                  <CardDescription>Add inventory items used in this project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search and Add Inventory */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                        <PopoverTrigger asChild>
                          <div className="flex">
                            <div className="relative flex-1">
                              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search inventory items..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchOpen(true)}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="secondary"
                              className="ml-2"
                              onClick={() => setIsSearchOpen(true)}
                            >
                              Browse
                            </Button>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search inventory..."
                              value={searchTerm}
                              onValueChange={setSearchTerm}
                            />
                            <CommandList>
                              <CommandEmpty>No items found.</CommandEmpty>
                              <CommandGroup heading="Inventory Items">
                                <ScrollArea className="h-[300px]">
                                  {filteredInventoryItems.map((item) => {
                                    const isAdded = isItemAlreadyAdded(item.id)
                                    return (
                                      <CommandItem
                                        key={item.id}
                                        onSelect={() => {
                                          if (!isAdded) {
                                            handleAddInventoryItem(item)
                                          } else {
                                            toast({
                                              title: "Item already added",
                                              description: "This item is already in your project inventory.",
                                            })
                                          }
                                        }}
                                        disabled={isAdded}
                                        className={cn(
                                          "flex items-center justify-between",
                                          isAdded && "opacity-50 cursor-not-allowed",
                                        )}
                                      >
                                        <div className="flex flex-col">
                                          <span className="font-medium">
                                            {item.name} <span className="text-muted-foreground">({item.id})</span>
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            {item.category} • {item.stock} in stock • {item.unit}
                                          </span>
                                        </div>
                                        {isAdded ? (
                                          <Badge variant="outline" className="ml-2">
                                            Added
                                          </Badge>
                                        ) : (
                                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </CommandItem>
                                    )
                                  })}
                                </ScrollArea>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Search by item ID, name, or category. Click on an item to add it to your project.
                    </div>
                  </div>

                  {/* Selected Inventory Items */}
                  <div className="border rounded-md">
                    <div className="bg-muted px-4 py-2 rounded-t-md border-b">
                      <h3 className="font-medium">Selected Inventory Items</h3>
                    </div>
                    <ScrollArea className="h-[350px]">
                      {inventoryFields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                          <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                            <Search className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <h3 className="font-medium mb-1">No items added yet</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Search and select items from the inventory to add them to your project.
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y">
                          {inventoryFields.map((field, index) => {
                            const item = INVENTORY_ITEMS.find((i) => i.id === field.itemId)
                            return (
                              <div key={field.id} className="p-4 hover:bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <Badge variant="outline" className="mr-2">
                                      {field.itemId}
                                    </Badge>
                                    <h4 className="font-medium">{field.itemName}</h4>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => removeInventory(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`inventoryUsage.${index}.quantity`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                          <div className="flex">
                                            <Input
                                              type="number"
                                              min="1"
                                              max={item?.stock || 999}
                                              {...field}
                                              className="w-full"
                                            />
                                            <div className="flex items-center bg-muted px-3 rounded-r-md border border-l-0 border-input">
                                              {item?.unit || "pcs"}
                                            </div>
                                          </div>
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                          {item ? `${item.stock} available in stock` : ""}
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`inventoryUsage.${index}.dateUsed`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-col">
                                        <FormLabel>Date Used</FormLabel>
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
                                            />
                                          </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </div>

                  {/* Summary */}
                  {inventoryFields.length > 0 && (
                    <div className="bg-muted/30 rounded-md p-4 border">
                      <h3 className="font-medium mb-2">Inventory Summary</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Total Items: {inventoryFields.length}</div>
                        <div>
                          Total Quantity:{" "}
                          {form
                            .getValues("inventoryUsage")
                            .reduce((sum, item) => sum + (item.quantity || 0), 0)
                            .toString()}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("risks")}>
                    Next: Risks
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Risks Tab */}
            <TabsContent value="risks" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Project Risks</CardTitle>
                    <CardDescription>Add potential risks for this project</CardDescription>
                  </div>
                  <Button onClick={handleAddRisk}>
                    <Plus className="mr-2 h-4 w-4" /> Add Risk
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {riskFields.length === 0 ? (
                      <div className="text-center py-8 border rounded-md bg-muted/20">
                        <p className="text-muted-foreground">No risks added yet.</p>
                        <Button variant="outline" className="mt-4" onClick={handleAddRisk}>
                          <Plus className="mr-2 h-4 w-4" /> Add Risk
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {riskFields.map((field, index) => (
                          <Card key={field.id} className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={() => removeRisk(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <CardHeader>
                              <CardTitle className="text-base">Risk {index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`risks.${index}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`risks.${index}.owner`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Risk Owner</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`risks.${index}.description`}
                                render={({ field }) => (
                                  <FormItem className="col-span-2">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`risks.${index}.level`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Risk Level</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`risks.${index}.status`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Open">Open</SelectItem>
                                        <SelectItem value="Closed">Closed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`risks.${index}.identifiedDate`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Identified Date</FormLabel>
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
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`risks.${index}.resolvedDate`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Resolved Date</FormLabel>
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
                                            {field.value ? (
                                              format(field.value, "PPP")
                                            ) : (
                                              <span>Pick a date (optional)</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={field.value || undefined}
                                          onSelect={field.onChange}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormDescription>Only required for closed risks</FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`risks.${index}.mitigationPlan`}
                                render={({ field }) => (
                                  <FormItem className="col-span-2">
                                    <FormLabel>Mitigation Plan</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("inventory")}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("tasks")}>
                    Next: Tasks
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Project Tasks</CardTitle>
                    <CardDescription>Add tasks for this project</CardDescription>
                  </div>
                  <Button onClick={handleAddTask}>
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {taskFields.length === 0 ? (
                      <div className="text-center py-8 border rounded-md bg-muted/20">
                        <p className="text-muted-foreground">No tasks added yet.</p>
                        <Button variant="outline" className="mt-4" onClick={handleAddTask}>
                          <Plus className="mr-2 h-4 w-4" /> Add Task
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {taskFields.map((field, index) => (
                          <Card key={field.id} className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={() => removeTask(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <CardHeader>
                              <CardTitle className="text-base">Task {index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`tasks.${index}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`tasks.${index}.assignedTo`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Assigned To</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`tasks.${index}.description`}
                                render={({ field }) => (
                                  <FormItem className="col-span-2">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`tasks.${index}.milestoneId`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Related Milestone</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select milestone" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {MILESTONES.map((milestone) => (
                                          <SelectItem key={milestone.id} value={milestone.id}>
                                            {milestone.title}
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
                                name={`tasks.${index}.status`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Delayed">Delayed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`tasks.${index}.dueDate`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Due Date</FormLabel>
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
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("risks")}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("team")}>
                    Next: Team
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Project Team</CardTitle>
                    <CardDescription>Assign team members to this project</CardDescription>
                  </div>
                  <Button onClick={handleAddUser}>
                    <Plus className="mr-2 h-4 w-4" /> Add Team Member
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    {userFields.length === 0 ? (
                      <div className="text-center py-8 border rounded-md bg-muted/20">
                        <p className="text-muted-foreground">No team members added yet.</p>
                        <Button variant="outline" className="mt-4" onClick={handleAddUser}>
                          <Plus className="mr-2 h-4 w-4" /> Add Team Member
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userFields.map((field, index) => (
                          <div key={field.id} className="flex items-center gap-2">
                            <FormField
                              control={form.control}
                              name={`users.${index}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select team member" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {USERS.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                          {user.name} - {user.role}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeUser(index)}
                              className="flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Team Members Preview</h3>
                      <div className="space-y-2">
                        {form.watch("users").map((userId, index) => {
                          const user = USERS.find((u) => u.id === userId)
                          if (!user) return null

                          return (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.role}</p>
                              </div>
                              <Badge className="ml-auto">{user.role}</Badge>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("tasks")}>
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

      {/* Summary Panel */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Project Summary</CardTitle>
          <CardDescription>Overview of your project information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2">Basic Information</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Name:</span> {form.watch("name") || "Not set"}
                </p>
                <p>
                  <span className="text-muted-foreground">Location:</span> {form.watch("location") || "Not set"}
                </p>
                <p>
                  <span className="text-muted-foreground">County:</span> {form.watch("county") || "Not set"}
                </p>
                <p>
                  <span className="text-muted-foreground">Capacity:</span> {form.watch("capacity") || "Not set"}
                </p>
                <p>
                  <span className="text-muted-foreground">Status:</span> {form.watch("status") || "Not set"}
                </p>
                <p>
                  <span className="text-muted-foreground">Progress:</span> {form.watch("progress") || "0"}%
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Items & Tasks</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Inventory Items:</span> {inventoryFields.length}
                </p>
                <p>
                  <span className="text-muted-foreground">Risks:</span> {riskFields.length}
                </p>
                <p>
                  <span className="text-muted-foreground">Tasks:</span> {taskFields.length}
                </p>
                <p>
                  <span className="text-muted-foreground">Team Members:</span> {userFields.length}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Timeline</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Start Date:</span>{" "}
                  {form.watch("startDate") ? format(form.watch("startDate"), "PPP") : "Not set"}
                </p>
                <p>
                  <span className="text-muted-foreground">Target Completion:</span>{" "}
                  {form.watch("targetCompletionDate") ? format(form.watch("targetCompletionDate"), "PPP") : "Not set"}
                </p>
                <p>
                  <span className="text-muted-foreground">Actual Completion:</span>{" "}
                  {form.watch("actualCompletionDate") ? format(form.watch("actualCompletionDate"), "PPP") : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
