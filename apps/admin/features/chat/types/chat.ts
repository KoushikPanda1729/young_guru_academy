import type { Socket } from "socket.io-client";

export interface UserListItem {
  userId: string;
  name: string;
  lastMessage: Message | null;
  online: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE" | "AUDIO";
  replyTo?: string | null;
  metadata?: typeof JSON;
  createdAt: string;
  updatedAt?: string;
  deliveryStatus: "PENDING" | "SENT" | "DELIVERED" | "READ";
  senderIsAdmin: boolean;
  read?: boolean;
}

export interface ChatHistory {
  userId: string;
  adminId: string;
  page: number;
  limit: number;
  messages: Message[];
  hasMore: boolean;
  total: number;
}

export interface MessageSendPayload {
  userId: string;
  adminId: string;
  content: string;
  senderIsAdmin: boolean;
  type?: "TEXT" | "IMAGE" | "FILE" | "AUDIO";
  replyTo?: string;
  metadata?: typeof JSON;
}

export interface UseSocketConnectionReturn {
  socket: Socket | null;
  currentUserId: string | null;
  loading: boolean;
}

export interface UseChatUsersReturn {
  userList: UserListItem[];
  setUserList: React.Dispatch<React.SetStateAction<UserListItem[]>>;
  selectedUser: UserListItem | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserListItem | null>>;
  onlineUsers: Set<string>;
  setOnlineUsers: React.Dispatch<React.SetStateAction<Set<string>>>;
  userListRef: React.MutableRefObject<UserListItem[]>;
  selectedUserRef: React.MutableRefObject<UserListItem | null>;
  selectUser: (user: UserListItem) => void;
  refreshUserList: () => void;
}

export interface UseChatMessagesReturn {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  loadingHistory: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  hasMoreMessages: boolean;
  setHasMoreMessages: React.Dispatch<React.SetStateAction<boolean>>;
  messagesEndRef: React.MutableRefObject<HTMLDivElement | null>;
  loadMoreMessages: (selectedUser: UserListItem | null) => void;
  addTemporaryMessage: (
    tempMessage: Message,
    selectedUser: UserListItem
  ) => void;
  removeTemporaryMessage: (tempMessageId: string) => void;
}

export interface UseMessageInputReturn {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendingMessage: boolean;
  setSendingMessage: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: () => void;
  handleSendMessage: () => void;
}

export interface UseSupportChatReturn {
  loading: boolean;
  currentUserId: string | null;
  userList: UserListItem[];
  selectedUser: UserListItem | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserListItem | null>>;
  onlineUsers: Set<string>;
  selectUser: (user: UserListItem) => void;
  refreshUserList: () => void;
  messages: Message[];
  loadingHistory: boolean;
  hasMoreMessages: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  loadMoreMessages: () => void;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  searchUsers: (term: string) => void;
  searching: boolean;
  sendingMessage: boolean;
  handleSendMessage: () => void;
  scrollToBottom: (behavior: ScrollBehavior) => void;
  socketRef: { current: Socket | null };
}
