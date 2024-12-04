import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  MessageCircle, 
  Timer, 
  Zap,
  BookOpen,
  Type,
  Sparkles,
  Target
} from 'lucide-react';
import { UserStyle } from '@/lib/supabase';

interface StyleMetric {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

interface StyleMetricsProps {
  metrics: UserStyle['metrics'];
}

export function StyleMetrics({ metrics }: StyleMetricsProps) {
  const styleMetrics: StyleMetric[] = [
    {
      label: 'Engagement Score',
      value: metrics.engagement,
      icon: <MessageCircle className="h-4 w-4" />,
      description: 'Measures potential audience interaction and reach'
    },
    {
      label: 'Consistency',
      value: metrics.consistency,
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Evaluates voice and style consistency across posts'
    },
    {
      label: 'Readability',
      value: metrics.readability,
      icon: <Timer className="h-4 w-4" />,
      description: 'Assesses clarity and ease of understanding'
    },
    {
      label: 'Impact Score',
      value: metrics.impact,
      icon: <Zap className="h-4 w-4" />,
      description: 'Measures potential influence and memorability'
    },
    {
      label: 'Vocabulary Complexity',
      value: metrics.vocabulary_complexity,
      icon: <BookOpen className="h-4 w-4" />,
      description: 'Analyzes the sophistication of word choice'
    },
    {
      label: 'Sentence Variety',
      value: metrics.sentence_variety,
      icon: <Type className="h-4 w-4" />,
      description: 'Evaluates diversity in sentence structure'
    },
    {
      label: 'Hook Strength',
      value: metrics.hook_strength,
      icon: <Sparkles className="h-4 w-4" />,
      description: 'Rates the effectiveness of post introductions'
    },
    {
      label: 'CTA Effectiveness',
      value: metrics.cta_effectiveness,
      icon: <Target className="h-4 w-4" />,
      description: 'Measures call-to-action impact'
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {styleMetrics.map((metric) => (
        <Card key={metric.label} className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress 
                value={metric.value} 
                className="h-2"
                indicatorClassName={`${
                  metric.value >= 80 ? 'bg-green-500' :
                  metric.value >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
              />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{metric.description}</span>
                <span className="font-medium">{metric.value}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}