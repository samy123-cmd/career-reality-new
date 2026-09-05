import { useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, BarChart3, BrainCircuit, Building2, Check, ChevronRight, CircleHelp, Eye, FileText, LockKeyhole, Search, ShieldCheck, TrendingDown, TrendingUp, X, Zap } from 'lucide-react';
import { AppNav } from '@/components/shared/app-nav';
import { PublicFooter } from '@/components/shared/public-shell';
import { trackEvent } from '@/lib/analytics';
// Replacing non-existent ScaleIcon with BarChart3 for now.
const ScaleIcon = BarChart3;

type Tool = {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  stat: string;
  statLabel: string;
};

const tools: Tool[] = [
  { id: 'ctc', label: '01 / MONEY', title: 'CTC decoder', description: 'See what your offer really means after tax, variable pay, and the cost of staying put.', icon: BarChart3, color: 'teal', stat: '₹18.4L', statLabel: 'median decoded CTC' },
  { id: 'stability', label: '02 / COMPANY', title: 'Company intelligence', description: 'A grounded view of business health, funding runway, employee movement, and signals.', icon: Building2, color: 'coral', stat: '64 / 100', statLabel: 'stability index' },
  { id: 'risk', label: '03 / TIMING', title: 'Resignation risk', description: 'Find the cost of a move before the counter-offer, notice period, and uncertainty find you.', icon: TrendingDown, color: 'ochre', stat: '12.8%', statLabel: 'role-level risk' },
  { id: 'ai', label: '04 / FUTURE', title: 'AI pulse', description: 'Separate useful signal from panic. Track how AI is changing your role, not just headlines.', icon: BrainCircuit, color: 'ink', stat: '3.2 / 5', statLabel: 'impact on work' },
];

const signalRows = [
  { label: 'Compensation', value: '₹24.8L', detail: '+14.2% vs market', tone: 'teal', width: '78%' },
  { label: 'Company stability', value: '64 / 100', detail: 'Watch: hiring slowed', tone: 'coral', width: '64%' },
  { label: 'Resignation risk', value: 'Low–medium', detail: 'Notice period is a factor', tone: 'ochre', width: '48%' },
  { label: 'AI exposure', value: 'Moderate', detail: '2 tasks likely to shift', tone: 'ink', width: '56%' },
];

