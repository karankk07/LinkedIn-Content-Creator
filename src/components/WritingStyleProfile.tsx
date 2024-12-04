import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserStyle } from '@/lib/supabase';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface WritingStyleProfileProps {
  writingStyle: UserStyle['writing_style'];
  styleProfile: string;
}

export function WritingStyleProfile({ writingStyle, styleProfile }: WritingStyleProfileProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Writing Style Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{styleProfile}</p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="tone">
          <AccordionTrigger>Tone and Voice</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Primary Tone</p>
              <p className="text-sm text-muted-foreground">{writingStyle.tone}</p>
              <p className="text-sm font-medium mt-4">Vocabulary Style</p>
              <p className="text-sm text-muted-foreground">{writingStyle.vocabulary}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="structure">
          <AccordionTrigger>Content Structure</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Post Structure</p>
              <p className="text-sm text-muted-foreground">{writingStyle.structure}</p>
              <p className="text-sm font-medium mt-4">Paragraph Patterns</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {writingStyle.paragraph_patterns.map((pattern, index) => (
                  <Badge key={index} variant="outline">{pattern}</Badge>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="techniques">
          <AccordionTrigger>Writing Techniques</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Key Techniques</p>
              <div className="flex flex-wrap gap-2">
                {writingStyle.techniques.map((technique, index) => (
                  <Badge key={index} variant="secondary">{technique}</Badge>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hooks">
          <AccordionTrigger>Hook Patterns</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {writingStyle.hook_patterns.map((pattern, index) => (
                <Badge key={index} variant="outline">{pattern}</Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cta">
          <AccordionTrigger>Call-to-Action Styles</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {writingStyle.cta_patterns.map((pattern, index) => (
                <Badge key={index} variant="outline">{pattern}</Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="phrases">
          <AccordionTrigger>Common Phrases</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {writingStyle.common_phrases.map((phrase, index) => (
                <Badge key={index} variant="secondary">{phrase}</Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 