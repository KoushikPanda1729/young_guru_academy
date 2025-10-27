"use client"

import { Button } from "@t2p-admin/ui/components/button"
import { IconLock } from "@tabler/icons-react"
import { useAuth } from "@/features/auth/provider/auth-provider"

export default function UnauthorizedPage() {
  const { logout } = useAuth()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted px-4">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-md max-w-md text-center">
        <div className="flex justify-center mb-4">
          <IconLock className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don’t have permission to access this page.
        </p>
        <Button variant="destructive" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    </div>
  )
}
