"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { DestinationsList } from "@/components/admin/destinations-list"

export default function AdminDestinationsPage() {
  return (
    <AdminLayout>
          <div className="space-y-8">
        <DestinationsList />
      </div>
    </AdminLayout>
  )
}
