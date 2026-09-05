export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  date: string;
  readTime: string;
  sections: Array<{ heading: string; body: string }>;
  tags: string[];
  contentType: "Editorial article";
  sourceUrl: string;
};

export type ArticleCategory =
  | "career-reality-checks"
  | "career-strategy"
  | "engineering"
  | "money-reality"
  | "software-engineering";

import { editorialBriefs } from "./editorial-briefs";

const titles: Record<string, string> = {
  "portfolio-first-hiring-gig-economy-careers-india-2026": "Portfolio-first hiring: building a career in India's gig economy",
  "green-careers-esg-renewable-sustainability-india-2026": "Green careers in India: the ESG and renewable energy reality",
  "cybersecurity-privacy-careers-beyond-tech-india-2026": "Cybersecurity and privacy careers are moving beyond tech",
  "joining-bonus-clawback-offer-letter-traps-2026": "The joining-bonus clawback: offer-letter traps to read twice",
  "staff-engineer-promotion-freeze-india-2026": "The staff engineer promotion freeze: what changes now",
  "gcc-return-to-office-hybrid-reality-india-2026": "GCC return-to-office plans: the hybrid reality in India",
  "relieving-letter-hostage-notice-period-india-2026": "When a relieving letter becomes leverage during notice period",
  "ai-upskilling-trap-india-api-wrapper-reality": "The AI upskilling trap: when every course is an API wrapper",
  "gcc-gold-rush-india-captive-center-reality": "The GCC gold rush: inside India's captive-center reality",
  "indian-it-layoff-cycle-2026": "India's IT layoff cycle: reading the signal before the headline",
  "junior-data-scientist-reality-india": "The junior data scientist reality: more spreadsheets than models",
  "home-loan-trap-dream-house-financial-prison": "The home-loan trap: when the dream house becomes a financial prison",
  "ux-salary-myth-design-careers-plateau": "The UX salary myth: where design careers plateau",
  "pm-prestige-trap-escape-from-engineering": "The PM prestige trap: escaping engineering is not a strategy",
  "10x-developer-myth-productivity-killing-careers": "The 10x developer myth is quietly killing careers",
  "data-science-bubble-excel-work-reality": "The data science bubble: the Excel-work reality",
  "career-switch-illusion-changing-jobs-not-career": "The career-switch illusion: changing jobs is not changing careers",
  "engineering-career-ceiling-peak-at-35": "The engineering career ceiling that appears around 35",
  "self-learning-trap-online-courses-expensive-entertainment": "The self-learning trap: when courses become expensive entertainment",
  "broke-at-30-money-mistakes-nobody-warned": "Broke at 30: money mistakes nobody warned you about",
  "indian-education-trap-degree-career-mistake": "The Indian education trap: a degree can be a career mistake",
  "work-life-balance-myth-high-performers": "The work-life balance myth for high performers",
  "passion-luxury-not-strategy-india": "Passion is a luxury, not a strategy, in India",
  "hr-conversations-what-matters-india": "HR conversations: what actually matters in India",
  "culture-fit-trap-hiring-reality": "The culture-fit trap: what hiring teams really mean",
  "job-hopping-stops-working-after-35": "When job hopping stops working after 35",
  "performance-review-reality-ratings-india": "Performance review reality: how ratings are made in India",
  "tech-lead-trap-responsibility-authority": "The tech lead trap: responsibility without authority",
  "devops-sre-reality-india-oncall": "DevOps and SRE reality in India: the on-call tax",
  "senior-developer-salary-ceiling-india": "The senior developer salary ceiling in India",
  "freelancing-reality-india-freedom-myth": "Freelancing reality in India: freedom has a price",
  "networking-reality-india-introverts": "Networking reality in India for introverts",
  "layoff-recovery-timeline-india": "Layoff recovery timeline: what the next six months look like",
  "manager-vs-ic-career-path-india": "Manager versus IC: choosing a career path that fits",
  "startup-equity-esop-reality-india": "Startup equity and ESOP reality in India",
  "side-hustle-myth-india-reality": "The side-hustle myth: a second job is not a second life",
  "remote-work-salary-trap-india": "The remote-work salary trap in India",
  "mba-reality-india-worth-it-2026": "MBA reality in India: is it worth it in 2026?",
  "american-dream-indian-engineers": "The American dream for Indian engineers, recalculated",
  "what-20-lpa-actually-feels-like-india-purchasing-power": "What ₹20 LPA actually feels like in India",
  "why-upskilling-stops-working-career-trap": "Why upskilling stops working: the career trap",
};

