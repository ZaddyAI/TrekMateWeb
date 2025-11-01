"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DestinationsAdminPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    highestElivation: "",
    region: "",
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/destination`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      if (!response.ok) throw new Error("Failed to add destination")

      toast({
        title: "Success",
        description: "Destination added successfully",
      })

      setFormData({
        name: "",
        description: "",
        shortDescription: "",
        highestElivation: "",
        region: "",
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Destinations</h1>
          <p className="text-gray-600">Add new trekking destinations to the platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Destination</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Destination Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Everest Base Camp"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    name="region"
                    placeholder="e.g., Solukhumbu"
                    value={formData.region}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  name="shortDescription"
                  placeholder="Brief description"
                  value={formData.shortDescription}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of the destination"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="elevation">Highest Elevation (meters)</Label>
                <Input
                  id="elevation"
                  name="highestElivation"
                  type="number"
                  placeholder="e.g., 5364"
                  value={formData.highestElivation}
                  onChange={handleFormChange}
                  required
                />
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
                {isLoading ? "Adding..." : "Add Destination"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
