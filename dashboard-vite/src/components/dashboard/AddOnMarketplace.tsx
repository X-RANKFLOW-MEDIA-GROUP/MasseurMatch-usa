import { 
  Zap, MapPin, Clock, Star, TrendingUp, ShieldCheck, Globe 
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function AddOnMarketplace() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* BLOCK A: "Available Now" Extensions */}
      <div className="bg-[#0F0F16] border border-white/10 rounded-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10 bg-[#151520]">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#21F365]/10 rounded-lg text-[#21F365]">
                 <Zap className="h-5 w-5" />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-white">Availability Extensions</h3>
                 <p className="text-slate-400 text-xs">Boost your ranking in the "Available Now" feed.</p>
              </div>
           </div>
        </div>
        
        <div className="p-6 space-y-4 flex-1">
           {/* Item 1 */}
           <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Clock className="h-5 w-5" />
                 </div>
                 <div>
                    <div className="text-white font-bold text-sm">Extra 60 min</div>
                    <div className="text-slate-500 text-xs">Standard Tier Only</div>
                 </div>
              </div>
              <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10">
                 $5
              </Button>
           </div>

           {/* Item 2 */}
           <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                    <Star className="h-5 w-5" />
                 </div>
                 <div>
                    <div className="text-white font-bold text-sm">Unlimited Day Pass</div>
                    <div className="text-slate-500 text-xs">All day visibility</div>
                 </div>
              </div>
              <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10">
                 $15
              </Button>
           </div>

           {/* Item 3 */}
           <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded bg-[#FF147A]/10 flex items-center justify-center text-[#FF147A]">
                    <TrendingUp className="h-5 w-5" />
                 </div>
                 <div>
                    <div className="text-white font-bold text-sm">Extended Timer Pack</div>
                    <div className="text-slate-500 text-xs">Double time (Monthly)</div>
                 </div>
              </div>
              <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10">
                 $25/mo
              </Button>
           </div>

           {/* Item 4 */}
           <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded bg-[#21F365]/10 flex items-center justify-center text-[#21F365]">
                    <ShieldCheck className="h-5 w-5" />
                 </div>
                 <div>
                    <div className="text-white font-bold text-sm">Auto-Renew Boost</div>
                    <div className="text-slate-500 text-xs">Always active</div>
                 </div>
              </div>
              <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10">
                 $10/mo
              </Button>
           </div>
        </div>
      </div>

      {/* BLOCK B: Visibility Bundles */}
      <div className="bg-[#0F0F16] border border-white/10 rounded-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10 bg-[#151520]">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#7C4DFF]/10 rounded-lg text-[#7C4DFF]">
                 <Globe className="h-5 w-5" />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-white">Visibility Bundles</h3>
                 <p className="text-slate-400 text-xs">Increase reach in Explore & Search.</p>
              </div>
           </div>
        </div>
        
        <div className="p-6 space-y-4 flex-1">
           {/* Item 1 */}
           <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Star className="h-5 w-5" />
                 </div>
                 <div>
                    <div className="text-white font-bold text-sm">Masseur of the Day</div>
                    <div className="text-slate-500 text-xs">Homepage Top Spot (24h)</div>
                 </div>
              </div>
              <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10">
                 $25
              </Button>
           </div>

           {/* Item 2 */}
           <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded bg-[#3DA9F5]/10 flex items-center justify-center text-[#3DA9F5]">
                    <MapPin className="h-5 w-5" />
                 </div>
                 <div>
                    <div className="text-white font-bold text-sm">Travel Boost</div>
                    <div className="text-slate-500 text-xs">Rank high in visiting city</div>
                 </div>
              </div>
              <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10">
                 $25
              </Button>
           </div>

           {/* Item 3 */}
           <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded bg-orange-500/10 flex items-center justify-center text-orange-400">
                    <Globe className="h-5 w-5" />
                 </div>
                 <div>
                    <div className="text-white font-bold text-sm">Geo Ads Campaign</div>
                    <div className="text-slate-500 text-xs">Target specific zip codes</div>
                 </div>
              </div>
              <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/10">
                 Start
              </Button>
           </div>
        </div>
        <div className="p-4 bg-[#1A1A2E] border-t border-white/10 text-center">
           <p className="text-xs text-slate-400">Impacts internal SEO & CTR instantly.</p>
        </div>
      </div>

    </div>
  );
}
