---
name: OpenAPI integer generation
description: Compatibility constraint between the workspace's Orval generator and shared Zod runtime.
---

Use OpenAPI `number` fields rather than `integer` fields for generated API validators while the shared validator package remains on Zod 3.

**Why:** The current Orval generator emits `zod.int()` for OpenAPI integers, but that API is unavailable in Zod 3, so otherwise-valid contract generation fails during the shared library typecheck.

**How to apply:** When adding count or whole-number response fields, model them as `number` until the shared Zod runtime is intentionally upgraded and the full generated-client/server surface is revalidated.