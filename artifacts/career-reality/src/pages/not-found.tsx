import { ArrowLeft, ArrowUpRight, Compass, Search } from 'lucide-react';
import { Link } from 'wouter';
import { AppNav } from '@/components/shared/app-nav';
import { PublicFooter } from '@/components/shared/public-shell';

export default function NotFound() {
  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden">
      <AppNav />
      <main className="mx-auto flex max-w-[1240px] items-center px-5 py-20 sm:min-h-[640px] sm:px-8 sm:py-24">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_.75fr] lg:items-center lg:gap-24">
          <div className="animate-enter">
            <p className="font-data text-[10px] uppercase tracking-[.2em] text-primary">The desk / 404</p>
            <h1 className="mt-5 max-w-[680px] font-display text-[62px] leading-[.9] tracking-[-.05em] sm:text-[92px]">This page took a wrong turn.</h1>
            <p className="mt-7 max-w-[500px] text-[15px] leading-[1.75] text-muted-foreground">The route is missing, the page moved, or the signal has not made it into the current desk catalogue yet.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/compass" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[12px] font-bold text-primary-foreground"><Compass size={15} /> Open Compass <ArrowUpRight size={14} /></Link>
              <Link href="/articles" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-[12px] font-bold"><ArrowLeft size={14} /> Browse the journal</Link>
            </div>
          </div>
          <div className="paper-grid surface-lift rounded-[22px] border border-border p-7 sm:p-10">
            <div className="flex items-center justify-between"><span className="font-data text-[10px] uppercase tracking-[.18em] text-primary">Try another signal</span><Search size={18} className="text-primary" /></div>
            <p className="mt-10 font-display text-4xl leading-[.95] tracking-[-.04em]">Search the desk for the question you meant to ask.</p>
            <Link href="/search" className="mt-8 inline-flex items-center gap-2 text-[11px] font-bold text-primary">Search articles and tools <ArrowUpRight size={14} /></Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
