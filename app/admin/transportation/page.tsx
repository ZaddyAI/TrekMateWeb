"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TransportationAdminPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    destinationId: "",
    price: "",
    time: "",
    vehiclesType: "",
    grade: "",
    distance: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key as keyof typeof formData])
      })
      images.forEach((img) => {
        formDataToSend.append("files", img)
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/transportation`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) throw new Error("Failed to add transportation")

      toast({
        title: "Success",
        description: "Transportation added successfully",
      })

      setFormData({
        destinationId: "",
        price: "",
        time: "",
        vehiclesType: "",
        grade: "",
        distance: "",
      })
      setImages([])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/admin" className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Transportation</h1>
          <p className="text-gray-600">Add jeeps, helicopters, buses, and other transportation services</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Transportation Service</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destinationId">Destination ID</Label>
                  <Input
                    id="destinationId"
                    name="destinationId"
                    type="number"
                    placeholder="e.g., 1"
                    value={formData.destinationId}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehiclesType">Vehicle Type</Label>
                  <Input
                    id="vehiclesType"
                    name="vehiclesType"
                    placeholder="e.g., Jeep, Helicopter, Bus"
                    value={formData.vehiclesType}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="e.g., 150"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    name="distance"
                    type="number"
                    placeholder="e.g., 45"
                    value={formData.distance}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Duration (hours)</Label>
                  <Input
                    id="time"
                    name="time"
                    type="number"
                    placeholder="e.g., 3"
                    value={formData.time}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Quality</Label>
                  <Input
                    id="grade"
                    name="grade"
                    placeholder="e.g., Standard, Premium"
                    value={formData.grade}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Upload Images</Label>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                />
                {images.length > 0 && <p className="text-sm text-gray-600">{images.length} file(s) selected</p>}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Adding..." : "Add Transportation"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
