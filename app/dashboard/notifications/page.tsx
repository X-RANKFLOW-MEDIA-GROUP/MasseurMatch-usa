"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  CreditCard,
  Calendar,
  MessageSquare,
  Star,
  Shield,
  Camera,
  Settings,
  Loader2,
  ChevronRight,
  BellOff,
} from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import Link from "next/link";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: "low" | "normal" | "high" | "urgent";
  read: boolean;
  action_url?: string;
  created_at: string;
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "payment_past_due":
    case "payment_failed":
      return <CreditCard className="h-5 w-5" />;
    case "subscription_renewing":
    case "subscription_renewed":
    case "subscription_cancelled":
    case "subscription_expired":
      return <Calendar className="h-5 w-5" />;
    case "identity_verified":
      return <Shield className="h-5 w-5" />;
    case "photo_approved":
    case "photo_rejected":
      return <Camera className="h-5 w-5" />;
    case "new_message":
      return <MessageSquare className="h-5 w-5" />;
    case "new_review":
      return <Star className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "border-red-500/50 bg-red-500/10";
    case "high":
      return "border-amber-500/50 bg-amber-500/10";
    case "normal":
      return "border-white/10 bg-white/5";
    case "low":
      return "border-white/5 bg-white/[0.02]";
    default:
      return "border-white/10 bg-white/5";
  }
};

const getPriorityIconColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "text-red-400";
    case "high":
      return "text-amber-400";
    default:
      return "text-white";
  }
};

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/dashboard/notifications");
      return;
    }

    try {
      const params = new URLSearchParams();
      if (filter === "unread") {
        params.append("unread", "true");
      }

      const res = await fetch(`/api/notifications?${params.toString()}`);
      const data = await res.json();

      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }

    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    setActionLoading(notificationId);

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }

    setActionLoading(null);
  };

  const markAllAsRead = async () => {
    setActionLoading("all");

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }

    setActionLoading(null);
  };

  const deleteNotification = async (notificationId: string) => {
    setActionLoading(notificationId);

    try {
      await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      const notification = notifications.find((n) => n.id === notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }

    setActionLoading(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    if (notification.action_url) {
      router.push(notification.action_url);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-200" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-slate-400">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            disabled={actionLoading === "all"}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
          >
            {actionLoading === "all" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-white text-white"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            filter === "unread"
              ? "bg-white text-white"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center"
            >
              <BellOff className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No notifications
              </h3>
              <p className="text-slate-400">
                {filter === "unread"
                  ? "You're all caught up!"
                  : "You don't have any notifications yet"}
              </p>
            </motion.div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border p-4 transition-colors ${getPriorityStyles(
                  notification.priority
                )} ${!notification.read ? "border-l-4 border-l-white" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2.5 rounded-xl bg-white/5 ${getPriorityIconColor(
                      notification.priority
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`font-medium ${
                          notification.read ? "text-slate-300" : "text-white"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        notification.read ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {notification.message}
                    </p>
                    {notification.action_url && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-white">
                        <span>View details</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        disabled={actionLoading === notification.id}
                        className="p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                        title="Mark as read"
                      >
                        {actionLoading === notification.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      disabled={actionLoading === notification.id}
                      className="p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Payment past due banner */}
      {notifications.some(
        (n) =>
          (n.type === "payment_past_due" || n.type === "payment_failed") &&
          !n.read
      ) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-white font-medium">Payment Action Required</p>
              <p className="text-sm text-slate-400 mt-1">
                Your subscription payment has failed. Update your payment method
                to avoid service interruption.
              </p>
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-1 mt-3 text-sm text-red-400 hover:text-red-300"
              >
                Update payment method
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
