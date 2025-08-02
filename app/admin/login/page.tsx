"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mountain, Eye, EyeOff, Loader2, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (formData.email === "admin@gmail.com" && formData.password === "admin123") {
        toast({
          title: "Admin Login Successful!",
          description: "Welcome to TrekMate Admin Panel",
        })
        // Redirect to admin dashboard
        window.location.href = "/admin/dashboard"
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials. Please try again.",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Mountain className="h-10 w-10 text-blue-400" />
            <span className="text-2xl font-bold text-white">TrekMate</span>
          </Link>
          <p className="text-slate-300 mt-2">Admin Portal</p>
        </div>

        <Card className="shadow-2xl border-slate-600">
          <CardHeader className="space-y-1 bg-slate-800 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <Shield className="h-6 w-6 mr-2" />
              Admin Access
            </CardTitle>
            <CardDescription className="text-center text-slate-300">
              Sign in to the TrekMate admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@trekmate.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to Admin Panel"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                ← Back to User Login
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
              <p className="text-xs text-slate-600 font-medium mb-1">Demo Credentials:</p>
              <p className="text-xs text-slate-600">Email: admin@trekmate.com</p>
              <p className="text-xs text-slate-600">Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}
