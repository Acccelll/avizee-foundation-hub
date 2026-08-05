export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          code: string
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_email_masked: string | null
          actor_id: string | null
          changed_fields: string[] | null
          context: Json | null
          entity: string
          entity_id: string | null
          id: string
          new_values: Json | null
          occurred_at: string
          origin: string | null
          previous_values: Json | null
          result: string
        }
        Insert: {
          action: string
          actor_email_masked?: string | null
          actor_id?: string | null
          changed_fields?: string[] | null
          context?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
          new_values?: Json | null
          occurred_at?: string
          origin?: string | null
          previous_values?: Json | null
          result?: string
        }
        Update: {
          action?: string
          actor_email_masked?: string | null
          actor_id?: string | null
          changed_fields?: string[] | null
          context?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
          new_values?: Json | null
          occurred_at?: string
          origin?: string | null
          previous_values?: Json | null
          result?: string
        }
        Relationships: []
      }
      code_conflicts: {
        Row: {
          candidate_names: Json
          canonical_product_id: string | null
          code: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision: string | null
          id: string
          impact: string | null
          sources: Json
          status: string
          updated_at: string
        }
        Insert: {
          candidate_names?: Json
          canonical_product_id?: string | null
          code: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision?: string | null
          id?: string
          impact?: string | null
          sources?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          candidate_names?: Json
          canonical_product_id?: string | null
          code?: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision?: string | null
          id?: string
          impact?: string | null
          sources?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_conflicts_canonical_product_id_fkey"
            columns: ["canonical_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_conflicts_canonical_product_id_fkey"
            columns: ["canonical_product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_records: {
        Row: {
          accepted: boolean
          accepted_at: string
          consent_text: string
          id: string
          legal_basis: string
          policy_version: string
          purpose: string
          quotation_id: string | null
          revoked_at: string | null
          subject_email: string | null
        }
        Insert: {
          accepted: boolean
          accepted_at?: string
          consent_text: string
          id?: string
          legal_basis: string
          policy_version: string
          purpose: string
          quotation_id?: string | null
          revoked_at?: string | null
          subject_email?: string | null
        }
        Update: {
          accepted?: boolean
          accepted_at?: string
          consent_text?: string
          id?: string
          legal_basis?: string
          policy_version?: string
          purpose?: string
          quotation_id?: string | null
          revoked_at?: string | null
          subject_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consent_records_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      content_article_families: {
        Row: {
          article_id: string
          family_id: string
          sort_order: number
        }
        Insert: {
          article_id: string
          family_id: string
          sort_order?: number
        }
        Update: {
          article_id?: string
          family_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_article_families_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "content_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_article_families_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_article_families_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_article_families_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_article_families_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
        ]
      }
      content_article_products: {
        Row: {
          article_id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          article_id: string
          product_id: string
          sort_order?: number
        }
        Update: {
          article_id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_article_products_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "content_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_article_products_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_article_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_article_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      content_article_slugs: {
        Row: {
          article_id: string
          created_at: string
          id: string
          slug: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          slug: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_article_slugs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "content_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_article_slugs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_articles: {
        Row: {
          author_id: string | null
          blocks: Json
          category_id: string | null
          cover_media_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          excerpt: string | null
          first_published_at: string | null
          id: string
          internal_notes: string | null
          noindex: boolean
          published_at: string | null
          reading_minutes: number
          requires_technical_review: boolean
          review_note: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          subtitle: string | null
          technical_reviewer_id: string | null
          title: string
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          author_id?: string | null
          blocks?: Json
          category_id?: string | null
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          first_published_at?: string | null
          id?: string
          internal_notes?: string | null
          noindex?: boolean
          published_at?: string | null
          reading_minutes?: number
          requires_technical_review?: boolean
          review_note?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          subtitle?: string | null
          technical_reviewer_id?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          author_id?: string | null
          blocks?: Json
          category_id?: string | null
          cover_media_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          excerpt?: string | null
          first_published_at?: string | null
          id?: string
          internal_notes?: string | null
          noindex?: boolean
          published_at?: string | null
          reading_minutes?: number
          requires_technical_review?: boolean
          review_note?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          subtitle?: string | null
          technical_reviewer_id?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "content_authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "content_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_articles_cover_media_id_fkey"
            columns: ["cover_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_articles_technical_reviewer_id_fkey"
            columns: ["technical_reviewer_id"]
            isOneToOne: false
            referencedRelation: "content_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      content_authors: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string
          id: string
          is_active: boolean
          role_title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name: string
          id?: string
          is_active?: boolean
          role_title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_active?: boolean
          role_title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      content_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      content_references: {
        Row: {
          article_id: string
          created_at: string
          id: string
          label: string
          note: string | null
          sort_order: number
          url: string | null
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          label: string
          note?: string | null
          sort_order?: number
          url?: string | null
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          label?: string
          note?: string | null
          sort_order?: number
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_references_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "content_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_references_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_revisions: {
        Row: {
          article_id: string
          blocks: Json
          created_at: string
          created_by: string | null
          excerpt: string | null
          id: string
          note: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          version: number
        }
        Insert: {
          article_id: string
          blocks: Json
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          note?: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          version: number
        }
        Update: {
          article_id?: string
          blocks?: Json
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_revisions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "content_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_revisions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_social_variants: {
        Row: {
          article_id: string
          call_to_action: string | null
          caption: string | null
          channel: Database["public"]["Enums"]["content_channel"]
          created_at: string
          created_by: string | null
          exported_at: string | null
          exported_by: string | null
          hashtags: string[]
          headline: string | null
          id: string
          image_media_id: string | null
          status: Database["public"]["Enums"]["social_variant_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          article_id: string
          call_to_action?: string | null
          caption?: string | null
          channel: Database["public"]["Enums"]["content_channel"]
          created_at?: string
          created_by?: string | null
          exported_at?: string | null
          exported_by?: string | null
          hashtags?: string[]
          headline?: string | null
          id?: string
          image_media_id?: string | null
          status?: Database["public"]["Enums"]["social_variant_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          article_id?: string
          call_to_action?: string | null
          caption?: string | null
          channel?: Database["public"]["Enums"]["content_channel"]
          created_at?: string
          created_by?: string | null
          exported_at?: string | null
          exported_by?: string | null
          hashtags?: string[]
          headline?: string | null
          id?: string
          image_media_id?: string | null
          status?: Database["public"]["Enums"]["social_variant_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_social_variants_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "content_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_social_variants_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_social_variants_image_media_id_fkey"
            columns: ["image_media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      content_status_events: {
        Row: {
          actor_id: string | null
          article_id: string
          created_at: string
          from_status: Database["public"]["Enums"]["content_status"] | null
          id: string
          note: string | null
          to_status: Database["public"]["Enums"]["content_status"]
        }
        Insert: {
          actor_id?: string | null
          article_id: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["content_status"] | null
          id?: string
          note?: string | null
          to_status: Database["public"]["Enums"]["content_status"]
        }
        Update: {
          actor_id?: string | null
          article_id?: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["content_status"] | null
          id?: string
          note?: string | null
          to_status?: Database["public"]["Enums"]["content_status"]
        }
        Relationships: [
          {
            foreignKeyName: "content_status_events_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "content_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_status_events_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          bucket: string
          byte_size: number | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          document_date: string | null
          document_type: string
          id: string
          is_historical_reference: boolean
          is_indexable: boolean
          language: string
          mime_type: string | null
          notes: string | null
          publication_right: boolean
          slug: string | null
          status: string
          storage_path: string
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          bucket?: string
          byte_size?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          document_date?: string | null
          document_type?: string
          id?: string
          is_historical_reference?: boolean
          is_indexable?: boolean
          language?: string
          mime_type?: string | null
          notes?: string | null
          publication_right?: boolean
          slug?: string | null
          status?: string
          storage_path: string
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          bucket?: string
          byte_size?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          document_date?: string | null
          document_type?: string
          id?: string
          is_historical_reference?: boolean
          is_indexable?: boolean
          language?: string
          mime_type?: string | null
          notes?: string | null
          publication_right?: boolean
          slug?: string | null
          status?: string
          storage_path?: string
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      family_applications: {
        Row: {
          application_id: string
          created_at: string
          family_id: string
          id: string
          is_primary: boolean
        }
        Insert: {
          application_id: string
          created_at?: string
          family_id: string
          id?: string
          is_primary?: boolean
        }
        Update: {
          application_id?: string
          created_at?: string
          family_id?: string
          id?: string
          is_primary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "family_applications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_applications_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_applications_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_applications_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
        ]
      }
      family_segments: {
        Row: {
          created_at: string
          family_id: string
          id: string
          is_primary: boolean
          segment_id: string
        }
        Insert: {
          created_at?: string
          family_id: string
          id?: string
          is_primary?: boolean
          segment_id: string
        }
        Update: {
          created_at?: string
          family_id?: string
          id?: string
          is_primary?: boolean
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_segments_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_segments_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_segments_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "family_segments_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      family_solutions: {
        Row: {
          created_at: string
          family_id: string
          id: string
          solution_id: string
        }
        Insert: {
          created_at?: string
          family_id: string
          id?: string
          solution_id: string
        }
        Update: {
          created_at?: string
          family_id?: string
          id?: string
          solution_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_solutions_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_solutions_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_solutions_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "family_solutions_solution_id_fkey"
            columns: ["solution_id"]
            isOneToOne: false
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      }
      family_specifications: {
        Row: {
          created_at: string
          definition_id: string
          family_id: string
          id: string
          source: string | null
          unit_id: string | null
          updated_at: string
          value_bool: boolean | null
          value_enum: string[] | null
          value_max: number | null
          value_min: number | null
          value_num: number | null
          value_text: string | null
        }
        Insert: {
          created_at?: string
          definition_id: string
          family_id: string
          id?: string
          source?: string | null
          unit_id?: string | null
          updated_at?: string
          value_bool?: boolean | null
          value_enum?: string[] | null
          value_max?: number | null
          value_min?: number | null
          value_num?: number | null
          value_text?: string | null
        }
        Update: {
          created_at?: string
          definition_id?: string
          family_id?: string
          id?: string
          source?: string | null
          unit_id?: string | null
          updated_at?: string
          value_bool?: boolean | null
          value_enum?: string[] | null
          value_max?: number | null
          value_min?: number | null
          value_num?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_specifications_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "specification_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_specifications_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_specifications_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_specifications_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "family_specifications_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      image_review_events: {
        Row: {
          actor_id: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["image_status"] | null
          id: string
          media_asset_id: string
          reason: string | null
          to_status: Database["public"]["Enums"]["image_status"]
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["image_status"] | null
          id?: string
          media_asset_id: string
          reason?: string | null
          to_status: Database["public"]["Enums"]["image_status"]
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["image_status"] | null
          id?: string
          media_asset_id?: string
          reason?: string | null
          to_status?: Database["public"]["Enums"]["image_status"]
        }
        Relationships: [
          {
            foreignKeyName: "image_review_events_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      import_errors: {
        Row: {
          column_name: string | null
          created_at: string
          error_code: string
          id: string
          import_job_id: string
          message: string
          row_number: number | null
          severity: string
        }
        Insert: {
          column_name?: string | null
          created_at?: string
          error_code: string
          id?: string
          import_job_id: string
          message: string
          row_number?: number | null
          severity?: string
        }
        Update: {
          column_name?: string | null
          created_at?: string
          error_code?: string
          id?: string
          import_job_id?: string
          message?: string
          row_number?: number | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_errors_import_job_id_fkey"
            columns: ["import_job_id"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      import_job_rows: {
        Row: {
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          import_job_id: string
          messages: Json
          new_values: Json | null
          outcome: string
          previous_values: Json | null
          row_number: number
          source_reference: string | null
        }
        Insert: {
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          import_job_id: string
          messages?: Json
          new_values?: Json | null
          outcome: string
          previous_values?: Json | null
          row_number: number
          source_reference?: string | null
        }
        Update: {
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          import_job_id?: string
          messages?: Json
          new_values?: Json | null
          outcome?: string
          previous_values?: Json | null
          row_number?: number
          source_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_job_rows_import_job_id_fkey"
            columns: ["import_job_id"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      import_jobs: {
        Row: {
          blocked_rows: number
          confirmed_at: string | null
          conflict_rows: number
          created_at: string
          dry_run_job_id: string | null
          entity: string
          file_hash: string
          filename: string
          id: string
          invalid_rows: number
          mode: string
          new_rows: number
          operator_id: string | null
          rollback_of: string | null
          rolled_back_at: string | null
          schema_version: string
          status: Database["public"]["Enums"]["import_job_status"]
          summary: Json
          target_layer: string
          total_rows: number
          unchanged_rows: number
          updated_at: string
          updated_rows: number
          valid_rows: number
        }
        Insert: {
          blocked_rows?: number
          confirmed_at?: string | null
          conflict_rows?: number
          created_at?: string
          dry_run_job_id?: string | null
          entity: string
          file_hash: string
          filename: string
          id?: string
          invalid_rows?: number
          mode?: string
          new_rows?: number
          operator_id?: string | null
          rollback_of?: string | null
          rolled_back_at?: string | null
          schema_version: string
          status?: Database["public"]["Enums"]["import_job_status"]
          summary?: Json
          target_layer?: string
          total_rows?: number
          unchanged_rows?: number
          updated_at?: string
          updated_rows?: number
          valid_rows?: number
        }
        Update: {
          blocked_rows?: number
          confirmed_at?: string | null
          conflict_rows?: number
          created_at?: string
          dry_run_job_id?: string | null
          entity?: string
          file_hash?: string
          filename?: string
          id?: string
          invalid_rows?: number
          mode?: string
          new_rows?: number
          operator_id?: string | null
          rollback_of?: string | null
          rolled_back_at?: string | null
          schema_version?: string
          status?: Database["public"]["Enums"]["import_job_status"]
          summary?: Json
          target_layer?: string
          total_rows?: number
          unchanged_rows?: number
          updated_at?: string
          updated_rows?: number
          valid_rows?: number
        }
        Relationships: [
          {
            foreignKeyName: "import_jobs_dry_run_job_id_fkey"
            columns: ["dry_run_job_id"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_jobs_rollback_of_fkey"
            columns: ["rollback_of"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          authorization_type: string | null
          bucket: string
          byte_size: number | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          detected_brand: string | null
          height: number | null
          id: string
          in_quarantine: boolean
          internal_title: string | null
          mime_type: string
          notes: string | null
          original_filename: string | null
          owner_name: string | null
          private_path: string
          public_path: string | null
          review_reason: string | null
          review_status: Database["public"]["Enums"]["image_status"]
          rights_date: string | null
          rights_document_path: string | null
          rights_responsible: string | null
          rights_restrictions: string | null
          rights_status: Database["public"]["Enums"]["rights_status"]
          rights_valid_until: string | null
          sha256: string | null
          source: string | null
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          authorization_type?: string | null
          bucket?: string
          byte_size?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          detected_brand?: string | null
          height?: number | null
          id?: string
          in_quarantine?: boolean
          internal_title?: string | null
          mime_type: string
          notes?: string | null
          original_filename?: string | null
          owner_name?: string | null
          private_path: string
          public_path?: string | null
          review_reason?: string | null
          review_status?: Database["public"]["Enums"]["image_status"]
          rights_date?: string | null
          rights_document_path?: string | null
          rights_responsible?: string | null
          rights_restrictions?: string | null
          rights_status?: Database["public"]["Enums"]["rights_status"]
          rights_valid_until?: string | null
          sha256?: string | null
          source?: string | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          authorization_type?: string | null
          bucket?: string
          byte_size?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          detected_brand?: string | null
          height?: number | null
          id?: string
          in_quarantine?: boolean
          internal_title?: string | null
          mime_type?: string
          notes?: string | null
          original_filename?: string | null
          owner_name?: string | null
          private_path?: string
          public_path?: string | null
          review_reason?: string | null
          review_status?: Database["public"]["Enums"]["image_status"]
          rights_date?: string | null
          rights_document_path?: string | null
          rights_responsible?: string | null
          rights_restrictions?: string | null
          rights_status?: Database["public"]["Enums"]["rights_status"]
          rights_valid_until?: string | null
          sha256?: string | null
          source?: string | null
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      normalization_task_events: {
        Row: {
          actor_id: string | null
          comment: string | null
          created_at: string
          event_type: string
          id: string
          payload: Json | null
          task_id: string
        }
        Insert: {
          actor_id?: string | null
          comment?: string | null
          created_at?: string
          event_type: string
          id?: string
          payload?: Json | null
          task_id: string
        }
        Update: {
          actor_id?: string | null
          comment?: string | null
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "normalization_task_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "normalization_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      normalization_tasks: {
        Row: {
          assignee_id: string | null
          code_conflict_id: string | null
          created_at: string
          decision: string | null
          description: string | null
          evidence: Json
          family_id: string | null
          id: string
          media_asset_id: string | null
          origin: string | null
          prefix: string | null
          priority: string
          product_id: string | null
          reason: Database["public"]["Enums"]["staging_status"]
          source_record_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          code_conflict_id?: string | null
          created_at?: string
          decision?: string | null
          description?: string | null
          evidence?: Json
          family_id?: string | null
          id?: string
          media_asset_id?: string | null
          origin?: string | null
          prefix?: string | null
          priority?: string
          product_id?: string | null
          reason: Database["public"]["Enums"]["staging_status"]
          source_record_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          code_conflict_id?: string | null
          created_at?: string
          decision?: string | null
          description?: string | null
          evidence?: Json
          family_id?: string | null
          id?: string
          media_asset_id?: string | null
          origin?: string | null
          prefix?: string | null
          priority?: string
          product_id?: string | null
          reason?: Database["public"]["Enums"]["staging_status"]
          source_record_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "normalization_tasks_code_conflict_id_fkey"
            columns: ["code_conflict_id"]
            isOneToOne: false
            referencedRelation: "code_conflicts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "normalization_tasks_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "normalization_tasks_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "normalization_tasks_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "normalization_tasks_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "normalization_tasks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "normalization_tasks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "normalization_tasks_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      outbox_messages: {
        Row: {
          attempts: number
          claim_token: string | null
          claimed_at: string | null
          created_at: string
          dedupe_key: string | null
          id: string
          last_error: string | null
          lease_until: string | null
          max_attempts: number
          message_type: string
          next_attempt_at: string
          payload: Json
          processed_at: string | null
          quotation_id: string | null
          status: Database["public"]["Enums"]["outbox_status"]
          updated_at: string
          worker_id: string | null
        }
        Insert: {
          attempts?: number
          claim_token?: string | null
          claimed_at?: string | null
          created_at?: string
          dedupe_key?: string | null
          id?: string
          last_error?: string | null
          lease_until?: string | null
          max_attempts?: number
          message_type: string
          next_attempt_at?: string
          payload?: Json
          processed_at?: string | null
          quotation_id?: string | null
          status?: Database["public"]["Enums"]["outbox_status"]
          updated_at?: string
          worker_id?: string | null
        }
        Update: {
          attempts?: number
          claim_token?: string | null
          claimed_at?: string | null
          created_at?: string
          dedupe_key?: string | null
          id?: string
          last_error?: string | null
          lease_until?: string | null
          max_attempts?: number
          message_type?: string
          next_attempt_at?: string
          payload?: Json
          processed_at?: string | null
          quotation_id?: string | null
          status?: Database["public"]["Enums"]["outbox_status"]
          updated_at?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outbox_messages_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      placeholder_usage: {
        Row: {
          created_at: string
          family_id: string | null
          id: string
          pending_since: string
          priority: string
          product_id: string | null
          reason: string
        }
        Insert: {
          created_at?: string
          family_id?: string | null
          id?: string
          pending_since?: string
          priority?: string
          product_id?: string | null
          reason: string
        }
        Update: {
          created_at?: string
          family_id?: string | null
          id?: string
          pending_since?: string
          priority?: string
          product_id?: string | null
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "placeholder_usage_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placeholder_usage_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placeholder_usage_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "placeholder_usage_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placeholder_usage_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_applications: {
        Row: {
          application_id: string
          created_at: string
          id: string
          is_exception: boolean
          is_primary: boolean
          justification: string | null
          product_id: string
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          is_exception?: boolean
          is_primary?: boolean
          justification?: string | null
          product_id: string
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          is_exception?: boolean
          is_primary?: boolean
          justification?: string | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_applications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_applications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_applications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          code: string
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_codes: {
        Row: {
          code: string
          code_type: Database["public"]["Enums"]["code_type"]
          created_at: string
          id: string
          is_public: boolean
          is_valid: boolean
          notes: string | null
          product_id: string
          source: string | null
        }
        Insert: {
          code: string
          code_type: Database["public"]["Enums"]["code_type"]
          created_at?: string
          id?: string
          is_public?: boolean
          is_valid?: boolean
          notes?: string | null
          product_id: string
          source?: string | null
        }
        Update: {
          code?: string
          code_type?: Database["public"]["Enums"]["code_type"]
          created_at?: string
          id?: string
          is_public?: boolean
          is_valid?: boolean
          notes?: string | null
          product_id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_codes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_codes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_documents: {
        Row: {
          created_at: string
          document_id: string
          family_id: string | null
          id: string
          product_id: string | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          document_id: string
          family_id?: string | null
          id?: string
          product_id?: string | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          document_id?: string
          family_id?: string | null
          id?: string
          product_id?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_documents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_documents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_documents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "product_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_families: {
        Row: {
          admin_name: string
          category_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          id: string
          internal_notes: string | null
          public_description: string | null
          public_name: string
          publication_status: Database["public"]["Enums"]["publication_status"]
          reference_code: string | null
          review_status: Database["public"]["Enums"]["review_status"]
          slug: string
          sort_order: number
          source: string | null
          subcategory_id: string | null
          summary: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          admin_name?: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          internal_notes?: string | null
          public_description?: string | null
          public_name: string
          publication_status?: Database["public"]["Enums"]["publication_status"]
          reference_code?: string | null
          review_status?: Database["public"]["Enums"]["review_status"]
          slug: string
          sort_order?: number
          source?: string | null
          subcategory_id?: string | null
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          admin_name?: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          internal_notes?: string | null
          public_description?: string | null
          public_name?: string
          publication_status?: Database["public"]["Enums"]["publication_status"]
          reference_code?: string | null
          review_status?: Database["public"]["Enums"]["review_status"]
          slug?: string
          sort_order?: number
          source?: string | null
          subcategory_id?: string | null
          summary?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_families_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_families_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "public_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_families_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "product_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          family_id: string | null
          id: string
          media_asset_id: string
          product_id: string | null
          role: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          family_id?: string | null
          id?: string
          media_asset_id: string
          product_id?: string | null
          role?: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          family_id?: string | null
          id?: string
          media_asset_id?: string
          product_id?: string | null
          role?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_images_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "product_images_media_asset_id_fkey"
            columns: ["media_asset_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_segments: {
        Row: {
          created_at: string
          id: string
          is_exception: boolean
          is_primary: boolean
          justification: string | null
          product_id: string
          segment_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_exception?: boolean
          is_primary?: boolean
          justification?: string | null
          product_id: string
          segment_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_exception?: boolean
          is_primary?: boolean
          justification?: string | null
          product_id?: string
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_segments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_segments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_segments_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      product_specifications: {
        Row: {
          created_at: string
          definition_id: string
          id: string
          is_override: boolean
          product_id: string
          source: string | null
          unit_id: string | null
          updated_at: string
          value_bool: boolean | null
          value_enum: string[] | null
          value_max: number | null
          value_min: number | null
          value_num: number | null
          value_text: string | null
        }
        Insert: {
          created_at?: string
          definition_id: string
          id?: string
          is_override?: boolean
          product_id: string
          source?: string | null
          unit_id?: string | null
          updated_at?: string
          value_bool?: boolean | null
          value_enum?: string[] | null
          value_max?: number | null
          value_min?: number | null
          value_num?: number | null
          value_text?: string | null
        }
        Update: {
          created_at?: string
          definition_id?: string
          id?: string
          is_override?: boolean
          product_id?: string
          source?: string | null
          unit_id?: string | null
          updated_at?: string
          value_bool?: boolean | null
          value_enum?: string[] | null
          value_max?: number | null
          value_min?: number | null
          value_num?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_specifications_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "specification_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_specifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_specifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_specifications_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      product_subcategories: {
        Row: {
          category_id: string
          code: string
          created_at: string
          deleted_at: string | null
          id: string
          is_active: boolean
          is_public: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          code: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          code?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          is_public?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "public_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          capacity: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          family_id: string | null
          id: string
          internal_brand: string | null
          internal_manufacturer: string | null
          internal_notes: string | null
          internal_original_name: string | null
          internal_supplier_reference: string | null
          is_on_request: boolean
          measure: string | null
          public_description: string | null
          public_name: string
          public_sku: string | null
          publication_status: Database["public"]["Enums"]["publication_status"]
          review_status: Database["public"]["Enums"]["review_status"]
          slug: string | null
          sort_order: number
          source: string | null
          unit: string | null
          updated_at: string
          updated_by: string | null
          variation_label: string | null
        }
        Insert: {
          capacity?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          family_id?: string | null
          id?: string
          internal_brand?: string | null
          internal_manufacturer?: string | null
          internal_notes?: string | null
          internal_original_name?: string | null
          internal_supplier_reference?: string | null
          is_on_request?: boolean
          measure?: string | null
          public_description?: string | null
          public_name: string
          public_sku?: string | null
          publication_status?: Database["public"]["Enums"]["publication_status"]
          review_status?: Database["public"]["Enums"]["review_status"]
          slug?: string | null
          sort_order?: number
          source?: string | null
          unit?: string | null
          updated_at?: string
          updated_by?: string | null
          variation_label?: string | null
        }
        Update: {
          capacity?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          family_id?: string | null
          id?: string
          internal_brand?: string | null
          internal_manufacturer?: string | null
          internal_notes?: string | null
          internal_original_name?: string | null
          internal_supplier_reference?: string | null
          is_on_request?: boolean
          measure?: string | null
          public_description?: string | null
          public_name?: string
          public_sku?: string | null
          publication_status?: Database["public"]["Enums"]["publication_status"]
          review_status?: Database["public"]["Enums"]["review_status"]
          slug?: string | null
          sort_order?: number
          source?: string | null
          unit?: string | null
          updated_at?: string
          updated_by?: string | null
          variation_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      public_release_cohort: {
        Row: {
          approval_reference: string
          approved_by: string | null
          cohort_code: string
          created_at: string
          entity: string
          entity_id: string
          id: string
          updated_at: string
        }
        Insert: {
          approval_reference?: string
          approved_by?: string | null
          cohort_code?: string
          created_at?: string
          entity: string
          entity_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          approval_reference?: string
          approved_by?: string | null
          cohort_code?: string
          created_at?: string
          entity?: string
          entity_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      publication_history: {
        Row: {
          actor_id: string | null
          created_at: string
          entity: string
          entity_id: string
          from_status: string | null
          id: string
          reason: string | null
          to_status: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          entity: string
          entity_id: string
          from_status?: string | null
          id?: string
          reason?: string | null
          to_status: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          entity?: string
          entity_id?: string
          from_status?: string | null
          id?: string
          reason?: string | null
          to_status?: string
        }
        Relationships: []
      }
      quotation_events: {
        Row: {
          actor_id: string | null
          actor_label: string | null
          created_at: string
          event_type: Database["public"]["Enums"]["quotation_event_type"]
          from_status: Database["public"]["Enums"]["quotation_status"] | null
          id: string
          internal_note: string | null
          quotation_id: string
          to_status: Database["public"]["Enums"]["quotation_status"] | null
        }
        Insert: {
          actor_id?: string | null
          actor_label?: string | null
          created_at?: string
          event_type: Database["public"]["Enums"]["quotation_event_type"]
          from_status?: Database["public"]["Enums"]["quotation_status"] | null
          id?: string
          internal_note?: string | null
          quotation_id: string
          to_status?: Database["public"]["Enums"]["quotation_status"] | null
        }
        Update: {
          actor_id?: string | null
          actor_label?: string | null
          created_at?: string
          event_type?: Database["public"]["Enums"]["quotation_event_type"]
          from_status?: Database["public"]["Enums"]["quotation_status"] | null
          id?: string
          internal_note?: string | null
          quotation_id?: string
          to_status?: Database["public"]["Enums"]["quotation_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_events_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_items: {
        Row: {
          created_at: string
          family_id: string | null
          id: string
          note: string | null
          position: number
          product_id: string | null
          quantity: number
          quotation_id: string
          snapshot_category: string | null
          snapshot_family: string | null
          snapshot_name: string
          snapshot_sku: string
          snapshot_variation: string | null
          was_available: boolean
        }
        Insert: {
          created_at?: string
          family_id?: string | null
          id?: string
          note?: string | null
          position?: number
          product_id?: string | null
          quantity: number
          quotation_id: string
          snapshot_category?: string | null
          snapshot_family?: string | null
          snapshot_name: string
          snapshot_sku: string
          snapshot_variation?: string | null
          was_available?: boolean
        }
        Update: {
          created_at?: string
          family_id?: string | null
          id?: string
          note?: string | null
          position?: number
          product_id?: string | null
          quantity?: number
          quotation_id?: string
          snapshot_category?: string | null
          snapshot_family?: string | null
          snapshot_name?: string
          snapshot_sku?: string
          snapshot_variation?: string | null
          was_available?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "quotation_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_rate_limits: {
        Row: {
          created_at: string
          id: string
          ip_hash: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string
        }
        Relationships: []
      }
      quotation_sources: {
        Row: {
          created_at: string
          id: string
          origin_page: string | null
          quotation_id: string
          referrer: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          origin_page?: string | null
          quotation_id: string
          referrer?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          origin_page?: string | null
          quotation_id?: string
          referrer?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_sources_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: true
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          anonymized_at: string | null
          assigned_at: string | null
          assigned_to: string | null
          city: string | null
          client_request_id: string
          closed_at: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          id: string
          ip_hash: string | null
          item_count: number
          last_event_at: string
          message: string | null
          payload_hash: string | null
          preferred_channel: string | null
          protocol: string
          responded_at: string | null
          state_uf: string | null
          status: Database["public"]["Enums"]["quotation_status"]
          unavailable_item_count: number
          updated_at: string
          user_agent_hash: string | null
        }
        Insert: {
          anonymized_at?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          city?: string | null
          client_request_id: string
          closed_at?: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          item_count?: number
          last_event_at?: string
          message?: string | null
          payload_hash?: string | null
          preferred_channel?: string | null
          protocol: string
          responded_at?: string | null
          state_uf?: string | null
          status?: Database["public"]["Enums"]["quotation_status"]
          unavailable_item_count?: number
          updated_at?: string
          user_agent_hash?: string | null
        }
        Update: {
          anonymized_at?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          city?: string | null
          client_request_id?: string
          closed_at?: string | null
          company_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          id?: string
          ip_hash?: string | null
          item_count?: number
          last_event_at?: string
          message?: string | null
          payload_hash?: string | null
          preferred_channel?: string | null
          protocol?: string
          responded_at?: string | null
          state_uf?: string | null
          status?: Database["public"]["Enums"]["quotation_status"]
          unavailable_item_count?: number
          updated_at?: string
          user_agent_hash?: string | null
        }
        Relationships: []
      }
      related_products: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          justification: string | null
          origin: string
          relation_type: string
          sort_order: number
          source_family_id: string | null
          source_product_id: string | null
          status: string
          target_family_id: string | null
          target_product_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          justification?: string | null
          origin?: string
          relation_type: string
          sort_order?: number
          source_family_id?: string | null
          source_product_id?: string | null
          status?: string
          target_family_id?: string | null
          target_product_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          justification?: string | null
          origin?: string
          relation_type?: string
          sort_order?: number
          source_family_id?: string | null
          source_product_id?: string | null
          status?: string
          target_family_id?: string | null
          target_product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "related_products_source_family_id_fkey"
            columns: ["source_family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_source_family_id_fkey"
            columns: ["source_family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_source_family_id_fkey"
            columns: ["source_family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "related_products_source_product_id_fkey"
            columns: ["source_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_source_product_id_fkey"
            columns: ["source_product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_target_family_id_fkey"
            columns: ["target_family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_target_family_id_fkey"
            columns: ["target_family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_target_family_id_fkey"
            columns: ["target_family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "related_products_target_product_id_fkey"
            columns: ["target_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_target_product_id_fkey"
            columns: ["target_product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      segments: {
        Row: {
          code: string
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      solutions: {
        Row: {
          code: string
          created_at: string
          deleted_at: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          summary: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          summary?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      source_record_fields: {
        Row: {
          created_at: string
          field_name: string
          id: string
          is_protected: boolean
          normalized_value: string | null
          raw_value: string | null
          source_record_id: string
        }
        Insert: {
          created_at?: string
          field_name: string
          id?: string
          is_protected?: boolean
          normalized_value?: string | null
          raw_value?: string | null
          source_record_id: string
        }
        Update: {
          created_at?: string
          field_name?: string
          id?: string
          is_protected?: boolean
          normalized_value?: string | null
          raw_value?: string | null
          source_record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_record_fields_source_record_id_fkey"
            columns: ["source_record_id"]
            isOneToOne: false
            referencedRelation: "source_records"
            referencedColumns: ["id"]
          },
        ]
      }
      source_records: {
        Row: {
          canonical_family_id: string | null
          canonical_product_id: string | null
          content_hash: string | null
          created_at: string
          id: string
          import_job_id: string | null
          raw_payload: Json
          source_reference: string
          source_system: string
          staging_status: Database["public"]["Enums"]["staging_status"]
          updated_at: string
        }
        Insert: {
          canonical_family_id?: string | null
          canonical_product_id?: string | null
          content_hash?: string | null
          created_at?: string
          id?: string
          import_job_id?: string | null
          raw_payload?: Json
          source_reference: string
          source_system: string
          staging_status?: Database["public"]["Enums"]["staging_status"]
          updated_at?: string
        }
        Update: {
          canonical_family_id?: string | null
          canonical_product_id?: string | null
          content_hash?: string | null
          created_at?: string
          id?: string
          import_job_id?: string | null
          raw_payload?: Json
          source_reference?: string
          source_system?: string
          staging_status?: Database["public"]["Enums"]["staging_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_records_canonical_family_id_fkey"
            columns: ["canonical_family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_records_canonical_family_id_fkey"
            columns: ["canonical_family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_records_canonical_family_id_fkey"
            columns: ["canonical_family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "source_records_canonical_product_id_fkey"
            columns: ["canonical_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_records_canonical_product_id_fkey"
            columns: ["canonical_product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_records_import_job_fk"
            columns: ["import_job_id"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      specification_definitions: {
        Row: {
          code: string
          created_at: string
          display_order: number
          enum_values: string[] | null
          help_text: string | null
          id: string
          is_active: boolean
          is_filterable: boolean
          is_public: boolean
          is_required: boolean
          label: string
          synonyms: string[] | null
          unit_id: string | null
          updated_at: string
          value_type: Database["public"]["Enums"]["spec_value_type"]
        }
        Insert: {
          code: string
          created_at?: string
          display_order?: number
          enum_values?: string[] | null
          help_text?: string | null
          id?: string
          is_active?: boolean
          is_filterable?: boolean
          is_public?: boolean
          is_required?: boolean
          label: string
          synonyms?: string[] | null
          unit_id?: string | null
          updated_at?: string
          value_type: Database["public"]["Enums"]["spec_value_type"]
        }
        Update: {
          code?: string
          created_at?: string
          display_order?: number
          enum_values?: string[] | null
          help_text?: string | null
          id?: string
          is_active?: boolean
          is_filterable?: boolean
          is_public?: boolean
          is_required?: boolean
          label?: string
          synonyms?: string[] | null
          unit_id?: string | null
          updated_at?: string
          value_type?: Database["public"]["Enums"]["spec_value_type"]
        }
        Relationships: [
          {
            foreignKeyName: "specification_definitions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      specification_scopes: {
        Row: {
          category_id: string | null
          created_at: string
          definition_id: string
          display_order: number
          family_id: string | null
          id: string
          is_required: boolean
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          definition_id: string
          display_order?: number
          family_id?: string | null
          id?: string
          is_required?: boolean
        }
        Update: {
          category_id?: string | null
          created_at?: string
          definition_id?: string
          display_order?: number
          family_id?: string | null
          id?: string
          is_required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "specification_scopes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specification_scopes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "public_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specification_scopes_definition_id_fkey"
            columns: ["definition_id"]
            isOneToOne: false
            referencedRelation: "specification_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specification_scopes_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specification_scopes_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specification_scopes_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
        ]
      }
      units: {
        Row: {
          code: string
          created_at: string
          id: string
          label: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          label: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_article_references: {
        Row: {
          article_id: string | null
          label: string | null
          note: string | null
          sort_order: number | null
          url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_references_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "content_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_references_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      public_article_relations: {
        Row: {
          article_id: string | null
          category_name: string | null
          category_slug: string | null
          family_name: string | null
          family_slug: string | null
          family_summary: string | null
          sort_order: number | null
          variation_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_article_families_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "content_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_article_families_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      public_article_slugs: {
        Row: {
          current_slug: string | null
          old_slug: string | null
        }
        Relationships: []
      }
      public_articles: {
        Row: {
          author_name: string | null
          author_role: string | null
          blocks: Json | null
          category_name: string | null
          category_slug: string | null
          cover_alt: string | null
          cover_url: string | null
          excerpt: string | null
          id: string | null
          noindex: boolean | null
          published_at: string | null
          reading_minutes: number | null
          revised_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          subtitle: string | null
          title: string | null
        }
        Relationships: []
      }
      public_categories: {
        Row: {
          description: string | null
          family_count: number | null
          id: string | null
          name: string | null
          product_count: number | null
          slug: string | null
          sort_order: number | null
        }
        Insert: {
          description?: string | null
          family_count?: never
          id?: string | null
          name?: string | null
          product_count?: never
          slug?: string | null
          sort_order?: number | null
        }
        Update: {
          description?: string | null
          family_count?: never
          id?: string | null
          name?: string | null
          product_count?: never
          slug?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      public_content_categories: {
        Row: {
          article_count: number | null
          description: string | null
          name: string | null
          slug: string | null
          sort_order: number | null
        }
        Insert: {
          article_count?: never
          description?: string | null
          name?: string | null
          slug?: string | null
          sort_order?: number | null
        }
        Update: {
          article_count?: never
          description?: string | null
          name?: string | null
          slug?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      public_documents: {
        Row: {
          byte_size: number | null
          document_date: string | null
          document_type: string | null
          family_id: string | null
          id: string | null
          language: string | null
          mime_type: string | null
          product_id: string | null
          slug: string | null
          sort_order: number | null
          title: string | null
          url: string | null
          version: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_documents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_documents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_documents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "product_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      public_families: {
        Row: {
          application_slugs: string[] | null
          applications: string[] | null
          category_name: string | null
          category_slug: string | null
          id: string | null
          primary_application: string | null
          public_description: string | null
          public_name: string | null
          segment_slugs: string[] | null
          segments: string[] | null
          slug: string | null
          sort_order: number | null
          summary: string | null
          variation_count: number | null
        }
        Relationships: []
      }
      public_media: {
        Row: {
          alt_text: string | null
          family_id: string | null
          height: number | null
          id: string | null
          product_id: string | null
          role: string | null
          sort_order: number | null
          url: string | null
          width: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_products"
            referencedColumns: ["id"]
          },
        ]
      }
      public_products: {
        Row: {
          capacity: string | null
          category_name: string | null
          category_slug: string | null
          family_id: string | null
          family_name: string | null
          family_slug: string | null
          id: string | null
          is_on_request: boolean | null
          measure: string | null
          public_description: string | null
          public_name: string | null
          public_sku: string | null
          slug: string | null
          sort_order: number | null
          unit: string | null
          variation_label: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "public_search_index"
            referencedColumns: ["family_id"]
          },
        ]
      }
      public_search_index: {
        Row: {
          application_slugs: string[] | null
          applications: string[] | null
          category_name: string | null
          category_slug: string | null
          family_id: string | null
          family_slug: string | null
          name_norm: string | null
          public_name: string | null
          segment_slugs: string[] | null
          segments: string[] | null
          skus: string[] | null
          sort_order: number | null
          summary: string | null
          tsv: unknown
          variation_count: number | null
        }
        Relationships: []
      }
      public_specifications: {
        Row: {
          code: string | null
          display_order: number | null
          family_id: string | null
          label: string | null
          product_id: string | null
          unit: string | null
          value: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      audit_release_cohort: {
        Args: { p_cohort?: string }
        Returns: {
          entity: string
          entity_id: string
          issue: string
        }[]
      }
      avz_norm_code: { Args: { t: string }; Returns: string }
      avz_norm_text: { Args: { t: string }; Returns: string }
      avz_unaccent: { Args: { t: string }; Returns: string }
      can_publish_content: { Args: { _user_id: string }; Returns: boolean }
      can_read_catalog: { Args: { _user_id: string }; Returns: boolean }
      can_read_content: { Args: { _user_id: string }; Returns: boolean }
      can_read_internal: { Args: { _user_id: string }; Returns: boolean }
      can_read_quotations: { Args: { _user_id: string }; Returns: boolean }
      can_write_content: { Args: { _user_id: string }; Returns: boolean }
      claim_outbox_messages: {
        Args: {
          p_lease_seconds?: number
          p_limit?: number
          p_worker_id: string
        }
        Returns: {
          attempts: number
          claim_token: string
          dedupe_key: string
          id: string
          max_attempts: number
          message_type: string
          quotation_id: string
        }[]
      }
      complete_outbox_message: {
        Args: {
          p_attempts: number
          p_claim_token: string
          p_id: string
          p_last_error?: string
          p_next_attempt_at?: string
          p_status: string
        }
        Returns: boolean
      }
      generate_quotation_protocol: { Args: never; Returns: string }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      public_autocomplete: {
        Args: { p_limit?: number; q: string }
        Returns: {
          family_slug: string
          kind: string
          label: string
          sku: string
          sublabel: string
        }[]
      }
      refresh_public_search_index: { Args: never; Returns: undefined }
      release_expired_outbox_leases: { Args: never; Returns: number }
      schema_readiness: { Args: never; Returns: Json }
      search_public_catalog: {
        Args: {
          p_application?: string
          p_category?: string
          p_family?: string
          p_limit?: number
          p_offset?: number
          p_segment?: string
          p_sort?: string
          q?: string
        }
        Returns: {
          applications: string[]
          category_name: string
          category_slug: string
          family_id: string
          family_slug: string
          matched_sku: string
          public_name: string
          rank: number
          segments: string[]
          skus: string[]
          summary: string
          total_count: number
          variation_count: number
        }[]
      }
      submit_quotation: { Args: { p: Json }; Returns: Json }
    }
    Enums: {
      app_role:
        | "ADMINISTRADOR"
        | "GESTOR_DE_CATALOGO"
        | "EDITOR"
        | "AUTOR"
        | "REVISOR_TECNICO"
        | "COMERCIAL"
        | "AUDITOR"
      code_type: "PUBLIC_SKU" | "ORIGINAL" | "LEGACY" | "ALIAS" | "INTERNAL"
      content_channel: "INSTAGRAM" | "LINKEDIN"
      content_status:
        | "DRAFT"
        | "IN_TECHNICAL_REVIEW"
        | "IN_EDITORIAL_REVIEW"
        | "CHANGES_REQUESTED"
        | "READY_TO_PUBLISH"
        | "PUBLISHED"
        | "UNPUBLISHED"
        | "ARCHIVED"
        | "SCHEDULED"
      image_status:
        | "APROVADA"
        | "APROVADA_PARA_FAMILIA"
        | "PENDENTE_MARCA_VISIVEL"
        | "PENDENTE_BAIXA_QUALIDADE"
        | "PENDENTE_IMAGEM_INCORRETA"
        | "PENDENTE_DIREITO_DE_USO"
        | "SEM_IMAGEM"
        | "NAO_PUBLICAR"
        | "PENDENTE_IDENTIFICACAO"
      import_job_status:
        | "UPLOADED"
        | "VALIDATING"
        | "DRY_RUN_COMPLETE"
        | "FAILED"
        | "EXECUTING"
        | "EXECUTED"
        | "ROLLED_BACK"
      outbox_status:
        | "PENDING"
        | "SENT"
        | "FAILED"
        | "DEAD_LETTER"
        | "SIMULATED"
        | "PROCESSING"
        | "RETRY_SCHEDULED"
        | "DELIVERED"
        | "CANCELLED"
      publication_status:
        | "NOT_PUBLISHED"
        | "PUBLISHED"
        | "UNPUBLISHED"
        | "ARCHIVED"
      quotation_event_type:
        | "CREATED"
        | "STATUS_CHANGE"
        | "ASSIGNMENT"
        | "NOTE"
        | "NOTIFICATION"
      quotation_status:
        | "RECEIVED"
        | "IN_REVIEW"
        | "WAITING_INFORMATION"
        | "IN_SERVICE"
        | "RESPONDED"
        | "CONVERTED"
        | "CLOSED"
        | "SPAM"
        | "CANCELLED"
      review_status:
        | "DRAFT"
        | "UNDER_REVIEW"
        | "BLOCKED_BY_CODE"
        | "BLOCKED_BY_IDENTITY"
        | "BLOCKED_BY_BRAND"
        | "BLOCKED_BY_RIGHTS"
        | "READY_TO_PUBLISH"
      rights_status:
        | "OWNED"
        | "AUTHORIZED_BY_SUPPLIER"
        | "LICENSED"
        | "RIGHTS_UNCONFIRMED"
        | "RESTRICTED"
        | "EXPIRED"
        | "DO_NOT_PUBLISH"
      social_variant_status: "DRAFT" | "READY" | "EXPORTED"
      spec_value_type:
        | "TEXT"
        | "NUMBER"
        | "DECIMAL"
        | "MEASURE"
        | "CAPACITY"
        | "ENUM_SINGLE"
        | "ENUM_MULTI"
        | "BOOLEAN"
        | "REFERENCE"
      staging_status:
        | "PENDING_REVIEW"
        | "MISSING_IDENTITY"
        | "CODE_CONFLICT"
        | "NAME_REVIEW"
        | "BRAND_REVIEW"
        | "IMAGE_REVIEW"
        | "RIGHTS_REVIEW"
        | "TAXONOMY_REVIEW"
        | "DUPLICATE_SUSPECTED"
        | "REJECTED"
        | "READY_FOR_CANONICALIZATION"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "ADMINISTRADOR",
        "GESTOR_DE_CATALOGO",
        "EDITOR",
        "AUTOR",
        "REVISOR_TECNICO",
        "COMERCIAL",
        "AUDITOR",
      ],
      code_type: ["PUBLIC_SKU", "ORIGINAL", "LEGACY", "ALIAS", "INTERNAL"],
      content_channel: ["INSTAGRAM", "LINKEDIN"],
      content_status: [
        "DRAFT",
        "IN_TECHNICAL_REVIEW",
        "IN_EDITORIAL_REVIEW",
        "CHANGES_REQUESTED",
        "READY_TO_PUBLISH",
        "PUBLISHED",
        "UNPUBLISHED",
        "ARCHIVED",
        "SCHEDULED",
      ],
      image_status: [
        "APROVADA",
        "APROVADA_PARA_FAMILIA",
        "PENDENTE_MARCA_VISIVEL",
        "PENDENTE_BAIXA_QUALIDADE",
        "PENDENTE_IMAGEM_INCORRETA",
        "PENDENTE_DIREITO_DE_USO",
        "SEM_IMAGEM",
        "NAO_PUBLICAR",
        "PENDENTE_IDENTIFICACAO",
      ],
      import_job_status: [
        "UPLOADED",
        "VALIDATING",
        "DRY_RUN_COMPLETE",
        "FAILED",
        "EXECUTING",
        "EXECUTED",
        "ROLLED_BACK",
      ],
      outbox_status: [
        "PENDING",
        "SENT",
        "FAILED",
        "DEAD_LETTER",
        "SIMULATED",
        "PROCESSING",
        "RETRY_SCHEDULED",
        "DELIVERED",
        "CANCELLED",
      ],
      publication_status: [
        "NOT_PUBLISHED",
        "PUBLISHED",
        "UNPUBLISHED",
        "ARCHIVED",
      ],
      quotation_event_type: [
        "CREATED",
        "STATUS_CHANGE",
        "ASSIGNMENT",
        "NOTE",
        "NOTIFICATION",
      ],
      quotation_status: [
        "RECEIVED",
        "IN_REVIEW",
        "WAITING_INFORMATION",
        "IN_SERVICE",
        "RESPONDED",
        "CONVERTED",
        "CLOSED",
        "SPAM",
        "CANCELLED",
      ],
      review_status: [
        "DRAFT",
        "UNDER_REVIEW",
        "BLOCKED_BY_CODE",
        "BLOCKED_BY_IDENTITY",
        "BLOCKED_BY_BRAND",
        "BLOCKED_BY_RIGHTS",
        "READY_TO_PUBLISH",
      ],
      rights_status: [
        "OWNED",
        "AUTHORIZED_BY_SUPPLIER",
        "LICENSED",
        "RIGHTS_UNCONFIRMED",
        "RESTRICTED",
        "EXPIRED",
        "DO_NOT_PUBLISH",
      ],
      social_variant_status: ["DRAFT", "READY", "EXPORTED"],
      spec_value_type: [
        "TEXT",
        "NUMBER",
        "DECIMAL",
        "MEASURE",
        "CAPACITY",
        "ENUM_SINGLE",
        "ENUM_MULTI",
        "BOOLEAN",
        "REFERENCE",
      ],
      staging_status: [
        "PENDING_REVIEW",
        "MISSING_IDENTITY",
        "CODE_CONFLICT",
        "NAME_REVIEW",
        "BRAND_REVIEW",
        "IMAGE_REVIEW",
        "RIGHTS_REVIEW",
        "TAXONOMY_REVIEW",
        "DUPLICATE_SUSPECTED",
        "REJECTED",
        "READY_FOR_CANONICALIZATION",
      ],
    },
  },
} as const
