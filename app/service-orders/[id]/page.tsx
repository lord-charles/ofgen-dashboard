"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Trash2,
  Plus,
  Save,
  Edit,
  X,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Define service order type
type ServiceOrder = {
  id: string
  title: string
  siteId: string
  siteName: string
  county: string
  type: "Installation" | "Maintenance" | "Repair" | "Inspection"
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "On Hold"
  priority: "Low" | "Medium" | "High" | "Critical"
  scheduledDate: string
  completedDate?: string
  technician: string
  technicianId: string
  description: string
  partsUsed: {
    id: string
    name: string
    quantity: number
    unitCost: number // Selling price
    buyingPrice: number // Buying price
  }[]
  laborHours: number
  laborRate: number
  travelCost: number
  otherCosts: number
  totalCost: number
  invoiceAmount: number
  profit: number
  profitMargin: number
  notes?: string
}

// Define inventory item type for selection
type InventoryItem = {
  id: string
  name: string
  category: string
  unitCost: number
  quantity: number
}

// Mock inventory items for selection
const MOCK_INVENTORY: InventoryItem[] = [
  { id: "INV-1001", name: "Solar Panel 250W", category: "Solar Panels", unitCost: 150, quantity: 25 },
  { id: "INV-1002", name: "Inverter 3kW", category: "Inverters", unitCost: 450, quantity: 12 },
  { id: "INV-1003", name: "Battery 12V 200Ah", category: "Batteries", unitCost: 320, quantity: 18 },
  { id: "INV-1004", name: "Mounting Bracket", category: "Mounting Systems", unitCost: 45, quantity: 40 },
  { id: "INV-1005", name: "Solar Cable 10m", category: "Cables & Wiring", unitCost: 25, quantity: 60 },
  { id: "INV-1006", name: "MC4 Connector Pair", category: "Connectors", unitCost: 8, quantity: 100 },
  { id: "INV-1007", name: "Charge Controller 30A", category: "Controllers", unitCost: 120, quantity: 15 },
  { id: "INV-1008", name: "Junction Box", category: "Accessories", unitCost: 35, quantity: 30 },
  { id: "INV-1009", name: "Fuse 15A", category: "Accessories", unitCost: 5, quantity: 50 },
  { id: "INV-1010", name: "Grounding Kit", category: "Installation", unitCost: 60, quantity: 20 },
]

