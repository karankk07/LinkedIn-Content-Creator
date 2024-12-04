import { create } from 'zustand';
import { model } from '@/lib/gemini';
import { toast } from '@/hooks/use-toast';
import { getUserStyle, updateUserStyle, saveGeneratedContent, UserStyle } from '@/lib/supabase';
import { useAuthStore } from './useAuthStore';

interface ContentState {
  styleProfile: string | null;
  styleMetrics: UserStyle['metrics'] | null;
  writingStyle: UserStyle['writing_style'] | null;
  generatedContent: string;
  loading: boolean;
  analyzeStyle: (posts: string[]) => Promise<void>;
  generateContent: (topic: string, tone: string, length: string, context?: string) => Promise<void>;
  loadUserStyle: () => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  styleProfile: null,
  styleMetrics: null,
  writingStyle: null,
  generatedContent: '',
  loading: false,

  loadUserStyle: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    try {
      const userStyle = await getUserStyle(userId);
      if (userStyle) {
        set({
          styleProfile: userStyle.style_profile,
          styleMetrics: userStyle.metrics,
          writingStyle: userStyle.writing_style,
        });
      }
    } catch (error) {
      console.error('Failed to load user style:', error);
    }
  },

  analyzeStyle: async (posts: string[]) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to analyze your writing style.',
        variant: 'destructive',
      });
      return;
    }

    set({ loading: true });
    try {
      const prompt = `Analyze these LinkedIn posts and provide a detailed analysis in the following JSON format:
      {
        "style_profile": "Detailed writing style analysis in paragraph form",
        "metrics": {
          "engagement": number (0-100),
          "consistency": number (0-100),
          "readability": number (0-100),
          "impact": number (0-100),
          "vocabulary_complexity": number (0-100),
          "sentence_variety": number (0-100),
          "hook_strength": number (0-100),
          "cta_effectiveness": number (0-100)
        },
        "writing_style": {
          "tone": "Primary tone (professional, conversational, etc.)",
          "structure": "Detailed description of typical post structure",
          "vocabulary": "Detailed analysis of vocabulary style and level",
          "techniques": ["Array of key writing techniques used"],
          "common_phrases": ["Frequently used phrases or expressions"],
          "paragraph_patterns": ["Common paragraph structures"],
          "hook_patterns": ["Types of hooks used to start posts"],
          "cta_patterns": ["Types of calls-to-action used"]
        }
      }

      Analyze these posts in detail, focusing on:
      1. Writing style consistency
      2. Vocabulary patterns and complexity
      3. Sentence structure variety
      4. Hook and introduction patterns
      5. Call-to-action patterns
      6. Engagement techniques
      7. Overall tone and voice

      Posts to analyze:
      ${posts.join('\n\n')}`;

      console.log('Sending prompt to Gemini:', prompt);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Received response from Gemini:', text);
      
      try {
        const data = JSON.parse(text);
        
        // Validate the response structure
        if (!data.style_profile || !data.metrics || !data.writing_style) {
          throw new Error('Invalid response structure from AI');
        }

        // Validate metrics
        const requiredMetrics = [
          'engagement', 'consistency', 'readability', 'impact',
          'vocabulary_complexity', 'sentence_variety', 'hook_strength',
          'cta_effectiveness'
        ];
        for (const metric of requiredMetrics) {
          if (typeof data.metrics[metric] !== 'number' || 
              data.metrics[metric] < 0 || 
              data.metrics[metric] > 100) {
            throw new Error(`Invalid metric value for ${metric}`);
          }
        }

        // Validate writing style
        const requiredStyleProps = [
          'tone', 'structure', 'vocabulary', 'techniques',
          'common_phrases', 'paragraph_patterns', 'hook_patterns',
          'cta_patterns'
        ];
        for (const prop of requiredStyleProps) {
          if (!data.writing_style[prop]) {
            throw new Error(`Missing writing style property: ${prop}`);
          }
        }
        
        // Update local state
        set({ 
          styleProfile: data.style_profile,
          styleMetrics: data.metrics,
          writingStyle: data.writing_style,
          loading: false 
        });

        // Save to Supabase
        await updateUserStyle({
          user_id: userId,
          style_profile: data.style_profile,
          metrics: data.metrics,
          writing_style: data.writing_style,
          analyzed_posts: posts,
        });
        
        toast({
          title: 'Analysis Complete',
          description: 'Your writing style has been analyzed and saved successfully.',
        });
      } catch (error: any) {
        console.error('Failed to parse AI response:', error);
        toast({
          title: 'Analysis Error',
          description: `Failed to process the analysis results: ${error?.message || 'Unknown error'}`,
          variant: 'destructive',
        });
        set({ loading: false });
      }
    } catch (error: any) {
      console.error('Style analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: `Failed to analyze posts: ${error?.message || 'Unknown error'}`,
        variant: 'destructive',
      });
      set({ loading: false });
    }
  },

  generateContent: async (topic: string, tone: string, length: string, context?: string) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to generate content.',
        variant: 'destructive',
      });
      return;
    }

    set({ loading: true });
    try {
      const { writingStyle } = get();
      let prompt = '';

      if (writingStyle) {
        prompt = `Generate a LinkedIn post that precisely matches this writing style profile:
        
        Tone: ${writingStyle.tone}
        Structure: ${writingStyle.structure}
        Vocabulary Style: ${writingStyle.vocabulary}
        Writing Techniques: ${writingStyle.techniques.join(', ')}
        
        Common Patterns to Follow:
        - Hooks: ${writingStyle.hook_patterns.join(', ')}
        - Paragraph Structure: ${writingStyle.paragraph_patterns.join(', ')}
        - Common Phrases: ${writingStyle.common_phrases.join(', ')}
        - Call-to-Action Styles: ${writingStyle.cta_patterns.join(', ')}

        Topic: ${topic}
        Preferred Tone Adjustment: ${tone}
        Length: ${length}
        ${context ? `Additional Context: ${context}` : ''}

        Important:
        1. Start with one of the user's typical hook patterns
        2. Maintain the user's sentence structure variety
        3. Use their common phrases naturally
        4. Follow their paragraph organization
        5. End with their typical CTA style
        6. Keep the overall voice consistent while incorporating the requested tone adjustment`;
      } else {
        prompt = `Generate a LinkedIn post with the following specifications:
        Topic: ${topic}
        Tone: ${tone}
        Length: ${length}
        ${context ? `Additional Context: ${context}` : ''}
        
        Make it engaging, professional, and optimized for LinkedIn's format.`;
      }

      console.log('Sending prompt to Gemini:', prompt);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedContent = response.text();
      console.log('Received response from Gemini:', generatedContent);
      
      set({ generatedContent, loading: false });
      
      // Save to Supabase
      await saveGeneratedContent({
        user_id: userId,
        content: generatedContent,
        topic,
        tone,
        length,
        context,
      });
      
      toast({
        title: 'Content Generated',
        description: writingStyle 
          ? 'Content generated matching your writing style.'
          : 'Content generated with standard optimization.',
      });
    } catch (error: any) {
      console.error('Content generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: `Failed to generate content: ${error?.message || 'Unknown error'}`,
        variant: 'destructive',
      });
      set({ loading: false });
    }
  },
}));