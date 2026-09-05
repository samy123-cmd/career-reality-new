import { useEffect, useRef } from "react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ClerkProvider, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';

import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import Home from '@/pages/home';
import ProPage from '@/pages/pro';
import Workspace from '@/pages/workspace';
import CareerRealityCompassPage from '@/pages/compass';
import SitemapPage from '@/pages/sitemap';
import SignInPage from '@/pages/auth/sign-in';
import SignUpPage from '@/pages/auth/sign-up';
import NotFound from '@/pages/not-found';
import { SalaryCalculatorPage, RiskAnalyzerPage, LayoffRadarPage, SalaryRealityPage, CompaniesPage, CompanyDetailPage, SalaryDropPage, EscapePlanPage, CareerRealityIndexPage, AiPulsePage } from '@/pages/public-tools';
import { TopicClustersPage, ArticlesPage, ArticleDetailPage, CategoryPage, SearchPage, TrustPage } from '@/pages/public-editorial';
import { AppAuthProvider, TestAppAuthProvider, useAppAuth } from '@/lib/app-auth';
import { useTheme } from '@/lib/theme';

const isE2e = import.meta.env.VITE_E2E === "true";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey && !isE2e) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: 'hsl(164, 71%, 22%)',
    colorForeground: 'hsl(221, 29%, 18%)',
    colorMutedForeground: 'hsl(218, 13%, 47%)',
    colorDanger: 'hsl(5, 60%, 48%)',
    colorBackground: 'hsl(42, 33%, 98%)',
    colorInput: 'hsl(38, 22%, 82%)',
    colorInputForeground: 'hsl(221, 29%, 18%)',
    colorNeutral: 'hsl(38, 22%, 85%)',
    fontFamily: 'Manrope, sans-serif',
    borderRadius: '0.8rem',
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-card rounded-2xl w-[440px] max-w-full overflow-hidden",
    card: "!shadow-[0_14px_30px_hsl(var(--foreground)/.08)] !border !border-border !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "font-display text-2xl text-foreground",
    headerSubtitle: "text-muted-foreground font-data text-xs uppercase tracking-wider",
    socialButtonsBlockButtonText: "text-foreground font-semibold",
    formFieldLabel: "font-semibold text-foreground",
    footerActionLink: "text-primary font-bold hover:underline",
    footerActionText: "text-muted-foreground",
    dividerText: "text-muted-foreground",
    identityPreviewEditButton: "text-primary",
    formFieldSuccessText: "text-primary",
    alertText: "text-destructive",
    logoBox: "flex items-center justify-center",
    logoImage: "h-8 w-auto",
    socialButtonsBlockButton: "border-border hover:bg-muted transition-colors",
    formButtonPrimary: "bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity",
    formFieldInput: "bg-background border-border text-foreground",
    footerAction: "flex items-center gap-2",
    dividerLine: "bg-border",
    alert: "bg-destructive/10 text-destructive border-destructive/20",
    otpCodeFieldInput: "bg-background border-border text-foreground",
    formFieldRow: "gap-2",
    main: "w-full",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function HomeRedirect() {
  const { isSignedIn } = useAppAuth();
  return (
    isSignedIn ? <Redirect to="/compass" /> : <Home />
  );
}

