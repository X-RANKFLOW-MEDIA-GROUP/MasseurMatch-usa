import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { NotificationService } from "@/src/lib/notifications";

// GET - Fetch user notifications
export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unread") === "true";
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const notificationService = new NotificationService(supabase);

  if (unreadOnly) {
    const notifications = await notificationService.getUnread(session.user.id);
    const count = await notificationService.getUnreadCount(session.user.id);
    return NextResponse.json({ notifications, unreadCount: count });
  }

  const notifications = await notificationService.getAll(session.user.id, limit, offset);
  const unreadCount = await notificationService.getUnreadCount(session.user.id);

  return NextResponse.json({ notifications, unreadCount });
}

// PATCH - Mark notification as read
export async function PATCH(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { notificationId, markAllRead } = await request.json();

  const notificationService = new NotificationService(supabase);

  if (markAllRead) {
    const success = await notificationService.markAllAsRead(session.user.id);
    return NextResponse.json({ success });
  }

  if (!notificationId) {
    return NextResponse.json({ error: "notificationId required" }, { status: 400 });
  }

  const success = await notificationService.markAsRead(notificationId, session.user.id);
  return NextResponse.json({ success });
}

// DELETE - Delete notification
export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { notificationId } = await request.json();

  if (!notificationId) {
    return NextResponse.json({ error: "notificationId required" }, { status: 400 });
  }

  const notificationService = new NotificationService(supabase);
  const success = await notificationService.delete(notificationId, session.user.id);

  return NextResponse.json({ success });
}
