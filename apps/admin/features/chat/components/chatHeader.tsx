import { Avatar, AvatarFallback, AvatarImage } from "@t2p-admin/ui/components/avatar"
import { Badge } from "@t2p-admin/ui/components/badge"

type ChatUser = {
  userId: string
  username: string
  role: string
}

export function ChatHeader({ chatUser, online }: { chatUser: ChatUser | null, online: boolean }) {
  if (!chatUser) return null
  
  return (
    <div className="flex flex-row items-center justify-between border-b p-4 w-full bg-background">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="border">
            <AvatarImage src="" alt="User Avatar" />
            <AvatarFallback>{chatUser.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
            online ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium leading-none">{chatUser.username}</p>
            <Badge variant={online ? "default" : "secondary"} className="text-xs">
              {online ? "Online" : "Offline"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{chatUser.userId}</p>
        </div>
      </div>
    </div>
  )
}