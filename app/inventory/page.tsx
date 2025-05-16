"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, Search, Edit, AlertCircle, CheckCircle } from "lucide-react"

// Update the InventoryItem type to include buyingPrice
type InventoryItem = {
  id: string
  name: string
  category: string
  unitCost: number // Selling price
  buyingPrice: number // Buying price
  quantity: number
  minQuantity: number
  location: string
  supplier: string
  lastRestocked: string
}

// Update the mock inventory data to include buyingPrice
const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "INV-1001",
    name: "Solar Panel 250W",
    category: "Solar Panels",
    unitCost: 15000, // Selling price in KSH
    buyingPrice: 12000, // Buying price in KSH
    quantity: 25,
    minQuantity: 10,
    location: "Warehouse A",
    supplier: "SolarTech Ltd",
    lastRestocked: "2025-02-15",
  },
  {
    id: "INV-1002",
    name: "Inverter 3kW",
    category: "Inverters",
    unitCost: 45000,
    buyingPrice: 38000,
    quantity: 12,
    minQuantity: 5,
    location: "Warehouse A",
    supplier: "PowerSolutions Inc",
    lastRestocked: "2025-02-10",
  },
  {
    id: "INV-1003",
    name: "Battery 12V 200Ah",
    category: "Batteries",
    unitCost: 32000,
    buyingPrice: 26000,
    quantity: 18,
    minQuantity: 8,
    location: "Warehouse B",
    supplier: "BatteryPlus",
    lastRestocked: "2025-02-20",
  },
  {
    id: "INV-1004",
    name: "Mounting Bracket",
    category: "Mounting Systems",
    unitCost: 4500,
    buyingPrice: 3200,
    quantity: 40,
    minQuantity: 15,
    location: "Warehouse A",
    supplier: "MetalWorks Ltd",
    lastRestocked: "2025-01-30",
  },
  {
    id: "INV-1005",
    name: "Solar Cable 10m",
    category: "Cables & Wiring",
    unitCost: 2500,
    buyingPrice: 1800,
    quantity: 60,
    minQuantity: 20,
    location: "Warehouse C",
    supplier: "ElectroCables",
    lastRestocked: "2025-02-05",
  },
  {
    id: "INV-1006",
    name: "MC4 Connector Pair",
    category: "Connectors",
    unitCost: 800,
    buyingPrice: 500,
    quantity: 100,
    minQuantity: 50,
    location: "Warehouse C",
    supplier: "ConnectTech",
    lastRestocked: "2025-01-25",
  },
  {
    id: "INV-1007",
    name: "Charge Controller 30A",
    category: "Controllers",
    unitCost: 12000,
    buyingPrice: 9500,
    quantity: 15,
    minQuantity: 8,
    location: "Warehouse B",
    supplier: "PowerSolutions Inc",
    lastRestocked: "2025-02-12",
  },
  {
    id: "INV-1008",
    name: "Junction Box",
    category: "Accessories",
    unitCost: 3500,
    buyingPrice: 2500,
    quantity: 30,
    minQuantity: 15,
    location: "Warehouse A",
    supplier: "ElectroCables",
    lastRestocked: "2025-01-20",
  },
  {
    id: "INV-1009",
    name: "Fuse 15A",
    category: "Accessories",
    unitCost: 500,
    buyingPrice: 300,
    quantity: 50,
    minQuantity: 25,
    location: "Warehouse C",
    supplier: "ElectroCables",
    lastRestocked: "2025-02-01",
  },
  {
    id: "INV-1010",
    name: "Grounding Kit",
    category: "Installation",
    unitCost: 6000,
    buyingPrice: 4500,
    quantity: 20,
    minQuantity: 10,
    location: "Warehouse B",
    supplier: "SafetyFirst",
    lastRestocked: "2025-01-15",
  },
]

export default function InventoryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<string>("all")

  // Get unique categories for filter
  const categories = Array.from(new Set(MOCK_INVENTORY.map((item) => item.category)))

  // Filter inventory items based on search query and filters
  const filteredInventory = MOCK_INVENTORY.filter((item) => {
    // Search filter
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    // Stock filter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && item.quantity <= item.minQuantity) ||
      (stockFilter === "normal" && item.quantity > item.minQuantity)

    return matchesSearch && matchesCategory && matchesStock
  })

  // Get stock status
  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minQuantity) {
      return {
        label: "Low Stock",
        badge: (
          <Badge variant="outline" className="bg-red-600">
            Low Stock
          </Badge>
        ),
        icon: <AlertCircle className="h-4 w-4 text-red-600" />,
      }
    } else {
      return {
        label: "In Stock",
        badge: (
          <Badge variant="outline" className="bg-green-600">
            In Stock
          </Badge>
        ),
        icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <Button onClick={() => router.push("/inventory/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Inventory Item
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter inventory items by category and stock level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

              <div>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by stock level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock Levels</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="normal">Normal Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>
              Showing {filteredInventory.length} of {MOCK_INVENTORY.length} inventory items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Buying Price (KSH)</TableHead>
                  <TableHead className="text-right">Selling Price (KSH)</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(item)
                    const marginPercentage = (((item.unitCost - item.buyingPrice) / item.unitCost) * 100).toFixed(1)

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.buyingPrice.toLocaleString()} KSH</TableCell>
                        <TableCell className="text-right">{item.unitCost.toLocaleString()} KSH</TableCell>
                        <TableCell className="text-right">{marginPercentage}%</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {item.quantity}
                            {stockStatus.icon}
                          </div>
                        </TableCell>
                        <TableCell>{stockStatus.badge}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/inventory/${item.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-6">
                      No inventory items found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
