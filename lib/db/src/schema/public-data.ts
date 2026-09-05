import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const refreshedAt = timestamp("refreshed_at", { withTimezone: true })
  .notNull()
  .defaultNow();

export const salaryBenchmarksTable = pgTable(
  "salary_benchmarks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    role: text("role").notNull(),
    city: text("city").notNull(),
    experienceBand: text("experience_band").notNull(),
    p25: integer("p25").notNull(),
    median: integer("median").notNull(),
    p75: integer("p75").notNull(),
    sampleSize: integer("sample_size").notNull(),
    source: text("source").notNull(),
    sourceUrl: text("source_url"),
    confidence: text("confidence", {
      enum: ["High", "Medium", "Low", "Mixed"],
    }).notNull(),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    refreshedAt,
  },
  (table) => [
    uniqueIndex("salary_benchmarks_role_city_experience_key").on(
      table.role,
      table.city,
      table.experienceBand,
    ),
    index("salary_benchmarks_city_role_idx").on(table.city, table.role),
    index("salary_benchmarks_refreshed_at_idx").on(table.refreshedAt),
  ],
);

export const companySignalsTable = pgTable(
  "company_signals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    sector: text("sector").notNull(),
    stability: integer("stability").notNull(),
    momentum: text("momentum").notNull(),
    signal: text("signal").notNull(),
    source: text("source").notNull(),
    sourceUrl: text("source_url"),
    confidence: text("confidence", {
      enum: ["High", "Medium", "Low", "Mixed"],
    }).notNull(),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    refreshedAt,
  },
  (table) => [
    uniqueIndex("company_signals_slug_key").on(table.slug),
    index("company_signals_sector_idx").on(table.sector),
    index("company_signals_refreshed_at_idx").on(table.refreshedAt),
  ],
);

export const layoffSignalsTable = pgTable(
  "layoff_signals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    company: text("company").notNull(),
    signal: text("signal").notNull(),
    type: text("type", {
      enum: ["Layoff", "Hiring freeze", "Hiring signal", "Restructure"],
    }).notNull(),
    confidence: text("confidence", {
      enum: ["High", "Medium", "Low", "Mixed"],
    }).notNull(),
    source: text("source").notNull(),
    sourceUrl: text("source_url"),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    refreshedAt,
  },
  (table) => [
    uniqueIndex("layoff_signals_company_observed_signal_key").on(
      table.company,
      table.observedAt,
      table.signal,
    ),
    index("layoff_signals_type_observed_at_idx").on(
      table.type,
      table.observedAt,
    ),
    index("layoff_signals_refreshed_at_idx").on(table.refreshedAt),
  ],
);

export type SalaryBenchmark = typeof salaryBenchmarksTable.$inferSelect;
export type CompanySignal = typeof companySignalsTable.$inferSelect;
export type LayoffSignal = typeof layoffSignalsTable.$inferSelect;