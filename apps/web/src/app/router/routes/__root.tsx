import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { ThemeProvider, BaseStyles, Text } from "@primer/react";
import { useState, useEffect } from "react";
import { AuthFlow } from "@/features/auth/components/Auth";
import { Landing } from "@/features/landing/components/Landing";
import { User } from "@/features/auth/types";
import { authService } from "@/features/auth/services/auth.service";
import { AuthContext, AuthContextType } from "@/features/auth/hooks/use-auth";
import { ToastProvider } from "@/shared/hooks/use-toast";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "M2A - Meeting to Architecture" },
      { name: "description", content: "Transform meeting transcripts into architecture diagrams automatically." },
      { property: "og:title", content: "M2A - Meeting to Architecture" },
      { property: "og:description", content: "Transform meeting transcripts into architecture diagrams automatically." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  const onLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowAuth(false);
  };

  const authValue = {
    user,
    onLogout,
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Auth initialization failed", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  if (loading) {
    return (
      <ThemeProvider colorMode="auto">
        <BaseStyles>
          <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <Text sx={{ color: 'fg.muted' }}>Loading session...</Text>
          </div>
        </BaseStyles>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider colorMode="auto">
      <BaseStyles>
        <div lang="en">
          {!user ? (
            showAuth ? (
              <AuthFlow onAuthenticated={(u) => setUser(u)} />
            ) : (
              <Landing onGetStarted={() => setShowAuth(true)} />
            )
          ) : (
            <AuthContext.Provider value={authValue}>
              <ToastProvider>
                <QueryClientProvider client={queryClient}>
                  <Outlet />
                </QueryClientProvider>
              </ToastProvider>
            </AuthContext.Provider>
          )}
        </div>
      </BaseStyles>
    </ThemeProvider>
  );
}

