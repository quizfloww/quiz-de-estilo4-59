export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      funnel_responses: {
        Row: {
          answers: Json | null;
          completed_at: string | null;
          funnel_id: string | null;
          id: string;
          participant_email: string | null;
          participant_name: string | null;
          results: Json | null;
          started_at: string | null;
        };
        Insert: {
          answers?: Json | null;
          completed_at?: string | null;
          funnel_id?: string | null;
          id?: string;
          participant_email?: string | null;
          participant_name?: string | null;
          results?: Json | null;
          started_at?: string | null;
        };
        Update: {
          answers?: Json | null;
          completed_at?: string | null;
          funnel_id?: string | null;
          id?: string;
          participant_email?: string | null;
          participant_name?: string | null;
          results?: Json | null;
          started_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "funnel_responses_funnel_id_fkey";
            columns: ["funnel_id"];
            isOneToOne: false;
            referencedRelation: "funnels";
            referencedColumns: ["id"];
          }
        ];
      };
      funnel_stages: {
        Row: {
          config: Json | null;
          created_at: string | null;
          funnel_id: string;
          id: string;
          is_enabled: boolean | null;
          order_index: number;
          title: string;
          type: string;
          type_category: string | null;
        };
        Insert: {
          config?: Json | null;
          created_at?: string | null;
          funnel_id: string;
          id?: string;
          is_enabled?: boolean | null;
          order_index: number;
          title: string;
          type: string;
          type_category?: string | null;
        };
        Update: {
          config?: Json | null;
          created_at?: string | null;
          funnel_id?: string;
          id?: string;
          is_enabled?: boolean | null;
          order_index?: number;
          title?: string;
          type?: string;
          type_category?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "funnel_stages_funnel_id_fkey";
            columns: ["funnel_id"];
            isOneToOne: false;
            referencedRelation: "funnels";
            referencedColumns: ["id"];
          }
        ];
      };
      funnels: {
        Row: {
          cover_image: string | null;
          created_at: string | null;
          description: string | null;
          global_config: Json | null;
          id: string;
          name: string;
          slug: string;
          status: Database["public"]["Enums"]["funnel_status"] | null;
          style_categories: Json | null;
          updated_at: string | null;
        };
        Insert: {
          cover_image?: string | null;
          created_at?: string | null;
          description?: string | null;
          global_config?: Json | null;
          id?: string;
          name: string;
          slug: string;
          status?: Database["public"]["Enums"]["funnel_status"] | null;
          style_categories?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          cover_image?: string | null;
          created_at?: string | null;
          description?: string | null;
          global_config?: Json | null;
          id?: string;
          name?: string;
          slug?: string;
          status?: Database["public"]["Enums"]["funnel_status"] | null;
          style_categories?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      participant_answers: {
        Row: {
          created_at: string | null;
          id: string;
          option_id: string | null;
          participant_id: string | null;
          points: number | null;
          question_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          option_id?: string | null;
          participant_id?: string | null;
          points?: number | null;
          question_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          option_id?: string | null;
          participant_id?: string | null;
          points?: number | null;
          question_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "participant_answers_participant_id_fkey";
            columns: ["participant_id"];
            isOneToOne: false;
            referencedRelation: "quiz_participants";
            referencedColumns: ["id"];
          }
        ];
      };
      quiz_participants: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          name: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          name?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      quiz_questions: {
        Row: {
          created_at: string | null;
          id: string;
          question_order: number;
          question_text: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          question_order: number;
          question_text: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          question_order?: number;
          question_text?: string;
        };
        Relationships: [];
      };
      stage_options: {
        Row: {
          id: string;
          image_url: string | null;
          order_index: number;
          points: number | null;
          stage_id: string;
          style_category: string | null;
          text: string;
        };
        Insert: {
          id?: string;
          image_url?: string | null;
          order_index: number;
          points?: number | null;
          stage_id: string;
          style_category?: string | null;
          text: string;
        };
        Update: {
          id?: string;
          image_url?: string | null;
          order_index?: number;
          points?: number | null;
          stage_id?: string;
          style_category?: string | null;
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stage_options_stage_id_fkey";
            columns: ["stage_id"];
            isOneToOne: false;
            referencedRelation: "funnel_stages";
            referencedColumns: ["id"];
          }
        ];
      };
      style_results: {
        Row: {
          created_at: string | null;
          id: string;
          is_primary: boolean | null;
          participant_id: string | null;
          percentage: number | null;
          points: number | null;
          rank: number | null;
          style_type_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_primary?: boolean | null;
          participant_id?: string | null;
          percentage?: number | null;
          points?: number | null;
          rank?: number | null;
          style_type_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_primary?: boolean | null;
          participant_id?: string | null;
          percentage?: number | null;
          points?: number | null;
          rank?: number | null;
          style_type_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "style_results_participant_id_fkey";
            columns: ["participant_id"];
            isOneToOne: false;
            referencedRelation: "quiz_participants";
            referencedColumns: ["id"];
          }
        ];
      };
      utm_analytics: {
        Row: {
          created_at: string | null;
          id: string;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      funnel_status: "draft" | "published" | "archived";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
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
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
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
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
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
      funnel_status: ["draft", "published", "archived"],
      stage_type: ["intro", "question", "strategic", "transition", "result"],
    },
  },
} as const;
