"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Lock, Mail, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [touched, setTouched] = useState({ email: false, password: false })

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!email || !password) {
      setError("Please fill in all required fields")
      return
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, hardcode a successful login
      // In production, this would be an actual API call
      if (email === "demo@ofgen.com" && password === "password") {
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-600 to-green-800 text-white p-8 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <Sun className="h-10 w-10 text-yellow-500" />
            <h1 className="text-3xl font-bold">Ofgen</h1>
          </div>
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6">Powering a sustainable future</h2>
            <p className="text-lg opacity-90 mb-8">
              Monitor and manage your solar installations across Kenya with our comprehensive dashboard.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">500+</h3>
                <p className="text-sm opacity-80">Solar installations</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">100%</h3>
                <p className="text-sm opacity-80">Renewable energy</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">24/7</h3>
                <p className="text-sm opacity-80">System monitoring</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">50+</h3>
                <p className="text-sm opacity-80">Counties covered</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm opacity-70">© 2023 Ofgen. All rights reserved.</div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex md:hidden justify-center mb-8">
            <div className="flex items-center gap-2">
              <Sun className="h-10 w-10 text-yellow-500" />
              <h1 className="text-3xl font-bold text-green-800">Ofgen</h1>
            </div>
          </div>

          <Card className="border-green-100 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in to your account</CardTitle>
              <CardDescription>Enter your credentials to access the dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched({ ...touched, email: true })}
                      required
                      className={`pl-10 border-green-200 focus-visible:ring-green-500 ${
                        touched.email && !isValidEmail(email) && email ? "border-red-500" : ""
                      }`}
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  {touched.email && !isValidEmail(email) && email && (
                    <p className="text-sm text-red-500 mt-1">Please enter a valid email address</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-800">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched({ ...touched, password: true })}
                      required
                      className={`pl-10 border-green-200 focus-visible:ring-green-500 ${
                        touched.password && !password ? "border-red-500" : ""
                      }`}
                    />
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  {touched.password && !password && <p className="text-sm text-red-500 mt-1">Password is required</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me for 30 days
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="border-green-200">
                  Google
                </Button>
                <Button variant="outline" className="border-green-200">
                  Microsoft
                </Button>
              </div>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-green-600 hover:text-green-800 font-medium">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Mobile footer */}
          <p className="md:hidden mt-8 text-center text-sm text-muted-foreground">
            Powering a sustainable future with solar solutions
          </p>
        </div>
      </div>
    </div>
  )
}
