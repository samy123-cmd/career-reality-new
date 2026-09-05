import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "wouter";
import { ArrowUpRight, Check, CircleAlert, Filter, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import {
  useGetPublicCompanySignal,
  useListLayoffSignals,
  useListPublicCompanySignals,
  useListSalaryBenchmarks,
  type ListLayoffSignalsParams,
} from "@workspace/api-client-react";
import { PublicPage, FreshnessBadge, SaveDecisionButton, WatchlistButton } from "@/components/shared/public-shell";
import { trackEvent } from "@/lib/analytics";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatLakhs(value: number): string {
  return `₹${(value / 100000).toFixed(1)}L`;
}

function queryOption(key: string, options: string[], fallback: string): string {
  const value = new URLSearchParams(window.location.search).get(key);
  return value && options.includes(value) ? value : fallback;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className="block"><span className="mb-2 block text-[11px] font-bold text-muted-foreground">{label}</span>{children}{hint && <span className="mt-1.5 block text-[10px] text-muted-foreground">{hint}</span>}</label>;
}

function Input({ value, onChange, type = "text", min, step, placeholder, name, required }: { value?: string; onChange: (value: string) => void; type?: string; min?: string; step?: string; placeholder?: string; name?: string; required?: boolean }) {
  return <input name={name} required={required} {...(value === undefined ? {} : { value })} onChange={(event) => onChange(event.target.value)} type={type} min={min} step={step} placeholder={placeholder} className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/60 focus:border-primary focus:bg-card focus:shadow-[0_0_0_4px_hsl(var(--primary)/.08)]" />;
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none transition-[border-color,box-shadow,background-color] focus:border-primary focus:bg-card focus:shadow-[0_0_0_4px_hsl(var(--primary)/.08)]">{options.map((option) => <option key={option}>{option}</option>)}</select>;
}

function ResultPanel({ children }: { children: React.ReactNode }) {
  return <div className="signal-scan rounded-[18px] border border-primary/25 bg-primary/[.07] p-5 sm:p-7">{children}</div>;
}

export function SalaryCalculatorPage() {
  const roleOptions = ["Software engineer", "Product manager", "Data analyst"];
  const cityOptions = ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune"];
  const [ctc, setCtc] = useState("2400000");
  const [variable, setVariable] = useState("12");
  const [role, setRole] = useState(() => queryOption("role", roleOptions, "Software engineer"));
  const [pf, setPf] = useState("Basic salary");
  const [gratuity, setGratuity] = useState("Included in CTC");
  const [regime, setRegime] = useState("New regime");
  const [city, setCity] = useState(() => queryOption("city", cityOptions, "Bengaluru"));
  const [submitted, setSubmitted] = useState(false);
  const benchmarkQuery = useListSalaryBenchmarks({ role, city, experienceBand: "5–8 years" });
  const calculatorBenchmark = benchmarkQuery.data?.data?.[0];
  const numericCtc = Math.max(0, Number(ctc) || 0);
  const annualVariable = numericCtc * (Number(variable) || 0) / 100;
  const fixed = Math.max(0, numericCtc - annualVariable);
  const basic = fixed * .5;
  const monthlyPf = pf === "Basic salary" ? Math.min(basic * .12, 1800) : 0;
  const annualGratuity = gratuity === "Included in CTC" ? basic * .0481 : 0;
  const taxable = Math.max(0, fixed - annualGratuity - monthlyPf * 12 - 75000);
  const tax = regime === "New regime" ? Math.max(0, taxable * .12 - 50000) : Math.max(0, taxable * .16 - 125000);
  const monthlyTakeHome = Math.max(0, (fixed - annualGratuity - tax - monthlyPf * 12) / 12);
  const rentIndex = city === "Mumbai" ? 1.08 : city === "Delhi NCR" ? 1.03 : city === "Pune" ? .92 : city === "Hyderabad" ? .88 : .96;
  const adjusted = monthlyTakeHome * rentIndex;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    trackEvent("calculator_completed", {
      tool: "ctc_calculator",
      city,
      role_category: role,
      confidence_band: calculatorBenchmark?.confidence ?? "unavailable",
      route: "/salary-calculator",
    });
  };
  return <PublicPage eyebrow="Tool / money reality" title="Decode the offer before you accept it." intro="CTC is a useful headline and a poor monthly budget. Separate fixed cash, variable pay, statutory deductions, and tax so the number you negotiate is the number you can live on.">
    <div className="grid gap-5 lg:grid-cols-[.92fr_1.08fr]">
      <form onSubmit={submit} className="surface-lift rounded-[20px] border border-border bg-card p-5 sm:p-7">
        <div className="flex items-center justify-between border-b border-border pb-5"><div><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Inputs</p><h2 className="mt-2 font-display text-3xl">Your offer</h2></div><span className="rounded-full bg-muted px-3 py-1.5 font-data text-[9px] text-muted-foreground">60 seconds</span></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Annual CTC (₹)" hint="Use the number on the offer letter."><Input value={ctc} onChange={setCtc} type="number" min="1" /></Field>
          <Field label="Variable pay (% of CTC)" hint="Bonus, incentive, or performance pay."><Input value={variable} onChange={setVariable} type="number" min="0" step=".5" /></Field>
          <Field label="Target role"><Select value={role} onChange={setRole} options={roleOptions} /></Field>
          <Field label="PF basis"><Select value={pf} onChange={setPf} options={["Basic salary", "Not deducted"]} /></Field>
          <Field label="Gratuity"><Select value={gratuity} onChange={setGratuity} options={["Included in CTC", "Outside CTC"]} /></Field>
          <Field label="Tax regime"><Select value={regime} onChange={setRegime} options={["New regime", "Old regime"]} /></Field>
          <Field label="Work city"><Select value={city} onChange={setCity} options={cityOptions} /></Field>
        </div>
        {numericCtc <= 0 && <p className="mt-4 flex items-center gap-2 text-[11px] text-destructive"><CircleAlert size={14} /> Add a CTC greater than zero to see a result.</p>}
         <button type="submit" disabled={numericCtc <= 0} className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-[0_8px_18px_hsl(var(--primary)/.14)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_22px_hsl(var(--primary)/.2)] disabled:cursor-not-allowed disabled:opacity-45">Show my in-hand <ArrowUpRight size={15} /></button>
      </form>
      <div className="space-y-5">
        {!submitted ? <div className="paper-grid flex min-h-[360px] flex-col justify-end rounded-[20px] border border-border p-6 sm:p-8"><p className="font-data text-[10px] uppercase tracking-[.16em] text-muted-foreground">Result preview</p><p className="mt-3 max-w-[410px] font-display text-4xl leading-[.95] sm:text-5xl">A CTC number is not a salary.</p><p className="mt-5 max-w-[390px] text-[12px] leading-[1.7] text-muted-foreground">Submit your inputs and we will show the cash that reaches your account, the pay that is conditional, and the assumptions behind the estimate.</p></div> :
          <ResultPanel><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Estimated monthly take-home</p><p className="mt-2 font-display text-5xl tracking-[-.05em]">₹{Math.round(monthlyTakeHome).toLocaleString("en-IN")}</p><p className="mt-2 text-[11px] text-muted-foreground">Cash estimate for {city}, after PF and {regime.toLowerCase()} tax.</p></div><FreshnessBadge label="Illustrative estimate" confidence="Medium" /></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border bg-background/70 p-4"><p className="text-[10px] font-bold text-muted-foreground">Fixed gross / month</p><p className="mt-2 font-data text-xl">₹{Math.round(fixed / 12).toLocaleString("en-IN")}</p></div><div className="rounded-xl border border-border bg-background/70 p-4"><p className="text-[10px] font-bold text-muted-foreground">Variable at risk / year</p><p className="mt-2 font-data text-xl text-accent">₹{Math.round(annualVariable).toLocaleString("en-IN")}</p></div><div className="rounded-xl border border-border bg-background/70 p-4"><p className="text-[10px] font-bold text-muted-foreground">PF / month</p><p className="mt-2 font-data text-xl">₹{Math.round(monthlyPf).toLocaleString("en-IN")}</p></div><div className="rounded-xl border border-border bg-background/70 p-4"><p className="text-[10px] font-bold text-muted-foreground">City-adjusted cash lens</p><p className="mt-2 font-data text-xl">₹{Math.round(adjusted).toLocaleString("en-IN")}</p></div></div>
             <div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border bg-background/70 p-4"><p className="text-[10px] font-bold text-muted-foreground">{role} market median</p><p className="mt-2 font-data text-xl">{calculatorBenchmark ? formatLakhs(calculatorBenchmark.median) : "Unavailable"}</p></div><div className="rounded-xl border border-border bg-background/70 p-4"><p className="text-[10px] font-bold text-muted-foreground">Offer vs market</p><p className="mt-2 font-data text-xl">{calculatorBenchmark ? `${((numericCtc / calculatorBenchmark.median - 1) * 100).toFixed(1)}%` : "Unavailable"}</p></div></div>
            <div className="mt-6 border-t border-border pt-5"><p className="text-[11px] font-bold">Methodology, in plain language</p><p className="mt-2 text-[11px] leading-[1.7] text-muted-foreground">We remove variable pay, estimate basic at 50% of fixed gross, apply the selected PF and gratuity assumptions, then use a simplified annual tax estimate. This is a planning read, not tax advice. Freshness: tax assumptions reviewed August 2026.</p></div>
            {benchmarkQuery.isError && <p className="mt-4 text-[10px] text-destructive">The market comparison is temporarily unavailable; the in-hand estimate is based on your offer inputs only.</p>}
             <div className="mt-6 border-t border-border pt-5"><p className="mb-3 text-[11px] font-bold">Keep this decision</p><SaveDecisionButton slug={`ctc-${role.toLowerCase().replaceAll(" ", "-")}`} title={`${role} offer decision`} kind="salary" eventName="workspace_decision_created" summary={`CTC decoded for ${role} in ${city}: estimated monthly take-home ₹${Math.round(monthlyTakeHome).toLocaleString("en-IN")}.`} signal={calculatorBenchmark ? `Offer is ${((numericCtc / calculatorBenchmark.median - 1) * 100).toFixed(1)}% versus the market median.` : "Market comparison unavailable; review the offer assumptions again."} /></div>
          </ResultPanel>}
        <div className="rounded-[18px] border border-border bg-secondary/45 p-5"><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Before you sign</p><p className="mt-3 text-[13px] leading-[1.65]">Ask whether variable pay is target or guaranteed, whether gratuity is inside CTC, and what your first three monthly payslips will include.</p></div>
      </div>
    </div>
  </PublicPage>;
}

