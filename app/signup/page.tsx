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
import { Sun, User, Mail, Lock, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
    password: "",
    confirmPassword: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    nationalId: false,
    password: false,
    confirmPassword: false,
  })

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValidPassword = (password: string) => password.length >= 8
  const isValidKenyanPhone = (phone: string) => {

    const cleaned = phone.replace(/\D/g, "")
    if (/^(07|01)\d{8}$/.test(cleaned)) return true
    if (/^254[17]\d{8}$/.test(cleaned)) return true
    return false
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.nationalId || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields")
      return
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!isValidKenyanPhone(formData.phoneNumber)) {
      setError("Please enter a valid Kenyan phone number")
      return
    }

    if (!/^\d{6,10}$/.test(formData.nationalId)) {
      setError("Please enter a valid National ID (6-10 digits)")
      return
    }

    if (!isValidPassword(formData.password)) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        status: "active",
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.replace(/\D/g, ""),
        nationalId: formData.nationalId.trim(),
        roles: ["employee"],
        dateOfBirth: "2001-01-01",
        position: "employee",
        employmentEndDate: "2024-12-31",
        employmentType: "full-time",
      }
      const res = await fetch("https://ofgen.cognitron.co.ke/ofgen/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        let message = "Registration failed. Please try again."
        try {
          const data = await res.json()
          if (data && data.message) message = Array.isArray(data.message) ? data.message.join(", ") : data.message
        } catch { }
        setError(message)
        setIsLoading(false)
        return
      }
      setRegistrationSuccess(true)
      setIsLoading(false)
      setTimeout(() => {
        router.push("/login")
      }, 4000) // 4 seconds
      return
    } catch (err) {
      console.log(err)
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
            <h2 className="text-4xl font-bold mb-6">Join our solar revolution</h2>
            <p className="text-lg opacity-90 mb-8">
              Create an account to access our comprehensive dashboard and manage solar installations across Kenya.
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

      {/* Right side - Signup form */}
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
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>Enter your information to get started</CardDescription>
            </CardHeader>
            <CardContent>
              {registrationSuccess ? (
                <Alert variant="default" className="mb-4 border-green-500 text-green-700">
                  <Sun className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Registration successful! Redirecting to login page...
                  </AlertDescription>
                </Alert>
              ) : null}

              {!registrationSuccess && (
                <>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex gap-2 items-center">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Jane"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={() => handleBlur("firstName")}
                        required
                        className={`pl-10 border-green-200 focus-visible:ring-green-500 ${touched.firstName && !formData.firstName ? "border-red-500" : ""}`}
                      />
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    {touched.firstName && !formData.firstName && <p className="text-sm text-red-500 mt-1">First name is required</p>}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Wanjiku"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={() => handleBlur("lastName")}
                        required
                        className={`pl-10 border-green-200 focus-visible:ring-green-500 ${touched.lastName && !formData.lastName ? "border-red-500" : ""}`}
                      />
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    {touched.lastName && !formData.lastName && <p className="text-sm text-red-500 mt-1">Last name is required</p>}
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="0712345678 or 254712345678"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        onBlur={() => handleBlur("phoneNumber")}
                        required
                        className={`pl-10 border-green-200 focus-visible:ring-green-500 ${touched.phoneNumber && formData.phoneNumber && !isValidKenyanPhone(formData.phoneNumber) ? "border-red-500" : ""}`}
                      />
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    {touched.phoneNumber && formData.phoneNumber && !isValidKenyanPhone(formData.phoneNumber) && (
                      <p className="text-sm text-red-500 mt-1">Enter a valid Kenyan phone number</p>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="nationalId">National ID</Label>
                    <div className="relative">
                      <Input
                        id="nationalId"
                        name="nationalId"
                        placeholder="e.g. 23456789"
                        value={formData.nationalId}
                        onChange={handleChange}
                        onBlur={() => handleBlur("nationalId")}
                        required
                        className={`pl-10 border-green-200 focus-visible:ring-green-500 ${touched.nationalId && formData.nationalId && !/^\d{6,10}$/.test(formData.nationalId) ? "border-red-500" : ""}`}
                      />
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    {touched.nationalId && formData.nationalId && !/^\d{6,10}$/.test(formData.nationalId) && (
                      <p className="text-sm text-red-500 mt-1">Enter a valid National ID (6-10 digits)</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      required
                      className={`pl-10 border-green-200 focus-visible:ring-green-500 ${touched.email && (!isValidEmail(formData.email) && formData.email) ? "border-red-500" : ""
                        }`}
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  {touched.email && !isValidEmail(formData.email) && formData.email && (
                    <p className="text-sm text-red-500 mt-1">Please enter a valid email address</p>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur("password")}
                        required
                        className={`pl-10 border-green-200 focus-visible:ring-green-500 ${touched.password && (!isValidPassword(formData.password) && formData.password)
                          ? "border-red-500"
                          : ""
                          }`}
                      />
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    {touched.password && !isValidPassword(formData.password) && formData.password && (
                      <p className="text-sm text-red-500 mt-1">Password must be at least 8 characters long</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => handleBlur("confirmPassword")}
                        required
                        className={`pl-10 border-green-200 focus-visible:ring-green-500 ${touched.confirmPassword &&
                          formData.confirmPassword &&
                          formData.password !== formData.confirmPassword
                          ? "border-red-500"
                          : ""
                          }`}
                      />
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    {touched.confirmPassword &&
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                      )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the{" "}
                    <Link href="/terms" className="text-green-600 hover:text-green-800">
                      terms and conditions
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
                </>
              )}
            </CardContent>

            <CardFooter>
              <div className="text-center w-full text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-green-600 hover:text-green-800 font-medium">
                  Sign in
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
