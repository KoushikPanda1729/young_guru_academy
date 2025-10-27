import { AppSidebar } from "../../components/dashboard/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@t2p-admin/ui/components/sidebar"
import React from "react"
import { cookies } from "next/headers"

export default async function DashboardLayout({children}: {children: React.ReactNode}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === 'true'
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      defaultOpen={defaultOpen}
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset>
          {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
