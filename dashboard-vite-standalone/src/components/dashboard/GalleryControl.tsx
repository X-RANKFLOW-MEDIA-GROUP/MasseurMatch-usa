import { useState } from "react";
import { 
  Camera, Lock, ShieldCheck, Star, Trash2, 
  Plus, AlertCircle, ImageIcon 
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { cn } from "../ui/utils";

type Tier = "FREE" | "STANDARD" | "PRO" | "ELITE";

interface GalleryControlProps {
  initialTier?: Tier;
}

export function GalleryControl({ initialTier = "PRO" }: GalleryControlProps) {
  const [tier, setTier] = useState<Tier>(initialTier);
  
  // Mock photos state
  const [photos, setPhotos] = useState([
    "https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbWFzc2FnZSUyMHRoZXJhcGlzdCUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2NDA3MzgwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1519824145371-296894a0daa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbWFzc2FnZSUyMHRoZXJhcGlzdHxlbnwwfHx8fDE3NjQwNzM4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwc3BhJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzY0MDczODA0fDA&ixlib=rb-4.1.0&q=80&w=1080"
  ]);

  // Tier Configuration
  const config = {
    FREE: {
      name: "Free",
      limit: 2,
      features: [],
      color: "text-slate-400",
      borderColor: "border-slate-700"
    },
    STANDARD: {
      name: "Standard",
      limit: 4,
      features: [],
      color: "text-blue-400",
      borderColor: "border-blue-400/30"
    },
    PRO: {
      name: "Pro",
      limit: 8,
      features: ["Priority Moderation"],
      color: "text-[#FF4081]",
      borderColor: "border-[#FF4081]/30"
    },
    ELITE: {
      name: "Elite",
      limit: 10,
      features: ["Featured Gallery", "Max Priority Moderation"],
      color: "text-[#21F365]",
      borderColor: "border-[#21F365]/30"
    }
  };

  const currentConfig = config[tier];
  const isLimitReached = photos.length >= currentConfig.limit;

  const handleAddPhoto = () => {
    if (!isLimitReached) {
      // Add a placeholder photo for demo
      setPhotos([...photos, "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwcm9vbXxlbnwwfHx8fDE3NjQwNzM4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080"]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  return (
    <div className="bg-[#0F0F16] border border-white/10 rounded-xl p-6 relative overflow-hidden group/container">
       
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Profile Photos
            <Badge variant="outline" className={cn("ml-2", currentConfig.color, currentConfig.borderColor)}>
              {currentConfig.name}
            </Badge>
          </h3>
          <p className="text-sm text-slate-400">
            {photos.length} of {currentConfig.limit} photos used
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddPhoto}
          disabled={isLimitReached}
          className={cn(
            "border-white/10", 
            isLimitReached ? "opacity-50 cursor-not-allowed" : "text-[#21F365] hover:bg-[#21F365]/10"
          )}
        >
          <Camera className="h-4 w-4 mr-2" />
          {isLimitReached ? "Limit Reached" : "Add Photos"}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 space-y-2">
        <Progress 
          value={(photos.length / currentConfig.limit) * 100} 
          className="h-1.5 bg-white/10" 
          indicatorClassName={photos.length >= currentConfig.limit ? "bg-red-500" : "bg-[#21F365]"} 
        />
        {isLimitReached && (
           <div className="flex items-center gap-2 text-xs text-amber-500">
             <AlertCircle className="h-3 w-3" />
             <span>Upgrade your plan to add more photos.</span>
           </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
        {/* Render Photos */}
        {photos.slice(0, currentConfig.limit).map((url, i) => (
          <div key={i} className="aspect-square rounded-lg bg-[#1A1A2E] border border-white/10 overflow-hidden relative group">
            <ImageWithFallback 
               src={url} 
               alt={`Gallery ${i+1}`} 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
               <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => handleRemovePhoto(i)}>
                 <Trash2 className="h-4 w-4"/>
               </Button>
            </div>

            {/* Priority Badge for Pro/Elite */}
            {tier !== "FREE" && tier !== "STANDARD" && i === 0 && (
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/10 flex items-center gap-1">
                 <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                 <span className="text-[10px] font-bold text-white">Featured</span>
              </div>
            )}
          </div>
        ))}

        {/* Locked Slots (Placeholders) */}
        {Array.from({ length: Math.max(0, currentConfig.limit - photos.length) }).map((_, i) => (
          <div 
            key={`empty-${i}`} 
            className="aspect-square rounded-lg bg-[#1A1A2E] border border-dashed border-white/10 flex flex-col items-center justify-center text-slate-600 gap-2 hover:bg-white/5 transition-colors cursor-pointer"
            onClick={handleAddPhoto}
          >
            <Plus className="h-6 w-6 opacity-50" />
            <span className="text-xs font-medium">Add Photo</span>
          </div>
        ))}

        {/* Upgrade Slots (Locked by Tier) */}
        {tier !== "ELITE" && Array.from({ length: Math.min(2, 10 - currentConfig.limit) }).map((_, i) => (
           <div key={`locked-${i}`} className="aspect-square rounded-lg bg-[#0A0A0F] border border-dashed border-white/5 flex flex-col items-center justify-center text-slate-700 gap-2 opacity-50">
              <Lock className="h-5 w-5" />
              <span className="text-[10px] text-center px-2">Unlock with {tier === "FREE" ? "Standard" : tier === "STANDARD" ? "Pro" : "Elite"}</span>
           </div>
        ))}

      </div>

      {/* Feature Highlights */}
      {(currentConfig.features.length > 0) && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
           {currentConfig.features.map((feature, i) => (
             <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#21F365]/5 border border-[#21F365]/20">
                <ShieldCheck className="h-3 w-3 text-[#21F365]" />
                <span className="text-xs text-[#21F365] font-bold">{feature}</span>
             </div>
           ))}
        </div>
      )}

      {/* Dev Toggle (Remove in production) */}
      <div className="absolute top-2 right-2 opacity-0 group-hover/container:opacity-100 transition-opacity bg-black/80 p-1 rounded z-10">
         <select 
            value={tier} 
            onChange={(e) => { 
              setTier(e.target.value as Tier);
              // Trim photos if downgrading
              const newLimit = config[e.target.value as Tier].limit;
              if (photos.length > newLimit) {
                 setPhotos(photos.slice(0, newLimit));
              }
            }}
            className="bg-transparent text-xs text-white border-none outline-none"
         >
            <option value="FREE">Free</option>
            <option value="STANDARD">Standard</option>
            <option value="PRO">Pro</option>
            <option value="ELITE">Elite</option>
         </select>
      </div>

    </div>
  );
}
