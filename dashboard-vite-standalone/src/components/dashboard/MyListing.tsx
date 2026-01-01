import { 
  User, Mail, Phone, Globe, MapPin, Camera, Sparkles, ShieldCheck, Award, TrendingUp,
  Clock, Briefcase, DollarSign, Settings, Save
} from "lucide-react";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import * as kv from "../../utils/supabase/kv_store";

import { GalleryControl } from "./GalleryControl";
import { EditProfileModal } from "./EditProfileModal";

// Default data to fallback to if DB is empty
const DEFAULT_PROFILE = {
  bio: "Hello, I am Bruno from Ipanema, Brazil. I have over 14 years of experience in massage therapy. My service is different because I bring high-quality, professional massage directly to you.",
  location: "Dallas, TX",
  languages: "English, Portuguese, Spanish",
  availability: "Mon-Fri: 10am - 8pm",
  services: ["Deep Tissue", "Swedish", "Sports", "Reflexology", "Mobile Service"],
  amenities: ["Shower Available", "Private Parking", "Heated Table", "Aromatherapy"],
  gear: ["Earthlite Table", "Organic Oils", "Hot Stones"],
  paymentMethods: ["Cash", "Zelle", "Venmo"],
  phone: "555-123-4567",
  email: "bruno@masseurmatch.com"
};

