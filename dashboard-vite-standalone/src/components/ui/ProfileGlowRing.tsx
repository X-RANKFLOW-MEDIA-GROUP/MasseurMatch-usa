import { cn } from "./utils";

interface ProfileGlowRingProps {
  children: React.ReactNode;
  className?: string;
  color?: string; // Optional override, defaults to neon pink
}

export function ProfileGlowRing({ children, className, color = "#FF147A" }: ProfileGlowRingProps) {
  return (
    <div 
      className={cn("relative inline-block rounded-full", className)}
      style={{
        boxShadow: `0 0 45px 4px ${color}cc`, // 0.8 opacity approx
      }}
    >
      <div 
        className="absolute inset-0 rounded-full pointer-events-none z-10"
        style={{
          border: `6px solid ${color}`,
        }}
      />
      <div className="rounded-full overflow-hidden w-full h-full relative z-0">
        {children}
      </div>
    </div>
  );
}
