import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Shield,
  HelpCircle,
  Bot,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";

import "./KnottyBot.css";

// Configuration Constants
const CONFIG = {
  name: "Knotty",
  role: "MasseurMatch Guide",
  version: "1.2 – Enhanced Knowledge Base",
  disclaimer:
    "Knotty provides general information only and does not offer legal advice. For legal matters contact legal@masseurmatch.com.",
};

// Enhanced Response Logic
const getBotResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();

  // --- CRITICAL / PROHIBITED (Priority 1) ---

  // Sexual Content / Prohibited Services
  if (
    lowerInput.match(
      /(sex|nude|explicit|erotic|escort|sensual|bj|hj|bodyrub|happy ending|xxx|adult)/,
    )
  ) {
    return "MasseurMatch is a strictly professional advertising platform. We do not allow adult, sensual, or sexual services of any kind. We do not permit nudity, escorting, solicitation, or explicit content. Our mission is to provide a safe, professional directory for legitimate wellness advertising.";
  }

  // Safety / Trafficking
  if (
    lowerInput.match(
      /(traffic|exploit|coercion|forced|safe|danger|trust)/,
    )
  ) {
    return "Safety is our top priority. We enforce a strict zero-tolerance policy against trafficking and exploitation. While we verify identities via Stripe, we cannot guarantee the safety of offline interactions. Always exercise caution and meet in public or professional settings first.";
  }

  // --- LEGAL & DOCUMENTS (Priority 2) ---

  // Refund Policy
  if (lowerInput.match(/(refund|money back|reimburse)/)) {
    return "You can find our full Refund Policy in the Legal Hub. generally, fees are for advertising exposure and are non-refundable once a listing is active. However, we consider refunds for technical errors or duplicate charges within 5 days.";
  }

  // Terms & Guidelines
  if (
    lowerInput.match(
      /(term|condition|rule|guideline|policy|allowed|prohibited)/,
    )
  ) {
    return "You can access all our official documents in the Legal Hub. This includes our Terms of Service, Content Guidelines, and Advertiser Policies. We recommend reviewing the 'Content Guidelines' to understand what is allowed on your profile.";
  }

  // DMCA / Copyright
  if (
    lowerInput.match(
      /(dmca|copyright|steal|stolen|image rights)/,
    )
  ) {
    return "We take intellectual property seriously. If you believe your work has been used without permission, please visit the DMCA section in the Legal Hub or email legal@masseurmatch.com to submit a takedown notice.";
  }

  // --- ACCOUNT & LISTINGS (Priority 3) ---

  // Listing Management (Create/Edit/Delete)
  if (
    lowerInput.match(
      /(create|make|edit|update|delete|remove|listing|ad|profile)/,
    )
  ) {
    return "To manage your listing, sign in to your account dashboard. From there, you can 'Create a New Listing', 'Edit' existing details, or 'Delete' a listing entirely. If you need to update your email or recover a password, use the settings menu in your dashboard.";
  }

  // Photos
  if (
    lowerInput.match(
      /(photo|image|picture|upload|shirtless|selfie)/,
    )
  ) {
    return "Photos must be professional, recent (within 12 months), and fully clothed. We do not allow shirtless images (unless relevant to a specific therapeutic modality and professional context), nudity, or suggestive poses. You can update photos directly in your listing editor.";
  }

  // Verification / Stripe
  if (
    lowerInput.match(
      /(verify|verification|id|stripe|document|passport|license|how long)/,
    )
  ) {
    return "Identity verification is handled exclusively by Stripe Identity to ensure privacy and security. We do not store your ID documents. Verification is usually instant but can take up to 24 hours. You can start this process in your dashboard under the 'Verification' tab.";
  }

  // Auth / Login / Password
  if (
    lowerInput.match(
      /(login|sign in|sign up|join|register|password|email|account)/,
    )
  ) {
    return "You can 'Sign In' or 'Join' using the buttons in the top right corner of the site. If you've forgotten your password, click 'Forgot Password' on the login screen to receive a recovery link via email.";
  }

  // Deactivation
  if (lowerInput.match(/(deactivate|close account|quit|leave)/)) {
    return "We'd be sad to see you go! You can deactivate your account safely from the 'Account Settings' page in your dashboard. This will hide all your listings immediately.";
  }

  // --- SUBSCRIPTIONS & BILLING (Priority 4) ---

  // Subscription Management
  if (
    lowerInput.match(
      /(subscri|plan|cancel|upgrade|downgrade|cost|price|fee|billing)/,
    )
  ) {
    return "We offer various plans (Free, Standard, Pro, Elite) to suit your needs. You can upgrade, downgrade, or cancel your subscription at any time via the 'Billing' tab in your dashboard. Cancellations prevent future renewals but do not refund the current cycle.";
  }

  // --- PLATFORM INFO (Priority 5) ---

  // Mission / Value
  if (
    lowerInput.match(
      /(mission|about|value|why|what is)/,
    )
  ) {
    return "MasseurMatch is an advertising-only directory dedicated to connecting independent wellness professionals with clients. Our mission is to provide a clean, professional, and safe environment for advertising massage and bodywork services, free from the stigma often associated with the industry.";
  }

  // Data / Privacy
  if (
    lowerInput.match(
      /(data|privacy|collect|store|info|gdpr|ccpa)/,
    )
  ) {
    return "We value your privacy. We collect only essential account data (email, listing content). We DO NOT collect health data (PHI) or store government IDs. All payment info is handled securely by our processors. Check our Privacy Policy in the Legal Hub for full details.";
  }

  // Advertising Only Concept
  if (
    lowerInput.match(
      /(booking|appoint|schedule|manage)/,
    )
  ) {
    return "Remember, MasseurMatch is an 'Advertising-Only' platform. We are like a directory or a billboard. We do not manage your calendar, process booking fees, or facilitate the actual appointment. You handle your own clients directly!";
  }

  // --- GENERAL / FALLBACK ---

  if (
    lowerInput.match(
      /(help|support|contact)/,
    )
  ) {
    return "I'm here to help! For specific account issues, you can email support@masseurmatch.com. Otherwise, feel free to ask me about verifying your account, setting up your profile, or our platform rules.";
  }

  return "I'm here to be a helpful guide! You can ask me about:\n\n• Verifying your identity\n• Setting up a listing\n• Subscription plans\n• Our strict safety rules\n• Finding legal documents\n\nHow can I assist you today?";
};

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function KnottyBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm Knotty, your friendly MasseurMatch assistant. 🌟\n\nI can help you navigate the Legal Hub, explain our plans, or guide you through setting up your professional profile.\n\nHow can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(0);
  const nextMessageId = () => {
    messageCounterRef.current += 1;
    return `msg-${messageCounterRef.current}`;
  };

  const handleSend = async (textInput?: string) => {
    const msgText = textInput || input;
    if (!msgText.trim()) return;

    const userMessage: Message = {
      id: nextMessageId(),
      text: msgText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const delay = Math.min(1500, 500 + msgText.length * 20);

    setTimeout(() => {
      const responseText = getBotResponse(userMessage.text);
      const botMessage: Message = {
        id: nextMessageId(),
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer =
        scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]",
        );
      if (scrollContainer) {
        (scrollContainer as HTMLElement).scrollTop =
          (scrollContainer as HTMLElement).scrollHeight;
      }
    }
  }, [messages, isTyping, isOpen]);

  const QUICK_PROMPTS = [
    "How do I get verified?",
    "Cancel subscription",
    "Photo rules",
    "Refund policy",
  ];

  return (
    <>
      {/* Trigger Button */}
      <div
        className={cn(
          "knotty-trigger-container",
          isOpen && "knotty-trigger-container--hidden",
        )}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="knotty-trigger-button"
        >
          <Bot className="knotty-trigger-icon" />
        </Button>
      </div>

      {/* Chat Window */}
      <div
        className={cn(
          "knotty-window",
          isOpen ? "knotty-window--open" : "knotty-window--closed",
        )}
      >
        <Card className="knotty-card">
          {/* Header */}
          <CardHeader className="knotty-header">
            <div className="knotty-header-left">
              <div className="knotty-header-avatar-wrapper">
                <div className="knotty-header-avatar">
                  <Bot className="knotty-header-avatar-icon" />
                </div>
                <span className="knotty-header-status" />
              </div>
              <div className="knotty-header-text">
                <CardTitle className="knotty-header-title">
                  {CONFIG.name}
                  <Sparkles className="knotty-header-sparkles" />
                </CardTitle>
                <p className="knotty-header-role">{CONFIG.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="knotty-header-close"
              onClick={() => setIsOpen(false)}
            >
              <X className="knotty-header-close-icon" />
            </Button>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="knotty-content">
            <ScrollArea
              className="knotty-scroll-area"
              ref={scrollAreaRef}
            >
              {/* Disclaimer Banner */}
              <div className="knotty-banner">
                <div className="knotty-banner-inner">
                  <Shield className="knotty-banner-icon" />
                  <p>
                    MasseurMatch is an advertising-only directory. We
                    verify via Stripe but do not guarantee safety. Sexual
                    content is strictly prohibited.
                  </p>
                </div>
              </div>

              <div className="knotty-messages">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "knotty-message-row",
                      msg.sender === "user"
                        ? "knotty-message-row--user"
                        : "knotty-message-row--bot",
                    )}
                  >
                    {msg.sender === "bot" && (
                      <Avatar className="knotty-avatar">
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback className="knotty-avatar-fallback">
                          K
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "knotty-message-bubble",
                        msg.sender === "user"
                          ? "knotty-message-bubble--user"
                          : "knotty-message-bubble--bot",
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="knotty-typing-row">
                    <Avatar className="knotty-avatar">
                      <AvatarFallback className="knotty-avatar-fallback">
                        K
                      </AvatarFallback>
                    </Avatar>
                    <div className="knotty-typing-indicator">
                      <span className="knotty-typing-dot knotty-typing-dot--1" />
                      <span className="knotty-typing-dot knotty-typing-dot--2" />
                      <span className="knotty-typing-dot knotty-typing-dot--3" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Prompts */}
            {!isTyping && messages.length < 4 && (
              <div className="knotty-quick-prompts">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="knotty-quick-prompt"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </CardContent>

          {/* Input Area */}
          <div className="knotty-input-area">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="knotty-input-form"
            >
              <Input
                placeholder="Ask Knotty anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="knotty-input"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className={cn(
                  "knotty-send-button",
                  input.trim() && !isTyping && "knotty-send-button--active",
                )}
              >
                <Send className="knotty-send-icon" />
              </Button>
            </form>
            <div
              className="knotty-disclaimer"
              title={CONFIG.disclaimer}
            >
              <HelpCircle className="knotty-disclaimer-icon" />
              <span>General info only • Not legal advice</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
