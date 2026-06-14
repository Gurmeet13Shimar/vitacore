import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  category: "health" | "finance" | "career" | "system";
  priority: "low" | "medium" | "high" | "critical";
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  fetchNotifications: (params?: { category?: string; read?: boolean; search?: string; page?: number; limit?: number }) => Promise<any>;
  refetchUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  const fetchNotifications = async (params: { category?: string; read?: boolean; search?: string; page?: number; limit?: number } = {}) => {
    if (!isLoggedIn || !user) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/notifications", { params });
      setNotifications(res.data.notifications || []);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const refetchUnreadCount = async () => {
    if (!isLoggedIn || !user) return;
    try {
      const res = await axios.get("http://localhost:5000/api/notifications/unread-count");
      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const markRead = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.patch("http://localhost:5000/api/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      const wasUnread = notifications.find((n) => n._id === id)?.read === false;
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user && user.token) {
      // Fetch initial state
      fetchNotifications({ limit: 10 });
      refetchUnreadCount();

      // Establish Socket.IO connection
      const socket = io("http://localhost:5000", {
        auth: {
          token: user.token,
        },
        transports: ["websocket", "polling"],
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("[Socket.IO] Connected to notification server");
      });

      socket.on("newNotification", (newNotification: Notification) => {
        console.log("[Socket.IO] Received new notification:", newNotification);
        setNotifications((prev) => {
          // Prevent duplicates just in case
          if (prev.some((n) => n._id === newNotification._id)) return prev;
          return [newNotification, ...prev];
        });
        setUnreadCount((prev) => prev + 1);
      });

      socket.on("connect_error", (err) => {
        console.error("[Socket.IO] Connection error:", err.message);
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isLoggedIn, user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markRead,
        markAllRead,
        deleteNotification,
        fetchNotifications,
        refetchUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
