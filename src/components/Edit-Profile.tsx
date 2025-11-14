"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/edit-profile.css";
import { supabase } from "@/src/lib/supabase";
import { useProfile } from "@/src/context/ProfileContext";
import type { Therapist } from "@/src/context/ProfileContext";

// Ícones Lucide
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
} from "lucide-react";

/* ==========================
   Opções fixas
   ========================== */

const STUDIO_AMENITY_OPTIONS = [
  "Aromatherapy Enhanced",
  "Bottled Water",
  "Candles",
  "Drinking Water",
  "Free Parking",
  "Fully Handicapped Accessible",
  "Heated Table",
  "Massage Chair",
  "Massage Table",
  "Music",
  "Parking Lot",
  "Private Bathroom",
  "Shower",
  "Steam Room",
  "Wheelchair Accessible",
];

const PAYMENT_OPTIONS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Zelle",
  "Venmo",
  "Cash App",
  "Apple Pay",
  "Google Pay",
  "PayPal",
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

// tipo bem flexível só pra não travar o build
type TherapistForm = {
  [key: string]: any;
};

/* Util: garante array */
function ensureArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(",").map((s) => s.trim());
  return [];
}

export default function EditProfile() {
  const router = useRouter();
  const { therapist, loading, refreshProfile } = useProfile();

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // form state
  const [form, setForm] = useState<TherapistForm>({});

  // carrega dados do contexto
  useEffect(() => {
    if (!therapist) return;

    const initial: TherapistForm = {
      full_name: therapist.full_name ?? "",
      headline: therapist.headline ?? "",
      about: therapist.about ?? "",
      city: therapist.city ?? "",
      state: therapist.state ?? "",
      country: therapist.country ?? "",
      neighborhood: therapist.neighborhood ?? "",
      address: therapist.address ?? "",
      latitude: therapist.latitude ?? "",
      longitude: therapist.longitude ?? "",
      rate_60: therapist.rate_60 ?? "",
      rate_90: therapist.rate_90 ?? "",
      rate_outcall: therapist.rate_outcall ?? "",
      studio_amenities: ensureArray(therapist.studio_amenities),
      payment_methods: ensureArray(therapist.payment_methods),
      languages: ensureArray(therapist.languages),
      website: therapist.website ?? "",
      instagram: therapist.instagram ?? "",
      whatsapp: therapist.whatsapp ?? "",
      birthdate: therapist.birthdate ?? "",
      years_experience: therapist.years_experience ?? "",
      rating: therapist.rating ?? 5,
      gallery: Array.isArray(therapist.gallery) ? therapist.gallery : [],
      travel_radius: therapist.travel_radius ?? "",
      accepts_first_timers: therapist.accepts_first_timers ?? true,
      prefers_lgbtq_clients: therapist.prefers_lgbtq_clients ?? true,
    };

    setForm(initial);
  }, [therapist]);

  const hasTherapist = !!therapist;

  const hasUnsavedChanges = useMemo(() => {
    if (!therapist) return false;
    try {
      const current = {
        ...form,
        studio_amenities: ensureArray(form.studio_amenities),
        payment_methods: ensureArray(form.payment_methods),
        languages: ensureArray(form.languages),
      };

      const original = {
        full_name: therapist.full_name ?? "",
        headline: therapist.headline ?? "",
        about: therapist.about ?? "",
        city: therapist.city ?? "",
        state: therapist.state ?? "",
        country: therapist.country ?? "",
        neighborhood: therapist.neighborhood ?? "",
        address: therapist.address ?? "",
        latitude: therapist.latitude ?? "",
        longitude: therapist.longitude ?? "",
        rate_60: therapist.rate_60 ?? "",
        rate_90: therapist.rate_90 ?? "",
        rate_outcall: therapist.rate_outcall ?? "",
        studio_amenities: ensureArray(therapist.studio_amenities),
        payment_methods: ensureArray(therapist.payment_methods),
        languages: ensureArray(therapist.languages),
        website: therapist.website ?? "",
        instagram: therapist.instagram ?? "",
        whatsapp: therapist.whatsapp ?? "",
        birthdate: therapist.birthdate ?? "",
        years_experience: therapist.years_experience ?? "",
        rating: therapist.rating ?? 5,
        gallery: Array.isArray(therapist.gallery) ? therapist.gallery : [],
        travel_radius: therapist.travel_radius ?? "",
        accepts_first_timers: therapist.accepts_first_timers ?? true,
        prefers_lgbtq_clients: therapist.prefers_lgbtq_clients ?? true,
      };

      return JSON.stringify(current) !== JSON.stringify(original);
    } catch {
      return true;
    }
  }, [form, therapist]);

  // handlers básicos

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

  const handleGalleryAdd = () => {
    const url = window.prompt("Paste image URL:");
    if (!url) return;
    setForm((prev) => {
      const gallery = Array.isArray(prev.gallery) ? prev.gallery : [];
      return { ...prev, gallery: [...gallery, url] };
    });
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
      const payload: Partial<Therapist> & TherapistForm = {
        full_name: form.full_name,
        headline: form.headline,
        about: form.about,
        city: form.city,
        state: form.state,
        country: form.country,
        neighborhood: form.neighborhood,
        address: form.address,
        latitude: form.latitude,
        longitude: form.longitude,
        rate_60: form.rate_60,
        rate_90: form.rate_90,
        rate_outcall: form.rate_outcall,
        studio_amenities: ensureArray(form.studio_amenities),
        payment_methods: ensureArray(form.payment_methods),
        languages: ensureArray(form.languages),
        website: form.website,
        instagram: form.instagram,
        whatsapp: form.whatsapp,
        birthdate: form.birthdate,
        years_experience: form.years_experience,
        rating: form.rating,
        gallery: Array.isArray(form.gallery) ? form.gallery : [],
        travel_radius: form.travel_radius,
        accepts_first_timers: form.accepts_first_timers,
        prefers_lgbtq_clients: form.prefers_lgbtq_clients,
      };

      const { error } = await supabase
        .from("therapists")
        .update(payload)
        .eq("id", therapist.id);

      if (error) {
        console.error(error);
        setErrorMsg("Erro ao salvar perfil. Tente novamente.");
        return;
      }

      setSuccessMsg("Perfil atualizado com sucesso!");
      await refreshProfile();
    } catch (err) {
      console.error(err);
      setErrorMsg("Erro inesperado ao salvar o perfil.");
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

  /* ==========================
     UI
     ========================== */

  return (
    <main className="edit-page">
      <div className="edit-container">
        <header className="edit-header">
          <button className="edit-back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h1>Edit Therapist Profile</h1>
          <button
            className="edit-save-btn"
            disabled={saving || !hasUnsavedChanges}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </header>

        {errorMsg && <div className="edit-alert edit-alert--error">{errorMsg}</div>}
        {successMsg && (
          <div className="edit-alert edit-alert--success">{successMsg}</div>
        )}

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
              <span>About</span>
              <textarea
                name="about"
                value={form.about || ""}
                onChange={handleSimpleChange}
                rows={4}
              />
            </label>
          </div>
        </section>

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
            <label className="edit-field edit-field--full">
              <span>Address</span>
              <input
                name="address"
                value={form.address || ""}
                onChange={handleSimpleChange}
              />
            </label>
          </div>
        </section>

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

        <section className="edit-section">
          <h2>
            <Building2 size={18} /> Studio Amenities
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

        <section className="edit-section">
          <h2>
            <Languages size={18} /> Languages
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

        <section className="edit-section">
          <h2>
            <Images size={18} /> Gallery
          </h2>
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
              onClick={handleGalleryAdd}
            >
              <Plus size={18} />
              <span>Add photo</span>
            </button>
          </div>
        </section>

        <footer className="edit-footer">
          <button className="edit-back-btn" onClick={handleBack}>
            Cancel
          </button>
          <button
            className="edit-save-btn"
            disabled={saving || !hasUnsavedChanges}
            onClick={handleSave}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </footer>
      </div>
    </main>
  );
}