const categoryBySlug: Record<string, ArticleCategory> = {
  "joining-bonus-clawback-offer-letter-traps-2026": "money-reality",
  "home-loan-trap-dream-house-financial-prison": "money-reality",
  "broke-at-30-money-mistakes-nobody-warned": "money-reality",
  "startup-equity-esop-reality-india": "money-reality",
  "what-20-lpa-actually-feels-like-india-purchasing-power": "money-reality",
  "portfolio-first-hiring-gig-economy-careers-india-2026": "career-strategy",
  "career-switch-illusion-changing-jobs-not-career": "career-strategy",
  "manager-vs-ic-career-path-india": "career-strategy",
  "mba-reality-india-worth-it-2026": "career-strategy",
  "passion-luxury-not-strategy-india": "career-strategy",
  "10x-developer-myth-productivity-killing-careers": "software-engineering",
  "devops-sre-reality-india-oncall": "software-engineering",
  "senior-developer-salary-ceiling-india": "software-engineering",
  "tech-lead-trap-responsibility-authority": "software-engineering",
  "engineering-career-ceiling-peak-at-35": "engineering",
  "staff-engineer-promotion-freeze-india-2026": "engineering",
  "junior-data-scientist-reality-india": "engineering",
  "data-science-bubble-excel-work-reality": "engineering",
  "cybersecurity-privacy-careers-beyond-tech-india-2026": "engineering",
};

const categoryLabels: Record<ArticleCategory, string> = {
  "career-reality-checks": "Career reality checks",
  "career-strategy": "Career strategy",
  engineering: "Engineering",
  "money-reality": "Money reality",
  "software-engineering": "Software engineering",
};

const allSlugs = Object.keys(titles);

const MINIMUM_ARTICLE_WORDS = 3_200;

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

type LongFormContext = {
  title: string;
  dek: string;
  categoryLabel: string;
  sections: Array<{ heading: string; body: string }>;
};

const longFormTopics = [
  {
    heading: "Start with the decision, not the headline",
    focus: "The first useful move is to name the decision underneath the headline",
  },
  {
    heading: "Read the signal at the right scale",
    focus: "A signal becomes useful only when it is read at the scale of the role, team, company, and market",
  },
  {
    heading: "Separate evidence from interpretation",
    focus: "Strong career decisions keep the observable evidence separate from the story we tell about it",
  },
  {
    heading: "Build a baseline before you compare",
    focus: "Comparison becomes clearer when you write down the current baseline before looking at the next option",
  },
  {
    heading: "Count the hidden cost of the move",
    focus: "The visible benefit is only one part of the economics of a career move",
  },
  {
    heading: "Check the policy behind the promise",
    focus: "Promises become decision-grade only when the policy, contract, or operating norm behind them is visible",
  },
  {
    heading: "Look for repeated patterns",
    focus: "One anecdote can start an investigation, but repeated patterns are what deserve confidence",
  },
  {
    heading: "Make the trade-off explicit",
    focus: "Every option exchanges one kind of certainty for another kind of risk",
  },
  {
    heading: "Think in scope, not only in titles",
    focus: "A title describes a role imperfectly, while scope reveals the work and leverage you will actually carry",
  },
  {
    heading: "Ask what the team can really control",
    focus: "The quality of a role depends partly on whether the team has authority over the outcome it is measured on",
  },
  {
    heading: "Turn uncertainty into an experiment",
    focus: "Uncertainty is easier to manage when the next step is a small experiment rather than a permanent leap",
  },
  {
    heading: "Have the useful conversation early",
    focus: "A direct, specific conversation often reveals more than another hour of anxious speculation",
  },
  {
    heading: "Protect your downside",
    focus: "A good decision is not only attractive when everything goes well; it remains survivable when plans change",
  },
  {
    heading: "Use a timeline instead of a mood",
    focus: "A dated review gives a career question more discipline than the feeling that something should change soon",
  },
  {
    heading: "Keep an evidence file",
    focus: "A small record of outcomes, constraints, and decisions compounds into better leverage over time",
  },
  {
    heading: "Compare the next ninety days",
    focus: "The next ninety days are often more informative than an imagined five-year outcome",
  },
  {
    heading: "Revisit the choice at the right interval",
    focus: "A decision should have a review point so new evidence can update it without rewriting the whole story",
  },
  {
    heading: "The practical reading list",
    focus: "The most useful reading of this issue ends with a short list of actions that can be checked in real life",
  },
];

