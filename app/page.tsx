import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, MapPin, Star, Users, Shield, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const popularDestinations = [
    {
      id: 1,
      name: "Everest Base Camp",
      district: "Solukhumbu",
      province: "Province 1",
      image: "/placeholder.svg?height=300&width=400",
      accommodations: 24,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Annapurna Circuit",
      district: "Manang",
      province: "Gandaki",
      image: "/placeholder.svg?height=300&width=400",
      accommodations: 18,
      rating: 4.7,
    },
    {
      id: 3,
      name: "Langtang Valley",
      district: "Rasuwa",
      province: "Bagmati",
      image: "/placeholder.svg?height=300&width=400",
      accommodations: 12,
      rating: 4.6,
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Verified Accommodations",
      description: "All tea houses and hotels are verified by our team for quality and safety",
    },
    {
      icon: Clock,
      title: "Real-time Booking",
      description: "Instant confirmation with live availability updates",
    },
    {
      icon: Users,
      title: "Trusted Reviews",
      description: "Authentic reviews from fellow trekkers to help you choose",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Mountain className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Trek Nepal with
              <span className="text-blue-600 block">Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover and book verified accommodations for your Himalayan adventure. From cozy tea houses to
              comfortable lodges, find your perfect stay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/destinations">Explore Destinations</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                <Link href="/auth/signup">Join TrekMate</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TrekMate?</h2>
            <p className="text-lg text-gray-600">Transparent, reliable, and designed for trekkers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-lg text-gray-600">Discover the most loved trekking routes in Nepal</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {popularDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600">{destination.accommodations} Stays</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {destination.district}, {destination.province}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{destination.rating}</span>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/destinations/${destination.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/destinations">View All Destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of trekkers who trust TrekMate for their Himalayan journeys
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-3">
            <Link href="/auth/signup">Start Your Journey</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
