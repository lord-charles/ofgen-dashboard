"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Printer, DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Define service order type (simplified version of the one in service-orders/page.tsx)
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
    unitCost: number
  }[]
  laborHours: number
  laborRate: number
  travelCost: number
  otherCosts: number
  totalCost: number
  invoiceAmount: number
  profit: number
  profitMargin: number
}

export default function ServiceOrderProfitabilityPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [serviceOrder, setServiceOrder] = useState<ServiceOrder | null>(null)
  const [loading, setLoading] = useState(true)

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
        status: "Completed",
        priority: "Medium",
        scheduledDate: "2025-03-15",
        completedDate: "2025-03-16",
        technician: "John Doe",
        technicianId: "TECH-001",
        description: "Quarterly maintenance service for solar installation.",
        partsUsed: [
          { id: "INV-1001", name: "Solar Panel 250W", quantity: 1, unitCost: 150 },
          { id: "INV-1005", name: "Solar Cable 10m", quantity: 2, unitCost: 25 },
          { id: "INV-1006", name: "MC4 Connector Pair", quantity: 3, unitCost: 8 },
          { id: "INV-1009", name: "Fuse 15A", quantity: 2, unitCost: 5 },
        ],
        laborHours: 4,
        laborRate: 35,
        travelCost: 75,
        otherCosts: 20,
        totalCost: 0, // Will be calculated
        invoiceAmount: 0, // Will be calculated
        profit: 0, // Will be calculated
        profitMargin: 0, // Will be calculated
      }

      // Calculate costs
      const partsCost = mockOrder.partsUsed.reduce((sum, part) => sum + part.quantity * part.unitCost, 0)
      const laborCost = mockOrder.laborHours * mockOrder.laborRate

      mockOrder.totalCost = partsCost + laborCost + mockOrder.travelCost + mockOrder.otherCosts
      mockOrder.invoiceAmount = 450 // Fixed invoice amount for this example
      mockOrder.profit = mockOrder.invoiceAmount - mockOrder.totalCost
      mockOrder.profitMargin = mockOrder.profit / mockOrder.invoiceAmount

      setServiceOrder(mockOrder)
      setLoading(false)
    }

    fetchData()
  }, [params.id])

  // Calculate cost breakdown
  const calculateCostBreakdown = () => {
    if (!serviceOrder) return []

    const partsCost = serviceOrder.partsUsed.reduce((sum, part) => sum + part.quantity * part.unitCost, 0)
    const laborCost = serviceOrder.laborHours * serviceOrder.laborRate

    return [
      { name: "Parts", value: partsCost, percentage: (partsCost / serviceOrder.totalCost) * 100 },
      { name: "Labor", value: laborCost, percentage: (laborCost / serviceOrder.totalCost) * 100 },
      {
        name: "Travel",
        value: serviceOrder.travelCost,
        percentage: (serviceOrder.travelCost / serviceOrder.totalCost) * 100,
      },
      {
        name: "Other",
        value: serviceOrder.otherCosts,
        percentage: (serviceOrder.otherCosts / serviceOrder.totalCost) * 100,
      },
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

  // Get profit status
  const getProfitStatus = () => {
    if (!serviceOrder) return { color: "", icon: null, text: "" }

    if (serviceOrder.profitMargin >= 0.3) {
      return {
        color: "text-green-600",
        icon: <TrendingUp className="h-5 w-5 text-green-600" />,
        text: "High Profit Margin",
      }
    } else if (serviceOrder.profitMargin >= 0.15) {
      return {
        color: "text-amber-600",
        icon: <TrendingUp className="h-5 w-5 text-amber-600" />,
        text: "Average Profit Margin",
      }
    } else if (serviceOrder.profitMargin > 0) {
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

  const costBreakdown = calculateCostBreakdown()
  const profitStatus = getProfitStatus()

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

  if (!serviceOrder) {
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
              <h1 className="text-3xl font-bold tracking-tight">Profitability Analysis</h1>
              <p className="text-muted-foreground">
                {serviceOrder.id} - {serviceOrder.title}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Service Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Service Order Summary</CardTitle>
            <CardDescription>Overview of the service order details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Service Type</div>
                <div className="font-medium">{serviceOrder.type}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Site</div>
                <div className="font-medium">{serviceOrder.siteName}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge variant="outline" className={getStatusBadgeColor(serviceOrder.status)}>
                  {serviceOrder.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Scheduled Date</div>
                <div className="font-medium">{serviceOrder.scheduledDate}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Completed Date</div>
                <div className="font-medium">{serviceOrder.completedDate || "N/A"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Technician</div>
                <div className="font-medium">{serviceOrder.technician}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profitability Overview */}
        <div className="grid gap-6 md:grid-cols-2">
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
                    <div className="text-2xl font-bold">${serviceOrder.invoiceAmount.toFixed(2)}</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Total Costs</div>
                      <div className="text-xl font-medium">${serviceOrder.totalCost.toFixed(2)}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((serviceOrder.totalCost / serviceOrder.invoiceAmount) * 100).toFixed(1)}% of revenue
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
                      className={`text-2xl font-bold ${serviceOrder.profit > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      ${serviceOrder.profit.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {profitStatus.icon}
                    <span className={`font-medium ${profitStatus.color}`}>
                      {(serviceOrder.profitMargin * 100).toFixed(1)}%
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

          <Card>
            <CardHeader>
              <CardTitle>Parts & Materials Used</CardTitle>
              <CardDescription>Inventory items used for this service</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceOrder.partsUsed.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell>{part.name}</TableCell>
                      <TableCell className="text-right">{part.quantity}</TableCell>
                      <TableCell className="text-right">${part.unitCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(part.quantity * part.unitCost).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total Parts Cost
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${serviceOrder.partsUsed.reduce((sum, part) => sum + part.quantity * part.unitCost, 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Labor & Other Costs */}
        <Card>
          <CardHeader>
            <CardTitle>Labor & Other Costs</CardTitle>
            <CardDescription>Breakdown of labor, travel, and additional costs</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cost Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Labor</TableCell>
                  <TableCell>
                    {serviceOrder.laborHours} hours @ ${serviceOrder.laborRate}/hour
                  </TableCell>
                  <TableCell className="text-right">
                    ${(serviceOrder.laborHours * serviceOrder.laborRate).toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Travel</TableCell>
                  <TableCell>Transportation to and from site</TableCell>
                  <TableCell className="text-right">${serviceOrder.travelCost.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Other Costs</TableCell>
                  <TableCell>Miscellaneous expenses</TableCell>
                  <TableCell className="text-right">${serviceOrder.otherCosts.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    $
                    {(
                      serviceOrder.laborHours * serviceOrder.laborRate +
                      serviceOrder.travelCost +
                      serviceOrder.otherCosts
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Profitability Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Profitability Analysis</CardTitle>
            <CardDescription>Insights and recommendations for improving profitability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Summary</h3>
              <p className="text-muted-foreground">
                This service order {serviceOrder.profit > 0 ? "generated a profit" : "resulted in a loss"} of $
                {Math.abs(serviceOrder.profit).toFixed(2)}, representing a{" "}
                {(serviceOrder.profitMargin * 100).toFixed(1)}% profit margin.
                {serviceOrder.profitMargin < 0.15 ? " This is below the target profit margin of 15%." : ""}
              </p>
            </div>

            {serviceOrder.profitMargin < 0.15 && (
              <div className="space-y-2">
                <h3 className="font-medium">Areas for Improvement</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Consider optimizing labor hours for this type of service</li>
                  <li>Review parts usage and explore more cost-effective alternatives</li>
                  <li>Evaluate travel costs and consider bundling nearby service orders</li>
                  <li>Review pricing strategy for this type of service</li>
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-medium">Comparison to Similar Services</h3>
              <p className="text-muted-foreground">
                This {serviceOrder.type} service has a {serviceOrder.profitMargin >= 0.25 ? "higher" : "lower"} profit
                margin compared to the average for similar services ({serviceOrder.type}), which is typically 25%.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
