// ============================================================================
// Типи для бази даних Supabase (згенеровано частково на основі supabase.sql)
//
// В ідеалі, цей файл має бути згенеровано автоматично за допомогою
// Supabase CLI для повної відповідності та типізації:
// supabase gen types typescript --project-id <your-project-id> > src/shared/lib/supabase/database.types.ts
//
// Поки що, ми визначаємо основні типи вручну для забезпечення типізації
// в репозиторіях.
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          slug: string
          title: string
          xp_reward: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          slug: string
          title: string
          xp_reward?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          slug?: string
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      course_reviews: {
        Row: {
          comment: string | null
          course_id: string
          created_at: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          course_id: string
          created_at?: string
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          course_id?: string
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      course_translations: {
        Row: {
          course_id: string
          description: string | null
          id: string
          language_code: string
          title: string
          what_you_will_learn: string[] | null
        }
        Insert: {
          course_id: string
          description?: string | null
          id?: string
          language_code: string
          title: string
          what_you_will_learn?: string[] | null
        }
        Update: {
          course_id?: string
          description?: string | null
          id?: string
          language_code?: string
          title?: string
          what_you_will_learn?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "course_translations_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_translations_language_code_fkey"
            columns: ["language_code"]
            referencedRelation: "languages"
            referencedColumns: ["code"]
          }
        ]
      }
      courses: {
        Row: {
          author_id: string | null
          avg_rating: number
          category: Database["public"]["Enums"]["course_category"] | null
          created_at: string
          estimated_time: number
          id: string
          lessons_count: number
          level: Database["public"]["Enums"]["course_level"] | null
          reviews_count: number
          slug: string
          status: Database["public"]["Enums"]["course_status"]
          tags: string[] | null
          thumbnail_url: string | null
          total_xp: number
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          avg_rating?: number
          category?: Database["public"]["Enums"]["course_category"] | null
          created_at?: string
          estimated_time?: number
          id?: string
          lessons_count?: number
          level?: Database["public"]["Enums"]["course_level"] | null
          reviews_count?: number
          slug: string
          status?: Database["public"]["Enums"]["course_status"]
          tags?: string[] | null
          thumbnail_url?: string | null
          total_xp?: number
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          avg_rating?: number
          category?: Database["public"]["Enums"]["course_category"] | null
          created_at?: string
          estimated_time?: number
          id?: string
          lessons_count?: number
          level?: Database["public"]["Enums"]["course_level"] | null
          reviews_count?: number
          slug?: string
          status?: Database["public"]["Enums"]["course_status"]
          tags?: string[] | null
          thumbnail_url?: string | null
          total_xp?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      favorite_courses: {
        Row: {
          course_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_courses_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorite_courses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      languages: {
        Row: {
          code: string
          name: string
        }
        Insert: {
          code: string
          name: string
        }
        Update: {
          code?: string
          name?: string
        }
        Relationships: []
      }
      lesson_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          lesson_id: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lesson_id: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lesson_id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_comments_lesson_id_fkey"
            columns: ["lesson_id"]
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_comments_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "lesson_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      lesson_translations: {
        Row: {
          content: Json | null
          id: string
          language_code: string
          lesson_id: string
          title: string
        }
        Insert: {
          content?: Json | null
          id?: string
          language_code: string
          lesson_id: string
          title: string
        }
        Update: {
          content?: Json | null
          id?: string
          language_code?: string
          lesson_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_translations_language_code_fkey"
            columns: ["language_code"]
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "lesson_translations_lesson_id_fkey"
            columns: ["lesson_id"]
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          }
        ]
      }
      lessons: {
        Row: {
          comments_count: number
          course_id: string
          created_at: string
          estimated_time: number
          id: string
          module_id: string
          order_index: number
          published: boolean
          slug: string
          type: Database["public"]["Enums"]["lesson_type"]
          updated_at: string
          xp_reward: number
        }
        Insert: {
          comments_count?: number
          course_id: string
          created_at?: string
          estimated_time?: number
          id?: string
          module_id: string
          order_index?: number
          published?: boolean
          slug: string
          type?: Database["public"]["Enums"]["lesson_type"]
          updated_at?: string
          xp_reward?: number
        }
        Update: {
          comments_count?: number
          course_id?: string
          created_at?: string
          estimated_time?: number
          id?: string
          module_id?: string
          order_index?: number
          published?: boolean
          slug?: string
          type?: Database["public"]["Enums"]["lesson_type"]
          updated_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            referencedRelation: "modules"
            referencedColumns: ["id"]
          }
        ]
      }
      module_translations: {
        Row: {
          description: string | null
          id: string
          language_code: string
          module_id: string
          title: string
        }
        Insert: {
          description?: string | null
          id?: string
          language_code: string
          module_id: string
          title: string
        }
        Update: {
          description?: string | null
          id?: string
          language_code?: string
          module_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_translations_language_code_fkey"
            columns: ["language_code"]
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "module_translations_module_id_fkey"
            columns: ["module_id"]
            referencedRelation: "modules"
            referencedColumns: ["id"]
          }
        ]
      }
      modules: {
        Row: {
          course_id: string
          id: string
          order_index: number
        }
        Insert: {
          course_id: string
          id?: string
          order_index?: number
        }
        Update: {
          course_id?: string
          id?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          total_xp: number
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          total_xp?: number
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          total_xp?: number
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_course_progress: {
        Row: {
          completed_lessons_count: number
          course_id: string
          started_at: string
          total_xp_earned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_lessons_count?: number
          course_id: string
          started_at?: string
          total_xp_earned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_lessons_count?: number
          course_id?: string
          started_at?: string
          total_xp_earned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_progress_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_lesson_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          lesson_id: string
          quiz_answers: Json | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          lesson_id: string
          quiz_answers?: Json | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          lesson_id?: string
          quiz_answers?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_courses_with_details: {
        Args: {
          language_filter: string
        }
        Returns: {
          id: string
          slug: string
          title: string
          description: string
          status: Database["public"]["Enums"]["course_status"]
          level: Database["public"]["Enums"]["course_level"]
          category: Database["public"]["Enums"]["course_category"]
          thumbnail_url: string
          estimated_time: number
          total_xp: number
          lessons_count: number
          reviews_count: number
          avg_rating: number
          tags: string[]
          author_name: string
          author_avatar: string
        }[]
      }
    }
    Enums: {
      course_category:
        | "qa"
        | "ai"
        | "fullstack"
        | "frontend"
        | "backend"
        | "gamedev"
        | "devops"
      course_level: "junior" | "middle" | "senior"
      course_status: "draft" | "in_review" | "published" | "archived"
      lesson_type: "video" | "text" | "quiz" | "practice"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
