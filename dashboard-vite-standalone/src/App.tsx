import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Dashboard } from "./components/Dashboard";
import { ServiceProfile } from "./components/profile/ServiceProfile";
import { Button } from "./components/ui/button";
import { Eye, LayoutDashboard } from "lucide-react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

function DashboardLayout() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col bg-[#05050A]">
      <Header />
      <main className="flex-1 relative">
        <Dashboard onViewProfile={() => navigate("/profile")} />
      </main>
      <Footer />
    </div>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>The Art of Touch by Bruno | MasseurMatch</title>
        <meta name="description" content="Experience the art of touch with Bruno. Professional massage therapy services available in-studio or mobile." />
        <meta property="og:title" content="The Art of Touch by Bruno" />
        <meta property="og:description" content="Professional massage therapy services." />
        <meta property="og:type" content="profile" />
      </Helmet>
      <ServiceProfile onLogin={() => navigate("/")} />
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/" || location.pathname === "";

  return (
    <>
      <Routes>
        <Route path="/" element={
            <>
              <Helmet>
                <title>Dashboard | MasseurMatch Admin</title>
                <meta name="robots" content="noindex" />
              </Helmet>
              <DashboardLayout />
            </>
        } />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      {/* View Toggle for Demo Purposes */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => navigate(isDashboard ? "/profile" : "/")}
          className="bg-white text-black hover:bg-slate-200 shadow-xl rounded-full px-6 h-12 font-bold flex items-center gap-2 border border-slate-300"
        >
          {isDashboard ? (
            <>
              <Eye className="h-4 w-4" /> View Public Profile
            </>
          ) : (
            <>
              <LayoutDashboard className="h-4 w-4" /> Back to Dashboard
            </>
          )}
        </Button>
      </div>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}
