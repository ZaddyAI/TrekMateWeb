import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, MapPin, Users, Star, Shield, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const featuredDestinations = [
    {
      id: 1,
      name: "Everest Base Camp",
      district: "Solukhumbu",
      province: "Province 1",
      image: "/placeholder.svg?height=300&width=400&text=Everest+Base+Camp",
      rating: 4.8,
      reviews: 1247,
    },
    {
      id: 2,
      name: "Annapurna Circuit",
      district: "Manang",
      province: "Gandaki",
      image: "/placeholder.svg?height=300&width=400&text=Annapurna+Circuit",
      rating: 4.7,
      reviews: 892,
    },
    {
      id: 3,
      name: "Langtang Valley",
      district: "Rasuwa",
      province: "Bagmati",
      image: "/placeholder.svg?height=300&width=400&text=Langtang+Valley",
      rating: 4.6,
      reviews: 634,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TrekMate</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/destinations" className="text-gray-600 hover:text-gray-900">
              Destinations
            </Link>
            <Link href="/accommodations" className="text-gray-600 hover:text-gray-900">
              Stay
            </Link>
            <Link href="/transportation" className="text-gray-600 hover:text-gray-900">
              Transport
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Transparent Booking Platform</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Nepal's
              <span className="text-blue-600 block">Trekking Paradise</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Book authentic accommodations and reliable transportation for your Himalayan adventure. Fair pricing,
              real-time confirmations, and trusted local partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/destinations">Explore Destinations</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                <Link href="/partner/register">Become a Partner</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose TrekMate?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to making your trekking experience transparent, safe, and memorable.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Verified Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  All accommodations and transport providers are verified and approved by our team for quality and
                  safety.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get instant booking confirmations and live updates about your reservations through our platform.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Community Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Make informed decisions with honest reviews from fellow trekkers who've been there before.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-xl text-gray-600">Discover the most loved trekking routes in Nepal</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{destination.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      {destination.district}, {destination.province}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{destination.reviews} reviews from fellow trekkers</p>
                  <Button className="w-full" asChild>
                    <Link href={`/destinations/${destination.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of trekkers who trust TrekMate for their Himalayan journeys.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link href="/auth/register">Start Planning Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mountain className="h-6 w-6" />
                <span className="text-xl font-bold">TrekMate</span>
              </div>
              <p className="text-gray-400">Your trusted companion for transparent trekking bookings in Nepal.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Destinations</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/destinations/everest" className="hover:text-white">
                    Everest Region
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/annapurna" className="hover:text-white">
                    Annapurna Region
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/langtang" className="hover:text-white">
                    Langtang Region
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/accommodations" className="hover:text-white">
                    Accommodations
                  </Link>
                </li>
                <li>
                  <Link href="/transportation" className="hover:text-white">
                    Transportation
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-white">
                    Local Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TrekMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
