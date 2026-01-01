import { 
  CreditCard, Calendar, Download, ExternalLink, 
  Check, AlertCircle, Clock, Plus, MoreHorizontal, Tag
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "../ui/utils";

export function BillingPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
          <p className="text-slate-400 mt-2">Manage your subscription plan, payment methods, and download invoices.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-[#2F2F2F] text-slate-300 hover:text-white hover:bg-[#1A1A2E]">
             Contact Support
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* SUBSCRIPTION CARD */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1A1A2E]/30">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <span className="bg-[#21F365] w-2 h-2 rounded-full animate-pulse"></span>
                 Current Subscription
               </h3>
               <Badge className="bg-[#21F365]/20 text-[#21F365] border-[#21F365]/30 hover:bg-[#21F365]/30">ACTIVE</Badge>
            </div>
            
            <div className="p-6 md:p-8">
               <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Gold Professional Plan</h2>
                    <p className="text-slate-400 text-sm">Premium visibility, advanced SEO tools, and priority booking features.</p>
                  </div>
                  <div className="text-left md:text-right">
                     <div className="text-3xl font-bold text-[#21F365]">$246.99</div>
                     <div className="text-slate-500 text-sm">per month</div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0A0A0F] rounded-xl p-6 border border-white/5">
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Status</div>
                    <div className="text-white font-medium flex items-center gap-2">
                       Active & Paid
                       <Check className="h-4 w-4 text-[#21F365]" />
                    </div>
                    <div className="text-xs text-slate-400">Paid through Dec 3, 2025</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Next Billing Date</div>
                    <div className="text-white font-medium flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-slate-400" />
                       December 3, 2025
                    </div>
                    <div className="text-xs text-slate-400">Auto-renewal enabled</div>
                  </div>
               </div>
               
               <div className="mt-6 p-4 border border-dashed border-white/10 rounded-lg bg-[#1A1A2E]/20">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <Tag className="h-5 w-5 text-[#FF4081]" />
                        <div>
                           <p className="text-white text-sm font-bold">Promo Code</p>
                           <p className="text-xs text-slate-500">Have a discount code?</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                         <input type="text" placeholder="Enter code" className="bg-[#0F0F12] border border-white/10 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-[#FF4081]" />
                         <Button size="sm" className="bg-[#FF4081] hover:bg-[#FF4081]/90 text-white h-8">Apply</Button>
                     </div>
                  </div>
               </div>

               <div className="mt-8 flex flex-wrap gap-3">
                  <Button className="bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] border border-white/5">
                    Change Plan
                  </Button>
                  <Button variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20">
                    Cancel Subscription
                  </Button>
                  <a href="#" className="ml-auto text-sm text-slate-500 hover:text-[#21F365] underline-offset-4 hover:underline flex items-center gap-1 mt-2 md:mt-0">
                    View expired subscriptions
                  </a>
               </div>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1A1A2E]/30">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <CreditCard className="h-5 w-5 text-[#21F365]" />
                 Payment Methods
               </h3>
               <Button size="sm" className="bg-[#21F365] text-black hover:bg-[#21F365]/90 h-8 text-xs font-bold">
                 <Plus className="h-3 w-3 mr-1" /> Add Method
               </Button>
            </div>
            
            <div className="p-6 space-y-4">
               
               {/* Primary Card */}
               <div className="p-4 rounded-xl border border-[#21F365]/30 bg-[#21F365]/5 flex flex-col md:flex-row justify-between gap-4 group transition-all">
                  <div className="flex gap-4">
                     <div className="h-12 w-16 bg-white rounded-md flex items-center justify-center shadow-sm">
                        {/* Visa Logo Mockup */}
                        <span className="font-black text-blue-600 italic text-xl">VISA</span>
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <span className="text-white font-bold text-lg">•••• 5989</span>
                           <Badge className="bg-[#21F365] text-black text-[10px] px-1.5 py-0 h-4">PRIMARY</Badge>
                        </div>
                        <div className="text-sm text-slate-400">Expires 08/2029</div>
                        <div className="text-xs text-slate-500 mt-1">Gleicimar segatti dos Santos</div>
                        <div className="text-xs text-slate-500">2334 LUCAS DR, Dallas, TX 75219</div>
                     </div>
                  </div>
                  <div className="flex flex-row md:flex-col gap-2 justify-end">
                     <Button size="sm" variant="outline" className="border-[#2F2F2F] bg-[#1A1A2E] text-slate-300 hover:text-white text-xs h-8">
                       Replace
                     </Button>
                     <Button size="sm" variant="outline" className="border-[#2F2F2F] bg-[#1A1A2E] text-slate-300 hover:text-white text-xs h-8">
                       Edit Address
                     </Button>
                  </div>
               </div>

               {/* Backup Card */}
               <div className="p-4 rounded-xl border border-white/5 bg-[#0F0F12] flex flex-col md:flex-row justify-between gap-4 hover:border-white/10 transition-all">
                  <div className="flex gap-4">
                     <div className="h-12 w-16 bg-white rounded-md flex items-center justify-center shadow-sm relative overflow-hidden">
                        {/* Mastercard Logo Mockup */}
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-6 h-6 bg-red-500 rounded-full opacity-80 -mr-3"></div>
                           <div className="w-6 h-6 bg-yellow-500 rounded-full opacity-80"></div>
                        </div>
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <span className="text-white font-bold text-lg">•••• 2138</span>
                           <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">Backup</span>
                        </div>
                        <div className="text-sm text-slate-400">Expires 08/2029</div>
                        <div className="text-xs text-slate-500 mt-1">Gleicimar segatti hall</div>
                        <div className="text-xs text-slate-500">2334 LUCAS DR, Dallas, TX 75219</div>
                     </div>
                  </div>
                  <div className="flex flex-row md:flex-col gap-2 justify-end">
                     <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs h-8">
                       Make Primary
                     </Button>
                     <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-8">
                       Remove
                     </Button>
                  </div>
               </div>

            </div>
            <div className="px-6 py-4 bg-[#1A1A2E]/30 border-t border-white/5 text-xs text-slate-500 flex items-center gap-2">
               <AlertCircle className="h-3 w-3" />
               Payments are securely processed by Stripe. Your card details are never stored on our servers.
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - INVOICES */}
        <div className="xl:col-span-1">
           <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden sticky top-24">
              <div className="p-6 border-b border-white/10 bg-[#1A1A2E]/30">
                 <h3 className="text-lg font-bold text-white">Invoice History</h3>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-[#0F0F12] sticky top-0 z-10">
                       <tr>
                          <th className="px-6 py-3 font-medium">Date</th>
                          <th className="px-6 py-3 font-medium">Amount</th>
                          <th className="px-6 py-3 font-medium text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {[
                          { date: "11/03/2025", amount: "$16.55", status: "Paid" },
                          { date: "11/01/2025", amount: "$152.91", status: "Paid" },
                          { date: "10/22/2025", amount: "$138.99", status: "Paid" },
                          { date: "09/22/2025", amount: "$138.99", status: "Paid" },
                          { date: "08/19/2025", amount: "$374.99", status: "Paid" },
                          { date: "07/19/2025", amount: "$374.99", status: "Paid" },
                          { date: "07/05/2025", amount: "$0.00", status: "Paid" },
                          { date: "06/24/2025", amount: "$161.01", status: "Paid" },
                          { date: "06/20/2025", amount: "$246.99", status: "Paid" },
                          { date: "05/20/2025", amount: "$374.99", status: "Refunded" },
                       ].map((invoice, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors group">
                             <td className="px-6 py-4 text-slate-300 font-medium">
                                {invoice.date}
                             </td>
                             <td className="px-6 py-4 text-white font-bold">
                                {invoice.amount}
                             </td>
                             <td className="px-6 py-4 text-right">
                                {invoice.status === "Paid" ? (
                                   <Badge variant="outline" className="bg-[#21F365]/10 text-[#21F365] border-[#21F365]/20 text-[10px] h-5 px-1.5 gap-1">
                                      Paid
                                   </Badge>
                                ) : (
                                   <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[10px] h-5 px-1.5">
                                      {invoice.status}
                                   </Badge>
                                )}
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 mt-[-18px] p-1 hover:bg-white/10 rounded">
                                   <Download className="h-3 w-3 text-slate-400" />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 
                 <div className="p-4 border-t border-white/5 text-center">
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white text-xs w-full">
                       View All Invoices
                    </Button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
