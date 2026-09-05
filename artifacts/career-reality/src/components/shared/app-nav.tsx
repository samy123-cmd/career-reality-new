import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowUpRight, Search, Menu, X, LayoutDashboard, Calculator, Building2, Moon, Sun } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppAuth } from '@/lib/app-auth';
import { useTheme } from '@/lib/theme';

function SignedIn({ children }: { children: React.ReactNode }) {
  const { userId } = useAppAuth();
  return userId ? <>{children}</> : null;
}

function SignedOut({ children }: { children: React.ReactNode }) {
  const { userId } = useAppAuth();
  return !userId ? <>{children}</> : null;
}

export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" data-testid="link-logo">
      <span className="inline-flex size-8 items-center justify-center rounded-[8px] bg-gradient-to-br from-sky-300 to-sky-500 text-[12px] font-extrabold tracking-[-0.02em] text-slate-950 shadow-[0_0_0_1px_rgb(56_189_248_/_0.35)] transition duration-300 group-hover:-rotate-3 group-hover:scale-105 group-hover:shadow-[0_0_0_1px_rgb(56_189_248_/_0.6),0_8px_18px_rgb(14_165_233_/_0.2)]">
        CR
      </span>
      <span className="text-[15px] font-extrabold tracking-[-0.04em] text-foreground">
        Career<span className="text-sky-500 dark:text-sky-400">Reality</span>
      </span>
    </Link>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group inline-flex h-9 items-center gap-1 rounded-full border border-border/80 bg-card/70 p-1 text-muted-foreground shadow-[0_4px_14px_hsl(var(--foreground)/.05)] transition-[background-color,border-color,box-shadow] hover:border-primary/40 hover:bg-card hover:text-foreground hover:shadow-[0_7px_18px_hsl(var(--foreground)/.09)]"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      data-testid="button-theme-toggle"
    >
      <span className={`grid size-7 place-items-center rounded-full transition-colors ${isDark ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
        {isDark ? <Sun size={14} strokeWidth={2.3} /> : <Moon size={14} strokeWidth={2.3} />}
      </span>
      <span className="hidden pr-2 text-[10px] font-bold uppercase tracking-[.12em] sm:inline">
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}

export function AppNav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === '/';
  const { user, signOut } = useAppAuth();
  const isCurrent = (href: string) => href !== "/" && (location === href || location.startsWith(`${href}/`));
  const isToolRoute = ["/salary-calculator", "/salary-reality", "/resignation-risk", "/layoff-radar", "/salary-drop", "/escape-plan", "/career-reality-index", "/ai"].some((href) => isCurrent(href));

  return (
    <header className="relative z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 text-[12px] font-semibold text-muted-foreground md:flex" aria-label="Primary navigation">
          <Link href={isHome ? '#tools' : '/#tools'} className="transition-colors hover:text-foreground" data-testid="link-tools">The desk</Link>
          <Link href="/compass" className={`transition-colors hover:text-foreground ${isCurrent("/compass") ? 'text-foreground' : ''}`} data-testid="link-compass">Compass</Link>
          <Link href={isHome ? '#method' : '/#method'} className="transition-colors hover:text-foreground" data-testid="link-method">Our method</Link>
          <Link href="/articles" className={`transition-colors hover:text-foreground ${location.startsWith('/article') || isCurrent("/articles") || isCurrent("/topic-clusters") || isCurrent("/search") ? 'text-foreground' : ''}`} data-testid="link-articles">Journal</Link>
          <Link href="/salary-calculator" className={`inline-flex items-center gap-1.5 transition-colors hover:text-foreground ${isToolRoute ? 'text-foreground' : ''}`} data-testid="link-calculator"><Calculator size={14} /> Tools</Link>
          <Link href="/companies" className={`inline-flex items-center gap-1.5 transition-colors hover:text-foreground ${isCurrent("/companies") ? 'text-foreground' : ''}`} data-testid="link-companies"><Building2 size={14} /> Companies</Link>
          <Link href="/pro" className={`transition-colors hover:text-foreground ${isCurrent("/pro") || isCurrent("/payments/pricing") ? 'text-foreground' : ''}`} data-testid="link-pro">Career Reality Pro</Link>
          
          <SignedIn>
            <Link href="/workspace" className="transition-colors hover:text-foreground flex items-center gap-1.5" data-testid="link-workspace">
              <LayoutDashboard size={14} /> Workspace
            </Link>
          </SignedIn>
        </nav>
        
        <div className="hidden items-center gap-4 md:flex">
          {isHome && (
            <button onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })} className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" data-testid="button-search">
              <Search size={15} strokeWidth={2.2} /> Search
            </button>
          )}

          <ThemeToggle />

          <SignedOut>
            <Link href="/sign-in" className="text-[12px] font-bold text-muted-foreground hover:text-foreground transition-colors" data-testid="link-sign-in">
              Sign in
            </Link>
              <Link href="/compass" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[12px] font-bold text-primary-foreground shadow-[0_8px_18px_hsl(var(--primary)/.16)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_hsl(var(--primary)/.23)]" data-testid="link-start-reading">
              Start a decision <ArrowUpRight size={14} />
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3">
                <Link href="/compass" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[12px] font-bold text-primary-foreground shadow-[0_8px_18px_hsl(var(--primary)/.16)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_hsl(var(--primary)/.23)]" data-testid="link-start-reading-auth">
                 Open Compass <ArrowUpRight size={14} />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border overflow-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" aria-label="Account menu">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-data text-xs font-bold text-muted-foreground">{user?.firstName?.[0] || 'U'}</span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <p className="text-sm font-semibold truncate">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/workspace" className="w-full cursor-pointer">Workspace</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SignedIn>
        </div>

        <button onClick={() => setOpen(!open)} className="rounded-xl border border-border bg-card p-2 text-foreground transition-colors hover:bg-muted md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <div className="animate-enter border-t border-border bg-background/95 px-5 py-5 shadow-[0_18px_28px_hsl(var(--foreground)/.07)] md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-semibold" aria-label="Mobile navigation">
            <Link onClick={() => setOpen(false)} href="/#tools" data-testid="mobile-link-tools">The desk</Link>
            <Link onClick={() => setOpen(false)} href="/compass" data-testid="mobile-link-compass">Compass</Link>
            <Link onClick={() => setOpen(false)} href="/#method" data-testid="mobile-link-method">Our method</Link>
            <Link onClick={() => setOpen(false)} href="/articles" data-testid="mobile-link-articles">Journal</Link>
            <Link onClick={() => setOpen(false)} href="/salary-calculator" data-testid="mobile-link-calculator">Tools</Link>
            <Link onClick={() => setOpen(false)} href="/salary-reality" data-testid="mobile-link-salary-reality">Salary reality</Link>
            <Link onClick={() => setOpen(false)} href="/resignation-risk" data-testid="mobile-link-resignation-risk">Resignation risk</Link>
            <Link onClick={() => setOpen(false)} href="/layoff-radar" data-testid="mobile-link-layoff-radar">Layoff radar</Link>
            <Link onClick={() => setOpen(false)} href="/companies" data-testid="mobile-link-companies">Companies</Link>
            <Link onClick={() => setOpen(false)} href="/pro" data-testid="mobile-link-pro">Career Reality Pro</Link>
            <SignedIn>
              <Link onClick={() => setOpen(false)} href="/workspace" data-testid="mobile-link-workspace">Workspace</Link>
              <button onClick={() => { setOpen(false); signOut({ redirectUrl: '/' }); }} className="text-left" data-testid="mobile-link-sign-out">Sign out</button>
            </SignedIn>
            <SignedOut>
              <Link onClick={() => setOpen(false)} href="/sign-in" data-testid="mobile-link-sign-in">Sign in</Link>
            </SignedOut>
            <ThemeToggle />
          </nav>
        </div>
      )}
    </header>
  );
}