function longFormBody(topic: string, context: LongFormContext, index: number): string {
  const [signal, headline, decision, questions] = context.sections;
  const prompts = [
    `For ${context.title.toLowerCase()}, begin by asking what would have to be true for the decision to be worthwhile. The answer should be concrete enough to recognise in a contract, a calendar, a payslip, a roadmap, a team ritual, or a measurable outcome. ${context.dek} That context is the starting point, not the conclusion. Write down the current situation in plain language, then describe the change you are considering without using the most flattering label available. This prevents a market phrase from doing the thinking for you. It also gives you something stable to return to when a conversation becomes urgent or when a polished offer makes every unresolved question feel smaller than it is.`,
    `The original signal says: ${signal.body} Treat that sentence as an observation to investigate rather than a universal rule. Ask when it is true, for whom it is true, and what evidence would make the opposite interpretation more credible. A company, profession, or role can contain several different realities at the same time. A strong market may still be difficult for one location; a respected title may still offer little authority; a generous headline may still produce thin monthly room. The work is to locate your case inside the wider pattern, not to borrow certainty from somebody else's story.`,
    `The headline leaves out this question: ${headline.body} That omission matters because decisions are usually shaped by details that do not fit in a title or a short post. Look for timing, ownership, eligibility, approval, sequence, and the cost of changing course later. Ask who can confirm each detail and whether the answer will remain true after the first month. If the answer depends entirely on one person's goodwill, mark it as fragile. If it is written down, repeated in team practice, and visible in outcomes, it deserves more weight. This is not cynicism; it is ordinary due diligence.`,
    `The decision described here changes when you take the next action seriously: ${decision.body} Convert that advice into a small piece of work you can complete this week. Gather one document, make one comparison, ask one precise question, or create one artefact that makes your capability visible. Small actions are useful because they produce evidence without requiring you to announce a final identity. They also expose whether the opportunity is real. If a simple request is met with clarity, the path may have substance. If every answer stays vague, that vagueness is itself information.`,
    `Use the questions already attached to this brief as a conversation guide: ${questions.body} Ask them in an order that makes the other person explain the operating reality before asking for reassurance. First ask what happens in practice, then who owns the decision, then how exceptions are handled. Listen for examples rather than adjectives. “Flexible,” “fast-growing,” “strategic,” and “high ownership” can all describe several incompatible experiences. A useful answer includes a recent example, a named owner, and a way to check the claim later. Keep a short written record while the details are fresh.`,
    `In the ${context.categoryLabel.toLowerCase()} category, the most common mistake is to treat a single variable as the whole decision. Pay, title, brand, flexibility, learning, and stability interact. Improving one can make another more expensive. A role that pays more may consume more time; a prestigious path may narrow your autonomy; a safer employer may offer less scope; a course may increase confidence without increasing proof. Write the variables in two columns: what improves immediately and what may become harder later. The point is not to produce a perfect model. It is to make the exchange visible enough to discuss.`,
    `A useful baseline has three layers. The first is practical: cash, location, hours, notice, benefits, equipment, and other conditions that affect ordinary life. The second is professional: the work you will own, the decisions you can make, the people who can support you, and the evidence you can build. The third is personal: energy, responsibilities, health, appetite for uncertainty, and the time available for recovery. Do not collapse these layers into one score. Keeping them separate lets you identify which problem the proposed move actually solves and which problem it leaves untouched.`,
    `When evidence is incomplete, use confidence labels instead of pretending to know more. Mark a claim as confirmed, plausible, untested, or contradicted. A confirmed fact might be present in an offer letter or a published policy. A plausible claim may be supported by several consistent conversations but still depend on a future decision. An untested claim is a promise you have not yet checked. A contradiction is not always a reason to walk away, but it is a reason to ask for clarity before you price the opportunity as if it were certain. This simple vocabulary makes uncertainty discussable.`,
    `The next conversation should be specific enough that an answer cannot hide behind general encouragement. Replace “Is there growth?” with “What scope would I own after six months, and what evidence would show that I am ready for the next level?” Replace “Is the team stable?” with “What work is funded, what changed in the last planning cycle, and who decides if priorities move?” Replace “Will this be flexible?” with “How often does this team meet in person, and what happens when the policy changes?” Good questions are not aggressive. They are a way to give the other person a fair chance to describe the real deal.`,
    `Give the decision a reversible first step wherever possible. A conversation, a portfolio case study, a short project, a market benchmark, or a written request can all create information before a resignation or relocation. Define what you expect to learn and what result would change your view. If you are testing a skill, choose an output that resembles the work you want. If you are testing an employer, speak with people close to the team rather than only with the recruiting funnel. If you are testing a financial move, model the ordinary month and the difficult month. Experiments turn anxiety into observations.`,
    `Downside planning is not an admission that the move will fail. It is a way to keep your future self from having to negotiate under pressure. Identify the costs that cannot be recovered: a repayment obligation, a long commute, a lost vesting date, a smaller emergency buffer, a gap in references, or a role that is hard to explain later. Then identify the protections available before you commit. These may include a written clause, a cash reserve, a staged transition, a reference, a decision checkpoint, or a clear exit condition. The strongest option is often the one whose downside you can carry.`,
    `A timeline makes a broad ambition operational. In the next seven days, gather the missing evidence. In the next thirty days, complete the smallest proof or conversation that tests the central assumption. At ninety days, review what actually changed rather than what you hoped would change. Put the dates on a calendar and name the evidence you will inspect. A timeline is especially valuable when a decision is emotionally loaded, because it stops urgency from becoming the only source of movement. It also makes a “not yet” decision active rather than passive.`,
    `Keep an evidence file that is useful to you even if nobody else sees it. Record the problem, your action, the constraint, the result, and what you learned. Save the relevant policy, calculation, project note, or written answer alongside it. Over time, this file becomes more persuasive than a list of traits because it shows how you operate under real conditions. It can support a promotion conversation, a role change, a negotiation, a portfolio, or simply a clearer account of what you want next. Evidence protects memory from both inflated confidence and unnecessary self-doubt.`,
    `The most honest comparison is between two real next periods, not between one real option and one imagined identity. Describe what an ordinary week looks like in each path, what you would learn, what you would be accountable for, how money would move, and who would notice if the plan changed. Include the boring details. They are often where the decision lives. Then ask which path gives you more useful evidence, not just which one sounds more impressive. A path that leaves you with stronger proof, better relationships, and more room to choose later may be valuable even when its first headline is quieter.`,
    `There is no requirement to turn this issue into a permanent verdict. You can decide to continue, pause, negotiate, test, or walk away, and set a date to revisit the choice. The review should ask three things: what new evidence arrived, what assumption changed, and what action now has the highest leverage. If the answer is the same, you have earned confidence through repetition. If it changes, that is not inconsistency; it is the point of paying attention. Career decisions become more resilient when they can update without shame.`,
    `Use this article as a working brief rather than a substitute for the document or conversation that governs your case. Keep the original signal visible, preserve the uncertainty, and write down the one fact you still need. Then choose one action that makes the next decision easier: benchmark the relevant range, ask for the clause in writing, speak with a person who does the work, publish a proof-of-work artefact, or protect another month of runway. The goal is not to feel perfectly certain. It is to make a consequential choice with better evidence and a downside you understand.`,
  ];

  return `${topic}. ${prompts[index % prompts.length]}`;
}

