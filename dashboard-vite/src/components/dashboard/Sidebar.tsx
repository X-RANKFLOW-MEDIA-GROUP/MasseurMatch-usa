import { 
  LayoutDashboard, User, Image, Search, Plane, 
  Zap, BarChart2, Ticket, CreditCard, Settings, 
  LogOut 
} from "lucide-react";
import { Button } from "../ui/button";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "listing", label: "My Listing", icon: User },
    { id: "photos", label: "Photos", icon: Image },
    { id: "seo", label: "SEO Booster", icon: Search },
    { id: "travel", label: "Travel & Mobile", icon: Plane },
    { id: "promote", label: "Promotions & Ads", icon: Zap },
    { id: "insights", label: "Insights & Analytics", icon: BarChart2 },
    { id: "tickets", label: "Ticket Center", icon: Ticket },
    { id: "billing", label: "Subscription", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed top-16 bottom-0 left-0 z-40 w-64 bg-[#0F0F16] border-r border-white/10 transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full py-6 px-4 overflow-y-auto scrollbar-none">
          
          <div className="space-y-1 flex-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full justify-start gap-3 font-medium h-11 text-sm",
                  activeTab === item.id 
                    ? "bg-[#FF4081]/10 text-[#FF4081]" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 mt-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
              onClick={() => {
                if (onLogout) {
                  const confirmed = window.confirm(
                    'Are you sure you want to logout?'
                  );
                  if (confirmed) {
                    onLogout();
                  }
                }
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
