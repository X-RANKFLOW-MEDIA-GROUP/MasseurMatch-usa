import { 
  MapPin, Star, ShieldCheck, Clock, Award, 
  Check, ChevronRight, Sparkles, Calendar,
  Heart, Share2, Phone, MessageCircle, Languages,
  Globe, Zap, Car, Plane, EyeOff
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useEffect, useState } from "react";
import * as kv from "../../utils/supabase/kv_store";
import { cn } from "../ui/utils";

const DEFAULT_PROFILE = {
  bio: "Hello, I am Bruno from Ipanema, Brazil. I have over 14 years of experience in massage therapy. My service is different because I bring high-quality, professional massage directly to you.",
  location: "Dallas, TX",
  languages: "English, Portuguese, Spanish",
  availability: "Mon-Fri: 10am - 8pm",
  services: ["Deep Tissue", "Shiatsu"],
  amenities: ["Shower Available", "Private Parking", "Heated Table", "Aromatherapy"],
  gear: ["Earthlite Table", "Organic Oils", "Hot Stones"],
  paymentMethods: ["Cash", "Zelle", "Venmo"],
  phone: "555-123-4567",
  email: "bruno@masseurmatch.com"
};

export function ServiceProfile({ onLogin }: { onLogin?: () => void }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [statusData, setStatusData] = useState<any>({ status: "HIDDEN" });

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, sData] = await Promise.all([
            kv.get("profile_bruno"),
            kv.get("status_bruno")
        ]);
        
        if (profileData) {
          setProfile({ ...DEFAULT_PROFILE, ...profileData });
        }
        if (sData) {
            setStatusData(sData);
        }
      } catch (error) {
        console.error("Failed to load profile data", error);
      }
    }
    loadData();
  }, []);

  // Render Status Badge
  const renderStatusBadge = () => {
      const { status } = statusData;
      if (status === "AVAILABLE_NOW") {
          return (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF4081] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg whitespace-nowrap flex items-center gap-1">
                <Zap className="w-3 h-3" /> Available Now
            </div>
          );
      }
      if (status === "BUSY") {
          return (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6A3D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg whitespace-nowrap flex items-center gap-1">
                <Car className="w-3 h-3" /> Mobile Service
            </div>
          );
      }
      if (status === "TRAVELING") {
          return (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3DA9F5] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg whitespace-nowrap flex items-center gap-1">
                <Plane className="w-3 h-3" /> Traveling
            </div>
          );
      }
      return (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg whitespace-nowrap flex items-center gap-1">
            <EyeOff className="w-3 h-3" /> Offline
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-200 font-sans pb-24">
      
      {/* TOP NAVIGATION */}
      <nav className="border-b border-white/5 bg-[#05050A] py-4">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
            <div className="flex items-center gap-8">
                <span className="text-xl font-bold text-white">
                    <span className="text-[#FF4081]">Masseur</span>Match
                </span>
                <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
                    <a href="#" className="hover:text-white transition-colors">Find a Therapist</a>
                    <a href="#" className="hover:text-white transition-colors">Services</a>
                    <a href="#" className="hover:text-white transition-colors">About Us</a>
                </div>
            </div>
            <div className="flex items-center gap-4">
                 <div className="hidden md:flex relative w-64">
                    <input 
                        type="text" 
                        placeholder="Search therapists..." 
                        className="bg-[#151520] border border-white/10 rounded-full px-4 py-2 text-sm w-full focus:outline-none focus:border-[#FF4081]"
                    />
                 </div>
                 <span 
                    className="text-sm font-bold text-slate-300 cursor-pointer hover:text-white"
                    onClick={onLogin}
                 >
                    Log In
                 </span>
                 <Button className="bg-[#FF4081] hover:bg-[#FF4081]/90 text-white font-bold rounded-full px-6">Join Now</Button>
            </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        
        {/* HERO SECTION */}
        <div className="bg-[#10101A] rounded-3xl p-6 md:p-10 border border-white/5 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
                
                {/* Profile Picture Column */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                    <div className="relative">
                        <div className="w-48 h-48 rounded-full p-1 bg-gradient-to-br from-[#FF4081] to-[#7C4DFF] shadow-[0_0_30px_rgba(255,64,129,0.3)]">
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#10101A]">
                                <ImageWithFallback 
                                    src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1000&auto=format&fit=crop" 
                                    alt="Bruno" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {renderStatusBadge()}
                    </div>
                    <div className="flex flex-col items-center">
                         <div className="flex gap-1 text-[#FF4081] mb-1">
                             {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                         </div>
                         <span className="text-white font-bold text-lg">5.0/5</span>
                    </div>
                </div>

                {/* Info Column */}
                <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-white">The Art of Touch by Bruno</h1>
                        <div className="flex gap-3">
                            <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-white">
                                <Heart className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-white">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {/* Location Card */}
                        <div className="bg-[#161621] border border-white/5 rounded-xl p-4">
                            <p className="text-[10px] text-[#FF4081] font-bold uppercase mb-1 tracking-wider">Location</p>
                            <p className="text-white font-bold text-lg">{profile.location}</p>
                            {statusData.status === "TRAVELING" ? (
                                <p className="text-[#3DA9F5] text-xs mt-1 font-bold">Visiting {statusData.travelCity || "City"}</p>
                            ) : (
                                <p className="text-slate-400 text-xs mt-1">Current: Nov 22 - 28</p>
                            )}
                        </div>

                        {/* Services Card */}
                        <div className="bg-[#161621] border border-white/5 rounded-xl p-4">
                            <p className="text-[10px] text-[#FF4081] font-bold uppercase mb-1 tracking-wider">Services</p>
                            <p className="text-white font-bold text-lg line-clamp-1">{profile.services.slice(0, 2).join(", ")}</p>
                            <p className="text-slate-400 text-xs mt-1">Starting at $200</p>
                        </div>

                         {/* Specialties Card */}
                         <div className="bg-[#161621] border border-white/5 rounded-xl p-4">
                            <p className="text-[10px] text-[#FF4081] font-bold uppercase mb-1 tracking-wider">Specialties</p>
                            <p className="text-white font-bold text-lg">
                                {statusData.status === "BUSY" ? "Mobile Service" : "In-Studio"}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">
                                {statusData.status === "BUSY" && statusData.mobileRadius 
                                    ? `Within ${statusData.mobileRadius}km` 
                                    : "Available"}
                            </p>
                        </div>

                         {/* Promotions Card */}
                         <div className="bg-[#161621] border border-white/5 rounded-xl p-4">
                            <p className="text-[10px] text-[#FF4081] font-bold uppercase mb-1 tracking-wider">Promotions</p>
                            <p className="text-white font-bold text-lg">10% Off Mondays</p>
                            <p className="text-slate-400 text-xs mt-1">Military Discount</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <Button 
                            className="bg-gradient-to-r from-[#FF4081] to-[#E0346D] hover:opacity-90 text-white font-bold px-8 py-6 rounded-full shadow-[0_0_20px_rgba(255,64,129,0.4)]"
                            onClick={() => window.location.href = `sms:${profile.phone}`}
                        >
                            TEXT NOW
                        </Button>
                        <Button 
                            variant="outline" 
                            className="border-white/20 text-white hover:bg-white/5 font-bold px-8 py-6 rounded-full bg-transparent"
                            onClick={() => window.location.href = `tel:${profile.phone}`}
                        >
                            CALL NOW
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* ABOUT SECTION HEADER */}
        <div className="text-[#FF4081] font-bold text-sm tracking-wider uppercase pt-4">About</div>

        {/* ABOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Bio */}
            <Card className="lg:col-span-2 bg-[#10101A] border-white/5 text-slate-300">
                <CardContent className="p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-white">About Bruno</h2>
                    <p className="leading-relaxed whitespace-pre-wrap">
                        {profile.bio}
                    </p>
                </CardContent>
            </Card>

            {/* Philosophy */}
            <Card className="bg-[#10101A] border-white/5 text-slate-300 h-full">
                <CardContent className="p-8 space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#FF4081]" />
                        Philosophy & Approach
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-400">
                        Each session addresses chronic tension, sports-related issues, or everyday fatigue. 
                        My goal is to help restore balance in both body and mind.
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* SECONDARY INFO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Languages */}
            <Card className="bg-[#10101A] border-white/5">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3">Languages</h3>
                    <p className="text-[#FF4081] font-medium">{profile.languages}</p>
                </CardContent>
            </Card>

            {/* Credentials */}
            <Card className="bg-[#10101A] border-white/5">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3">Credentials</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                            <Check className="w-4 h-4 text-[#7C4DFF]" /> Certified Massage Therapist
                        </div>
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                            <Check className="w-4 h-4 text-[#7C4DFF]" /> 14+ Years Experience
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* SECTION HEADER */}
        <div className="text-[#FF4081] font-bold text-sm tracking-wider uppercase pt-4">Service Location & Offerings</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Location Details */}
             <Card className="bg-[#10101A] border-white/5 lg:col-span-1">
                <CardContent className="p-8 space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#7C4DFF]" /> Location
                    </h3>
                    
                    <div>
                        <p className="text-white font-bold">Current Location</p>
                        <p className="text-slate-400 text-sm">{profile.location}</p>
                    </div>

                    <div>
                        <p className="text-white font-bold">Home Base</p>
                        <p className="text-slate-400 text-sm">Ipanema, Rio de Janeiro, BR</p>
                    </div>

                    {statusData.status === "BUSY" && (
                        <Badge className="bg-[#FF6A3D]/10 text-[#FF6A3D] hover:bg-[#FF6A3D]/20 border-none px-3 py-1 flex items-center gap-2">
                            <Car className="w-3 h-3" /> Mobile Service Active
                        </Badge>
                    )}
                </CardContent>
             </Card>

             {/* Reviews */}
             <Card className="bg-[#10101A] border-white/5 lg:col-span-2">
                <CardContent className="p-8">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <Star className="w-5 h-5 text-[#7C4DFF]" /> Reviews
                    </h3>

                    <div className="space-y-4">
                        <div className="bg-[#05050A] rounded-xl p-4 border border-white/5">
                            <div className="flex justify-between mb-2">
                                <span className="text-white font-bold text-sm">Client in Dallas</span>
                                <span className="text-slate-500 text-xs">Oct 2025</span>
                            </div>
                            <p className="text-slate-400 text-sm italic">"Incredible massage! Bruno is amazing."</p>
                        </div>

                        <div className="bg-[#05050A] rounded-xl p-4 border border-white/5">
                            <div className="flex justify-between mb-2">
                                <span className="text-white font-bold text-sm">Client in Dallas</span>
                                <span className="text-slate-500 text-xs">July 2025</span>
                            </div>
                            <p className="text-slate-400 text-sm italic">"Best therapist I've found in years."</p>
                        </div>
                    </div>
                </CardContent>
             </Card>
        </div>

        {/* GALLERY SECTION */}
        <div className="text-[#FF4081] font-bold text-sm tracking-wider uppercase pt-4">Gallery</div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
                "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2",
                "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
                "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9",
                "https://images.unsplash.com/photo-1519823551278-64ac927d4fe2"
             ].map((url, idx) => (
                <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-white/5 bg-[#10101A]">
                    <ImageWithFallback src={`${url}?auto=format&fit=crop&w=600&q=80`} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
             ))}
        </div>

        {/* FOOTER */}
        <div className="pt-16 pb-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            <div className="space-y-4">
                <h4 className="text-white font-bold text-lg">MasseurMatch</h4>
                <p className="text-slate-500 leading-relaxed">
                    Connecting you with professional massage therapists in your area. Find the perfect match for your relaxation and wellness needs.
                </p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-slate-500">
                    <li>About Us</li>
                    <li>Careers</li>
                    <li>Blog</li>
                    <li>Press</li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-slate-500">
                    <li>Help Center</li>
                    <li>Safety Center</li>
                    <li>Community Guidelines</li>
                    <li>Contact Us</li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-slate-500">
                    <li>Terms of Service</li>
                    <li>Privacy Policy</li>
                    <li>Cookie Policy</li>
                </ul>
            </div>
        </div>

      </div>

      {/* BOTTOM STICKY BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#05050A] border-t border-white/10 p-4 z-50">
         <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="hidden md:block">
                 <p className="text-white font-bold">Ready to relax?</p>
                 <p className="text-slate-500 text-sm">Book your session with Bruno today</p>
             </div>
             <div className="flex items-center gap-3 w-full md:w-auto">
                 <Button 
                    className="flex-1 md:flex-none bg-gradient-to-r from-[#FF4081] to-[#E0346D] hover:opacity-90 text-white font-bold rounded-full h-12 px-8"
                    onClick={() => window.location.href = `sms:${profile.phone}`}
                 >
                    TEXT NOW
                 </Button>
                 <Button 
                    size="icon" 
                    className="rounded-full h-12 w-12 bg-white text-black hover:bg-slate-200"
                    onClick={() => window.location.href = `tel:${profile.phone}`}
                 >
                     <Phone className="w-5 h-5" />
                 </Button>
                 <Button 
                    className="flex-1 md:flex-none bg-[#1E1E2C] text-white border border-white/10 hover:bg-[#252535] font-bold rounded-full h-12 px-8"
                    onClick={() => window.location.href = `mailto:${profile.email}`}
                 >
                    EMAIL
                 </Button>
             </div>
         </div>
      </div>

    </div>
  );
}
