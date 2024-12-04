import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthForm } from './AuthForm';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuthStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        useAuthStore.setState({
          user: session?.user ?? null,
          session,
          loading: false,
        });
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      useAuthStore.setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AuthForm />
      </div>
    );
  }

  return <>{children}</>;
}