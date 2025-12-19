import { useState, useEffect } from "react";
import { 
  Zap, Clock, Lock, AlertCircle, 
  ChevronRight, MapPin, ShieldCheck, Battery, 
  Plane, Globe, EyeOff, Smartphone, X, Car
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { StatusBadge, StatusType } from "../ui/StatusBadge";
import { cn } from "../ui/utils";
import * as kv from "../../utils/supabase/kv_store";
import { toast } from "sonner";

type Tier = "FREE" | "STANDARD" | "PRO" | "ELITE";

interface AvailabilityControlProps {
  initialTier?: Tier;
}

export function AvailabilityControl({ initialTier = "PRO" }: AvailabilityControlProps) {
  const [tier, setTier] = useState<Tier>(initialTier);
  const [status, setStatus] = useState<StatusType>("HIDDEN");
  
  // Availability Details State
  const [activationsUsed, setActivationsUsed] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5400); // 90 mins in seconds (for Pro)
  
  // Traveling State
  const [travelCity, setTravelCity] = useState("");
  const [travelDates, setTravelDates] = useState("");
  
  // Mobile State
  const [mobileRadius, setMobileRadius] = useState("10");
  
  // Tier Configuration
  const config = {
    FREE: {
      name: "Free",
      canAvailableNow: false,
      dailyLimit: 0,
      durationMinutes: 0,
    },
    STANDARD: {
      name: "Standard",
      canAvailableNow: true,
      dailyLimit: 2,
      durationMinutes: 60,
    },
    PRO: {
      name: "Pro",
      canAvailableNow: true,
      dailyLimit: 5,
      durationMinutes: 90,
    },
    ELITE: {
      name: "Elite",
      canAvailableNow: true,
      dailyLimit: 999, // Unlimited
      durationMinutes: 180, // 3 hours
    }
  };

  const currentConfig = config[tier] || config["PRO"];

  // Load status from Supabase
  useEffect(() => {
    async function loadStatus() {
        try {
            const data = await kv.get("status_bruno");
            if (data) {
                if (data.status) setStatus(data.status as StatusType);
                // Ensure tier is valid before setting
                if (data.tier && config[data.tier as Tier]) {
                    setTier(data.tier as Tier);
                }
                if (data.mobileRadius) setMobileRadius(data.mobileRadius);
                if (data.travelCity) setTravelCity(data.travelCity);
                if (data.travelDates) setTravelDates(data.travelDates);
            }
        } catch (error) {
            console.error("Failed to load status", error);
        }
    }
    loadStatus();
  }, []);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const saveStatusToSupabase = async (newStatus: StatusType, currentTier: Tier) => {
      try {
          await kv.set("status_bruno", {
              status: newStatus,
              tier: currentTier,
              mobileRadius,
              travelCity,
              travelDates,
              lastUpdated: Date.now()
          });
          // Optional: toast.success("Status updated"); // Can be noisy if frequent
      } catch (error) {
          console.error("Failed to save status", error);
          toast.error("Failed to save status");
      }
  };

  const handleStatusChange = (newStatus: StatusType) => {
    if (newStatus === "AVAILABLE_NOW" && !currentConfig.canAvailableNow) {
      toast.error("Upgrade to PRO to use Available Now");
      return; 
    }
    setStatus(newStatus);
    saveStatusToSupabase(newStatus, tier);
  };

  // Auto-save inputs when they change (debounced effect could be better but simple save is fine for KV)
  // We will trigger save when the user leaves the input (onBlur)
  const handleInputSave = () => {
      saveStatusToSupabase(status, tier);
  };

  return (
    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Availability Status
            {tier === "FREE" && <Badge variant="outline" className="text-slate-500 border-slate-700">Free Plan</Badge>}
            {tier === "STANDARD" && <Badge variant="outline" className="text-blue-400 border-blue-400/30">Standard</Badge>}
            {tier === "PRO" && <Badge variant="outline" className="text-[#FF4081] border-[#FF4081]/30">Pro Member</Badge>}
            {tier === "ELITE" && <Badge variant="outline" className="text-[#21F365] border-[#21F365]/30">Elite</Badge>}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Select your current working status.
          </p>
        </div>
        <div className="flex items-center gap-2">
            {status === "HIDDEN" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs font-bold">
                    <EyeOff className="h-3 w-3" />
                    -18% Visibility
                </div>
            )}
            <StatusBadge status={status} className="scale-90" />
        </div>
      </div>

      {/* Status Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        
        {/* AVAILABLE NOW */}
        <button
          onClick={() => handleStatusChange("AVAILABLE_NOW")}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all relative overflow-hidden",
            status === "AVAILABLE_NOW" 
              ? "bg-[#FF147A]/10 border-[#FF147A] text-white" 
              : "bg-[#0A0A0F] border-white/5 text-slate-400 hover:border-white/20",
            !currentConfig.canAvailableNow && "opacity-50 cursor-not-allowed"
          )}
        >
          <Zap className={cn("h-6 w-6", status === "AVAILABLE_NOW" ? "text-[#FF147A]" : "text-slate-500")} />
          <span className="text-xs font-bold uppercase">Available Now</span>
          {!currentConfig.canAvailableNow && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
            </div>
          )}
        </button>

        {/* MOBILE */}
        <button
          onClick={() => handleStatusChange("BUSY")} // Using BUSY as placeholder for MOBILE logic
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all",
            status === "BUSY" 
              ? "bg-[#FF6A3D]/10 border-[#FF6A3D] text-white" 
              : "bg-[#0A0A0F] border-white/5 text-slate-400 hover:border-white/20"
          )}
        >
          <Car className={cn("h-6 w-6", status === "BUSY" ? "text-[#FF6A3D]" : "text-slate-500")} />
          <span className="text-xs font-bold uppercase">Mobile</span>
        </button>

        {/* TRAVELING */}
        <button
          onClick={() => handleStatusChange("TRAVELING")}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all",
            status === "TRAVELING" 
              ? "bg-[#3DA9F5]/10 border-[#3DA9F5] text-white" 
              : "bg-[#0A0A0F] border-white/5 text-slate-400 hover:border-white/20"
          )}
        >
          <Plane className={cn("h-6 w-6", status === "TRAVELING" ? "text-[#3DA9F5]" : "text-slate-500")} />
          <span className="text-xs font-bold uppercase">Traveling</span>
        </button>

        {/* HIDDEN */}
        <button
          onClick={() => handleStatusChange("HIDDEN")}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all",
            status === "HIDDEN" 
              ? "bg-[#9B5DE5]/10 border-[#9B5DE5] text-white" 
              : "bg-[#0A0A0F] border-white/5 text-slate-400 hover:border-white/20"
          )}
        >
          <EyeOff className={cn("h-6 w-6", status === "HIDDEN" ? "text-[#9B5DE5]" : "text-slate-500")} />
          <span className="text-xs font-bold uppercase">Hidden</span>
        </button>
      </div>

      {/* Dynamic Content Area */}
      <div className="bg-[#0A0A0F] rounded-xl border border-white/5 p-5 min-h-[120px]">
        
        {/* 1. AVAILABLE NOW CONTENT */}
        {status === "AVAILABLE_NOW" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                 <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex items-center justify-center">
                       <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                       <div className="absolute inset-0 rounded-full border-4 border-[#FF147A] border-t-transparent animate-spin-slow" style={{ animationDuration: '3s' }}></div>
                       <Zap className="h-6 w-6 text-[#FF147A] fill-[#FF147A]" />
                    </div>
                    <div>
                       <div className="text-2xl font-mono font-bold text-white">{formatTime(timeLeft)}</div>
                       <div className="text-xs text-[#FF147A] font-bold uppercase tracking-wider">Time Remaining</div>
                    </div>
                 </div>

                 <div className="text-right">
                    <div className="text-sm text-slate-400 mb-1">Today's Activations</div>
                    <div className="text-xl font-bold text-white">
                       {activationsUsed} <span className="text-slate-500 text-sm">/ {currentConfig.dailyLimit === 999 ? '∞' : currentConfig.dailyLimit}</span>
                    </div>
                 </div>
             </div>
             <Progress value={((currentConfig.durationMinutes * 60 - timeLeft) / (currentConfig.durationMinutes * 60)) * 100} className="h-1.5 bg-white/10" indicatorClassName="bg-[#FF147A]" />
          </div>
        )}

        {/* 2. MOBILE CONTENT */}
        {status === "BUSY" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3 text-[#FF6A3D] mb-2">
                    <Smartphone className="h-5 w-5" />
                    <h4 className="font-bold">Mobile Service Settings</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 uppercase font-bold">Service Radius (km)</label>
                        <input 
                            type="number" 
                            value={mobileRadius}
                            onChange={(e) => setMobileRadius(e.target.value)}
                            onBlur={handleInputSave}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF6A3D] outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                         <label className="text-xs text-slate-400 uppercase font-bold">Service Areas</label>
                         <div className="p-3 bg-[#121212] border border-white/10 rounded-lg text-slate-400 text-sm">
                             Select neighborhoods in Settings
                         </div>
                    </div>
                </div>
                <p className="text-xs text-slate-500">You are visible to clients within {mobileRadius}km of your base location.</p>
            </div>
        )}

        {/* 3. TRAVELING CONTENT */}
        {status === "TRAVELING" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3 text-[#3DA9F5] mb-2">
                    <Plane className="h-5 w-5" />
                    <h4 className="font-bold">Travel Plans</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 uppercase font-bold">Visiting City</label>
                        <input 
                            type="text" 
                            placeholder="e.g. New York, NY"
                            value={travelCity}
                            onChange={(e) => setTravelCity(e.target.value)}
                            onBlur={handleInputSave}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#3DA9F5] outline-none transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 uppercase font-bold">Dates</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Oct 12 - Oct 15"
                            value={travelDates}
                            onChange={(e) => setTravelDates(e.target.value)}
                            onBlur={handleInputSave}
                            className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-white focus:border-[#3DA9F5] outline-none transition-colors"
                        />
                    </div>
                </div>
                <Button className="w-full bg-[#3DA9F5]/10 text-[#3DA9F5] border border-[#3DA9F5]/50 hover:bg-[#3DA9F5]/20">
                    Activate Travel Boost (+$25)
                </Button>
            </div>
        )}

        {/* 4. HIDDEN CONTENT */}
        {status === "HIDDEN" && (
            <div className="text-center py-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <EyeOff className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <h4 className="text-white font-bold mb-1">You are currently hidden</h4>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                    Your profile is not visible in search results or the map. 
                    Select a status above to start receiving clients.
                </p>
            </div>
        )}

      </div>

      {/* Dev Toggle (Remove in production) */}
      <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity bg-black/80 p-1 rounded z-50">
         <select 
            value={tier} 
            onChange={(e) => { setTier(e.target.value as Tier); setStatus("HIDDEN"); }}
            className="bg-transparent text-xs text-white border-none outline-none"
         >
            <option value="FREE">Free</option>
            <option value="STANDARD">Standard</option>
            <option value="PRO">Pro</option>
            <option value="ELITE">Elite</option>
         </select>
      </div>
    </div>
  );
}
