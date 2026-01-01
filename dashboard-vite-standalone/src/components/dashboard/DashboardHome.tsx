import {
  Eye,
  Search,
  MessageCircle,
  Trophy,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Zap,
  PenTool,
  Plane,
  Shield,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { AvailabilityControl } from "./AvailabilityControl";
import { AddOnMarketplace } from "./AddOnMarketplace";
import { StatusBadge } from "../ui/StatusBadge";

type ProfileData = {
  display_name?: string | null;
  full_name?: string | null;
  location?: string | null;
  plan?: string | null;
  plan_name?: string | null;
  status?: string | null;
  profile_photo?: string | null;
  services?: string[] | null;
  languages?: string[] | null;
};

export function DashboardHome({
  setActiveTab,
  profile,
  loadingProfile,
  profileError,
}: {
  setActiveTab: (tab: string) => void;
  profile?: ProfileData | null;
  loadingProfile?: boolean;
  profileError?: string | null;
}) {
  const name =
    profile?.display_name || profile?.full_name || "Your profile name";
  const locationLabel = profile?.location || "Location not set";
  const planLabel = (profile?.plan_name || profile?.plan || "Free").toUpperCase();
  const statusLabel = profile?.status || "Active";
  const photo =
    profile?.profile_photo ||
    "https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbWFzc2FnZSUyMHRoZXJhcGlzdCUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2NDA3MzgwNHww&ixlib=rb-4.1.0&q=80&w=1080";

  const completeness =
    Math.min(
      100,
      40 +
        (profile?.services?.length ? 20 : 0) +
        (profile?.languages?.length ? 20 : 0) +
        (profile?.location ? 10 : 0) +
        (profile?.profile_photo ? 10 : 0)
    ) || 60;

  return (
    <div className="space-y-8">
      {profileError && (
        <div className="bg-red-900/40 border border-red-500/40 text-red-100 rounded-xl p-4 text-sm">
          {profileError}
        </div>
      )}
      {loadingProfile && !profile && (
        <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-4 text-sm text-slate-400">
          Carregando perfil...
        </div>
      )}
      {/* Top Summary Card */}
      <div className="bg-[#0F0F16] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#7C4DFF]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
          {/* Profile Image & Ring */}
          <div className="relative h-24 w-24 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF9100] via-[#FF4081] to-[#7C4DFF] animate-spin-slow blur-md opacity-50"></div>
            <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white/10">
              <ImageWithFallback
                src={photo}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-[#00E676] h-4 w-4 rounded-full border-2 border-[#0F0F16]"></div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">{name}</h2>
              <span className="px-3 py-1 rounded-full bg-[#FF4081]/20 text-[#FF4081] text-xs font-bold border border-[#FF4081]/30">
                {planLabel} MEMBER
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-400 mb-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00E676] shadow-[0_0_8px_#00E676]"></div>
                {statusLabel}
              </span>
              <span>•</span>
              <span>{locationLabel}</span>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Button size="sm" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 bg-[rgba(155,93,229,0.05)] text-[rgb(155,93,229)]" onClick={() => setActiveTab('listing')}>
                    <PenTool className="h-3 w-3 mr-2" /> Edit Profile
                </Button>
                <Button size="sm" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-[rgb(155,93,229)]" onClick={() => setActiveTab('billing')}>
                    <Shield className="h-3 w-3 mr-2" /> Upgrade Plan
                </Button>
                <Button size="sm" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-[rgb(155,93,229)]" onClick={() => setActiveTab('travel')}>
                    <Plane className="h-3 w-3 mr-2" /> Travel Boost
                </Button>
                <Button size="sm" variant="outline" className="border-[#7C4DFF]/30 text-[rgb(77,255,219)] bg-[#7C4DFF]/5 hover:bg-[#7C4DFF]/10">
                    <Trophy className="h-3 w-3 mr-2" /> Masseur of the Day
                </Button>
            </div>
          </div>
          
          {/* Completeness */}
          <div className="w-full max-w-[200px] hidden md:block">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-slate-300">Profile Completeness</span>
                <span className="text-[#7C4DFF]">{Math.round(completeness)}%</span>
              </div>
              <Progress value={completeness} className="h-2 bg-white/5" indicatorClassName="bg-gradient-to-r from-[#FF4081] to-[#7C4DFF]" />
              <p className="text-[10px] text-slate-500 mt-1 text-right">Adicione fotos e serviços para chegar a 100%</p>
          </div>
        </div>
      </div>

      {/* Availability Control System */}
      <AvailabilityControl initialTier="PRO" />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-[#0F0F16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-[#FF4081]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,248</div>
            <p className="text-xs text-[#00E676] flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0F0F16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Search Impressions</CardTitle>
            <Search className="h-4 w-4 text-[#7C4DFF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">8,502</div>
            <p className="text-xs text-[#00E676] flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +5% this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0F0F16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Contacts Initiated</CardTitle>
            <MessageCircle className="h-4 w-4 text-[#FF9100]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">42</div>
            <p className="text-xs text-slate-500 flex items-center mt-1">
              Same as last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0F0F16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">City Ranking</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">#4</div>
            <p className="text-xs text-[#00E676] flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> Top 5 in Dallas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0F0F16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Ad Performance</CardTitle>
            <Zap className="h-4 w-4 text-[#FF4081]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.4x</div>
            <p className="text-xs text-slate-400 mt-1">
              Visibility boost active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0F0F16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Support Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-slate-500 mt-1">
              No open tickets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add-On Marketplace */}
      <AddOnMarketplace />

      {/* AI Suggestions */}
      <div className="bg-gradient-to-r from-[#1A1A2E] to-[#0F0F16] border border-[#7C4DFF]/30 rounded-2xl p-6">
        <h3 className="text-[#7C4DFF] font-bold flex items-center gap-2 mb-4">
          <span className="text-xl">✨</span> Knotty AI Suggestions
        </h3>
        <div className="space-y-3">
          {[
            { text: "Add 2 more photos to reach 100% profile completeness", action: "Upload Photos" },
            { text: "Boost your listing for the upcoming holiday weekend", action: "View Ads" },
            { text: "Your 'Deep Tissue' description is short. Let me help you expand it.", action: "Edit Bio" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#05050A]/50 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#FF4081]"></div>
                <p className="text-slate-300 text-sm">{item.text}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-[#7C4DFF] hover:text-[#FF4081] hover:bg-[#7C4DFF]/10 whitespace-nowrap">
                {item.action}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
