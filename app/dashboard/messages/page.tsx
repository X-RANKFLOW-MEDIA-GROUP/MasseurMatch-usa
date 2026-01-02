"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle, Send, Search, User, Clock, Check, CheckCheck, Loader2 } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

type Conversation = {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_photo: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
};

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
};

export default function MessagesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/dashboard/messages");
      return;
    }
    setUserId(user.id);

    // Mock conversations - in production, fetch from database
    const mockConversations: Conversation[] = [
      {
        id: "1",
        other_user_id: "u1",
        other_user_name: "John Smith",
        other_user_photo: "",
        last_message: "Hi, are you available tomorrow at 2pm?",
        last_message_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        unread_count: 2,
      },
      {
        id: "2",
        other_user_id: "u2",
        other_user_name: "Sarah Johnson",
        other_user_photo: "",
        last_message: "Thank you for the session!",
        last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        unread_count: 0,
      },
      {
        id: "3",
        other_user_id: "u3",
        other_user_name: "Michael Brown",
        other_user_photo: "",
        last_message: "Can you do deep tissue?",
        last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        unread_count: 0,
      },
    ];

    setConversations(mockConversations);
    setLoading(false);
  };

  const fetchMessages = async (conversationId: string) => {
    // Mock messages - in production, fetch from database
    const mockMessages: Message[] = [
      {
        id: "m1",
        sender_id: "u1",
        content: "Hi there! I saw your profile and I'm interested in booking a session.",
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        read: true,
      },
      {
        id: "m2",
        sender_id: userId!,
        content: "Hello! Thank you for reaching out. I'd be happy to help. What type of massage are you interested in?",
        created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
        read: true,
      },
      {
        id: "m3",
        sender_id: "u1",
        content: "I'm looking for deep tissue massage. I have a lot of tension in my shoulders.",
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        read: true,
      },
      {
        id: "m4",
        sender_id: userId!,
        content: "Deep tissue is one of my specialties! I can definitely help with that. Would you prefer incall or outcall?",
        created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
        read: true,
      },
      {
        id: "m5",
        sender_id: "u1",
        content: "Hi, are you available tomorrow at 2pm?",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: false,
      },
    ];

    setMessages(mockMessages);
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    fetchMessages(conv.id);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => c.id === conv.id ? { ...c, unread_count: 0 } : c)
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);

    const message: Message = {
      id: `m${Date.now()}`,
      sender_id: userId!,
      content: newMessage,
      created_at: new Date().toISOString(),
      read: false,
    };

    // In production, save to database
    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Update conversation
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? { ...c, last_message: newMessage, last_message_at: new Date().toISOString() }
          : c
      )
    );

    setSending(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter((c) =>
    c.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
        <p className="text-slate-400">Chat with your clients</p>
      </div>

      <div className="flex-1 flex rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors text-left ${
                    selectedConversation?.id === conv.id ? "bg-white/10" : ""
                  }`}
                >
                  <div className="relative">
                    {conv.other_user_photo ? (
                      <img
                        src={conv.other_user_photo}
                        alt={conv.other_user_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-violet-400" />
                      </div>
                    )}
                    {conv.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium truncate ${conv.unread_count > 0 ? "text-white" : "text-slate-300"}`}>
                        {conv.other_user_name}
                      </span>
                      <span className="text-xs text-slate-500">{formatTime(conv.last_message_at)}</span>
                    </div>
                    <p className={`text-sm truncate ${conv.unread_count > 0 ? "text-slate-300" : "text-slate-500"}`}>
                      {conv.last_message}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                {selectedConversation.other_user_photo ? (
                  <img
                    src={selectedConversation.other_user_photo}
                    alt={selectedConversation.other_user_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-violet-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{selectedConversation.other_user_name}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Active 2h ago
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.sender_id === userId
                          ? "bg-violet-600 text-white"
                          : "bg-white/10 text-slate-200"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        msg.sender_id === userId ? "text-violet-200" : "text-slate-500"
                      }`}>
                        <span className="text-xs">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {msg.sender_id === userId && (
                          msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-4 rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
                  >
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Select a conversation</h3>
                <p className="text-slate-400">Choose a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
