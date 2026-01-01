import { 
  Shield, Bell, Lock, User, HelpCircle 
} from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

export function Settings() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Account Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Navigation - Could be tabs, but for now simplified list */}
         <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-[#FF4081]/10 text-[#FF4081] font-medium text-sm border border-[#FF4081]/20">
               Account & Privacy
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 text-slate-400 font-medium text-sm transition-colors">
               Notifications
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 text-slate-400 font-medium text-sm transition-colors">
               Legal Hub
            </button>
         </div>

         {/* Main Settings Area */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Password Section */}
            <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-slate-400" /> Password & Security
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <div>
                        <p className="text-white text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-slate-500 text-xs">Add an extra layer of security</p>
                     </div>
                     <Switch />
                  </div>
                  <div className="pt-4 border-t border-white/5">
                     <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">Change Password</Button>
                  </div>
               </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-slate-400" /> Privacy
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <div>
                        <p className="text-white text-sm font-medium">Show Profile in Search Engines</p>
                        <p className="text-slate-500 text-xs">Allow Google/Bing to index your profile</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center">
                     <div>
                        <p className="text-white text-sm font-medium">Hide Exact Location</p>
                        <p className="text-slate-500 text-xs">Only show approximate radius</p>
                     </div>
                     <Switch />
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
