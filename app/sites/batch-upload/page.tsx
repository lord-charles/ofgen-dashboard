"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Upload,
  AlertCircle,
  CheckCircle2,
  X,
  HelpCircle,
  Loader2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Define the site data structure
type SiteData = {
  name: string
  county: string
  address: string
  latitude: string
  longitude: string
  capacity: string
  status: "active" | "inactive" | "pending"
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  [key: string]: any // For any additional fields
}

// Define validation error structure
type ValidationError = {
  row: number
  column: string
  message: string
}

export default function BatchUploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<SiteData[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<{
    total: number
    successful: number
    failed: number
    errors: ValidationError[]
  } | null>(null)
  const [showHelpDialog, setShowHelpDialog] = useState(false)

  // Required fields for validation
  const requiredFields = ["name", "county", "latitude", "longitude"]

  // Template headers for CSV download
  const templateHeaders = [
    "name",
    "county",
    "address",
    "latitude",
    "longitude",
    "capacity",
    "status",
    "contactName",
    "contactPhone",
    "contactEmail",
  ]

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file.",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setIsUploading(true)

    // Simulate file upload and parsing
    setTimeout(() => {
      parseFile(selectedFile)
      setIsUploading(false)
      setActiveTab("validate")
    }, 1500)
  }

  // Parse the uploaded file
  const parseFile = (file: File) => {
    // In a real application, you would use a library like Papa Parse for CSV
    // or xlsx for Excel files. Here we'll simulate parsing with mock data.
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      // Generate mock parsed data
      const mockData: SiteData[] = []
      const mockErrors: ValidationError[] = []

      // Generate between 5-15 mock entries
      const entryCount = 5 + Math.floor(Math.random() * 11)

      for (let i = 0; i < entryCount; i++) {
        // Simulate some validation errors for demonstration
        const hasError = Math.random() > 0.7

        const entry: SiteData = {
          name: hasError && i === 2 ? "" : `Site ${i + 1}`,
          county: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu"][Math.floor(Math.random() * 5)],
          address: `Address ${i + 1}, Kenya`,
          latitude: hasError && i === 4 ? "invalid" : (-1.2921 + (Math.random() * 2 - 1)).toFixed(6),
          longitude: (36.8219 + (Math.random() * 2 - 1)).toFixed(6),
          capacity: (Math.random() * 9 + 1).toFixed(2),
          status: ["active", "inactive", "pending"][Math.floor(Math.random() * 3)] as SiteData["status"],
          contactName: `Contact ${i + 1}`,
          contactPhone: `+254 7${Math.floor(Math.random() * 100000000)}`,
          contactEmail: `contact${i + 1}@example.com`,
        }

        mockData.push(entry)

        // Add validation errors
        if (hasError) {
          if (i === 2) {
            mockErrors.push({
              row: i + 1,
              column: "name",
              message: "Site name is required",
            })
          }
          if (i === 4) {
            mockErrors.push({
              row: i + 1,
              column: "latitude",
              message: "Invalid latitude format",
            })
          }
        }
      }

      setParsedData(mockData)
      setValidationErrors(mockErrors)
      setIsProcessing(false)
    }, 2000)
  }

  // Validate the parsed data
  const validateData = (data: SiteData[]): ValidationError[] => {
    const errors: ValidationError[] = []

    data.forEach((row, index) => {
      // Check required fields
      requiredFields.forEach((field) => {
        if (!row[field]) {
          errors.push({
            row: index + 1,
            column: field,
            message: `${field} is required`,
          })
        }
      })

      // Validate latitude and longitude format
      if (row.latitude && isNaN(Number(row.latitude))) {
        errors.push({
          row: index + 1,
          column: "latitude",
          message: "Invalid latitude format",
        })
      }

      if (row.longitude && isNaN(Number(row.longitude))) {
        errors.push({
          row: index + 1,
          column: "longitude",
          message: "Invalid longitude format",
        })
      }
    })

    return errors
  }

  // Handle import of validated data
  const handleImport = () => {
    // Check if there are validation errors
    if (validationErrors.length > 0) {
      toast({
        title: "Validation errors",
        description: "Please fix all validation errors before importing.",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    setImportProgress(0)

    // Simulate import process with progress
    const totalItems = parsedData.length
    let processedItems = 0
    let successfulItems = 0
    let failedItems = 0
    const importErrors: ValidationError[] = []

    const importInterval = setInterval(() => {
      if (processedItems < totalItems) {
        // Simulate random success/failure
        const isSuccess = Math.random() > 0.1

        if (isSuccess) {
          successfulItems++
        } else {
          failedItems++
          importErrors.push({
            row: processedItems + 1,
            column: "import",
            message: "Failed to import site",
          })
        }

        processedItems++
        setImportProgress(Math.round((processedItems / totalItems) * 100))
      } else {
        clearInterval(importInterval)
        setIsImporting(false)

        // Set import results
        setImportResults({
          total: totalItems,
          successful: successfulItems,
          failed: failedItems,
          errors: importErrors,
        })

        // Show toast notification
        toast({
          title: "Import completed",
          description: `Successfully imported ${successfulItems} of ${totalItems} sites.`,
          variant: failedItems > 0 ? "destructive" : "default",
        })

        // Move to results tab
        setActiveTab("results")
      }
    }, 300)
  }

  // Generate and download a template CSV file
  const downloadTemplate = () => {
    // Create CSV content
    const csvContent = [
      templateHeaders.join(","),
      "Site Name,Nairobi,123 Example St,-1.2921,36.8219,5.5,active,John Doe,+254712345678,john@example.com",
    ].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "site_upload_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Template downloaded",
      description: "The CSV template has been downloaded.",
    })
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      const fileInput = fileInputRef.current
      if (fileInput) {
        // Create a new DataTransfer object
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(droppedFiles[0])
        fileInput.files = dataTransfer.files

        // Trigger change event manually
        const event = new Event("change", { bubbles: true })
        fileInput.dispatchEvent(event)
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.push("/sites")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sites
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Batch Upload Sites</h1>
          </div>
          <Button variant="outline" onClick={() => setShowHelpDialog(true)}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload" disabled={isUploading || isProcessing}>
              Upload
            </TabsTrigger>
            <TabsTrigger value="validate" disabled={parsedData.length === 0 || isUploading}>
              Validate
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!importResults}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Sites Data</CardTitle>
                <CardDescription>Upload a CSV or Excel file containing multiple site entries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">File Requirements</h3>
                    <p className="text-sm text-muted-foreground">
                      Please ensure your file meets the following requirements:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                      <li>CSV or Excel format (.csv, .xls, .xlsx)</li>
                      <li>First row contains column headers</li>
                      <li>Required fields: name, county, latitude, longitude</li>
                      <li>Latitude and longitude in decimal format (e.g., -1.2921, 36.8219)</li>
                    </ul>
                  </div>
                  <Button onClick={downloadTemplate} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                </div>

                <Separator />

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    isUploading ? "border-primary bg-primary/10" : "border-border"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-4">
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      ) : (
                        <FileSpreadsheet className="h-8 w-8 text-primary" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        {isUploading ? "Uploading..." : "Drag & Drop your file here"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {isUploading
                          ? "Please wait while we process your file"
                          : "or click the button below to browse files"}
                      </p>
                    </div>

                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xls,.xlsx"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />

                    <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                  </div>
                </div>

                {file && !isUploading && (
                  <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Validate Data</CardTitle>
                <CardDescription>Review and validate the data before importing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-muted-foreground">Processing file data...</p>
                  </div>
                ) : (
                  <>
                    {validationErrors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Validation Errors</AlertTitle>
                        <AlertDescription>
                          Found {validationErrors.length} errors in your data. Please fix them before importing.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Row</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>County</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Latitude</TableHead>
                            <TableHead>Longitude</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Validation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parsedData.map((site, index) => {
                            const rowErrors = validationErrors.filter((error) => error.row === index + 1)
                            const hasErrors = rowErrors.length > 0

                            return (
                              <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className={site.name ? "" : "text-red-500"}>
                                  {site.name || "Missing"}
                                </TableCell>
                                <TableCell>{site.county}</TableCell>
                                <TableCell>{site.address}</TableCell>
                                <TableCell className={isNaN(Number(site.latitude)) ? "text-red-500" : ""}>
                                  {site.latitude}
                                </TableCell>
                                <TableCell>{site.longitude}</TableCell>
                                <TableCell>{site.capacity}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      site.status === "active"
                                        ? "bg-green-600"
                                        : site.status === "inactive"
                                          ? "bg-slate-600"
                                          : "bg-amber-600"
                                    }
                                  >
                                    {site.status || "N/A"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  {hasErrors ? (
                                    <Badge variant="destructive" className="ml-auto">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Error
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-green-600 ml-auto">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Valid
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {validationErrors.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-medium">Error Details</h3>
                        <div className="rounded-md border p-4 space-y-2">
                          {validationErrors.map((error, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                              <div>
                                <span className="font-medium">
                                  Row {error.row}, Column: {error.column}
                                </span>
                                <p className="text-muted-foreground">{error.message}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab("upload")
                    setParsedData([])
                    setValidationErrors([])
                    setFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={isProcessing || validationErrors.length > 0 || isImporting}>
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import Sites"
                  )}
                </Button>
              </CardFooter>
            </Card>

            {isImporting && (
              <Card>
                <CardHeader>
                  <CardTitle>Import Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Importing sites...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {importResults && (
              <Card>
                <CardHeader>
                  <CardTitle>Import Results</CardTitle>
                  <CardDescription>Summary of the batch import operation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4 text-center">
                      <div className="text-2xl font-bold">{importResults.total}</div>
                      <p className="text-sm text-muted-foreground">Total Sites</p>
                    </div>
                    <div className="rounded-lg border p-4 text-center bg-green-50 dark:bg-green-900/20">
                      <div className="text-2xl font-bold text-green-600">{importResults.successful}</div>
                      <p className="text-sm text-muted-foreground">Successfully Imported</p>
                    </div>
                    <div className="rounded-lg border p-4 text-center bg-red-50 dark:bg-red-900/20">
                      <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                      <p className="text-sm text-muted-foreground">Failed to Import</p>
                    </div>
                  </div>

                  {importResults.errors.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Import Errors</h3>
                      <div className="rounded-md border p-4 space-y-2">
                        {importResults.errors.map((error, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            <div>
                              <span className="font-medium">Row {error.row}</span>
                              <p className="text-muted-foreground">{error.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Alert className={importResults.failed > 0 ? "border-amber-600" : "border-green-600"}>
                    {importResults.failed > 0 ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertTitle>Import Completed with Warnings</AlertTitle>
                        <AlertDescription>
                          {importResults.successful} sites were successfully imported, but {importResults.failed} sites
                          failed. You can download the error report and try again with the failed entries.
                        </AlertDescription>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle>Import Completed Successfully</AlertTitle>
                        <AlertDescription>
                          All {importResults.total} sites were successfully imported into the system.
                        </AlertDescription>
                      </>
                    )}
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {importResults.failed > 0 && (
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Error Report
                    </Button>
                  )}
                  <div className="flex gap-2 ml-auto">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveTab("upload")
                        setParsedData([])
                        setValidationErrors([])
                        setFile(null)
                        setImportResults(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                    >
                      Upload Another File
                    </Button>
                    <Button onClick={() => router.push("/sites")}>View All Sites</Button>
                  </div>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Batch Upload Help</DialogTitle>
            <DialogDescription>Learn how to prepare and upload your site data</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">File Format</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You can upload your site data in CSV or Excel format (.csv, .xls, .xlsx). The first row should contain
                column headers matching the required fields.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-lg">Required Fields</h3>
              <div className="rounded-md border mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">name</TableCell>
                      <TableCell>Site name</TableCell>
                      <TableCell>Nairobi Solar Site 1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">county</TableCell>
                      <TableCell>County name</TableCell>
                      <TableCell>Nairobi</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">latitude</TableCell>
                      <TableCell>Decimal latitude</TableCell>
                      <TableCell>-1.2921</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">longitude</TableCell>
                      <TableCell>Decimal longitude</TableCell>
                      <TableCell>36.8219</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg">Optional Fields</h3>
              <div className="rounded-md border mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Example</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">address</TableCell>
                      <TableCell>Physical address</TableCell>
                      <TableCell>123 Solar Avenue, Nairobi</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">capacity</TableCell>
                      <TableCell>System capacity in kW</TableCell>
                      <TableCell>5.5</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">status</TableCell>
                      <TableCell>Site status</TableCell>
                      <TableCell>active, inactive, or pending</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">contactName</TableCell>
                      <TableCell>Contact person name</TableCell>
                      <TableCell>John Doe</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">contactPhone</TableCell>
                      <TableCell>Contact phone number</TableCell>
                      <TableCell>+254712345678</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">contactEmail</TableCell>
                      <TableCell>Contact email address</TableCell>
                      <TableCell>john@example.com</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg">Process</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-2">
                <li>
                  <span className="font-medium text-foreground">Upload:</span> Upload your CSV or Excel file containing
                  site data
                </li>
                <li>
                  <span className="font-medium text-foreground">Validate:</span> The system will validate your data and
                  show any errors
                </li>
                <li>
                  <span className="font-medium text-foreground">Review:</span> Review the validation results and fix any
                  errors if needed
                </li>
                <li>
                  <span className="font-medium text-foreground">Import:</span> Import the validated data into the system
                </li>
                <li>
                  <span className="font-medium text-foreground">Results:</span> View the import results and any error
                  reports
                </li>
              </ol>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowHelpDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
