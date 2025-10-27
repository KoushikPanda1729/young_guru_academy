import { Message } from "../types/chat";

export function MessageBubble({ message }: { message: Message }) {
  const senderIsAdmin = message.senderIsAdmin;

  const messageTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex flex-col mb-4 ${
        senderIsAdmin ? "items-end" : "items-start"
      }`}
    >
      <div className={`max-w-[70%] rounded-lg px-4 py-2 bg-muted`}>
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>
      <span
        className={`text-xs mt-1 ${
          senderIsAdmin ? "text-primary-foreground/70" : "text-muted-foreground"
        }`}
      >
        {messageTime}
      </span>
    </div>
  );
}
