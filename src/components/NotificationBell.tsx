"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  CreditCard,
  Calendar,
  MessageSquare,
  Star,
  Shield,
  Camera,
  ChevronRight,
  Loader2,
} from "lucide-react";

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
      return <CreditCard className="h-4 w-4" />;
    case "subscription_renewing":
    case "subscription_renewed":
      return <Calendar className="h-4 w-4" />;
    case "identity_verified":
      return <Shield className="h-4 w-4" />;
    case "photo_approved":
    case "photo_rejected":
      return <Camera className="h-4 w-4" />;
    case "new_message":
      return <MessageSquare className="h-4 w-4" />;
    case "new_review":
      return <Star className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const PRIORITY_STYLES: Record<Notification["priority"], string> = {
  urgent: "bg-red-500/20 text-red-400",
  high: "bg-amber-500/20 text-amber-400",
  normal: "bg-white/10 text-white",
  low: "bg-white/10 text-white",
};

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications?unread=true&limit=5");
        const data = await res.json();

        if (isMounted && data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching notifications:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchNotifications();

    // Refresh every 60 seconds
    const interval = setInterval(() => {
      void fetchNotifications();
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const markAsRead = async (notificationId: string) => {
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
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.action_url) {
      router.push(notification.action_url);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return "Now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-xs font-medium text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-[#0a0a0f] shadow-xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="font-semibold text-white">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Notifications list */}
              <div className="max-h-[320px] overflow-y-auto">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-neutral-200" />
                  </div>
                )}

                {!loading && notifications.length === 0 && (
                  <div className="py-8 text-center">
                    <Bell className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No new notifications</p>
                  </div>
                )}

                {!loading && notifications.length > 0 && (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors ${
                          !notification.read ? "bg-neutral-200/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${PRIORITY_STYLES[notification.priority]}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-sm font-medium truncate ${
                                  notification.read
                                    ? "text-slate-300"
                                    : "text-white"
                                }`}
                              >
                                {notification.title}
                              </p>
                              <span className="text-xs text-slate-500 whitespace-nowrap">
                                {formatTime(notification.created_at)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-neutral-200 flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dashboard/notifications");
                  }}
                  className="w-full px-4 py-3 text-sm text-white hover:text-neutral-300 hover:bg-white/5 flex items-center justify-center gap-1 transition-colors"
                >
                  View all notifications
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
