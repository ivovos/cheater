/**
 * Supabase Database Types
 * Generated from database schema
 */

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
      homework: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          subject: string | null;
          image_url: string;
          ocr_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          subject?: string | null;
          image_url: string;
          ocr_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          subject?: string | null;
          image_url?: string;
          ocr_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz: {
        Row: {
          id: string;
          homework_id: string;
          questions: Json;
          topic: string | null;
          subtopic: string | null;
          classification_confidence: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          homework_id: string;
          questions: Json;
          topic?: string | null;
          subtopic?: string | null;
          classification_confidence?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          homework_id?: string;
          questions?: Json;
          topic?: string | null;
          subtopic?: string | null;
          classification_confidence?: number | null;
          created_at?: string;
        };
      };
      progress: {
        Row: {
          id: string;
          homework_id: string;
          completion_percentage: number;
          best_score: number | null;
          total_attempts: number;
          last_played_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          homework_id: string;
          completion_percentage?: number;
          best_score?: number | null;
          total_attempts?: number;
          last_played_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          homework_id?: string;
          completion_percentage?: number;
          best_score?: number | null;
          total_attempts?: number;
          last_played_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_attempts: {
        Row: {
          id: string;
          quiz_id: string;
          score: number;
          total_questions: number;
          time_taken_seconds: number | null;
          answers: Json;
          completed_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          score: number;
          total_questions?: number;
          time_taken_seconds?: number | null;
          answers: Json;
          completed_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          score?: number;
          total_questions?: number;
          time_taken_seconds?: number | null;
          answers?: Json;
          completed_at?: string;
        };
      };
    };
    Functions: {
      update_homework_progress: {
        Args: {
          p_homework_id: string;
          p_score: number;
          p_total_questions: number;
        };
        Returns: void;
      };
    };
  };
}