export function RiskAnalyzerPage() {
  const [notice, setNotice] = useState("90 days");
  const [bond, setBond] = useState("No bond");
  const [pressure, setPressure] = useState("Manageable");
  const [runway, setRunway] = useState("4–6 months");
  const [offer, setOffer] = useState("Written offer");
  const [submitted, setSubmitted] = useState(false);
  const values = { notice: notice === "90 days" ? 22 : notice === "60 days" ? 15 : 7, bond: bond === "No bond" ? 0 : bond === "Under 6 months" ? 10 : 20, pressure: pressure === "Manageable" ? 2 : pressure === "High" ? 13 : 24, runway: runway === "4–6 months" ? 4 : runway === "7+ months" ? 0 : 18, offer: offer === "Written offer" ? 0 : offer === "Verbal only" ? 14 : 24 };
  const score = Object.values(values).reduce((sum, value) => sum + value, 0);
  const level = score < 25 ? "Low friction" : score < 50 ? "Proceed with a plan" : "High exposure";
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    trackEvent("risk_analysis_completed", {
      tool: "resignation_risk",
      risk_band: level,
      confidence_band: offer,
      route: "/resignation-risk",
    });
  };
  return <PublicPage eyebrow="Tool / timing" title="Should you resign now, or prepare first?" intro="A resignation is not only a feeling. Notice period, financial runway, contractual friction, and offer quality change the risk of the same decision.">
    <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
       <form onSubmit={submit} className="surface-lift rounded-[20px] border border-border bg-card p-5 sm:p-7"><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Five signals</p><h2 className="mt-2 font-display text-3xl">Name the friction.</h2><div className="mt-7 grid gap-4">
        <Field label="Notice period"><Select value={notice} onChange={setNotice} options={["30 days", "60 days", "90 days"]} /></Field>
        <Field label="Bond or repayment exposure"><Select value={bond} onChange={setBond} options={["No bond", "Under 6 months", "6 months or more"]} /></Field>
        <Field label="Manager pressure"><Select value={pressure} onChange={setPressure} options={["Manageable", "High", "Unhealthy"]} /></Field>
        <Field label="Cash runway after resigning"><Select value={runway} onChange={setRunway} options={["Under 3 months", "4–6 months", "7+ months"]} /></Field>
        <Field label="Offer confidence"><Select value={offer} onChange={setOffer} options={["Written offer", "Verbal only", "No offer yet"]} /></Field>
       </div><button type="submit" className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-[0_8px_18px_hsl(var(--primary)/.14)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_12px_22px_hsl(var(--primary)/.2)]">Read my risk <ArrowUpRight size={15} /></button></form>
      {!submitted ? <div className="paper-grid flex min-h-[500px] flex-col justify-end rounded-[20px] border border-border p-6 sm:p-8"><p className="font-data text-[10px] uppercase tracking-[.16em] text-muted-foreground">A useful score is not a verdict</p><p className="mt-3 max-w-[410px] font-display text-4xl leading-[.95] sm:text-5xl">The same resignation can be brave or expensive.</p><p className="mt-5 max-w-[390px] text-[12px] leading-[1.7] text-muted-foreground">Answer five questions to see which friction is carrying the most weight.</p></div> :
        <ResultPanel><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Resignation exposure</p><p className="mt-2 font-display text-6xl tracking-[-.06em]">{score}<span className="text-2xl text-muted-foreground"> / 100</span></p><p className="mt-2 text-[13px] font-bold">{level}</p></div><FreshnessBadge label="Model v1.2" confidence="Medium" /></div><div className="mt-8 space-y-4">{[["Notice period", values.notice], ["Bond exposure", values.bond], ["Manager pressure", values.pressure], ["Financial runway", values.runway], ["Offer confidence", values.offer]].map(([label, value]) => <div key={label as string}><div className="flex justify-between text-[11px]"><span>{label as string}</span><span className="font-data text-muted-foreground">{value as number} pts</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, Number(value) * 4)}%` }} /></div></div>)}</div><div className="mt-7 border-t border-border pt-5"><p className="text-[11px] font-bold">Your next step</p><p className="mt-2 text-[12px] leading-[1.7] text-muted-foreground">{score > 50 ? "Do not resign into uncertainty yet. Verify the offer, add runway, and document the bond terms before setting a date." : "Create a written exit timeline. Verify the joining date, calculate your notice cash cost, and keep one month of flexibility."}</p></div></ResultPanel>}
    </div>
  </PublicPage>;
}

export function LayoffRadarPage() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get("query") ?? "");
  const [filter, setFilter] = useState("All signals");
  const [open, setOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [reportConfidence, setReportConfidence] = useState("Medium");
  const signalType =
    filter === "All signals"
      ? undefined
      : (filter as ListLayoffSignalsParams["type"]);
  const signalsQuery = useListLayoffSignals({ query: query || undefined, type: signalType });
  const submitReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReported(true);
    trackEvent("signal_report_submitted", {
      tool: "layoff_radar",
      confidence_band: reportConfidence,
      route: "/layoff-radar",
    });
  };
  return <PublicPage eyebrow="Desk / company signals" title="Layoffs are a pattern before they are a headline." intro="Search the signal table, check confidence, and add a report if your team is showing a meaningful change. We publish uncertainty instead of pretending every rumour is a fact.">
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-border bg-card p-4"><div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3"><Search size={16} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company or signal" className="h-10 w-full bg-transparent text-sm outline-none" /></div><div className="flex items-center gap-2"><Filter size={15} className="text-muted-foreground" /><select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-xl border border-border bg-background px-3 text-[11px] font-bold"><option>All signals</option><option>Layoff</option><option>Hiring freeze</option><option>Hiring signal</option><option>Restructure</option></select></div><button onClick={() => { setOpen(true); setReported(false); }} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-[11px] font-bold text-primary-foreground">Report a signal <ArrowUpRight size={14} /></button></div>
    <div className="mt-5 overflow-hidden rounded-[18px] border border-border bg-card"><div className="hidden grid-cols-[1.1fr_2fr_.8fr_.7fr] gap-4 border-b border-border bg-muted/45 px-5 py-3 font-data text-[9px] uppercase tracking-[.12em] text-muted-foreground sm:grid"><span>Company</span><span>Signal</span><span>Date</span><span>Confidence</span></div>{signalsQuery.isPending ? <div className="p-12 text-center"><p className="font-display text-2xl">Reading the latest signals…</p><p className="mt-2 text-[12px] text-muted-foreground">Checking the current public dataset.</p></div> : signalsQuery.isError ? <div className="p-12 text-center"><CircleAlert className="mx-auto text-destructive" /><p className="mt-4 font-display text-2xl">The radar is unavailable.</p><p className="mt-2 text-[12px] text-muted-foreground">Try again in a moment; no stale signal is being presented as current.</p><button type="button" onClick={() => void signalsQuery.refetch()} className="mt-5 text-[11px] font-bold text-primary">Retry</button></div> : signalsQuery.data.data.length === 0 ? <div className="p-12 text-center"><SlidersHorizontal className="mx-auto text-muted-foreground" /><p className="mt-4 font-display text-2xl">No signals match that search.</p><p className="mt-2 text-[12px] text-muted-foreground">Try a broader company name or clear the filter.</p></div> : signalsQuery.data.data.map((item) => <div key={item.id} className="grid gap-3 border-b border-border px-5 py-5 last:border-0 sm:grid-cols-[1.1fr_2fr_.8fr_.7fr] sm:items-center sm:gap-4"><div><p className="font-semibold">{item.company}</p><p className="mt-1 text-[10px] text-muted-foreground sm:hidden">{formatDate(item.observedAt)} · {item.confidence} confidence</p><div className="mt-3 sm:hidden"><WatchlistButton company={item.company} signal={item.signal} note="Track this layoff or hiring signal." /></div></div><div><p className="text-[12px] leading-[1.55]">{item.signal}</p><p className="mt-1 text-[10px] text-muted-foreground">{item.type} · {item.source}</p></div><span className="hidden font-data text-[10px] text-muted-foreground sm:block">{formatDate(item.observedAt)}</span><div><span className="w-fit rounded-full bg-secondary px-2.5 py-1 font-data text-[9px] text-foreground">{item.confidence}</span><div className="mt-3 hidden sm:block"><WatchlistButton company={item.company} signal={item.signal} note="Track this layoff or hiring signal." /></div></div></div>)}</div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><FreshnessBadge label={signalsQuery.data ? `Refreshed ${formatDate(signalsQuery.data.meta.refreshedAt)}` : "Refreshing dataset"} confidence={signalsQuery.data?.meta.confidence ?? "Mixed"} /><p className="text-[11px] text-muted-foreground">Signals are directional, not an employment forecast.</p></div>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4" role="dialog" aria-modal="true"><form onSubmit={submitReport} className="w-full max-w-[500px] rounded-[20px] border border-border bg-background p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Community signal</p><h2 className="mt-2 font-display text-3xl">Report a change</h2></div><button type="button" onClick={() => setOpen(false)} className="text-[11px] font-bold text-muted-foreground">Close</button></div>{reported ? <div className="mt-8 rounded-xl border border-primary/25 bg-primary/10 p-5"><Check className="text-primary" size={20} /><p className="mt-3 font-bold">Signal received locally.</p><p className="mt-2 text-[12px] leading-[1.6] text-muted-foreground">Thank you. In the live product, this report would enter a moderation and confidence review queue.</p><button type="button" onClick={() => setOpen(false)} className="mt-5 text-[11px] font-bold text-primary">Return to radar</button></div> : <><div className="mt-7 grid gap-4"><Field label="Company"><Input value={undefined} onChange={() => undefined} placeholder="Company name" required /></Field><Field label="What changed?"><textarea required minLength={15} placeholder="Describe the signal without naming individuals." className="min-h-[110px] w-full rounded-xl border border-border bg-background p-3 text-sm outline-none" /></Field><Field label="Source confidence"><Select value={reportConfidence} onChange={setReportConfidence} options={["Low", "Medium", "High"]} /></Field></div><p className="mt-4 text-[10px] leading-[1.6] text-muted-foreground">Please do not include names, emails, or private documents.</p><button type="submit" className="mt-6 h-12 w-full rounded-xl bg-primary text-xs font-bold text-primary-foreground">Submit signal</button></>}</form></div>}
  </PublicPage>;
}

export function SalaryRealityPage() {
  const [role, setRole] = useState("Software engineer");
  const [city, setCity] = useState("Bengaluru");
  const [experience, setExperience] = useState("5–8 years");
  const benchmarksQuery = useListSalaryBenchmarks({ role, city, experienceBand: experience });
  const benchmark = benchmarksQuery.data?.data[0];
  useEffect(() => {
    if (benchmark) {
      trackEvent("salary_benchmark_viewed", {
        tool: "salary_reality",
        city,
        role_category: role,
        experience_band: experience,
        confidence_band: benchmark.confidence,
        route: "/salary-reality",
      });
    }
  }, [benchmark, city, experience, role]);
  return <PublicPage eyebrow="Desk / salary reality" title="What does your role actually pay here?" intro="A benchmark is useful when it names the city, experience, and distribution behind the headline. Start with a market band, then decode a specific offer.">
    <div className="rounded-[20px] border border-border bg-card p-5 sm:p-7"><div className="grid gap-4 md:grid-cols-3"><Field label="Role"><Select value={role} onChange={setRole} options={["Software engineer", "Product manager", "Data analyst"]} /></Field><Field label="City"><Select value={city} onChange={setCity} options={["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune"]} /></Field><Field label="Experience"><Select value={experience} onChange={setExperience} options={["0–2 years", "3–5 years", "5–8 years", "9+ years"]} /></Field></div>{benchmarksQuery.isPending ? <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-8 text-center"><p className="font-display text-2xl">Reading the market band…</p></div> : benchmarksQuery.isError ? <div className="mt-8 rounded-xl border border-destructive/25 bg-destructive/5 p-8 text-center"><CircleAlert className="mx-auto text-destructive" /><p className="mt-4 font-display text-2xl">The benchmark is unavailable.</p><button type="button" onClick={() => void benchmarksQuery.refetch()} className="mt-4 text-[11px] font-bold text-primary">Retry</button></div> : !benchmark ? <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-8 text-center"><p className="font-display text-2xl">No benchmark for this combination yet.</p><p className="mt-2 text-[12px] text-muted-foreground">Try another role, city, or experience band.</p></div> : <><div className="mt-8 grid gap-3 sm:grid-cols-3">{[["P25", benchmark.p25], ["Median", benchmark.median], ["P75", benchmark.p75]].map(([name, value], index) => <div key={name as string} className={`rounded-xl border p-5 ${index === 1 ? "border-primary bg-primary/10" : "border-border bg-background"}`}><p className="font-data text-[10px] uppercase tracking-[.12em] text-muted-foreground">{name as string}</p><p className="mt-3 font-display text-4xl">{formatLakhs(value as number)}</p><p className="mt-2 text-[10px] text-muted-foreground">annual total CTC</p></div>)}</div><div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5"><div><p className="text-[12px] font-bold">{role} · {city} · {experience}</p><p className="mt-1 text-[11px] text-muted-foreground">{benchmark.source} · {benchmark.sampleSize} reported snapshots</p></div><FreshnessBadge label={`Reviewed ${formatDate(benchmark.refreshedAt)}`} confidence={benchmark.confidence} /></div></>}</div>
    <div className="mt-5 grid gap-5 md:grid-cols-[1.2fr_.8fr]"><div className="rounded-[18px] border border-border bg-secondary/35 p-6"><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Read the band</p><p className="mt-3 text-[13px] leading-[1.7]">The median is not a promise. Company stage, interview leverage, equity, and how much of the CTC is variable can move an offer substantially. Use the 25th percentile as a floor for a careful conversation, not as a verdict on your value.</p></div><div className="rounded-[18px] border border-border bg-card p-6"><p className="font-display text-2xl">Have an offer?</p><p className="mt-2 text-[11px] leading-[1.6] text-muted-foreground">See what reaches your bank account after tax, PF, gratuity, and variable pay.</p><Link href={`/salary-calculator?role=${encodeURIComponent(role)}&city=${encodeURIComponent(city)}`} className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold text-primary">Decode this offer <ArrowUpRight size={14} /></Link>{benchmark && <div className="mt-5 border-t border-border pt-4"><p className="text-[11px] font-bold">Keep this benchmark</p><div className="mt-3"><SaveDecisionButton slug={`salary-${role.toLowerCase().replaceAll(" ", "-")}-${city.toLowerCase().replaceAll(" ", "-")}`} title={`${role} salary reality in ${city}`} kind="salary" eventName="workspace_decision_created" summary={`${role} in ${city}, ${experience}: ${formatLakhs(benchmark.median)} median CTC.`} signal={`${formatLakhs(benchmark.p25)}–${formatLakhs(benchmark.p75)} market range from ${benchmark.sampleSize} reported snapshots.`} /></div></div>}</div></div>
  </PublicPage>;
}

export function CompaniesPage() {
  const [query, setQuery] = useState("");
  const companiesQuery = useListPublicCompanySignals({ query: query || undefined });
  return <PublicPage eyebrow="Desk / company intelligence" title="Know the company behind the offer." intro="Stability is not a feeling. It is a set of imperfect signals: operating momentum, hiring shape, and what changed most recently.">
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3"><Search size={16} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a company or sector" className="h-12 w-full bg-transparent text-sm outline-none" /></div>
    {companiesQuery.isPending ? <div className="mt-5 rounded-[18px] border border-border p-12 text-center"><p className="font-display text-3xl">Reading company signals…</p><p className="mt-2 text-[12px] text-muted-foreground">Checking the current public dataset.</p></div> : companiesQuery.isError ? <div className="mt-5 rounded-[18px] border border-destructive/25 bg-destructive/5 p-12 text-center"><CircleAlert className="mx-auto text-destructive" /><p className="mt-4 font-display text-3xl">Company intelligence is unavailable.</p><button type="button" onClick={() => void companiesQuery.refetch()} className="mt-5 text-[11px] font-bold text-primary">Retry</button></div> : companiesQuery.data.data.length === 0 ? <div className="mt-5 rounded-[18px] border border-border p-12 text-center"><p className="font-display text-3xl">No company read yet.</p><p className="mt-2 text-[12px] text-muted-foreground">Try a different spelling, or ask us to add a company.</p><Link href="/contact" className="mt-5 inline-flex text-[11px] font-bold text-primary">Request a company read <ArrowUpRight size={14} /></Link></div> : <div className="mt-5 grid gap-3 md:grid-cols-2">{companiesQuery.data.data.map((company) => <Link key={company.id} href={`/companies/${company.slug}`} className="group rounded-[18px] border border-border bg-card p-5 transition-transform hover:-translate-y-1 hover:border-primary/60"><div className="flex items-start justify-between"><div><p className="font-display text-2xl">{company.name}</p><p className="mt-1 text-[10px] uppercase tracking-[.14em] text-muted-foreground">{company.sector}</p></div><ArrowUpRight size={16} className="text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl bg-muted/70 p-3"><p className="text-[9px] font-bold text-muted-foreground">Stability</p><p className="mt-1 font-data text-xl">{company.stability}<span className="text-xs text-muted-foreground"> / 100</span></p></div><div className="rounded-xl bg-muted/70 p-3"><p className="text-[9px] font-bold text-muted-foreground">Momentum</p><p className="mt-1 text-sm font-bold">{company.momentum}</p></div></div><p className="mt-4 text-[12px] leading-[1.6] text-muted-foreground">{company.signal}</p><div className="mt-4 flex items-center justify-between border-t border-border pt-3"><span className="font-data text-[9px] text-muted-foreground">Updated {formatDate(company.refreshedAt)}</span><span className="text-[10px] font-bold text-primary">{company.confidence} confidence</span></div></Link>)}</div>}
    {!companiesQuery.isPending && !companiesQuery.isError && companiesQuery.data && <div className="mt-5"><FreshnessBadge label={`Dataset refreshed ${formatDate(companiesQuery.data.meta.refreshedAt)}`} confidence={companiesQuery.data.meta.confidence} /></div>}
  </PublicPage>;
}

export function CompanyDetailPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const companyQuery = useGetPublicCompanySignal(slug);
  const company = companyQuery.data?.data;
  useEffect(() => {
    if (company) {
      trackEvent("company_viewed", {
        catalog_slug: slug,
        confidence_band: company.confidence,
        route: "/companies/:slug",
      });
    }
  }, [company, slug]);
  if (companyQuery.isPending) {
    return <PublicPage eyebrow="Company read / intelligence" title="Reading the company signal…" intro="Checking the latest explainable read on stability, hiring momentum, and what changed most recently."><div /></PublicPage>;
  }
  if (companyQuery.isError || !company) {
    return <PublicPage eyebrow="Company read / intelligence" title="This company signal is unavailable." intro="The company may not be in the current dataset, or the public signal service is temporarily unavailable."><Link href="/companies" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[11px] font-bold text-primary-foreground">Back to companies <ArrowUpRight size={14} /></Link></PublicPage>;
  }
  return <PublicPage eyebrow="Company read / intelligence" title={company.name} intro={`${company.sector} · a current, explainable read on stability, hiring momentum, and the signal most worth verifying.`}><div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><ResultPanel><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Current stability read</p><p className="mt-3 font-display text-7xl">{company.stability}</p><p className="mt-1 text-[11px] text-muted-foreground">out of 100 · {company.confidence} confidence</p><div className="mt-7 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${company.stability}%` }} /></div><div className="mt-7 border-t border-border pt-5"><p className="text-[11px] font-bold">Hiring momentum</p><p className="mt-2 text-[14px] font-display">{company.momentum}</p></div></ResultPanel><div className="rounded-[20px] border border-border bg-card p-6 sm:p-8"><FreshnessBadge label={`Observed ${formatDate(company.observedAt)} · refreshed ${formatDate(company.refreshedAt)}`} confidence={company.confidence} /><h2 className="mt-8 font-display text-4xl">Latest signal</h2><p className="mt-4 text-[15px] leading-[1.75]">{company.signal}</p><p className="mt-4 text-[11px] text-muted-foreground">Source: {company.source}</p><div className="mt-8 border-t border-border pt-5"><p className="font-data text-[9px] uppercase tracking-[.14em] text-primary">What to verify</p><ul className="mt-3 space-y-3 text-[12px] leading-[1.6] text-muted-foreground"><li>• Ask which team owns the role and whether it is a backfill.</li><li>• Confirm the review cycle and headcount approval in writing.</li><li>• Compare the offer with the current market band.</li></ul></div><div className="mt-8 border-t border-border pt-5"><p className="mb-3 text-[11px] font-bold">Keep watching this company</p><WatchlistButton company={company.name} signal={company.signal} note="Track this company while deciding whether to pursue or accept an offer." /></div></div></div><div className="mt-5 flex flex-wrap gap-3"><Link href="/salary-reality" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[11px] font-bold text-primary-foreground">Compare salary reality <ArrowUpRight size={14} /></Link><Link href={`/layoff-radar?query=${encodeURIComponent(company.name)}`} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-[11px] font-bold">See this company on layoff radar</Link></div></PublicPage>;
}

