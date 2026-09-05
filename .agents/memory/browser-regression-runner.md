---
name: Browser regression runner
description: Environment constraints for running the CareerReality Playwright browser suite
---

The browser regression suite should launch the system-provided Chromium binary and avoid Playwright video recording.

**Why:** The workspace does not cache Playwright-managed browsers or ffmpeg, while system Chromium is available and supports the suite.

**How to apply:** Preserve the explicit Chromium launch path and trace/screenshot diagnostics in the Playwright configuration when updating the browser tests.