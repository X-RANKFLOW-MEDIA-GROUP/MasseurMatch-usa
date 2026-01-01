import { 
  X, Calendar, ChevronDown, Plus, Trash2, Check, 
  MapPin, Upload, ShieldCheck, Sparkles, Award,
  Search, CreditCard, Info, User, DollarSign, Car,
  Clock, FileCheck, Fingerprint, ScanFace, Phone, Mail
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { cn } from "../ui/utils";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

// --- MM Components ---

const MMInput = ({ label, placeholder, className, icon: Icon, value, onChange, ...props }: any) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
    <div className="relative">
      <input 
        className={cn(
          "w-full h-12 bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl px-4 text-white placeholder-[#AAA] focus:outline-none focus:border-[#21F365] transition-colors", 
          Icon && "pl-11",
          className
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />}
    </div>
  </div>
);

const MMTextArea = ({ label, placeholder, className, value, onChange, ...props }: any) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
    <textarea 
      className={cn(
        "w-full min-h-[100px] bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl p-4 text-white placeholder-[#AAA] focus:outline-none focus:border-[#21F365] transition-colors resize-y", 
        className
      )}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  </div>
);

const MMDatePicker = ({ label, ...props }: any) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
    <div className="relative">
      <input 
        className="w-full h-12 bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl pl-4 pr-10 text-white placeholder-[#AAA] focus:outline-none focus:border-[#21F365] transition-colors"
        placeholder="MM/DD/YYYY"
        {...props}
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
    </div>
  </div>
);

const MMCheckbox = ({ label, checked, onChange, description }: any) => (
  <div 
    className="flex items-start gap-3 cursor-pointer group"
    onClick={() => onChange(!checked)}
  >
    <div className={cn(
      "h-[22px] w-[22px] mt-0.5 flex-shrink-0 rounded-[4px] border border-[#2F2F2F] flex items-center justify-center transition-colors",
      checked ? "bg-[#21F365] border-[#21F365]" : "bg-transparent group-hover:border-white/30"
    )}>
      {checked && <Check className="h-3.5 w-3.5 text-black stroke-[3]" />}
    </div>
    <div>
      <span className="text-slate-200 text-sm font-medium select-none block">{label}</span>
      {description && <span className="text-slate-500 text-xs block mt-0.5">{description}</span>}
    </div>
  </div>
);

const MMSectionTitle = ({ children, icon: Icon }: any) => (
  <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6 mt-2">
    {Icon && <div className="p-2 rounded-lg bg-white/5 text-[#21F365]"><Icon className="h-5 w-5"/></div>}
    <h3 className="text-xl font-semibold text-white">
      {children}
    </h3>
  </div>
);

