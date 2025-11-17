"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { useProfile } from "@/src/context/ProfileContext";

// CSS global
import "@/src/styles/edit-profile.css";

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
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // ignore
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
    <div className={`ep-toast ep-toast-${notification.type}`}>
      <div className="ep-toast-inner">
        <Icon size={20} className="ep-toast-icon" />
        <p className="ep-toast-message">{notification.message}</p>
        <button onClick={onClose} className="ep-toast-close">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: EditStatus }) => {
  const config = {
    idle: { icon: null, text: "", spin: false },
    saving: {
      icon: Loader,
      text: "Saving changes...",
      spin: true,
    },
    success: {
      icon: CheckCircle,
      text: "Changes saved!",
      spin: false,
    },
    error: {
      icon: AlertCircle,
      text: "Failed to save",
      spin: false,
    },
  } as const;

  const { icon: Icon, text, spin } = config[status];
  if (!Icon) return null;

  return (
    <div className={`ep-status-badge ep-status-${status}`}>
      <Icon className={`ep-status-icon ${spin ? "ep-spin" : ""}`} size={18} />
      <span className="ep-status-text">{text}</span>
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
  <section className="ep-section">
    <div className="ep-section-box">
      <div className="ep-section-header">
        <div className="ep-section-icon-wrapper">
          <Icon size={22} className="ep-section-icon" />
        </div>
        <div>
          <h2 className="ep-section-title">{title}</h2>
          {description && <p className="ep-section-desc">{description}</p>}
        </div>
      </div>
      <div className="ep-section-body">{children}</div>
    </div>
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
  <label className={`ep-field ${fullWidth ? "ep-field-full" : ""}`}>
    <span className="ep-field-label">
      {label}
      {required && <span className="ep-field-required">*</span>}
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
}: {
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  name?: string;
  disabled?: boolean;
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className="ep-input"
  />
);

const Textarea = ({
  value,
  onChange,
  placeholder = "",
  rows = 3,
  name = "",
}: {
  value: any;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  name?: string;
}) => (
  <textarea
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className="ep-textarea"
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
  <div className="ep-chip-group">
    {options.map((option) => {
      const isSelected = selected.includes(option);
      return (
        <button
          key={option}
          type="button"
          onClick={() => onToggle(option)}
          className={`ep-chip ${isSelected ? "ep-chip-selected" : ""}`}
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
      // NOVO CAMPO: display_name
      display_name: therapist.display_name ?? "",
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
     CARREGAR EDIÇÕES PENDENTES (profile_edits)
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
      const base = {
        full_name: therapist.full_name ?? "",
        display_name: therapist.display_name ?? "",
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

      return JSON.stringify(form) !== JSON.stringify(base);
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
        addNotification(
          "success",
          `${newUrls.length} photo(s) added successfully`
        );
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
     SALVAR EDIÇÕES (profile_edits)
  ============================================ */
  const handleSave = async () => {
    if (!therapist) return;

    setStatus("saving");

    try {
      const editedData = {
        full_name: form.full_name,
        // NOVO: display_name vai para edited_data
        display_name: form.display_name,
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
        display_name: therapist.display_name,
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
        special_discount_groups: ensureArray(therapist.special_discount_groups),
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

      // notificação de edição pendente
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
      <div className="ep-fullscreen">
        <div className="ep-fullscreen-content">
          <Loader className="ep-spin" size={24} />
          <p className="ep-fullscreen-text">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="ep-fullscreen">
        <div className="ep-fullscreen-content ep-fullscreen-error">
          <AlertCircle className="ep-fullscreen-icon" size={48} />
          <p className="ep-fullscreen-text">No therapist profile found</p>
          <button onClick={() => router.push("/")} className="ep-btn-primary">
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
    <main className="ep-page">
      {/* background grid */}
      <div className="ep-grid" />

      {/* Notificações */}
      <div className="ep-toast-container">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      <div className="ep-container">
        {/* Header */}
        <header className="ep-header">
          <div className="ep-header-top">
            <button onClick={handleBack} className="ep-back-btn">
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <div className="ep-header-actions">
              <StatusBadge status={status} />
              <button
                onClick={handleSave}
                disabled={
                  status === "saving" || uploadingGallery || !hasUnsavedChanges
                }
                className="ep-save-btn"
              >
                <Save size={20} />
                {status === "saving" ? "Submitting..." : "Submit for Approval"}
              </button>
            </div>
          </div>

          <h1 className="ep-title">Edit Your Profile</h1>
          <p className="ep-subtitle">
            Make changes to your therapist profile. All changes will be reviewed
            before going live.
          </p>
        </header>

        {/* Indicador de edições pendentes */}
        {pendingEdits.length > 0 && (
          <div className="ep-pending-banner">
            <Clock size={20} className="ep-pending-icon" />
            <div>
              <p className="ep-pending-main">
                You have {pendingEdits.length} pending edit
                {pendingEdits.length > 1 ? "s" : ""} awaiting approval
              </p>
              <p className="ep-pending-sub">
                New changes will be added to the review queue
              </p>
            </div>
          </div>
        )}

        <div className="ep-sections">
          {/* BASIC INFO */}
          <Section
            icon={User}
            title="Basic Information"
            description="Your professional identity and main profile details"
          >
            <div className="ep-grid-two">
              <FormField label="Full Name" required>
                <Input
                  name="full_name"
                  value={form.full_name || ""}
                  onChange={handleSimpleChange}
                  placeholder="Your full legal name"
                />
              </FormField>

              {/* NOVO CAMPO: DISPLAY NAME */}
              <FormField
                label="Display Name"
                required
              >
                <Input
                  name="display_name"
                  value={form.display_name || ""}
                  onChange={handleSimpleChange}
                  placeholder="Name shown on your public profile"
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
            <div className="ep-grid-two">
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
            <div className="ep-grid-two">
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
            <div className="ep-grid-three">
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
            <div className="ep-section-column">
              <FormField label="Regular Discounts" fullWidth>
                <Textarea
                  name="regular_discounts"
                  value={form.regular_discounts || ""}
                  onChange={handleSimpleChange}
                  rows={2}
                  placeholder="Senior and student discounts available..."
                />
              </FormField>

              <div className="ep-grid-two">
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

              <div className="ep-subsection">
                <h3 className="ep-subsection-title">Special Discount Groups</h3>
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
            <div className="ep-availability">
              {DAYS_OF_WEEK.map((day) => {
                const dayData = form.availability?.[day] || {
                  incall: { start: "", end: "" },
                  outcall: { start: "", end: "" },
                };

                return (
                  <div key={day} className="ep-day-block">
                    <h4 className="ep-day-title">{day}</h4>
                    <div className="ep-day-grid">
                      <FormField label="In-Studio Start">
                        <Input
                          type="time"
                          name=""
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
                          name=""
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
                          name=""
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
                          name=""
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
            <div className="ep-section-column">
              <FormField label="Degrees & Certifications" fullWidth>
                <Textarea
                  name="degrees"
                  value={form.degrees || ""}
                  onChange={handleSimpleChange}
                  rows={3}
                  placeholder="Licensed Massage Therapist (LMT), Certified Sports Massage Therapist..."
                />
              </FormField>

              <div className="ep-grid-two">
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

              <div className="ep-subsection">
                <h3 className="ep-subsection-title">
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
            <div className="ep-warning-box">
              <div className="ep-warning-inner">
                <Info size={20} className="ep-warning-icon" />
                <p className="ep-warning-text">
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
              className="ep-hidden-input"
              onChange={handleGalleryFileChange}
            />

            <div className="ep-gallery-grid">
              {Array.isArray(form.gallery) &&
                form.gallery.map((url: string, idx: number) => (
                  <div key={`${url}-${idx}`} className="ep-gallery-item">
                    <img
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="ep-gallery-image"
                    />
                    <button
                      type="button"
                      onClick={() => handleGalleryRemove(idx)}
                      className="ep-gallery-remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

              <button
                type="button"
                onClick={handleGalleryButtonClick}
                disabled={uploadingGallery}
                className={`ep-gallery-add ${
                  uploadingGallery ? "ep-gallery-add-disabled" : ""
                }`}
              >
                {uploadingGallery ? (
                  <>
                    <Loader className="ep-spin" size={32} />
                    <span className="ep-gallery-add-text">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Plus size={32} className="ep-gallery-add-icon" />
                    <span className="ep-gallery-add-text">Add Photo</span>
                    <span className="ep-gallery-add-count">
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
            <div className="ep-grid-three">
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
            <div className="ep-grid-two">
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
            <div className="ep-preferences">
              <label className="ep-preference-item">
                <input
                  type="checkbox"
                  checked={form.accepts_first_timers ?? true}
                  onChange={(e) =>
                    handleInputChange("accepts_first_timers", e.target.checked)
                  }
                  className="ep-checkbox"
                />
                <div>
                  <span className="ep-preference-title">
                    Accept First-Time Clients
                  </span>
                  <p className="ep-preference-desc">
                    Welcome new clients who haven&apos;t had a massage before
                  </p>
                </div>
              </label>

              <label className="ep-preference-item">
                <input
                  type="checkbox"
                  checked={form.prefers_lgbtq_clients ?? true}
                  onChange={(e) =>
                    handleInputChange(
                      "prefers_lgbtq_clients",
                      e.target.checked
                    )
                  }
                  className="ep-checkbox"
                />
                <div>
                  <span className="ep-preference-title">LGBTQ+ Friendly</span>
                  <p className="ep-preference-desc">
                    Welcoming and inclusive space for all clients
                  </p>
                </div>
              </label>
            </div>
          </Section>
        </div>

        {/* Footer Actions */}
        <footer className="ep-footer">
          <div className="ep-footer-box">
            <div className="ep-footer-text">
              <p className="ep-footer-main">
                {hasUnsavedChanges
                  ? "You have unsaved changes"
                  : "No changes to save"}
              </p>
              <p className="ep-footer-sub">
                {pendingEdits.length > 0
                  ? `${pendingEdits.length} edit(s) pending approval`
                  : "All changes are reviewed before going live"}
              </p>
            </div>

            <div className="ep-footer-actions">
              <button onClick={handleBack} className="ep-btn-secondary">
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={
                  status === "saving" || uploadingGallery || !hasUnsavedChanges
                }
                className="ep-save-btn"
              >
                {status === "saving" ? (
                  <>
                    <Loader className="ep-spin" size={20} />
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
    </main>
  );
}
