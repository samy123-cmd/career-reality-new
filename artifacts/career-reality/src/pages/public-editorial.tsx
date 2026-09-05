import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowUpRight, BookOpen, Mail, Search, ShieldCheck } from "lucide-react";
import { ArticleCard, FreshnessBadge, PublicFooter, PublicPage, SaveDecisionButton } from "@/components/shared/public-shell";
import { AppNav } from "@/components/shared/app-nav";
import { articleCategories, articles, getArticle, toolsCatalog } from "@/data/content";
import { trackEvent } from "@/lib/analytics";

export function TopicClustersPage() {
  const [selected, setSelected] = useState("all");
  const featured = selected === "all" ? articles : articles.filter((article) => article.category === selected);
  return <PublicPage eyebrow="Editorial / discovery" title="Follow a question, not an algorithm." intro="CareerReality's editorial desk is organised around the decisions people are actually making: money, momentum, skill, risk, and what comes next.">
    <div className="flex flex-wrap gap-2">{[["all", "All clusters"], ...articleCategories.map((item) => [item.value, item.label])].map(([value, label]) => <button key={value} onClick={() => setSelected(value)} className={`rounded-full border px-4 py-2 text-[11px] font-bold transition-colors ${selected === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"}`}>{label}</button>)}</div>
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{featured.slice(0, 12).map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
    <div className="mt-10 rounded-[20px] border border-border bg-secondary/35 p-6 sm:p-8"><div className="flex items-start gap-4"><BookOpen className="mt-1 text-primary" size={20} /><div><p className="font-display text-3xl">Recommended path: considering a move</p><p className="mt-3 max-w-[680px] text-[12px] leading-[1.7] text-muted-foreground">Start with salary reality, check company signals, read the resignation-risk guide, then use the CTC decoder on the offer in front of you.</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/salary-reality" className="text-[11px] font-bold text-primary">1. Benchmark pay <ArrowUpRight size={13} /></Link><Link href="/companies" className="text-[11px] font-bold text-primary">2. Read the company <ArrowUpRight size={13} /></Link><Link href="/resignation-risk" className="text-[11px] font-bold text-primary">3. Check the move <ArrowUpRight size={13} /></Link></div></div></div></div>
  </PublicPage>;
}

export function ArticlesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = articles.filter((article) => `${article.title} ${article.excerpt} ${article.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()) && (category === "all" || article.category === category));
  return <PublicPage eyebrow="Editorial / all reads" title="The reality desk." intro="Sharp, useful writing for the parts of a career that do not fit neatly into a job description."><div className="grid gap-3 md:grid-cols-[1fr_auto]"><div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3"><Search size={16} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles" className="h-12 w-full bg-transparent text-sm outline-none" /></div><select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 rounded-xl border border-border bg-card px-4 text-[11px] font-bold"><option value="all">All categories</option>{articleCategories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>{filtered.length === 0 ? <div className="mt-7 rounded-[18px] border border-border p-12 text-center"><p className="font-display text-3xl">That search is quiet.</p><p className="mt-2 text-[12px] text-muted-foreground">Try a role, a money question, or a category.</p></div> : <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtered.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>}</PublicPage>;
}

export function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const article = getArticle(params.slug ?? "");
  useEffect(() => {
    document.title = article ? `${article.title} | CareerReality` : "Story not found | CareerReality";
    const description = article?.excerpt ?? "Explore CareerReality's editorial desk.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [article]);

  if (!article) return <PublicPage eyebrow="Editorial / missing read" title="This story moved." intro="The article is not in the current desk catalogue. Explore the latest reads or search for another question."><Link href="/articles" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[11px] font-bold text-primary-foreground">Browse all articles <ArrowUpRight size={14} /></Link></PublicPage>;
  const related = articles.filter((item) => item.category === article.category && item.slug !== article.slug).slice(0, 3);
  return <div className="grain min-h-[100dvh]"><AppNav /><div className="mx-auto max-w-[1240px] px-5 sm:px-8"><div className="pt-5"><Link href="/articles" className="inline-flex items-center gap-2 text-[11px] font-bold text-muted-foreground hover:text-foreground"><ArrowLeft size={14} /> All reads</Link></div></div><main className="mx-auto max-w-[860px] px-5 py-12 sm:px-8 sm:py-20"><div className="animate-enter"><div className="flex flex-wrap items-center gap-3"><span className="font-data text-[9px] uppercase tracking-[.16em] text-primary">{article.category.replaceAll("-", " ")}</span><FreshnessBadge label={`${article.contentType} · ${article.date}`} confidence="Medium" /></div><h1 className="mt-6 font-display text-[52px] leading-[.9] tracking-[-.05em] sm:text-[80px]">{article.title}</h1><p className="mt-7 max-w-[700px] text-[16px] leading-[1.75] text-muted-foreground">{article.excerpt}</p><div className="mt-7 flex flex-wrap items-center gap-4"><span className="font-data text-[10px] text-muted-foreground">{article.readTime} · CareerReality editorial desk</span><SaveDecisionButton slug={article.slug} title={article.title} /></div></div><div className="mt-10 rounded-[18px] border border-primary/25 bg-primary/[.07] p-5 text-[12px] leading-[1.7]"><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Editorial format</p><p className="mt-3">This is a long-form editorial article, not a claim of original reporting. It preserves the original CareerReality desk brief, adds practical context, and keeps uncertainty visible. <a href={article.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-primary">View the source page <ArrowUpRight className="inline" size={13} /></a></p></div><article className="prose prose-stone mt-14 max-w-none prose-headings:font-display prose-headings:font-medium prose-headings:tracking-[-.03em] prose-p:text-[15px] prose-p:leading-[1.9] prose-p:text-foreground/80 prose-a:text-primary"><p className="lead">{article.excerpt}</p>{article.sections.map((section) => <section key={section.heading} className="mt-12"><h2>{section.heading}</h2><p>{section.body}</p></section>)}</article><div className="mt-14 border-t border-border pt-8"><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Keep reading</p><div className="mt-5 grid gap-3 md:grid-cols-3">{related.map((item) => <ArticleCard key={item.slug} article={item} />)}</div></div></main><PublicFooter /></div>;
}

export function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "career-reality-checks";
  const category = articleCategories.find((item) => item.value === slug) ?? articleCategories[0];
  const filtered = articles.filter((article) => article.category === category.value);
  return <PublicPage eyebrow="Editorial / category" title={category.label} intro="A focused archive of reads for the questions inside this part of working life."><div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5"><p className="text-[12px] text-muted-foreground">{filtered.length} reads in this desk</p><FreshnessBadge label="Archive refreshed Aug 2026" confidence="Medium" /></div><div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtered.map((article) => <ArticleCard key={article.slug} article={article} />)}</div></PublicPage>;
}

export function SearchPage() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => normalized ? [...articles.filter((article) => `${article.title} ${article.excerpt} ${article.tags.join(" ")}`.toLowerCase().includes(normalized)), ...([] as typeof articles)] : [], [normalized]);
  const toolResults = normalized
    ? toolsCatalog.filter((tool) => `${tool.title} ${tool.description}`.toLowerCase().includes(normalized))
    : [];
  useEffect(() => {
    if (normalized) {
      trackEvent("search_results_viewed", {
        route: "/search",
        article_results: results.length,
        tool_results: toolResults.length,
      });
    }
  }, [normalized, results.length, toolResults.length]);
  return <PublicPage eyebrow="Search / the desk" title="Find the useful signal." intro="Search across the local editorial and tool catalogue. No account needed."><div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3"><Search size={17} className="text-muted-foreground" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “notice period”, “salary”, or “AI”" className="h-14 w-full bg-transparent text-sm outline-none" /></div>{!normalized ? <div className="mt-8 rounded-[18px] border border-border bg-secondary/35 p-7"><p className="font-display text-3xl">Search is better with a question.</p><p className="mt-3 text-[12px] leading-[1.7] text-muted-foreground">Try a role, city, company, or the decision you are avoiding.</p></div> : results.length === 0 && toolResults.length === 0 ? <div className="mt-8 rounded-[18px] border border-border p-12 text-center"><p className="font-display text-3xl">No exact match yet.</p><p className="mt-2 text-[12px] text-muted-foreground">Try “offer”, “manager”, “engineering”, or “money”.</p></div> : <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_.7fr]"><div><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Articles · {results.length}</p><div className="mt-4 grid gap-3">{results.slice(0, 8).map((article) => <ArticleCard key={article.slug} article={article} />)}</div></div><div><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Tools · {toolResults.length}</p><div className="mt-4 grid gap-3">{toolResults.map((tool) => <Link key={tool.slug} href={tool.href} onClick={() => trackEvent("tool_discovered", { catalog_slug: tool.slug, route: "/search" })} className="rounded-[16px] border border-border bg-card p-5 hover:border-primary"><p className="font-display text-2xl">{tool.title}</p><p className="mt-2 text-[11px] text-muted-foreground">{tool.description}</p><span className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold text-primary">Open tool <ArrowUpRight size={13} /></span></Link>)}</div></div></div>}</PublicPage>;
}

export function TrustPage({ kind }: { kind: "about" | "editorial" | "privacy" | "terms" | "contact" }) {
  const pages = {
    about: { eyebrow: "The desk / about", title: "Career decisions deserve better than folklore.", intro: "CareerReality is an India-first career intelligence desk for the moments when salary, stability, timing, and identity collide.", heading: "A calmer way to look at consequential work decisions.", body: "We make the evidence visible, label what is fresh, and leave room for what data cannot know. The product is built for a first useful answer without an account, with deeper continuity available in Pro and Workspace." },
    editorial: { eyebrow: "Trust / editorial standards", title: "Show the source. Name the uncertainty.", intro: "Our editorial standard is simple: useful beats loud, and transparent beats certain.", heading: "How a signal earns its place.", body: "We separate public evidence, aggregated community input, and editorial interpretation. Dates and confidence labels travel with the read. We correct errors, avoid identifying contributors, and do not let commercial relationships decide conclusions." },
    privacy: { eyebrow: "Trust / privacy", title: "Your career context is not ad inventory.", intro: "We design the public product to work without an account and treat salary contributions as privacy-critical.", heading: "What we collect and why.", body: "Tool inputs stay in the browser unless a signed-in feature explicitly saves a decision. Anonymous salary contributions never ask for names, employer names, emails, phone numbers, or profile links. See the final product policy for retention, deletion, and support details." },
    terms: { eyebrow: "Trust / terms", title: "Use the signal. Own the decision.", intro: "CareerReality provides educational estimates and editorial context, not tax, legal, investment, or employment advice.", heading: "A clear boundary.", body: "Numbers are estimates, sources have limits, and company signals can change. Verify offer letters, contracts, tax obligations, and employment policies with the relevant professional before acting." },
    contact: { eyebrow: "The desk / contact", title: "Have a signal we should look at?", intro: "Send a correction, suggest a company, or tell us which career question keeps showing up in your team.", heading: "A human inbox for useful context.", body: "For editorial corrections, include the article link and the specific claim. For company or salary signals, do not include personal data or confidential documents. We will acknowledge useful reports and explain what we can verify." },
  }[kind];
  return <PublicPage eyebrow={pages.eyebrow} title={pages.title} intro={pages.intro}><div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-[20px] border border-border bg-card p-6 sm:p-8"><h2 className="font-display text-4xl">{pages.heading}</h2><p className="mt-5 text-[14px] leading-[1.85] text-muted-foreground">{pages.body}</p><div className="mt-8 border-t border-border pt-5"><p className="text-[11px] font-bold">{kind === "contact" ? "Write to the desk" : "Last reviewed August 2026"}</p>{kind === "contact" ? <a href="mailto:hello@careerreality.in" className="mt-2 inline-flex items-center gap-2 text-[12px] font-bold text-primary"><Mail size={15} /> hello@careerreality.in</a> : <p className="mt-2 text-[11px] text-muted-foreground">If something looks wrong, contact us with the relevant page and context.</p>}</div></div><div className="paper-grid rounded-[20px] border border-border p-6 sm:p-8"><ShieldCheck className="text-primary" size={24} /><p className="mt-6 font-display text-3xl">Trust is a product feature.</p><p className="mt-4 text-[12px] leading-[1.7] text-muted-foreground">Freshness, source confidence, privacy language, and a clear next step belong beside the answer, not hidden in a footer.</p><Link href="/career-reality-index" className="mt-7 inline-flex items-center gap-2 text-[11px] font-bold text-primary">Read our methodology <ArrowUpRight size={14} /></Link></div></div></PublicPage>;
}