const SidebarItem = ({ active, icon: Icon, label, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
      active 
        ? "bg-[#21F365]/10 text-[#21F365]" 
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon className="h-4 w-4" />
    {label}
  </button>
);

const KnottyAIButton = ({ onClick, label = "Auto-Fill with Knotty AI" }: any) => (
  <Button 
    variant="ghost" 
    onClick={onClick}
    className="text-xs text-[#21F365] hover:bg-[#21F365]/10 hover:text-[#21F365] h-8 px-2 -ml-2 flex items-center gap-1.5 transition-all"
  >
    <Sparkles className="h-3 w-3" />
    {label}
  </Button>
);

export function EditProfileModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [activeRateTab, setActiveRateTab] = useState("simple");

  // Travel Section State
  // (A) Mobile Service (Local)
  const [mobileEnabled, setMobileEnabled] = useState(false);
  const [mobileRadius, setMobileRadius] = useState(15);
  const [mobileAreas, setMobileAreas] = useState<string[]>(["Uptown", "Downtown"]);
  const [newMobileArea, setNewMobileArea] = useState("");
  const [mobileFee, setMobileFee] = useState("");
  
  // (B) Travel Service (Visiting / Out-of-Region)
  const [travelEnabled, setTravelEnabled] = useState(false);
  const [travelCity, setTravelCity] = useState("");
  const [travelState, setTravelState] = useState("");
  const [travelStartDate, setTravelStartDate] = useState("");
  const [travelEndDate, setTravelEndDate] = useState("");
  const [travelFeeFlat, setTravelFeeFlat] = useState("");
  const [travelSeoKeywords, setTravelSeoKeywords] = useState<string[]>([]);
  const [newTravelSeoKeyword, setNewTravelSeoKeyword] = useState("");

  // (C) Rates State
  const [rates, setRates] = useState([
    { duration: "60", inStudio: "120", outcall: "150" },
    { duration: "90", inStudio: "160", outcall: "200" }
  ]);

  const addRateRow = () => {
    setRates([...rates, { duration: "", inStudio: "", outcall: "" }]);
  };

  const removeRateRow = (index: number) => {
    setRates(rates.filter((_, i) => i !== index));
  };

  const updateRate = (index: number, field: string, value: string) => {
    const newRates = [...rates];
    // @ts-ignore
    newRates[index][field] = value;
    setRates(newRates);
  };

  const addMobileArea = () => {
    if (newMobileArea.trim() && mobileAreas.length < 10 && !mobileAreas.includes(newMobileArea.trim())) {
      setMobileAreas([...mobileAreas, newMobileArea.trim()]);
      setNewMobileArea("");
    }
  };

  const removeMobileArea = (areaToRemove: string) => {
    setMobileAreas(mobileAreas.filter(area => area !== areaToRemove));
  };

  const addTravelSeoKeyword = () => {
    if (newTravelSeoKeyword.trim() && travelSeoKeywords.length < 10 && !travelSeoKeywords.includes(newTravelSeoKeyword.trim())) {
      setTravelSeoKeywords([...travelSeoKeywords, newTravelSeoKeyword.trim()]);
      setNewTravelSeoKeyword("");
    }
  };

  const removeTravelSeoKeyword = (keywordToRemove: string) => {
    setTravelSeoKeywords(travelSeoKeywords.filter(k => k !== keywordToRemove));
  };

  const toggleItem = (item: string, list: string[], setList: (l: string[]) => void, max?: number) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      if (max && list.length >= max) return;
      setList([...list, item]);
    }
  };

  // State for auto-filled fields
  const [formData, setFormData] = useState({
    degree_desc: "",
    affiliation_desc: "",
    discounts_desc: "",
    disclaimers_desc: "",
    payment_desc: "",
    amenities_desc: "",
    mobile_desc: "",
    location_desc: "",
    rates_desc: "",
    work_surface_desc: "",
    seo_keywords: "",
    seo_title: "",
    seo_bio: "",
    basic_bio: "",
    headline: "",
    neighborhoods: "Uptown",
    main_specialty: "Deep Tissue",
    experience_years: "",
    client_type: [],
    session_goals: []
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sections = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "professional", label: "Professional Details", icon: Award },
    { id: "travel", label: "Travel & Mobile", icon: Car },
    { id: "availability", label: "Availability", icon: Clock },
    { id: "pricing", label: "Rates & Payments", icon: DollarSign },
    { id: "verification", label: "ID Verification", icon: ShieldCheck },
    { id: "amenities", label: "Amenities", icon: Sparkles },
    { id: "location", label: "Location", icon: MapPin },
    { id: "seo", label: "SEO Optimization", icon: Search },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        const headlines = [
           "Licensed Massage Therapist - Deep Tissue & Sports",
           "Professional Male Masseur - Strong Hands",
           "Certified Massage Therapist for Men",
           "Deep Tissue & Relaxation Specialist",
           "Mobile Massage Therapist - We Come to You",
           "Sports Recovery & Pain Relief Expert",
           "Intuitive Bodywork for Stress Relief",
           "Elite Male Massage - Studio & Mobile",
           "Therapeutic Massage for Men - Uptown",
           "Full Body Relaxation & Deep Tissue",
           "Strong Deep Tissue - Licensed Therapist",
           "Executive Stress Relief - Private Studio",
           "Athletic Recovery Specialist",
           "Licensed Masseur - Therapeutic Touch",
           "Advanced Bodywork for Men"
        ];
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <MMSectionTitle icon={User}>Personal Information</MMSectionTitle>
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                 <MMInput label="First Name" placeholder="Bruno" />
                 <MMInput label="Last Name" placeholder="Silva" />
               </div>
               
               <div className="space-y-1.5">
                 <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Headline (SEO Optimized)</label>
                 <div className="relative">
                    <select 
                      className="w-full h-12 bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl px-4 text-white appearance-none focus:outline-none focus:border-[#21F365] transition-colors"
                      value={formData.headline}
                      onChange={(e) => updateField('headline', e.target.value)}
                    >
                       <option value="">Select a headline...</option>
                       {headlines.map(h => (
                         <option key={h} value={h}>{h}</option>
                       ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                 </div>
               </div>
               
               <div className="space-y-1">
                 <div className="flex justify-between items-end">
                   <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Bio / About</label>
                   <KnottyAIButton onClick={() => updateField('basic_bio', "I’m a professional massage therapist offering deep tissue, therapeutic, and sports recovery sessions tailored for men seeking real results. My work combines technique, intuition, and a calm presence to help your body release stress and tension effectively. Clean space, discreet service, and a strong, confident touch. Serving Dallas with in-studio or mobile appointments.")} />
                 </div>
                 <textarea 
                   className="w-full h-32 bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl p-4 text-white placeholder-[#AAA] focus:outline-none focus:border-[#21F365] transition-colors resize-none"
                   placeholder="Describe yourself..."
                   value={formData.basic_bio}
                   onChange={(e) => updateField('basic_bio', e.target.value)}
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <MMInput label="Phone Number" placeholder="(555) 123-4567" icon={Phone} />
                  <MMInput label="Email Address" placeholder="bruno@example.com" icon={Mail} />
               </div>
            </div>
          </div>
        );

      case "professional":
        // Merged Degrees & Affiliations for the new structure
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             <MMSectionTitle icon={Award}>Professional Details</MMSectionTitle>
             
             {/* Degrees */}
             <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Degrees & Certifications</h4>
                <div className="p-6 rounded-2xl bg-[#121212] border border-white/5 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MMInput label="Degree / Course Name" placeholder="e.g. Licensed Massage Therapist" />
                      <MMInput label="Institution Name" placeholder="Search institutions..." />
                   </div>
                   <div>
                     <div className="flex justify-between items-center mb-1.5">
                       <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Description</label>
                       <KnottyAIButton onClick={() => updateField('degree_desc', "Certification in Advanced Massage Therapy completed at [Institution], with focus on anatomy, injury rehabilitation, and evidence-based bodywork techniques.")} />
                     </div>
                     <MMTextArea 
                       value={formData.degree_desc} 
                       onChange={(e: any) => updateField('degree_desc', e.target.value)}
                       placeholder="Details about your certification..." 
                       className="h-24"
                     />
                   </div>
                   <div className="flex justify-end">
                     <Button className="bg-[#2F2F2F] text-white hover:bg-[#3F3F3F]">Add Degree</Button>
                   </div>
                </div>
             </div>

             {/* Affiliations */}
             <div className="space-y-6">
                <h4 className="text-lg font-bold text-white">Affiliations & Memberships</h4>
                <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {["AMTA", "ABMP", "NCBTMB", "Massage Assoc. Australia"].map(item => (
                      <MMCheckbox key={item} label={item} checked={false} onChange={() => {}} />
                    ))}
                  </div>
                  <div>
                     <div className="flex justify-between items-center mb-1.5">
                       <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Public Badge Description</label>
                       <KnottyAIButton onClick={() => updateField('affiliation_desc', "Active member of the American Massage Therapy Association, supporting ethical practice, ongoing education, and professional standards.")} />
                     </div>
                     <MMTextArea 
                       value={formData.affiliation_desc} 
                       onChange={(e: any) => updateField('affiliation_desc', e.target.value)}
                       placeholder="Text shown on your profile..." 
                       className="h-20"
                     />
                  </div>
                </div>
             </div>
          </div>
        );

      case "availability":
        return (
           <div className="space-y-8 animate-in fade-in duration-300">
              <MMSectionTitle icon={Clock}>Weekly Availability</MMSectionTitle>
              
              <div className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
                 {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                       <div className="w-32 font-medium text-white">{day}</div>
                       <div className="flex-1 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                             <MMInput className="h-10 w-32 text-sm" type="time" defaultValue="09:00" />
                             <span className="text-slate-500">-</span>
                             <MMInput className="h-10 w-32 text-sm" type="time" defaultValue="17:00" />
                          </div>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#21F365]">
                             <Plus className="h-4 w-4" />
                          </Button>
                       </div>
                       <Switch defaultChecked={day !== "Sunday"} className="data-[state=checked]:bg-[#21F365]" />
                    </div>
                 ))}
              </div>

              <div className="p-6 bg-[#1A1A2E] rounded-2xl border border-[#2F2F2F]">
                 <h4 className="text-white font-medium mb-2">Availability Settings</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <MMCheckbox label="Accept same-day bookings" checked={true} onChange={() => {}} />
                       <MMCheckbox label="Show calendar on public profile" checked={true} onChange={() => {}} />
                    </div>
                    <div className="space-y-4">
                       <MMInput label="Buffer time between sessions (min)" placeholder="30" />
                       <MMInput label="Minimum notice (hours)" placeholder="2" />
                    </div>
                 </div>
              </div>
           </div>
        );

      case "verification":
         return (
            <div className="space-y-8 animate-in fade-in duration-300">
               <MMSectionTitle icon={ShieldCheck}>ID Verification</MMSectionTitle>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-[#121212] border border-[#21F365]/30 flex flex-col items-center text-center gap-4 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-2 bg-[#21F365] text-black text-[10px] font-bold rounded-bl-xl">VERIFIED</div>
                     <div className="h-16 w-16 rounded-full bg-[#21F365]/10 flex items-center justify-center text-[#21F365]">
                        <ScanFace className="h-8 w-8" />
                     </div>
                     <div>
                        <h4 className="text-white font-bold">Face ID Scan</h4>
                        <p className="text-xs text-slate-400 mt-1">Identity confirmed via biometric scan.</p>
                     </div>
                     <Button variant="outline" disabled className="w-full border-[#21F365] text-[#21F365] opacity-50">Verified</Button>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#121212] border border-white/5 flex flex-col items-center text-center gap-4">
                     <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                        <FileCheck className="h-8 w-8" />
                     </div>
                     <div>
                        <h4 className="text-white font-bold">Government ID</h4>
                        <p className="text-xs text-slate-400 mt-1">Upload a photo of your driver's license or passport.</p>
                     </div>
                     <Button className="w-full bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white">Upload ID</Button>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#121212] border border-white/5 flex flex-col items-center text-center gap-4">
                     <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                        <Fingerprint className="h-8 w-8" />
                     </div>
                     <div>
                        <h4 className="text-white font-bold">Background Check</h4>
                        <p className="text-xs text-slate-400 mt-1">Optional comprehensive criminal record check.</p>
                     </div>
                     <Button className="w-full bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white">Start Check ($15)</Button>
                  </div>
               </div>

               <div className="p-4 bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl flex gap-4 items-start">
                  <ShieldCheck className="h-5 w-5 text-[#21F365] flex-shrink-0 mt-0.5" />
                  <div>
                     <h5 className="text-sm font-bold text-white">Why verify?</h5>
                     <p className="text-xs text-slate-400 mt-1">Verified profiles get 3x more bookings and appear with a "Trusted" badge in search results. This builds immediate trust with new clients.</p>
                  </div>
               </div>
            </div>
         );

      case "pricing":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <MMSectionTitle icon={DollarSign}>Session Rates & Payments</MMSectionTitle>
            
            {/* Rates Section */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <h4 className="text-lg font-bold text-white">Rates</h4>
                 <div className="bg-[#121212] p-1 rounded-xl flex gap-1">
                   <button 
                     onClick={() => setActiveRateTab("simple")}
                     className={cn(
                       "px-3 h-8 rounded-lg text-xs font-medium transition-all",
                       activeRateTab === "simple" ? "bg-[#2F2F2F] text-white shadow-sm" : "text-slate-400 hover:text-white"
                     )}
                   >
                     Simple
                   </button>
                   <button 
                     onClick={() => setActiveRateTab("technique")}
                     className={cn(
                       "px-3 h-8 rounded-lg text-xs font-medium transition-all",
                       activeRateTab === "technique" ? "bg-[#2F2F2F] text-white shadow-sm" : "text-slate-400 hover:text-white"
                     )}
                   >
                     Advanced
                   </button>
                 </div>
               </div>

               <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
                  {rates.map((rate, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end group">
                        <MMInput 
                            label={index === 0 ? "Duration (Min)" : ""} 
                            placeholder="60" 
                            value={rate.duration}
                            onChange={(e: any) => updateRate(index, 'duration', e.target.value)}
                        />
                        <MMInput 
                            label={index === 0 ? "In-Studio ($)" : ""} 
                            placeholder="120" 
                            value={rate.inStudio}
                            onChange={(e: any) => updateRate(index, 'inStudio', e.target.value)}
                        />
                        <MMInput 
                            label={index === 0 ? "Outcall ($)" : ""} 
                            placeholder="150" 
                            value={rate.outcall}
                            onChange={(e: any) => updateRate(index, 'outcall', e.target.value)}
                        />
                        <div className="pb-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                onClick={() => removeRateRow(index)}
                                disabled={rates.length === 1}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-dashed border-white/20 text-slate-400 hover:text-white hover:bg-white/5"
                    onClick={addRateRow}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Duration Option
                  </Button>
               </div>

               <div>
                 <div className="flex justify-between items-center mb-1.5">
                   <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Rate Summary (SEO)</label>
                   <KnottyAIButton onClick={() => updateField('rates_desc', "$120 for a 60-minute session (studio). Mobile sessions available with travel fee depending on distance.")} />
                 </div>
                 <MMTextArea value={formData.rates_desc} onChange={(e: any) => updateField('rates_desc', e.target.value)} className="h-20" />
               </div>
            </div>

            {/* Payment Methods Section */}
            <div className="space-y-6 pt-6 border-t border-white/5">
               <h4 className="text-lg font-bold text-white">Payment Methods</h4>
               <div>
                 <div className="flex justify-between items-center mb-1.5">
                   <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Payment Description</label>
                   <KnottyAIButton onClick={() => updateField('payment_desc', "I accept Visa, Mastercard, Zelle, Cash, and Apple Pay for your convenience.")} />
                 </div>
                 <MMTextArea value={formData.payment_desc} onChange={(e: any) => updateField('payment_desc', e.target.value)} className="h-20" />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "Cash", icon: "💵" }, { name: "Credit/Debit Card", icon: "💳", badge: "Stripe" },
                    { name: "Zelle", icon: "Z" }, { name: "Venmo", icon: "V" },
                    { name: "Apple Pay", icon: "🍎" }, { name: "Bitcoin", icon: "₿" }
                  ].map((method) => (
                     <div key={method.name} className="flex items-center justify-between p-4 rounded-xl bg-[#121212] border border-[#2F2F2F] cursor-pointer hover:border-[#21F365] transition-colors group">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-lg bg-[#1A1A2E] flex items-center justify-center text-xl">
                             {method.icon}
                           </div>
                           <div>
                             <span className="text-white font-medium block">{method.name}</span>
                             {method.badge && <span className="text-[10px] bg-[#21F365]/10 text-[#21F365] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">{method.badge}</span>}
                           </div>
                        </div>
                        <div className="h-5 w-5 rounded border border-[#2F2F2F] group-hover:border-[#21F365]" />
                     </div>
                  ))}
               </div>
            </div>
          </div>
        );

      case "travel":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <MMSectionTitle icon={Car}>Travel & Mobile Services</MMSectionTitle>
            
            <div className="grid grid-cols-1 gap-8">
               {/* (A) MOBILE SERVICE - LOCAL */}
               <div className="space-y-6 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#21F365] rounded-l-xl opacity-50"></div>
                  <div className="pl-6 space-y-6">
                     <div className="flex items-center justify-between">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <Badge variant="outline" className="border-[#21F365] text-[#21F365] bg-[#21F365]/10">LOCAL REGION</Badge>
                             <h4 className="text-white font-bold text-lg">Mobile Service</h4>
                          </div>
                          <p className="text-sm text-slate-400">Appointments at client's home/hotel within your base city.</p>
                       </div>
                       <Switch 
                          checked={mobileEnabled}
                          onCheckedChange={setMobileEnabled}
                          className="data-[state=checked]:bg-[#21F365]"
                       />
                     </div>

                     {mobileEnabled && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                           <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 space-y-4">
                              <div className="space-y-1.5">
                                 <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Service Radius (Miles)</label>
                                 <div className="flex items-center gap-4">
                                   <input 
                                     type="range" 
                                     min="1" 
                                     max="50" 
                                     value={mobileRadius}
                                     onChange={(e) => setMobileRadius(parseInt(e.target.value))}
                                     className="flex-1 accent-[#21F365] h-2 bg-[#2F2F2F] rounded-lg appearance-none cursor-pointer"
                                   />
                                   <div className="w-16 h-12 bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl flex items-center justify-center text-white font-bold">
                                      {mobileRadius}
                                   </div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <MMInput 
                                    label="Mobile Fee ($)" 
                                    placeholder="e.g. 20" 
                                    value={mobileFee} 
                                    onChange={(e: any) => setMobileFee(e.target.value)}
                                    icon={DollarSign}
                                 />
                                 <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Mobile Equipment</label>
                                    <select className="w-full h-12 bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl px-4 text-white appearance-none focus:outline-none focus:border-[#21F365] transition-colors text-sm">
                                       <option>Massage Table</option>
                                       <option>Massage Chair</option>
                                       <option>Floor Mat</option>
                                    </select>
                                 </div>
                              </div>

                              <div className="space-y-1.5">
                                 <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Neighborhoods Served</label>
                                    <KnottyAIButton label="Auto-Fill" onClick={() => setMobileAreas(["Uptown", "Oak Lawn", "Downtown", "Turtle Creek"])} />
                                 </div>
                                 <div className="flex gap-2">
                                    <MMInput 
                                      placeholder="Add neighborhood..." 
                                      value={newMobileArea}
                                      onChange={(e: any) => setNewMobileArea(e.target.value)}
                                      onKeyDown={(e: any) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          addMobileArea();
                                        }
                                      }}
                                      className="flex-1"
                                    />
                                    <Button onClick={addMobileArea} className="h-12 px-6 bg-[#2F2F2F] text-white hover:bg-[#3F3F3F]">Add</Button>
                                 </div>
                                 <div className="flex flex-wrap gap-2 mt-2">
                                    {mobileAreas.map((area, index) => (
                                       <Badge key={index} variant="secondary" className="bg-[#1A1A2E] border border-[#2F2F2F] text-slate-200 pl-2 pr-1 py-1 flex items-center gap-1">
                                          {area}
                                          <button onClick={() => removeMobileArea(area)} className="hover:text-white"><X className="h-3 w-3" /></button>
                                       </Badge>
                                    ))}
                                 </div>
                              </div>

                              {/* SEO Preview for Mobile */}
                              <div className="p-3 bg-[#000] rounded border border-white/10 flex items-start gap-3 opacity-80">
                                 <div className="bg-[#21F365]/20 p-2 rounded text-[#21F365]"><Search className="h-4 w-4" /></div>
                                 <div className="text-xs">
                                    <div className="text-[#8ab4f8] font-medium">Mobile Massage in Dallas - {mobileRadius}mi Radius</div>
                                    <div className="text-slate-400 mt-0.5">Available for at-home sessions in {mobileAreas.join(", ")}. Travel fee applies.</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* (B) TRAVEL SERVICE - VISITING */}
               <div className="space-y-6 relative pt-8 border-t border-white/5">
                  <div className="absolute left-0 top-8 bottom-0 w-1 bg-[#3B82F6] rounded-l-xl opacity-50"></div>
                  <div className="pl-6 space-y-6">
                     <div className="flex items-center justify-between">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <Badge variant="outline" className="border-[#3B82F6] text-[#3B82F6] bg-[#3B82F6]/10">VISITING / TOURING</Badge>
                             <h4 className="text-white font-bold text-lg">Travel Plans</h4>
                          </div>
                          <p className="text-sm text-slate-400">Appear as a "Visiting Therapist" in another city for a limited time.</p>
                       </div>
                       <Switch 
                          checked={travelEnabled}
                          onCheckedChange={setTravelEnabled}
                          className="data-[state=checked]:bg-[#3B82F6]"
                       />
                     </div>

                     {travelEnabled && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                           <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                 <MMInput 
                                    label="Visiting City" 
                                    placeholder="e.g. Houston" 
                                    value={travelCity} 
                                    onChange={(e: any) => setTravelCity(e.target.value)}
                                    icon={MapPin}
                                 />
                                 <MMInput 
                                    label="State" 
                                    placeholder="TX" 
                                    value={travelState} 
                                    onChange={(e: any) => setTravelState(e.target.value)}
                                 />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <MMDatePicker 
                                    label="Start Date" 
                                    value={travelStartDate} 
                                    onChange={(e: any) => setTravelStartDate(e.target.value)}
                                 />
                                 <MMDatePicker 
                                    label="End Date" 
                                    value={travelEndDate} 
                                    onChange={(e: any) => setTravelEndDate(e.target.value)}
                                 />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <MMInput 
                                    label="Travel/In-Call Fee ($)" 
                                    placeholder="Flat rate (optional)" 
                                    value={travelFeeFlat} 
                                    onChange={(e: any) => setTravelFeeFlat(e.target.value)}
                                    icon={DollarSign}
                                 />
                                 <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Availability Type</label>
                                    <select className="w-full h-12 bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl px-4 text-white appearance-none focus:outline-none focus:border-[#3B82F6] transition-colors text-sm">
                                       <option>In-Call (Hotel/Airbnb)</option>
                                       <option>Out-Call (Client's Place)</option>
                                       <option>Both</option>
                                    </select>
                                 </div>
                              </div>

                              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20">
                                 <Info className="h-5 w-5 text-[#3B82F6] flex-shrink-0" />
                                 <p className="text-xs text-slate-300">
                                    Your profile will appear in <strong>{travelCity || "[City]"}</strong> search results from <strong>{travelStartDate || "[Start]"}</strong> to <strong>{travelEndDate || "[End]"}</strong> with a "Visiting" badge.
                                 </p>
                              </div>

                              {/* SEO Preview for Travel */}
                              <div className="p-3 bg-[#000] rounded border border-white/10 flex items-start gap-3 opacity-80">
                                 <div className="bg-[#3B82F6]/20 p-2 rounded text-[#3B82F6]"><Search className="h-4 w-4" /></div>
                                 <div className="text-xs">
                                    <div className="text-[#8ab4f8] font-medium">Visiting Massage Therapist in {travelCity || "Houston"}</div>
                                    <div className="text-slate-400 mt-0.5">Available for appointments in {travelCity} from {travelStartDate} to {travelEndDate}. Limited spots.</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        );

      case "degrees":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             <MMSectionTitle icon={Award}>Degrees & Certifications</MMSectionTitle>
             
             <div className="p-6 rounded-2xl bg-[#121212] border border-white/5 space-y-6">
               <h4 className="text-white font-medium mb-4">Add New Certification</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MMInput label="Degree / Course Name" placeholder="e.g. Licensed Massage Therapist" />
                  <MMInput label="Institution Name" placeholder="Search institutions..." />
               </div>
               
               <div>
                 <div className="flex justify-between items-center mb-1.5">
                   <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Description</label>
                   <KnottyAIButton onClick={() => updateField('degree_desc', "Certification in Advanced Massage Therapy completed at [Institution], with focus on anatomy, injury rehabilitation, and evidence-based bodywork techniques.")} />
                 </div>
                 <MMTextArea 
                   value={formData.degree_desc} 
                   onChange={(e: any) => updateField('degree_desc', e.target.value)}
                   placeholder="Details about your certification..." 
                   className="h-24"
                 />
               </div>

               <MMInput label="Location" placeholder="City, State" icon={MapPin} />
               <div className="grid grid-cols-2 gap-4">
                  <MMDatePicker label="Start Date" />
                  <MMDatePicker label="End Date" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <MMInput label="License Number" placeholder="e.g. MT-123456" />
                  <MMDatePicker label="Expiration Date" />
               </div>
               
               <div className="border-2 border-dashed border-[#2F2F2F] rounded-xl h-24 flex items-center justify-center cursor-pointer hover:border-[#21F365]/50 hover:bg-[#21F365]/5 transition-all">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Upload className="h-5 w-5" />
                    <span>Upload Certificate / Proof (Optional)</span>
                  </div>
               </div>
               
               <div className="flex justify-end">
                 <Button className="bg-[#21F365] text-black hover:bg-[#21F365]/90">Add Degree</Button>
               </div>
             </div>
          </div>
        );

      case "affiliations":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <MMSectionTitle icon={ShieldCheck}>Professional Affiliations</MMSectionTitle>
            
            <div className="space-y-6">
              <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
                <h4 className="text-white font-medium mb-4">Massage Associations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["American Massage Therapy Association (AMTA)", "Associated Bodywork & Massage Professionals (ABMP)", "National Certification Board (NCBTMB)", "Massage Association of Australia", "Eastern Massage Bodywork Assoc.", "American Org. for Bodywork Therapies of Asia"].map(item => (
                    <MMCheckbox key={item} label={item} checked={false} onChange={() => {}} />
                  ))}
                </div>
              </div>

              <div>
                 <div className="flex justify-between items-center mb-1.5">
                   <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Public Badge Description</label>
                   <KnottyAIButton onClick={() => updateField('affiliation_desc', "Active member of the American Massage Therapy Association, supporting ethical practice, ongoing education, and professional standards.")} />
                 </div>
                 <MMTextArea 
                   value={formData.affiliation_desc} 
                   onChange={(e: any) => updateField('affiliation_desc', e.target.value)}
                   placeholder="Text shown on your profile..." 
                   className="h-20"
                 />
              </div>
            </div>
          </div>
        );

      case "rates":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <MMSectionTitle icon={DollarSign}>Rates & Pricing</MMSectionTitle>
            
            <div className="space-y-6">
               {/* Toggle */}
               <div className="bg-[#121212] p-1 rounded-xl flex gap-1">
                 <button 
                   onClick={() => setActiveRateTab("simple")}
                   className={cn(
                     "flex-1 h-10 rounded-lg text-sm font-medium transition-all",
                     activeRateTab === "simple" ? "bg-[#2F2F2F] text-white shadow-sm" : "text-slate-400 hover:text-white"
                   )}
                 >
                   One Simple Rate
                 </button>
                 <button 
                   onClick={() => setActiveRateTab("technique")}
                   className={cn(
                     "flex-1 h-10 rounded-lg text-sm font-medium transition-all",
                     activeRateTab === "technique" ? "bg-[#2F2F2F] text-white shadow-sm" : "text-slate-400 hover:text-white"
                   )}
                 >
                   Rates by Technique
                 </button>
               </div>

               {/* Rates Inputs */}
               <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
                  <div className="grid grid-cols-3 gap-4 items-end">
                      <MMInput label="Duration (Min)" placeholder="60" />
                      <MMInput label="In-Studio ($)" placeholder="120" />
                      <MMInput label="Outcall ($)" placeholder="150" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 items-end">
                      <MMInput placeholder="90" />
                      <MMInput placeholder="160" />
                      <MMInput placeholder="200" />
                  </div>
                  <Button variant="outline" className="w-full border-dashed border-[#2F2F2F] text-slate-400 hover:text-[#21F365] hover:border-[#21F365]">
                     <Plus className="h-4 w-4 mr-2" /> Add Duration
                  </Button>
               </div>

               {/* Rate Summary */}
               <div>
                 <div className="flex justify-between items-center mb-1.5">
                   <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Rate Summary (SEO)</label>
                   <KnottyAIButton onClick={() => updateField('rates_desc', "$120 for a 60-minute session (studio). Mobile sessions available with travel fee depending on distance.")} />
                 </div>
                 <MMTextArea value={formData.rates_desc} onChange={(e: any) => updateField('rates_desc', e.target.value)} className="h-20" />
               </div>

               {/* Discounts */}
               <div>
                 <div className="flex justify-between items-center mb-1.5">
                   <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Discounts</label>
                   <KnottyAIButton onClick={() => updateField('discounts_desc', "Reduced rates available for students, first-time clients, and active military.")} />
                 </div>
                 <MMTextArea value={formData.discounts_desc} onChange={(e: any) => updateField('discounts_desc', e.target.value)} className="h-20" />
               </div>

               {/* Disclaimers */}
               <div>
                 <div className="flex justify-between items-center mb-1.5">
                   <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Disclaimers / Policies</label>
                   <KnottyAIButton onClick={() => updateField('disclaimers_desc', "Rates vary based on session length and travel distance for mobile appointments.")} />
                 </div>
                 <MMTextArea value={formData.disclaimers_desc} onChange={(e: any) => updateField('disclaimers_desc', e.target.value)} className="h-24" />
               </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             <MMSectionTitle icon={CreditCard}>Payment Methods</MMSectionTitle>
             
             <div className="space-y-6">
               <div>
                 <div className="flex justify-between items-center mb-1.5">
                   <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Payment Description</label>
                   <KnottyAIButton onClick={() => updateField('payment_desc', "I accept Visa, Mastercard, Zelle, Cash, and Apple Pay for your convenience.")} />
                 </div>
                 <MMTextArea value={formData.payment_desc} onChange={(e: any) => updateField('payment_desc', e.target.value)} className="h-20" />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "Cash", icon: "💵" }, { name: "Credit/Debit Card", icon: "💳", badge: "Stripe" },
                    { name: "Zelle", icon: "Z" }, { name: "Venmo", icon: "V" },
                    { name: "Apple Pay", icon: "🍎" }, { name: "Google Wallet", icon: "G" },
                    { name: "Bitcoin / Crypto", icon: "₿" }, { name: "PayPal", icon: "P" }
                  ].map((method) => (
                     <div key={method.name} className="flex items-center justify-between p-4 rounded-xl bg-[#121212] border border-[#2F2F2F] cursor-pointer hover:border-[#21F365] transition-colors group">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-lg bg-[#1A1A2E] flex items-center justify-center text-xl">
                             {method.icon}
                           </div>
                           <div>
                             <span className="text-white font-medium block">{method.name}</span>
                             {method.badge && <span className="text-[10px] bg-[#21F365]/10 text-[#21F365] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">{method.badge}</span>}
                           </div>
                        </div>
                        <div className="h-5 w-5 rounded border border-[#2F2F2F] group-hover:border-[#21F365]" />
                     </div>
                  ))}
               </div>
             </div>
          </div>
        );

      case "amenities":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <MMSectionTitle icon={Sparkles}>Amenities & Extras</MMSectionTitle>
            
            <div className="space-y-6">
              <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex justify-between items-center mb-2">
                   <h4 className="text-white font-medium">Studio Amenities</h4>
                   <KnottyAIButton label="Auto-Summary" onClick={() => updateField('amenities_desc', "Studio features aromatherapy, heated massage table, private restroom, and relaxing music.")} />
                </div>
                <MMTextArea 
                   value={formData.amenities_desc} 
                   onChange={(e: any) => updateField('amenities_desc', e.target.value)} 
                   placeholder="Summary of your studio..." 
                   className="h-20 mb-4"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Aromatherapy", "Bottled Water", "Candles", "Heated Table", "Hot Towels", 
                    "Private Parking", "Shower", "WiFi", "Music Choice", "Sauna", 
                    "Private Restroom", "Doorman / Security"
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-[#1A1A2E] border border-[#2F2F2F] cursor-pointer hover:border-[#21F365]/50 transition-colors">
                       <div className="h-5 w-5 rounded border border-white/20 flex items-center justify-center" />
                       <span className="text-sm text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex justify-between items-center mb-2">
                   <h4 className="text-white font-medium">Mobile Extras</h4>
                   <KnottyAIButton label="Auto-Summary" onClick={() => updateField('mobile_desc', "For mobile sessions, I bring hot towels, massage table, aromatherapy options, and calming music.")} />
                </div>
                <MMTextArea 
                   value={formData.mobile_desc} 
                   onChange={(e: any) => updateField('mobile_desc', e.target.value)} 
                   placeholder="What do you bring?" 
                   className="h-20 mb-4"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                   {["Table Provided", "Sheets Provided", "Oils/Lotions", "Music Speaker", "Incense/Aroma", "Floor Mat", "Chair Massage"].map(item => (
                     <MMCheckbox key={item} label={item} checked={false} onChange={() => {}} />
                   ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case "location":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             <MMSectionTitle icon={MapPin}>Location & Service Radius</MMSectionTitle>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <MMInput label="Street Intersection" placeholder="e.g. Main St & 5th Ave" />
                  <div className="grid grid-cols-2 gap-4">
                    <MMInput label="City" placeholder="Dallas" />
                    <MMInput label="ZIP Code" placeholder="75001" />
                  </div>
                  
                  <div>
                     <div className="flex justify-between items-center mb-1.5">
                       <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Location Description</label>
                       <KnottyAIButton onClick={() => updateField('location_desc', "Located near [Main Street & Oak Lawn], serving Uptown Dallas and surrounding areas. Exact location shared upon booking.")} />
                     </div>
                     <MMTextArea value={formData.location_desc} onChange={(e: any) => updateField('location_desc', e.target.value)} className="h-24" />
                  </div>

                  <div className="p-4 bg-[#121212] rounded-xl border border-white/10 space-y-4">
                     <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-white">Service Radius</label>
                        <span className="text-[#21F365] text-sm font-bold">15 miles</span>
                     </div>
                     <input type="range" className="w-full accent-[#21F365]" />
                     <div className="flex justify-between text-xs text-slate-500">
                        <span>5 mi</span>
                        <span>50 mi</span>
                     </div>
                  </div>
               </div>
               
               {/* Map Preview Placeholder */}
               <div className="h-full min-h-[300px] rounded-2xl bg-[#1A1A2E] border border-[#2F2F2F] overflow-hidden relative">
                  <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-96.7970,32.7767,12,0/600x600?access_token=pk.eyJ1IjoiZmlnbWEtbWFrZSIsImEiOiJjbTNyYndoM2QwMHJzMm1zY2F5Mnh3a3J4In0.abcdefg')] bg-cover bg-center opacity-50 grayscale"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="h-32 w-32 rounded-full bg-[#21F365]/20 flex items-center justify-center animate-pulse">
                        <div className="h-4 w-4 bg-[#21F365] rounded-full shadow-[0_0_20px_#21F365] border-2 border-black" />
                     </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                     <Button size="sm" className="bg-black/80 text-white backdrop-blur border border-white/10 text-xs">
                        <Sparkles className="h-3 w-3 mr-2 text-[#21F365]" /> AI Generate Safe Location
                     </Button>
                  </div>
               </div>
             </div>
          </div>
        );

      case "seo":
        return (
           <div className="space-y-8 animate-in fade-in duration-300">
              <MMSectionTitle icon={Search}>SEO Optimization</MMSectionTitle>
              
              <div className="bg-[#0D0D0D] p-6 rounded-[20px] border border-[#21F365]/20 relative overflow-hidden shadow-[0_0_30px_rgba(33,243,101,0.1)]">
                 <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Search className="h-32 w-32 text-[#21F365]" />
                 </div>
                 <div className="relative z-10">
                   <h4 className="text-[#21F365] font-semibold text-2xl mb-2 font-['Inter']">SEO Optimization</h4>
                   <p className="text-slate-400 text-sm mb-6 max-w-md">
                     Improve your ranking on search engines. Listings with completed SEO fields get 3.5x more views.
                   </p>
                   <Button 
                     onClick={() => {
                        // 2.1 SEO Title
                        updateField('seo_title', "Deep Tissue Massage for Men in Dallas – Mobile & Studio Sessions");
                        
                        // 2.2 Short Bio
                        updateField('seo_bio', "Strong deep tissue massage for men in Dallas. Clean, discreet, LGBTQ-friendly service. Studio + mobile.");
                        
                        // 2.3 Keywords
                        updateField('seo_keywords', "gay male massage Dallas, deep tissue for men, mobile massage Uptown, sports recovery Dallas, at-home massage for men");

                        // 2.4 Neighborhoods (Logic would be more complex in real app, setting default here)
                        updateField('neighborhoods', "Uptown");

                        // 2.5 Main Specialty
                        updateField('main_specialty', "Deep Tissue");

                        // 2.6 Experience Years (Mock calculation)
                        updateField('experience_years', "7");
                     }}
                     className="bg-[#21F365] text-black font-bold hover:bg-[#21F365]/90"
                   >
                     <Sparkles className="h-4 w-4 mr-2" /> Auto-Optimize with Knotty AI
                   </Button>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                       <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">SEO Title</label>
                       <span className="text-[10px] text-slate-500">{formData.seo_title?.length || 0}/70</span>
                    </div>
                    <input 
                       className="w-full h-12 bg-[#1A1A2E] border border-[#21F365] rounded-xl px-4 text-white placeholder-[#AAA] focus:outline-none focus:shadow-[0_0_10px_rgba(33,243,101,0.2)] transition-all"
                       placeholder="Enter SEO-optimized title..."
                       value={formData.seo_title || ""}
                       onChange={(e) => updateField('seo_title', e.target.value)}
                       maxLength={70}
                    />
                 </div>

                 <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                       <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Short Bio (Meta Description)</label>
                       <span className="text-[10px] text-slate-500">{formData.seo_bio?.length || 0}/150</span>
                    </div>
                    <textarea 
                       className="w-full h-[100px] bg-[#1A1A2E] border border-[#21F365] rounded-xl p-4 text-white placeholder-[#AAA] focus:outline-none focus:shadow-[0_0_10px_rgba(33,243,101,0.2)] transition-all resize-none"
                       placeholder="Write a 150-character SEO bio..."
                       value={formData.seo_bio || ""}
                       onChange={(e) => updateField('seo_bio', e.target.value)}
                       maxLength={150}
                    />
                 </div>

                 <div className="space-y-1.5">
                   <label className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5 block">Keywords</label>
                   <MMTextArea 
                     value={formData.seo_keywords} 
                     onChange={(e: any) => updateField('seo_keywords', e.target.value)}
                     placeholder="Add up to 10 keywords..." 
                     className="h-[120px] border-[#21F365]"
                   />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Neighborhoods</label>
                       <div className="relative">
                          <select 
                            className="w-full h-12 bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl px-4 text-white appearance-none focus:outline-none focus:border-[#21F365] transition-colors"
                            value={formData.neighborhoods}
                            onChange={(e) => updateField('neighborhoods', e.target.value)}
                          >
                             <option value="">Select neighborhood...</option>
                             <option value="Uptown">Uptown</option>
                             <option value="Oak Lawn">Oak Lawn</option>
                             <option value="Downtown">Downtown</option>
                             <option value="Design District">Design District</option>
                             <option value="Plano">Plano</option>
                             <option value="Addison">Addison</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Main Specialty</label>
                       <div className="relative">
                          <select 
                            className="w-full h-12 bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl px-4 text-white appearance-none focus:outline-none focus:border-[#21F365] transition-colors"
                            value={formData.main_specialty}
                            onChange={(e) => updateField('main_specialty', e.target.value)}
                          >
                             <option value="">Choose main specialty...</option>
                             <option value="Deep Tissue">Deep Tissue</option>
                             <option value="Sports Recovery">Sports Recovery</option>
                             <option value="Mobile Massage">Mobile Massage</option>
                             <option value="LGBTQ-friendly">LGBTQ-friendly</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-1.5 w-[150px]">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Experience</label>
                    <div className="relative">
                       <input 
                          className="w-full h-12 bg-[#1A1A2E] border border-[#2F2F2F] rounded-xl px-4 text-white placeholder-[#AAA] focus:outline-none focus:border-[#21F365] transition-colors"
                          placeholder="Years"
                          value={formData.experience_years}
                          onChange={(e) => updateField('experience_years', e.target.value)}
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Yrs</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Client Type</label>
                          <KnottyAIButton label="Auto-Select" onClick={() => updateField('client_type', ["Men", "LGBTQ+", "Athletes"])} />
                       </div>
                       <div className="space-y-2">
                          {["Men", "LGBTQ+", "Athletes", "Everyone"].map(item => (
                             <MMCheckbox 
                                key={item} 
                                label={item} 
                                checked={(formData.client_type as string[])?.includes(item)} 
                                onChange={() => {
                                    const current = (formData.client_type as string[]) || [];
                                    const updated = current.includes(item) 
                                       ? current.filter(i => i !== item)
                                       : [...current, item];
                                    updateField('client_type', updated);
                                }} 
                             />
                          ))}
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Session Goals</label>
                          <KnottyAIButton label="Auto-Select" onClick={() => updateField('session_goals', ["Pain Relief", "Stress Reduction", "Muscle Recovery"])} />
                       </div>
                       <div className="space-y-2">
                          {["Pain Relief", "Stress Reduction", "Muscle Recovery", "Flexibility"].map(item => (
                             <MMCheckbox 
                                key={item} 
                                label={item} 
                                checked={(formData.session_goals as string[])?.includes(item)} 
                                onChange={() => {
                                    const current = (formData.session_goals as string[]) || [];
                                    const updated = current.includes(item) 
                                       ? current.filter(i => i !== item)
                                       : [...current, item];
                                    updateField('session_goals', updated);
                                }} 
                             />
                          ))}
                       </div>
                    </div>
                 </div>
                 
                 <div className="bg-[#121212] p-4 rounded-xl border border-white/5 mt-4">
                    <h5 className="text-white font-medium mb-2">Google Search Preview</h5>
                    <div className="mt-3 p-3 bg-[#000] rounded border border-white/10">
                        <div className="text-[#21F365] text-sm truncate">https://theartoftouch.com/therapist/bruno-silva</div>
                        <div className="text-[#8ab4f8] text-lg truncate hover:underline cursor-pointer">
                            {formData.seo_title || "Massage Therapist in Dallas - Bruno Silva | The Art of Touch"}
                        </div>
                        <div className="text-[#bdc1c6] text-xs mt-1 line-clamp-2">
                            {formData.seo_bio || "Professional massage therapist offering deep tissue, therapeutic, and sports recovery sessions..."}
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        );

      default:
        return (
           <div className="space-y-8 animate-in fade-in duration-300">
             <MMSectionTitle icon={Info}>Basic Info & Rates</MMSectionTitle>
             <p className="text-slate-400">Select a section from the left to edit details.</p>
           </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1A1A2E] border border-white/10 text-white hover:bg-white/5 h-10">
          Edit Full Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full h-full md:max-w-[1100px] md:h-[85vh] p-0 gap-0 bg-[#0C0C0C] border-0 md:border md:border-[#1A1A1A] shadow-none md:shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-none md:rounded-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex-shrink-0 h-16 border-b border-[#1A1A1A] flex items-center justify-between px-4 md:px-6 bg-[#0C0C0C]">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-[#21F365] flex items-center justify-center text-black font-bold">B</div>
             <div>
               <DialogTitle className="text-base md:text-lg font-bold text-white">Edit Profile</DialogTitle>
               <DialogDescription className="sr-only">Make changes to your professional profile here.</DialogDescription>
             </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Mobile Navigation (Dropdown) */}
          <div className="md:hidden px-4 py-3 border-b border-[#1A1A1A] bg-[#0F0F12]">
            <div className="relative">
              <select 
                className="w-full h-10 bg-[#1A1A2E] border border-[#2F2F2F] rounded-lg px-4 text-white appearance-none focus:outline-none focus:border-[#21F365] transition-colors text-sm"
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
              >
                 {sections.map(section => (
                   <option key={section.id} value={section.id}>{section.label}</option>
                 ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="w-[260px] border-r border-[#1A1A1A] bg-[#0F0F12] p-4 hidden md:flex flex-col gap-1">
             <div className="text-xs font-bold text-slate-500 px-4 py-2 uppercase tracking-wider mb-2">Profile Sections</div>
             {sections.map(section => (
                <SidebarItem 
                   key={section.id} 
                   icon={section.icon} 
                   label={section.label} 
                   active={activeSection === section.id}
                   onClick={() => setActiveSection(section.id)}
                />
             ))}
          </div>

          {/* Content Area */}
          <ScrollArea className="flex-1 bg-[#0C0C0C]">
            <div className="p-4 md:p-8 max-w-3xl mx-auto pb-20 md:pb-8">
               {renderContent()}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 h-[80px] border-t border-[#1A1A1A] bg-[#0C0C0C] flex items-center justify-between px-4 md:px-8 safe-area-bottom">
           <div className="text-sm text-slate-500 hidden md:block">
              Last saved: Just now
           </div>
           <div className="flex gap-3 ml-auto w-full md:w-auto">
             <Button variant="ghost" onClick={() => setIsOpen(false)} className="flex-1 md:flex-none text-slate-300 hover:text-white">Cancel</Button>
             <Button className="flex-1 md:flex-none bg-[#21F365] text-black hover:bg-[#21F365]/90 font-bold px-8">Save Changes</Button>
           </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
