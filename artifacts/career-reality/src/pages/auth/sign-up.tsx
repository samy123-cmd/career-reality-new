import { SignUp } from '@clerk/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';
import { Logo } from '@/components/shared/app-nav';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignUpPage() {
  return (
    <div className="grain min-h-[100dvh] flex flex-col">
      <header className="flex items-center justify-between px-5 sm:px-8 h-[72px] border-b border-border bg-background/90 backdrop-blur-md">
        <Logo />
        <Link href="/" className="text-[11px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
          Back to desk <ArrowUpRight size={13} />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-5 animate-enter">
        <SignUp 
          routing="path" 
          path={`${basePath}/sign-up`} 
          signInUrl={`${basePath}/sign-in`} 
          forceRedirectUrl={`${basePath}/workspace`} 
        />
      </main>
    </div>
  );
}