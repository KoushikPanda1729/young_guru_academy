"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/providers/auth-provider"
import { AuthCard } from "@/components/auth-card"
import { Button } from "@t2p-admin/ui/components/button"
import { toast } from "sonner"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@t2p-admin/ui/components/dialog"

export default function DeleteAccountPage() {
  const { deleteUserHandler, loading, success, error } = useAuth()
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    await deleteUserHandler()
    setOpen(false)
  }

  useEffect(() => {
    if (success) toast.success(success)
  }, [success])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
      <AuthCard
        title="Delete Account"
        description="Permanently remove your account and data"
        cardFooterLink={process.env.NEXT_PUBLIC_WEBSITE_URL}
        cardFooterDescription="Changed your mind?"
        cardFooterLinkTitle="Go back"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Deleting your account is <span className="font-semibold text-destructive">permanent</span> and cannot be undone.
            This will erase all of your data and remove your access.
          </p>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Delete My Account
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure? This will permanently delete your account and all associated data.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Confirm Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AuthCard>
  )
}
