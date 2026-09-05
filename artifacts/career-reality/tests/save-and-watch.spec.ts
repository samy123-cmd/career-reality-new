import { expect, test, type Page, type Route } from "@playwright/test";

const company = {
  id: "company-acme",
  slug: "acme-corp",
  name: "Acme Corp",
  sector: "Technology",
  stability: 76,
  momentum: "Hiring selectively",
  signal: "New hiring is concentrated in revenue teams.",
  source: "Public filings",
  confidence: "High",
  observedAt: "2026-08-18T00:00:00.000Z",
  refreshedAt: "2026-08-20T00:00:00.000Z",
};

const layoffSignal = {
  id: "signal-acme",
  company: company.name,
  signal: "Hiring has slowed in two teams.",
  type: "Hiring freeze",
  source: "Public reporting",
  confidence: "High",
  observedAt: "2026-08-18T00:00:00.000Z",
};

const salaryBenchmark = {
  id: "salary-software-bengaluru",
  role: "Software engineer",
  city: "Bengaluru",
  experienceBand: "5–8 years",
  p25: 1600000,
  median: 2200000,
  p75: 3000000,
  sampleSize: 42,
  source: "CareerReality reported snapshots",
  sourceUrl: null,
  confidence: "High",
  observedAt: "2026-08-18T00:00:00.000Z",
  refreshedAt: "2026-08-20T00:00:00.000Z",
};

type SavedDecision = {
  id: string;
  kind: "salary";
  title: string;
  summary: string;
  signal: string;
  createdAt: string;
};

type WatchlistItem = {
  id: string;
  company: string;
  signal: string;
  note: string;
  createdAt: string;
};

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

type CompassFixtureOptions = {
  failSource?: "salary" | "company" | "layoff";
  failAction?: "save" | "watchlist";
  failWorkspace?: boolean;
};

async function installCompassFixtures(page: Page, options: CompassFixtureOptions = {}) {
  const savedDecisions: SavedDecision[] = [];
  const watchlist: WatchlistItem[] = [];
  let sourceFailuresRemaining = options.failSource ? 2 : 0;
  let actionFailed = false;
  let workspaceFailuresRemaining = options.failWorkspace ? 2 : 0;

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    if (path === "/api/public/salary-benchmarks" && request.method() === "GET") {
      if (options.failSource === "salary" && sourceFailuresRemaining > 0) {
        sourceFailuresRemaining -= 1;
        return json(route, { error: "Salary source unavailable" }, 503);
      }
      return json(route, { data: [salaryBenchmark], meta: { dataset: "salary", refreshedAt: salaryBenchmark.refreshedAt, source: salaryBenchmark.source, methodology: "Reported snapshots", confidence: "High", sampleSize: salaryBenchmark.sampleSize } });
    }
    if (path === "/api/public/companies" && request.method() === "GET") {
      if (options.failSource === "company" && sourceFailuresRemaining > 0) {
        sourceFailuresRemaining -= 1;
        return json(route, { error: "Company source unavailable" }, 503);
      }
      return json(route, { data: [company], meta: { dataset: "companies", refreshedAt: company.refreshedAt, source: company.source, methodology: "Public filings", confidence: "High", sampleSize: 1 } });
    }
    if (path === "/api/public/layoff-signals" && request.method() === "GET") {
      if (options.failSource === "layoff" && sourceFailuresRemaining > 0) {
        sourceFailuresRemaining -= 1;
        return json(route, { error: "Layoff source unavailable" }, 503);
      }
      return json(route, { data: [layoffSignal], meta: { dataset: "layoffs", refreshedAt: company.refreshedAt, source: "Public reporting", methodology: "Editorial review", confidence: "High", sampleSize: 1 } });
    }
    if (path === "/api/saved-decisions" && request.method() === "GET") {
      if (options.failWorkspace && workspaceFailuresRemaining > 0) {
        workspaceFailuresRemaining -= 1;
        return json(route, { error: "Workspace unavailable" }, 503);
      }
      return json(route, savedDecisions);
    }
    if (path === "/api/saved-decisions" && request.method() === "POST") {
      if (options.failAction === "save" && !actionFailed) {
        actionFailed = true;
        return json(route, { error: "Save unavailable" }, 503);
      }
      const input = JSON.parse(request.postData() ?? "{}") as Omit<SavedDecision, "id" | "createdAt">;
      const decision: SavedDecision = {
        ...input,
        id: `decision-${savedDecisions.length + 1}`,
        createdAt: "2026-09-04T00:00:00.000Z",
      };
      savedDecisions.push(decision);
      return json(route, decision, 201);
    }
    if (path === "/api/watchlist" && request.method() === "GET") {
      return json(route, watchlist);
    }
    if (path === "/api/watchlist" && request.method() === "POST") {
      if (options.failAction === "watchlist" && !actionFailed) {
        actionFailed = true;
        return json(route, { error: "Watchlist unavailable" }, 503);
      }
      const input = JSON.parse(request.postData() ?? "{}") as Omit<WatchlistItem, "id" | "createdAt">;
      const item: WatchlistItem = {
        ...input,
        id: `watch-${watchlist.length + 1}`,
        createdAt: "2026-09-04T00:00:00.000Z",
      };
      watchlist.push(item);
      return json(route, item, 201);
    }
    if (path === "/api/workspace/summary" && request.method() === "GET") {
      return json(route, {
        savedDecisionCount: savedDecisions.length,
        watchlistCount: watchlist.length,
        latestDecision: savedDecisions.at(-1) ?? null,
        latestWatchlistItem: watchlist.at(-1) ?? null,
      });
    }

    return route.continue();
  });
}

