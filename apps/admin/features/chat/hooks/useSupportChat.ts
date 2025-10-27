import { UseSupportChatReturn } from "../types/chat";

import { useMessageInput } from "./useMessageInput";
import { useSocketConnection } from "./useSocketConnection";
import { useSupportChatCore } from "./useSupportChatProps";

export function useSupportChat(): UseSupportChatReturn {
  const { socket, currentUserId, loading } = useSocketConnection();

  const {
    userList,
    selectedUser,
    setSelectedUser,
    onlineUsers,
    selectUser,
    refreshUserList,

    messages,
    loadingHistory,
    hasMoreMessages,
    messagesEndRef,
    loadMoreMessages,
    addTemporaryMessage,
    removeTemporaryMessage,
    searchUsers,
    scrollToBottom,
    searching,
  } = useSupportChatCore({ socket, currentUserId });

  const { input, setInput, sendingMessage, handleSendMessage } =
    useMessageInput(
      socket,
      currentUserId,
      selectedUser,
      addTemporaryMessage,
      removeTemporaryMessage
    );

  return {
    loading,
    currentUserId,

    userList,
    selectedUser,
    setSelectedUser,
    onlineUsers,
    selectUser,
    refreshUserList,

    messages,
    loadingHistory,
    hasMoreMessages,
    messagesEndRef,
    loadMoreMessages,

    input,
    setInput,
    sendingMessage,
    handleSendMessage,
    searchUsers,
    searching,
    scrollToBottom,

    socketRef: { current: socket },
  };
}