export function MyListing({ onViewProfile }: { onViewProfile?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const data = await kv.get("profile_bruno");
        if (data) {
          // Merge with defaults in case of new fields
          setProfile({ ...DEFAULT_PROFILE, ...data });
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await kv.set("profile_bruno", profile);
      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error("Failed to save", error);
      toast.error("Failed to save changes");
    }
  };

  const handleAIBio = () => {
    setProfile(prev => ({
      ...prev,
      bio: "I’m a professional massage therapist offering deep tissue, therapeutic, and sports recovery sessions tailored for men seeking real results. My work combines technique, intuition, and a calm presence to help your body release stress and tension effectively. Clean space, discreet service, and a strong, confident touch. Serving Dallas with in-studio or mobile appointments."
    }));
    toast.info("Bio updated with AI suggestion");
  };

  // Helper to update array fields (add/remove)
  const toggleArrayItem = (field: keyof typeof profile, item: string) => {
    setProfile(prev => {
      // @ts-ignore
      const list = prev[field] as string[];
      if (list.includes(item)) {
        return { ...prev, [field]: list.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...list, item] };
      }
    });
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center sticky top-0 z-40 bg-[#05050A]/95 backdrop-blur py-4 border-b border-white/5 -mx-6 px-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Listing</h2>
          <p className="text-slate-400 text-sm">Manage how your profile appears to clients.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSave}
            className="bg-[#21F365] text-black hover:bg-[#21F365]/90 font-bold shadow-[0_0_15px_rgba(33,243,101,0.3)]"
          >
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
          <div className="flex gap-2">
              <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">
                  Preview Profile
              </Button>
              <EditProfileModal />
          </div>
        </div>
      </div>

      {/* Performance Score Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0F0F16] border border-[#21F365]/20 rounded-xl p-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#21F365]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
         
         <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2 text-[#21F365]">
               <TrendingUp className="h-5 w-5" />
               <span className="font-bold uppercase tracking-wider text-xs">Listing Strength</span>
            </div>
            <div className="flex items-end gap-3">
               <span className="text-5xl font-bold text-white">85<span className="text-2xl text-slate-500">/100</span></span>
            </div>
            <p className="text-slate-400 text-sm">Your profile is performing well, but could be better.</p>
         </div>

         <div className="col-span-2 flex items-center justify-between gap-6">
            <div className="space-y-3 w-full max-w-sm">
               <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Profile Completeness</span>
                  <span className="text-white font-bold">85%</span>
               </div>
               <div className="h-2 w-full bg-[#1A1A2E] rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-[#21F365]" />
               </div>
               <p className="text-xs text-slate-500">Add 2 more photos and enable "Mobile Services" to reach 95%.</p>
            </div>
            <Button className="hidden md:flex bg-[#21F365] text-black font-bold hover:bg-[#21F365]/90">
               Improve Score
            </Button>
         </div>
      </div>
      
      {/* Guidelines Confirmation */}
      <div className="bg-[#1A1A2E] border border-white/10 rounded-xl p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#00E676]" />
            <div>
                <p className="text-white font-medium text-sm">Profile Guidelines Accepted</p>
                <p className="text-slate-500 text-xs">Last confirmed: Nov 05, 2025</p>
            </div>
         </div>
         <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">View Guidelines</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Photos & Bio */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Photos */}
        <GalleryControl initialTier="PRO" />

        {/* Bio */}
        <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">About You</h3>
          <textarea 
            className="w-full h-40 bg-[#151525] border border-white/10 rounded-lg p-4 text-slate-300 focus:border-[#FF4081] focus:outline-none resize-none"
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
          />
          <div className="flex justify-between mt-2">
             <p className="text-xs text-slate-500">Minimum 80 characters</p>
             <Button 
               size="sm" 
               className="bg-[#1A1A2E] text-white border border-white/10 hover:bg-white/5"
               onClick={handleAIBio}
             >
               <Sparkles className="h-4 w-4 mr-2 text-[#21F365]" /> Use Knotty AI to Improve Bio
             </Button>
          </div>
        </div>

        {/* Profile Highlights & Services */}
        <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6">
           <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg bg-[#21F365]/10 flex items-center justify-center text-[#21F365]">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Services & Amenities</h3>
           </div>
           
           <div className="space-y-6">
               <div>
                   <label className="text-sm font-medium text-slate-400 block mb-2">Services Offered</label>
                   <div className="flex flex-wrap gap-2">
                       {profile.services.map((s, i) => (
                           <span key={i} className="px-3 py-1 rounded-lg bg-[#1A1A2E] border border-white/10 text-white text-sm flex items-center gap-2 group cursor-pointer hover:bg-red-500/10 hover:border-red-500/50 transition-colors" onClick={() => toggleArrayItem("services", s)}>
                               {s} <span className="text-xs text-slate-500 group-hover:text-red-400">x</span>
                           </span>
                       ))}
                       <button 
                         className="px-3 py-1 rounded-lg border border-dashed border-white/20 text-slate-400 text-sm hover:text-white hover:bg-white/5"
                         onClick={() => {
                           const newService = prompt("Add new service:");
                           if (newService) setProfile(prev => ({ ...prev, services: [...prev.services, newService] }));
                         }}
                        >
                          + Add
                       </button>
                   </div>
               </div>

               <div>
                   <label className="text-sm font-medium text-slate-400 block mb-2">Studio Amenities</label>
                   <div className="flex flex-wrap gap-2">
                       {profile.amenities.map((s, i) => (
                           <span key={i} className="px-3 py-1 rounded-lg bg-[#1A1A2E] border border-white/10 text-white text-sm flex items-center gap-2">
                               <CheckIcon className="w-3 h-3 text-[#21F365]" /> {s}
                           </span>
                       ))}
                   </div>
               </div>
               
               <div>
                   <label className="text-sm font-medium text-slate-400 block mb-2">Studio Gear</label>
                   <div className="flex flex-wrap gap-2">
                       {profile.gear.map((s, i) => (
                           <span key={i} className="px-3 py-1 rounded-lg bg-[#1A1A2E] border border-white/10 text-white text-sm">{s}</span>
                       ))}
                   </div>
               </div>
           </div>
        </div>

      </div>

      {/* Right Column: Details */}
      <div className="space-y-6">
        
        {/* Verification / Trust */}
        <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6 space-y-4">
           <h3 className="text-white font-bold mb-2">Trust & Verification</h3>
           
           <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="h-5 w-5 text-[#21F365]" />
              <span className="text-slate-200">Identity Verified</span>
           </div>
           <div className="flex items-center gap-3 text-sm">
              <Award className="h-5 w-5 text-[#21F365]" />
              <span className="text-slate-200">Licensed Professional</span>
           </div>
           <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="h-5 w-5 text-slate-500" />
              <span className="text-slate-500">Insurance Proof (Pending)</span>
           </div>

           <div className="h-px bg-white/10 my-4" />
           
           <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded bg-[#21F365]/10 text-[#21F365] text-xs font-bold">LGBTQ+ Friendly</span>
              <span className="px-2 py-1 rounded bg-[#21F365]/10 text-[#21F365] text-xs font-bold">Sanitized Studio</span>
           </div>
        </div>

        {/* Quick Details */}
        <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold">Location</label>
              <div className="flex items-center gap-2 mt-1 bg-[#151525] p-2 rounded border border-white/10">
                <MapPin className="h-4 w-4 text-[#7C4DFF]" />
                <input 
                  type="text" 
                  value={profile.location} 
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-transparent text-white text-sm focus:outline-none w-full" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase font-bold">Contact Phone</label>
              <div className="flex items-center gap-2 mt-1 bg-[#151525] p-2 rounded border border-white/10">
                <Phone className="h-4 w-4 text-[#7C4DFF]" />
                <input 
                  type="text" 
                  value={profile.phone} 
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-transparent text-white text-sm focus:outline-none w-full" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase font-bold">Email</label>
              <div className="flex items-center gap-2 mt-1 bg-[#151525] p-2 rounded border border-white/10">
                <Mail className="h-4 w-4 text-[#7C4DFF]" />
                <input 
                  type="text" 
                  value={profile.email} 
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-transparent text-white text-sm focus:outline-none w-full" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase font-bold">Languages</label>
              <div className="flex items-center gap-2 mt-1 bg-[#151525] p-2 rounded border border-white/10">
                <Globe className="h-4 w-4 text-[#7C4DFF]" />
                <input 
                  type="text" 
                  value={profile.languages}
                  onChange={(e) => setProfile(prev => ({ ...prev, languages: e.target.value }))}
                  className="bg-transparent text-white text-sm focus:outline-none w-full" 
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold">Availability</label>
              <div className="flex items-center gap-2 mt-1 bg-[#151525] p-2 rounded border border-white/10">
                <Clock className="h-4 w-4 text-[#7C4DFF]" />
                <input 
                  type="text" 
                  value={profile.availability}
                  onChange={(e) => setProfile(prev => ({ ...prev, availability: e.target.value }))}
                  className="bg-transparent text-white text-sm focus:outline-none w-full" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase font-bold">Payment Methods</label>
              <div className="flex flex-wrap gap-2 mt-1">
                  {profile.paymentMethods.map((m, i) => (
                      <span key={i} className="bg-[#151525] text-slate-300 text-xs px-2 py-1 rounded border border-white/10">{m}</span>
                  ))}
              </div>
            </div>
            
            <Button 
              className="w-full bg-[#1A1A2E] hover:bg-white/5 text-white border border-white/10 mt-2"
              onClick={onViewProfile}
            >
              View Public Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function CheckIcon({className}: {className?: string}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
