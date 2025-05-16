"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ArrowLeft,
  CalendarIcon,
  Save,
  Search,
  Plus,
  Trash2,
  AlertCircle,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Define site type with additional fields
type Site = {
  id: string
  name: string
  county: string
  address: string
  type: string // Added site type
  classification: string // Added classification
  contactName?: string // Added contact information
  contactPhone?: string
  contactEmail?: string
  latitude: number
  longitude: number
}

// Define technician type
type Technician = {
  id: string
  name: string
  specialization: string
  availability: boolean
}

// Define inventory item type
type InventoryItem = {
  id: string
  name: string
  category: string
  unitCost: number // Selling price
  buyingPrice: number // Buying price
  quantity: number
  specifications?: string // Added specifications
}

// Define user type for issuer
type Issuer = {
  id: string
  name: string
  role: string
  email: string
}

// Mock sites data with additional fields
const MOCK_SITES: Site[] = [
  {
    id: "SITE-1001",
    name: "Nairobi Solar Site 1",
    county: "Nairobi",
    address: "123 Solar Avenue, Nairobi",
    type: "Commercial",
    classification: "Tier 1",
    contactName: "John Kamau",
    contactPhone: "+254 712 345 678",
    contactEmail: "john.kamau@example.com",
    latitude: -1.2921,
    longitude: 36.8219,
  },
  {
    id: "SITE-1002",
    name: "Mombasa Solar Site 1",
    county: "Mombasa",
    address: "45 Beach Road, Mombasa",
    type: "Residential",
    classification: "Tier 2",
    contactName: "Sarah Odhiambo",
    contactPhone: "+254 723 456 789",
    contactEmail: "sarah.o@example.com",
    latitude: -4.0435,
    longitude: 39.6682,
  },
  {
    id: "SITE-1003",
    name: "Kisumu Solar Site 1",
    county: "Kisumu",
    address: "78 Lake Street, Kisumu",
    type: "Industrial",
    classification: "Tier 1",
    contactName: "David Otieno",
    contactPhone: "+254 734 567 890",
    contactEmail: "david.o@example.com",
    latitude: -0.1022,
    longitude: 34.7617,
  },
  {
    id: "SITE-1004",
    name: "Nakuru Solar Site 1",
    county: "Nakuru",
    address: "90 Crater Road, Nakuru",
    type: "Commercial",
    classification: "Tier 3",
    contactName: "Mary Wanjiku",
    contactPhone: "+254 745 678 901",
    contactEmail: "mary.w@example.com",
    latitude: -0.3031,
    longitude: 36.08,
  },
  {
    id: "SITE-1005",
    name: "Eldoret Solar Site 1",
    county: "Uasin Gishu",
    address: "12 Highland Avenue, Eldoret",
    type: "Residential",
    classification: "Tier 2",
    contactName: "Peter Kipchoge",
    contactPhone: "+254 756 789 012",
    contactEmail: "peter.k@example.com",
    latitude: 0.5143,
    longitude: 35.2698,
  },
]

// Mock technicians data
const MOCK_TECHNICIANS: Technician[] = [
  { id: "TECH-001", name: "John Doe", specialization: "Installation & Maintenance", availability: true },
  { id: "TECH-002", name: "Jane Smith", specialization: "Repairs & Troubleshooting", availability: true },
  { id: "TECH-003", name: "David Mwangi", specialization: "Installation", availability: false },
  { id: "TECH-004", name: "Sarah Ochieng", specialization: "Maintenance & Inspection", availability: true },
  { id: "TECH-005", name: "Michael Kamau", specialization: "Repairs", availability: true },
]

