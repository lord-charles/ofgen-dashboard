import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"

export default function EditSiteLoading() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted"></div>
          </div>
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted"></div>
        </div>

        <Tabs defaultValue="basic-info" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="basic-info" disabled>
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="technical" disabled>
              Technical
            </TabsTrigger>
            <TabsTrigger value="location" disabled>
              Location
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="mt-4">
            <Card>
              <CardHeader>
                <div className="h-6 w-32 animate-pulse rounded-md bg-muted"></div>
                <div className="h-4 w-64 animate-pulse rounded-md bg-muted"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>
                      <div className="h-10 animate-pulse rounded-md bg-muted"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