function SignalBars() {
  return (
    <div className="signal-scan relative h-[258px] overflow-hidden rounded-[18px] border border-[#3d4a51] bg-[#263138] p-5 text-[#f2eadc] shadow-[0_24px_60px_hsl(var(--foreground)/.16)]">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#b6c4bd 1px, transparent 1px), linear-gradient(90deg, #b6c4bd 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[#a9b9b3]">Your career surface</p>
          <p className="mt-1 text-sm font-semibold">One decision. Four signals.</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-[#64736e] px-2 py-1 font-data text-[9px] text-[#b8c9c0]"><span className="pulse-dot size-1.5 rounded-full bg-[#83c9b4]" /> LIVE SAMPLE</span>
      </div>
      <div className="relative mt-6 space-y-3">
        {signalRows.map((row) => (
          <div key={row.label} className="grid grid-cols-[108px_1fr_82px] items-center gap-2 text-[10px]">
            <span className="text-[#bac7c0]">{row.label}</span>
            <div className="h-2 overflow-hidden rounded-full bg-[#46545a]">
              <div className={`h-full rounded-full transition-transform duration-700 ${row.tone === 'teal' ? 'bg-[#83c9b4]' : row.tone === 'coral' ? 'bg-[#e88c77]' : row.tone === 'ochre' ? 'bg-[#e5b755]' : 'bg-[#b8c7d0]'}`} style={{ width: row.width }} />
            </div>
            <span className="text-right font-data text-[9px] text-[#e2d9c9]">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between border-t border-[#435159] pt-3">
        <span className="font-data text-[9px] text-[#8fa099]">LAST UPDATED AUG 2026</span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#83c9b4]"><span className="size-1.5 rounded-full bg-[#83c9b4]" /> Based on 18,432 signals</span>
      </div>
    </div>
  );
}

function CtcDecoder() {
  const [salary, setSalary] = useState('2400000');
  const [city, setCity] = useState('Bengaluru');
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); setSubmitted(true); };
  const monthly = Math.round(Number(salary || 0) * 0.71 / 12);
  return (
    <section id="ctc-decoder" className="relative overflow-hidden rounded-[22px] border border-border bg-secondary/70 p-6 sm:p-8" data-testid="section-ctc-decoder">
      <div className="absolute right-0 top-0 h-36 w-36 translate-x-1/3 -translate-y-1/3 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative flex flex-wrap items-start justify-between gap-5">
        <div>
          <span className="font-data text-[10px] font-medium uppercase tracking-[0.2em] text-primary">Quick read / 01</span>
          <h2 className="mt-2 font-display text-[31px] leading-[1] tracking-[-0.03em] text-foreground sm:text-[38px]">What will you actually<br className="hidden sm:block" /> take home?</h2>
        </div>
        <span className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-[10px] font-bold text-muted-foreground">Takes 60 seconds</span>
      </div>
      <form onSubmit={submit} className="relative mt-7 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-2 block text-[11px] font-bold text-muted-foreground">Offered CTC (annual)</span>
          <div className="flex h-12 items-center rounded-xl border border-border bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <span className="mr-2 font-data text-sm text-muted-foreground">₹</span>
            <input value={salary} onChange={(event) => { setSalary(event.target.value.replace(/\D/g, '')); setSubmitted(false); }} inputMode="numeric" className="w-full bg-transparent font-data text-sm font-medium outline-none" aria-label="Offered annual CTC" data-testid="input-ctc" />
          </div>
        </label>
        <label className="block">
          <span className="mb-2 block text-[11px] font-bold text-muted-foreground">Your city</span>
          <div className="relative">
            <select value={city} onChange={(event) => setCity(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-border bg-background px-3 text-sm font-semibold outline-none" aria-label="Your city" data-testid="select-city">
              <option>Bengaluru</option><option>Mumbai</option><option>Delhi NCR</option><option>Hyderabad</option><option>Pune</option>
            </select>
          </div>
        </label>
        <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 sm:min-w-[145px]" data-testid="button-decode-ctc">
          Decode my CTC <ArrowUpRight size={15} />
        </button>
      </form>
      {submitted && (
        <div className="relative mt-5 grid gap-4 border-t border-border/80 pt-5 sm:grid-cols-[1.2fr_1fr_1fr] animate-enter" data-testid="result-ctc">
          <div><p className="text-[11px] font-bold text-muted-foreground">Estimated monthly take-home</p><p className="mt-1 font-data text-2xl font-medium tracking-[-0.04em]">₹{monthly.toLocaleString('en-IN')}</p><p className="mt-1 text-[10px] text-muted-foreground">After standard deductions in {city}</p></div>
          <div><p className="text-[11px] font-bold text-muted-foreground">Market position</p><p className="mt-1 font-data text-2xl font-medium tracking-[-0.04em] text-primary">+14.2%</p><p className="mt-1 text-[10px] text-muted-foreground">above similar roles</p></div>
          <div><p className="text-[11px] font-bold text-muted-foreground">The fine print</p><p className="mt-1 text-sm font-semibold">Variable pay: check it</p><p className="mt-1 text-[10px] text-muted-foreground">Your offer may include ₹2.1L at risk.</p></div>
        </div>
      )}
    </section>
  );
}

function ToolCard({ tool, onOpen }: { tool: Tool; onOpen: (id: string) => void }) {
  const Icon = tool.icon;
  const href = tool.id === 'ctc' ? '/salary-calculator' : tool.id === 'risk' ? '/resignation-risk' : tool.id === 'stability' ? '/companies' : '/ai';
  return (
    <div className="surface-lift group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[18px] border border-border bg-card p-5 text-left hover:border-primary/50" data-testid={`card-tool-${tool.id}`}>
      <div className="flex items-start justify-between">
        <span className={`flex size-10 items-center justify-center rounded-xl ${tool.color === 'teal' ? 'bg-primary/10 text-primary' : tool.color === 'coral' ? 'bg-accent/15 text-accent' : tool.color === 'ochre' ? 'bg-[#e5b755]/20 text-[#98761d]' : 'bg-foreground/10 text-foreground'}`}><Icon size={19} /></span>
        <ArrowUpRight size={17} className="text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-foreground" />
      </div>
      <div>
        <p className="font-data text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{tool.label}</p>
        <h3 className="mt-2 font-display text-[26px] leading-none tracking-[-0.03em]">{tool.title}</h3>
        <p className="mt-3 max-w-[260px] text-[12px] leading-[1.6] text-muted-foreground">{tool.description}</p>
      </div>
      <div className="mt-5 flex items-end justify-between border-t border-border pt-3">
        <div><p className="font-data text-[15px] font-medium">{tool.stat}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{tool.statLabel}</p></div>
        <div className="flex items-center gap-3">
          <button onClick={() => { trackEvent("tool_discovered", { catalog_slug: tool.id, route: "/" }); onOpen(tool.id); }} className="text-[10px] font-bold text-primary" data-testid={`button-preview-${tool.id}`}>Preview</button>
          <Link href={href} onClick={() => trackEvent("tool_discovered", { catalog_slug: tool.id, route: "/" })} className="text-[10px] font-bold text-muted-foreground hover:text-primary">Open <ChevronRight size={13} className="inline" /></Link>
        </div>
      </div>
    </div>
  );
}

function ToolPreview({ selectedTool, onClose }: { selectedTool: string; onClose: () => void }) {
  const tool = tools.find((item) => item.id === selectedTool);
  if (!tool) return null;
  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-[680px] rounded-2xl border border-border bg-card p-5 shadow-[0_20px_60px_hsl(var(--foreground)/.2)] animate-enter sm:inset-x-auto sm:right-6 sm:bottom-6" role="dialog" aria-label={`${tool.title} preview`} data-testid="dialog-tool-preview">
      <div className="flex items-start justify-between gap-4">
        <div><p className="font-data text-[9px] uppercase tracking-[0.18em] text-primary">Preview / {tool.label}</p><h3 className="mt-1 font-display text-2xl">{tool.title}</h3></div>
        <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Close preview" data-testid="button-close-preview"><X size={17} /></button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-lg bg-muted/70 p-3"><p className="text-[9px] font-bold text-muted-foreground">Signal</p><p className="mt-1 font-data text-sm">{tool.stat}</p></div>
        <div className="rounded-lg bg-muted/70 p-3"><p className="text-[9px] font-bold text-muted-foreground">Confidence</p><p className="mt-1 font-data text-sm">High</p></div>
        <div className="rounded-lg bg-muted/70 p-3"><p className="text-[9px] font-bold text-muted-foreground">Freshness</p><p className="mt-1 font-data text-sm">14 Jun</p></div>
        <div className="rounded-lg bg-muted/70 p-3"><p className="text-[9px] font-bold text-muted-foreground">Next step</p><p className="mt-1 text-[11px] font-bold text-primary">See detail</p></div>
      </div>
      <Link href="/pro" className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold text-primary hover:underline" data-testid="link-preview-pro">Unlock the full read <ArrowUpRight size={13} /></Link>
    </div>
  );
}

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const submitEmail = (event: FormEvent) => { event.preventDefault(); if (email.includes('@')) setJoined(true); };
  
  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden">
      <AppNav />
      <main>
        <section className="mx-auto max-w-[1240px] px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:pt-24">
          <div className="grid items-end gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
      <div className="reveal">
              <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary"><span className="h-px w-7 bg-primary" /> Career intelligence for India</div>
              <h1 className="max-w-[730px] font-display text-[58px] leading-[.91] tracking-[-0.05em] text-foreground sm:text-[82px] lg:text-[103px]">Make your next<br /><span className="text-primary">move make sense.</span></h1>
              <p className="mt-7 max-w-[525px] text-[15px] leading-[1.7] text-muted-foreground sm:text-[16px]">CareerReality brings salary, company stability, resignation risk, and AI impact into one clear view — so a high-stakes decision feels less like a hunch.</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/compass" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[12px] font-bold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-explore-tools">Start with your decision <ArrowUpRight size={15} /></Link>
                <a href="#method" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-[12px] font-bold text-foreground transition-colors hover:border-primary" data-testid="link-see-method">How we think <ChevronRight size={14} /></a>
              </div>
            </div>
            <div className="reveal reveal-3">
              <SignalBars />
            </div>
          </div>
        </section>

        <section id="tools" className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><span className="font-data text-[10px] uppercase tracking-[.2em] text-primary">The desk / live tools</span><h2 className="mt-3 max-w-[490px] font-display text-[42px] leading-[.95] tracking-[-.04em] sm:text-[54px]">The whole picture,<br /><span className="text-muted-foreground">not just the headline.</span></h2></div>
            <p className="max-w-[280px] text-[12px] leading-[1.65] text-muted-foreground">Start with the question keeping you up. Follow the signal to the decision it changes.</p>
          </div>
           <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
             {tools.map((tool, index) => <div key={tool.id} className={`reveal reveal-${Math.min(index + 2, 5)}`}><ToolCard tool={tool} onOpen={setSelectedTool} /></div>)}
          </div>
        </section>

         <section className="mx-auto max-w-[1240px] px-5 pb-20 sm:px-8 sm:pb-28">
           <div className="grid gap-3 lg:grid-cols-[.8fr_1.2fr]">
             <div className="paper-grid rounded-[20px] border border-border p-7 sm:p-9">
               <div className="flex items-center justify-between">
                 <span className="font-data text-[10px] uppercase tracking-[.2em] text-primary">A better starting point</span>
                 <span className="font-data text-[10px] text-muted-foreground">04 questions</span>
               </div>
               <h2 className="mt-12 max-w-[390px] font-display text-[38px] leading-[.94] tracking-[-.04em] sm:text-[47px]">Begin with the decision, not the dashboard.</h2>
               <p className="mt-5 max-w-[380px] text-[12px] leading-[1.7] text-muted-foreground">The desk is designed to help you ask a sharper question before you collect another tab, thread, or opinion.</p>
             </div>
             <div className="grid gap-3 sm:grid-cols-2">
               {[
                 { index: "01", title: "Can I afford this move?", body: "Decode cash, variable pay, tax, and the cost of staying put.", tone: "bg-primary/[.08]" },
                 { index: "02", title: "What is changing here?", body: "Read operating momentum, hiring shape, and employee movement.", tone: "bg-accent/[.10]" },
                 { index: "03", title: "Is now the right time?", body: "Name the friction around notice, runway, confidence, and pressure.", tone: "bg-[#e5b755]/[.16]" },
                 { index: "04", title: "What will my work become?", body: "Separate useful AI signal from broad, noisy career panic.", tone: "bg-foreground/[.06]" },
               ].map((item) => (
                 <div key={item.index} className={`surface-lift rounded-[18px] border border-border p-5 ${item.tone}`}>
                   <span className="font-data text-[10px] text-primary">{item.index}</span>
                   <h3 className="mt-10 font-display text-[25px] leading-[.98] tracking-[-.03em]">{item.title}</h3>
                   <p className="mt-3 text-[11px] leading-[1.65] text-muted-foreground">{item.body}</p>
                 </div>
               ))}
             </div>
           </div>
         </section>

        <section id="method" className="border-y border-border bg-[#263138] text-[#f2eadc]">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
            <div><span className="font-data text-[10px] uppercase tracking-[.2em] text-[#83c9b4]">Our method / no folklore</span><h2 className="mt-4 font-display text-[46px] leading-[.95] tracking-[-.04em] sm:text-[61px]">A clearer way<br />to be <em className="text-[#e5b755]">uncertain.</em></h2><p className="mt-6 max-w-[390px] text-[13px] leading-[1.7] text-[#afbbb5]">We do not pretend a career can be reduced to one score. We show the evidence, the confidence, and the trade-off — then leave the call to you.</p></div>
            <div className="grid gap-8 sm:grid-cols-2">
              {[
                { n: '01', title: 'Collect the signal', body: 'Salary reports, public filings, employee movement, and role-level inputs — cleaned and brought into one frame.', icon: Search },
                { n: '02', title: 'Name the confidence', body: 'Every read tells you how fresh it is, where it comes from, and what we do not know yet.', icon: Eye },
                { n: '03', title: 'Surface the trade-off', body: 'A higher offer can carry more volatility. A stable company can carry a slower learning curve. We make that visible.', icon: ScaleIcon },
                { n: '04', title: 'Give you a next step', body: 'Not a verdict. A useful question to ask, a number to verify, or a conversation to have this week.', icon: ArrowUpRight },
              ].map((item) => { const Icon = item.icon; return <div key={item.n} className="border-t border-[#48575b] pt-4"><div className="flex items-center justify-between"><span className="font-data text-[10px] text-[#83c9b4]">{item.n}</span><Icon size={16} className="text-[#c5d0c7]" /></div><h3 className="mt-7 text-[15px] font-bold">{item.title}</h3><p className="mt-2 text-[12px] leading-[1.65] text-[#afbbb5]">{item.body}</p></div>; })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-[20px] bg-primary p-7 text-primary-foreground sm:p-10"><div><span className="font-data text-[10px] uppercase tracking-[.2em] text-[#a9dbca]">For your next big call</span><h2 className="mt-3 max-w-[560px] font-display text-[37px] leading-[.96] tracking-[-.03em] sm:text-[48px]">Bring the question.<br />We will bring the context.</h2></div><Link href="/pro" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#e5b755] px-5 py-3 text-[12px] font-bold text-foreground transition-transform hover:-translate-y-0.5" data-testid="link-join-pro">Explore Career Reality Pro <ArrowUpRight size={15} /></Link></div>
        </section>
      </main>
       <PublicFooter />
      {selectedTool && <ToolPreview selectedTool={selectedTool} onClose={() => setSelectedTool(null)} />}
    </div>
  );
}