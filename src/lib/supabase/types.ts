/**
 * Hand-written to match supabase/migrations/0001_initial_schema.sql.
 * Regenerate from a linked project with `npm run db:types` once the schema
 * changes; the shape below is what that command emits.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "user" | "admin";
export type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled";
export type AnalyticsEvent =
  | "page_view"
  | "package_view"
  | "booking_started"
  | "booking_submitted";
export type DeviceType = "mobile" | "tablet" | "desktop";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      packages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          description: string;
          location: string;
          country: string;
          price_minor: number;
          currency: string;
          duration_days: number;
          max_guests: number;
          rating: number;
          cover_image_url: string | null;
          is_featured: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary?: string;
          description?: string;
          location: string;
          country: string;
          price_minor: number;
          currency?: string;
          duration_days: number;
          max_guests?: number;
          rating?: number;
          cover_image_url?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          summary?: string;
          description?: string;
          location?: string;
          country?: string;
          price_minor?: number;
          currency?: string;
          duration_days?: number;
          max_guests?: number;
          rating?: number;
          cover_image_url?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      package_images: {
        Row: {
          id: string;
          package_id: string;
          url: string;
          alt: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          package_id: string;
          url: string;
          alt?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          package_id?: string;
          url?: string;
          alt?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "package_images_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "packages";
            referencedColumns: ["id"];
          },
        ];
      };
      package_itinerary: {
        Row: {
          id: string;
          package_id: string;
          day_no: number;
          title: string;
          description: string;
        };
        Insert: {
          id?: string;
          package_id: string;
          day_no: number;
          title: string;
          description?: string;
        };
        Update: {
          id?: string;
          package_id?: string;
          day_no?: number;
          title?: string;
          description?: string;
        };
        Relationships: [
          {
            foreignKeyName: "package_itinerary_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "packages";
            referencedColumns: ["id"];
          },
        ];
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          package_id: string;
          check_in: string;
          check_out: string;
          guests: number;
          total_minor: number;
          currency: string;
          status: BookingStatus;
          contact_name: string;
          contact_phone: string;
          note: string | null;
          admin_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          package_id: string;
          check_in: string;
          check_out: string;
          guests: number;
          total_minor?: number;
          currency?: string;
          status?: BookingStatus;
          contact_name: string;
          contact_phone: string;
          note?: string | null;
          admin_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          package_id?: string;
          check_in?: string;
          check_out?: string;
          guests?: number;
          total_minor?: number;
          currency?: string;
          status?: BookingStatus;
          contact_name?: string;
          contact_phone?: string;
          note?: string | null;
          admin_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "packages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      analytics_events: {
        Row: {
          id: number;
          event: AnalyticsEvent;
          path: string;
          package_id: string | null;
          session_id: string;
          user_id: string | null;
          referrer: string | null;
          device: DeviceType | null;
          country: string | null;
          created_at: string;
        };
        Insert: {
          id?: never;
          event: AnalyticsEvent;
          path: string;
          package_id?: string | null;
          session_id: string;
          user_id?: string | null;
          referrer?: string | null;
          device?: DeviceType | null;
          country?: string | null;
          created_at?: string;
        };
        Update: {
          id?: never;
          event?: AnalyticsEvent;
          path?: string;
          package_id?: string | null;
          session_id?: string;
          user_id?: string | null;
          referrer?: string | null;
          device?: DeviceType | null;
          country?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_events_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "packages";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      daily_visitors: {
        Row: {
          day: string;
          visitors: number;
          page_views: number;
          package_views: number;
        };
        Relationships: [];
      };
      top_packages_7d: {
        Row: {
          id: string;
          slug: string;
          title: string;
          views: number;
        };
        Relationships: [];
      };
      device_split_7d: {
        Row: {
          device: DeviceType | null;
          sessions: number;
        };
        Relationships: [];
      };
      top_pages_7d: {
        Row: {
          path: string;
          views: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      booking_status: BookingStatus;
      analytics_event: AnalyticsEvent;
    };
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Views<T extends keyof PublicSchema["Views"]> =
  PublicSchema["Views"][T]["Row"];
