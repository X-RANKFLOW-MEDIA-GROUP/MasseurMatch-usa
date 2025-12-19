import { 
  Search, BarChart2, Target, MapPin 
} from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export function SEOBooster() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              SEO Booster <span className="text-[#21F365] text-sm px-2 py-0.5 bg-[#21F365]/10 rounded border border-[#21F365]/20">Score: 85/100</span>
            </h2>
            <p className="text-slate-400 text-sm">Optimize your profile to rank higher in search results.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Form */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6 space-y-4">
               <div>
                  <label className="text-sm font-medium text-white mb-1 block">SEO Title</label>
                  <input 
                     type="text" 
                     defaultValue="Professional Massage Therapist in Dallas | Deep Tissue & Swedish" 
                     className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg p-3 text-white focus:border-[#7C4DFF] outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Recommended length: 50-60 characters</p>
               </div>

               <div>
                  <label className="text-sm font-medium text-white mb-1 block">Short Bio (Meta Description)</label>
                  <textarea 
                     rows={3}
                     defaultValue="Certified therapist with 5 years of experience. Specializing in sports recovery and relaxation. Book your session today." 
                     className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg p-3 text-white focus:border-[#7C4DFF] outline-none resize-none"
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="text-sm font-medium text-white mb-1 block">Main Specialty</label>
                      <select className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg p-3 text-white focus:border-[#7C4DFF] outline-none">
                          <option>Deep Tissue</option>
                          <option>Swedish</option>
                          <option>Sports Massage</option>
                      </select>
                  </div>
                  <div>
                      <label className="text-sm font-medium text-white mb-1 block">Client Type</label>
                      <select className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg p-3 text-white focus:border-[#7C4DFF] outline-none">
                          <option>All Clients</option>
                          <option>Men Only</option>
                          <option>Women Only</option>
                      </select>
                  </div>
               </div>

               <div>
                  <label className="text-sm font-medium text-white mb-1 block">Keywords (Tags)</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                     <span className="px-3 py-1 bg-[#1A1A2E] text-slate-300 rounded-full text-sm border border-white/10 flex items-center gap-1">
                        Relaxation <button className="hover:text-white ml-1">×</button>
                     </span>
                     <span className="px-3 py-1 bg-[#1A1A2E] text-slate-300 rounded-full text-sm border border-white/10 flex items-center gap-1">
                        Pain Relief <button className="hover:text-white ml-1">×</button>
                     </span>
                  </div>
                  <input 
                     type="text" 
                     placeholder="Add keyword..." 
                     className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg p-3 text-white focus:border-[#7C4DFF] outline-none"
                  />
               </div>

               <div>
                  <label className="text-sm font-medium text-white mb-1 block">Target Neighborhoods</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                     <span className="px-3 py-1 bg-[#7C4DFF]/20 text-[#7C4DFF] rounded-full text-sm border border-[#7C4DFF]/30 flex items-center gap-1">
                        Downtown Dallas <button className="hover:text-white ml-1">×</button>
                     </span>
                     <span className="px-3 py-1 bg-[#7C4DFF]/20 text-[#7C4DFF] rounded-full text-sm border border-[#7C4DFF]/30 flex items-center gap-1">
                        Uptown <button className="hover:text-white ml-1">×</button>
                     </span>
                  </div>
                  <input 
                     type="text" 
                     placeholder="Add a neighborhood..." 
                     className="w-full bg-[#1A1A2E] border border-white/10 rounded-lg p-3 text-white focus:border-[#7C4DFF] outline-none"
                  />
               </div>
            </div>
         </div>

         {/* AI Sidebar */}
         <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F0F16] border border-[#7C4DFF]/30 rounded-xl p-5">
               <h3 className="text-[#7C4DFF] font-bold flex items-center gap-2 mb-4">
                  <span className="text-lg">✨</span> AI Suggestions
               </h3>
               <div className="space-y-3">
                  <div className="bg-[#05050A]/50 p-3 rounded border border-white/5">
                     <p className="text-slate-300 text-xs mb-2">Your title is missing "Relaxation". Adding it could increase clicks by 12%.</p>
                     <Button size="sm" variant="outline" className="w-full border-[#7C4DFF]/30 text-[#7C4DFF] hover:bg-[#7C4DFF]/10 h-7 text-xs">
                        Apply Suggestion
                     </Button>
                  </div>
                  <div className="bg-[#05050A]/50 p-3 rounded border border-white/5">
                     <p className="text-slate-300 text-xs mb-2">Add "Deep Ellum" to neighborhoods based on your location history.</p>
                     <Button size="sm" variant="outline" className="w-full border-[#7C4DFF]/30 text-[#7C4DFF] hover:bg-[#7C4DFF]/10 h-7 text-xs">
                        Add Neighborhood
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
