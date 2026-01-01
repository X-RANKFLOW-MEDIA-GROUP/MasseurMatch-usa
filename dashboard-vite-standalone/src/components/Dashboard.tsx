import { useState } from "react";
import { Sidebar } from "./dashboard/Sidebar";
import { DashboardHome } from "./dashboard/DashboardHome";
import { MyListing } from "./dashboard/MyListing";
import { Photos } from "./dashboard/Photos";
import { SEOBooster } from "./dashboard/SEOBooster";
import { TravelMobile } from "./dashboard/TravelMobile";
import { PromotionsAds } from "./dashboard/PromotionsAds";
import { InsightsAnalytics } from "./dashboard/InsightsAnalytics";
import { TicketCenter } from "./dashboard/TicketCenter";
import { BillingPage } from "./dashboard/BillingPage";
import { Settings } from "./dashboard/Settings";
import { KnottyAI } from "./dashboard/KnottyAI";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

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

export function Dashboard({
  onViewProfile,
  onLogout,
  profile,
  loadingProfile,
  profileError,
}: {
  onViewProfile?: () => void;
  onLogout?: () => void;
  profile?: ProfileData | null;
  loadingProfile?: boolean;
  profileError?: string | null;
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardHome
            setActiveTab={setActiveTab}
            profile={profile}
            loadingProfile={loadingProfile}
            profileError={profileError}
          />
        );
      case "listing":
        return <MyListing onViewProfile={onViewProfile} />;
      case "photos":
        return <Photos />;
      case "seo":
        return <SEOBooster />;
      case "travel":
        return <TravelMobile />;
      case "promote":
        return <PromotionsAds />;
      case "insights":
        return <InsightsAnalytics />;
      case "tickets":
        return <TicketCenter />;
      case "billing":
        return <BillingPage />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardHome setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-slate-200 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col transition-all duration-300">
        
        {/* Mobile Header Toggle */}
        <div className="md:hidden p-4 border-b border-white/10 bg-[#0F0F16] flex items-center gap-4 sticky top-16 z-30">
           <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
             <Menu className="h-6 w-6 text-white" />
           </Button>
           <span className="font-bold text-white capitalize">{activeTab.replace('-', ' ')}</span>
        </div>

        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          {renderContent()}
        </main>
      </div>

      {/* AI Assistant */}
      <KnottyAI />
    </div>
  );
}
