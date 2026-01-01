import { 
  Image, Upload, CheckCircle, AlertCircle, Info 
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export function Photos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Photo Manager</h2>
          <p className="text-slate-400 text-sm">Manage your gallery, profile picture, and private album.</p>
        </div>
        <Button className="bg-[#FF4081] hover:bg-[#FF4081]/90 text-white">
          <Upload className="h-4 w-4 mr-2" /> Upload New
        </Button>
      </div>

      {/* Tabs Mockup */}
      <div className="flex border-b border-white/10 mb-6">
        <button className="px-4 py-2 text-[#FF4081] border-b-2 border-[#FF4081] font-medium text-sm">Approved</button>
        <button className="px-4 py-2 text-slate-400 hover:text-white font-medium text-sm">Pending (1)</button>
        <button className="px-4 py-2 text-slate-400 hover:text-white font-medium text-sm">Rejected</button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Photo 1 */}
        <div className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-black border border-white/10">
           <ImageWithFallback
             src="https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbWFzc2FnZSUyMHRoZXJhcGlzdCUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2NDA3MzgwNHww&ixlib=rb-4.1.0&q=80&w=1080"
             alt="Gallery 1"
             className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
           />
           <div className="absolute top-2 right-2">
             <Badge className="bg-[#00E676] text-black text-[10px] font-bold">Main</Badge>
           </div>
        </div>

        {/* Photo 2 */}
        <div className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-black border border-white/10">
           <ImageWithFallback
             src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwdGhlcmFweXxlbnwxfHx8fDE2NTQ1NDU0NTQ&ixlib=rb-4.1.0&q=80&w=1080"
             alt="Gallery 2"
             className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
           />
        </div>
        
        {/* Pending Photo */}
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#1A1A2E] border border-white/10 flex items-center justify-center border-dashed border-yellow-500/50">
           <div className="text-center p-4">
              <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-yellow-500 text-xs font-bold">Pending Approval</p>
           </div>
        </div>
      </div>
      
      <div className="p-4 bg-[#0F0F16] border border-white/10 rounded-xl flex gap-4 items-start">
         <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
         <div className="space-y-1">
            <h4 className="text-white font-medium text-sm">Photo Guidelines</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
               All photos must be high quality, well-lit, and professional. No explicit content, watermarks, or text overlays. 
               Selfies must clearly show your face. Group photos are not allowed.
            </p>
         </div>
      </div>
    </div>
  );
}
