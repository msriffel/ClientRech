import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          company_name: string;
          website: string | null;
          phone: string | null;
          logo_url: string;
          status: string;
          last_contact_date: string;
          next_contact_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          website?: string | null;
          phone?: string | null;
          logo_url: string;
          status: string;
          last_contact_date: string;
          next_contact_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          website?: string | null;
          phone?: string | null;
          logo_url?: string;
          status?: string;
          last_contact_date?: string;
          next_contact_date?: string;
          created_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          client_id: string;
          name: string;
          email: string;
          phone: string | null;
          role: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          name: string;
          email: string;
          phone?: string | null;
          role: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          role?: string;
        };
      };
      interactions: {
        Row: {
          id: string;
          client_id: string;
          date: string;
          type: string;
          notes: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          date: string;
          type: string;
          notes: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          date?: string;
          type?: string;
          notes?: string;
        };
      };
    };
  };
}
