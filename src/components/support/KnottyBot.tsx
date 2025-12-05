import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Shield, AlertTriangle, FileText, HelpCircle, Bot, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '../../lib/utils';

// Configuration Constants
const CONFIG = {
  name: "Knotty",
  role: "MasseurMatch Guide",
  version: "1.2 – Enhanced Knowledge Base",
  disclaimer: "Knotty provides general information only and does not offer legal advice. For legal matters contact legal@masseurmatch.com."
};

// Enhanced Response Logic
const getBotResponse = (input: string): string => {
  const lowerInput = input.toLowerCase();

  // --- CRITICAL / PROHIBITED (Priority 1) ---
  
  // Sexual Content / Prohibited Services
  if (lowerInput.match(/(sex|nude|explicit|erotic|escort|sensual|bj|hj|bodyrub|happy ending|xxx|adult)/)) {
    return "MasseurMatch is a strictly professional advertising platform. We do not allow adult, sensual, or sexual services of any kind. We do not permit nudity, escorting, solicitation, or explicit content. Our mission is to provide a safe, professional directory for legitimate wellness advertising.";
  }

  // Safety / Trafficking
  if (lowerInput.match(/(traffic|exploit|coercion|forced|safe|danger|trust)/)) {
    return "Safety is our top priority. We enforce a strict zero-tolerance policy against trafficking and exploitation. While we verify identities via Stripe, we cannot guarantee the safety of offline interactions. Always exercise caution and meet in public or professional settings first.";
  }

  // --- LEGAL & DOCUMENTS (Priority 2) ---

  // Refund Policy
  if (lowerInput.match(/(refund|money back|reimburse)/)) {
    return "You can find our full Refund Policy in the Legal Hub. generally, fees are for advertising exposure and are non-refundable once a listing is active. However, we consider refunds for technical errors or duplicate charges within 5 days.";
  }

  // Terms & Guidelines
  if (lowerInput.match(/(term|condition|rule|guideline|policy|allowed|prohibited)/)) {
    return "You can access all our official documents in the Legal Hub. This includes our Terms of Service, Content Guidelines, and Advertiser Policies. We recommend reviewing the 'Content Guidelines' to understand what is allowed on your profile.";
  }

  // DMCA / Copyright
  if (lowerInput.match(/(dmca|copyright|steal|stolen|image rights)/)) {
    return "We take intellectual property seriously. If you believe your work has been used without permission, please visit the DMCA section in the Legal Hub or email legal@masseurmatch.com to submit a takedown notice.";
  }

  // --- ACCOUNT & LISTINGS (Priority 3) ---

  // Listing Management (Create/Edit/Delete)
  if (lowerInput.match(/(create|make|edit|update|delete|remove|listing|ad|profile)/)) {
    return "To manage your listing, sign in to your account dashboard. From there, you can 'Create a New Listing', 'Edit' existing details, or 'Delete' a listing entirely. If you need to update your email or recover a password, use the settings menu in your dashboard.";
  }

  // Photos
  if (lowerInput.match(/(photo|image|picture|upload|shirtless|selfie)/)) {
    return "Photos must be professional, recent (within 12 months), and fully clothed. We do not allow shirtless images (unless relevant to a specific therapeutic modality and professional context), nudity, or suggestive poses. You can update photos directly in your listing editor.";
  }

  // Verification / Stripe
  if (lowerInput.match(/(verify|verification|id|stripe|document|passport|license|how long)/)) {
    return "Identity verification is handled exclusively by Stripe Identity to ensure privacy and security. We do not store your ID documents. Verification is usually instant but can take up to 24 hours. You can start this process in your dashboard under the 'Verification' tab.";
  }

  // Auth / Login / Password
  if (lowerInput.match(/(login|sign in|sign up|join|register|password|email|account)/)) {
    return "You can 'Sign In' or 'Join' using the buttons in the top right corner of the site. If you've forgotten your password, click 'Forgot Password' on the login screen to receive a recovery link via email.";
  }

  // Deactivation
  if (lowerInput.match(/(deactivate|close account|quit|leave)/)) {
    return "We'd be sad to see you go! You can deactivate your account safely from the 'Account Settings' page in your dashboard. This will hide all your listings immediately.";
  }

  // --- SUBSCRIPTIONS & BILLING (Priority 4) ---

  // Subscription Management
  if (lowerInput.match(/(subscri|plan|cancel|upgrade|downgrade|cost|price|fee|billing)/)) {
    return "We offer various plans (Free, Standard, Pro, Elite) to suit your needs. You can upgrade, downgrade, or cancel your subscription at any time via the 'Billing' tab in your dashboard. Cancellations prevent future renewals but do not refund the current cycle.";
  }

  // --- PLATFORM INFO (Priority 5) ---

  // Mission / Value
  if (lowerInput.match(/(mission|about|value|why|what is)/)) {
    return "MasseurMatch is an advertising-only directory dedicated to connecting independent wellness professionals with clients. Our mission is to provide a clean, professional, and safe environment for advertising massage and bodywork services, free from the stigma often associated with the industry.";
  }

  // Data / Privacy
  if (lowerInput.match(/(data|privacy|collect|store|info|gdpr|ccpa)/)) {
    return "We value your privacy. We collect only essential account data (email, listing content). We DO NOT collect health data (PHI) or store government IDs. All payment info is handled securely by our processors. Check our Privacy Policy in the Legal Hub for full details.";
  }

  // Advertising Only Concept
  if (lowerInput.match(/(booking|appoint|schedule|manage)/)) {
    return "Remember, MasseurMatch is an 'Advertising-Only' platform. We are like a directory or a billboard. We do not manage your calendar, process booking fees, or facilitate the actual appointment. You handle your own clients directly!";
  }

  // --- GENERAL / FALLBACK ---

  if (lowerInput.match(/(help|support|contact)/)) {
    return "I'm here to help! For specific account issues, you can email support@masseurmatch.com. Otherwise, feel free to ask me about verifying your account, setting up your profile, or our platform rules.";
  }

  return "I'm here to be a helpful guide! You can ask me about:\n\n• Verifying your identity\n• Setting up a listing\n• Subscription plans\n• Our strict safety rules\n• Finding legal documents\n\nHow can I assist you today?";
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function KnottyBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hello! I'm Knotty, your friendly MasseurMatch assistant. 🌟\n\nI can help you navigate the Legal Hub, explain our plans, or guide you through setting up your professional profile.\n\nHow can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = async (textInput?: string) => {
    const msgText = textInput || input;
    if (!msgText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: msgText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate "reading" and "typing" delay based on complexity
    const delay = Math.min(1500, 500 + msgText.length * 20);

    setTimeout(() => {
      const responseText = getBotResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping, isOpen]);

  // Quick prompts for users
  const QUICK_PROMPTS = [
    "How do I get verified?",
    "Cancel subscription",
    "Photo rules",
    "Refund policy"
  ];

  return (
    <>
      {/* Trigger Button */}
      <div className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
        isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100 hover:scale-110"
      )}>
        <Button 
          onClick={() => setIsOpen(true)} 
          className="h-14 w-14 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 border border-white/20 animate-pulse-slow"
        >
          <Bot className="w-7 h-7 text-white" />
        </Button>
      </div>

      {/* Chat Window */}
      <div className={cn(
        "fixed bottom-6 right-6 z-50 w-[90vw] md:w-[380px] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)",
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 pointer-events-none scale-95 translate-y-10"
      )}>
        <Card className="border-primary/20 shadow-2xl bg-background/95 backdrop-blur-xl overflow-hidden flex flex-col h-[600px] max-h-[80vh]">
          {/* Header */}
          <CardHeader className="p-4 bg-gradient-to-r from-violet-600/20 via-indigo-600/10 to-background border-b border-white/5 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg ring-2 ring-white/10 group-hover:ring-primary/50 transition-all">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full animate-pulse"></span>
              </div>
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-1.5">
                  {CONFIG.name} 
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                </CardTitle>
                <p className="text-[11px] text-muted-foreground font-medium">{CONFIG.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-full" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-0 overflow-hidden relative flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
               {/* Disclaimer Banner */}
               <div className="mb-6 mx-2 p-3 bg-primary/5 border border-primary/10 rounded-lg backdrop-blur-sm">
                <div className="flex gap-2 text-[11px] text-muted-foreground leading-snug">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-primary" />
                  <p>MasseurMatch is an advertising-only directory. We verify via Stripe but do not guarantee safety. Sexual content is strictly prohibited.</p>
                </div>
              </div>

              <div className="space-y-4 pb-2">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300", msg.sender === 'user' ? "flex-row-reverse" : "flex-row")}>
                    {msg.sender === 'bot' && (
                      <Avatar className="w-8 h-8 border border-primary/20 shadow-sm mt-1">
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs">K</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-line leading-relaxed",
                      msg.sender === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted/80 backdrop-blur-sm text-foreground rounded-tl-none border border-border/50"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 animate-in fade-in duration-300">
                    <Avatar className="w-8 h-8 border border-primary/20 mt-1">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs">K</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/80 rounded-2xl rounded-tl-none px-4 py-4 border border-border/50 flex items-center gap-1.5 w-16">
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Prompts */}
            {!isTyping && messages.length < 4 && (
              <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar mask-fade-right">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="flex-shrink-0 text-xs bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t bg-background/80 backdrop-blur-md">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <Input 
                placeholder="Ask Knotty anything..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-muted/50 border-border/50 focus-visible:ring-primary/30 rounded-full px-4"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!input.trim() || isTyping} 
                className={cn(
                  "rounded-full w-10 h-10 transition-all duration-300",
                  input.trim() ? "bg-primary text-white shadow-lg scale-100" : "bg-muted text-muted-foreground scale-95"
                )}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <div className="mt-2 text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-help" title={CONFIG.disclaimer}>
              <HelpCircle className="w-3 h-3" />
              <span>General info only • Not legal advice</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
