import { expect, test } from "@playwright/test";

const minimumArticleWords = 3_000;

test("every article renders at least 3,000 words", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/articles");

  const articlePaths = await page.locator('a[href^="/article/"]').evaluateAll((links) =>
    [...new Set(links.map((link) => (link as HTMLAnchorElement).getAttribute("href")))].filter(
      (href): href is string => Boolean(href),
    ),
  );
  expect(articlePaths.length).toBeGreaterThan(0);

  for (const articlePath of articlePaths) {
    await page.goto(articlePath);
    const articleText = await page.locator("article").innerText();
    const wordCount = articleText.trim().split(/\s+/).filter(Boolean).length;
    expect(wordCount, `${articlePath} rendered ${wordCount} words`).toBeGreaterThanOrEqual(minimumArticleWords);
  }
});