export function SalaryDropPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [experience, setExperience] = useState("5–8 years");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const salary = String(form.get("salary") ?? "");
    const role = String(form.get("role") ?? "");
    if (Number(salary) < 100000 || !role) {
      setError("Add a realistic annual salary and your role before sharing.");
      return;
    }
    setError("");
    setSent(true);
    trackEvent("salary_contribution_submitted", {
      tool: "salary_drop",
      city,
      experience_band: experience,
      route: "/salary-drop",
    });
  };
  return <PublicPage eyebrow="Contribute / salary reality" title="Make the next salary benchmark less imaginary." intro="Share an anonymous salary snapshot so another professional can negotiate with more context. No account, employer name, email, phone number, or identifying detail is required.">
    <div className="grid gap-5 lg:grid-cols-[1fr_.72fr]"><form onSubmit={submit} className="rounded-[20px] border border-border bg-card p-6 sm:p-8">{sent ? <div className="flex min-h-[390px] flex-col justify-center"><Check size={24} className="text-primary" /><h2 className="mt-5 font-display text-4xl">Contribution recorded.</h2><p className="mt-4 max-w-[420px] text-[13px] leading-[1.7] text-muted-foreground">Thank you. Your snapshot is shown as an aggregated, privacy-safe signal after review. It will not be published as a personal profile.</p><button type="button" onClick={() => setSent(false)} className="mt-7 w-fit text-[11px] font-bold text-primary">Share another snapshot</button></div> : <><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Anonymous snapshot</p><h2 className="mt-2 font-display text-3xl">Only the useful numbers.</h2><div className="mt-7 grid gap-4 sm:grid-cols-2"><Field label="Role"><Input name="role" value={undefined} onChange={() => undefined} placeholder="Software engineer" /></Field><Field label="Annual CTC (₹)"><Input name="salary" value={undefined} onChange={() => undefined} type="number" min="100000" placeholder="2400000" /></Field><Field label="City"><Select value={city} onChange={setCity} options={["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Other"]} /></Field><Field label="Experience"><Select value={experience} onChange={setExperience} options={["0–2 years", "3–5 years", "5–8 years", "9+ years"]} /></Field></div>{error && <p className="mt-4 flex items-center gap-2 text-[11px] text-destructive"><CircleAlert size={14} /> {error}</p>}<button type="submit" className="mt-7 h-12 w-full rounded-xl bg-primary text-xs font-bold text-primary-foreground">Contribute anonymously</button></>}</form><div className="rounded-[20px] border border-border bg-secondary/40 p-6 sm:p-8"><ShieldCheck className="text-primary" size={22} /><h2 className="mt-5 font-display text-3xl">No PII. Explicitly.</h2><p className="mt-4 text-[12px] leading-[1.7] text-muted-foreground">We do not ask for your name, employer, email, phone, profile link, or exact joining date. Avoid putting identifying information into free-text fields. Small groups may be withheld from the public benchmark.</p><div className="mt-8 border-t border-border pt-5"><p className="font-data text-[9px] uppercase tracking-[.14em] text-primary">How it helps</p><p className="mt-2 text-[12px] leading-[1.7]">More useful ranges. Better city context. Less salary folklore.</p></div></div></div>
  </PublicPage>;
}

