"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "../styles/edit-profile.css";
import { supabase } from "@/src/lib/supabase";
import { useProfile } from "@/src/context/ProfileContext";
import type { Therapist } from "@/src/context/ProfileContext";

import {
  User,
  FileText,
  MapPin,
  Ruler,
  Wrench,
  BadgeDollarSign,
  MessageSquareText,
  Plus,
  Trash2,
  Images,
  Link as LinkIcon,
  CreditCard,
  Calendar,
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
  Bell,
  X,
} from "lucide-react";

/* Opções fixas */
const STUDIO_AMENITY_OPTIONS = [
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

const MOBILE_EXTRAS_OPTIONS = [
  "Aromatherapy Enhanced",
  "Candles",
  "Heated Massage Table",
  "Hot Towels",
  "Massage Table",
  "Music",
];

const ADDITIONAL_SERVICES_OPTIONS = [
  "Acupuncture",
  "Body scrubs",
  "Body trimming",
  "Colonic cleansing",
  "Cupping",
  "Facials",
  "Fitness training",
  "Hair styling",
  "Hydrotherapy",
  "Manicures",
  "Meditation coaching",
  "Mud treatments",
  "Nutrition consulting",
  "Pedicures",
  "Personal coaching",
  "Personal training",
  "Physical therapy",
  "Waxing",
  "Yoga instruction",
];

const MASSAGE_TECHNIQUES_OPTIONS = [
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

const PAYMENT_OPTIONS = [
  "Visa",
  "MasterCard",
  "Amex",
  "Discover",
  "Cash",
  "Venmo",
  "Zelle",
];

const LANG_OPTIONS = [
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
  "SAG/Equity members",
  "visiting clients",
  "AIDS ride participants",
  "birthdays",
  "emergency workers",
  "airline crews",
];

const AFFILIATIONS_OPTIONS = [
  "American College of Sports Medicine",
  "National Association of Massage Therapists",
  "American Organization for Bodywork Therapies of Asia",
  "Massage Association of Australia",
  "Esalen Massage and Bodywork Association",
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

type TherapistForm = {
  [key: string]: any;
};

type EditNotification = {
  id: string;
  therapist_id: string;
  edit_id?: string;
  type: 'pending' | 'approved' | 'rejected';
  message: string;
  read: boolean;
  created_at: string;
};

function ensureArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(",").map((s) => s.trim());
  return [];
}

// Hook para gerenciar edições pendentes
function useProfileEdits(therapistId?: string) {
  const [pendingEdits, setPendingEdits] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<EditNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!therapistId) return;
    
    loadPendingEdits();
    loadNotifications();
    
    // Subscribe to changes
    const editsSubscription = supabase
      .channel('profile-edits-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_edits',
          filter: `therapist_id=eq.${therapistId}`
        },
        () => {
          loadPendingEdits();
        }
      )
      .subscribe();

    const notificationsSubscription = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'edit_notifications',
          filter: `therapist_id=eq.${therapistId}`
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      editsSubscription.unsubscribe();
      notificationsSubscription.unsubscribe();
    };
  }, [therapistId]);

  async function loadPendingEdits() {
    if (!therapistId) return;
    
    try {
      const { data, error } = await supabase
        .from('profile_edits')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setPendingEdits(data || []);
    } catch (error) {
      console.error('Error loading pending edits:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadNotifications() {
    if (!therapistId) return;
    
    try {
      const { data, error } = await supabase
        .from('edit_notifications')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  async function submitEdit(
    editedData: any,
    originalData: any,
    pendingPhotos?: { profile?: string; gallery?: string[] }
  ) {
    if (!therapistId) throw new Error('Therapist ID is required');

    const payload = {
      therapist_id: therapistId,
      edited_data: editedData,
      original_data: originalData,
      pending_profile_photo: pendingPhotos?.profile || null,
      pending_gallery: pendingPhotos?.gallery || null,
      original_profile_photo: originalData.profile_photo || null,
      original_gallery: originalData.gallery || null,
      status: 'pending',
      submitted_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profile_edits')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;

    // Create notification
    await supabase.from('edit_notifications').insert({
      therapist_id: therapistId,
      edit_id: data.id,
      type: 'pending',
      message: 'Suas edições foram enviadas para aprovação.'
    });

    return data;
  }

  async function markNotificationAsRead(notificationId: string) {
    const { error } = await supabase
      .from('edit_notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
    loadNotifications();
  }

  return {
    pendingEdits,
    notifications,
    loading: loading,
    submitEdit,
    markNotificationAsRead,
    refresh: loadPendingEdits
  };
}

// Componente de notificações
function NotificationBanner({ 
  notifications, 
  onDismiss 
}: { 
  notifications: EditNotification[]; 
  onDismiss: (id: string) => void;
}) {
  const unreadNotifications = notifications.filter(n => !n.read);
  
  if (unreadNotifications.length === 0) return null;

  return (
    <div className="edit-notifications-banner">
      {unreadNotifications.map(notification => (
        <div 
          key={notification.id} 
          className={`edit-notification edit-notification--${notification.type}`}
        >
          <div className="edit-notification-icon">
            {notification.type === 'approved' && '✓'}
            {notification.type === 'rejected' && '✗'}
            {notification.type === 'pending' && <Bell size={20} />}
          </div>
          <div className="edit-notification-content">
            <strong>
              {notification.type === 'approved' && 'Aprovado!'}
              {notification.type === 'rejected' && 'Rejeitado'}
              {notification.type === 'pending' && 'Enviado'}
            </strong>
            <span>{notification.message}</span>
          </div>
          <button
            className="edit-notification-close"
            onClick={() => onDismiss(notification.id)}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function EditProfile() {
  const router = useRouter();
  const { therapist, loading, refreshProfile } = useProfile();

  const [saving, setSaving] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState<TherapistForm>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Hook de edições
  const { pendingEdits, notifications, submitEdit, markNotificationAsRead } = 
    useProfileEdits(therapist?.id);

  useEffect(() => {
    if (!therapist) return;

    const initial: TherapistForm = {
      full_name: therapist.full_name ?? "",
      headline: therapist.headline ?? "",
      about: therapist.about ?? "",
      philosophy: therapist.philosophy ?? "",
      
      // Location
      city: therapist.city ?? "",
      state: therapist.state ?? "",
      country: therapist.country ?? "",
      neighborhood: therapist.neighborhood ?? "",
      address: therapist.address ?? "",
      zip_code: therapist.zip_code ?? "",
      nearest_intersection: therapist.nearest_intersection ?? "",
      latitude: therapist.latitude ?? "",
      longitude: therapist.longitude ?? "",
      
      // Service Info
      mobile_service_radius: therapist.mobile_service_radius ?? 0,
      services_headline: therapist.services_headline ?? "",
      specialties_headline: therapist.specialties_headline ?? "",
      promotions_headline: therapist.promotions_headline ?? "",
      
      // Massage Setup
      massage_techniques: ensureArray(therapist.massage_techniques),
      studio_amenities: ensureArray(therapist.studio_amenities),
      mobile_extras: ensureArray(therapist.mobile_extras),
      additional_services: ensureArray(therapist.additional_services),
      products_used: therapist.products_used ?? "",
      
      // Pricing
      rate_60: therapist.rate_60 ?? "",
      rate_90: therapist.rate_90 ?? "",
      rate_outcall: therapist.rate_outcall ?? "",
      payment_methods: ensureArray(therapist.payment_methods),
      
      // Discounts
      regular_discounts: therapist.regular_discounts ?? "",
      day_of_week_discount: therapist.day_of_week_discount ?? "",
      weekly_specials: therapist.weekly_specials ?? "",
      special_discount_groups: ensureArray(therapist.special_discount_groups),
      
      // Availability
      availability: therapist.availability ?? {},
      
      // Credentials
      degrees: therapist.degrees ?? "",
      affiliations: ensureArray(therapist.affiliations),
      massage_start_date: therapist.massage_start_date ?? "",
      languages: ensureArray(therapist.languages),
      business_trips: therapist.business_trips ?? "",
      
      // Reviews
      rating: therapist.rating ?? 5,
      override_reviews_count: therapist.override_reviews_count ?? 0,
      
      // Social & Contact
      website: therapist.website ?? "",
      instagram: therapist.instagram ?? "",
      whatsapp: therapist.whatsapp ?? "",
      
      // Other
      birthdate: therapist.birthdate ?? "",
      years_experience: therapist.years_experience ?? "",
      gallery: Array.isArray(therapist.gallery) ? therapist.gallery : [],
      travel_radius: therapist.travel_radius ?? "",
      accepts_first_timers: therapist.accepts_first_timers ?? true,
      prefers_lgbtq_clients: therapist.prefers_lgbtq_clients ?? true,
    };

    setForm(initial);
  }, [therapist]);

  const hasUnsavedChanges = useMemo(() => {
    if (!therapist) return false;
    try {
      const current = JSON.stringify(form);
      const original = JSON.stringify({
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
        latitude: therapist.latitude ?? "",
        longitude: therapist.longitude ?? "",
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
      });
      return current !== original;
    } catch {
      return true;
    }
  }, [form, therapist]);

  const handleInputChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
        outcall: { start: "", end: "" } 
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

  const handleGalleryButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleGalleryFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!therapist) return;

    setErrorMsg("");
    setSuccessMsg("");
    setUploadingGallery(true);

    try {
      // Upload para bucket de fotos pendentes
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
          console.error("Erro ao enviar imagem da galeria:", uploadError);
          setErrorMsg(
            "Erro ao enviar uma das imagens da galeria. Tente novamente."
          );
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
        setSuccessMsg("Imagem(ns) adicionada(s) - serão enviadas para aprovação ao salvar!");
      }

      e.target.value = "";
    } catch (err) {
      console.error("Erro inesperado ao enviar imagens da galeria:", err);
      setErrorMsg("Erro inesperado ao enviar imagens da galeria.");
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
  };

  const handleSave = async () => {
    if (!therapist) return;
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Preparar dados editados
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
        latitude: form.latitude,
        longitude: form.longitude,
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

      // Dados originais
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
        latitude: therapist.latitude,
        longitude: therapist.longitude,
        mobile_service_radius: therapist.mobile_service_radius,
        services_headline: therapist.services_headline,
        specialties_headline: therapist.specialties_headline,
        promotions_headline: therapist.promotions_headline,
        massage_techniques: therapist.massage_techniques,
        studio_amenities: therapist.studio_amenities,
        mobile_extras: therapist.mobile_extras,
        additional_services: therapist.additional_services,
        products_used: therapist.products_used,
        rate_60: therapist.rate_60,
        rate_90: therapist.rate_90,
        rate_outcall: therapist.rate_outcall,
        payment_methods: therapist.payment_methods,
        regular_discounts: therapist.regular_discounts,
        day_of_week_discount: therapist.day_of_week_discount,
        weekly_specials: therapist.weekly_specials,
        special_discount_groups: therapist.special_discount_groups,
        availability: therapist.availability,
        degrees: therapist.degrees,
        affiliations: therapist.affiliations,
        massage_start_date: therapist.massage_start_date,
        languages: therapist.languages,
        business_trips: therapist.business_trips,
        rating: therapist.rating,
        override_reviews_count: therapist.override_reviews_count,
        website: therapist.website,
        instagram: therapist.instagram,
        whatsapp: therapist.whatsapp,
        birthdate: therapist.birthdate,
        years_experience: therapist.years_experience,
        gallery: therapist.gallery,
        travel_radius: therapist.travel_radius,
        accepts_first_timers: therapist.accepts_first_timers,
        prefers_lgbtq_clients: therapist.prefers_lgbtq_clients,
      };

      // Preparar fotos (se houver mudanças)
      const pendingPhotos: { gallery?: string[] } = {};
      
      if (Array.isArray(form.gallery) && form.gallery.length > 0) {
        pendingPhotos.gallery = form.gallery.filter(Boolean);
      }

      // Enviar para aprovação
      await submitEdit(editedData, originalData, pendingPhotos);

      setSuccessMsg(
        "✓ Edições enviadas para aprovação! Você será notificado quando forem revisadas pelo admin."
      );
      
      // Limpar mensagens após alguns segundos
      setTimeout(() => {
        setSuccessMsg("");
      }, 5000);
      
    } catch (err) {
      console.error("Erro ao enviar edições:", err);
      setErrorMsg("Erro ao enviar edições para aprovação. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const ok = window.confirm(
        "Você tem alterações não salvas. Deseja sair mesmo assim?"
      );
      if (!ok) return;
    }
    router.back();
  };

  if (loading && !therapist) {
    return (
      <div className="edit-page-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="edit-page-loading">
        <p>No therapist profile found.</p>
      </div>
    );
  }

  const hasPendingEdits = pendingEdits.some(edit => edit.status === 'pending');

  return (
    <main className="edit-page">
      {/* Banner de Notificações */}
      <NotificationBanner 
        notifications={notifications} 
        onDismiss={markNotificationAsRead}
      />

      <div className="edit-container">
        <header className="edit-header">
          <button className="edit-back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h1>Edit Therapist Profile</h1>
          <button
            className="edit-save-btn"
            disabled={saving || uploadingGallery || !hasUnsavedChanges}
            onClick={handleSave}
          >
            {saving ? "Sending..." : "Submit for Approval"}
          </button>
        </header>

        {errorMsg && (
          <div className="edit-alert edit-alert--error">{errorMsg}</div>
        )}
        {successMsg && (
          <div className="edit-alert edit-alert--success">{successMsg}</div>
        )}

        {hasPendingEdits && (
          <div className="edit-pending-indicator">
            <Clock size={16} />
            <span>
              Você tem edições pendentes de aprovação. Novas alterações serão adicionadas à fila.
            </span>
          </div>
        )}

        {/* BASIC INFO */}
        <section className="edit-section">
          <h2>
            <User size={18} /> Basic Info
          </h2>
          <div className="edit-grid">
            <label className="edit-field">
              <span>Full name</span>
              <input
                name="full_name"
                value={form.full_name || ""}
                onChange={handleSimpleChange}
              />
            </label>

            <label className="edit-field">
              <span>Headline</span>
              <input
                name="headline"
                value={form.headline || ""}
                onChange={handleSimpleChange}
                placeholder="Professional Massage Therapist..."
              />
            </label>

            <label className="edit-field edit-field--full">
              <span>About (Massage Summary)</span>
              <textarea
                name="about"
                value={form.about || ""}
                onChange={handleSimpleChange}
                rows={4}
              />
            </label>

            <label className="edit-field edit-field--full">
              <span>Philosophy & Approach</span>
              <textarea
                name="philosophy"
                value={form.philosophy || ""}
                onChange={handleSimpleChange}
                rows={3}
              />
            </label>
          </div>
        </section>

        {/* LOCATION */}
        <section className="edit-section">
          <h2>
            <MapPin size={18} /> Location
          </h2>
          <div className="edit-grid">
            <label className="edit-field">
              <span>City</span>
              <input
                name="city"
                value={form.city || ""}
                onChange={handleSimpleChange}
              />
            </label>
            <label className="edit-field">
              <span>State</span>
              <input
                name="state"
                value={form.state || ""}
                onChange={handleSimpleChange}
              />
            </label>
            <label className="edit-field">
              <span>Country</span>
              <input
                name="country"
                value={form.country || ""}
                onChange={handleSimpleChange}
              />
            </label>
            <label className="edit-field">
              <span>Neighborhood</span>
              <input
                name="neighborhood"
                value={form.neighborhood || ""}
                onChange={handleSimpleChange}
              />
            </label>
            <label className="edit-field">
              <span>ZIP / CEP Code</span>
              <input
                name="zip_code"
                value={form.zip_code || ""}
                onChange={handleSimpleChange}
                placeholder="Ex.: 01001-000"
              />
            </label>
            <label className="edit-field">
              <span>Nearest Intersection</span>
              <input
                name="nearest_intersection"
                value={form.nearest_intersection || ""}
                onChange={handleSimpleChange}
              />
            </label>
            <label className="edit-field edit-field--full">
              <span>Address</span>
              <input
                name="address"
                value={form.address || ""}
                onChange={handleSimpleChange}
              />
            </label>
            <label className="edit-field">
              <span>Mobile Service Radius (miles)</span>
              <input
                type="number"
                name="mobile_service_radius"
                value={form.mobile_service_radius || 0}
                onChange={handleSimpleChange}
              />
            </label>
          </div>
        </section>

        {/* SERVICE OFFERINGS */}
        <section className="edit-section">
          <h2>
            <Wrench size={18} /> Service Offerings
          </h2>
          <div className="edit-grid">
            <label className="edit-field">
              <span>Services Headline</span>
              <input
                name="services_headline"
                value={form.services_headline || ""}
                onChange={handleSimpleChange}
              />
            </label>
            <label className="edit-field">
              <span>Specialties Headline</span>
              <input
                name="specialties_headline"
                value={form.specialties_headline || ""}
                onChange={handleSimpleChange}
              />
            </label>
            <label className="edit-field">
              <span>Promotions Headline</span>
              <input
                name="promotions_headline"
                value={form.promotions_headline || ""}
                onChange={handleSimpleChange}
              />
            </label>
          </div>
        </section>

        {/* MASSAGE TECHNIQUES */}
        <section className="edit-section">
          <h2>
            <Wrench size={18} /> Massage Techniques
          </h2>
          <div className="chip-grid">
            {MASSAGE_TECHNIQUES_OPTIONS.map((item) => {
              const active = ensureArray(form.massage_techniques).includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`chip ${active ? "chip--active" : ""}`}
                  onClick={() => handleCheckboxGroup("massage_techniques", item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        {/* STUDIO AMENITIES */}
        <section className="edit-section">
          <h2>
            <Building2 size={18} /> Studio Amenities (Incall)
          </h2>
          <div className="chip-grid">
            {STUDIO_AMENITY_OPTIONS.map((item) => {
              const active = ensureArray(form.studio_amenities).includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`chip ${active ? "chip--active" : ""}`}
                  onClick={() => handleCheckboxGroup("studio_amenities", item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        {/* MOBILE EXTRAS */}
        <section className="edit-section">
          <h2>
            <Umbrella size={18} /> Mobile Extras (Outcall)
          </h2>
          <div className="chip-grid">
            {MOBILE_EXTRAS_OPTIONS.map((item) => {
              const active = ensureArray(form.mobile_extras).includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`chip ${active ? "chip--active" : ""}`}
                  onClick={() => handleCheckboxGroup("mobile_extras", item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        {/* ADDITIONAL SERVICES */}
        <section className="edit-section">
          <h2>
            <PackageOpen size={18} /> Additional Services
          </h2>
          <div className="chip-grid">
            {ADDITIONAL_SERVICES_OPTIONS.map((item) => {
              const active = ensureArray(form.additional_services).includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`chip ${active ? "chip--active" : ""}`}
                  onClick={() => handleCheckboxGroup("additional_services", item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        {/* PRODUCTS USED */}
        <section className="edit-section">
          <h2>
            <Info size={18} /> Products Used
          </h2>
          <div className="edit-grid">
            <label className="edit-field edit-field--full">
              <span>Products / Oils / Lotions</span>
              <textarea
                name="products_used"
                value={form.products_used || ""}
                onChange={handleSimpleChange}
                rows={3}
                placeholder="Ex.: Organic coconut oil, lavender essential oil..."
              />
            </label>
          </div>
        </section>

        {/* PRICING */}
        <section className="edit-section">
          <h2>
            <BadgeDollarSign size={18} /> Rates
          </h2>
          <div className="edit-grid">
            <label className="edit-field">
              <span>60 min session</span>
              <input
                name="rate_60"
                value={form.rate_60 || ""}
                onChange={handleSimpleChange}
                placeholder="$90"
              />
            </label>
            <label className="edit-field">
              <span>90 min session</span>
              <input
                name="rate_90"
                value={form.rate_90 || ""}
                onChange={handleSimpleChange}
                placeholder="$120"
              />
            </label>
            <label className="edit-field">
              <span>Outcall</span>
              <input
                name="rate_outcall"
                value={form.rate_outcall || ""}
                onChange={handleSimpleChange}
                placeholder="$150"
              />
            </label>
          </div>
        </section>

        {/* PAYMENT METHODS */}
        <section className="edit-section">
          <h2>
            <CreditCard size={18} /> Payment Methods
          </h2>
          <div className="chip-grid">
            {PAYMENT_OPTIONS.map((item) => {
              const active = ensureArray(form.payment_methods).includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`chip ${active ? "chip--active" : ""}`}
                  onClick={() => handleCheckboxGroup("payment_methods", item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        {/* DISCOUNTS & SPECIALS */}
        <section className="edit-section">
          <h2>
            <Percent size={18} /> Discounts & Specials
          </h2>
          <div className="edit-grid">
            <label className="edit-field edit-field--full">
              <span>Regular Discounts</span>
              <textarea
                name="regular_discounts"
                value={form.regular_discounts || ""}
                onChange={handleSimpleChange}
                rows={2}
              />
            </label>
            <label className="edit-field">
              <span>Day of Week Discount</span>
              <input
                name="day_of_week_discount"
                value={form.day_of_week_discount || ""}
                onChange={handleSimpleChange}
                placeholder="Ex.: 10% off Mondays"
              />
            </label>
            <label className="edit-field">
              <span>Weekly Specials</span>
              <input
                name="weekly_specials"
                value={form.weekly_specials || ""}
                onChange={handleSimpleChange}
              />
            </label>
          </div>
          
          <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Special Discount Groups</h3>
          <div className="chip-grid">
            {SPECIAL_DISCOUNT_GROUPS.map((item) => {
              const active = ensureArray(form.special_discount_groups).includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`chip ${active ? "chip--active" : ""}`}
                  onClick={() => handleCheckboxGroup("special_discount_groups", item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        {/* AVAILABILITY */}
        <section className="edit-section">
          <h2>
            <Clock size={18} /> Availability
          </h2>
          {DAYS_OF_WEEK.map((day) => {
            const dayData = form.availability?.[day] || { incall: { start: "", end: "" }, outcall: { start: "", end: "" } };
            return (
              <div key={day} style={{ marginBottom: "1rem", padding: "1rem", border: "1px solid #e0e0e0", borderRadius: "8px" }}>
                <h4 style={{ marginBottom: "0.5rem" }}>{day}</h4>
                <div className="edit-grid">
                  <label className="edit-field">
                    <span>In-Studio Start</span>
                    <input
                      type="time"
                      value={dayData.incall?.start || ""}
                      onChange={(e) => handleAvailabilityChange(day, "incall", "start", e.target.value)}
                    />
                  </label>
                  <label className="edit-field">
                    <span>In-Studio End</span>
                    <input
                      type="time"
                      value={dayData.incall?.end || ""}
                      onChange={(e) => handleAvailabilityChange(day, "incall", "end", e.target.value)}
                    />
                  </label>
                  <label className="edit-field">
                    <span>Mobile Start</span>
                    <input
                      type="time"
                      value={dayData.outcall?.start || ""}
                      onChange={(e) => handleAvailabilityChange(day, "outcall", "start", e.target.value)}
                    />
                  </label>
                  <label className="edit-field">
                    <span>Mobile End</span>
                    <input
                      type="time"
                      value={dayData.outcall?.end || ""}
                      onChange={(e) => handleAvailabilityChange(day, "outcall", "end", e.target.value)}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </section>

        {/* PROFESSIONAL CREDENTIALS */}
        <section className="edit-section">
          <h2>
            <Award size={18} /> Professional Credentials
          </h2>
          <div className="edit-grid">
            <label className="edit-field edit-field--full">
              <span>Degrees & Certifications</span>
              <textarea
                name="degrees"
                value={form.degrees || ""}
                onChange={handleSimpleChange}
                rows={3}
                placeholder="Ex.: Licensed Massage Therapist, Certified Sports Massage..."
              />
            </label>
            
            <label className="edit-field">
              <span>Massage Start Date</span>
              <input
                type="date"
                name="massage_start_date"
                value={form.massage_start_date || ""}
                onChange={handleSimpleChange}
              />
            </label>
            
            <label className="edit-field">
              <span>Years of Experience</span>
              <input
                type="number"
                name="years_experience"
                value={form.years_experience || ""}
                onChange={handleSimpleChange}
              />
            </label>
          </div>

          <h3 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Professional Affiliations</h3>
          <div className="chip-grid">
            {AFFILIATIONS_OPTIONS.map((item) => {
              const active = ensureArray(form.affiliations).includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`chip ${active ? "chip--active" : ""}`}
                  onClick={() => handleCheckboxGroup("affiliations", item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        {/* LANGUAGES */}
        <section className="edit-section">
          <h2>
            <Languages size={18} /> Languages Spoken
          </h2>
          <div className="chip-grid">
            {LANG_OPTIONS.map((item) => {
              const active = ensureArray(form.languages).includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`chip ${active ? "chip--active" : ""}`}
                  onClick={() => handleCheckboxGroup("languages", item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        {/* BUSINESS TRIPS */}
        <section className="edit-section">
          <h2>
            <Plane size={18} /> Business Trips
          </h2>
          <div className="edit-grid">
            <label className="edit-field edit-field--full">
              <span>Locations & Dates for Business Travel</span>
              <textarea
                name="business_trips"
                value={form.business_trips || ""}
                onChange={handleSimpleChange}
                rows={3}
                placeholder="Ex.: New York - Jan 15-20, Miami - Feb 10-15..."
              />
            </label>
          </div>
        </section>

        {/* GALLERY */}
        <section className="edit-section">
          <h2>
            <Images size={18} /> Photo Gallery
          </h2>

          <p className="edit-note" style={{ marginBottom: "1rem", color: "#666", fontSize: "0.875rem" }}>
            ⚠️ Novas fotos serão enviadas para aprovação do admin antes de aparecerem no seu perfil público.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleGalleryFileChange}
          />

          <div className="gallery-grid">
            {Array.isArray(form.gallery) &&
              form.gallery.map((url: string, idx: number) => (
                <div className="gallery-item" key={`${url}-${idx}`}>
                  <img src={url} alt={`Gallery ${idx + 1}`} />
                  <button
                    type="button"
                    className="gallery-remove"
                    onClick={() => handleGalleryRemove(idx)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

            <button
              type="button"
              className="gallery-add"
              onClick={handleGalleryButtonClick}
              disabled={uploadingGallery}
            >
              <Plus size={18} />
              <span>{uploadingGallery ? "Uploading..." : "Add photo"}</span>
            </button>
          </div>
        </section>

        {/* SOCIAL & CONTACT */}
        <section className="edit-section">
          <h2>
            <LinkIcon size={18} /> Social & Contact
          </h2>
          <div className="edit-grid">
            <label className="edit-field">
              <span>Website</span>
              <input
                name="website"
                value={form.website || ""}
                onChange={handleSimpleChange}
                placeholder="https://yourwebsite.com"
              />
            </label>
            <label className="edit-field">
              <span>Instagram</span>
              <input
                name="instagram"
                value={form.instagram || ""}
                onChange={handleSimpleChange}
                placeholder="@username"
              />
            </label>
            <label className="edit-field">
              <span>WhatsApp</span>
              <input
                name="whatsapp"
                value={form.whatsapp || ""}
                onChange={handleSimpleChange}
                placeholder="+55 71 99999-9999"
              />
            </label>
          </div>
        </section>

        {/* CLIENT REVIEWS */}
        <section className="edit-section">
          <h2>
            <Star size={18} /> Client Reviews
          </h2>
          <div className="edit-grid">
            <label className="edit-field">
              <span>Overall Rating (1-5)</span>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                step="0.1"
                value={form.rating || 5}
                onChange={handleSimpleChange}
              />
            </label>
            <label className="edit-field">
              <span>Override Reviews Count (optional)</span>
              <input
                type="number"
                name="override_reviews_count"
                min="0"
                value={form.override_reviews_count || 0}
                onChange={handleSimpleChange}
              />
            </label>
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="edit-section">
          <h2>
            <Info size={18} /> Client Preferences
          </h2>
          <div className="edit-grid">
            <label className="edit-field" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={form.accepts_first_timers ?? true}
                onChange={(e) => handleInputChange("accepts_first_timers", e.target.checked)}
              />
              <span>Accepts First-time Clients</span>
            </label>
            <label className="edit-field" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={form.prefers_lgbtq_clients ?? true}
                onChange={(e) => handleInputChange("prefers_lgbtq_clients", e.target.checked)}
              />
              <span>LGBTQ+ Friendly</span>
            </label>
          </div>
        </section>

        <footer className="edit-footer">
          <button className="edit-back-btn" onClick={handleBack}>
            Cancel
          </button>
          <button
            className="edit-save-btn"
            disabled={saving || uploadingGallery || !hasUnsavedChanges}
            onClick={handleSave}
          >
            {saving ? "Sending..." : "Submit for Approval"}
          </button>
        </footer>
      </div>
    </main>
  );
}