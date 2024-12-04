import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useContentStore } from '@/store/useContentStore';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  topic: z.string().min(2, 'Topic must be at least 2 characters'),
  tone: z.string(),
  length: z.string(),
  context: z.string().optional(),
});

export function ContentGenerator() {
  const { generateContent, generatedContent, loading, writingStyle } = useContentStore();
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      tone: writingStyle?.tone.toLowerCase() || 'professional',
      length: 'medium',
      context: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await generateContent(values.topic, values.tone, values.length, values.context);
    setShowPreview(true);
  }

  return (
    <div className="space-y-6">
      {!writingStyle && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No writing style analysis found. Your content will be generated with standard optimization.
            Consider analyzing your existing posts first to maintain consistency.
          </AlertDescription>
        </Alert>
      )}

      {writingStyle && (
        <div className="rounded-lg border p-4 space-y-4">
          <h3 className="font-semibold">Your Writing Style</h3>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Tone: {writingStyle.tone}</Badge>
              {writingStyle.techniques.map((technique, index) => (
                <Badge key={index} variant="secondary">{technique}</Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Structure: {writingStyle.structure}
            </p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your topic..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone Adjustment</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="thought-leadership">
                        Thought Leadership
                      </SelectItem>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {writingStyle ? "Adjust the tone while maintaining your style" : "Select the desired tone"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="short">Short (~100 words)</SelectItem>
                      <SelectItem value="medium">Medium (~200 words)</SelectItem>
                      <SelectItem value="long">Long (~300 words)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="context"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Context (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any specific details or context..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Content {writingStyle && "Using Your Style"}
          </Button>
        </form>
      </Form>

      {showPreview && generatedContent && (
        <div className="rounded-lg border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Generated Content</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(generatedContent);
                toast({
                  title: "Copied!",
                  description: "Content copied to clipboard",
                });
              }}
            >
              Copy
            </Button>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {generatedContent.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}