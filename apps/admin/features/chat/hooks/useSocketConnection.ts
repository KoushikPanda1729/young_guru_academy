"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { token as JwtToken, useSession } from "@/features/auth/core/auth";
import { UseSocketConnectionReturn } from "../types/chat";

export function useSocketConnection(): UseSocketConnectionReturn {
  const { data: session } = useSession();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (session?.user?.id && session.user.role) {
      setCurrentUserId(session.user.id);
    }
  }, [session]);

  useEffect(() => {
    if (!currentUserId || !session) return;

    const initializeSocket = async () => {
      try {
        setLoading(true);

        const tokenData = await JwtToken();
        if (!tokenData) {
          toast.error("❌ Failed to get authentication token");
          setLoading(false);
          return;
        }

        const socketIO = io(
          process.env.NEXT_PUBLIC_CHAT_URL || "http://localhost:3002",
          {
            auth: { token: tokenData.data!.token },
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            autoConnect: false,
          }
        );

        socketRef.current = socketIO;

        socketIO.on("connect", () => {
          console.log("✅ Connected to chat server");
          toast.success("Connected to chat server");
          setLoading(false);
        });

        socketIO.on("connect_error", (error) => {
          console.error("❌ Connection error:", error.message);
          toast.error("Failed to connect to chat server");
          setLoading(false);
        });

        socketIO.on("disconnect", (reason) => {
          console.warn("🚫 Disconnected from chat server:", reason);
          toast.warning("Disconnected: " + reason);
          setLoading(true);
        });

        socketIO.io.on("reconnect_attempt", async () => {
          const freshToken = await JwtToken();
          if (freshToken) {
            socketIO.auth = { token: freshToken.data!.token };
          }
        });
        socketIO.connect();
      } catch (err) {
        console.error("Failed to initialize socket:", err);
        toast.error("Failed to initialize chat client");
        setLoading(false);
      }
    };

    initializeSocket();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId, session]);

  return {
    socket: socketRef.current,
    currentUserId,
    loading,
  };
}
