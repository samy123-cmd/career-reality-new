import type {
  CompanySignal,
  LayoffSignal,
  SalaryBenchmark,
} from "@workspace/db";

const refreshedAt = new Date("2026-08-18T00:00:00.000Z");

const salaryBases = [
  {
    role: "Software engineer",
    base: { p25: 1540000, median: 2480000, p75: 3690000 },
  },
  {
    role: "Product manager",
    base: { p25: 1860000, median: 2740000, p75: 3980000 },
  },
  {
    role: "Data analyst",
    base: { p25: 880000, median: 1420000, p75: 2170000 },
  },
] as const;

const cityMultipliers: Record<string, number> = {
  Bengaluru: 1,
  Mumbai: 1.04,
  "Delhi NCR": 1.01,
  Hyderabad: 0.91,
  Pune: 0.94,
};

const experienceMultipliers: Record<string, number> = {
  "0–2 years": 0.62,
  "3–5 years": 0.82,
  "5–8 years": 1,
  "9+ years": 1.24,
};

const roundToThousand = (value: number) => Math.round(value / 1000) * 1000;

export const salaryBenchmarkSeed: Array<
  Omit<SalaryBenchmark, "id" | "refreshedAt">
> = salaryBases.flatMap(({ role, base }) =>
  Object.entries(cityMultipliers).flatMap(([city, cityMultiplier]) =>
    Object.entries(experienceMultipliers).map(
      ([experienceBand, experienceMultiplier]) => ({
        role,
        city,
        experienceBand,
        p25: roundToThousand(base.p25 * cityMultiplier * experienceMultiplier),
        median: roundToThousand(
          base.median * cityMultiplier * experienceMultiplier,
        ),
        p75: roundToThousand(base.p75 * cityMultiplier * experienceMultiplier),
        sampleSize: 120 + Math.round(experienceMultiplier * 85),
        source: "CareerReality salary reports + public compensation signals",
        sourceUrl: null,
        confidence: "Medium" as const,
        observedAt: refreshedAt,
      }),
    ),
  ),
);

export const companySignalSeed: Array<
  Omit<CompanySignal, "id" | "refreshedAt">
> = [
  {
    slug: "tata-consultancy-services",
    name: "Tata Consultancy Services",
    sector: "IT services",
    stability: 78,
    momentum: "Steady",
    signal:
      "Hiring remains selective; large deal book supports a measured outlook.",
    source: "Public filings + role availability sample",
    sourceUrl: null,
    confidence: "High",
    observedAt: new Date("2026-08-18T00:00:00.000Z"),
  },
  {
    slug: "infosys",
    name: "Infosys",
    sector: "IT services",
    stability: 71,
    momentum: "Recovering",
    signal:
      "Campus intake is returning while lateral hiring stays role-specific.",
    source: "Public filings + role availability sample",
    sourceUrl: null,
    confidence: "High",
    observedAt: new Date("2026-08-12T00:00:00.000Z"),
  },
  {
    slug: "razorpay",
    name: "Razorpay",
    sector: "Fintech",
    stability: 62,
    momentum: "Mixed",
    signal:
      "Product hiring is visible; cost discipline remains part of the plan.",
    source: "Public reporting + role availability sample",
    sourceUrl: null,
    confidence: "Medium",
    observedAt: new Date("2026-08-09T00:00:00.000Z"),
  },
  {
    slug: "phonepe",
    name: "PhonePe",
    sector: "Fintech",
    stability: 69,
    momentum: "Building",
    signal:
      "Payments and commerce roles show the clearest hiring momentum.",
    source: "Public reporting + role availability sample",
    sourceUrl: null,
    confidence: "Medium",
    observedAt: new Date("2026-08-04T00:00:00.000Z"),
  },
  {
    slug: "microsoft-india",
    name: "Microsoft India",
    sector: "Software",
    stability: 86,
    momentum: "Selective",
    signal:
      "AI infrastructure hiring offsets restraint in adjacent teams.",
    source: "Public reporting + role availability sample",
    sourceUrl: null,
    confidence: "High",
    observedAt: new Date("2026-07-29T00:00:00.000Z"),
  },
  {
    slug: "freshworks",
    name: "Freshworks",
    sector: "SaaS",
    stability: 65,
    momentum: "Cautious",
    signal:
      "Openings concentrate around enterprise and platform roles.",
    source: "Public reporting + role availability sample",
    sourceUrl: null,
    confidence: "Medium",
    observedAt: new Date("2026-07-22T00:00:00.000Z"),
  },
];

export const layoffSignalSeed: Array<
  Omit<LayoffSignal, "id" | "refreshedAt">
> = [
  {
    company: "Byju's",
    signal: "Team reductions reported across sales and operations",
    type: "Layoff",
    confidence: "Medium",
    source: "Employee reports + public filings",
    sourceUrl: null,
    observedAt: new Date("2026-08-16T00:00:00.000Z"),
  },
  {
    company: "Swiggy",
    signal: "Hiring freeze in selected corporate functions",
    type: "Hiring freeze",
    confidence: "Medium",
    source: "Role availability pattern",
    sourceUrl: null,
    observedAt: new Date("2026-08-08T00:00:00.000Z"),
  },
  {
    company: "Ather Energy",
    signal: "Restructuring reported in non-core teams",
    type: "Restructure",
    confidence: "Low",
    source: "Community signal",
    sourceUrl: null,
    observedAt: new Date("2026-07-31T00:00:00.000Z"),
  },
  {
    company: "Paytm",
    signal: "Selective backfills and tighter approval loops",
    type: "Hiring freeze",
    confidence: "Medium",
    source: "Job board movement",
    sourceUrl: null,
    observedAt: new Date("2026-07-24T00:00:00.000Z"),
  },
  {
    company: "Meesho",
    signal:
      "No broad reduction signal; growth hiring in supply chain",
    type: "Hiring signal",
    confidence: "High",
    source: "Public role sample",
    sourceUrl: null,
    observedAt: new Date("2026-07-14T00:00:00.000Z"),
  },
  {
    company: "Ola Electric",
    signal: "Function-level reductions reported",
    type: "Layoff",
    confidence: "Low",
    source: "Community signal",
    sourceUrl: null,
    observedAt: new Date("2026-07-04T00:00:00.000Z"),
  },
];