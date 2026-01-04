import { SupabaseClient } from "@supabase/supabase-js";

export type NotificationType =
  | "payment_past_due"
  | "payment_failed"
  | "subscription_renewing"
  | "subscription_renewed"
  | "subscription_cancelled"
  | "subscription_expired"
  | "identity_verified"
  | "photo_approved"
  | "photo_rejected"
  | "new_message"
  | "new_review"
  | "system";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  action_url?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  expires_at?: string;
}

export interface CreateNotificationParams {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  action_url?: string;
  metadata?: Record<string, unknown>;
  expires_at?: string;
  send_email?: boolean;
}

// Notification templates
export const NOTIFICATION_TEMPLATES = {
  payment_past_due: {
    title: "Payment Past Due",
    message: (amount: string, days: number) =>
      `Your payment of ${amount} is ${days} day${days > 1 ? 's' : ''} past due. Please update your payment method to avoid service interruption.`,
    priority: "urgent" as NotificationPriority,
    action_url: "/dashboard/billing",
  },
  payment_failed: {
    title: "Payment Failed",
    message: (amount: string) =>
      `We were unable to process your payment of ${amount}. Please update your payment method.`,
    priority: "high" as NotificationPriority,
    action_url: "/dashboard/billing",
  },
  subscription_renewing: {
    title: "Subscription Renewing Soon",
    message: (plan: string, date: string, amount: string) =>
      `Your ${plan} subscription will renew on ${date} for ${amount}. No action needed unless you want to make changes.`,
    priority: "normal" as NotificationPriority,
    action_url: "/dashboard/billing",
  },
  subscription_renewed: {
    title: "Subscription Renewed",
    message: (plan: string, amount: string) =>
      `Your ${plan} subscription has been renewed successfully. Amount charged: ${amount}.`,
    priority: "low" as NotificationPriority,
    action_url: "/dashboard/billing",
  },
  subscription_cancelled: {
    title: "Subscription Cancelled",
    message: (endDate: string) =>
      `Your subscription has been cancelled. You'll have access until ${endDate}.`,
    priority: "normal" as NotificationPriority,
    action_url: "/pricing",
  },
  subscription_expired: {
    title: "Subscription Expired",
    message: () =>
      `Your subscription has expired. Upgrade now to continue enjoying premium features.`,
    priority: "high" as NotificationPriority,
    action_url: "/pricing",
  },
};

export class NotificationService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async create(params: CreateNotificationParams): Promise<Notification | null> {
    const { data, error } = await this.supabase
      .from("notifications")
      .insert({
        user_id: params.user_id,
        type: params.type,
        title: params.title,
        message: params.message,
        priority: params.priority || "normal",
        action_url: params.action_url,
        metadata: params.metadata,
        expires_at: params.expires_at,
        read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating notification:", error);
      return null;
    }

    return data;
  }

  async getUnread(userId: string): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    return data || [];
  }

  async getAll(userId: string, limit = 50, offset = 0): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    return data || [];
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)
      .eq("user_id", userId);

    return !error;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    return !error;
  }

  async delete(notificationId: string, userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", userId);

    return !error;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      console.error("Error counting notifications:", error);
      return 0;
    }

    return count || 0;
  }

  // Helper methods for common notifications
  async notifyPastDue(userId: string, amount: string, daysPastDue: number): Promise<Notification | null> {
    const template = NOTIFICATION_TEMPLATES.payment_past_due;
    return this.create({
      user_id: userId,
      type: "payment_past_due",
      title: template.title,
      message: template.message(amount, daysPastDue),
      priority: template.priority,
      action_url: template.action_url,
      metadata: { amount, days_past_due: daysPastDue },
      send_email: true,
    });
  }

  async notifyPaymentFailed(userId: string, amount: string): Promise<Notification | null> {
    const template = NOTIFICATION_TEMPLATES.payment_failed;
    return this.create({
      user_id: userId,
      type: "payment_failed",
      title: template.title,
      message: template.message(amount),
      priority: template.priority,
      action_url: template.action_url,
      metadata: { amount },
      send_email: true,
    });
  }

  async notifyRenewalReminder(
    userId: string,
    plan: string,
    renewalDate: string,
    amount: string
  ): Promise<Notification | null> {
    const template = NOTIFICATION_TEMPLATES.subscription_renewing;
    return this.create({
      user_id: userId,
      type: "subscription_renewing",
      title: template.title,
      message: template.message(plan, renewalDate, amount),
      priority: template.priority,
      action_url: template.action_url,
      metadata: { plan, renewal_date: renewalDate, amount },
      send_email: true,
    });
  }

  async notifySubscriptionRenewed(
    userId: string,
    plan: string,
    amount: string
  ): Promise<Notification | null> {
    const template = NOTIFICATION_TEMPLATES.subscription_renewed;
    return this.create({
      user_id: userId,
      type: "subscription_renewed",
      title: template.title,
      message: template.message(plan, amount),
      priority: template.priority,
      action_url: template.action_url,
      metadata: { plan, amount },
      send_email: true,
    });
  }
}

// SQL for creating notifications table
export const NOTIFICATIONS_TABLE_SQL = `
-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal',
  read BOOLEAN DEFAULT false,
  action_url VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can insert notifications
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);
`;
