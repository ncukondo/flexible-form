export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number;
          checksum: string;
          finished_at: string | null;
          id: string;
          logs: string | null;
          migration_name: string;
          rolled_back_at: string | null;
          started_at: string;
        };
        Insert: {
          applied_steps_count?: number;
          checksum: string;
          finished_at?: string | null;
          id: string;
          logs?: string | null;
          migration_name: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Update: {
          applied_steps_count?: number;
          checksum?: string;
          finished_at?: string | null;
          id?: string;
          logs?: string | null;
          migration_name?: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Relationships: [];
      };
      FormDefinition: {
        Row: {
          authorId: number | null;
          content: Json;
          createdAt: string;
          id: string;
          id_for_edit: string;
          id_for_extend: string;
          id_for_view: string;
          title: string;
          updatedAt: string;
        };
        Insert: {
          authorId?: number | null;
          content: Json;
          createdAt?: string;
          id?: string;
          id_for_edit?: string;
          id_for_extend?: string;
          id_for_view?: string;
          title: string;
          updatedAt: string;
        };
        Update: {
          authorId?: number | null;
          content?: Json;
          createdAt?: string;
          id?: string;
          id_for_edit?: string;
          id_for_extend?: string;
          id_for_view?: string;
          title?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "FormDefinition_authorId_fkey";
            columns: ["authorId"];
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      User: {
        Row: {
          email: string;
          id: number;
          name: string | null;
        };
        Insert: {
          email: string;
          id?: number;
          name?: string | null;
        };
        Update: {
          email?: string;
          id?: number;
          name?: string | null;
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