// Mock inventory items with specifications
const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "INV-1001",
    name: "Solar Panel 250W",
    category: "Solar Panels",
    unitCost: 15000,
    buyingPrice: 12000,
    quantity: 25,
    specifications: "Monocrystalline, 250W, 24V, Efficiency: 21%, Dimensions: 1650x992x35mm",
  },
  {
    id: "INV-1002",
    name: "Inverter 3kW",
    category: "Inverters",
    unitCost: 45000,
    buyingPrice: 38000,
    quantity: 12,
    specifications: "Pure Sine Wave, 3kW, 48V, MPPT, Efficiency: 97%, LCD Display",
  },
  {
    id: "INV-1003",
    name: "Battery 12V 200Ah",
    category: "Batteries",
    unitCost: 32000,
    buyingPrice: 26000,
    quantity: 18,
    specifications: "Lithium Iron Phosphate, 12V, 200Ah, 2400Wh, Cycle Life: 4000 cycles",
  },
  {
    id: "INV-1004",
    name: "Mounting Bracket",
    category: "Mounting Systems",
    unitCost: 4500,
    buyingPrice: 3200,
    quantity: 40,
    specifications: "Aluminum, Adjustable Tilt: 10-60°, Wind Resistance: 60m/s",
  },
  {
    id: "INV-1005",
    name: "Solar Cable 10m",
    category: "Cables & Wiring",
    unitCost: 2500,
    buyingPrice: 1800,
    quantity: 60,
    specifications: "6mm², Double Insulated, UV Resistant, Temperature Range: -40°C to +90°C",
  },
  {
    id: "INV-1006",
    name: "MC4 Connector Pair",
    category: "Connectors",
    unitCost: 800,
    buyingPrice: 500,
    quantity: 100,
    specifications: "IP67 Waterproof, 30A, 1000V DC, TÜV Certified",
  },
  {
    id: "INV-1007",
    name: "Charge Controller 30A",
    category: "Controllers",
    unitCost: 12000,
    buyingPrice: 9500,
    quantity: 15,
    specifications: "MPPT, 30A, 12/24V Auto, LCD Display, Max PV Input: 150V",
  },
  {
    id: "INV-1008",
    name: "Junction Box",
    category: "Accessories",
    unitCost: 3500,
    buyingPrice: 2500,
    quantity: 30,
    specifications: "IP65 Waterproof, 4-Way, UV Resistant, Pre-wired",
  },
  {
    id: "INV-1009",
    name: "Fuse 15A",
    category: "Accessories",
    unitCost: 500,
    buyingPrice: 300,
    quantity: 50,
    specifications: "15A, 1000V DC, gPV Type, 10x38mm",
  },
  {
    id: "INV-1010",
    name: "Grounding Kit",
    category: "Installation",
    unitCost: 6000,
    buyingPrice: 4500,
    quantity: 20,
    specifications: "Copper Wire 6mm², Ground Rod 1.2m, Clamps and Connectors Included",
  },
  {
    id: "INV-1011",
    name: "Rectifier 48V 50A",
    category: "Power Systems",
    unitCost: 35000,
    buyingPrice: 28000,
    quantity: 8,
    specifications: "Input: 180-264VAC, Output: 48VDC, 50A, Efficiency: 96%, Hot-swappable",
  },
  {
    id: "INV-1012",
    name: "Battery Monitor",
    category: "Monitoring",
    unitCost: 8500,
    buyingPrice: 6800,
    quantity: 15,
    specifications: "Bluetooth, App Control, SOC Display, Voltage Range: 8-70V",
  },
]

// Mock users for issuer selection
const MOCK_USERS: Issuer[] = [
  { id: "USER-001", name: "James Mwangi", role: "Project Manager", email: "james.m@ofgen.co.ke" },
  { id: "USER-002", name: "Lucy Njeri", role: "Sales Manager", email: "lucy.n@ofgen.co.ke" },
  { id: "USER-003", name: "Robert Ouko", role: "Technical Lead", email: "robert.o@ofgen.co.ke" },
  { id: "USER-004", name: "Elizabeth Wambui", role: "Operations Manager", email: "elizabeth.w@ofgen.co.ke" },
]

