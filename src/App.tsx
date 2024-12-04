import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useAuthStore';
import { useContentStore } from '@/store/useContentStore';
import { useEffect, useState } from 'react';
import { LogOut, Pen, Sparkles } from 'lucide-react';
import { StyleMetrics } from '@/components/StyleMetrics';
import { WritingStyleProfile } from '@/components/WritingStyleProfile';
import { ContentGenerator } from '@/components/ContentGenerator';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  const [posts, setPosts] = useState<string[]>([]);
  const [currentPost, setCurrentPost] = useState('');
  const { analyzeStyle, styleProfile, styleMetrics, writingStyle, loading, loadUserStyle } = useContentStore();
  const { signOut, user } = useAuthStore();

  useEffect(() => {
    loadUserStyle();
  }, [loadUserStyle]);

  const handleAddPost = () => {
    if (currentPost.trim()) {
      setPosts([...posts, currentPost.trim()]);
      setCurrentPost('');
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <AuthGuard>
          <header className="border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Pen className="h-6 w-6" />
                <h1 className="text-xl font-bold">LinkedIn Content Creator AI</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Tabs defaultValue="analyze" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analyze">Style Analysis</TabsTrigger>
                <TabsTrigger value="generate">Generate Content</TabsTrigger>
              </TabsList>

              <TabsContent value="analyze" className="space-y-6">
                {styleMetrics && <StyleMetrics metrics={styleMetrics} />}
                
                <div className="grid gap-4">
                  <Textarea
                    placeholder="Paste your LinkedIn post here..."
                    value={currentPost}
                    onChange={(e) => setCurrentPost(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setPosts([])} disabled={posts.length === 0}>
                      Clear All
                    </Button>
                    <Button onClick={handleAddPost}>Add Post</Button>
                  </div>
                  {posts.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Added Posts ({posts.length})</h3>
                      {posts.map((post, index) => (
                        <div key={index} className="group relative rounded-lg border p-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() => setPosts(posts.filter((_, i) => i !== index))}
                          >
                            ×
                          </Button>
                          {post}
                        </div>
                      ))}
                      <Button
                        onClick={() => analyzeStyle(posts)}
                        disabled={loading}
                        className="w-full"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Writing Style
                      </Button>
                    </div>
                  )}
                  {styleProfile && writingStyle && (
                    <WritingStyleProfile 
                      styleProfile={styleProfile}
                      writingStyle={writingStyle}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="generate">
                <ContentGenerator />
              </TabsContent>
            </Tabs>
          </main>
        </AuthGuard>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}