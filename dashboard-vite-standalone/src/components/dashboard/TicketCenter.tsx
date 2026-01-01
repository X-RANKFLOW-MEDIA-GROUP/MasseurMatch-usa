import { Ticket, Plus, Search, Filter, Paperclip, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function TicketCenter() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Ticket Center</h2>
          <p className="text-slate-400 text-sm">Manage your support requests and inquiries</p>
        </div>
        <Button className="bg-[#FF4081] hover:bg-[#FF4081]/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create New Ticket
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            className="w-full bg-[#0F0F16] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-[#FF4081] focus:outline-none"
          />
        </div>
        <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="bg-[#0F0F16] border border-white/10 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_120px_120px_120px] gap-4 p-4 border-b border-white/10 bg-white/5 text-sm font-medium text-slate-400">
          <div>Subject</div>
          <div>Status</div>
          <div>Priority</div>
          <div>Last Update</div>
        </div>
        
        {/* Ticket List Simulation (Example of an open ticket) */}
        <div className="divide-y divide-white/5">
            {/* Example Item */}
            <div className="grid grid-cols-[1fr_120px_120px_120px] gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer items-center group">
                <div>
                    <div className="text-white font-bold text-sm group-hover:text-[#FF4081] transition-colors">Issue with photo upload</div>
                    <div className="text-xs text-slate-500 mt-1">Ticket #2938 • Tech Support</div>
                </div>
                <div>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>
                </div>
                <div>
                    <Badge variant="outline" className="bg-[#FF4081]/10 text-[#FF4081] border-[#FF4081]/20">High</Badge>
                </div>
                <div className="text-xs text-slate-400">2 hours ago</div>
            </div>
        </div>

        {/* Empty State (Hidden if items exist) */}
        {/* <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-[#1A1A2E] flex items-center justify-center">
            <Ticket className="h-8 w-8 text-slate-500" />
          </div>
          <div>
            <h3 className="text-white font-medium">No tickets found</h3>
            <p className="text-slate-500 text-sm mt-1">You haven't created any support tickets yet.</p>
          </div>
          <Button variant="outline" className="border-white/10 text-[#FF4081] hover:bg-[#FF4081]/10 hover:text-[#FF4081]">
            Get Help with Knotty AI
          </Button>
        </div> */}
      </div>

      {/* Ticket Detail / Reply Area (Simplified Mockup) */}
      <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">Quick Reply to #2938</h3>
          <textarea className="w-full h-32 bg-[#1A1A2E] border border-white/10 rounded-lg p-3 text-slate-300 focus:border-[#FF4081] focus:outline-none resize-none text-sm" placeholder="Type your reply here..." />
          <div className="flex justify-between items-center mt-3">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <Paperclip className="h-4 w-4 mr-2" /> Attach Screenshot
              </Button>
              <Button className="bg-[#FF4081] hover:bg-[#FF4081]/90 text-white">Send Reply</Button>
          </div>
      </div>
    </div>
  );
}
