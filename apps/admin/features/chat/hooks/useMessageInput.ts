"use client";

import { useCallback, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
import {
  Message,
  MessageSendPayload,
  UseMessageInputReturn,
  UserListItem,
} from "../types/chat";

export function useMessageInput(
  socket: Socket | null,
  currentUserId: string | null,
  selectedUser: UserListItem | null,
  addTemporaryMessage: (
    tempMessage: Message,
    selectedUser: UserListItem
  ) => void,
  removeTemporaryMessage: (tempMessageId: string) => void
): UseMessageInputReturn {
  const [input, setInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const offlineQueueRef = useRef<MessageSendPayload[]>([]);

  const createTemporaryMessage = useCallback(
    (
      content: string,
      selectedUser: UserListItem,
      currentUserId: string
    ): Message => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      content,
      senderId: currentUserId,
      receiverId: selectedUser.userId,
      senderIsAdmin: true,
      createdAt: new Date().toISOString(),
      type: "TEXT",
      read: true,
      chatId: selectedUser.userId,
      deliveryStatus: "PENDING",
    }),
    []
  );

  const sendMessage = useCallback(() => {
    if (!input.trim() || !selectedUser || !currentUserId || sendingMessage)
      return;

    const messageContent = input.trim();
    setInput("");
    setSendingMessage(true);

    const payload: MessageSendPayload = {
      userId: selectedUser.userId,
      adminId: currentUserId,
      content: messageContent,
      senderIsAdmin: true,
      type: "TEXT",
    };

    const tempMessage = createTemporaryMessage(
      messageContent,
      selectedUser,
      currentUserId
    );
    addTemporaryMessage(tempMessage, selectedUser);

    try {
      if (socket?.connected) {
        socket.emit("message:send", payload);
      } else {
        offlineQueueRef.current.push(payload);
        toast.warning("Offline: Message queued for sending");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      removeTemporaryMessage(tempMessage.id);
    } finally {
      setSendingMessage(false);
    }
  }, [
    input,
    selectedUser,
    currentUserId,
    sendingMessage,
    socket,
    createTemporaryMessage,
    addTemporaryMessage,
    removeTemporaryMessage,
  ]);

  const handleSendMessage = useCallback(() => {
    if (!input.trim() || !selectedUser || sendingMessage || !currentUserId)
      return;
    sendMessage();
  }, [input, selectedUser, currentUserId, sendingMessage, sendMessage]);

  if (socket) {
    socket.on("connect", () => {
      while (offlineQueueRef.current.length > 0) {
        const queued = offlineQueueRef.current.shift();
        if (queued) socket.emit("message:send", queued);
      }
    });
  }

  return {
    input,
    setInput,
    sendingMessage,
    setSendingMessage,
    sendMessage,
    handleSendMessage,
  };
}
