import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/chart"
import { ArrowDown, ArrowUp, Battery, Cloud, CloudSun, MapPin, Sun, Zap } from "lucide-react"
import DashboardLayout from "./dashboard-layout"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Solar Installations Dashboard</h1>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">Kenya</span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <MetricCard
                title="Total Energy Generated"
                value="256.4 kWh"
                description="+12% from yesterday"
                trend="up"
                icon={<Zap className="h-4 w-4" />}
              />
              <MetricCard
                title="Active Installations"
                value="42"
                description="Out of 45 total sites"
                trend="neutral"
                icon={<Sun className="h-4 w-4" />}
              />
              {/* <MetricCard
                title="Average Battery Level"
                value="78%"
                description="-3% from yesterday"
                trend="down"
                icon={<Battery className="h-4 w-4" />}
              /> */}
              {/* <MetricCard
                title="Weather Conditions"
                value="Mostly Sunny"
                description="Across most sites"
                trend="neutral"
                icon={<CloudSun className="h-4 w-4" />}
              /> */}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Energy Production</CardTitle>
                  <CardDescription>Daily energy output across all installations</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart
                    data={[
                      { name: "Mon", value: 120 },
                      { name: "Tue", value: 200 },
                      { name: "Wed", value: 150 },
                      { name: "Thu", value: 180 },
                      { name: "Fri", value: 250 },
                      { name: "Sat", value: 280 },
                      { name: "Sun", value: 300 },
                    ]}
                    xAxis="name"
                    yAxis="value"
                    height={350}
                    colors={["#16a34a"]}
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Installation Distribution</CardTitle>
                  <CardDescription>By county</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    data={[
                      { name: "Nairobi", value: 12 },
                      { name: "Mombasa", value: 8 },
                      { name: "Kisumu", value: 6 },
                      { name: "Nakuru", value: 5 },
                      { name: "Eldoret", value: 4 },
                      { name: "Others", value: 10 },
                    ]}
                    xAxis="name"
                    yAxis="value"
                    height={350}
                    colors={["#16a34a"]}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* <Card>
                <CardHeader>
                  <CardTitle>Maintenance Schedule</CardTitle>
                  <CardDescription>Upcoming maintenance visits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { site: "Nairobi Central", date: "Apr 15", status: "Scheduled" },
                      { site: "Mombasa Port", date: "Apr 18", status: "Pending" },
                      { site: "Kisumu Lake", date: "Apr 22", status: "Confirmed" },
                    ].map((item) => (
                      <div key={item.site} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.site}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">{item.status}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}

              {/* <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>System notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { message: "Low battery alert", site: "Nakuru East", time: "2h ago", level: "warning" },
                      { message: "Connection lost", site: "Eldoret North", time: "5h ago", level: "critical" },
                      { message: "Performance degradation", site: "Mombasa South", time: "1d ago", level: "warning" },
                    ].map((alert, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            alert.level === "critical" ? "bg-red-500" : "bg-yellow-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">
                            {alert.site} · {alert.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}
{/* 
              <Card>
                <CardHeader>
                  <CardTitle>Weather Forecast</CardTitle>
                  <CardDescription>Next 3 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        day: "Today",
                        forecast: "Sunny",
                        temp: "28°C",
                        icon: <Sun className="h-5 w-5 text-yellow-500" />,
                      },
                      {
                        day: "Tomorrow",
                        forecast: "Partly Cloudy",
                        temp: "26°C",
                        icon: <CloudSun className="h-5 w-5 text-blue-500" />,
                      },
                      {
                        day: "Wednesday",
                        forecast: "Cloudy",
                        temp: "24°C",
                        icon: <Cloud className="h-5 w-5 text-gray-500" />,
                      },
                    ].map((day) => (
                      <div key={day.day} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {day.icon}
                          <div>
                            <p className="font-medium">{day.day}</p>
                            <p className="text-sm text-muted-foreground">{day.forecast}</p>
                          </div>
                        </div>
                        <div className="text-sm font-medium">{day.temp}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Content</CardTitle>
                <CardDescription>Detailed analytics for your solar installations will appear here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Analytics dashboard content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports Content</CardTitle>
                <CardDescription>Generated reports and exportable data will appear here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Reports dashboard content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications Content</CardTitle>
                <CardDescription>System alerts and notifications will appear here.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Notifications dashboard content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function MetricCard({
  title,
  value,
  description,
  trend,
  icon,
}: {
  title: string
  value: string
  description: string
  trend: "up" | "down" | "neutral"
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {trend === "up" && <ArrowUp className="mr-1 h-3 w-3 text-green-600" />}
          {trend === "down" && <ArrowDown className="mr-1 h-3 w-3 text-red-600" />}
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