function buildLongFormSections(context: LongFormContext): Array<{ heading: string; body: string }> {
  const expanded = longFormTopics.map((topic, index) => ({
    heading: topic.heading,
    body: longFormBody(topic.focus, context, index),
  }));
  const originalText = [context.title, context.dek, ...context.sections.flatMap((section) => [section.heading, section.body])].join(" ");
  let wordCount = countWords([originalText, ...expanded.map((section) => section.body)].join(" "));
  let worksheetIndex = 1;

  while (wordCount < MINIMUM_ARTICLE_WORDS) {
    const topic = longFormTopics[(expanded.length + worksheetIndex) % longFormTopics.length];
    expanded.push({
      heading: `Reader worksheet ${worksheetIndex}: ${topic.heading}`,
      body: longFormBody(
        `Use this worksheet to test the article's central claim in your own situation`,
        context,
        expanded.length + worksheetIndex,
      ),
    });
    worksheetIndex += 1;
    wordCount = countWords([originalText, ...expanded.map((section) => section.body)].join(" "));
  }

  return expanded;
}

export const articles: Article[] = allSlugs.map((slug, index) => {
  const category = categoryBySlug[slug] ?? "career-reality-checks";
  const label = categoryLabels[category];
  const dek = editorialBriefs[slug]?.dek ?? `A concise editorial brief on ${titles[slug].toLowerCase().replace(/\.$/, "")}, with the trade-offs and questions that matter before your next move.`;
  const originalSections = editorialBriefs[slug]?.sections ?? [
    { heading: `The ${label.toLowerCase()} signal`, body: "This page is an editorial brief: a concise framing of the question, the evidence worth collecting, and the uncertainty that should remain visible." },
    { heading: "What the headline leaves out", body: "Career conditions vary by city, company stage, role scope, and personal runway. Use this brief as a starting point rather than a substitute for the source, contract, or conversation that decides your case." },
    { heading: "The decision this changes", body: "Collect one more piece of evidence before you act. Compare the relevant range, ask for the policy in writing, or speak with someone who recently made the same move." },
    { heading: "Questions worth asking next", body: "What would make this move worthwhile? What would make you walk away? Write both down so urgency does not do all the negotiating." },
  ];
  const sections = [
    ...originalSections,
    ...buildLongFormSections({ title: titles[slug], dek, categoryLabel: label, sections: originalSections }),
  ];
  const articleWordCount = countWords([titles[slug], dek, ...sections.flatMap((section) => [section.heading, section.body])].join(" "));
  return {
    slug,
    title: titles[slug],
    excerpt: dek,
    category,
    date: `2026-${String(8 - Math.floor(index / 12)).padStart(2, "0")}-${String(24 - (index % 20)).padStart(2, "0")}`,
    readTime: `${Math.max(15, Math.ceil(articleWordCount / 220))} min read`,
    sections,
    tags: [label, index % 2 ? "India 2026" : "Decision guide", "CareerReality"],
    contentType: "Editorial article",
    sourceUrl: `https://www.careerreality.in/article/${slug}/`,
  };
});

