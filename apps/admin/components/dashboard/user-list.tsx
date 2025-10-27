"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@t2p-admin/ui/components/avatar"
import { ScrollArea } from "@t2p-admin/ui/components/scroll-area"
import { Input } from "@t2p-admin/ui/components/input"
import { cn } from "@t2p-admin/ui/lib/utils"
import { IconMessage } from "@tabler/icons-react"

export type ChatUser = {
  name: string
  email: string
  avatar: string
}

interface UserListProps {
  users: ChatUser[]
  activeUser: ChatUser | null
  onUserSelect: (user: ChatUser) => void
}

export function UserList({ users, activeUser, onUserSelect }: UserListProps) {
  const [search, setSearch] = React.useState("")

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase()
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  })

  return (
    <aside className="min-w-[280px] max-w-[380px] h-full border-r bg-background flex flex-col">
      <div className="p-2 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2 pb-2">
          <IconMessage className="text-primary"/>
          Chats
        </h2>
        <Input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.email}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors",
                  activeUser?.email === user.email
                    ? "bg-muted"
                    : "hover:bg-muted/50"
                )}
                onClick={() => onUserSelect(user)}
              >
                <Avatar className="border">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-tight">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground text-sm py-4">No users found.</p>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
