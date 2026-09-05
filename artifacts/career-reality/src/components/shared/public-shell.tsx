import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Bookmark, Check, Clock3, ArrowUpRight } from "lucide-react";
import {
  getGetWorkspaceSummaryQueryKey,
  getListSavedDecisionsQueryKey,
  getListWatchlistQueryKey,
  useCreateSavedDecision,
  useCreateWatchlistItem,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Article } from "@/data/content";
import { AppNav } from "@/components/shared/app-nav";
import { trackEvent } from "@/lib/analytics";
import { useAppAuth } from "@/lib/app-auth";
import { siteMap } from "@/data/site-map";

export function FreshnessBadge({ label = "Updated Aug 2026", confidence = "High" }: { label?: string; confidence?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-data text-[9px] uppercase tracking-[.12em] text-muted-foreground">
      <span className="pulse-dot size-1.5 rounded-full bg-primary" /> {label} · {confidence} confidence
    </span>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/35">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="group inline-flex items-center gap-2 font-display text-3xl tracking-[-.04em]">Career<span className="text-primary transition-colors group-hover:text-accent">Reality</span><ArrowUpRight size={17} className="text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>
          <p className="mt-3 max-w-[290px] text-[12px] leading-[1.7] text-muted-foreground">A calm, candid career intelligence desk for people making consequential moves in India.</p>
          <Link href="/sitemap" className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold text-primary">View the full sitemap <ArrowUpRight size={13} /></Link>
        </div>
        {siteMap.slice(1, 4).map((section) => (
          <div key={section.label}>
            <p className="font-data text-[9px] uppercase tracking-[.18em] text-primary">{section.label}</p>
            <div className="mt-4 grid gap-2 text-[12px] font-semibold text-muted-foreground">
              {section.items.slice(0, 5).map((item) => <Link key={item.href} href={item.href} className="hover:text-foreground">{item.label}</Link>)}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-8">
          <p className="font-data text-[9px] text-muted-foreground">© 2026 CAREERREALITY · INDIA</p>
          <div className="flex gap-4 text-[10px] font-semibold text-muted-foreground"><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/payments/pricing">Pro</Link></div>
        </div>
      </div>
    </footer>
  );
}

export function PublicPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  useEffect(() => {
    document.title = `${title} | CareerReality`;
    const description = intro ?? "Career intelligence for consequential decisions in India.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [intro, title]);

  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden">
      <AppNav />
      <main className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="reveal relative">
          <div className="pointer-events-none absolute -left-20 -top-24 size-72 rounded-full bg-secondary/45 blur-3xl" />
          <p className="relative font-data text-[10px] uppercase tracking-[.2em] text-primary">{eyebrow}</p>
          <h1 className="relative mt-4 max-w-[820px] font-display text-[52px] leading-[.92] tracking-[-.05em] sm:text-[78px]">{title}</h1>
          {intro && <p className="mt-6 max-w-[640px] text-[14px] leading-[1.75] text-muted-foreground">{intro}</p>}
        </div>
        <div className="reveal reveal-3 mt-12">{children}</div>
      </main>
      <PublicFooter />
    </div>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      onClick={() => trackEvent("article_discovered", { catalog_slug: article.slug, route: window.location.pathname })}
      className="surface-lift group flex h-full flex-col rounded-[18px] border border-border bg-card p-5 hover:border-primary/60"
    >
      <div className="flex items-center justify-between gap-3"><span className="font-data text-[9px] uppercase tracking-[.14em] text-primary">{article.category.replaceAll("-", " ")}</span><Clock3 size={14} className="text-muted-foreground" /></div>
      <h3 className="mt-7 font-display text-[27px] leading-[.98] tracking-[-.03em]">{article.title}</h3>
      <p className="mt-4 line-clamp-3 text-[12px] leading-[1.7] text-muted-foreground">{article.excerpt}</p>
      <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-[10px] text-muted-foreground"><span>{article.date} · {article.readTime}</span><ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
    </Link>
  );
}

export function SaveDecisionButton({
  slug,
  title,
  summary = `Saved editorial read: ${slug}`,
  signal = "Editorial context to revisit",
  nextHref = "/workspace",
  nextLabel = "Open private workspace",
  kind = "company",
  eventName = "article_saved",
  idleLabel = "Save to workspace",
  savedLabel = "Saved to workspace",
  className = "",
  confidenceBand,
}: {
  slug: string;
  title: string;
  summary?: string;
  signal?: string;
  nextHref?: string;
  nextLabel?: string;
  kind?: "salary" | "company" | "risk" | "ai";
  eventName?: string;
  idleLabel?: string;
  savedLabel?: string;
  className?: string;
  confidenceBand?: string;
}) {
  const { isSignedIn } = useAppAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const save = useCreateSavedDecision();
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = () => {
    if (!isSignedIn) {
      setLocation(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    setErrorMessage("");
    save.mutate({ data: { kind, title, summary, signal } }, {
      onSuccess: () => {
        setSaved(true);
        trackEvent(eventName, {
          catalog_slug: slug,
          content_kind: kind,
          route: window.location.pathname,
          ...(confidenceBand ? { confidence_band: confidenceBand } : {}),
        });
        queryClient.invalidateQueries({ queryKey: getListSavedDecisionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetWorkspaceSummaryQueryKey() });
      },
      onError: (error) => {
        const status = typeof error === "object" && error !== null && "status" in error
          ? (error as { status?: number }).status
          : undefined;
        setErrorMessage(status === 409
          ? "This read is already in your workspace. Open the workspace to check it."
          : "Could not save this read. Your context is still here; try again.");
      },
    });
  };
  return (
    <div>
      <button onClick={handleSave} disabled={save.isPending || saved} className={`inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-[11px] font-bold transition-[transform,border-color,background-color] hover:-translate-y-0.5 hover:border-primary hover:bg-primary/[.04] disabled:cursor-default disabled:opacity-75 ${className}`}>
        {saved ? <Check size={14} className="text-primary" /> : <Bookmark size={14} />}
        {saved ? savedLabel : save.isPending ? "Saving…" : idleLabel}
      </button>
      {saved && <Link href={nextHref} className="ml-3 text-[11px] font-bold text-primary">{nextLabel} <ArrowUpRight size={13} /></Link>}
      {errorMessage && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-destructive" role="status">
          <span>{errorMessage}</span>
          <button type="button" onClick={handleSave} className="font-bold underline underline-offset-2" data-testid="button-retry-save">Try again</button>
        </div>
      )}
    </div>
  );
}

export function WatchlistButton({
  company,
  signal,
  note = "Track this company while you decide.",
  nextHref = "/workspace",
  analyticsLocation = "public_surface",
  catalogSlug,
  className = "",
}: {
  company: string;
  signal: string;
  note?: string;
  nextHref?: string;
  analyticsLocation?: string;
  catalogSlug?: string;
  className?: string;
}) {
  const { isSignedIn } = useAppAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const add = useCreateWatchlistItem();
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleWatch = () => {
    if (!isSignedIn) {
      setLocation(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    setErrorMessage("");
    add.mutate(
      { data: { company, signal, note } },
      {
        onSuccess: () => {
          setSaved(true);
          trackEvent("company_added_to_watchlist", {
            location: analyticsLocation,
            route: window.location.pathname,
            ...(catalogSlug ? { catalog_slug: catalogSlug } : {}),
          });
          queryClient.invalidateQueries({ queryKey: getListWatchlistQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetWorkspaceSummaryQueryKey() });
        },
        onError: (error) => {
          const status = typeof error === "object" && error !== null && "status" in error
            ? (error as { status?: number }).status
            : undefined;
          setErrorMessage(status === 409
            ? "This company is already on your watchlist. Open the workspace to check it."
            : "Could not add this company. Your context is still here; try again.");
        },
      },
    );
  };

  return (
    <div>
      <button onClick={handleWatch} disabled={add.isPending || saved} className={`inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-[11px] font-bold transition-[transform,border-color,background-color] hover:-translate-y-0.5 hover:border-primary hover:bg-primary/[.04] disabled:cursor-default disabled:opacity-75 ${className}`}>
        {saved ? <Check size={14} className="text-primary" /> : <Bookmark size={14} />}
        {saved ? "Watching in workspace" : add.isPending ? "Adding…" : "Watch this company"}
      </button>
      {saved && <Link href={nextHref} className="ml-3 text-[11px] font-bold text-primary">Open watchlist <ArrowUpRight size={13} /></Link>}
      {errorMessage && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-destructive" role="status">
          <span>{errorMessage}</span>
          <button type="button" onClick={handleWatch} className="font-bold underline underline-offset-2" data-testid="button-retry-watchlist">Try again</button>
        </div>
      )}
    </div>
  );
}