async function installApiFixtures(page: Page) {
  const savedDecisions: SavedDecision[] = [];
  const watchlist: WatchlistItem[] = [];

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    if (path === "/api/public/companies" && request.method() === "GET") {
      return json(route, { data: [company], meta: { refreshedAt: company.refreshedAt, confidence: "High" } });
    }
    if (path === `/api/public/companies/${company.slug}` && request.method() === "GET") {
      return json(route, { data: company });
    }
    if (path === "/api/public/layoff-signals" && request.method() === "GET") {
      return json(route, { data: [layoffSignal], meta: { refreshedAt: company.refreshedAt, confidence: "High" } });
    }
    if (path === "/api/saved-decisions" && request.method() === "GET") {
      return json(route, savedDecisions);
    }
    if (path === "/api/saved-decisions" && request.method() === "POST") {
      const input = JSON.parse(request.postData() ?? "{}") as Omit<SavedDecision, "id" | "createdAt">;
      const decision: SavedDecision = {
        ...input,
        id: `decision-${savedDecisions.length + 1}`,
        createdAt: "2026-09-04T00:00:00.000Z",
      };
      savedDecisions.push(decision);
      return json(route, decision, 201);
    }
    if (path === "/api/watchlist" && request.method() === "GET") {
      return json(route, watchlist);
    }
    if (path === "/api/watchlist" && request.method() === "POST") {
      const input = JSON.parse(request.postData() ?? "{}") as Omit<WatchlistItem, "id" | "createdAt">;
      const item: WatchlistItem = {
        ...input,
        id: `watch-${watchlist.length + 1}`,
        createdAt: "2026-09-04T00:00:00.000Z",
      };
      watchlist.push(item);
      return json(route, item, 201);
    }
    if (path === "/api/workspace/summary" && request.method() === "GET") {
      return json(route, {
        savedDecisionCount: savedDecisions.length,
        watchlistCount: watchlist.length,
        latestDecision: savedDecisions.at(-1) ?? null,
        latestWatchlistItem: watchlist.at(-1) ?? null,
      });
    }

    return route.continue();
  });
}

async function signInForTest(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("career-reality-e2e-auth", "signed-in");
  });
}

async function captureAnalytics(page: Page) {
  await page.addInitScript(() => {
    const storageKey = "career-reality-e2e-events";
    const storedEvents = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as unknown[];
    (window as Window & { __e2eEvents?: unknown[] }).__e2eEvents = storedEvents;
    window.umami = {
      track(name, data) {
        const events = ((window as Window & { __e2eEvents?: unknown[] }).__e2eEvents ??= []);
        events.push({ name, data });
        window.localStorage.setItem(storageKey, JSON.stringify(events));
      },
    };
  });
}

