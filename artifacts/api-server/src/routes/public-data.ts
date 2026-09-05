import {
  GetPublicCompanySignalResponse,
  ListLayoffSignalsResponse,
  ListPublicCompanySignalsResponse,
  ListSalaryBenchmarksResponse,
} from "@workspace/api-zod";
import { db, companySignalsTable, layoffSignalsTable, salaryBenchmarksTable } from "@workspace/db";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

const datasetMeta = {
  salary: {
    dataset: "salary_benchmarks",
    source: "CareerReality salary reports + public compensation signals",
    methodology:
      "Ranges combine reported compensation snapshots with public market signals. City and experience adjustments are applied only when the source sample is sparse.",
    confidence: "Medium" as const,
  },
  companies: {
    dataset: "company_signals",
    source: "Public filings + role availability sample",
    methodology:
      "Stability is a directional composite of operating context, hiring shape, and recent public signals. It is not a credit rating or employment guarantee.",
    confidence: "Medium" as const,
  },
  layoffs: {
    dataset: "layoff_signals",
    source: "Public reporting, role availability, and moderated community signals",
    methodology:
      "Signals are published with source confidence and date. A signal is not treated as confirmed employment change without corroboration.",
    confidence: "Mixed" as const,
  },
};

router.get("/public/salary-benchmarks", async (req, res, next) => {
  try {
    const conditions: SQL<unknown>[] = [];
    const role = typeof req.query.role === "string" ? req.query.role.trim() : "";
    const city = typeof req.query.city === "string" ? req.query.city.trim() : "";
    const experienceBand =
      typeof req.query.experienceBand === "string"
        ? req.query.experienceBand.trim()
        : "";

    if (role) conditions.push(eq(salaryBenchmarksTable.role, role));
    if (city) conditions.push(eq(salaryBenchmarksTable.city, city));
    if (experienceBand) {
      conditions.push(
        eq(salaryBenchmarksTable.experienceBand, experienceBand),
      );
    }

    const rows = await db
      .select()
      .from(salaryBenchmarksTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(
        salaryBenchmarksTable.role,
        salaryBenchmarksTable.city,
        salaryBenchmarksTable.experienceBand,
      )
      .limit(100);

    const latestRefresh =
      rows.reduce(
        (latest, row) =>
          row.refreshedAt > latest ? row.refreshedAt : latest,
        rows[0]?.refreshedAt ?? new Date(0),
      );

    res.json(
      ListSalaryBenchmarksResponse.parse({
        data: rows,
        meta: {
          ...datasetMeta.salary,
          refreshedAt: latestRefresh,
          sampleSize: rows.reduce((total, row) => total + row.sampleSize, 0),
        },
      }),
    );
  } catch (error) {
    next(error);
  }
});

router.get("/public/companies", async (req, res, next) => {
  try {
    const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
    const where = query
      ? or(
          ilike(companySignalsTable.name, `%${query}%`),
          ilike(companySignalsTable.sector, `%${query}%`),
        )
      : undefined;
    const rows = await db
      .select()
      .from(companySignalsTable)
      .where(where)
      .orderBy(desc(companySignalsTable.observedAt))
      .limit(100);

    const latestRefresh =
      rows.reduce(
        (latest, row) =>
          row.refreshedAt > latest ? row.refreshedAt : latest,
        rows[0]?.refreshedAt ?? new Date(0),
      );

    res.json(
      ListPublicCompanySignalsResponse.parse({
        data: rows,
        meta: {
          ...datasetMeta.companies,
          refreshedAt: latestRefresh,
          sampleSize: rows.length,
        },
      }),
    );
  } catch (error) {
    next(error);
  }
});

router.get("/public/companies/:slug", async (req, res, next) => {
  try {
    const [row] = await db
      .select()
      .from(companySignalsTable)
      .where(eq(companySignalsTable.slug, req.params.slug))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: "Company signal not found" });
      return;
    }

    res.json(
      GetPublicCompanySignalResponse.parse({
        data: row,
        meta: {
          ...datasetMeta.companies,
          refreshedAt: row.refreshedAt,
          sampleSize: 1,
        },
      }),
    );
  } catch (error) {
    next(error);
  }
});

router.get("/public/layoff-signals", async (req, res, next) => {
  try {
    const conditions: SQL<unknown>[] = [];
    const query =
      typeof req.query.query === "string" ? req.query.query.trim() : "";
    const type = typeof req.query.type === "string" ? req.query.type.trim() : "";

    if (query) {
      conditions.push(
        or(
          ilike(layoffSignalsTable.company, `%${query}%`),
          ilike(layoffSignalsTable.signal, `%${query}%`),
        )!,
      );
    }
    if (
      type === "Layoff" ||
      type === "Hiring freeze" ||
      type === "Hiring signal" ||
      type === "Restructure"
    ) {
      conditions.push(eq(layoffSignalsTable.type, type));
    }

    const rows = await db
      .select()
      .from(layoffSignalsTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(layoffSignalsTable.observedAt))
      .limit(100);
    const latestRefresh =
      rows.reduce(
        (latest, row) =>
          row.refreshedAt > latest ? row.refreshedAt : latest,
        rows[0]?.refreshedAt ?? new Date(0),
      );

    res.json(
      ListLayoffSignalsResponse.parse({
        data: rows,
        meta: {
          ...datasetMeta.layoffs,
          refreshedAt: latestRefresh,
          sampleSize: rows.length,
        },
      }),
    );
  } catch (error) {
    next(error);
  }
});

export default router;