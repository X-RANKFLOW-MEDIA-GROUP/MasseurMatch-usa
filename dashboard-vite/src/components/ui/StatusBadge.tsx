import { cn } from "./utils";

export type StatusType = "AVAILABLE_NOW" | "AWAY" | "TRAVELING" | "BUSY" | "HIDDEN";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig = {
  AVAILABLE_NOW: {
    label: "AVAILABLE NOW",
    classes: "bg-[#FF147A] border-[#FF66B2] shadow-[0_0_22px_3px_rgba(255,20,122,0.8)] text-white"
  },
  AWAY: {
    label: "AWAY",
    classes: "bg-[#FFD43B] border-[#FFE066] shadow-[0_0_22px_3px_rgba(255,212,59,0.5)] text-black"
  },
  TRAVELING: {
    label: "TRAVELING",
    classes: "bg-[#3DA9F5] border-[#66C2FF] shadow-[0_0_22px_3px_rgba(61,169,245,0.5)] text-white"
  },
  BUSY: {
    label: "BUSY",
    classes: "bg-[#FF6A3D] border-[#FF8F66] shadow-[0_0_22px_3px_rgba(255,106,61,0.5)] text-white"
  },
  HIDDEN: {
    label: "HIDDEN",
    classes: "bg-[#9B5DE5] border-[#B784F0] shadow-[0_0_22px_3px_rgba(155,93,229,0.25)] text-white"
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <div className={cn(
      "inline-flex items-center justify-center px-7 py-3 rounded-full border",
      "text-[13px] font-semibold uppercase leading-none tracking-wide",
      "transition-all duration-300",
      config.classes,
      className
    )}>
      {config.label}
    </div>
  );
}
