export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      applications: {
        Row: {
          code: string;
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action: string;
          actor_email_masked: string | null;
          actor_id: string | null;
          changed_fields: string[] | null;
          context: Json | null;
          entity: string;
          entity_id: string | null;
          id: string;
          new_values: Json | null;
          occurred_at: string;
          origin: string | null;
          previous_values: Json | null;
          result: string;
        };
        Insert: {
          action: string;
          actor_email_masked?: string | null;
          actor_id?: string | null;
          changed_fields?: string[] | null;
          context?: Json | null;
          entity: string;
          entity_id?: string | null;
          id?: string;
          new_values?: Json | null;
          occurred_at?: string;
          origin?: string | null;
          previous_values?: Json | null;
          result?: string;
        };
        Update: {
          action?: string;
          actor_email_masked?: string | null;
          actor_id?: string | null;
          changed_fields?: string[] | null;
          context?: Json | null;
          entity?: string;
          entity_id?: string | null;
          id?: string;
          new_values?: Json | null;
          occurred_at?: string;
          origin?: string | null;
          previous_values?: Json | null;
          result?: string;
        };
        Relationships: [];
      };
      code_conflicts: {
        Row: {
          candidate_names: Json;
          canonical_product_id: string | null;
          code: string;
          created_at: string;
          decided_at: string | null;
          decided_by: string | null;
          decision: string | null;
          id: string;
          impact: string | null;
          sources: Json;
          status: string;
          updated_at: string;
        };
        Insert: {
          candidate_names?: Json;
          canonical_product_id?: string | null;
          code: string;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          decision?: string | null;
          id?: string;
          impact?: string | null;
          sources?: Json;
          status?: string;
          updated_at?: string;
        };
        Update: {
          candidate_names?: Json;
          canonical_product_id?: string | null;
          code?: string;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          decision?: string | null;
          id?: string;
          impact?: string | null;
          sources?: Json;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "code_conflicts_canonical_product_id_fkey";
            columns: ["canonical_product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      documents: {
        Row: {
          bucket: string;
          byte_size: number | null;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          document_date: string | null;
          document_type: string;
          id: string;
          is_historical_reference: boolean;
          is_indexable: boolean;
          language: string;
          mime_type: string | null;
          notes: string | null;
          publication_right: boolean;
          slug: string | null;
          status: string;
          storage_path: string;
          title: string;
          updated_at: string;
          version: string | null;
        };
        Insert: {
          bucket?: string;
          byte_size?: number | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          document_date?: string | null;
          document_type?: string;
          id?: string;
          is_historical_reference?: boolean;
          is_indexable?: boolean;
          language?: string;
          mime_type?: string | null;
          notes?: string | null;
          publication_right?: boolean;
          slug?: string | null;
          status?: string;
          storage_path: string;
          title: string;
          updated_at?: string;
          version?: string | null;
        };
        Update: {
          bucket?: string;
          byte_size?: number | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          document_date?: string | null;
          document_type?: string;
          id?: string;
          is_historical_reference?: boolean;
          is_indexable?: boolean;
          language?: string;
          mime_type?: string | null;
          notes?: string | null;
          publication_right?: boolean;
          slug?: string | null;
          status?: string;
          storage_path?: string;
          title?: string;
          updated_at?: string;
          version?: string | null;
        };
        Relationships: [];
      };
      family_applications: {
        Row: {
          application_id: string;
          created_at: string;
          family_id: string;
          id: string;
          is_primary: boolean;
        };
        Insert: {
          application_id: string;
          created_at?: string;
          family_id: string;
          id?: string;
          is_primary?: boolean;
        };
        Update: {
          application_id?: string;
          created_at?: string;
          family_id?: string;
          id?: string;
          is_primary?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "family_applications_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "family_applications_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
        ];
      };
      family_segments: {
        Row: {
          created_at: string;
          family_id: string;
          id: string;
          is_primary: boolean;
          segment_id: string;
        };
        Insert: {
          created_at?: string;
          family_id: string;
          id?: string;
          is_primary?: boolean;
          segment_id: string;
        };
        Update: {
          created_at?: string;
          family_id?: string;
          id?: string;
          is_primary?: boolean;
          segment_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "family_segments_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "family_segments_segment_id_fkey";
            columns: ["segment_id"];
            isOneToOne: false;
            referencedRelation: "segments";
            referencedColumns: ["id"];
          },
        ];
      };
      family_solutions: {
        Row: {
          created_at: string;
          family_id: string;
          id: string;
          solution_id: string;
        };
        Insert: {
          created_at?: string;
          family_id: string;
          id?: string;
          solution_id: string;
        };
        Update: {
          created_at?: string;
          family_id?: string;
          id?: string;
          solution_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "family_solutions_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "family_solutions_solution_id_fkey";
            columns: ["solution_id"];
            isOneToOne: false;
            referencedRelation: "solutions";
            referencedColumns: ["id"];
          },
        ];
      };
      family_specifications: {
        Row: {
          created_at: string;
          definition_id: string;
          family_id: string;
          id: string;
          source: string | null;
          unit_id: string | null;
          updated_at: string;
          value_bool: boolean | null;
          value_enum: string[] | null;
          value_max: number | null;
          value_min: number | null;
          value_num: number | null;
          value_text: string | null;
        };
        Insert: {
          created_at?: string;
          definition_id: string;
          family_id: string;
          id?: string;
          source?: string | null;
          unit_id?: string | null;
          updated_at?: string;
          value_bool?: boolean | null;
          value_enum?: string[] | null;
          value_max?: number | null;
          value_min?: number | null;
          value_num?: number | null;
          value_text?: string | null;
        };
        Update: {
          created_at?: string;
          definition_id?: string;
          family_id?: string;
          id?: string;
          source?: string | null;
          unit_id?: string | null;
          updated_at?: string;
          value_bool?: boolean | null;
          value_enum?: string[] | null;
          value_max?: number | null;
          value_min?: number | null;
          value_num?: number | null;
          value_text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "family_specifications_definition_id_fkey";
            columns: ["definition_id"];
            isOneToOne: false;
            referencedRelation: "specification_definitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "family_specifications_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "family_specifications_unit_id_fkey";
            columns: ["unit_id"];
            isOneToOne: false;
            referencedRelation: "units";
            referencedColumns: ["id"];
          },
        ];
      };
      image_review_events: {
        Row: {
          actor_id: string | null;
          created_at: string;
          from_status: Database["public"]["Enums"]["image_status"] | null;
          id: string;
          media_asset_id: string;
          reason: string | null;
          to_status: Database["public"]["Enums"]["image_status"];
        };
        Insert: {
          actor_id?: string | null;
          created_at?: string;
          from_status?: Database["public"]["Enums"]["image_status"] | null;
          id?: string;
          media_asset_id: string;
          reason?: string | null;
          to_status: Database["public"]["Enums"]["image_status"];
        };
        Update: {
          actor_id?: string | null;
          created_at?: string;
          from_status?: Database["public"]["Enums"]["image_status"] | null;
          id?: string;
          media_asset_id?: string;
          reason?: string | null;
          to_status?: Database["public"]["Enums"]["image_status"];
        };
        Relationships: [
          {
            foreignKeyName: "image_review_events_media_asset_id_fkey";
            columns: ["media_asset_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      import_errors: {
        Row: {
          column_name: string | null;
          created_at: string;
          error_code: string;
          id: string;
          import_job_id: string;
          message: string;
          row_number: number | null;
          severity: string;
        };
        Insert: {
          column_name?: string | null;
          created_at?: string;
          error_code: string;
          id?: string;
          import_job_id: string;
          message: string;
          row_number?: number | null;
          severity?: string;
        };
        Update: {
          column_name?: string | null;
          created_at?: string;
          error_code?: string;
          id?: string;
          import_job_id?: string;
          message?: string;
          row_number?: number | null;
          severity?: string;
        };
        Relationships: [
          {
            foreignKeyName: "import_errors_import_job_id_fkey";
            columns: ["import_job_id"];
            isOneToOne: false;
            referencedRelation: "import_jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      import_job_rows: {
        Row: {
          created_at: string;
          entity: string;
          entity_id: string | null;
          id: string;
          import_job_id: string;
          messages: Json;
          new_values: Json | null;
          outcome: string;
          previous_values: Json | null;
          row_number: number;
          source_reference: string | null;
        };
        Insert: {
          created_at?: string;
          entity: string;
          entity_id?: string | null;
          id?: string;
          import_job_id: string;
          messages?: Json;
          new_values?: Json | null;
          outcome: string;
          previous_values?: Json | null;
          row_number: number;
          source_reference?: string | null;
        };
        Update: {
          created_at?: string;
          entity?: string;
          entity_id?: string | null;
          id?: string;
          import_job_id?: string;
          messages?: Json;
          new_values?: Json | null;
          outcome?: string;
          previous_values?: Json | null;
          row_number?: number;
          source_reference?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "import_job_rows_import_job_id_fkey";
            columns: ["import_job_id"];
            isOneToOne: false;
            referencedRelation: "import_jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      import_jobs: {
        Row: {
          blocked_rows: number;
          confirmed_at: string | null;
          conflict_rows: number;
          created_at: string;
          dry_run_job_id: string | null;
          entity: string;
          file_hash: string;
          filename: string;
          id: string;
          invalid_rows: number;
          mode: string;
          new_rows: number;
          operator_id: string | null;
          rollback_of: string | null;
          rolled_back_at: string | null;
          schema_version: string;
          status: Database["public"]["Enums"]["import_job_status"];
          summary: Json;
          target_layer: string;
          total_rows: number;
          unchanged_rows: number;
          updated_at: string;
          updated_rows: number;
          valid_rows: number;
        };
        Insert: {
          blocked_rows?: number;
          confirmed_at?: string | null;
          conflict_rows?: number;
          created_at?: string;
          dry_run_job_id?: string | null;
          entity: string;
          file_hash: string;
          filename: string;
          id?: string;
          invalid_rows?: number;
          mode?: string;
          new_rows?: number;
          operator_id?: string | null;
          rollback_of?: string | null;
          rolled_back_at?: string | null;
          schema_version: string;
          status?: Database["public"]["Enums"]["import_job_status"];
          summary?: Json;
          target_layer?: string;
          total_rows?: number;
          unchanged_rows?: number;
          updated_at?: string;
          updated_rows?: number;
          valid_rows?: number;
        };
        Update: {
          blocked_rows?: number;
          confirmed_at?: string | null;
          conflict_rows?: number;
          created_at?: string;
          dry_run_job_id?: string | null;
          entity?: string;
          file_hash?: string;
          filename?: string;
          id?: string;
          invalid_rows?: number;
          mode?: string;
          new_rows?: number;
          operator_id?: string | null;
          rollback_of?: string | null;
          rolled_back_at?: string | null;
          schema_version?: string;
          status?: Database["public"]["Enums"]["import_job_status"];
          summary?: Json;
          target_layer?: string;
          total_rows?: number;
          unchanged_rows?: number;
          updated_at?: string;
          updated_rows?: number;
          valid_rows?: number;
        };
        Relationships: [
          {
            foreignKeyName: "import_jobs_dry_run_job_id_fkey";
            columns: ["dry_run_job_id"];
            isOneToOne: false;
            referencedRelation: "import_jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "import_jobs_rollback_of_fkey";
            columns: ["rollback_of"];
            isOneToOne: false;
            referencedRelation: "import_jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      media_assets: {
        Row: {
          alt_text: string | null;
          authorization_type: string | null;
          bucket: string;
          byte_size: number | null;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          detected_brand: string | null;
          height: number | null;
          id: string;
          in_quarantine: boolean;
          internal_title: string | null;
          mime_type: string;
          notes: string | null;
          original_filename: string | null;
          owner_name: string | null;
          private_path: string;
          public_path: string | null;
          review_reason: string | null;
          review_status: Database["public"]["Enums"]["image_status"];
          rights_date: string | null;
          rights_document_path: string | null;
          rights_responsible: string | null;
          rights_restrictions: string | null;
          rights_status: Database["public"]["Enums"]["rights_status"];
          rights_valid_until: string | null;
          sha256: string | null;
          source: string | null;
          updated_at: string;
          width: number | null;
        };
        Insert: {
          alt_text?: string | null;
          authorization_type?: string | null;
          bucket?: string;
          byte_size?: number | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          detected_brand?: string | null;
          height?: number | null;
          id?: string;
          in_quarantine?: boolean;
          internal_title?: string | null;
          mime_type: string;
          notes?: string | null;
          original_filename?: string | null;
          owner_name?: string | null;
          private_path: string;
          public_path?: string | null;
          review_reason?: string | null;
          review_status?: Database["public"]["Enums"]["image_status"];
          rights_date?: string | null;
          rights_document_path?: string | null;
          rights_responsible?: string | null;
          rights_restrictions?: string | null;
          rights_status?: Database["public"]["Enums"]["rights_status"];
          rights_valid_until?: string | null;
          sha256?: string | null;
          source?: string | null;
          updated_at?: string;
          width?: number | null;
        };
        Update: {
          alt_text?: string | null;
          authorization_type?: string | null;
          bucket?: string;
          byte_size?: number | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          detected_brand?: string | null;
          height?: number | null;
          id?: string;
          in_quarantine?: boolean;
          internal_title?: string | null;
          mime_type?: string;
          notes?: string | null;
          original_filename?: string | null;
          owner_name?: string | null;
          private_path?: string;
          public_path?: string | null;
          review_reason?: string | null;
          review_status?: Database["public"]["Enums"]["image_status"];
          rights_date?: string | null;
          rights_document_path?: string | null;
          rights_responsible?: string | null;
          rights_restrictions?: string | null;
          rights_status?: Database["public"]["Enums"]["rights_status"];
          rights_valid_until?: string | null;
          sha256?: string | null;
          source?: string | null;
          updated_at?: string;
          width?: number | null;
        };
        Relationships: [];
      };
      normalization_task_events: {
        Row: {
          actor_id: string | null;
          comment: string | null;
          created_at: string;
          event_type: string;
          id: string;
          payload: Json | null;
          task_id: string;
        };
        Insert: {
          actor_id?: string | null;
          comment?: string | null;
          created_at?: string;
          event_type: string;
          id?: string;
          payload?: Json | null;
          task_id: string;
        };
        Update: {
          actor_id?: string | null;
          comment?: string | null;
          created_at?: string;
          event_type?: string;
          id?: string;
          payload?: Json | null;
          task_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "normalization_task_events_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "normalization_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      normalization_tasks: {
        Row: {
          assignee_id: string | null;
          code_conflict_id: string | null;
          created_at: string;
          decision: string | null;
          description: string | null;
          evidence: Json;
          family_id: string | null;
          id: string;
          media_asset_id: string | null;
          origin: string | null;
          prefix: string | null;
          priority: string;
          product_id: string | null;
          reason: Database["public"]["Enums"]["staging_status"];
          source_record_id: string | null;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          assignee_id?: string | null;
          code_conflict_id?: string | null;
          created_at?: string;
          decision?: string | null;
          description?: string | null;
          evidence?: Json;
          family_id?: string | null;
          id?: string;
          media_asset_id?: string | null;
          origin?: string | null;
          prefix?: string | null;
          priority?: string;
          product_id?: string | null;
          reason: Database["public"]["Enums"]["staging_status"];
          source_record_id?: string | null;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          assignee_id?: string | null;
          code_conflict_id?: string | null;
          created_at?: string;
          decision?: string | null;
          description?: string | null;
          evidence?: Json;
          family_id?: string | null;
          id?: string;
          media_asset_id?: string | null;
          origin?: string | null;
          prefix?: string | null;
          priority?: string;
          product_id?: string | null;
          reason?: Database["public"]["Enums"]["staging_status"];
          source_record_id?: string | null;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "normalization_tasks_code_conflict_id_fkey";
            columns: ["code_conflict_id"];
            isOneToOne: false;
            referencedRelation: "code_conflicts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "normalization_tasks_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "normalization_tasks_media_asset_id_fkey";
            columns: ["media_asset_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "normalization_tasks_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "normalization_tasks_source_record_id_fkey";
            columns: ["source_record_id"];
            isOneToOne: false;
            referencedRelation: "source_records";
            referencedColumns: ["id"];
          },
        ];
      };
      placeholder_usage: {
        Row: {
          created_at: string;
          family_id: string | null;
          id: string;
          pending_since: string;
          priority: string;
          product_id: string | null;
          reason: string;
        };
        Insert: {
          created_at?: string;
          family_id?: string | null;
          id?: string;
          pending_since?: string;
          priority?: string;
          product_id?: string | null;
          reason: string;
        };
        Update: {
          created_at?: string;
          family_id?: string | null;
          id?: string;
          pending_since?: string;
          priority?: string;
          product_id?: string | null;
          reason?: string;
        };
        Relationships: [
          {
            foreignKeyName: "placeholder_usage_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "placeholder_usage_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_applications: {
        Row: {
          application_id: string;
          created_at: string;
          id: string;
          is_exception: boolean;
          is_primary: boolean;
          justification: string | null;
          product_id: string;
        };
        Insert: {
          application_id: string;
          created_at?: string;
          id?: string;
          is_exception?: boolean;
          is_primary?: boolean;
          justification?: string | null;
          product_id: string;
        };
        Update: {
          application_id?: string;
          created_at?: string;
          id?: string;
          is_exception?: boolean;
          is_primary?: boolean;
          justification?: string | null;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_applications_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_applications_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_categories: {
        Row: {
          code: string;
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_codes: {
        Row: {
          code: string;
          code_type: Database["public"]["Enums"]["code_type"];
          created_at: string;
          id: string;
          is_public: boolean;
          is_valid: boolean;
          notes: string | null;
          product_id: string;
          source: string | null;
        };
        Insert: {
          code: string;
          code_type: Database["public"]["Enums"]["code_type"];
          created_at?: string;
          id?: string;
          is_public?: boolean;
          is_valid?: boolean;
          notes?: string | null;
          product_id: string;
          source?: string | null;
        };
        Update: {
          code?: string;
          code_type?: Database["public"]["Enums"]["code_type"];
          created_at?: string;
          id?: string;
          is_public?: boolean;
          is_valid?: boolean;
          notes?: string | null;
          product_id?: string;
          source?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_codes_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_documents: {
        Row: {
          created_at: string;
          document_id: string;
          family_id: string | null;
          id: string;
          product_id: string | null;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          document_id: string;
          family_id?: string | null;
          id?: string;
          product_id?: string | null;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          document_id?: string;
          family_id?: string | null;
          id?: string;
          product_id?: string | null;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_documents_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_documents_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_documents_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_families: {
        Row: {
          admin_name: string;
          category_id: string | null;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          id: string;
          internal_notes: string | null;
          public_description: string | null;
          public_name: string;
          publication_status: Database["public"]["Enums"]["publication_status"];
          reference_code: string | null;
          review_status: Database["public"]["Enums"]["review_status"];
          slug: string;
          sort_order: number;
          source: string | null;
          subcategory_id: string | null;
          summary: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          admin_name?: string;
          category_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          id?: string;
          internal_notes?: string | null;
          public_description?: string | null;
          public_name: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          reference_code?: string | null;
          review_status?: Database["public"]["Enums"]["review_status"];
          slug: string;
          sort_order?: number;
          source?: string | null;
          subcategory_id?: string | null;
          summary?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          admin_name?: string;
          category_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          id?: string;
          internal_notes?: string | null;
          public_description?: string | null;
          public_name?: string;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          reference_code?: string | null;
          review_status?: Database["public"]["Enums"]["review_status"];
          slug?: string;
          sort_order?: number;
          source?: string | null;
          subcategory_id?: string | null;
          summary?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_families_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "product_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_families_subcategory_id_fkey";
            columns: ["subcategory_id"];
            isOneToOne: false;
            referencedRelation: "product_subcategories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          created_at: string;
          family_id: string | null;
          id: string;
          media_asset_id: string;
          product_id: string | null;
          role: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          family_id?: string | null;
          id?: string;
          media_asset_id: string;
          product_id?: string | null;
          role?: string;
          sort_order?: number;
        };
        Update: {
          created_at?: string;
          family_id?: string | null;
          id?: string;
          media_asset_id?: string;
          product_id?: string | null;
          role?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_images_media_asset_id_fkey";
            columns: ["media_asset_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_segments: {
        Row: {
          created_at: string;
          id: string;
          is_exception: boolean;
          is_primary: boolean;
          justification: string | null;
          product_id: string;
          segment_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_exception?: boolean;
          is_primary?: boolean;
          justification?: string | null;
          product_id: string;
          segment_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_exception?: boolean;
          is_primary?: boolean;
          justification?: string | null;
          product_id?: string;
          segment_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_segments_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_segments_segment_id_fkey";
            columns: ["segment_id"];
            isOneToOne: false;
            referencedRelation: "segments";
            referencedColumns: ["id"];
          },
        ];
      };
      product_specifications: {
        Row: {
          created_at: string;
          definition_id: string;
          id: string;
          is_override: boolean;
          product_id: string;
          source: string | null;
          unit_id: string | null;
          updated_at: string;
          value_bool: boolean | null;
          value_enum: string[] | null;
          value_max: number | null;
          value_min: number | null;
          value_num: number | null;
          value_text: string | null;
        };
        Insert: {
          created_at?: string;
          definition_id: string;
          id?: string;
          is_override?: boolean;
          product_id: string;
          source?: string | null;
          unit_id?: string | null;
          updated_at?: string;
          value_bool?: boolean | null;
          value_enum?: string[] | null;
          value_max?: number | null;
          value_min?: number | null;
          value_num?: number | null;
          value_text?: string | null;
        };
        Update: {
          created_at?: string;
          definition_id?: string;
          id?: string;
          is_override?: boolean;
          product_id?: string;
          source?: string | null;
          unit_id?: string | null;
          updated_at?: string;
          value_bool?: boolean | null;
          value_enum?: string[] | null;
          value_max?: number | null;
          value_min?: number | null;
          value_num?: number | null;
          value_text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_specifications_definition_id_fkey";
            columns: ["definition_id"];
            isOneToOne: false;
            referencedRelation: "specification_definitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_specifications_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_specifications_unit_id_fkey";
            columns: ["unit_id"];
            isOneToOne: false;
            referencedRelation: "units";
            referencedColumns: ["id"];
          },
        ];
      };
      product_subcategories: {
        Row: {
          category_id: string;
          code: string;
          created_at: string;
          deleted_at: string | null;
          id: string;
          is_active: boolean;
          is_public: boolean;
          name: string;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          category_id: string;
          code: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          is_active?: boolean;
          is_public?: boolean;
          name: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          code?: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          is_active?: boolean;
          is_public?: boolean;
          name?: string;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_subcategories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "product_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          capacity: string | null;
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          family_id: string | null;
          id: string;
          internal_brand: string | null;
          internal_manufacturer: string | null;
          internal_notes: string | null;
          internal_original_name: string | null;
          internal_supplier_reference: string | null;
          is_on_request: boolean;
          measure: string | null;
          public_description: string | null;
          public_name: string;
          public_sku: string | null;
          publication_status: Database["public"]["Enums"]["publication_status"];
          review_status: Database["public"]["Enums"]["review_status"];
          slug: string | null;
          sort_order: number;
          source: string | null;
          unit: string | null;
          updated_at: string;
          updated_by: string | null;
          variation_label: string | null;
        };
        Insert: {
          capacity?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          family_id?: string | null;
          id?: string;
          internal_brand?: string | null;
          internal_manufacturer?: string | null;
          internal_notes?: string | null;
          internal_original_name?: string | null;
          internal_supplier_reference?: string | null;
          is_on_request?: boolean;
          measure?: string | null;
          public_description?: string | null;
          public_name: string;
          public_sku?: string | null;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          review_status?: Database["public"]["Enums"]["review_status"];
          slug?: string | null;
          sort_order?: number;
          source?: string | null;
          unit?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          variation_label?: string | null;
        };
        Update: {
          capacity?: string | null;
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          family_id?: string | null;
          id?: string;
          internal_brand?: string | null;
          internal_manufacturer?: string | null;
          internal_notes?: string | null;
          internal_original_name?: string | null;
          internal_supplier_reference?: string | null;
          is_on_request?: boolean;
          measure?: string | null;
          public_description?: string | null;
          public_name?: string;
          public_sku?: string | null;
          publication_status?: Database["public"]["Enums"]["publication_status"];
          review_status?: Database["public"]["Enums"]["review_status"];
          slug?: string | null;
          sort_order?: number;
          source?: string | null;
          unit?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          variation_label?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          is_active: boolean;
          last_login_at: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name?: string;
          id?: string;
          is_active?: boolean;
          last_login_at?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          is_active?: boolean;
          last_login_at?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      publication_history: {
        Row: {
          actor_id: string | null;
          created_at: string;
          entity: string;
          entity_id: string;
          from_status: string | null;
          id: string;
          reason: string | null;
          to_status: string;
        };
        Insert: {
          actor_id?: string | null;
          created_at?: string;
          entity: string;
          entity_id: string;
          from_status?: string | null;
          id?: string;
          reason?: string | null;
          to_status: string;
        };
        Update: {
          actor_id?: string | null;
          created_at?: string;
          entity?: string;
          entity_id?: string;
          from_status?: string | null;
          id?: string;
          reason?: string | null;
          to_status?: string;
        };
        Relationships: [];
      };
      related_products: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          justification: string | null;
          origin: string;
          relation_type: string;
          sort_order: number;
          source_family_id: string | null;
          source_product_id: string | null;
          status: string;
          target_family_id: string | null;
          target_product_id: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          justification?: string | null;
          origin?: string;
          relation_type: string;
          sort_order?: number;
          source_family_id?: string | null;
          source_product_id?: string | null;
          status?: string;
          target_family_id?: string | null;
          target_product_id?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          justification?: string | null;
          origin?: string;
          relation_type?: string;
          sort_order?: number;
          source_family_id?: string | null;
          source_product_id?: string | null;
          status?: string;
          target_family_id?: string | null;
          target_product_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "related_products_source_family_id_fkey";
            columns: ["source_family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "related_products_source_product_id_fkey";
            columns: ["source_product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "related_products_target_family_id_fkey";
            columns: ["target_family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "related_products_target_product_id_fkey";
            columns: ["target_product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      segments: {
        Row: {
          code: string;
          created_at: string;
          deleted_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      solutions: {
        Row: {
          code: string;
          created_at: string;
          deleted_at: string | null;
          id: string;
          is_active: boolean;
          name: string;
          slug: string;
          sort_order: number;
          summary: string | null;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          is_active?: boolean;
          name: string;
          slug: string;
          sort_order?: number;
          summary?: string | null;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          slug?: string;
          sort_order?: number;
          summary?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      source_record_fields: {
        Row: {
          created_at: string;
          field_name: string;
          id: string;
          is_protected: boolean;
          normalized_value: string | null;
          raw_value: string | null;
          source_record_id: string;
        };
        Insert: {
          created_at?: string;
          field_name: string;
          id?: string;
          is_protected?: boolean;
          normalized_value?: string | null;
          raw_value?: string | null;
          source_record_id: string;
        };
        Update: {
          created_at?: string;
          field_name?: string;
          id?: string;
          is_protected?: boolean;
          normalized_value?: string | null;
          raw_value?: string | null;
          source_record_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "source_record_fields_source_record_id_fkey";
            columns: ["source_record_id"];
            isOneToOne: false;
            referencedRelation: "source_records";
            referencedColumns: ["id"];
          },
        ];
      };
      source_records: {
        Row: {
          canonical_family_id: string | null;
          canonical_product_id: string | null;
          content_hash: string | null;
          created_at: string;
          id: string;
          import_job_id: string | null;
          raw_payload: Json;
          source_reference: string;
          source_system: string;
          staging_status: Database["public"]["Enums"]["staging_status"];
          updated_at: string;
        };
        Insert: {
          canonical_family_id?: string | null;
          canonical_product_id?: string | null;
          content_hash?: string | null;
          created_at?: string;
          id?: string;
          import_job_id?: string | null;
          raw_payload?: Json;
          source_reference: string;
          source_system: string;
          staging_status?: Database["public"]["Enums"]["staging_status"];
          updated_at?: string;
        };
        Update: {
          canonical_family_id?: string | null;
          canonical_product_id?: string | null;
          content_hash?: string | null;
          created_at?: string;
          id?: string;
          import_job_id?: string | null;
          raw_payload?: Json;
          source_reference?: string;
          source_system?: string;
          staging_status?: Database["public"]["Enums"]["staging_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "source_records_canonical_family_id_fkey";
            columns: ["canonical_family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "source_records_canonical_product_id_fkey";
            columns: ["canonical_product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "source_records_import_job_fk";
            columns: ["import_job_id"];
            isOneToOne: false;
            referencedRelation: "import_jobs";
            referencedColumns: ["id"];
          },
        ];
      };
      specification_definitions: {
        Row: {
          code: string;
          created_at: string;
          display_order: number;
          enum_values: string[] | null;
          help_text: string | null;
          id: string;
          is_active: boolean;
          is_filterable: boolean;
          is_public: boolean;
          is_required: boolean;
          label: string;
          synonyms: string[] | null;
          unit_id: string | null;
          updated_at: string;
          value_type: Database["public"]["Enums"]["spec_value_type"];
        };
        Insert: {
          code: string;
          created_at?: string;
          display_order?: number;
          enum_values?: string[] | null;
          help_text?: string | null;
          id?: string;
          is_active?: boolean;
          is_filterable?: boolean;
          is_public?: boolean;
          is_required?: boolean;
          label: string;
          synonyms?: string[] | null;
          unit_id?: string | null;
          updated_at?: string;
          value_type: Database["public"]["Enums"]["spec_value_type"];
        };
        Update: {
          code?: string;
          created_at?: string;
          display_order?: number;
          enum_values?: string[] | null;
          help_text?: string | null;
          id?: string;
          is_active?: boolean;
          is_filterable?: boolean;
          is_public?: boolean;
          is_required?: boolean;
          label?: string;
          synonyms?: string[] | null;
          unit_id?: string | null;
          updated_at?: string;
          value_type?: Database["public"]["Enums"]["spec_value_type"];
        };
        Relationships: [
          {
            foreignKeyName: "specification_definitions_unit_id_fkey";
            columns: ["unit_id"];
            isOneToOne: false;
            referencedRelation: "units";
            referencedColumns: ["id"];
          },
        ];
      };
      specification_scopes: {
        Row: {
          category_id: string | null;
          created_at: string;
          definition_id: string;
          display_order: number;
          family_id: string | null;
          id: string;
          is_required: boolean;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string;
          definition_id: string;
          display_order?: number;
          family_id?: string | null;
          id?: string;
          is_required?: boolean;
        };
        Update: {
          category_id?: string | null;
          created_at?: string;
          definition_id?: string;
          display_order?: number;
          family_id?: string | null;
          id?: string;
          is_required?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "specification_scopes_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "product_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "specification_scopes_definition_id_fkey";
            columns: ["definition_id"];
            isOneToOne: false;
            referencedRelation: "specification_definitions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "specification_scopes_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "product_families";
            referencedColumns: ["id"];
          },
        ];
      };
      units: {
        Row: {
          code: string;
          created_at: string;
          id: string;
          label: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: string;
          label: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          label?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          granted_by: string | null;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          granted_by?: string | null;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          granted_by?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_read_catalog: { Args: { _user_id: string }; Returns: boolean };
      can_read_internal: { Args: { _user_id: string }; Returns: boolean };
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][];
          _user_id: string;
        };
        Returns: boolean;
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role:
        | "ADMINISTRADOR"
        | "GESTOR_DE_CATALOGO"
        | "EDITOR"
        | "AUTOR"
        | "REVISOR_TECNICO"
        | "COMERCIAL"
        | "AUDITOR";
      code_type: "PUBLIC_SKU" | "ORIGINAL" | "LEGACY" | "ALIAS" | "INTERNAL";
      image_status:
        | "APROVADA"
        | "APROVADA_PARA_FAMILIA"
        | "PENDENTE_MARCA_VISIVEL"
        | "PENDENTE_BAIXA_QUALIDADE"
        | "PENDENTE_IMAGEM_INCORRETA"
        | "PENDENTE_DIREITO_DE_USO"
        | "SEM_IMAGEM"
        | "NAO_PUBLICAR"
        | "PENDENTE_IDENTIFICACAO";
      import_job_status:
        | "UPLOADED"
        | "VALIDATING"
        | "DRY_RUN_COMPLETE"
        | "FAILED"
        | "EXECUTING"
        | "EXECUTED"
        | "ROLLED_BACK";
      publication_status: "NOT_PUBLISHED" | "PUBLISHED" | "UNPUBLISHED" | "ARCHIVED";
      review_status:
        | "DRAFT"
        | "UNDER_REVIEW"
        | "BLOCKED_BY_CODE"
        | "BLOCKED_BY_IDENTITY"
        | "BLOCKED_BY_BRAND"
        | "BLOCKED_BY_RIGHTS"
        | "READY_TO_PUBLISH";
      rights_status:
        | "OWNED"
        | "AUTHORIZED_BY_SUPPLIER"
        | "LICENSED"
        | "RIGHTS_UNCONFIRMED"
        | "RESTRICTED"
        | "EXPIRED"
        | "DO_NOT_PUBLISH";
      spec_value_type:
        | "TEXT"
        | "NUMBER"
        | "DECIMAL"
        | "MEASURE"
        | "CAPACITY"
        | "ENUM_SINGLE"
        | "ENUM_MULTI"
        | "BOOLEAN"
        | "REFERENCE";
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
        | "READY_FOR_CANONICALIZATION";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

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
      publication_status: ["NOT_PUBLISHED", "PUBLISHED", "UNPUBLISHED", "ARCHIVED"],
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
} as const;
