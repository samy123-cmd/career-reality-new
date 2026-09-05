---
name: Public API route ordering
description: Express route composition constraint for public and authenticated API endpoints
---

Unauthenticated public data routes must be mounted before the authenticated workspace router in the API route aggregator.

**Why:** The workspace router currently applies its authentication middleware at router scope, so mounting it first intercepts unrelated public paths and returns a signed-out 401 before later routers can match.

**How to apply:** Keep health and public routes ahead of workspace routes, or narrow the workspace middleware to explicit authenticated path prefixes before adding additional public endpoints.