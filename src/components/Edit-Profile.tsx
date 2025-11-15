"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { useProfile } from "@/src/context/ProfileContext";

import {
  User,
  MapPin,
  Wrench,
  BadgeDollarSign,
  Plus,
  Trash2,
  Images,
  Link as LinkIcon,
  CreditCard,
  Star,
  Building2,
  Umbrella,
  PackageOpen,
  Plane,
  Languages,
  Info,
  Clock,
  Award,
  Percent,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
  Save,
  ArrowLeft,
} from "lucide-react";

/* ============================================
   CONSTANTES
============================================ */
const MASSAGE_TECHNIQUES = [
  "Swedish",
  "Deep Tissue",
  "Sports",
  "Thai",
  "Hot Stone",
  "Prenatal",
  "Aromatherapy",
  "Shiatsu",
  "Reflexology",
  "Trigger Point",
];

const STUDIO_AMENITIES = [
  "Aromatherapy Enhanced",
  "Bottled Water",
  "Candles",
  "Drinking Water",
  "Free Parking",
  "Fully Handicapped Accessible",
  "Heated Massage Table",
  "Hot Towels",
  "Massage Table",
  "Metered Parking",
  "Music",
  "Pool",
  "Private Parking",
  "Private Restroom",
  "Sauna",
  "Secured Entrance/Doorman",
  "Shower",
  "Soft Drinks",
  "Spa/Hot Tub",
  "Tea",
  "Wine",
];

const MOBILE_EXTRAS = [
  "Aromatherapy Enhanced",
  "Candles",
  "Heated Massage Table",
  "Hot Towels",
  "Massage Table",
  "Music",
];

const ADDITIONAL_SERVICES = [
  "Acupuncture",
  "Body scrubs",
  "Cupping",
  "Facials",
  "Fitness training",
  "Hair styling",
  "Hydrotherapy",
  "Manicures",
  "Meditation coaching",
  "Nutrition consulting",
  "Pedicures",
  "Personal coaching",
  "Waxing",
  "Yoga instruction",
];

const PAYMENT_METHODS = [
  "Visa",
  "MasterCard",
  "Amex",
  "Discover",
  "Cash",
  "Venmo",
  "Zelle",
];

const LANGUAGES = [
  "English",
  "Portuguese",
  "Spanish",
  "French",
  "Italian",
  "German",
  "Japanese",
  "Chinese",
  "Korean",
];

const SPECIAL_DISCOUNT_GROUPS = [
  "first-time clients",
  "military veterans",
  "students",
  "active military",
  "law enforcement",
  "repeat clients",
  "dancers",
  "entertainment industry",
  "massage therapists",
  "senior citizens",
  "bodybuilders",
];

const AFFILIATIONS = [
  "American College of Sports Medicine",
  "National Association of Massage Therapists",
  "American Organization for Bodywork Therapies of Asia",
  "Associated Bodywork and Massage Professionals",
  "National Certification Board for Therapeutic Massage & Bodywork",
  "American Massage Therapy Association",
];

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/* ============================================
   TIPOS
============================================ */
type EditStatus = "idle" | "saving" | "success" | "error";

type Notification = {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  autoClose?: boolean;
};

type FormData = Record<string, any>;

/* ============================================
   HELPERS
============================================ */
function ensureArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* ignore */
    }
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/* ============================================
   COMPONENTES UI
============================================ */
const NotificationToast = ({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) => {
  const colors = {
    info: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    success: "bg-green-500/10 border-green-500/30 text-green-300",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
    error: "bg-red-500/10 border-red-500/30 text-red-300",
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: AlertCircle,
  };

  const Icon = icons[notification.type];

  useEffect(() => {
    if (notification.autoClose !== false) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.autoClose, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 max-w-md p-4 rounded-lg border backdrop-blur-sm shadow-xl z-50 animate-slide-in ${colors[notification.type]}`}
    >
      <div className="flex items-start gap-3">
        <Icon size={20} className="flex-shrink-0 mt-0.5" />
        <p className="flex-1 text-sm font-medium">{notification.message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: EditStatus }) => {
  const config = {
    idle: { icon: null, text: "", color: "", spin: false },
    saving: {
      icon: Loader,
      text: "Saving changes...",
      color: "text-blue-400",
      spin: true,
    },
    success: {
      icon: CheckCircle,
      text: "Changes saved!",
      color: "text-green-400",
      spin: false,
    },
    error: {
      icon: AlertCircle,
      text: "Failed to save",
      color: "text-red-400",
      spin: false,
    },
  } as const;

  const { icon: Icon, text, color, spin } = config[status];
  if (!Icon) return null;

  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <Icon className={spin ? "animate-spin" : ""} size={18} />
      <span className="text-sm font-semibold">{text}</span>
    </div>
  );
};

const Section = ({
  icon: Icon,
  title,
  children,
  description,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
  description?: string;
}) => (
  <section className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm">
    <div className="mb-6">
      <h2 className="flex items-center gap-3 text-xl font-bold text-white mb-2">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Icon size={22} className="text-purple-400" />
        </div>
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-400 ml-12">{description}</p>
      )}
    </div>
    {children}
  </section>
);

const FormField = ({
  label,
  children,
  fullWidth = false,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  required?: boolean;
}) => (
  <label
    className={`flex flex-col gap-2 ${
      fullWidth ? "col-span-full" : ""
    }`}
  >
    <span className="text-sm font-semibold text-gray-200">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </span>
    {children}
  </label>
);

const Input = ({
  value,
  onChange,
  placeholder = "",
  type = "text",
  name = "",
  disabled = false,
}: any) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  />
);

const Textarea = ({
  value,
  onChange,
  placeholder = "",
  rows = 3,
  name = "",
}: any) => (
  <textarea
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
  />
);

const ChipGroup = ({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => {
      const isSelected = selected.includes(option);
      return (
        <button
          key={option}
          type="button"
          onClick={() => onToggle(option)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isSelected
              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
              : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700"
          }`}
        >
          {option}
        </button>
      );
    })}
  </div>
);