test.describe("save and watch loops", () => {
  test("saves a CTC calculation and keeps it after a workspace refresh", async ({ page }) => {
    await signInForTest(page);
    await installApiFixtures(page);
    await page.goto("/salary-calculator");

    await page.getByRole("button", { name: "Show my in-hand" }).click();
    await page.getByRole("button", { name: "Save to workspace" }).click();
    await expect(page.getByRole("button", { name: "Saved to workspace" })).toBeVisible();
    await page.getByRole("link", { name: "Open private workspace" }).click();
    await expect(page).toHaveURL(/\/workspace$/);

    await page.getByTestId("tab-decisions").click();
    await expect(page.getByText("Software engineer offer decision")).toBeVisible();
    await page.reload();
    await page.getByTestId("tab-decisions").click();
    await expect(page.getByText("Software engineer offer decision")).toBeVisible();
  });

  test("carries a company into Layoff Radar and shows it in the workspace watchlist", async ({ page }) => {
    await signInForTest(page);
    await installApiFixtures(page);
    await page.goto("/companies");

    await page.getByRole("link", { name: /Acme Corp/ }).click();
    await page.getByRole("link", { name: "See this company on layoff radar" }).click();
    await expect(page).toHaveURL(/\/layoff-radar\?query=Acme%20Corp/);
    await page.getByRole("button", { name: "Watch this company" }).click();
    await expect(page.getByRole("button", { name: "Watching in workspace" })).toBeVisible();
    await page.getByRole("link", { name: "Open watchlist" }).click();

    await page.getByTestId("tab-watchlist").click();
    await expect(page.getByText("Acme Corp")).toBeVisible();
    await page.reload();
    await page.getByTestId("tab-watchlist").click();
    await expect(page.getByText("Acme Corp")).toBeVisible();
  });

  test("returns a signed-out user to the originating public page after sign-in", async ({ page }) => {
    await installApiFixtures(page);
    await page.goto("/salary-calculator");

    await page.getByRole("button", { name: "Show my in-hand" }).click();
    await page.getByRole("button", { name: "Save to workspace" }).click();
    await expect(page).toHaveURL(/\/sign-in\?redirect_url=%2Fsalary-calculator/);
    await page.getByTestId("button-e2e-sign-in").click();
    await expect(page).toHaveURL(/\/salary-calculator$/);
  });

  test("sends only safe dimensions to analytics", async ({ page }) => {
    await signInForTest(page);
    await captureAnalytics(page);
    await installApiFixtures(page);
    await page.goto("/salary-calculator");
    await page.getByRole("button", { name: "Show my in-hand" }).click();
    await page.getByRole("button", { name: "Save to workspace" }).click();

    const events = await page.evaluate(() => (window as Window & { __e2eEvents?: unknown[] }).__e2eEvents ?? []);
    expect(events.length).toBeGreaterThan(0);
    const payload = JSON.stringify(events);
    expect(payload).not.toContain("2400000");
    expect(payload).not.toContain("estimated monthly take-home");
    expect(payload).not.toMatch(/"summary"|"signal"|"note"|"salary_amount"|"ctc_amount"/);

    const safeKeys = new Set([
      "tool",
      "city",
      "role_category",
      "confidence_band",
      "route",
      "catalog_slug",
      "content_kind",
      "location",
    ]);
    for (const event of events as Array<{ data?: Record<string, unknown> }>) {
      for (const key of Object.keys(event.data ?? {})) {
        expect(safeKeys.has(key), `Unexpected analytics dimension: ${key}`).toBe(true);
      }
    }
  });

  test("completes the preferred Compass snapshot and watchlist loop", async ({ page }) => {
    await signInForTest(page);
    await captureAnalytics(page);
    await installCompassFixtures(page);
    await page.goto("/");
    await expect(page).toHaveURL(/\/compass$/);

    await page.getByRole("tab", { name: /Is now the right time/ }).click();
    await page.getByRole("button", { name: "Show breakdown" }).click();
    await page.getByLabel("Notice period in days").fill("75");
    await page.getByRole("button", { name: "Watch this company" }).click();
    await expect(page.getByRole("button", { name: "Watching in workspace" })).toBeVisible();
    await page.getByRole("button", { name: "Save snapshot" }).click();
    await expect(page.getByRole("button", { name: "Snapshot saved" })).toBeVisible();

    await page.getByRole("link", { name: "Open workspace" }).click();
    await expect(page).toHaveURL(/\/workspace$/);
    await page.getByTestId("tab-decisions").click();
    await expect(page.getByText("CareerReality Compass snapshot")).toBeVisible();
    await page.reload();
    await page.getByTestId("tab-decisions").click();
    await expect(page.getByText("CareerReality Compass snapshot")).toBeVisible();
    await page.getByTestId("tab-watchlist").click();
    await expect(page.getByText("Acme Corp")).toBeVisible();

    const events = await page.evaluate(() => (window as Window & { __e2eEvents?: unknown[] }).__e2eEvents ?? []);
    const names = (events as Array<{ name: string }>).map((event) => event.name);
    expect(names).toEqual(expect.arrayContaining([
      "compass_opened",
      "decision_tab_selected",
      "breakdown_opened",
      "notice_period_changed",
      "snapshot_saved",
      "company_added_to_watchlist",
      "workspace_opened",
    ]));
    const safeKeys = new Set([
      "route",
      "decision_key",
      "notice_period_band",
      "catalog_slug",
      "content_kind",
      "confidence_band",
      "location",
    ]);
    for (const event of events as Array<{ data?: Record<string, unknown> }>) {
      for (const key of Object.keys(event.data ?? {})) {
        expect(safeKeys.has(key), `Unexpected Compass analytics dimension: ${key}`).toBe(true);
      }
    }
  });

  test("returns a signed-out user to Compass after authentication", async ({ page }) => {
    await installCompassFixtures(page);
    await page.goto("/compass");
    await page.getByRole("button", { name: "Save snapshot" }).click();
    await expect(page).toHaveURL(/\/sign-in\?redirect_url=%2Fcompass/);
    await page.getByTestId("button-e2e-sign-in").click();
    await expect(page).toHaveURL(/\/compass$/);
  });

  test("keeps Compass useful and recoverable when a live source fails", async ({ page }) => {
    await signInForTest(page);
    await installCompassFixtures(page, { failSource: "salary" });
    await page.goto("/compass");
    await expect(page.getByRole("status")).toContainText("Partial read");
    await expect(page.getByText("Salary benchmark · Retry")).toBeVisible();
    await page.getByRole("button", { name: "Salary benchmark · Retry" }).click();
    await expect(page.getByText("grounded read")).toBeVisible();
    await expect(page.getByText("The money has a range")).toBeVisible();
  });

  test("preserves Compass context across failed save and watch actions", async ({ page }) => {
    await signInForTest(page);
    await installCompassFixtures(page, { failAction: "save" });
    await page.goto("/compass");
    await page.getByRole("button", { name: "Save snapshot" }).click();
    await expect(page.getByRole("status")).toContainText("Could not save this read");
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("button", { name: "Snapshot saved" })).toBeVisible();

    await page.reload();
    await installCompassFixtures(page, { failAction: "watchlist" });
    await page.getByRole("button", { name: "Watch this company" }).click();
    await expect(page.getByRole("status")).toContainText("Could not add this company");
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("button", { name: "Watching in workspace" })).toBeVisible();
  });

  test("offers a retry when the workspace decision list fails", async ({ page }) => {
    await signInForTest(page);
    await installCompassFixtures(page, { failWorkspace: true });
    await page.goto("/workspace");
    await page.getByTestId("tab-decisions").click();
    await expect(page.getByText("Could not load decisions.")).toBeVisible();
    await page.getByRole("button", { name: "Retry" }).click();
    await expect(page.getByText("No decisions recorded yet.")).toBeVisible();
  });
});