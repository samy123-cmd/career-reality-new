export type EditorialBrief = {
  dek: string;
  sections: Array<{ heading: string; body: string }>;
};

export const editorialBriefs: Record<string, EditorialBrief> = {
  "portfolio-first-hiring-gig-economy-careers-india-2026": {
    dek: "Portfolio-first hiring rewards visible judgement, not a pile of certificates. In India's 2026 market, the useful portfolio is evidence of ownership, constraints, and outcomes.",
    sections: [
      { heading: "The signal", body: "Mid-level hiring is increasingly asking candidates to show what they shipped, measured, or changed. The artefact can be a system note, a case study, an evaluation harness, or a growth experiment; the format matters less than the evidence of judgement." },
      { heading: "What the headline leaves out", body: "A public portfolio is not the same thing as a stable gig career. Specialist consulting can bring better upside, but it also brings uneven cash flow, tax complexity, and the need to keep finding the next piece of work." },
      { heading: "The decision this changes", body: "Do not respond to portfolio-first hiring by collecting more tutorials. Pick one real problem, document the constraint, show the trade-off, and make the result easy for a hiring manager to understand in four minutes." },
      { heading: "Questions worth asking next", body: "Which artefact best proves the role you want? Can you explain the baseline, the decision you made, and what changed? If the work is confidential, what can you recreate without exposing a customer or employer?" },
    ],
  },
  "green-careers-esg-renewable-sustainability-india-2026": {
    dek: "Green careers are broadening beyond climate slogans into reporting, carbon accounting, renewable operations, and compliance. The opportunity is real, but the work is more operational than inspirational.",
    sections: [
      { heading: "The signal", body: "Demand is forming around people who can translate environmental goals into auditable numbers, procurement decisions, and operating plans. ESG roles sit between policy, finance, operations, and data rather than inside one neat job family." },
      { heading: "What the headline leaves out", body: "Many roles use sustainability language while still requiring spreadsheet discipline, evidence collection, and stakeholder persistence. A certificate helps less than the ability to trace a claim back to a method and a source." },
      { heading: "The decision this changes", body: "Treat a green-career switch as a domain move plus a proof-of-work move. A small emissions inventory, supplier scorecard, or regulatory briefing can show more readiness than a broad list of courses." },
      { heading: "Questions worth asking next", body: "Who owns the data? Is the role building a programme or only producing a report? What would you be able to measure after six months, and how much of the work is analysis versus coordination?" },
    ],
  },
  "cybersecurity-privacy-careers-beyond-tech-india-2026": {
    dek: "Cybersecurity and privacy work is spreading into regulated industries and internal governance teams. The strongest career path is often the ability to explain technical risk in business language.",
    sections: [
      { heading: "The signal", body: "Security hiring is not limited to penetration testing or incident response. Governance, risk, compliance, privacy operations, identity, and vendor assurance create routes for people who can connect controls to real business exposure." },
      { heading: "What the headline leaves out", body: "A tool list is not a security career. Teams still need people who can prioritise a finding, negotiate a remediation plan, and explain what a control protects when an executive asks for the short version." },
      { heading: "The decision this changes", body: "Choose a lane before adding another certification. A portfolio of threat models, privacy notices, tabletop exercises, or control reviews makes the direction legible and exposes where your technical depth needs work." },
      { heading: "Questions worth asking next", body: "Is the role a builder, an assessor, or a coordinator? Who receives the findings? What is the escalation path when a business owner does not accept the recommended risk treatment?" },
    ],
  },
  "joining-bonus-clawback-offer-letter-traps-2026": {
    dek: "A joining bonus can be useful cash or a repayment obligation disguised as compensation. The repayment trigger and timeline matter more than the headline amount.",
    sections: [
      { heading: "The signal", body: "Clawbacks commonly sit in the offer letter, a separate undertaking, or a policy incorporated by reference. The practical question is not whether a bonus exists; it is what event turns it into a debt." },
      { heading: "What the headline leaves out", body: "A repayment clause may cover resignation, termination for cause, non-joining, or a partial period after joining. Tax treatment, payroll deductions, and the definition of the retention period can materially change the cash value." },
      { heading: "The decision this changes", body: "Compare the net bonus with the downside you would carry if the role changes or the employer ends the relationship. A smaller clean offer can be worth more than a larger amount with a broad clawback." },
      { heading: "Questions worth asking next", body: "Is the bonus guaranteed or discretionary? Does the amount reduce monthly or only on an anniversary date? Who can approve a waiver, and is that waiver written into the offer rather than promised verbally?" },
    ],
  },
  "staff-engineer-promotion-freeze-india-2026": {
    dek: "Staff-level promotions can slow even when senior engineers are doing more work. When the slot is frozen, scope without authority becomes a career risk.",
    sections: [
      { heading: "The signal", body: "Promotion decisions are constrained by headcount plans, levelling budgets, and the number of staff roles an organisation is willing to carry. Strong performance can still produce a longer wait when the next level is structurally limited." },
      { heading: "What the headline leaves out", body: "The problem is not only a title delay. Engineers may absorb cross-team ownership, incident load, and mentoring without a written mandate, decision rights, or compensation that reflects the expanded surface area." },
      { heading: "The decision this changes", body: "Ask for a level rubric, a sponsor, and a dated review checkpoint. If the organisation cannot name the evidence or the decision-maker, treat the promotion promise as an aspiration rather than part of your offer value." },
      { heading: "Questions worth asking next", body: "What staff-level behaviour is missing? Which decisions are you authorised to make today? Is there a budgeted slot, and what happens to your scope if the slot does not open?" },
    ],
  },
  "gcc-return-to-office-hybrid-reality-india-2026": {
    dek: "GCC office mandates can change the economics of an offer even when the CTC stays the same. Commute, time, and team location belong in the compensation conversation.",
    sections: [
      { heading: "The signal", body: "Captive centres may pay a premium while requiring three or four office days. The combination can still be attractive, but only if the role, manager, and commute make the premium usable rather than theoretical." },
      { heading: "What the headline leaves out", body: "Hybrid language often hides the difference between a team norm, a badge policy, and a manager preference. A future office mandate can also arrive after the offer, when your negotiation leverage is lower." },
      { heading: "The decision this changes", body: "Price the commute as a recurring cost in time and money. Ask for the expected cadence in writing, then compare the real monthly benefit with a local or genuinely remote alternative." },
      { heading: "Questions worth asking next", body: "How many days does this specific team attend? What happens during parent-company visits or audits? Is the location fixed, and can the policy change without a role or compensation review?" },
    ],
  },
  "relieving-letter-hostage-notice-period-india-2026": {
    dek: "Notice-period friction is often a process problem before it becomes a legal one. Keep the exit trail written, specific, and separate from emotional escalation.",
    sections: [
      { heading: "The signal", body: "Long notice periods, buyout ambiguity, handover dependencies, and delayed paperwork can narrow your next options. The risk increases when important instructions are verbal or when multiple HR systems disagree." },
      { heading: "What the headline leaves out", body: "A relieving letter is not the only useful record. Resignation acknowledgement, last working day, handover status, payslips, tax documents, and the employment contract each answer a different future question." },
      { heading: "The decision this changes", body: "Before resigning, model the cash cost of the notice period and the date your next employer actually needs. After resigning, communicate in short factual updates and preserve every acknowledgement." },
      { heading: "Questions worth asking next", body: "What does the contract say about buyout and early release? Who owns the final approval? Which documents will be issued automatically, and which require a separate request after the last working day?" },
    ],
  },
  "gcc-gold-rush-india-captive-center-reality": {
    dek: "India's GCC expansion can create better roles, but a captive centre is not automatically a better employer. The parent-company link changes the work; it does not remove local execution risk.",
    sections: [
      { heading: "The signal", body: "GCCs are building engineering, product, analytics, finance, and security capability in India. The most durable roles usually own a meaningful slice of a global system rather than serving as a low-context delivery extension." },
      { heading: "What the headline leaves out", body: "Global brand, local manager, and actual decision rights can diverge. A role can carry a premium while still being measured by a distant team, constrained by approvals, or exposed to a local restructuring cycle." },
      { heading: "The decision this changes", body: "Evaluate the mandate, not just the logo. Ask what ships from India, which roadmap decisions happen locally, and whether the team is building a durable capability or staffing a temporary programme." },
      { heading: "Questions worth asking next", body: "Who is the product or engineering customer? Which decisions can the India team make without escalation? What happened to the team in the last planning cycle?" },
    ],
  },
  "indian-it-layoff-cycle-2026": {
    dek: "Layoff risk is rarely one headline. It is a sequence of hiring pauses, utilisation pressure, project changes, and narrower approvals that affects leverage before a formal announcement.",
    sections: [
      { heading: "The signal", body: "A useful radar watches for repeated changes rather than a single rumour: fewer backfills, longer approvals, bench movement, cancelled programmes, and role descriptions that quietly disappear." },
      { heading: "What the headline leaves out", body: "A company-level number can hide large differences between business units and skills. The same employer may freeze one function while hiring aggressively for a capability tied to its next revenue plan." },
      { heading: "The decision this changes", body: "Build optionality before anxiety becomes a resignation. Keep your work evidence current, understand your cash runway, and compare an offer's stability signal with its salary premium." },
      { heading: "Questions worth asking next", body: "Is this role a backfill or new headcount? How many quarters of funded work sit behind it? What happens if the named project moves, and which adjacent teams could absorb the role?" },
    ],
  },
  "what-20-lpa-actually-feels-like-india-purchasing-power": {
    dek: "₹20 LPA is a headline, not a lifestyle. Fixed pay, tax, rent, dependants, commute, and variable compensation decide what the number feels like.",
    sections: [
      { heading: "The signal", body: "Two people on the same CTC can have very different monthly room. The useful comparison is take-home cash against recurring obligations, not a salary screenshot against another salary screenshot." },
      { heading: "What the headline leaves out", body: "Variable pay may arrive late or below target. Gratuity and employer contributions can sit inside CTC without helping this month's budget. City costs can also erase a raise that looks large on paper." },
      { heading: "The decision this changes", body: "Decode the offer before negotiating the headline. Separate fixed cash, conditional pay, statutory deductions, and the recurring cost of accepting the role in its actual location." },
      { heading: "Questions worth asking next", body: "What reaches the bank account in month one? Which components are guaranteed? What changes if the bonus pays at 50% of target, and how much runway remains after the move?" },
    ],
  },
  "manager-vs-ic-career-path-india": {
    dek: "Manager versus individual contributor is not a prestige ladder. It is a choice about the kind of leverage, ambiguity, and accountability you want to carry.",
    sections: [
      { heading: "The signal", body: "Management compounds through people systems, prioritisation, and organisational trust. IC careers compound through technical judgement, scope, and the ability to make complex systems legible to others." },
      { heading: "What the headline leaves out", body: "A manager title can mean coordination without authority. An IC title can mean deep work without a clear promotion lane. The quality of the operating environment matters more than the label on the org chart." },
      { heading: "The decision this changes", body: "Choose the work you want to repeat. If you get energy from coaching, staffing, and trade-offs across people, management may fit. If you want to own hard technical decisions and influence through expertise, an IC path may fit better." },
      { heading: "Questions worth asking next", body: "What does success look like in this path? Who controls the roadmap and the people decisions? Can you move between tracks without losing level, pay, or credibility?" },
    ],
  },
  "layoff-recovery-timeline-india": {
    dek: "Layoff recovery is a financial and emotional timeline, not a motivational montage. The next role may require a different search strategy than the one that got the last role.",
    sections: [
      { heading: "The signal", body: "The first weeks are about paperwork and stabilising cash. Later months reveal whether your previous title, brand, and compensation still map cleanly to the roles available in your target city and domain." },
      { heading: "What the headline leaves out", body: "Fast recovery stories often include a referral, a warm pipeline, or work started before the layoff. A slower search is not proof of lower ability, but it does require a more deliberate runway and channel mix." },
      { heading: "The decision this changes", body: "Use the first month to secure documents and references, then build a focused pipeline instead of rewriting the same résumé indefinitely. Track response rates by channel and adjust the target role when the evidence says to." },
      { heading: "Questions worth asking next", body: "What is your minimum acceptable runway? Which former managers can make a specific introduction? Which adjacent role preserves your strongest evidence without forcing a large unexplained reset?" },
    ],
  },
  "ai-upskilling-trap-india-api-wrapper-reality": {
    dek: "AI upskilling becomes expensive entertainment when every course ends at a demo. The durable signal is evaluation discipline, domain context, and ownership of the outcome.",
    sections: [
      { heading: "The signal", body: "Many people can assemble a model call or a RAG prototype. Fewer can define a useful metric, measure failure modes, control cost, and explain where a human must remain in the loop." },
      { heading: "What the headline leaves out", body: "Tool familiarity expires quickly. A portfolio that only shows a polished screenshot does not reveal whether the system is reliable, safe, or useful under real constraints." },
      { heading: "The decision this changes", body: "Choose one workflow you understand and test it honestly. Show the baseline, the evaluation set, the trade-offs, and the cases where you decided not to automate." },
      { heading: "Questions worth asking next", body: "What decision does the system improve? How will you know it is wrong? What is the cost per useful outcome, and who is accountable when the output causes harm?" },
    ],
  },
  "ux-salary-myth-design-careers-plateau": {
    dek: "Design salary plateaus are often a scope problem before they are a talent problem. More screens are not the same as more leverage.",
    sections: [
      { heading: "The signal", body: "Commodity interface work is easier to compare and easier to compress. Designers who can frame a problem, test a decision, and connect the work to a business outcome create a wider surface for progression." },
      { heading: "What the headline leaves out", body: "A visually impressive portfolio can still hide weak product judgement. Hiring teams want to see constraints, failed directions, research quality, and what changed after the design entered the system." },
      { heading: "The decision this changes", body: "Move the portfolio from gallery to evidence. Pick two projects and make the trade-offs, collaboration, and measurable consequence impossible to miss." },
      { heading: "Questions worth asking next", body: "What decision did your work unlock? Which metric or behaviour changed? What would you do differently with another week, and what did you deliberately leave out?" },
    ],
  },
  "pm-prestige-trap-escape-from-engineering": {
    dek: "Product management is not a softer version of engineering. It is a coordination and decision role with a different failure mode: being accountable for outcomes without owning every lever.",
    sections: [
      { heading: "The signal", body: "The strongest PM transitions carry evidence of problem framing, prioritisation, customer learning, and shipping. A title change alone does not prove that you can make those decisions." },
      { heading: "What the headline leaves out", body: "PM work can be less predictable, more political, and more dependent on influence than the role descriptions suggest. The prestige of the title is a poor proxy for the quality of the mandate." },
      { heading: "The decision this changes", body: "Test the work before making the identity leap. Run a discovery project, write a product brief, or own a cross-functional launch with a measurable outcome." },
      { heading: "Questions worth asking next", body: "Who decides the roadmap? What customer access will you have? Which outcome belongs to the PM, and what authority exists when engineering, sales, or leadership disagree?" },
    ],
  },
  "senior-developer-salary-ceiling-india": {
    dek: "Senior developer compensation can flatten when the role keeps paying for execution while the organisation needs broader ownership. The next band is a scope conversation.",
    sections: [
      { heading: "The signal", body: "Salary movement slows when work is hard but local: one service, one team, or one delivery lane. The higher bands reward judgement that reduces risk across teams and survives beyond a single project." },
      { heading: "What the headline leaves out", body: "A market median cannot tell you whether your current company has a credible path for the scope you already carry. Nor can a bigger CTC compensate for a role with no decision rights or learning surface." },
      { heading: "The decision this changes", body: "Benchmark the role you are actually performing, then decide whether to deepen, broaden, or move. Keep an evidence file of incidents prevented, systems simplified, and people made more effective." },
      { heading: "Questions worth asking next", body: "What is the next level paid to own? Which cross-team problem could you take on? Is the company willing to price that scope, or is a market move the only available route?" },
    ],
  },
  "startup-equity-esop-reality-india": {
    dek: "Startup equity is a possibility, not cash compensation. Its value depends on the instrument, vesting, exercise cost, liquidity, dilution, and the time you can afford to wait.",
    sections: [
      { heading: "The signal", body: "An equity grant can align you with a long-term outcome, but the outcome is uncertain and the timeline is usually outside your control. Treat it as a separate risk bucket from fixed salary." },
      { heading: "What the headline leaves out", body: "The percentage alone is not enough. You need the number of shares, the fully diluted denominator, the strike price, vesting schedule, exercise window, and the company's approach to future dilution." },
      { heading: "The decision this changes", body: "Make the decision work without the equity. If the fixed cash is weak, calculate how much optionality you are selling and whether the personal upside is worth the probability-weighted downside." },
      { heading: "Questions worth asking next", body: "What exactly is being granted? When can you exercise? What happens if you leave? Which recent liquidity events or secondary transactions, if any, provide evidence rather than hope?" },
    ],
  },
  "remote-work-salary-trap-india": {
    dek: "Remote work can raise nominal pay while quietly shifting equipment, isolation, time-zone, and location-adjustment costs onto the worker.",
    sections: [
      { heading: "The signal", body: "A remote offer may be benchmarked to a global market, a local market, or a company-wide band. Those are different promises, especially when the employer can change the location policy later." },
      { heading: "What the headline leaves out", body: "The premium can disappear into tax, currency movement, unpaid setup time, internet and workspace costs, or a calendar that stretches across time zones. Flexibility also depends on the manager and team, not only the contract." },
      { heading: "The decision this changes", body: "Compare remote offers using net cash and weekly life cost. Ask whether the company pays for equipment, travel, coworking, and the occasional in-person requirement before treating the headline as a raise." },
      { heading: "Questions worth asking next", body: "Which time zone owns the team? How often is travel expected? Can the location policy change, and would a change trigger a compensation or relocation conversation?" },
    ],
  },
};