/* ============================================
   COMPONENTE PRINCIPAL
============================================ */
export default function EditProfile() {
  const router = useRouter();
  const { therapist, loading: profileLoading } = useProfile();

  const [form, setForm] = useState<FormData>({});
  const [status, setStatus] = useState<EditStatus>("idle");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingEdits, setPendingEdits] = useState<any[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ============================================
     NOTIFICAÇÕES
  ============================================ */
  const addNotification = (
    type: Notification["type"],
    message: string,
    autoClose = true
  ) => {
    const notification: Notification = {
      id: generateId(),
      type,
      message,
      autoClose,
    };
    setNotifications((prev) => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  /* ============================================
     CARREGAR DADOS INICIAIS
  ============================================ */
  useEffect(() => {
    if (!therapist) return;

    const initial: FormData = {
      full_name: therapist.full_name ?? "",
      headline: therapist.headline ?? "",
      about: therapist.about ?? "",
      philosophy: therapist.philosophy ?? "",

      city: therapist.city ?? "",
      state: therapist.state ?? "",
      country: therapist.country ?? "",
      neighborhood: therapist.neighborhood ?? "",
      address: therapist.address ?? "",
      zip_code: therapist.zip_code ?? "",
      nearest_intersection: therapist.nearest_intersection ?? "",

      mobile_service_radius: therapist.mobile_service_radius ?? 0,
      services_headline: therapist.services_headline ?? "",
      specialties_headline: therapist.specialties_headline ?? "",
      promotions_headline: therapist.promotions_headline ?? "",

      massage_techniques: ensureArray(therapist.massage_techniques),
      studio_amenities: ensureArray(therapist.studio_amenities),
      mobile_extras: ensureArray(therapist.mobile_extras),
      additional_services: ensureArray(therapist.additional_services),
      products_used: therapist.products_used ?? "",

      rate_60: therapist.rate_60 ?? "",
      rate_90: therapist.rate_90 ?? "",
      rate_outcall: therapist.rate_outcall ?? "",
      payment_methods: ensureArray(therapist.payment_methods),

      regular_discounts: therapist.regular_discounts ?? "",
      day_of_week_discount: therapist.day_of_week_discount ?? "",
      weekly_specials: therapist.weekly_specials ?? "",
      special_discount_groups: ensureArray(therapist.special_discount_groups),

      availability: therapist.availability ?? {},

      degrees: therapist.degrees ?? "",
      affiliations: ensureArray(therapist.affiliations),
      massage_start_date: therapist.massage_start_date ?? "",
      languages: ensureArray(therapist.languages),
      business_trips: therapist.business_trips ?? "",

      rating: therapist.rating ?? 5,
      override_reviews_count: therapist.override_reviews_count ?? 0,

      website: therapist.website ?? "",
      instagram: therapist.instagram ?? "",
      whatsapp: therapist.whatsapp ?? "",

      birthdate: therapist.birthdate ?? "",
      years_experience: therapist.years_experience ?? "",
      gallery: Array.isArray(therapist.gallery) ? therapist.gallery : [],
      travel_radius: therapist.travel_radius ?? "",
      accepts_first_timers: therapist.accepts_first_timers ?? true,
      prefers_lgbtq_clients: therapist.prefers_lgbtq_clients ?? true,
    };

    setForm(initial);
  }, [therapist]);

  /* ============================================
     CARREGAR EDIÇÕES PENDENTES
  ============================================ */
  useEffect(() => {
    if (!therapist?.id) return;

    const loadPendingEdits = async () => {
      try {
        const { data, error } = await supabase
          .from("profile_edits")
          .select("*")
          .eq("therapist_id", therapist.id)
          .eq("status", "pending")
          .order("submitted_at", { ascending: false });

        if (error) throw error;
        setPendingEdits(data || []);
      } catch (error) {
        console.error("Error loading pending edits:", error);
      }
    };

    loadPendingEdits();
  }, [therapist?.id]);

  /* ============================================
     MUDANÇAS NO FORMULÁRIO
  ============================================ */
  const hasUnsavedChanges = useMemo(() => {
    if (!therapist) return false;
    try {
      return (
        JSON.stringify(form) !==
        JSON.stringify({
          full_name: therapist.full_name ?? "",
          headline: therapist.headline ?? "",
          about: therapist.about ?? "",
          philosophy: therapist.philosophy ?? "",
          city: therapist.city ?? "",
          state: therapist.state ?? "",
          country: therapist.country ?? "",
          neighborhood: therapist.neighborhood ?? "",
          address: therapist.address ?? "",
          zip_code: therapist.zip_code ?? "",
          nearest_intersection: therapist.nearest_intersection ?? "",
          mobile_service_radius: therapist.mobile_service_radius ?? 0,
          services_headline: therapist.services_headline ?? "",
          specialties_headline: therapist.specialties_headline ?? "",
          promotions_headline: therapist.promotions_headline ?? "",
          massage_techniques: ensureArray(therapist.massage_techniques),
          studio_amenities: ensureArray(therapist.studio_amenities),
          mobile_extras: ensureArray(therapist.mobile_extras),
          additional_services: ensureArray(therapist.additional_services),
          products_used: therapist.products_used ?? "",
          rate_60: therapist.rate_60 ?? "",
          rate_90: therapist.rate_90 ?? "",
          rate_outcall: therapist.rate_outcall ?? "",
          payment_methods: ensureArray(therapist.payment_methods),
          regular_discounts: therapist.regular_discounts ?? "",
          day_of_week_discount: therapist.day_of_week_discount ?? "",
          weekly_specials: therapist.weekly_specials ?? "",
          special_discount_groups: ensureArray(
            therapist.special_discount_groups
          ),
          availability: therapist.availability ?? {},
          degrees: therapist.degrees ?? "",
          affiliations: ensureArray(therapist.affiliations),
          massage_start_date: therapist.massage_start_date ?? "",
          languages: ensureArray(therapist.languages),
          business_trips: therapist.business_trips ?? "",
          rating: therapist.rating ?? 5,
          override_reviews_count: therapist.override_reviews_count ?? 0,
          website: therapist.website ?? "",
          instagram: therapist.instagram ?? "",
          whatsapp: therapist.whatsapp ?? "",
          birthdate: therapist.birthdate ?? "",
          years_experience: therapist.years_experience ?? "",
          gallery: Array.isArray(therapist.gallery) ? therapist.gallery : [],
          travel_radius: therapist.travel_radius ?? "",
          accepts_first_timers: therapist.accepts_first_timers ?? true,
          prefers_lgbtq_clients: therapist.prefers_lgbtq_clients ?? true,
        })
      );
    } catch {
      return true;
    }
  }, [form, therapist]);

  const handleInputChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === "error") setStatus("idle");
  };

  const handleSimpleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    handleInputChange(name, value);
  };

  const handleCheckboxGroup = (field: string, option: string) => {
    setForm((prev) => {
      const current = ensureArray(prev[field]);
      if (current.includes(option)) {
        return { ...prev, [field]: current.filter((o) => o !== option) };
      }
      return { ...prev, [field]: [...current, option] };
    });
  };

  const handleAvailabilityChange = (
    day: string,
    type: "incall" | "outcall",
    field: "start" | "end",
    value: string
  ) => {
    setForm((prev) => {
      const availability = prev.availability || {};
      const daySchedule = availability[day] || {
        incall: { start: "", end: "" },
        outcall: { start: "", end: "" },
      };

      return {
        ...prev,
        availability: {
          ...availability,
          [day]: {
            ...daySchedule,
            [type]: {
              ...daySchedule[type],
              [field]: value,
            },
          },
        },
      };
    });
  };

  /* ============================================
     GALERIA DE FOTOS
  ============================================ */
  const handleGalleryButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleGalleryFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!therapist) return;

    setUploadingGallery(true);

    try {
      const bucketName = "pending-photos";
      const newUrls: string[] = [];
      const filesArray = Array.from(files);

      for (const file of filesArray) {
        const ext = file.name.split(".").pop() || "jpg";
        const uniqueSuffix = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;
        const filePath = `pending/${therapist.id}/${uniqueSuffix}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          addNotification("error", `Failed to upload ${file.name}`);
          continue;
        }

        const { data: publicData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (publicData?.publicUrl) {
          newUrls.push(publicData.publicUrl);
        }
      }

      if (newUrls.length > 0) {
        setForm((prev) => {
          const gallery = Array.isArray(prev.gallery) ? prev.gallery : [];
          return { ...prev, gallery: [...gallery, ...newUrls] };
        });
        addNotification("success", `${newUrls.length} photo(s) added successfully`);
      }

      e.target.value = "";
    } catch (err) {
      console.error("Gallery upload error:", err);
      addNotification("error", "Failed to upload photos. Please try again.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleGalleryRemove = (index: number) => {
    setForm((prev) => {
      const gallery = Array.isArray(prev.gallery) ? [...prev.gallery] : [];
      gallery.splice(index, 1);
      return { ...prev, gallery };
    });
    addNotification("info", "Photo removed");
  };

  /* ============================================
     SALVAR EDIÇÕES
  ============================================ */
  const handleSave = async () => {
    if (!therapist) return;

    setStatus("saving");

    try {
      const editedData = {
        full_name: form.full_name,
        headline: form.headline,
        about: form.about,
        philosophy: form.philosophy,
        city: form.city,
        state: form.state,
        country: form.country,
        neighborhood: form.neighborhood,
        address: form.address,
        zip_code: form.zip_code,
        nearest_intersection: form.nearest_intersection,
        mobile_service_radius: form.mobile_service_radius,
        services_headline: form.services_headline,
        specialties_headline: form.specialties_headline,
        promotions_headline: form.promotions_headline,
        massage_techniques: ensureArray(form.massage_techniques),
        studio_amenities: ensureArray(form.studio_amenities),
        mobile_extras: ensureArray(form.mobile_extras),
        additional_services: ensureArray(form.additional_services),
        products_used: form.products_used,
        rate_60: form.rate_60,
        rate_90: form.rate_90,
        rate_outcall: form.rate_outcall,
        payment_methods: ensureArray(form.payment_methods),
        regular_discounts: form.regular_discounts,
        day_of_week_discount: form.day_of_week_discount,
        weekly_specials: form.weekly_specials,
        special_discount_groups: ensureArray(form.special_discount_groups),
        availability: form.availability,
        degrees: form.degrees,
        affiliations: ensureArray(form.affiliations),
        massage_start_date: form.massage_start_date,
        languages: ensureArray(form.languages),
        business_trips: form.business_trips,
        rating: form.rating,
        override_reviews_count: form.override_reviews_count,
        website: form.website,
        instagram: form.instagram,
        whatsapp: form.whatsapp,
        birthdate: form.birthdate,
        years_experience: form.years_experience,
        travel_radius: form.travel_radius,
        accepts_first_timers: form.accepts_first_timers,
        prefers_lgbtq_clients: form.prefers_lgbtq_clients,
      };

      const originalData = {
        full_name: therapist.full_name,
        headline: therapist.headline,
        about: therapist.about,
        philosophy: therapist.philosophy,
        city: therapist.city,
        state: therapist.state,
        country: therapist.country,
        neighborhood: therapist.neighborhood,
        address: therapist.address,
        zip_code: therapist.zip_code,
        nearest_intersection: therapist.nearest_intersection,
        mobile_service_radius: therapist.mobile_service_radius,
        services_headline: therapist.services_headline,
        specialties_headline: therapist.specialties_headline,
        promotions_headline: therapist.promotions_headline,
        massage_techniques: ensureArray(therapist.massage_techniques),
        studio_amenities: ensureArray(therapist.studio_amenities),
        mobile_extras: ensureArray(therapist.mobile_extras),
        additional_services: ensureArray(therapist.additional_services),
        products_used: therapist.products_used,
        rate_60: therapist.rate_60,
        rate_90: therapist.rate_90,
        rate_outcall: therapist.rate_outcall,
        payment_methods: ensureArray(therapist.payment_methods),
        regular_discounts: therapist.regular_discounts,
        day_of_week_discount: therapist.day_of_week_discount,
        weekly_specials: therapist.weekly_specials,
        special_discount_groups: ensureArray(
          therapist.special_discount_groups
        ),
        availability: therapist.availability,
        degrees: therapist.degrees,
        affiliations: ensureArray(therapist.affiliations),
        massage_start_date: therapist.massage_start_date,
        languages: ensureArray(therapist.languages),
        business_trips: therapist.business_trips,
        rating: therapist.rating,
        override_reviews_count: therapist.override_reviews_count,
        website: therapist.website,
        instagram: therapist.instagram,
        whatsapp: therapist.whatsapp,
        birthdate: therapist.birthdate,
        years_experience: therapist.years_experience,
        travel_radius: therapist.travel_radius,
        accepts_first_timers: therapist.accepts_first_timers,
        prefers_lgbtq_clients: therapist.prefers_lgbtq_clients,
      };

      const pendingPhotos: { gallery?: string[] } = {};
      if (Array.isArray(form.gallery) && form.gallery.length > 0) {
        pendingPhotos.gallery = form.gallery.filter(Boolean);
      }

      const payload = {
        therapist_id: therapist.id,
        edited_data: editedData,
        original_data: originalData,
        pending_gallery: pendingPhotos.gallery || null,
        original_gallery: therapist.gallery || null,
        status: "pending",
        submitted_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profile_edits")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      await supabase.from("edit_notifications").insert({
        therapist_id: therapist.id,
        edit_id: data.id,
        type: "pending",
        message: "Your profile changes have been submitted for review.",
      });

      setStatus("success");
      addNotification(
        "success",
        "✓ Changes submitted successfully! You will be notified when reviewed.",
        false
      );

      setPendingEdits((prev) => [data, ...prev]);

      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      console.error("Save error:", err);
      setStatus("error");
      addNotification(
        "error",
        err?.message || "Failed to save changes. Please try again."
      );
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  /* ============================================
     NAVEGAÇÃO
  ============================================ */
  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmed) return;
    }
    router.back();
  };

  /* ============================================
     LOADING & ERRO
  ============================================ */
  if (profileLoading && !therapist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader className="animate-spin" size={24} />
          <p className="text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
          <p className="text-white text-lg mb-4">
            No therapist profile found
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  /* ============================================
     RENDER
  ============================================ */
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Notificações */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors w-fit"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <div className="flex items-center justify-between gap-4">
              <StatusBadge status={status} />

              <button
                onClick={handleSave}
                disabled={
                  status === "saving" || uploadingGallery || !hasUnsavedChanges
                }
                className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/30 disabled:shadow-none"
              >
                <Save size={20} />
                {status === "saving" ? "Submitting..." : "Submit for Approval"}
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Edit Your Profile
          </h1>
          <p className="text-gray-400">
            Make changes to your therapist profile. All changes will be
            reviewed before going live.
          </p>
        </header>

        {/* Indicador de edições pendentes */}
        {pendingEdits.length > 0 && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3">
            <Clock size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-300 font-semibold">
                You have {pendingEdits.length} pending edit
                {pendingEdits.length > 1 ? "s" : ""} awaiting approval
              </p>
              <p className="text-blue-400/70 text-sm mt-1">
                New changes will be added to the review queue
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* BASIC INFO */}
          <Section
            icon={User}
            title="Basic Information"
            description="Your professional identity and main profile details"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name" required>
                <Input
                  name="full_name"
                  value={form.full_name || ""}
                  onChange={handleSimpleChange}
                  placeholder="Your full name"
                />
              </FormField>

              <FormField label="Professional Title" required>
                <Input
                  name="headline"
                  value={form.headline || ""}
                  onChange={handleSimpleChange}
                  placeholder="e.g., Professional Massage Therapist"
                />
              </FormField>

              <FormField label="About You" fullWidth>
                <Textarea
                  name="about"
                  value={form.about || ""}
                  onChange={handleSimpleChange}
                  rows={4}
                  placeholder="Tell clients about your massage practice and approach..."
                />
              </FormField>

              <FormField label="Philosophy & Approach" fullWidth>
                <Textarea
                  name="philosophy"
                  value={form.philosophy || ""}
                  onChange={handleSimpleChange}
                  rows={3}
                  placeholder="Share your massage philosophy and what makes your approach unique..."
                />
              </FormField>
            </div>
          </Section>

          {/* LOCATION */}
          <Section
            icon={MapPin}
            title="Location & Service Area"
            description="Where you practice and your service coverage"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="City" required>
                <Input
                  name="city"
                  value={form.city || ""}
                  onChange={handleSimpleChange}
                  placeholder="Dallas"
                />
              </FormField>

              <FormField label="State/Province" required>
                <Input
                  name="state"
                  value={form.state || ""}
                  onChange={handleSimpleChange}
                  placeholder="TX"
                />
              </FormField>

              <FormField label="Country">
                <Input
                  name="country"
                  value={form.country || ""}
                  onChange={handleSimpleChange}
                  placeholder="United States"
                />
              </FormField>

              <FormField label="Neighborhood">
                <Input
                  name="neighborhood"
                  value={form.neighborhood || ""}
                  onChange={handleSimpleChange}
                  placeholder="Downtown"
                />
              </FormField>

              <FormField label="ZIP/Postal Code">
                <Input
                  name="zip_code"
                  value={form.zip_code || ""}
                  onChange={handleSimpleChange}
                  placeholder="75201"
                />
              </FormField>

              <FormField label="Nearest Intersection">
                <Input
                  name="nearest_intersection"
                  value={form.nearest_intersection || ""}
                  onChange={handleSimpleChange}
                  placeholder="Main St & Elm Ave"
                />
              </FormField>

              <FormField label="Address" fullWidth>
                <Input
                  name="address"
                  value={form.address || ""}
                  onChange={handleSimpleChange}
                  placeholder="Your studio address (optional)"
                />
              </FormField>

              <FormField label="Mobile Service Radius (miles)">
                <Input
                  type="number"
                  name="mobile_service_radius"
                  value={form.mobile_service_radius || 0}
                  onChange={handleSimpleChange}
                  placeholder="15"
                />
              </FormField>
            </div>
          </Section>

          {/* SERVICE OFFERINGS */}
          <Section
            icon={Wrench}
            title="Service Offerings"
            description="Describe your services and specialties"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Services Headline">
                <Input
                  name="services_headline"
                  value={form.services_headline || ""}
                  onChange={handleSimpleChange}
                  placeholder="In-studio & Mobile Services"
                />
              </FormField>

              <FormField label="Specialties Headline">
                <Input
                  name="specialties_headline"
                  value={form.specialties_headline || ""}
                  onChange={handleSimpleChange}
                  placeholder="Deep Tissue, Sports Massage"
                />
              </FormField>

              <FormField label="Promotions Headline" fullWidth>
                <Input
                  name="promotions_headline"
                  value={form.promotions_headline || ""}
                  onChange={handleSimpleChange}
                  placeholder="25% Off First Session"
                />
              </FormField>
            </div>
          </Section>

          {/* MASSAGE TECHNIQUES */}
          <Section
            icon={Award}
            title="Massage Techniques"
            description="Select the massage modalities you offer"
          >
            <ChipGroup
              options={MASSAGE_TECHNIQUES}
              selected={ensureArray(form.massage_techniques)}
              onToggle={(option) =>
                handleCheckboxGroup("massage_techniques", option)
              }
            />
          </Section>

          {/* STUDIO AMENITIES */}
          <Section
            icon={Building2}
            title="Studio Amenities"
            description="What amenities do you provide at your studio/incall location?"
          >
            <ChipGroup
              options={STUDIO_AMENITIES}
              selected={ensureArray(form.studio_amenities)}
              onToggle={(option) =>
                handleCheckboxGroup("studio_amenities", option)
              }
            />
          </Section>

          {/* MOBILE EXTRAS */}
          <Section
            icon={Umbrella}
            title="Mobile Service Extras"
            description="What do you bring for mobile/outcall sessions?"
          >
            <ChipGroup
              options={MOBILE_EXTRAS}
              selected={ensureArray(form.mobile_extras)}
              onToggle={(option) =>
                handleCheckboxGroup("mobile_extras", option)
              }
            />
          </Section>

          {/* ADDITIONAL SERVICES */}
          <Section
            icon={PackageOpen}
            title="Additional Services"
            description="Other wellness services you provide"
          >
            <ChipGroup
              options={ADDITIONAL_SERVICES}
              selected={ensureArray(form.additional_services)}
              onToggle={(option) =>
                handleCheckboxGroup("additional_services", option)
              }
            />
          </Section>

          {/* PRODUCTS */}
          <Section
            icon={Info}
            title="Products Used"
            description="Oils, lotions, and products you use in your sessions"
          >
            <FormField label="Products, Oils & Lotions" fullWidth>
              <Textarea
                name="products_used"
                value={form.products_used || ""}
                onChange={handleSimpleChange}
                rows={3}
                placeholder="Organic coconut oil, lavender essential oil, premium massage lotion..."
              />
            </FormField>
          </Section>

          {/* PRICING */}
          <Section
            icon={BadgeDollarSign}
            title="Rates & Pricing"
            description="Your session rates"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="60-min Session">
                <Input
                  name="rate_60"
                  value={form.rate_60 || ""}
                  onChange={handleSimpleChange}
                  placeholder="$90"
                />
              </FormField>

              <FormField label="90-min Session">
                <Input
                  name="rate_90"
                  value={form.rate_90 || ""}
                  onChange={handleSimpleChange}
                  placeholder="$120"
                />
              </FormField>

              <FormField label="Outcall Rate">
                <Input
                  name="rate_outcall"
                  value={form.rate_outcall || ""}
                  onChange={handleSimpleChange}
                  placeholder="$150"
                />
              </FormField>
            </div>
          </Section>

          {/* PAYMENT METHODS */}
          <Section
            icon={CreditCard}
            title="Payment Methods"
            description="How clients can pay you"
          >
            <ChipGroup
              options={PAYMENT_METHODS}
              selected={ensureArray(form.payment_methods)}
              onToggle={(option) =>
                handleCheckboxGroup("payment_methods", option)
              }
            />
          </Section>

          {/* DISCOUNTS */}
          <Section
            icon={Percent}
            title="Discounts & Specials"
            description="Promotions and special offers"
          >
            <div className="space-y-4">
              <FormField label="Regular Discounts" fullWidth>
                <Textarea
                  name="regular_discounts"
                  value={form.regular_discounts || ""}
                  onChange={handleSimpleChange}
                  rows={2}
                  placeholder="Senior and student discounts available..."
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Day of Week Special">
                  <Input
                    name="day_of_week_discount"
                    value={form.day_of_week_discount || ""}
                    onChange={handleSimpleChange}
                    placeholder="10% off Mondays"
                  />
                </FormField>

                <FormField label="Weekly Specials">
                  <Input
                    name="weekly_specials"
                    value={form.weekly_specials || ""}
                    onChange={handleSimpleChange}
                    placeholder="Check for this week's deals"
                  />
                </FormField>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Special Discount Groups
                </h3>
                <ChipGroup
                  options={SPECIAL_DISCOUNT_GROUPS}
                  selected={ensureArray(form.special_discount_groups)}
                  onToggle={(option) =>
                    handleCheckboxGroup("special_discount_groups", option)
                  }
                />
              </div>
            </div>
          </Section>

          {/* AVAILABILITY */}
          <Section
            icon={Clock}
            title="Availability Schedule"
            description="Set your weekly availability for in-studio and mobile services"
          >
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => {
                const dayData = form.availability?.[day] || {
                  incall: { start: "", end: "" },
                  outcall: { start: "", end: "" },
                };

                return (
                  <div
                    key={day}
                    className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                  >
                    <h4 className="text-white font-semibold mb-3">{day}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <FormField label="In-Studio Start">
                        <Input
                          type="time"
                          value={dayData.incall?.start || ""}
                          onChange={(e: any) =>
                            handleAvailabilityChange(
                              day,
                              "incall",
                              "start",
                              e.target.value
                            )
                          }
                        />
                      </FormField>

                      <FormField label="In-Studio End">
                        <Input
                          type="time"
                          value={dayData.incall?.end || ""}
                          onChange={(e: any) =>
                            handleAvailabilityChange(
                              day,
                              "incall",
                              "end",
                              e.target.value
                            )
                          }
                        />
                      </FormField>

                      <FormField label="Mobile Start">
                        <Input
                          type="time"
                          value={dayData.outcall?.start || ""}
                          onChange={(e: any) =>
                            handleAvailabilityChange(
                              day,
                              "outcall",
                              "start",
                              e.target.value
                            )
                          }
                        />
                      </FormField>

                      <FormField label="Mobile End">
                        <Input
                          type="time"
                          value={dayData.outcall?.end || ""}
                          onChange={(e: any) =>
                            handleAvailabilityChange(
                              day,
                              "outcall",
                              "end",
                              e.target.value
                            )
                          }
                        />
                      </FormField>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* CREDENTIALS */}
          <Section
            icon={Award}
            title="Professional Credentials"
            description="Your certifications, education, and experience"
          >
            <div className="space-y-4">
              <FormField label="Degrees & Certifications" fullWidth>
                <Textarea
                  name="degrees"
                  value={form.degrees || ""}
                  onChange={handleSimpleChange}
                  rows={3}
                  placeholder="Licensed Massage Therapist (LMT), Certified Sports Massage Therapist..."
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Massage Start Date">
                  <Input
                    type="date"
                    name="massage_start_date"
                    value={form.massage_start_date || ""}
                    onChange={handleSimpleChange}
                  />
                </FormField>

                <FormField label="Years of Experience">
                  <Input
                    type="number"
                    name="years_experience"
                    value={form.years_experience || ""}
                    onChange={handleSimpleChange}
                    placeholder="5"
                  />
                </FormField>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Professional Affiliations
                </h3>
                <ChipGroup
                  options={AFFILIATIONS}
                  selected={ensureArray(form.affiliations)}
                  onToggle={(option) =>
                    handleCheckboxGroup("affiliations", option)
                  }
                />
              </div>
            </div>
          </Section>

          {/* LANGUAGES */}
          <Section
            icon={Languages}
            title="Languages Spoken"
            description="Languages you can communicate with clients in"
          >
            <ChipGroup
              options={LANGUAGES}
              selected={ensureArray(form.languages)}
              onToggle={(option) => handleCheckboxGroup("languages", option)}
            />
          </Section>

          {/* BUSINESS TRIPS */}
          <Section
            icon={Plane}
            title="Business Travel"
            description="Locations and dates when you're traveling for work"
          >
            <FormField label="Travel Schedule" fullWidth>
              <Textarea
                name="business_trips"
                value={form.business_trips || ""}
                onChange={handleSimpleChange}
                rows={3}
                placeholder="New York - Jan 15-20, Miami - Feb 10-15..."
              />
            </FormField>
          </Section>

          {/* GALLERY */}
          <Section
            icon={Images}
            title="Photo Gallery"
            description="Add photos of your studio, setup, or professional work environment"
          >
            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <Info
                  size={20}
                  className="text-yellow-400 flex-shrink-0 mt-0.5"
                />
                <p className="text-yellow-300 text-sm">
                  <strong>Note:</strong> New photos will be reviewed by our
                  admin team before appearing on your public profile.
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGalleryFileChange}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.isArray(form.gallery) &&
                form.gallery.map((url: string, idx: number) => (
                  <div
                    key={`${url}-${idx}`}
                    className="relative aspect-square rounded-lg overflow-hidden group"
                  >
                    <img
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleGalleryRemove(idx)}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                ))}

              <button
                type="button"
                onClick={handleGalleryButtonClick}
                disabled={uploadingGallery}
                className="aspect-square border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingGallery ? (
                  <>
                    <Loader
                      className="animate-spin text-purple-400"
                      size={32}
                    />
                    <span className="text-sm text-gray-400">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Plus className="text-gray-400" size={32} />
                    <span className="text-sm text-gray-400">Add Photo</span>
                    <span className="text-xs text-gray-500">
                      {form.gallery?.length || 0}/10
                    </span>
                  </>
                )}
              </button>
            </div>
          </Section>

          {/* SOCIAL & CONTACT */}
          <Section
            icon={LinkIcon}
            title="Social Media & Contact"
            description="Your online presence and contact information"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Website">
                <Input
                  name="website"
                  value={form.website || ""}
                  onChange={handleSimpleChange}
                  placeholder="https://yourwebsite.com"
                />
              </FormField>

              <FormField label="Instagram">
                <Input
                  name="instagram"
                  value={form.instagram || ""}
                  onChange={handleSimpleChange}
                  placeholder="@username"
                />
              </FormField>

              <FormField label="WhatsApp">
                <Input
                  name="whatsapp"
                  value={form.whatsapp || ""}
                  onChange={handleSimpleChange}
                  placeholder="+1 555 123 4567"
                />
              </FormField>
            </div>
          </Section>

          {/* REVIEWS SETTINGS */}
          <Section
            icon={Star}
            title="Client Reviews Settings"
            description="Manage your ratings display (admin use)"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Overall Rating (1-5)">
                <Input
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  step="0.1"
                  value={form.rating || 5}
                  onChange={handleSimpleChange}
                />
              </FormField>

              <FormField label="Reviews Count Override">
                <Input
                  type="number"
                  name="override_reviews_count"
                  min="0"
                  value={form.override_reviews_count || 0}
                  onChange={handleSimpleChange}
                />
              </FormField>
            </div>
          </Section>

          {/* CLIENT PREFERENCES */}
          <Section
            icon={Info}
            title="Client Preferences"
            description="Your client acceptance policies"
          >
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 cursor-pointer hover:border-purple-500/50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.accepts_first_timers ?? true}
                  onChange={(e) =>
                    handleInputChange(
                      "accepts_first_timers",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                />
                <div>
                  <span className="text-white font-medium">
                    Accept First-Time Clients
                  </span>
                  <p className="text-sm text-gray-400">
                    Welcome new clients who haven&apos;t had a massage before
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 cursor-pointer hover:border-purple-500/50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.prefers_lgbtq_clients ?? true}
                  onChange={(e) =>
                    handleInputChange(
                      "prefers_lgbtq_clients",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                />
                <div>
                  <span className="text-white font-medium">
                    LGBTQ+ Friendly
                  </span>
                  <p className="text-sm text-gray-400">
                    Welcoming and inclusive space for all clients
                  </p>
                </div>
              </label>
            </div>
          </Section>
        </div>

        {/* Footer Actions */}
        <footer className="mt-12 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gray-900/80 rounded-xl border border-gray-800">
            <div className="text-center sm:text-left">
              <p className="text-white font-semibold">
                {hasUnsavedChanges
                  ? "You have unsaved changes"
                  : "No changes to save"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {pendingEdits.length > 0
                  ? `${pendingEdits.length} edit(s) pending approval`
                  : "All changes are reviewed before going live"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>

                <button
                  onClick={handleSave}
                  disabled={
                    status === "saving" ||
                    uploadingGallery ||
                    !hasUnsavedChanges
                  }
                  className="flex items-center gap-2 px-8 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/30 disabled:shadow-none"
                >
                  {status === "saving" ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Submit for Approval
                    </>
                  )}
                </button>
            </div>
          </div>
        </footer>
      </div>

      {/* CSS personalizado para animação do toast */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
