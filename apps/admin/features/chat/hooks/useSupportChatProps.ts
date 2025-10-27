/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import type { Message, UserListItem } from "../types/chat";

// Chat history payload type
type ChatHistory = {
  userId: string;
  adminId: string;
  page: number;
  limit: number;
  messages: Message[];
  hasMore: boolean;
  total: number;
};

interface UseSupportChatCoreProps {
  socket: Socket | null;
  currentUserId: string | null;
}

/**
 * Utility to merge + sort messages uniquely by ID
 */
function mergeMessages(existing: Message[], incoming: Message[]): Message[] {
  const messageMap = new Map(existing.map((m) => [m.id, m]));
  for (const msg of incoming) messageMap.set(msg.id, msg);

  return Array.from(messageMap.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

/**
 * Core support chat hook
 */
export function useSupportChatCore({
  socket,
  currentUserId,
}: UseSupportChatCoreProps) {
  const [userList, setUserList] = useState<UserListItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [searching, setSearching] = useState(false);

  const userListRef = useRef<UserListItem[]>([]);
  const selectedUserRef = useRef<UserListItem | null>(null);
  const hasFetchedUserList = useRef(false);
  const isWaitingForInitialData = useRef(true);

  // Message state
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior,
        block: "end",
        inline: "nearest",
      });
    });
  }, []);

  // Keep refs in sync
  useEffect(() => {
    userListRef.current = userList;
  }, [userList]);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const searchUsers = useCallback(
    (query: string) => {
      if (!socket) return;
      setSearching(true);

      socket.emit("chat:searchUsers", { query }, (response: any) => {
        if (response?.success && Array.isArray(response.users)) {
          setUserList(response.users);
        }
        setSearching(false);
      });
    },
    [socket]
  );

  /**
   * Handle incoming single message
   */
  const handleMessageReceive = useCallback(
    (message: Message) => {
      const targetUserIdForMessage = selectedUserRef.current?.userId;
      const isRelevantMessage =
        message.senderId === targetUserIdForMessage ||
        (message.receiverId === targetUserIdForMessage &&
          message.senderIsAdmin);

      if (isRelevantMessage) {
        setMessages((prevMessages) => {
          const messageMap = new Map();
          prevMessages.forEach((msg) => messageMap.set(msg.id, msg));

          const tempMessageIdToReplace = prevMessages.find(
            (m) =>
              m.id.startsWith("temp-") &&
              m.content === message.content &&
              m.senderId === message.senderId
          )?.id;

          if (tempMessageIdToReplace) {
            messageMap.delete(tempMessageIdToReplace);
          }

          messageMap.set(message.id, message);
          const updatedMessages = Array.from(messageMap.values());

          return updatedMessages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });

        setTimeout(() => scrollToBottom("smooth"), 100);
      }

      setUserList((prevUserList) => {
        return prevUserList
          .map((user) => {
            const userIdToUpdate = message.senderIsAdmin
              ? message.receiverId
              : message.senderId;
            if (user.userId === userIdToUpdate) {
              return { ...user, lastMessage: message };
            }
            return user;
          })
          .sort((a, b) => {
            const timeA = a.lastMessage
              ? new Date(a.lastMessage.createdAt).getTime()
              : 0;
            const timeB = b.lastMessage
              ? new Date(b.lastMessage.createdAt).getTime()
              : 0;
            return timeB - timeA;
          });
      });
    },
    [setUserList, scrollToBottom]
  );

  /**
   * Handle chat history payload
   */
  const handleChatHistory = useCallback(
    (data: ChatHistory) => {
      setMessages((prev) => mergeMessages(prev, data.messages));
      setHasMoreMessages(data.hasMore);
      setCurrentPage(data.page);
      setLoadingHistory(false);

      if (data.page === 1) {
        // For initial load, scroll to bottom immediately
        setTimeout(() => scrollToBottom("instant"), 50);
      }
      // For pagination (loading older messages), don't auto-scroll
    },
    [scrollToBottom]
  );

  /**
   * Handle recent messages list
   */
  const handleRecentMessages = useCallback((data: any) => {
    let incoming: Message[] = [];

    if (Array.isArray(data)) {
      const activeId = selectedUserRef.current?.userId;
      incoming = data.find((c) => c.userId === activeId)?.messages || [];
    } else if (data?.messages) {
      incoming = data.messages || [];
    }

    setMessages((prev) => mergeMessages(prev, incoming));
  }, []);

  /**
   * Load more messages (pagination)
   */
  const loadMoreMessages = useCallback(() => {
    const activeUser = selectedUserRef.current;
    if (activeUser && hasMoreMessages && !loadingHistory && socket) {
      setLoadingHistory(true);
      socket.emit("chat:getChatHistory", {
        userId: activeUser.userId,
        page: currentPage + 1,
        limit: 50,
      });
    }
  }, [socket, hasMoreMessages, loadingHistory, currentPage]);

  /**
   * Add a temporary message (optimistic UI)
   */
  const addTemporaryMessage = useCallback(
    (tempMessage: Message, user: UserListItem) => {
      setMessages((prev) => mergeMessages(prev, [tempMessage]));
      setUserList((prev) =>
        [...prev]
          .map((u) =>
            u.userId === user.userId ? { ...u, lastMessage: tempMessage } : u
          )
          .sort((a, b) => {
            const timeA = a.lastMessage
              ? new Date(a.lastMessage.createdAt).getTime()
              : 0;
            const timeB = b.lastMessage
              ? new Date(b.lastMessage.createdAt).getTime()
              : 0;
            return timeB - timeA;
          })
      );

      setTimeout(() => scrollToBottom("smooth"), 50);
    },
    [scrollToBottom]
  );

  const removeTemporaryMessage = useCallback((tempId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== tempId));
  }, []);

  /**
   * Handle user list
   */
  const handleUserList = useCallback((users: UserListItem[]) => {
    const sorted = [...users].sort((a, b) => {
      const timeA = a.lastMessage
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const timeB = b.lastMessage
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;
      if (timeA && timeB) return timeB - timeA;
      if (timeA) return -1;
      if (timeB) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
    setUserList(sorted);
    setOnlineUsers(new Set(users.filter((u) => u.online).map((u) => u.userId)));
    hasFetchedUserList.current = true;
  }, []);

  const handleInitialData = useCallback(
    (data: { userList: UserListItem[]; recentChats: any[] }) => {
      console.log("📥 Received initial data");
      handleUserList(data.userList);
      hasFetchedUserList.current = true;
      isWaitingForInitialData.current = false; // Mark that we've received initial data

      if (data.recentChats?.length > 0) {
        const activeId = selectedUserRef.current?.userId;
        const chat = data.recentChats.find((c) => c.userId === activeId);
        if (chat) {
          setMessages((prev) => mergeMessages(prev, chat.messages));
        }
      }
    },
    [handleUserList]
  );

  const handleUserLocked = useCallback(
    ({ lockedBy, message }: { lockedBy: string; message: string }) => {
      toast.warning(`${message} (Locked by: ${lockedBy})`);
      setUserList((prev) =>
        prev.map((u) =>
          u.userId === selectedUserRef.current?.userId
            ? { ...u, locked: true, lockedBy }
            : u
        )
      );
    },
    []
  );

  /**
   * Select user
   */
  const selectUser = useCallback(
    (user: UserListItem) => {
      if (!socket || !currentUserId) return;
      if (selectedUser?.userId === user.userId) return;

      setSelectedUser(user);
      localStorage.setItem("lastSelectedUserId", user.userId);
      setLoadingHistory(true);
      setMessages([]);
      setCurrentPage(1);
      setHasMoreMessages(false);

      socket.emit("chat:getChatHistory", {
        userId: user.userId,
        page: 1,
        limit: 50,
      });

      setTimeout(() => scrollToBottom("instant"), 200);
    },
    [socket, currentUserId, selectedUser, scrollToBottom]
  );

  const handleUserStatus = useCallback(
    ({ userId, online }: { userId: string; online: boolean }) => {
      setUserList((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, online } : u))
      );
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (online) next.add(userId);
        else next.delete(userId);
        return next;
      });
    },
    []
  );

  /**
   * Refresh user list - only for manual refresh after initial data is received
   */
  const refreshUserList = useCallback(() => {
    if (!socket?.connected) return;

    // Don't fetch if we're still waiting for initial data
    if (isWaitingForInitialData.current) {
      console.log("⏳ Skipping getUserList; waiting for initialData");
      return;
    }

    // Only refresh if we've already received initial data and need to update
    if (!hasFetchedUserList.current) {
      console.log("⏳ Skipping getUserList; no initial data yet");
      return;
    }

    console.log("🔄 Manually refreshing user list");
    socket.emit("chat:getUserList");
  }, [socket]);

  // --- Socket event bindings ---
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log("✅ Socket connected, waiting for initialData");
      // Don't fetch user list here - let initialData handle it
    };

    if (socket.connected && !hasFetchedUserList.current) {
      handleConnect();
    }

    socket.on("connect", handleConnect);
    socket.on("chat:userList", handleUserList);
    socket.on("chat:userLocked", handleUserLocked);
    socket.on("message:receive", handleMessageReceive);
    socket.on("chat:chatHistory", handleChatHistory);
    socket.on("chat:recentMessages", handleRecentMessages);
    socket.on("chat:initialData", handleInitialData);
    socket.on("chat:userStatus", handleUserStatus);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("chat:userList", handleUserList);
      socket.off("chat:userLocked", handleUserLocked);
      socket.off("message:receive", handleMessageReceive);
      socket.off("chat:chatHistory", handleChatHistory);
      socket.off("chat:recentMessages", handleRecentMessages);
      socket.off("chat:initialData", handleInitialData);
      socket.off("chat:userStatus", handleUserStatus);
    };
  }, [
    socket,
    handleUserList,
    handleUserLocked,
    handleMessageReceive,
    handleChatHistory,
    handleRecentMessages,
    handleInitialData,
    handleUserStatus,
  ]);

  return {
    userList,
    selectedUser,
    onlineUsers,
    messages,
    loadingHistory,
    currentPage,
    hasMoreMessages,
    messagesEndRef,

    // actions
    setUserList,
    setSelectedUser,
    setOnlineUsers,
    setMessages,
    setCurrentPage,
    setHasMoreMessages,

    selectUser,
    refreshUserList,
    loadMoreMessages,
    addTemporaryMessage,
    removeTemporaryMessage,
    searchUsers,
    searching,
    scrollToBottom,
  };
}