export default function CreateServiceOrderPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inventorySearch, setInventorySearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [currentDate] = useState(new Date())

  // Form state
  const [formData, setFormData] = useState({
    // General Information
    title: "",
    issuerId: "",
    siteId: "",
    type: "",
    priority: "Medium",
    description: "",
    scheduledDate: new Date(),
    technicianId: "",

    // Site and Design Specifics
    existingPowerSetup: "",
    proposedPowerSetup: "",
    energyDemand: 0,
    solarCapacity: 0,
    batteryCapacity: 0,
    rectifierDetails: "",
    estimatedSolarProduction: 0,

    // Labor and Costs
    estimatedHours: 4,
    laborRate: 3500,
    travelCost: 7500,
    otherCosts: 2000,
    overheadCosts: 5000, // Added overhead costs
    notes: "",
    selectedParts: [] as { id: string; quantity: number }[],
  })

  // Get unique categories for filter
  const categories = Array.from(new Set(MOCK_INVENTORY.map((item) => item.category)))

  // Filter inventory items based on search query and category filter
  const filteredInventory = MOCK_INVENTORY.filter((item) => {
    // Search filter
    const matchesSearch =
      inventorySearch === "" ||
      item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.id.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      item.category.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      (item.specifications && item.specifications.toLowerCase().includes(inventorySearch.toLowerCase()))

    // Category filter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Selected parts with details
  const selectedPartsWithDetails = formData.selectedParts.map((selectedPart) => {
    const inventoryItem = MOCK_INVENTORY.find((item) => item.id === selectedPart.id)
    return {
      ...selectedPart,
      name: inventoryItem?.name || "Unknown Item",
      category: inventoryItem?.category || "Unknown Category",
      specifications: inventoryItem?.specifications || "",
      unitCost: inventoryItem?.unitCost || 0,
      buyingPrice: inventoryItem?.buyingPrice || 0,
    }
  })

  // Calculate estimated costs
  const calculateEstimatedCosts = () => {
    // Calculate revenue based on selling price (unitCost)
    const partsRevenue = selectedPartsWithDetails.reduce((sum, part) => sum + part.quantity * part.unitCost, 0)

    // Calculate actual cost based on buying price
    const partsCost = selectedPartsWithDetails.reduce((sum, part) => sum + part.quantity * part.buyingPrice, 0)

    const laborCost = formData.estimatedHours * formData.laborRate
    const totalCost = partsCost + laborCost + formData.travelCost + formData.otherCosts + formData.overheadCosts

    // Estimate invoice amount based on selling prices plus labor and other costs
    const estimatedInvoice =
      partsRevenue + laborCost + formData.travelCost + formData.otherCosts + formData.overheadCosts

    return {
      partsRevenue,
      partsCost,
      laborCost,
      totalCost,
      estimatedInvoice,
      estimatedProfit: estimatedInvoice - totalCost,
      estimatedMargin: estimatedInvoice > 0 ? (estimatedInvoice - totalCost) / estimatedInvoice : 0,
    }
  }

  const costs = calculateEstimatedCosts()

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, scheduledDate: date }))
    }
  }

  // Handle number input changes
  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  // Handle adding a part
  const handleAddPart = (partId: string) => {
    const inventoryItem = MOCK_INVENTORY.find((item) => item.id === partId)
    if (!inventoryItem) return

    // Check if part already exists in the list
    const existingPartIndex = formData.selectedParts.findIndex((part) => part.id === partId)

    if (existingPartIndex >= 0) {
      // Update quantity if part already exists
      const updatedParts = [...formData.selectedParts]
      updatedParts[existingPartIndex].quantity += 1

      setFormData((prev) => ({
        ...prev,
        selectedParts: updatedParts,
      }))
    } else {
      // Add new part
      setFormData((prev) => ({
        ...prev,
        selectedParts: [...prev.selectedParts, { id: partId, quantity: 1 }],
      }))
    }
  }

  // Handle removing a part
  const handleRemovePart = (partId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedParts: prev.selectedParts.filter((part) => part.id !== partId),
    }))
  }

  // Handle part quantity change
  const handlePartQuantityChange = (partId: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedParts: prev.selectedParts.map((part) => (part.id === partId ? { ...part, quantity } : part)),
    }))
  }

  // Handle site selection and auto-populate site details
  const handleSiteSelection = (siteId: string) => {
    const selectedSite = MOCK_SITES.find((site) => site.id === siteId)
    if (selectedSite) {
      setFormData((prev) => ({
        ...prev,
        siteId: siteId,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.siteId || !formData.type || !formData.technicianId || !formData.issuerId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Service Order Created",
        description: "The service order has been created successfully.",
      })
      setIsSubmitting(false)
      router.push("/service-orders")
    }, 1500)
  }

  // Get selected site details
  const selectedSite = MOCK_SITES.find((site) => site.id === formData.siteId)

  // Get selected technician details
  const selectedTechnician = MOCK_TECHNICIANS.find((tech) => tech.id === formData.technicianId)

  // Get selected issuer details
  const selectedIssuer = MOCK_USERS.find((user) => user.id === formData.issuerId)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Create Service Order</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/service-orders")}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Order
                </>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="general">General Information</TabsTrigger>
              <TabsTrigger value="site">Site & Design</TabsTrigger>
              <TabsTrigger value="materials">Bill of Materials</TabsTrigger>
              <TabsTrigger value="costs">Costs & Notes</TabsTrigger>
            </TabsList>

            {/* General Information Tab */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                  <CardDescription>Basic details about this service order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Service Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Enter service title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">
                        Service Type <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Installation">Installation</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                          <SelectItem value="Repair">Repair</SelectItem>
                          <SelectItem value="Inspection">Inspection</SelectItem>
                          <SelectItem value="Upgrade">Upgrade</SelectItem>
                          <SelectItem value="Consultation">Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="issuerId">
                        Issuer <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.issuerId}
                        onValueChange={(value) => handleSelectChange("issuerId", value)}
                      >
                        <SelectTrigger id="issuerId">
                          <SelectValue placeholder="Select issuer" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_USERS.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} - {user.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.scheduledDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.scheduledDate}
                            onSelect={handleDateChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter service description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleSelectChange("priority", value)}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technicianId">
                        Technician <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.technicianId}
                        onValueChange={(value) => handleSelectChange("technicianId", value)}
                      >
                        <SelectTrigger id="technicianId">
                          <SelectValue placeholder="Assign technician" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_TECHNICIANS.map((tech) => (
                            <SelectItem key={tech.id} value={tech.id} disabled={!tech.availability}>
                              {tech.name} - {tech.specialization} {!tech.availability && "(Unavailable)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {selectedTechnician && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <div className="text-sm font-medium">Technician Details</div>
                      <div className="text-sm">Specialization: {selectedTechnician.specialization}</div>
                      <div className={`text-sm ${selectedTechnician.availability ? "text-green-600" : "text-red-600"}`}>
                        {selectedTechnician.availability ? "Available" : "Not Available"}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Site Selection</CardTitle>
                  <CardDescription>Select the site for this service order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteId">
                      Site <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.siteId} onValueChange={(value) => handleSiteSelection(value)}>
                      <SelectTrigger id="siteId">
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_SITES.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            {site.name} ({site.county})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSite && (
                    <div className="mt-2 p-4 bg-muted rounded-md space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="font-medium flex items-center mb-2">
                            <MapPin className="h-4 w-4 mr-2" />
                            Site Details
                          </h3>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="text-muted-foreground">Address:</span> {selectedSite.address}
                            </div>
                            <div>
                              <span className="text-muted-foreground">County:</span> {selectedSite.county}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Type:</span> {selectedSite.type}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Classification:</span>{" "}
                              {selectedSite.classification}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Coordinates:</span>{" "}
                              {selectedSite.latitude.toFixed(6)}, {selectedSite.longitude.toFixed(6)}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium flex items-center mb-2">
                            <User className="h-4 w-4 mr-2" />
                            Contact Information
                          </h3>
                          <div className="space-y-1 text-sm">
                            {selectedSite.contactName && (
                              <div>
                                <span className="text-muted-foreground">Contact:</span> {selectedSite.contactName}
                              </div>
                            )}
                            {selectedSite.contactPhone && (
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                <span>{selectedSite.contactPhone}</span>
                              </div>
                            )}
                            {selectedSite.contactEmail && (
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                <span>{selectedSite.contactEmail}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Site & Design Tab */}
            <TabsContent value="site" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Power Setup</CardTitle>
                  <CardDescription>Details about existing and proposed power systems</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="existingPowerSetup">Existing Power Setup</Label>
                      <Textarea
                        id="existingPowerSetup"
                        name="existingPowerSetup"
                        placeholder="Describe the current power setup at the site"
                        value={formData.existingPowerSetup}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="proposedPowerSetup">Proposed Power Setup</Label>
                      <Textarea
                        id="proposedPowerSetup"
                        name="proposedPowerSetup"
                        placeholder="Describe the proposed power setup for the site"
                        value={formData.proposedPowerSetup}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Energy Requirements</CardTitle>
                  <CardDescription>Specify energy demand and system capacities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="energyDemand">Energy Demand (kWh/day)</Label>
                      <Input
                        id="energyDemand"
                        name="energyDemand"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.energyDemand || ""}
                        onChange={(e) => handleNumberChange("energyDemand", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="solarCapacity">Solar Capacity (kWp)</Label>
                      <Input
                        id="solarCapacity"
                        name="solarCapacity"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.solarCapacity || ""}
                        onChange={(e) => handleNumberChange("solarCapacity", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
                      <Input
                        id="batteryCapacity"
                        name="batteryCapacity"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.batteryCapacity || ""}
                        onChange={(e) => handleNumberChange("batteryCapacity", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="rectifierDetails">Rectifier Details</Label>
                      <Input
                        id="rectifierDetails"
                        name="rectifierDetails"
                        placeholder="Specify rectifier model, capacity, etc."
                        value={formData.rectifierDetails}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estimatedSolarProduction">Estimated Solar Production (kWh/day)</Label>
                      <Input
                        id="estimatedSolarProduction"
                        name="estimatedSolarProduction"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="0.0"
                        value={formData.estimatedSolarProduction || ""}
                        onChange={(e) => handleNumberChange("estimatedSolarProduction", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bill of Materials Tab */}
            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bill of Materials</CardTitle>
                  <CardDescription>Select parts and materials needed for this service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search inventory items by name, ID, category or specifications..."
                          value={inventorySearch}
                          onChange={(e) => setInventorySearch(e.target.value)}
                          className="flex-1"
                        />
                      </div>

                      <div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Inventory Items Panel */}
                      <div className="border rounded-md">
                        <div className="p-3 border-b bg-muted">
                          <h3 className="font-medium">Available Inventory Items</h3>
                          <p className="text-sm text-muted-foreground">Click on an item to add it to your order</p>
                        </div>
                        <ScrollArea className="h-[400px]">
                          <div className="p-2 space-y-2">
                            {filteredInventory.length > 0 ? (
                              filteredInventory.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between items-center p-3 border rounded-md hover:bg-muted cursor-pointer"
                                  onClick={() => handleAddPart(item.id)}
                                >
                                  <div className="flex-1">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">{item.category}</div>
                                    {item.specifications && (
                                      <div className="text-xs text-muted-foreground mt-1">{item.specifications}</div>
                                    )}
                                  </div>
                                  <div className="text-right ml-4">
                                    <div>{item.unitCost.toLocaleString()} KSH</div>
                                    <div className="text-sm text-muted-foreground">Stock: {item.quantity}</div>
                                    <Button size="sm" variant="ghost" className="h-7 mt-1">
                                      <Plus className="h-4 w-4 mr-1" /> Add
                                    </Button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                                <AlertCircle className="h-8 w-8 mb-2" />
                                <p>No items found matching your search criteria.</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Selected Items Panel */}
                      <div className="border rounded-md">
                        <div className="p-3 border-b bg-muted">
                          <h3 className="font-medium">Selected Items</h3>
                          <p className="text-sm text-muted-foreground">Items added to this service order</p>
                        </div>
                        <div className="p-2">
                          {selectedPartsWithDetails.length > 0 ? (
                            <div className="space-y-3">
                              {selectedPartsWithDetails.map((part) => (
                                <div key={part.id} className="flex justify-between items-center p-3 border rounded-md">
                                  <div className="flex-1">
                                    <div className="font-medium">{part.name}</div>
                                    <div className="text-sm text-muted-foreground">{part.category}</div>
                                    {part.specifications && (
                                      <div className="text-xs text-muted-foreground mt-1">{part.specifications}</div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                      <Label htmlFor={`quantity-${part.id}`} className="sr-only">
                                        Quantity
                                      </Label>
                                      <Input
                                        id={`quantity-${part.id}`}
                                        type="number"
                                        min="1"
                                        value={part.quantity}
                                        onChange={(e) =>
                                          handlePartQuantityChange(part.id, Number.parseInt(e.target.value) || 1)
                                        }
                                        className="w-16 h-8"
                                      />
                                    </div>
                                    <div className="text-right min-w-[100px]">
                                      <div>{(part.unitCost * part.quantity).toLocaleString()} KSH</div>
                                      <div className="text-sm text-muted-foreground">
                                        {part.quantity} × {part.unitCost.toLocaleString()} KSH
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleRemovePart(part.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}

                              <div className="mt-4 p-3 border rounded-md bg-muted">
                                <div className="flex justify-between font-medium">
                                  <span>Total Items:</span>
                                  <span>
                                    {selectedPartsWithDetails.length} items (
                                    {selectedPartsWithDetails.reduce((sum, part) => sum + part.quantity, 0)} units)
                                  </span>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span>Total Revenue:</span>
                                  <span>{costs.partsRevenue.toLocaleString()} KSH</span>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span>Total Cost:</span>
                                  <span>{costs.partsCost.toLocaleString()} KSH</span>
                                </div>
                                <div className="flex justify-between mt-1 text-green-600 font-medium">
                                  <span>Profit:</span>
                                  <span>{(costs.partsRevenue - costs.partsCost).toLocaleString()} KSH</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                              <p>No items added yet. Select items from the inventory list.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Costs & Notes Tab */}
            <TabsContent value="costs" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Labor & Additional Costs</CardTitle>
                  <CardDescription>Estimate labor and other costs for this service</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="estimatedHours">Estimated Labor Hours</Label>
                        <Input
                          id="estimatedHours"
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={formData.estimatedHours}
                          onChange={(e) => handleNumberChange("estimatedHours", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="laborRate">Labor Rate (KSH/hour)</Label>
                        <Input
                          id="laborRate"
                          type="number"
                          min="0"
                          step="100"
                          value={formData.laborRate}
                          onChange={(e) => handleNumberChange("laborRate", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="travelCost">Travel Cost (KSH)</Label>
                        <Input
                          id="travelCost"
                          type="number"
                          min="0"
                          step="100"
                          value={formData.travelCost}
                          onChange={(e) => handleNumberChange("travelCost", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="otherCosts">Other Costs (KSH)</Label>
                        <Input
                          id="otherCosts"
                          type="number"
                          min="0"
                          step="100"
                          value={formData.otherCosts}
                          onChange={(e) => handleNumberChange("otherCosts", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="overheadCosts">Overhead Costs (KSH)</Label>
                        <Input
                          id="overheadCosts"
                          type="number"
                          min="0"
                          step="100"
                          value={formData.overheadCosts}
                          onChange={(e) => handleNumberChange("overheadCosts", e.target.value)}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="p-4 bg-muted rounded-md">
                      <h3 className="font-medium mb-3">Cost Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Parts Revenue:</span>
                          <span>{costs.partsRevenue.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Parts Cost (Buying Price):</span>
                          <span>{costs.partsCost.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>
                            Labor Cost ({formData.estimatedHours} hours @ {formData.laborRate.toLocaleString()}{" "}
                            KSH/hour):
                          </span>
                          <span>{costs.laborCost.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Travel Cost:</span>
                          <span>{formData.travelCost.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Other Costs:</span>
                          <span>{formData.otherCosts.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overhead Costs:</span>
                          <span>{formData.overheadCosts.toLocaleString()} KSH</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between pt-2 font-medium">
                          <span>Total Cost (Buying Price + Labor + Travel + Other + Overhead):</span>
                          <span>{costs.totalCost.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total Revenue (Selling Price + Labor + Travel + Other + Overhead):</span>
                          <span>{costs.estimatedInvoice.toLocaleString()} KSH</span>
                        </div>
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>Estimated Profit:</span>
                          <span>
                            {costs.estimatedProfit.toLocaleString()} KSH ({(costs.estimatedMargin * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                  <CardDescription>Add any additional information or instructions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Enter any additional notes or instructions for this service order..."
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="min-h-[200px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const tabs = ["general", "site", "materials", "costs"]
                const currentIndex = tabs.indexOf(activeTab)
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1])
                }
              }}
              disabled={activeTab === "general"}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const tabs = ["general", "site", "materials", "costs"]
                  const currentIndex = tabs.indexOf(activeTab)
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1])
                  }
                }}
                disabled={activeTab === "costs"}
              >
                Next
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
