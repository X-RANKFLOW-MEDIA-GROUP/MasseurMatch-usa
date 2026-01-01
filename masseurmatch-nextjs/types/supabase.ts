export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      users: Table<{
        id: string;
        identity_status: "pending" | "verified" | "failed";
        role: "user" | "admin";
        stripe_customer_id: string | null;
        stripe_identity_session_id: string | null;
        identity_verified_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      profiles: Table<{
        id: string;
        user_id: string;
        email: string | null;
        display_name: string | null;
        headline: string | null;
        bio: string | null;
        bio_short: string | null;
        bio_long: string | null;
        date_of_birth: string | null;
        city_slug: string | null;
        city: string | null;
        state: string | null;
        address_line1: string | null;
        address_line2: string | null;
        zip_code: string | null;
        latitude: number | null;
        longitude: number | null;
        phone_public_e164: string | null;
        phone_whatsapp_e164: string | null;
        email_public: string | null;
        website_url: string | null;
        incall_enabled: boolean | null;
        outcall_enabled: boolean | null;
        base_rate_per_min_cents: number | null;
        slug: string | null;
        is_admin: boolean | null;
        profile_photo: string | null;
        auto_moderation: "draft" | "auto_passed" | "auto_flagged" | "auto_blocked";
        admin_status: "pending_admin" | "approved" | "rejected" | "changes_requested";
        publication_status: "private" | "public";
        onboarding_stage:
          | "start"
          | "needs_plan"
          | "needs_payment"
          | "needs_identity"
          | "build_profile"
          | "upload_photos"
          | "fix_moderation"
          | "submit_admin"
          | "waiting_admin"
          | "live"
          | "blocked";
        submitted_at: string | null;
        approved_at: string | null;
        admin_notes: string | null;
        rejection_reason: string | null;
        availability_status: "available" | "visiting_now" | "visiting_soon" | "offline" | null;
        last_status_update: string | null;
        created_at: string;
        updated_at: string;
      }>;
      subscriptions: Table<{
        id: string;
        user_id: string;
        plan: "free" | "standard" | "pro" | "elite";
        status: "trialing" | "active" | "past_due" | "canceled";
        stripe_customer_id: string | null;
        stripe_subscription_id: string | null;
        stripe_payment_method_id: string | null;
        trial_start: string | null;
        trial_end: string | null;
        current_period_start: string | null;
        current_period_end: string | null;
        cancel_at_period_end: boolean | null;
        canceled_at: string | null;
        metadata: Json | null;
        created_at: string;
        updated_at: string;
      }>;
      media_assets: Table<{
        id: string;
        profile_id: string;
        status: "pending" | "approved" | "rejected";
        type: "photo" | "video";
        storage_path: string;
        public_url: string | null;
        thumbnail_url: string | null;
        position: number | null;
        is_cover: boolean | null;
        sightengine_response: Json | null;
        sightengine_score: number | null;
        rejection_reason: string | null;
        width: number | null;
        height: number | null;
        file_size: number | null;
        mime_type: string | null;
        created_at: string;
        updated_at: string;
      }>;
      profile_rates: Table<{
        id: string;
        profile_id: string;
        context: "incall" | "outcall";
        duration_minutes: number;
        price_cents: number;
        currency: string | null;
        is_active: boolean | null;
        notes: string | null;
        created_at: string;
        updated_at: string;
      }>;
      profile_hours: Table<{
        id: string;
        profile_id: string;
        day_of_week: number;
        is_closed: boolean | null;
        open_time: string | null;
        close_time: string | null;
        break_start: string | null;
        break_end: string | null;
        created_at: string;
        updated_at: string;
      }>;
      profile_languages: Table<{
        id: string;
        profile_id: string;
        language: string;
        created_at: string;
      }>;
      profile_services: Table<{
        id: string;
        profile_id: string;
        service: string;
        created_at: string;
      }>;
      profile_setups: Table<{
        id: string;
        profile_id: string;
        setup_name: string;
        description: string | null;
        created_at: string;
      }>;
      therapists: Table<{
        user_id: string;
        slug: string | null;
        full_name: string | null;
        display_name: string | null;
        headline: string | null;
        about: string | null;
        philosophy: string | null;
        email: string | null;
        phone: string | null;
        website: string | null;
        instagram: string | null;
        whatsapp: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        neighborhood: string | null;
        address: string | null;
        zip_code: string | null;
        nearest_intersection: string | null;
        latitude: string | null;
        longitude: string | null;
        mobile_service_radius: number | null;
        appointment_types: string[] | null;
        location: string | null;
        enable_mapping: boolean | null;
        massage_setup: string | null;
        products_sold: string | null;
        bio: string | null;
        rates: Json | null;
        rate_disclaimers: string | null;
        in_studio_hours: string | null;
        mobile_hours: string | null;
        booking_link: string | null;
        social_links: Json | null;
        certifications: string[] | null;
        outcall_radius: number | null;
        business_start_date: string | null;
        photos: string[] | null;
        session_length_options: string | null;
        timezone: string | null;
        mobile_radius: number | null;
        hours_summary: string | null;
        appointment_window: string | null;
        booking_url: string | null;
        special_notes: string | null;
        gallery_urls: string[] | null;
        travel_radius: string | null;
        accepts_first_timers: boolean | null;
        prefers_lgbtq_clients: boolean | null;
        policies: string | null;
        payments: Json | null;
        discounts: Json | null;
        services_headline: string | null;
        specialties_headline: string | null;
        promotions_headline: string | null;
        services: string[] | null;
        massage_techniques: string[] | null;
        studio_amenities: string[] | null;
        mobile_extras: string[] | null;
        additional_services: string[] | null;
        products_used: string | null;
        rate_60: string | null;
        rate_90: string | null;
        rate_outcall: string | null;
        payment_methods: string[] | null;
        regular_discounts: string | null;
        day_of_week_discount: string | null;
        weekly_specials: string | null;
        special_discount_groups: string[] | null;
        availability: Json | null;
        degrees: string | null;
        affiliations: string[] | null;
        massage_start_date: string | null;
        languages: string[] | null;
        business_trips: string[] | null;
        rating: number | null;
        override_reviews_count: number | null;
        birthdate: string | null;
        years_experience: number | null;
        profile_photo: string | null;
        gallery: string[] | null;
        agree_terms: boolean | null;
        plan: string | null;
        plan_name: string | null;
        price_monthly: number | null;
        status: string | null;
        paid_until: string | null;
        subscription_status: string | null;
        stripe_current_period_end: string | null;
        created_at: string | null;
        updated_at: string | null;
      }>;
      payments: Table<{
        id: string;
        user_id: string | null;
        status: string;
        paid_until: string | null;
        customer_email: string | null;
        email: string | null;
        txt: string | null;
        created_at: string;
        updated_at: string;
      }>;
      therapist_promotions: Table<{
        id: string;
        therapist_id: string;
        title: string;
        description: string | null;
        discount_text: string | null;
        start_date: string;
        end_date: string;
        is_active: boolean | null;
        display_order: number | null;
        badge_color: string | null;
        view_count: number | null;
        click_count: number | null;
        priority_for_available: boolean | null;
        created_at: string | null;
        updated_at: string | null;
      }>;
      therapist_slug_redirects: Table<{
        old_slug: string;
        new_slug: string;
        therapist_id: string | null;
        created_at: string | null;
      }>;
      reviews: Table<{
        id: string;
        therapist_id: string | null;
        reviewer_name: string;
        rating: number;
        comment: string | null;
        date: string | null;
        created_at: string | null;
      }>;
      explore_swipe_events: Table<{
        id: string;
        user_id: string | null;
        therapist_id: string | null;
        direction: string;
        match_score: number | null;
        context: Json | null;
        created_at: string;
      }>;
      users_preferences: Table<{
        user_id: string;
        latitude: number;
        longitude: number;
        radius: number;
        zip_code: string | null;
        location: Json | null;
        massage_types: string[] | null;
        pressure: string | null;
        gender: string | null;
        mode: string | null;
        availability: string | null;
        budget_min: number | null;
        budget_max: number | null;
        pain_points: string[] | null;
        ai_feedback: Json | null;
        created_at: string;
        updated_at: string;
      }>;
      profile_edits: Table<{
        id: string;
        therapist_id: string;
        edited_data: Json;
        pending_profile_photo: string | null;
        pending_gallery: string[] | null;
        original_data: Json;
        original_profile_photo: string | null;
        original_gallery: string[] | null;
        status: "pending" | "approved" | "rejected";
        admin_notes: string | null;
        reviewed_by: string | null;
        reviewed_at: string | null;
        submitted_at: string;
        created_at: string;
        updated_at: string;
      }>;
      edit_notifications: Table<{
        id: string;
        therapist_id: string;
        edit_id: string | null;
        type: "pending" | "approved" | "rejected";
        message: string;
        read: boolean;
        created_at: string;
      }>;
    };
    Views: {
      public_profiles: Table<{
        id: string;
        user_id: string | null;
        display_name: string | null;
        city_slug: string | null;
        slug: string | null;
        incall_enabled: boolean | null;
        outcall_enabled: boolean | null;
        profile_photo: string | null;
        created_at: string | null;
        updated_at: string | null;
      }>;
      public_therapist_profiles: Table<{
        therapist_id: string;
        profile_id: string;
        city_slug: string;
        city_name: string;
        state_code: string;
        slug: string;
        display_name: string;
        status: string;
        published_at: string | null;
        updated_at: string | null;
        short_bio: string | null;
        long_bio: string | null;
        services: string[] | null;
        modalities: string[] | null;
        languages: string[] | null;
        availability_note: string | null;
        incall_enabled: boolean;
        outcall_enabled: boolean;
        price_from: number | null;
        price_to: number | null;
        currency: string | null;
        service_areas: Json | null;
        photos: Json | null;
        contact_phone: string | null;
        contact_email: string | null;
        contact_website: string | null;
        contact_instagram: string | null;
        plan_tier: string;
      }>;
    };
    Functions: {
      discover_nearby_therapists: {
        Args: {
          user_lat: number;
          user_lon: number;
          radius_meters: number;
          limit_results?: number;
        };
        Returns: {
          user_id: string;
          display_name: string | null;
          slug: string | null;
          latitude: string | null;
          longitude: string | null;
          rating: number | null;
          review_count: number | null;
          profile_photo: string | null;
          services: string[] | null;
          massage_techniques: string[] | null;
          specialties: string[] | null;
          availability: Json | null;
          status: string | null;
          city: string | null;
          state: string | null;
          phone: string | null;
          mobile_service_radius: number | null;
          mobile_extras: string[] | null;
          headline: string | null;
          about: string | null;
          distance: number | null;
          rate_60: string | null;
          rate_90: string | null;
          rate_outcall: string | null;
          created_at: string | null;
        }[];
      };
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      identity_status_enum: "pending" | "verified" | "failed";
      user_role_enum: "user" | "admin";
      subscription_plan_enum: "free" | "standard" | "pro" | "elite";
      subscription_status_enum: "trialing" | "active" | "past_due" | "canceled";
      auto_moderation_enum: "draft" | "auto_passed" | "auto_flagged" | "auto_blocked";
      admin_status_enum: "pending_admin" | "approved" | "rejected" | "changes_requested";
      publication_status_enum: "private" | "public";
      onboarding_stage_enum:
        | "start"
        | "needs_plan"
        | "needs_payment"
        | "needs_identity"
        | "build_profile"
        | "upload_photos"
        | "fix_moderation"
        | "submit_admin"
        | "waiting_admin"
        | "live"
        | "blocked";
      media_status_enum: "pending" | "approved" | "rejected";
      media_type_enum: "photo" | "video";
      rate_context_enum: "incall" | "outcall";
    };
    CompositeTypes: {};
  };
}
