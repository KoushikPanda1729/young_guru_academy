import type { Message } from "../types/chat";
import { MessageBubble } from "./mesageBubble";

function formatDateHeader(date: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function MessageList({ messages }: { messages: Message[] }) {
  let lastDate: string | null = null;

  return (
    <div>
      {messages.map((msg) => {
        const msgDate = new Date(msg.createdAt);
        const dateLabel = formatDateHeader(msgDate);

        const showDateHeader = dateLabel !== lastDate;
        lastDate = dateLabel;

        return (
          <div key={msg.id}>
            {showDateHeader && (
              <div className="text-center text-xs text-muted-foreground my-4">
                {dateLabel}
              </div>
            )}
            <MessageBubble message={msg} />
          </div>
        );
      })}
    </div>
  );
}
