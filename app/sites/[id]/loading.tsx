import DashboardLayout from "@/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"

export default function SiteDetailsLoading() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-1">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="h-6 w-32 animate-pulse rounded-md bg-muted"></div>
            </CardHeader>
            <CardContent className="h-[350px] animate-pulse bg-muted p-0"></CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-6 w-40 animate-pulse rounded-md bg-muted"></div>
              <div className="h-4 w-64 animate-pulse rounded-md bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>
                    <div className="h-4 w-32 animate-pulse rounded-md bg-muted"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="performance" disabled>
              Performance
            </TabsTrigger>
            <TabsTrigger value="weather" disabled>
              Weather
            </TabsTrigger>
            <TabsTrigger value="alerts" disabled>
              Alerts
            </TabsTrigger>
            <TabsTrigger value="team" disabled>
              Team
            </TabsTrigger>
            <TabsTrigger value="service-orders" disabled>
              Service Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-4">
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="h-6 w-32 animate-pulse rounded-md bg-muted"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-24 animate-pulse rounded-md bg-muted"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
