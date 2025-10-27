"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@t2p-admin/ui/components/avatar"
import { UserListItem as UserListType } from "../types/chat"


export function UserListItem({ 
  user, 
  isSelected, 
  onClick 
}: { 
  user: UserListType
  isSelected: boolean
  onClick: () => void 
}) {
  const lastMessageTime = user.lastMessage?.createdAt 
    ? new Date(user.lastMessage.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : ""

  return (
    <button
      onClick={onClick}
      className={`block w-full text-left rounded-lg p-3 transition-all hover:bg-muted/50 disabled:opacity-60 disabled:cursor-not-allowed ${
        isSelected ? "bg-primary/10 border-primary/20 border" : "border border-transparent"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <Avatar className="w-10 h-10 border">
            <AvatarImage src="" alt="User Avatar" />
            <AvatarFallback className="text-xs">{user.name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-background ${
            user.online ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm truncate">{user.name}</p>
            </div>
            {lastMessageTime && (
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {lastMessageTime}
              </span>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {user.lastMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>
    </button>
  )
}
