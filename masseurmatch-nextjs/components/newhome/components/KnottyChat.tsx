"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Minimize2, Maximize2, Sparkles, Lock } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const faqDatabase = [
  { q: "verify licenses", a: "We perform basic verification for all therapists. Professional license verification is the responsibility of the therapist." },
  { q: "book session", a: "No. MasseurMatch does not handle bookings. Contact therapists directly using the info on their profiles." },
  { q: "safe info privacy", a: "Yes. MasseurMatch prioritizes your privacy. All communications happen outside the platform with end-to-end encryption." },
  { q: "contact therapist", a: "Click on a therapist's profile and use the contact information they provide. Simple and direct." },
  { q: "services available massage", a: "You can search by service type: Deep Tissue, Swedish, Sports, Thai, Hot Stone, and Aromatherapy massage." },
  { q: "top cities location", a: "Top cities include New York, Los Angeles, Chicago, Miami, San Francisco, and 50+ others. Use filters to narrow your search." },
  { q: "knotty ai chat", a: "I'm Knotty, your AI chat companion! I help you explore wellness services, match with therapists, and answer questions about MasseurMatch." },
  { q: "pricing cost fee", a: "MasseurMatch is 100% free for clients. Therapists keep 100% of their earnings. We take 0% commission." },
  { q: "how works platform", a: "Simple: 1) Browse therapists by location and specialty, 2) View profiles and reviews, 3) Contact them directly. No middleman!" },
  { 
    q: "therapist search find looking browse", 
    a: `Here are 3 top-rated therapists near you:

ðŸŒŸ Marcus Rivera - Deep Tissue Specialist
ðŸ“ Downtown â€¢ â­ 4.9 (142 reviews)

ðŸŒŸ Lucas Montgomery - Swedish Massage
ðŸ“ Westside â€¢ â­ 5.0 (215 reviews)

ðŸŒŸ James Anderson - Sports Recovery
ðŸ“ Midtown â€¢ â­ 4.8 (187 reviews)

Want to see more therapists? Visit our Explore page to browse all profiles, filter by location, and view detailed credentials!`
  }
];

function findFAQ(userText: string): string | null {
  const text = userText.toLowerCase();
  for (const item of faqDatabase) {
    const keywords = item.q.split(' ');
    if (keywords.some(keyword => text.includes(keyword))) {
      return item.a;
    }
  }
  return null;
}

export function KnottyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && messages.length === 0) {
      // Delay de 2 segundos antes de comeÃ§ar
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages([{
            text: "Hi, I'm Knotty, your AI wellness assistant. Ask me about therapists, services, locations, or how MasseurMatch works. I'm here to help.",
            sender: 'bot',
            timestamp: new Date()
          }]);
        }, 2500); // Efeito de digitaÃ§Ã£o por 2.5s
      }, 2000); // Espera 2s antes de comeÃ§ar
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized, messages.length]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const answer = findFAQ(inputValue);
    const botMessage: Message = {
      text: answer || "I'm here to help! Ask me about finding therapists, services, top cities, pricing, or safety. Try: 'How does it work?' or 'Top cities'.",
      sender: 'bot',
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button with Label */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
          >
            {/* Label Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-violet-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Meet and interact with Knotty
              </span>
            </motion.div>

            {/* Chat Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] flex items-center justify-center transition-shadow group"
            >
              <MessageSquare className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[380px] bg-black border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 flex flex-col"
            style={{ height: isMinimized ? 'auto' : '520px' }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex items-center justify-between">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 blur-xl" />
              
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Knotty Assistant</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Secure & Private
                  </p>
                </div>
              </div>

              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4 text-white" />
                  ) : (
                    <Minimize2 className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 bg-zinc-950 space-y-3">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white'
                            : 'bg-zinc-900 text-zinc-100 border border-white/10'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className="text-[10px] mt-1 opacity-60">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-zinc-900 border border-white/10">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                            className="w-2 h-2 bg-violet-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                            className="w-2 h-2 bg-violet-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                            className="w-2 h-2 bg-violet-400 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-zinc-900 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask a question..."
                      className="flex-1 px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl hover:from-violet-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px]"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-2 text-center">
                    Powered by AI â€¢ End-to-end encrypted
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