export function EscapePlanPage() {
  const [goal, setGoal] = useState("A better role");
  const [weeks, setWeeks] = useState("8 weeks");
  const [checked, setChecked] = useState<string[]>([]);
  const tasks = ["Write the role you want in one sentence", "Benchmark three target companies", "Update one proof-of-work project", "Have a compensation conversation", "Create a six-week application rhythm"];
  const progress = Math.round(checked.length / tasks.length * 100);
  useEffect(() => {
    if (progress === 100) {
      trackEvent("escape_plan_completed", {
        tool: "escape_plan",
        goal,
        duration_band: weeks,
        route: "/escape-plan",
      });
    }
  }, [goal, progress, weeks]);
  return <PublicPage eyebrow="Tool / next move" title="A way out is easier to trust when it has a sequence." intro="Build a small exit plan around the decision you actually want: a better role, more money, a healthier team, or a different kind of work.">
    <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-[20px] border border-border bg-card p-6 sm:p-8"><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Set the direction</p><h2 className="mt-2 font-display text-3xl">What changes first?</h2><div className="mt-7 grid gap-4"><Field label="Primary goal"><Select value={goal} onChange={setGoal} options={["A better role", "More money", "A healthier team", "A different career"]} /></Field><Field label="Time you can give"><Select value={weeks} onChange={setWeeks} options={["4 weeks", "8 weeks", "12 weeks"]} /></Field></div><div className="mt-8 rounded-xl bg-secondary/50 p-4"><p className="font-data text-[9px] uppercase tracking-[.13em] text-primary">Planning note</p><p className="mt-2 text-[12px] leading-[1.6] text-muted-foreground">A plan that fits your current energy will beat an ambitious plan you abandon in week two.</p></div></div><div className="rounded-[20px] border border-border bg-card p-6 sm:p-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Your checklist</p><h2 className="mt-2 font-display text-3xl">{goal}</h2></div><p className="font-data text-2xl text-primary">{progress}%</p></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div><div className="mt-7 space-y-3">{tasks.map((task) => <button key={task} onClick={() => setChecked((current) => current.includes(task) ? current.filter((item) => item !== task) : [...current, task])} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-[12px] transition-colors ${checked.includes(task) ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}><span className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${checked.includes(task) ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{checked.includes(task) && <Check size={14} />}</span>{task}</button>)}</div><div className="mt-7 border-t border-border pt-5"><p className="text-[11px] font-bold">Readiness: {progress >= 80 ? "You have a credible next move." : progress >= 40 ? "The shape is there. Keep building proof." : "Start with one small, visible action."}</p></div></div></div>
  </PublicPage>;
}

export function CareerRealityIndexPage() {
  const scores = [{ label: "Pay power", score: 72, note: "Above role median" }, { label: "Company stability", score: 64, note: "Hiring has slowed" }, { label: "Exit optionality", score: 58, note: "Notice period matters" }, { label: "AI exposure", score: 47, note: "Two tasks are shifting" }];
  return <PublicPage eyebrow="Method / the index" title="A career score is only useful when you can see its parts." intro="The Career Reality Index is a structured conversation starter, not a prophecy. It makes the trade-offs visible so you can decide which one is worth changing."><div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><div className="rounded-[20px] border border-border bg-card p-6 sm:p-8"><div className="flex items-end justify-between"><div><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Illustrative profile</p><p className="mt-2 font-display text-7xl">61<span className="text-2xl text-muted-foreground"> / 100</span></p></div><FreshnessBadge label="Index refreshed Aug 2026" confidence="Medium" /></div><div className="mt-8 grid gap-5 sm:grid-cols-2">{scores.map((item) => <div key={item.label}><div className="flex justify-between text-[11px] font-bold"><span>{item.label}</span><span className="font-data text-muted-foreground">{item.score}</span></div><div className="mt-2 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${item.score}%` }} /></div><p className="mt-2 text-[10px] text-muted-foreground">{item.note}</p></div>)}</div></div><div className="rounded-[20px] border border-border bg-secondary/45 p-6 sm:p-8"><p className="font-data text-[9px] uppercase tracking-[.16em] text-primary">Methodology</p><h2 className="mt-3 font-display text-3xl">Evidence over certainty.</h2><p className="mt-4 text-[12px] leading-[1.75] text-muted-foreground">Scores blend user-provided context with role, company, salary, and market signals. Inputs are weighted for decision usefulness, then labelled for freshness and confidence. Missing evidence lowers confidence; it does not quietly become a zero.</p><div className="mt-7 border-t border-border pt-5"><p className="text-[11px] font-bold">What the index cannot know</p><p className="mt-2 text-[11px] leading-[1.7] text-muted-foreground">Your manager's next decision, a company's private plan, or whether a new role will make you happier. Those are conversations, not data points.</p></div></div></div><div className="mt-5 rounded-[18px] border border-border p-5"><FreshnessBadge label="Sources reviewed 18 Aug 2026" confidence="Mixed" /><p className="mt-4 max-w-[720px] text-[12px] leading-[1.7] text-muted-foreground">Freshness is shown at the surface because context expires. Public filings, job movement, reported salary ranges, and community signals are reviewed on different cadences.</p></div></PublicPage>;
}

export function AiPulsePage() {
  const tasks = [{ role: "Software engineer", task: "Boilerplate implementation", impact: "High", signal: "Tools can draft first passes; review and system context remain human." }, { role: "Product manager", task: "Synthesis and status reporting", impact: "High", signal: "Automation is visible; prioritisation and stakeholder trust are not." }, { role: "Designer", task: "Variant exploration", impact: "Medium", signal: "More options arrive faster; taste and constraint-setting carry more weight." }, { role: "Data analyst", task: "Recurring reporting", impact: "High", signal: "Narrative dashboards are easier to produce; metric definition is the moat." }];
  return <PublicPage eyebrow="Desk / future of work" title="AI is changing tasks before it changes job titles." intro="Track the work that is shifting, the work that is becoming more valuable, and the evidence we are using to say so."><div className="grid gap-5 lg:grid-cols-[.7fr_1.3fr]"><div className="rounded-[20px] bg-[#263138] p-6 text-[#f2eadc] sm:p-8"><p className="font-data text-[9px] uppercase tracking-[.16em] text-[#83c9b4]">Current pulse</p><p className="mt-3 font-display text-7xl">3.2<span className="text-2xl text-[#afbbb5]"> / 5</span></p><p className="mt-2 text-[13px] text-[#c7d0c9]">moderate impact on day-to-day work</p><div className="mt-8 border-t border-[#46545a] pt-5"><p className="text-[11px] font-bold">Useful response</p><p className="mt-2 text-[12px] leading-[1.7] text-[#afbbb5]">Move closer to the decisions, constraints, and domain context that tools cannot own.</p></div></div><div className="overflow-hidden rounded-[20px] border border-border bg-card"><div className="hidden grid-cols-[1fr_1fr_.7fr] gap-4 border-b border-border bg-muted/45 px-5 py-3 font-data text-[9px] uppercase tracking-[.12em] text-muted-foreground sm:grid"><span>Role</span><span>Task shifting</span><span>Impact</span></div>{tasks.map((item) => <div key={item.task} className="grid gap-2 border-b border-border px-5 py-5 last:border-0 sm:grid-cols-[1fr_1fr_.7fr] sm:items-center sm:gap-4"><div><p className="font-semibold">{item.role}</p></div><div><p className="text-[12px]">{item.task}</p><p className="mt-1 text-[10px] leading-[1.5] text-muted-foreground">{item.signal}</p></div><span className="w-fit rounded-full bg-accent/15 px-2.5 py-1 font-data text-[9px] text-accent">{item.impact}</span></div>)}</div></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><FreshnessBadge label="Pulse reviewed Aug 2026" confidence="Medium" /><Link href="/article/ai-upskilling-trap-india-api-wrapper-reality" className="text-[11px] font-bold text-primary">Read the upskilling trap <ArrowUpRight size={14} /></Link></div></PublicPage>;
}