export default function ServiceOrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [serviceOrder, setServiceOrder] = useState<ServiceOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)
  const [editedOrder, setEditedOrder] = useState<ServiceOrder | null>(null)
  const [showAddPartDialog, setShowAddPartDialog] = useState(false)
  const [selectedPart, setSelectedPart] = useState<string>("")
  const [partQuantity, setPartQuantity] = useState<number>(1)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch service order data
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll simulate with a timeout and mock data
    const fetchData = async () => {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock service order data
      const mockOrder: ServiceOrder = {
        id: params.id,
        title: "Maintenance - Nairobi Solar Site 12",
        siteId: "SITE-1012",
        siteName: "Nairobi Solar Site 12",
        county: "Nairobi",
        type: "Maintenance",
        status: "In Progress",
        priority: "Medium",
        scheduledDate: "2025-03-15",
        completedDate: undefined,
        technician: "John Doe",
        technicianId: "TECH-001",
        description: "Quarterly maintenance service for solar installation.",
        partsUsed: [
          { id: "INV-1001", name: "Solar Panel 250W", quantity: 1, unitCost: 150, buyingPrice: 120 },
          { id: "INV-1005", name: "Solar Cable 10m", quantity: 2, unitCost: 25, buyingPrice: 18 },
          { id: "INV-1006", name: "MC4 Connector Pair", quantity: 3, unitCost: 8, buyingPrice: 5 },
          { id: "INV-1009", name: "Fuse 15A", quantity: 2, unitCost: 5, buyingPrice: 3 },
        ],
        laborHours: 4,
        laborRate: 35,
        travelCost: 75,
        otherCosts: 20,
        totalCost: 0, // Will be calculated
        invoiceAmount: 450, // Initial invoice amount
        profit: 0, // Will be calculated
        profitMargin: 0, // Will be calculated
        notes:
          "Customer reported intermittent power issues. Will check all connections and replace any damaged components.",
      }

      // Calculate costs
      const partsSellPrice = mockOrder.partsUsed.reduce((sum, part) => sum + part.quantity * part.unitCost, 0)
      const partsBuyPrice = mockOrder.partsUsed.reduce((sum, part) => sum + part.quantity * part.buyingPrice, 0)
      const laborCost = mockOrder.laborHours * mockOrder.laborRate

      mockOrder.totalCost = partsBuyPrice + laborCost + mockOrder.travelCost + mockOrder.otherCosts
      mockOrder.profit = mockOrder.invoiceAmount - mockOrder.totalCost
      mockOrder.profitMargin = mockOrder.profit / mockOrder.invoiceAmount

      setServiceOrder(mockOrder)
      setEditedOrder(JSON.parse(JSON.stringify(mockOrder))) // Deep copy for editing
      setLoading(false)
    }

    fetchData()
  }, [params.id])

  // Calculate cost breakdown
  const calculateCostBreakdown = (order: ServiceOrder) => {
    const partsCost = order.partsUsed.reduce((sum, part) => sum + part.quantity * part.unitCost, 0)
    const laborCost = order.laborHours * order.laborRate

    return [
      { name: "Parts", value: partsCost, percentage: (partsCost / order.totalCost) * 100 },
      { name: "Labor", value: laborCost, percentage: (laborCost / order.totalCost) * 100 },
      { name: "Travel", value: order.travelCost, percentage: (order.travelCost / order.totalCost) * 100 },
      { name: "Other", value: order.otherCosts, percentage: (order.otherCosts / order.totalCost) * 100 },
    ]
  }

  // Get status badge color
  const getStatusBadgeColor = (status: ServiceOrder["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-600"
      case "In Progress":
        return "bg-blue-600"
      case "Scheduled":
        return "bg-amber-600"
      case "Cancelled":
        return "bg-red-600"
      case "On Hold":
        return "bg-slate-600"
      default:
        return "bg-slate-600"
    }
  }

  // Get priority badge color
  const getPriorityBadgeColor = (priority: ServiceOrder["priority"]) => {
    switch (priority) {
      case "Critical":
        return "bg-red-600"
      case "High":
        return "bg-orange-600"
      case "Medium":
        return "bg-amber-600"
      case "Low":
        return "bg-green-600"
      default:
        return "bg-slate-600"
    }
  }

  // Get profit status
  const getProfitStatus = (order: ServiceOrder) => {
    if (order.profitMargin >= 0.3) {
      return {
        color: "text-green-600",
        icon: <TrendingUp className="h-5 w-5 text-green-600" />,
        text: "High Profit Margin",
      }
    } else if (order.profitMargin >= 0.15) {
      return {
        color: "text-amber-600",
        icon: <TrendingUp className="h-5 w-5 text-amber-600" />,
        text: "Average Profit Margin",
      }
    } else if (order.profitMargin > 0) {
      return {
        color: "text-amber-600",
        icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
        text: "Low Profit Margin",
      }
    } else {
      return {
        color: "text-red-600",
        icon: <TrendingDown className="h-5 w-5 text-red-600" />,
        text: "Loss",
      }
    }
  }

  // Get technician initials for avatar
  const getTechnicianInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Handle adding a part
  const handleAddPart = () => {
    if (!selectedPart || partQuantity <= 0 || !editedOrder) return

    const inventoryItem = MOCK_INVENTORY.find((item) => item.id === selectedPart)
    if (!inventoryItem) return

    // Check if part already exists in the list
    const existingPartIndex = editedOrder.partsUsed.findIndex((part) => part.id === selectedPart)

    if (existingPartIndex >= 0) {
      // Update quantity if part already exists
      const updatedParts = [...editedOrder.partsUsed]
      updatedParts[existingPartIndex].quantity += partQuantity

      setEditedOrder({
        ...editedOrder,
        partsUsed: updatedParts,
      })
    } else {
      // Add new part
      setEditedOrder({
        ...editedOrder,
        partsUsed: [
          ...editedOrder.partsUsed,
          {
            id: inventoryItem.id,
            name: inventoryItem.name,
            quantity: partQuantity,
            unitCost: inventoryItem.unitCost,
            buyingPrice: 0, // TODO: Add buying price to inventory items
          },
        ],
      })
    }

    // Reset form and close dialog
    setSelectedPart("")
    setPartQuantity(1)
    setShowAddPartDialog(false)

    // Recalculate costs
    updateCosts()
  }

  // Handle removing a part
  const handleRemovePart = (partId: string) => {
    if (!editedOrder) return

    setEditedOrder({
      ...editedOrder,
      partsUsed: editedOrder.partsUsed.filter((part) => part.id !== partId),
    })

    // Recalculate costs
    updateCosts()
  }

  // Handle updating part quantity
  const handleUpdatePartQuantity = (partId: string, quantity: number) => {
    if (!editedOrder) return

    const updatedParts = editedOrder.partsUsed.map((part) => {
      if (part.id === partId) {
        return { ...part, quantity }
      }
      return part
    })

    setEditedOrder({
      ...editedOrder,
      partsUsed: updatedParts,
    })

    // Recalculate costs
    updateCosts()
  }

  // Update costs when any cost-related field changes
  const updateCosts = () => {
    if (!editedOrder) return

    const partsSellPrice = editedOrder.partsUsed.reduce((sum, part) => sum + part.quantity * part.unitCost, 0)
    const partsBuyPrice = editedOrder.partsUsed.reduce((sum, part) => sum + part.quantity * part.buyingPrice, 0)
    const laborCost = editedOrder.laborHours * editedOrder.laborRate
    const totalCost = partsBuyPrice + laborCost + editedOrder.travelCost + editedOrder.otherCosts
    const profit = editedOrder.invoiceAmount - totalCost
    const profitMargin = editedOrder.invoiceAmount > 0 ? profit / editedOrder.invoiceAmount : 0

    setEditedOrder({
      ...editedOrder,
      totalCost,
      profit,
      profitMargin,
    })
  }

  // Handle saving changes
  const handleSaveChanges = () => {
    if (!editedOrder) return

    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setServiceOrder(editedOrder)
      setIsEditing(false)
      setIsSaving(false)

      toast({
        title: "Changes saved",
        description: "Service order has been updated successfully.",
      })
    }, 1000)
  }

  // Handle canceling changes
  const handleCancelChanges = () => {
    if (serviceOrder) {
      setEditedOrder(JSON.parse(JSON.stringify(serviceOrder))) // Reset to original
    }
    setIsEditing(false)
  }

  // Handle status change
  const handleStatusChange = (status: ServiceOrder["status"]) => {
    if (!editedOrder) return

    const updatedOrder = { ...editedOrder, status }

    // If status is completed, set completed date to today
    if (status === "Completed" && !updatedOrder.completedDate) {
      updatedOrder.completedDate = new Date().toISOString().split("T")[0]
    }

    setEditedOrder(updatedOrder)
  }

  // Calculate costs whenever edited order changes
  useEffect(() => {
    if (editedOrder) {
      updateCosts()
    }
  }, [editedOrder])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/service-orders")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Service Orders
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
          </div>
          <div className="h-[500px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading service order details...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!serviceOrder || !editedOrder) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/service-orders")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Service Orders
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Service Order Not Found</h1>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-[300px]">
              <p className="text-muted-foreground">The requested service order could not be found.</p>
              <Button onClick={() => router.push("/service-orders")} className="mt-4">
                Return to Service Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const displayOrder = isEditing ? editedOrder : serviceOrder
  const costBreakdown = calculateCostBreakdown(displayOrder)
  const profitStatus = getProfitStatus(displayOrder)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Service Order Details</h1>
              <p className="text-muted-foreground">
                {displayOrder.id} - {displayOrder.title}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button variant="outline" onClick={() => router.push(`/service-orders/${params.id}/profitability`)}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Profitability
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Order
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancelChanges}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving ? (
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="materials">Materials & Costs</TabsTrigger>
            <TabsTrigger value="profitability">Profitability</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Order Information</CardTitle>
                <CardDescription>Basic details about this service order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Service ID</div>
                        <div className="font-medium">{displayOrder.id}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Service Type</div>
                        <div className="font-medium">{displayOrder.type}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Title</div>
                      <div className="font-medium">{displayOrder.title}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Description</div>
                      <div className="text-sm">{displayOrder.description}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Status</div>
                        {isEditing ? (
                          <Select
                            value={displayOrder.status}
                            onValueChange={(value) => handleStatusChange(value as ServiceOrder["status"])}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Scheduled">Scheduled</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="On Hold">On Hold</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className={getStatusBadgeColor(displayOrder.status)}>
                            {displayOrder.status}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Priority</div>
                        <Badge variant="outline" className={getPriorityBadgeColor(displayOrder.priority)}>
                          {displayOrder.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Site</div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{displayOrder.siteName}</span>
                        <span className="text-sm text-muted-foreground">({displayOrder.county})</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Scheduled Date</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{displayOrder.scheduledDate}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Completed Date</div>
                        {displayOrder.completedDate ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>{displayOrder.completedDate}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not completed</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Technician</div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="" alt={displayOrder.technician} />
                          <AvatarFallback className="text-xs">
                            {getTechnicianInitials(displayOrder.technician)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{displayOrder.technician}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Financial Summary</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Total Cost: <span className="font-medium">${displayOrder.totalCost.toFixed(2)}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Invoice: <span className="font-medium">${displayOrder.invoiceAmount.toFixed(2)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Bill of Materials</CardTitle>
                  <CardDescription>Parts and materials used for this service</CardDescription>
                </div>
                {isEditing && (
                  <Dialog open={showAddPartDialog} onOpenChange={setShowAddPartDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Part
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Part</DialogTitle>
                        <DialogDescription>
                          Select a part from inventory to add to this service order.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="part">Part</Label>
                          <Select value={selectedPart} onValueChange={setSelectedPart}>
                            <SelectTrigger id="part">
                              <SelectValue placeholder="Select part" />
                            </SelectTrigger>
                            <SelectContent>
                              {MOCK_INVENTORY.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.name} - ${item.unitCost.toFixed(2)} ({item.quantity} in stock)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={partQuantity}
                            onChange={(e) => setPartQuantity(Number.parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddPartDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddPart} disabled={!selectedPart || partQuantity <= 0}>
                          Add Part
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Part</TableHead>
                      <TableHead className="text-right">Buying Price</TableHead>
                      <TableHead className="text-right">Selling Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                      <TableHead className="text-right">Total Revenue</TableHead>
                      {isEditing && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayOrder.partsUsed.length > 0 ? (
                      displayOrder.partsUsed.map((part) => (
                        <TableRow key={part.id}>
                          <TableCell>{part.name}</TableCell>
                          <TableCell className="text-right">${part.buyingPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${part.unitCost.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            {isEditing ? (
                              <Input
                                type="number"
                                min="1"
                                className="w-20 ml-auto"
                                value={part.quantity}
                                onChange={(e) =>
                                  handleUpdatePartQuantity(part.id, Number.parseInt(e.target.value) || 0)
                                }
                              />
                            ) : (
                              part.quantity
                            )}
                          </TableCell>
                          <TableCell className="text-right">${(part.quantity * part.buyingPrice).toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(part.quantity * part.unitCost).toFixed(2)}</TableCell>
                          {isEditing && (
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleRemovePart(part.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={isEditing ? 7 : 6} className="text-center py-4">
                          No parts have been added to this service order.
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">
                        Total Parts
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        $
                        {displayOrder.partsUsed
                          .reduce((sum, part) => sum + part.quantity * part.buyingPrice, 0)
                          .toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        $
                        {displayOrder.partsUsed
                          .reduce((sum, part) => sum + part.quantity * part.unitCost, 0)
                          .toFixed(2)}
                      </TableCell>
                      {isEditing && <TableCell />}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Labor & Other Costs</CardTitle>
                <CardDescription>Additional costs associated with this service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="laborHours">Labor Hours</Label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="laborHours"
                            type="number"
                            min="0"
                            step="0.5"
                            value={displayOrder.laborHours}
                            onChange={(e) =>
                              setEditedOrder({
                                ...editedOrder,
                                laborHours: Number.parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        ) : (
                          <div>{displayOrder.laborHours} hours</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="laborRate">Labor Rate ($/hour)</Label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="laborRate"
                            type="number"
                            min="0"
                            step="0.01"
                            value={displayOrder.laborRate}
                            onChange={(e) =>
                              setEditedOrder({
                                ...editedOrder,
                                laborRate: Number.parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        ) : (
                          <div>${displayOrder.laborRate.toFixed(2)}/hour</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="travelCost">Travel Cost</Label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="travelCost"
                            type="number"
                            min="0"
                            step="0.01"
                            value={displayOrder.travelCost}
                            onChange={(e) =>
                              setEditedOrder({
                                ...editedOrder,
                                travelCost: Number.parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        ) : (
                          <div>${displayOrder.travelCost.toFixed(2)}</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otherCosts">Other Costs</Label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            id="otherCosts"
                            type="number"
                            min="0"
                            step="0.01"
                            value={displayOrder.otherCosts}
                            onChange={(e) =>
                              setEditedOrder({
                                ...editedOrder,
                                otherCosts: Number.parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        ) : (
                          <div>${displayOrder.otherCosts.toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div className="font-medium">Total Labor & Other Costs</div>
                    <div className="font-medium">
                      $
                      {(
                        displayOrder.laborHours * displayOrder.laborRate +
                        displayOrder.travelCost +
                        displayOrder.otherCosts
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profitability" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Revenue, costs, and profit breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Total Revenue</div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {isEditing ? (
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-40"
                            value={displayOrder.invoiceAmount}
                            onChange={(e) =>
                              setEditedOrder({
                                ...editedOrder,
                                invoiceAmount: Number.parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        ) : (
                          <div className="text-2xl font-bold">${displayOrder.invoiceAmount.toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Total Costs (Based on Buying Price)</div>
                        <div className="text-xl font-medium">${displayOrder.totalCost.toFixed(2)}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {((displayOrder.totalCost / displayOrder.invoiceAmount) * 100).toFixed(1)}% of revenue
                      </div>
                    </div>

                    <div className="space-y-2">
                      {costBreakdown.map((cost, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{cost.name}</span>
                            <span>${cost.value.toFixed(2)}</span>
                          </div>
                          <Progress value={cost.percentage} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Net Profit</div>
                      <div
                        className={`text-2xl font-bold ${displayOrder.profit > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        ${displayOrder.profit.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {profitStatus.icon}
                      <span className={`font-medium ${profitStatus.color}`}>
                        {(displayOrder.profitMargin * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    {profitStatus.icon}
                    <span>{profitStatus.text}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {displayOrder.profitMargin < 0.15 && (
              <Card>
                <CardHeader>
                  <CardTitle>Profitability Recommendations</CardTitle>
                  <CardDescription>Suggestions to improve profitability for this service order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <p className="font-medium text-amber-500">
                      This service order has a {displayOrder.profit < 0 ? "negative profit" : "low profit margin"}.
                    </p>
                  </div>

                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Consider adjusting the invoice amount to achieve at least a 15% profit margin</li>
                    <li>Review labor hours and rates to ensure they reflect the complexity of the work</li>
                    <li>Check if all parts used are necessary or if there are more cost-effective alternatives</li>
                    <li>Evaluate travel costs and consider bundling nearby service orders</li>
                  </ul>

                  {isEditing && (
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-2">Suggested Invoice Amount</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">${(displayOrder.totalCost / 0.85).toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">(for 15% profit margin)</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          setEditedOrder({
                            ...editedOrder,
                            invoiceAmount: Number.parseFloat((displayOrder.totalCost / 0.85).toFixed(2)),
                          })
                        }
                      >
                        Apply Suggested Amount
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Notes</CardTitle>
                <CardDescription>Additional information and observations</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={displayOrder.notes || ""}
                    onChange={(e) =>
                      setEditedOrder({
                        ...editedOrder,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Enter notes about this service order..."
                    className="min-h-[200px]"
                  />
                ) : (
                  <div className="p-4 bg-muted rounded-md min-h-[200px]">
                    {displayOrder.notes || "No notes have been added to this service order."}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