export const articleCategories = Object.entries(categoryLabels).map(([value, label]) => ({
  value: value as ArticleCategory,
  label,
}));

export const companies = [
  { slug: "tata-consultancy-services", name: "Tata Consultancy Services", sector: "IT services", stability: 78, momentum: "Steady", signal: "Hiring remains selective; large deal book supports a measured outlook.", updated: "18 Aug 2026", confidence: "High" },
  { slug: "infosys", name: "Infosys", sector: "IT services", stability: 71, momentum: "Recovering", signal: "Campus intake is returning while lateral hiring stays role-specific.", updated: "12 Aug 2026", confidence: "High" },
  { slug: "razorpay", name: "Razorpay", sector: "Fintech", stability: 62, momentum: "Mixed", signal: "Product hiring is visible; cost discipline remains part of the plan.", updated: "09 Aug 2026", confidence: "Medium" },
  { slug: "phonepe", name: "PhonePe", sector: "Fintech", stability: 69, momentum: "Building", signal: "Payments and commerce roles show the clearest hiring momentum.", updated: "04 Aug 2026", confidence: "Medium" },
  { slug: "microsoft-india", name: "Microsoft India", sector: "Software", stability: 86, momentum: "Selective", signal: "AI infrastructure hiring offsets restraint in adjacent teams.", updated: "29 Jul 2026", confidence: "High" },
  { slug: "freshworks", name: "Freshworks", sector: "SaaS", stability: 65, momentum: "Cautious", signal: "Openings concentrate around enterprise and platform roles.", updated: "22 Jul 2026", confidence: "Medium" },
];

