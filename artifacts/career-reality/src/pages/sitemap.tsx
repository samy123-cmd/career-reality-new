import { ArrowUpRight, Compass, FileText, Search, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { Link } from "wouter";
import { PublicPage } from "@/components/shared/public-shell";
import { siteMap } from "@/data/site-map";

const icons = [Compass, Wrench, FileText, ShieldCheck];

export default function SitemapPage() {
  return (
    <PublicPage
      eyebrow="The desk / sitemap"
      title="Every useful door, in one place."
      intro="A clear map of CareerReality's decision tools, intelligence reads, editorial catalogue, and trust pages."
    >
      <div className="rounded-[22px] border border-primary/20 bg-primary/[.06] p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="font-data text-[9px] uppercase tracking-[.18em] text-primary">Start anywhere</p>
            <h2 className="mt-3 max-w-[610px] font-display text-4xl leading-[.95] tracking-[-.04em] sm:text-5xl">The right page is usually the one that sharpens the question.</h2>
          </div>
          <Search className="text-primary" size={25} />
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/compass" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[11px] font-bold text-primary-foreground">Start with Compass <ArrowUpRight size={14} /></Link>
          <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-[11px] font-bold">Search the desk <Search size={14} /></Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {siteMap.map((section, index) => {
          const Icon = icons[index] ?? FileText;
          return (
            <section key={section.label} className="surface-lift rounded-[20px] border border-border bg-card p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary"><Icon size={17} /></span>
                  <h2 className="font-display text-3xl tracking-[-.03em]">{section.label}</h2>
                </div>
                <span className="font-data text-[9px] text-muted-foreground">{String(section.items.length).padStart(2, "0")} pages</span>
              </div>
              <div className="mt-2">
                {section.items.map((item) => (
                  <Link key={item.href} href={item.href} className="group flex items-start justify-between gap-4 border-b border-border/70 py-4 last:border-0">
                    <span>
                      <span className="block text-[12px] font-bold group-hover:text-primary">{item.label}</span>
                      {item.description && <span className="mt-1 block max-w-[360px] text-[10px] leading-[1.55] text-muted-foreground">{item.description}</span>}
                    </span>
                    <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-5 rounded-[18px] border border-border bg-secondary/35 p-5 text-[11px] leading-[1.7] text-muted-foreground">
        <Sparkles className="mb-2 text-primary" size={16} />
        Company detail pages and individual editorial reads are generated from the live company and article catalogues. Start from Companies or the Journal to browse them.
      </div>
    </PublicPage>
  );
}