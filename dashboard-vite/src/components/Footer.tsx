export function Footer() {
  return (
    <footer className="bg-[#05050A] text-slate-400 py-12 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">MasseurMatch</h3>
            <p className="text-sm leading-relaxed">
              Connecting you with professional massage therapists in your area. 
              Find the perfect match for your relaxation and wellness needs.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#FF4081] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#FF4081] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#FF4081] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#FF4081] transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#FF4081] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#FF4081] transition-colors">Safety Center</a></li>
              <li><a href="#" className="hover:text-[#FF4081] transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-[#FF4081] transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#FF4081] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#FF4081] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#FF4081] transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2025 MasseurMatch. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Social icons would go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