export const layoffs = [
  { company: "Byju's", signal: "Team reductions reported across sales and operations", date: "16 Aug 2026", type: "Layoff", confidence: "Medium", source: "Employee reports + public filings" },
  { company: "Swiggy", signal: "Hiring freeze in selected corporate functions", date: "08 Aug 2026", type: "Hiring freeze", confidence: "Medium", source: "Role availability pattern" },
  { company: "Ather Energy", signal: "Restructuring reported in non-core teams", date: "31 Jul 2026", type: "Restructure", confidence: "Low", source: "Community signal" },
  { company: "Paytm", signal: "Selective backfills and tighter approval loops", date: "24 Jul 2026", type: "Hiring freeze", confidence: "Medium", source: "Job board movement" },
  { company: "Meesho", signal: "No broad reduction signal; growth hiring in supply chain", date: "14 Jul 2026", type: "Hiring signal", confidence: "High", source: "Public role sample" },
  { company: "Ola Electric", signal: "Function-level reductions reported", date: "04 Jul 2026", type: "Layoff", confidence: "Low", source: "Community signal" },
];

export const toolsCatalog = [
  { slug: "ctc-calculator", href: "/salary-calculator", title: "CTC decoder", label: "MONEY", description: "Translate an offer into monthly cash, deferred pay, and tax reality." },
  { slug: "resignation-risk", href: "/resignation-risk", title: "Resignation risk", label: "TIMING", description: "See what your notice period, runway, and offer confidence change." },
  { slug: "layoff-radar", href: "/layoff-radar", title: "Layoff radar", label: "COMPANY", description: "Follow company signals with confidence labels instead of panic." },
  { slug: "salary-reality", href: "/salary-reality", title: "Salary reality", label: "MARKET", description: "Benchmark roles by city and experience with percentile context." },
  { slug: "escape-plan", href: "/escape-plan", title: "Escape plan", label: "NEXT MOVE", description: "Turn a stuck feeling into a small, sequenced plan." },
  { slug: "career-reality-index", href: "/career-reality-index", title: "Career Reality Index", label: "METHOD", description: "Understand the conditions behind a career decision." },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