function AppRoutes({ includeClerkCacheInvalidator = false }: { includeClerkCacheInvalidator?: boolean }) {

  return (
    <QueryClientProvider client={queryClient}>
      {includeClerkCacheInvalidator && <ClerkQueryClientCacheInvalidator />}
      <TooltipProvider>
        <ErrorBoundary>
          <Switch>
              <Route path="/" component={HomeRedirect} />
              <Route path="/pro" component={ProPage} />
              <Route path="/payments/pricing" component={ProPage} />
              <Route path="/workspace" component={Workspace} />
              <Route path="/sitemap" component={SitemapPage} />
              <Route path="/sitemap/" component={SitemapPage} />
              <Route path="/compass" component={CareerRealityCompassPage} />
              <Route path="/compass/" component={CareerRealityCompassPage} />
              <Route path="/salary-calculator" component={SalaryCalculatorPage} />
              <Route path="/salary-calculator/" component={SalaryCalculatorPage} />
              <Route path="/tools/ctc" component={SalaryCalculatorPage} />
              <Route path="/tools/ctc/" component={SalaryCalculatorPage} />
              <Route path="/resignation-risk" component={RiskAnalyzerPage} />
              <Route path="/resignation-risk/" component={RiskAnalyzerPage} />
              <Route path="/tools/risk" component={RiskAnalyzerPage} />
              <Route path="/tools/risk/" component={RiskAnalyzerPage} />
              <Route path="/layoff-radar" component={LayoffRadarPage} />
              <Route path="/layoff-radar/" component={LayoffRadarPage} />
              <Route path="/tools/layoffs" component={LayoffRadarPage} />
              <Route path="/tools/layoffs/" component={LayoffRadarPage} />
              <Route path="/salary-reality" component={SalaryRealityPage} />
              <Route path="/salary-reality/" component={SalaryRealityPage} />
              <Route path="/companies" component={CompaniesPage} />
              <Route path="/companies/" component={CompaniesPage} />
              <Route path="/companies/:slug" component={CompanyDetailPage} />
              <Route path="/companies/:slug/" component={CompanyDetailPage} />
              <Route path="/salary-drop" component={SalaryDropPage} />
              <Route path="/salary-drop/" component={SalaryDropPage} />
              <Route path="/escape-plan" component={EscapePlanPage} />
              <Route path="/escape-plan/" component={EscapePlanPage} />
              <Route path="/career-reality-index" component={CareerRealityIndexPage} />
              <Route path="/career-reality-index/" component={CareerRealityIndexPage} />
              <Route path="/ai" component={AiPulsePage} />
              <Route path="/ai/" component={AiPulsePage} />
              <Route path="/topic-clusters" component={TopicClustersPage} />
              <Route path="/topic-clusters/" component={TopicClustersPage} />
              <Route path="/articles" component={ArticlesPage} />
              <Route path="/articles/" component={ArticlesPage} />
              <Route path="/article/:slug" component={ArticleDetailPage} />
              <Route path="/article/:slug/" component={ArticleDetailPage} />
              <Route path="/category/:slug" component={CategoryPage} />
              <Route path="/category/:slug/" component={CategoryPage} />
              <Route path="/search" component={SearchPage} />
              <Route path="/search/" component={SearchPage} />
              <Route path="/about" component={() => <TrustPage kind="about" />} />
              <Route path="/about/" component={() => <TrustPage kind="about" />} />
              <Route path="/editorial" component={() => <TrustPage kind="editorial" />} />
              <Route path="/editorial/" component={() => <TrustPage kind="editorial" />} />
              <Route path="/privacy-policy" component={() => <TrustPage kind="privacy" />} />
              <Route path="/privacy-policy/" component={() => <TrustPage kind="privacy" />} />
              <Route path="/terms" component={() => <TrustPage kind="terms" />} />
              <Route path="/terms/" component={() => <TrustPage kind="terms" />} />
              <Route path="/contact" component={() => <TrustPage kind="contact" />} />
              <Route path="/contact/" component={() => <TrustPage kind="contact" />} />
              <Route path="/sign-in/*?" component={SignInPage} />
              <Route path="/sign-up/*?" component={SignUpPage} />
              <Route component={NotFound} />
          </Switch>
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  const appearance = {
    ...clerkAppearance,
    variables: {
      ...clerkAppearance.variables,
      ...(theme === "dark" ? {
        colorPrimary: 'hsl(164, 61%, 35%)',
        colorForeground: 'hsl(42, 33%, 96%)',
        colorMutedForeground: 'hsl(218, 13%, 68%)',
        colorBackground: 'hsl(221, 26%, 16%)',
        colorInput: 'hsl(221, 20%, 29%)',
        colorInputForeground: 'hsl(42, 33%, 96%)',
        colorNeutral: 'hsl(221, 20%, 25%)',
      } : {}),
    },
  };

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={appearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: "Welcome back", subtitle: "Sign in to access your desk" } },
        signUp: { start: { title: "Create your account", subtitle: "Start building your career intelligence" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <AppAuthProvider>
        <AppRoutes includeClerkCacheInvalidator />
      </AppAuthProvider>
    </ClerkProvider>
  );
}

function E2eProviderWithRoutes() {
  return (
    <TestAppAuthProvider>
      <AppRoutes />
    </TestAppAuthProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      {isE2e ? <E2eProviderWithRoutes /> : <ClerkProviderWithRoutes />}
    </WouterRouter>
  );
}

export default App;