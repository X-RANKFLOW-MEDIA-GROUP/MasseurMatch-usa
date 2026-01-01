import { 
  Bot, Sparkles, Send, X 
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function KnottyAI() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#FF9100] via-[#FF4081] to-[#7C4DFF] shadow-[0_0_30px_rgba(255,64,129,0.4)] hover:shadow-[0_0_40px_rgba(255,64,129,0.6)] transition-all duration-300 border-2 border-white/20 p-0"
        >
          <Bot className="h-8 w-8 text-white" />
        </Button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] bg-[#0F0F16] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-200">
           {/* Header */}
           <div className="p-4 bg-gradient-to-r from-[#FF4081]/10 to-[#7C4DFF]/10 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Sparkles className="h-5 w-5 text-[#FF4081]" />
                 <h3 className="font-bold text-white">Knotty AI Assistant</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
                 <X className="h-4 w-4" />
              </Button>
           </div>

           {/* Chat Area */}
           <div className="h-[400px] p-4 overflow-y-auto space-y-4 bg-[#05050A]">
              <div className="flex gap-3">
                 <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF9100] to-[#FF4081] flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                 </div>
                 <div className="bg-[#1A1A2E] border border-white/10 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                    <p className="text-sm text-slate-200">
                       Hi! I'm Knotty, your personal dashboard assistant. 
                       I can help you improve your profile, set up ads, or answer support questions.
                    </p>
                    <div className="mt-3 flex flex-col gap-2">
                       <Button variant="outline" size="sm" className="justify-start text-xs border-[#7C4DFF]/30 text-[#E0B0FF] hover:bg-[#7C4DFF]/10">
                          How do I get more views?
                       </Button>
                       <Button variant="outline" size="sm" className="justify-start text-xs border-[#7C4DFF]/30 text-[#E0B0FF] hover:bg-[#7C4DFF]/10">
                          Draft a bio for me
                       </Button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Input Area */}
           <div className="p-4 bg-[#0F0F16] border-t border-white/10">
              <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Ask Knotty anything..."
                   className="w-full bg-[#151525] border border-white/10 rounded-full pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] placeholder:text-slate-500"
                 />
                 <Button size="icon" className="absolute right-1 top-1 h-7 w-7 rounded-full bg-[#FF4081] hover:bg-[#FF4081]/90">
                    <Send className="h-3 w-3 text-white" />
                 </Button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
