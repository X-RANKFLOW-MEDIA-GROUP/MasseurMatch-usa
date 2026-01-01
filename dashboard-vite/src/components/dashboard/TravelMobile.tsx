import { 
  Smartphone, Plane, MapPin, Globe, Briefcase 
} from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

export function TravelMobile() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Travel & Mobile Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* MOBILE SETTINGS */}
         <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6 text-[#FF6A3D]">
               <Smartphone className="h-6 w-6" />
               <h3 className="text-xl font-bold text-white">Mobile Service</h3>
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-between bg-[#1A1A2E] p-4 rounded-lg border border-white/5">
                  <div>
                     <div className="font-bold text-white">Enable Mobile Service</div>
                     <div className="text-xs text-slate-400">Show me in "Mobile" searches</div>
                  </div>
                  <Switch />
               </div>

               <div>
                  <label className="text-sm font-medium text-white mb-2 block">Service Radius (km)</label>
                  <div className="flex items-center gap-4">
                     <input 
                        type="range" 
                        className="flex-1 accent-[#FF6A3D] h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                     />
                     <span className="text-white font-mono font-bold bg-[#FF6A3D]/10 px-3 py-1 rounded border border-[#FF6A3D]/30">15 km</span>
                  </div>
               </div>

               <div>
                  <label className="text-sm font-medium text-white mb-2 block">Mobile Equipment</label>
                  <div className="flex flex-wrap gap-2 bg-[#1A1A2E] p-3 rounded-lg border border-white/10">
                      <span className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10 text-slate-300 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Massage Table</span>
                      <span className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10 text-slate-300 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Chair</span>
                      <span className="text-xs px-2 py-1 bg-white/5 rounded border border-white/10 text-slate-300 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Oils/Lotions</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Checked items show clients you are prepared.</p>
               </div>

               <div>
                  <label className="text-sm font-medium text-white mb-2 block">Service Areas</label>
                  <textarea 
                     placeholder="List specific areas you visit (e.g. Downtown, West Side)..."
                     className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg p-3 text-white focus:border-[#FF6A3D] outline-none h-24 resize-none"
                  />
               </div>
            </div>
         </div>

         {/* TRAVEL SETTINGS */}
         <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6 text-[#3DA9F5]">
               <Plane className="h-6 w-6" />
               <h3 className="text-xl font-bold text-white">Travel Schedule</h3>
            </div>

            <div className="space-y-6">
               <div className="bg-[#3DA9F5]/5 border border-[#3DA9F5]/20 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h4 className="font-bold text-white">Upcoming Trip: New York</h4>
                        <p className="text-sm text-[#3DA9F5]">Oct 12 - Oct 15</p>
                     </div>
                     <Button size="sm" variant="outline" className="border-[#3DA9F5]/50 text-[#3DA9F5] hover:bg-[#3DA9F5]/10">Edit</Button>
                  </div>
                  <div className="text-xs text-slate-400 flex gap-4">
                     <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Visitor Mode Active</span>
                     <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Manhattan</span>
                  </div>
               </div>

               <Button className="w-full bg-[#1A1A2E] border border-dashed border-white/20 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/40 h-12">
                  + Add New Trip
               </Button>
            </div>
         </div>

      </div>
    </div>
  );
}
