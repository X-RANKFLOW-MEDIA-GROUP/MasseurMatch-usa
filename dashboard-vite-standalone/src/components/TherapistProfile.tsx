import { 
  MapPin, Star, ShieldCheck, Phone, Mail, 
  Share2, Heart, CheckCircle, ChevronRight, Calendar, Clock
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function TherapistProfile() {
  return (
    <div className="min-h-screen bg-[#05050A] text-slate-200 pb-24">
      {/* Main Container */}
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        
        {/* Top Profile Section */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0F0F16] border border-white/10 p-6 md:p-10">
          {/* Background Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 md:gap-12 items-center">
            
            {/* Profile Image Circle */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Deep Neon Blur Layer */}
                <div className="absolute inset-[-4px] rounded-full bg-gradient-to-tr from-[#FF9100] via-[#FF4081] to-[#7C4DFF] animate-spin-slow blur-xl opacity-60"></div>
                
                {/* Sharp Neon Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF9100] via-[#FF4081] to-[#7C4DFF] animate-spin-slow shadow-[0_0_20px_rgba(255,64,129,0.5)]"></div>
                
                {/* Spacer */}
                <div className="absolute inset-[3px] rounded-full bg-[#05050A]"></div>
                
                {/* Image */}
                <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-[#05050A] z-10">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbWFzc2FnZSUyMHRoZXJhcGlzdCUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2NDA3MzgwNHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Bruno"
                    className="h-full w-full object-cover"
                  />
                </div>
                
                {/* Available Now Badge with Strong Neon Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                   <div className="bg-[#FF4081] text-[9px] font-black tracking-widest px-[18px] py-[4px] rounded-full text-white shadow-[0_0_20px_#FF4081] border border-white/50 ring-2 ring-[#FF4081]/50 text-center">
                     AVAILABLE NOW
                   </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col items-center gap-1">
                <div className="flex text-[#FF4081] gap-1">
                   {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                   ))}
                </div>
                <span className="text-white font-bold text-lg">5.0/5</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="space-y-6 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  The Art of Touch by Bruno
                </h1>
                <div className="flex gap-2">
                   <Button variant="outline" size="icon" className="rounded-full border-white/10 text-slate-400 hover:text-[#FF4081] hover:bg-white/5">
                     <Heart className="h-5 w-5" />
                   </Button>
                   <Button variant="outline" size="icon" className="rounded-full border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
                     <Share2 className="h-5 w-5" />
                   </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location Box */}
                <div className="bg-[#1A1A2E] border border-[#7C4DFF]/30 rounded-xl p-4 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-r from-[#7C4DFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative z-10">
                     <h3 className="text-[10px] uppercase tracking-wider text-[#FF4081] font-bold mb-1">Location</h3>
                     <p className="text-white font-medium">Dallas, TX</p>
                     <p className="text-xs text-slate-400">Current: Nov 22 - 28</p>
                   </div>
                </div>

                {/* Services Box */}
                <div className="bg-[#1A1A2E] border border-[#7C4DFF]/30 rounded-xl p-4 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-r from-[#7C4DFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative z-10">
                     <h3 className="text-[10px] uppercase tracking-wider text-[#FF4081] font-bold mb-1">Services</h3>
                     <p className="text-white font-medium">Deep Tissue, Shiatsu</p>
                     <p className="text-xs text-slate-400">Starting at $200</p>
                   </div>
                </div>

                {/* Specialties Box */}
                <div className="bg-[#1A1A2E] border border-[#7C4DFF]/30 rounded-xl p-4 relative overflow-hidden group">
                   <div className="relative z-10">
                     <h3 className="text-[10px] uppercase tracking-wider text-[#FF4081] font-bold mb-1">Specialties</h3>
                     <p className="text-white font-medium">Mobile Service</p>
                     <p className="text-xs text-slate-400">In-Studio Available</p>
                   </div>
                </div>

                {/* Promo Box */}
                <div className="bg-[#1A1A2E] border border-[#7C4DFF]/30 rounded-xl p-4 relative overflow-hidden group">
                   <div className="relative z-10">
                     <h3 className="text-[10px] uppercase tracking-wider text-[#FF4081] font-bold mb-1">Promotions</h3>
                     <p className="text-white font-medium">10% Off Mondays</p>
                     <p className="text-xs text-slate-400">Military Discount</p>
                   </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button className="h-12 px-8 rounded-full bg-[#FF4081] hover:bg-[#FF4081]/90 text-white font-bold shadow-[0_0_20px_#FF4081] border-0">
                   TEXT NOW
                </Button>
                <Button variant="outline" className="h-12 px-8 rounded-full border-[#FF4081] text-[rgb(246,246,246)] hover:bg-[#FF4081] hover:text-white transition-colors bg-[rgb(26,26,46)]">
                   CALL NOW
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-4">
          <h2 className="text-[#FF4081] text-sm font-bold uppercase tracking-wider ml-1">About</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Bio */}
            <div className="md:col-span-2 bg-[#151525] border border-white/5 rounded-2xl p-6 md:p-8">
               <h3 className="text-xl font-bold text-white mb-4">About Bruno</h3>
               <div className="space-y-4 text-slate-300 leading-relaxed">
                 <p>
                   Hello, I am Bruno from Ipanema, Brazil. I have over 14 years of experience in massage therapy. 
                   My service is different because I bring high-quality, professional massage directly to you.
                 </p>
                 <p>
                   I come to you wherever you are and focus on consistent results and real attention to detail. 
                   I provide a respectful, welcoming, and inclusive experience for all clients.
                 </p>
               </div>
            </div>

            {/* Side Details */}
            <div className="space-y-6">
               <div className="bg-[#151525] border border-white/5 rounded-2xl p-6 h-full flex flex-col justify-center">
                 <h3 className="text-white font-bold mb-3">Philosophy & Approach</h3>
                 <p className="text-slate-400 text-sm">
                   Each session addresses chronic tension, sports-related issues, or everyday fatigue. 
                   My goal is to help restore balance in both body and mind.
                 </p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
             <div className="bg-[#151525] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-2">Languages</h3>
                <p className="text-[#FF4081] font-medium">English, Portuguese, Spanish</p>
             </div>
             <div className="bg-[#151525] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-2">Credentials</h3>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CheckCircle className="h-4 w-4 text-[#7C4DFF]" />
                  Certified Massage Therapist
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm mt-1">
                  <CheckCircle className="h-4 w-4 text-[#7C4DFF]" />
                  14+ Years Experience
                </div>
             </div>
          </div>
        </div>

        {/* Service Location & Offerings */}
        <div className="space-y-4 pt-4">
           <h2 className="text-[#FF4081] text-sm font-bold uppercase tracking-wider ml-1">Service Location & Offerings</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-[#151525] border border-white/5 rounded-2xl p-6">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                   <MapPin className="h-5 w-5 text-[#7C4DFF]" /> Location
                 </h3>
                 <div className="space-y-4">
                   <div>
                     <p className="text-white font-medium">Current Location</p>
                     <p className="text-slate-400 text-sm">Dallas, TX</p>
                   </div>
                   <div>
                     <p className="text-white font-medium">Home Base</p>
                     <p className="text-slate-400 text-sm">Ipanema, Rio de Janeiro, BR</p>
                   </div>
                   <div className="pt-2">
                     <Badge variant="secondary" className="bg-[#7C4DFF]/20 text-[#E0B0FF] hover:bg-[#7C4DFF]/30 border-0">
                        Mobile Service Available
                     </Badge>
                   </div>
                 </div>
              </div>

              <div className="md:col-span-2 bg-[#151525] border border-white/5 rounded-2xl p-6">
                 <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#7C4DFF]" /> Reviews
                 </h3>
                 <div className="grid gap-4">
                    {[
                      { user: "Client in Dallas", text: "Incredible massage! Bruno is amazing.", date: "Oct 2025" },
                      { user: "Client in Dallas", text: "Best therapist I've found in years.", date: "July 2025" }
                    ].map((review, i) => (
                       <div key={i} className="bg-[#0F0F16] rounded-xl p-4 border border-white/5">
                          <div className="flex justify-between mb-2">
                             <span className="text-white font-medium text-sm">{review.user}</span>
                             <span className="text-slate-500 text-xs">{review.date}</span>
                          </div>
                          <p className="text-slate-400 text-sm">"{review.text}"</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#05050A]/90 backdrop-blur-lg border-t border-white/10 p-4 z-40">
         <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="hidden md:block">
               <p className="text-white font-bold">Ready to relax?</p>
               <p className="text-slate-400 text-xs">Book your session with Bruno today</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
               <Button className="flex-1 md:flex-none rounded-full bg-gradient-to-r from-[#FF9100] via-[#FF4081] to-[#7C4DFF] text-white border-0 font-bold">
                  TEXT NOW
               </Button>
               <Button variant="outline" className="flex-1 md:flex-none rounded-full border-white/20 text-white hover:bg-white/10">
                  CALL
               </Button>
               <Button className="flex-1 md:flex-none rounded-full bg-[#1A1A2E] text-white border border-[#7C4DFF]/50 hover:bg-[#7C4DFF]/20">
                  BOOK ONLINE
               </Button>
            </div>
         </div>
      </div>

    </div>
  );
}
