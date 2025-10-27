"use client";
import { Button } from "@t2p-admin/ui/components/button";
import { Badge } from "@t2p-admin/ui/components/badge";
import { ScrollArea } from "@t2p-admin/ui/components/scroll-area";
import { MessageSquare, Send, Users, Loader2 } from "lucide-react";
import { AutosizeTextarea } from "./autosizeTextArea";
import { ChatHeader } from "./chatHeader";
import { UserListItem } from "./userList";
import { useSupportChat } from "../hooks/useSupportChat";
import { useEffect, useState } from "react";
import { MessageList } from "./mesageList";
import { Header } from "../../../components/dashboard/page-header";
import { IconMessage } from "@tabler/icons-react";

export function SupportChatClient() {
  const {
    loading,
    currentUserId,
    userList,
    selectedUser,
    onlineUsers,
    selectUser,
    refreshUserList,
    searchUsers,
    searching,

    messages,
    hasMoreMessages,
    messagesEndRef,
    loadMoreMessages,

    input,
    setInput,
    sendingMessage,
    handleSendMessage,
    scrollToBottom,
  } = useSupportChat();

  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom("smooth");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length, scrollToBottom]);

  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      scrollToBottom("instant");
    }
  }, [selectedUser, messages.length, scrollToBottom]);

  useEffect(() => {
    if (userList.length > 0 && !selectedUser) {
      const lastUserId = localStorage.getItem("lastSelectedUserId");
      const found = userList.find((u) => u.userId === lastUserId);

      if (found) {
        selectUser(found); // ✅ Restore previous chat
      } else {
        const recent = [...userList].sort((a, b) => {
          const timeA = a.lastMessage
            ? new Date(a.lastMessage.createdAt).getTime()
            : 0;
          const timeB = b.lastMessage
            ? new Date(b.lastMessage.createdAt).getTime()
            : 0;
          return timeB - timeA;
        })[0];
        if (recent) selectUser(recent);
      }
    }
  }, [userList, selectedUser, selectUser]);

  useEffect(() => {
    if (searchTerm.trim() === "" && !hasSearched) {
      return;
    }

    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        setHasSearched(true);
        searchUsers(searchTerm);
      } else if (hasSearched) {
        refreshUserList();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchUsers, refreshUserList, hasSearched]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Connecting to chat server...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="pb-4">
        <Header
          icon={<IconMessage className="w-8 h-8 text-primary" />}
          title="Support Chat"
          description="Talk to your users in real-time."
        />
      </section>

      <div className="flex h-[calc(100vh-6rem)] bg-background border shadow-sm overflow-hidden">
        {/* User List Sidebar */}
        <div className="w-80 border-r flex flex-col bg-muted/30">
          <div className="p-4 border-b bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <h2 className="font-semibold">Active Chats</h2>
                <Badge variant="secondary">{userList.length}</Badge>
              </div>
            </div>
            <div className="mt-3">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 p-2 overflow-y-auto">
            {searching ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Searching...
              </div>
            ) : userList.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No users found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {userList
                  .filter((u) =>
                    currentUserId ? u.userId !== currentUserId : true
                  )
                  .map((user) => (
                    <UserListItem
                      key={user.userId}
                      user={user}
                      isSelected={selectedUser?.userId === user.userId}
                      onClick={() => selectUser(user)}
                    />
                  ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <ChatHeader
                chatUser={{
                  userId: selectedUser.userId,
                  username: selectedUser.name,
                  role: "user",
                }}
                online={onlineUsers.has(selectedUser.userId)}
              />

              {/* Messages */}
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="flex flex-col px-4 py-3 space-y-3 bg-background">
                  {hasMoreMessages && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadMoreMessages}
                        className="text-xs bg-transparent"
                      >
                        Load older messages
                      </Button>
                    </div>
                  )}

                  <MessageList messages={messages} />

                  {messages.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} className="h-1" />
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4 bg-background">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                    setTimeout(() => scrollToBottom("smooth"), 50);
                  }}
                  className="flex items-end gap-2"
                >
                  <AutosizeTextarea
                    id="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    placeholder="Type your message..."
                    className="flex-grow resize-none rounded-xl border border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={sendingMessage}
                  />

                  <Button
                    type="submit"
                    disabled={sendingMessage || !input.trim()}
                    className="h-10 w-10 p-0 rounded-full"
                    aria-label="Send message"
                  >
                    {sendingMessage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-muted-foreground">
              Select a user from the list to start chatting.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
