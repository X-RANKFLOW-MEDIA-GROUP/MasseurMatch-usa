import { Search, Menu } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#05050A]/90 backdrop-blur-md text-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-[#FF4081]">Masseur</span>Match
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#" className="hover:text-[#FF4081] transition-colors">Home</a>
            <a href="#" className="hover:text-[#FF4081] transition-colors">Explore</a>
            <a href="#" className="hover:text-[#FF4081] transition-colors">About Us</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search therapists..."
              className="h-9 w-full rounded-md border border-white/10 bg-[#151525] pl-9 pr-4 text-sm text-white outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-all placeholder:text-slate-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden md:flex text-slate-300 hover:text-white hover:bg-white/10">Log In</Button>
            <Button size="sm" className="bg-[#FF4081] hover:bg-[#FF4081]/90 text-white border-0">Join Now</Button>
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
