"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { BookingsList } from "@/components/admin/bookings-list"

export default function AdminBookingsPage() {
  return (
    <AdminLayout>
      <BookingsList />
    </AdminLayout>
  )
}
