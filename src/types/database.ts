export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          image?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          compare_at_price: number | null;
          images: string[];
          category_id: string;
          tags: string[];
          is_active: boolean;
          stock: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          compare_at_price?: number | null;
          images?: string[];
          category_id: string;
          tags?: string[];
          is_active?: boolean;
          stock?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          price?: number;
          compare_at_price?: number | null;
          images?: string[];
          category_id?: string;
          tags?: string[];
          is_active?: boolean;
          stock?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size: string;
          color: string;
          stock: number;
          sku: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          size: string;
          color: string;
          stock?: number;
          sku: string;
          created_at?: string;
        };
        Update: {
          size?: string;
          color?: string;
          stock?: number;
          sku?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
          subtotal: number;
          shipping: number;
          total: number;
          shipping_address: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
          subtotal: number;
          shipping: number;
          total: number;
          shipping_address: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          size: string;
          color: string;
          price: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          size: string;
          color: string;
          price: number;
        };
        Update: {
          quantity?: number;
          price?: number;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          description: string;
          type: "percentage" | "fixed";
          value: number;
          min_order_value: number;
          is_active: boolean;
          expires_at: string | null;
          max_uses: number | null;
          uses_count: number;
          first_purchase_only: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description: string;
          type: "percentage" | "fixed";
          value: number;
          min_order_value?: number;
          is_active?: boolean;
          expires_at?: string | null;
          max_uses?: number | null;
          uses_count?: number;
          first_purchase_only?: boolean;
          created_at?: string;
        };
        Update: {
          description?: string;
          type?: "percentage" | "fixed";
          value?: number;
          min_order_value?: number;
          is_active?: boolean;
          expires_at?: string | null;
          max_uses?: number | null;
          uses_count?: number;
          first_purchase_only?: boolean;
        };
        Relationships: [];
      };
      coupon_uses: {
        Row: {
          id: string;
          coupon_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          coupon_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          coupon_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          value?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
