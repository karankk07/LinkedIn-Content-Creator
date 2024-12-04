import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tgcunpfeshxyepqhshgp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY3VucGZlc2h4eWVwcWhzaGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyMDUxNTUsImV4cCI6MjA0Nzc4MTE1NX0.4AwARaYpXe1QgiAG1pNMmORh51Jps_Qr1QjZ6cHtPuE';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface UserStyle {
  user_id: string;
  style_profile: string;
  metrics: {
    engagement: number;
    consistency: number;
    readability: number;
    impact: number;
    vocabulary_complexity: number;
    sentence_variety: number;
    hook_strength: number;
    cta_effectiveness: number;
  };
  writing_style: {
    tone: string;
    structure: string;
    vocabulary: string;
    techniques: string[];
    common_phrases: string[];
    paragraph_patterns: string[];
    hook_patterns: string[];
    cta_patterns: string[];
  };
  analyzed_posts: string[];
  updated_at: string;
}

export interface GeneratedContent {
  id: string;
  user_id: string;
  content: string;
  topic: string;
  tone: string;
  length: string;
  context?: string;
  created_at: string;
}

export async function getUserStyle(userId: string): Promise<UserStyle | null> {
  const { data, error } = await supabase
    .from('user_styles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user style:', error);
    return null;
  }

  return data;
}

export async function updateUserStyle(style: Partial<UserStyle>): Promise<void> {
  const { error } = await supabase
    .from('user_styles')
    .upsert({
      ...style,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error updating user style:', error);
    throw error;
  }
}

export async function saveGeneratedContent(content: Omit<GeneratedContent, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('generated_content')
    .insert(content);

  if (error) {
    console.error('Error saving generated content:', error);
    throw error;
  }
}

export async function getGeneratedContent(userId: string): Promise<GeneratedContent[]> {
  const { data, error } = await supabase
    .from('generated_content')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching generated content:', error);
    return [];
  }

  return data;
}