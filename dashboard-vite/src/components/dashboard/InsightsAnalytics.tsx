import { 
  Eye, Heart, MapPin, TrendingUp, Smartphone, Globe, Search 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function InsightsAnalytics() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Insights & Analytics</h2>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#0F0F16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-[#FF4081]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12,450</div>
            <p className="text-xs text-[#00E676] mt-1 flex items-center">
               <TrendingUp className="h-3 w-3 mr-1" /> +18% vs last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#0F0F16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-[#FF147A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">342</div>
            <p className="text-xs text-[#00E676] mt-1 flex items-center">
               <TrendingUp className="h-3 w-3 mr-1" /> +5% vs last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#0F0F16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Profile Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#7C4DFF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8.5</div>
            <p className="text-xs text-slate-400 mt-1">Top 10% in your area</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0F0F16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">SEO Health</CardTitle>
            <Search className="h-4 w-4 text-[#21F365]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">92%</div>
            <p className="text-xs text-slate-400 mt-1">Excellent optimization</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Device Breakdown */}
         <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Device Breakdown</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-[#FF6A3D]/10 rounded text-[#FF6A3D]">
                        <Smartphone className="h-5 w-5" />
                     </div>
                     <span className="text-slate-300">Mobile</span>
                  </div>
                  <span className="font-bold text-white">78%</span>
               </div>
               <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-[#FF6A3D] h-2 rounded-full" style={{ width: '78%' }}></div>
               </div>
               
               <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-[#3DA9F5]/10 rounded text-[#3DA9F5]">
                        <Globe className="h-5 w-5" />
                     </div>
                     <span className="text-slate-300">Desktop</span>
                  </div>
                  <span className="font-bold text-white">22%</span>
               </div>
               <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="bg-[#3DA9F5] h-2 rounded-full" style={{ width: '22%' }}></div>
               </div>
            </div>
         </div>

         {/* City Heatmap List */}
         <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">Top Cities</h3>
            <div className="space-y-3">
               {[
                  { city: "Dallas, TX", views: 850, percent: 65 },
                  { city: "Fort Worth, TX", views: 210, percent: 15 },
                  { city: "Plano, TX", views: 120, percent: 8 },
                  { city: "Austin, TX", views: 85, percent: 5 },
               ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#1A1A2E] rounded-lg border border-white/5">
                     <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-300 text-sm">{item.city}</span>
                     </div>
                     <div className="text-right">
                        <div className="font-bold text-white text-sm">{item.views}</div>
                        <div className="text-[10px] text-slate-500">{item.percent}%</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
