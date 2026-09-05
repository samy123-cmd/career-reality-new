import {
  companySignalsTable,
  db,
  layoffSignalsTable,
  salaryBenchmarksTable,
} from "@workspace/db";
import { count } from "drizzle-orm";
import {
  companySignalSeed,
  layoffSignalSeed,
  salaryBenchmarkSeed,
} from "../data/public-signal-seed";

export async function seedPublicSignalData(): Promise<void> {
  const [[salaryCount], [companyCount], [layoffCount]] = await Promise.all([
    db.select({ value: count() }).from(salaryBenchmarksTable),
    db.select({ value: count() }).from(companySignalsTable),
    db.select({ value: count() }).from(layoffSignalsTable),
  ]);

  await Promise.all([
    Number(salaryCount?.value ?? 0) === 0
      ? db.insert(salaryBenchmarksTable).values(salaryBenchmarkSeed)
      : Promise.resolve(),
    Number(companyCount?.value ?? 0) === 0
      ? db.insert(companySignalsTable).values(companySignalSeed)
      : Promise.resolve(),
    Number(layoffCount?.value ?? 0) === 0
      ? db.insert(layoffSignalsTable).values(layoffSignalSeed)
      : Promise.resolve(),
  ]);
}