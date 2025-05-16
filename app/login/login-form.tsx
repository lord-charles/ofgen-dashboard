'use client'

import React from 'react'
import { Loader2, Sun } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { signIn } from 'next-auth/react'
import { cn } from '@/lib/utils'

export const LoginForm = () => {

    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [touched, setTouched] = useState({ email: false, password: false })

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)



    const { toast } = useToast();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        console.log(email, password)

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            console.log(result);

            if (result?.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Invalid credentials. Please try again.",
                });
                return;
            }

            router.push("/");
            router.refresh();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setIsLoading(false);
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

                            <form
                                className={cn("flex flex-col gap-6")}
                                onSubmit={onSubmit}
                            >
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">Login to your     account</h1>
                                    <p className="text-balance text-sm text-muted-foreground">
                                        Enter your credentials below to access your account
                                    </p>
                                </div>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Sign In
                                    </Button>
                                </div>
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

                            <div className="text-center text-sm w-full">
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
