import { SignIn } from '@clerk/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';
import { useLocation } from 'wouter';
import { Logo } from '@/components/shared/app-nav';
import { useAppAuth } from '@/lib/app-auth';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignInPage() {
  const requestedRedirect = new URLSearchParams(window.location.search).get('redirect_url');
  const redirectPath = requestedRedirect?.startsWith('/') ? requestedRedirect : '/workspace';
  const [, setLocation] = useLocation();
  const { signIn } = useAppAuth();

  if (import.meta.env.VITE_E2E === "true") {
    return (
      <div className="grain min-h-[100dvh] flex flex-col">
        <header className="flex items-center justify-between px-5 sm:px-8 h-[72px] border-b border-border bg-background/90 backdrop-blur-md">
          <Logo />
          <Link href="/" className="text-[11px] font-bold text-muted-foreground">Back to desk</Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-5">
          <div className="w-full max-w-[440px] rounded-2xl border border-border bg-card p-8 text-center">
            <p className="font-data text-[10px] uppercase tracking-[.18em] text-primary">Test sign-in</p>
            <h1 className="mt-3 font-display text-3xl">Welcome back</h1>
            <p className="mt-3 text-sm text-muted-foreground">Continue to the page that asked you to sign in.</p>
            <button
              type="button"
              data-testid="button-e2e-sign-in"
              onClick={() => {
                signIn();
                setLocation(redirectPath);
              }}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground"
            >
              Continue
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="grain min-h-[100dvh] flex flex-col">
      <header className="flex items-center justify-between px-5 sm:px-8 h-[72px] border-b border-border bg-background/90 backdrop-blur-md">
        <Logo />
        <Link href="/" className="text-[11px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
          Back to desk <ArrowUpRight size={13} />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-5 animate-enter">
        <SignIn 
          routing="path" 
          path={`${basePath}/sign-in`} 
          signUpUrl={`${basePath}/sign-up`} 
          forceRedirectUrl={`${basePath}${redirectPath}`}
        />
      </main>
    </div>
  );
}