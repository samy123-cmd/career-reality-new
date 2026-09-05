import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Compass,
  FileText,
  Gauge,
  LockKeyhole,
  MoveRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { Link } from "wouter";
import {
  useListLayoffSignals,
  useListPublicCompanySignals,
  useListSalaryBenchmarks,
} from "@workspace/api-client-react";
import { AppNav } from "@/components/shared/app-nav";
import { PublicFooter, SaveDecisionButton, WatchlistButton } from "@/components/shared/public-shell";
import { trackEvent } from "@/lib/analytics";
import "./compass.css";

type DecisionKey = "offer" | "move" | "stay";

function formatLakhs(value?: number): string {
  return value ? `₹${(value / 100000).toFixed(1)}L` : "Reading";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function noticePeriodBand(value: number): string {
  if (value < 30) return "under_30_days";
  if (value <= 60) return "30_to_60_days";
  return "over_60_days";
}

export default function CareerRealityCompassPage() {
  const [selected, setSelected] = useState<DecisionKey>("offer");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [noticePeriod, setNoticePeriod] = useState(48);

  useEffect(() => {
    trackEvent("compass_opened", { route: "/compass" });
  }, []);

  const salaryQuery = useListSalaryBenchmarks({
    role: "Software engineer",
    city: "Bengaluru",
    experienceBand: "5–8 years",
  });
  const companyQuery = useListPublicCompanySignals();
  const layoffQuery = useListLayoffSignals();

  const salary = salaryQuery.data?.data?.[0];
  const company = companyQuery.data?.data?.[0];
  const layoff = layoffQuery.data?.data?.[0];
  const loading = salaryQuery.isPending || companyQuery.isPending || layoffQuery.isPending;
  const failed = salaryQuery.isError || companyQuery.isError || layoffQuery.isError;
  const failedSources = [
    { key: "salary", label: "Salary benchmark", failed: salaryQuery.isError, retry: salaryQuery.refetch },
    { key: "company", label: "Company signal", failed: companyQuery.isError, retry: companyQuery.refetch },
    { key: "layoff", label: "Layoff radar", failed: layoffQuery.isError, retry: layoffQuery.refetch },
  ].filter((source) => source.failed);

  const contextScore = useMemo(() => {
    if (!salary && !company) return 0;
    const salarySignal = salary ? clamp(Math.round(((salary.median - salary.p25) / Math.max(salary.p75 - salary.p25, 1)) * 35 + 50), 35, 92) : 50;
    return clamp(Math.round((salarySignal + (company?.stability ?? 60)) / 2), 35, 92);
  }, [company?.stability, salary]);

  const decisions = useMemo(() => ({
    offer: {
      title: "Should I take this offer?",
      detail: `${formatLakhs(salary?.median)} for a product role`,
      read: company?.stability && company.stability > 70 ? "Promising, with one expensive caveat." : "The upside is real. Make the risk legible.",
      signals: [
        { label: "Cash upside", value: salary ? "Above band" : "Reading", width: "82%" },
        { label: "Stability", value: company ? `${company.stability} / 100` : "Reading", width: `${company?.stability ?? 64}%`, tone: "coral" as const },
        { label: "Role fit", value: "Strong", width: "76%", tone: "gold" as const },
      ],
    },
    move: {
      title: "Is now the right time?",
      detail: "Make a move in the next 90 days",
      read: "The window is open, but do not rush the proof.",
      signals: [
        { label: "Market timing", value: "Good", width: "68%" },
        { label: "Switch friction", value: `${noticePeriod} day notice`, width: `${clamp(92 - noticePeriod, 25, 76)}%`, tone: "coral" as const },
        { label: "Leverage", value: "Building", width: "61%", tone: "gold" as const },
      ],
    },
    stay: {
      title: "What if I stay put?",
      detail: "Protect learning and optionality",
      read: "Quietly useful if you set a six-month checkpoint.",
      signals: [
        { label: "Learning curve", value: "Healthy", width: "73%" },
        { label: "Pay momentum", value: "Slow", width: "46%", tone: "coral" as const },
        { label: "Exit optionality", value: "Strong", width: "79%", tone: "gold" as const },
      ],
    },
  }), [company, noticePeriod, salary]);

  const decision = decisions[selected];
  const evidence = [
    {
      icon: BarChart3,
      title: salary ? "The money has a range" : "Reading the market band",
      text: salary ? `${formatLakhs(salary.p25)}–${formatLakhs(salary.p75)} across ${salary.sampleSize} reported snapshots.` : "Connecting to the current salary benchmark.",
      meta: salary ? `salary reports · ${salary.confidence.toLowerCase()} confidence` : "salary reports · loading",
      sourceKey: "salary",
    },
    {
      icon: Gauge,
      title: company ? `${company.name} needs one question` : "Stability needs a question",
      text: company?.signal ?? "We will surface the most useful company signal before you decide.",
      meta: company ? `company signal · ${company.momentum.toLowerCase()} momentum` : "company signal · loading",
      sourceKey: "company",
    },
    {
      icon: TrendingUp,
      title: layoff ? "The radar has a live signal" : "Your timing is still yours",
      text: layoff?.signal ?? "Keep two paths warm while the public signal resolves.",
      meta: layoff ? `layoff radar · ${layoff.confidence.toLowerCase()} confidence` : "market movement · checking",
      sourceKey: "layoff",
    },
  ];

  const snapshotSummary = `CareerReality Compass read for a Software engineer in Bengaluru: context score ${contextScore}/100, ${noticePeriod}-day notice period.`;

  return (
    <div className="compass-page">
      <AppNav />
      <div className="compass-shell">
        <aside className="compass-rail" aria-label="Career desk navigation">
          <div className="compass-mark" aria-label="CareerReality">R</div>
          <nav className="compass-rail-nav" aria-label="Decision room sections">
            <Link className="compass-rail-button is-active" href="/compass" aria-label="Decision room" title="Decision room"><Compass size={19} strokeWidth={1.8} /></Link>
            <Link className="compass-rail-button" href="/workspace" aria-label="Saved snapshots" title="Saved snapshots"><FileText size={18} strokeWidth={1.8} /></Link>
            <Link className="compass-rail-button" href="/layoff-radar" aria-label="Notifications" title="Notifications"><Bell size={18} strokeWidth={1.8} /></Link>
          </nav>
          <span className="compass-rail-label">Career desk / India</span>
        </aside>

        <main className="compass-main">
          <header className="compass-topbar">
            <div className="compass-breadcrumb">
              <span className="compass-eyebrow">Your decision room</span>
              <span className="compass-breadcrumb-separator">/</span>
              <span className="compass-muted">A private working read</span>
            </div>
            <div className="compass-top-actions">
              <SaveDecisionButton
                slug="compass-software-engineer-bengaluru"
                title="CareerReality Compass snapshot"
                kind="salary"
                eventName="snapshot_saved"
                summary={snapshotSummary}
                signal={decision.read}
                confidenceBand={salary?.confidence ?? company?.confidence ?? "unavailable"}
                idleLabel="Save snapshot"
                savedLabel="Snapshot saved"
                nextLabel="Open workspace"
                className="compass-save-button"
              />
              <button className="compass-help" aria-label="How the Compass works"><CircleHelp size={15} /></button>
              <span className="compass-avatar" aria-label="Private workspace">CR</span>
            </div>
          </header>

          <section className="compass-body">
            <div className="compass-hero">
              <div className="compass-eyebrow">One question at a time · 04 signals</div>
              <div className="compass-title-row">
                <h1 className="compass-display">Make the next move<br /><em>make sense.</em></h1>
                <div className="compass-orbit" aria-hidden="true"><span /><span /><span /></div>
              </div>
              <p className="compass-hero-copy">A calmer way to work through a high-stakes career decision. Choose the question you actually have; we will put the useful evidence around it.</p>

              <div className="compass-decision-strip" role="tablist" aria-label="Choose a career decision">
                {(Object.entries(decisions) as Array<[DecisionKey, typeof decisions.offer]>).map(([key, item], index) => (
                  <button key={key} className={`compass-choice ${selected === key ? "is-selected" : ""}`} onClick={() => { setSelected(key); setDetailsOpen(false); trackEvent("decision_tab_selected", { decision_key: key, route: "/compass" }); }} role="tab" aria-selected={selected === key}>
                    <span className="compass-choice-number">0{index + 1}</span>
                    <span className="compass-choice-title">{item.title}</span>
                    <span className="compass-choice-detail">{item.detail}</span>
                  </button>
                ))}
              </div>

              {failed && (
                <div className="compass-partial-banner" role="status">
                  <div><strong>Partial read.</strong> Some live context is unavailable, so this score is based only on the sources that responded.</div>
                  <div className="compass-partial-actions">
                    {failedSources.map((source) => (
                      <button key={source.key} type="button" onClick={() => void source.retry()}>{source.label} · Retry</button>
                    ))}
                  </div>
                </div>
              )}

              <section className={`compass-readout ${loading ? "is-loading" : ""}`} aria-live="polite">
                <div className="compass-score-column">
                  <div>
                    <div className="compass-score-label">Context score</div>
                    <div className="compass-score">{loading ? "···" : contextScore}</div>
                    <div className="compass-score-denom">out of 100</div>
                  </div>
                  <div className="compass-score-status"><Sparkles size={12} /> {failed ? "partial read" : "grounded read"}</div>
                </div>
                <div className="compass-readout-main">
                  <div className="compass-readout-head"><h2 className="compass-readout-title">{decision.read}</h2><span className="compass-updated">LIVE READ</span></div>
                  <div className="compass-readout-line" />
                  {decision.signals.map((signal) => <div className="compass-signal" key={signal.label}><span className="compass-signal-name">{signal.label}</span><span className="compass-signal-track"><span className={`compass-signal-fill ${signal.tone ?? ""}`} style={{ width: signal.width }} /></span><span className="compass-signal-value">{signal.value}</span></div>)}
                  <div className="compass-readout-footer"><span><strong>Read the trade-off.</strong> A score is a starting point, not a verdict.</span><button className="compass-breakdown-button" onClick={() => { const nextOpen = !detailsOpen; setDetailsOpen(nextOpen); if (nextOpen) trackEvent("breakdown_opened", { decision_key: selected, route: "/compass" }); }}>{detailsOpen ? "Hide breakdown" : "Show breakdown"} <ChevronDown size={13} className={detailsOpen ? "is-rotated" : ""} /></button></div>
                  <div className={`compass-detail-panel ${detailsOpen ? "is-open" : ""}`}><div className="compass-detail-inner"><div className="compass-detail-content">We weigh cash upside, company movement, role fit, and the friction of getting from today to the next version of your work. The inputs stay visible so you can disagree with the read.</div></div></div>
                </div>
              </section>
            </div>

            <aside className="compass-aside">
              <div className="compass-aside-card">
                <div className="compass-aside-head"><div><div className="compass-eyebrow">The evidence wall</div><h2 className="compass-aside-title">What changed<br />the read?</h2></div><span className="compass-aside-count">03 / 04</span></div>
                <div className="compass-evidence">{evidence.map((item) => { const Icon = item.icon; return <article className="compass-evidence-item" key={item.title}><span className="compass-evidence-icon"><Icon size={14} /></span><div><div className="compass-evidence-title">{item.title}</div><p className="compass-evidence-text">{item.text}</p><div className="compass-evidence-meta"><span /> {item.meta}</div></div></article>; })}</div>
                <div className="compass-aside-cta">
                  <div><strong>Want the source trail?</strong><span>Open the live company read.</span></div>
                  {company ? (
                    <WatchlistButton
                      company={company.name}
                      signal={company.signal}
                      note="Track this company while you decide in Compass."
                      analyticsLocation="compass"
                      catalogSlug="compass-company"
                      className="compass-watch-button"
                    />
                  ) : (
                    <Link href="/companies" onClick={() => trackEvent("next_action_selected", { action: "company_read", route: "/compass" })}><ArrowRight size={15} /></Link>
                  )}
                </div>
              </div>
            </aside>
          </section>

          <section className="compass-lower" aria-label="Next steps">
            <div className="compass-lower-card is-warm"><div className="compass-lower-top"><span>Next useful move</span><MoveRight size={15} /></div><div className="compass-lower-title">{company ? `Ask ${company.name} what changed in the last planning cycle.` : "Ask what changed in the last planning cycle."}</div><div className="compass-mini-meter" aria-label="Action confidence: 3 of 4"><span className="is-on" /><span className="is-on" /><span className="is-on" /><span /></div></div>
            <div className="compass-lower-card"><div className="compass-lower-top"><span>Make it yours</span><WalletCards size={15} /></div><div className="compass-range-wrap"><div className="compass-range-label"><span>Notice period in days</span><strong>{noticePeriod}</strong></div><input className="compass-range" type="range" min="15" max="90" value={noticePeriod} onChange={(event) => { const nextValue = Number(event.target.value); setNoticePeriod(nextValue); trackEvent("notice_period_changed", { notice_period_band: noticePeriodBand(nextValue), route: "/compass" }); }} style={{ background: `linear-gradient(90deg, var(--compass-teal) 0 ${((noticePeriod - 15) / 75) * 100}%, #cfc7ba ${((noticePeriod - 15) / 75) * 100}%)` }} aria-label="Notice period in days" /><div className="compass-range-scale"><span>15</span><span>90 days</span></div></div><div className="compass-saved-note"><ShieldCheck size={13} /> Personal inputs stay in your workspace</div></div>
          </section>
        </main>
      </div>
      <PublicFooter />
    </div>
  );
}