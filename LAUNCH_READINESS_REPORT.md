# LAUNCH-READINESS REVIEW: Restaurant Management System

**Review Date**: 2026-04-03
**Reviewed By**: Multi-specialist launch panel (Principal Engineer, Architect, QA Lead, Security Engineer, SRE/DevOps Lead, Performance Engineer, UX/Accessibility Lead, Data/Analytics Reviewer, Support/Operations Lead, Product/Launch Consultant, Risk Auditor)

---

## 1. EXECUTIVE VERDICT

### NOT PRODUCTION READY

This is a **demo/prototype application** being evaluated for production launch. It is categorically, unambiguously **not production ready**. The system has no backend, no real authentication, no database, no tests, no monitoring, no incident response capability, and stores all data in the browser. Deploying this to production with real users, real revenue, and real restaurant operations would result in **immediate data loss, complete security compromise, and operational failure**.

The existing codebase is a well-structured React frontend prototype built on GitHub Spark (`@github/spark`). The team's own documentation (PRODUCTION_REVIEW_SUMMARY.md, PRE_LAUNCH_CHECKLIST.md) already declares it NOT READY FOR PRODUCTION. This independent review confirms that verdict and finds additional issues the team has not yet documented.

---

## 2. LAUNCH BLOCKERS

### BLOCKER 1: No Authentication System — Severity: CRITICAL

| Field | Detail |
|-------|--------|
| **Confidence** | HIGH |
| **Specialist Lane** | Security |
| **Location** | `src/lib/auth-context.tsx:30-51` |
| **Evidence** | The `login` function accepts `_password: string` and never validates it. Any username from the KV store grants full access. The `_password` parameter is literally unused. |
| **Why it's a problem** | Any person who knows or guesses a username can access any account — staff, manager, admin, or owner — with any password including empty string. |
| **Failure mode** | Attacker enters "owner" as username, "x" as password, gains full admin access to all locations, all financial data, all vendor data, and all approval workflows. |
| **User impact** | Total compromise of all user accounts, data, and operations. |
| **Business impact** | Liability, data breach notifications, loss of customer trust, potential regulatory action. |
| **Recommendation** | Implement real authentication: OAuth2/OIDC provider (Auth0, Clerk, Supabase Auth), or build proper auth with bcrypt password hashing, JWT tokens, session management, rate limiting, MFA. |
| **Validation** | Attempt login with wrong password — it should fail. Attempt brute force — it should lock out. |
| **Owner** | Security Engineer + Backend Lead |

### BLOCKER 2: No Backend / No Database — Severity: CRITICAL

| Field | Detail |
|-------|--------|
| **Confidence** | HIGH |
| **Specialist Lane** | Architecture |
| **Location** | All `useKV` calls across 7 files (auth-context, header, inventory-view, orders-view, vendors-view, analytics-view) |
| **Evidence** | All data is stored via `@github/spark`'s `useKV` hook, which uses browser IndexedDB. There is no server, no API, no database. |
| **Why it's a problem** | Data is local to a single browser on a single device. Clear browser data = all restaurant data gone. No sharing between users. No backup. No transaction integrity. |
| **Failure mode** | Staff member clears browser cache — all inventory, orders, vendor data lost. Two users on different devices cannot see each other's changes. |
| **User impact** | Complete data isolation per browser session; total data loss on any browser reset. |
| **Business impact** | A restaurant management system that cannot persist or share data is fundamentally non-functional. |
| **Recommendation** | Build backend API (Node/Express, Python/FastAPI, etc.) + PostgreSQL database. Replace all `useKV` calls with API calls. |
| **Validation** | Open the app in two browsers — changes in one should appear in the other. |
| **Owner** | Backend Lead + Architect |

### BLOCKER 3: No Server-Side Authorization — Severity: CRITICAL

| Field | Detail |
|-------|--------|
| **Confidence** | HIGH |
| **Specialist Lane** | Security |
| **Location** | `src/lib/permissions.ts`, all view components |
| **Evidence** | Permission checks exist only in the React frontend. All data operations go directly to browser KV store. There is no server to enforce authorization. |
| **Why it's a problem** | Client-side permission checks can be trivially bypassed by any user with browser DevTools. A "staff" user can modify JavaScript to grant themselves "owner" permissions. |
| **Failure mode** | Malicious staff member opens DevTools, modifies their role in localStorage to "owner", gains full system access including approval workflows, analytics, and user management. |
| **User impact** | Privilege escalation allows unauthorized approval of purchase orders, data tampering, financial fraud. |
| **Business impact** | Financial loss, compliance violations, audit trail manipulation. |
| **Recommendation** | All authorization must be enforced server-side. Client checks are for UX only, never for security. |
| **Validation** | Modify localStorage `currentUser` role to "owner" while logged in as "staff" — server should reject privileged operations. |
| **Owner** | Security Engineer + Backend Lead |

### BLOCKER 4: User Session Stored as Plaintext JSON in localStorage — Severity: CRITICAL

| Field | Detail |
|-------|--------|
| **Confidence** | HIGH |
| **Specialist Lane** | Security |
| **Location** | `src/lib/auth-context.tsx:22-23, 47` |
| **Evidence** | `localStorage.setItem('currentUser', JSON.stringify(foundUser))` — the full user object including role is stored in plaintext. On reload, it's parsed and trusted: `JSON.parse(savedUser)`. |
| **Why it's a problem** | Any user can open DevTools > Application > Local Storage > edit the JSON to change their role to "owner". There is no validation, no signature, no token. The application trusts whatever is in localStorage. |
| **Failure mode** | Privilege escalation via localStorage manipulation — trivial to execute, requires zero technical sophistication. |
| **User impact** | Every user is effectively an admin. |
| **Business impact** | The entire RBAC system is security theater. |
| **Recommendation** | Replace with signed JWT tokens validated by a backend. Never trust client-stored role data. |
| **Validation** | Edit localStorage role field — system should reject the tampered session. |
| **Owner** | Security Engineer |

### BLOCKER 5: Zero Test Coverage — Severity: CRITICAL

| Field | Detail |
|-------|--------|
| **Confidence** | HIGH |
| **Specialist Lane** | QA/Testing |
| **Location** | Entire project — no `*.test.*` or `*.spec.*` files exist |
| **Evidence** | No test files exist. No test framework is installed (no vitest, jest, playwright, cypress in package.json). No test scripts in package.json. |
| **Why it's a problem** | There is zero automated verification that any feature works. Every code change is a regression risk. The approval workflow, permission system, analytics calculations, and inventory management are all unverified. |
| **Failure mode** | Any code change may silently break order approval logic, inventory calculations, or permission enforcement with no way to detect it before users do. |
| **User impact** | Users encounter broken features with no safety net. |
| **Business impact** | Every deployment is a gamble. Incident rate will be high. |
| **Recommendation** | Add Vitest for unit/integration tests, Playwright for E2E. Minimum: test auth flow, permission logic, order approval chain, analytics calculations. |
| **Validation** | CI pipeline runs tests and blocks deployment on failure. |
| **Owner** | QA Lead |

### BLOCKER 6: No CI/CD Pipeline for Testing/Deployment — Severity: HIGH

| Field | Detail |
|-------|--------|
| **Confidence** | HIGH |
| **Specialist Lane** | SRE/DevOps |
| **Location** | `.github/workflows/` — only `datadog-ci.yml` exists, and it only tags pipeline metadata |
| **Evidence** | The only CI workflow is a Datadog CI Visibility tag step. It does not build, lint, test, or deploy the application. There is no build verification, no test gate, no deployment automation. |
| **Why it's a problem** | Any commit to main goes unchecked. No build verification, no lint check, no test execution, no deployment safety. |
| **Failure mode** | Broken code is merged to main with no automated detection. |
| **User impact** | Broken deployments reach users. |
| **Business impact** | Downtime, data corruption, reputation damage from broken releases. |
| **Recommendation** | Add GitHub Actions workflow: install > lint > type-check > test > build > deploy (staging) > smoke test > deploy (production). |
| **Validation** | Push a commit with a TypeScript error — CI should fail and block merge. |
| **Owner** | DevOps Lead |

### BLOCKER 7: No Monitoring, Logging, or Alerting — Severity: HIGH

| Field | Detail |
|-------|--------|
| **Confidence** | HIGH |
| **Specialist Lane** | SRE/Reliability |
| **Location** | Entire project — no Sentry, no logging service, no health checks |
| **Evidence** | The `dd-tracer.js` file uses `require('dd-trace')`, a Node.js-only package. The app is a Vite SPA with no Node.js backend. This tracer is dead code — it cannot be used in a browser application. The `dd-trace` package is not even in `package.json`. No other monitoring is integrated. |
| **Why it's a problem** | When something breaks in production, nobody will know until users complain. There is no way to detect errors, measure performance, or diagnose issues. |
| **Failure mode** | Silent failures accumulate. Data corruption goes unnoticed. Performance degrades with no visibility. |
| **User impact** | Users experience broken features with no path to resolution. |
| **Business impact** | Invisible incidents erode trust. Mean time to detect (MTTD) is "whenever someone complains." |
| **Recommendation** | Integrate Sentry for error tracking, implement structured logging, add health check endpoints (when backend exists), set up uptime monitoring. |
| **Validation** | Trigger a JavaScript error — it should appear in Sentry within 60 seconds. |
| **Owner** | SRE Lead |

---

## 3. HIDDEN RISKS

### HR-1: Hardcoded 8% Tax Rate
**Location**: `src/components/views/orders-view.tsx:221` — `const tax = subtotal * 0.08;`
**Risk**: Tax rates vary by jurisdiction, and this is hardcoded. Multi-location restaurants will have different tax rates per location. This will silently generate incorrect tax calculations for any location not in the specific 8% jurisdiction.
**Impact**: Financial compliance failure, incorrect invoices, audit liability.

### HR-2: Non-Unique ID Generation
**Location**: `src/lib/permissions.ts:142` — `generateId()` uses `Date.now()` + `Math.random()`.
**Risk**: `Date.now()` has millisecond resolution. Two items created in the same millisecond (concurrent users, batch operations) can generate colliding IDs. `Math.random()` is not cryptographically secure.
**Impact**: Data corruption when IDs collide — one record silently overwrites another.

### HR-3: Order Number Collision Risk
**Location**: `src/lib/permissions.ts:146-150` — `generateOrderNumber()` uses `Math.random().toString(36).substr(2, 6)` — only 6 random characters.
**Risk**: With ~2.1 billion possible values, birthday paradox gives ~50% collision probability after ~46K orders. A busy restaurant chain will hit this.
**Impact**: Duplicate order numbers cause confusion in accounting, vendor communication, and audit trails.

### HR-4: `useKV` Data Races
**Risk**: Multiple `useKV` hooks reading and writing the same keys (`inventory`, `orders`) across different components with no transaction boundaries. If two users could share the same KV store, concurrent writes would result in lost updates (last-write-wins with no conflict detection).
**Impact**: Inventory counts become inaccurate, orders disappear, data silently corrupted.

### HR-5: Orphaned Spark Platform Dependency
**Location**: `package.json` — `@github/spark` dependency, `useKV` throughout codebase.
**Risk**: The entire data layer is coupled to GitHub Spark, a prototyping platform. There is no migration path to a real database. Moving to production requires rewriting every data access call.
**Impact**: Migration effort is larger than it appears — this is not a thin abstraction layer, it's deeply embedded.

### HR-6: `dd-tracer.js` is Dead Code and Misleading
**Location**: `dd-tracer.js` — uses `require('dd-trace')`, a Node.js-only package.
**Risk**: This file suggests APM monitoring exists, but it's completely non-functional in a browser SPA. It creates false confidence that observability is in place. The `dd-trace` package is not even in `package.json` dependencies.
**Impact**: Team may believe monitoring is configured when it isn't.

### HR-7: Feature Flags in `.env.example` Not Wired
**Evidence**: `.env.example` defines `VITE_ENABLE_NOTIFICATIONS`, `VITE_ENABLE_BARCODE_SCANNING`, `VITE_ENABLE_AUDIT_LOG`, etc. but grep for `import.meta.env` shows only two usages (demo mode check and DEV mode check). None of the feature flags are actually read or enforced in code.
**Impact**: Operators may think they can toggle features via env vars, but nothing will change. False sense of control.

### HR-8: Vendor Notes Field — XSS Risk (Post-Backend)
**Location**: `src/components/views/vendors-view.tsx:119` — renders vendor.notes as raw string.
**Risk**: Currently safe because React escapes by default. But if the team adds `dangerouslySetInnerHTML` for rich text, or if vendor notes flow through a non-React rendering path, this becomes an XSS vector. The notes field accepts free-form text with no validation.
**Impact**: Low currently, but architectural risk when backend is added.

---

## 4. MISSING INFORMATION AND RISK CREATED

| Missing Information | Why It Matters | Risk Created | Assumption Made |
|---|---|---|---|
| **No backend architecture plan** | Cannot assess API security, database design, or scaling strategy | Entire backend is undefined; launch timeline is unknowable | Assuming 6-8 weeks to build (per team's own estimate) |
| **No staging environment** | Cannot verify deployment works before production | First deployment may fail in ways not caught locally | Assuming zero deployment verification exists |
| **No load/performance testing** | Unknown how many concurrent users the system can handle | May crash under real restaurant operations load | Assuming no performance baseline exists |
| **No user acceptance testing** | Unknown if real restaurant operators can use this effectively | UX may not survive contact with real workflows | Assuming PRD requirements are validated only theoretically |
| **No incident response plan** | No runbook, no on-call rotation, no escalation path | When things break, there is no process to fix them | Assuming zero operational readiness |
| **No data seed/migration plan** | No way to populate the system with real restaurant data | First launch will show empty screens to all users | Assuming data entry will be entirely manual |
| **No accessibility audit** | WCAG compliance untested | May exclude users with disabilities; potential ADA liability | Assuming accessibility is untested |
| **No browser compatibility testing** | Unknown if app works in Safari, Firefox, mobile browsers | Users may encounter broken layouts or functionality | Assuming Chrome-only testing |
| **No Datadog API key configured** | The CI workflow requires `DD_API_KEY` secret — unknown if set | CI visibility workflow will silently fail | Assuming not configured |
| **No dependency install success** | `npm ls` shows 19+ missing packages | The project may not even build in its current state | The dev environment may be broken |

---

## 5. MISSING TEST COVERAGE

### Happy Path Tests (Must Have)
1. User logs in with valid credentials — sees dashboard for their role
2. Staff creates inventory item — item appears in inventory list
3. Staff creates purchase order — order status is "pending_manager"
4. Manager approves order — order status advances to "pending_admin"
5. Admin approves order — order status becomes "approved"
6. Location filter works — only location-specific data shown
7. Analytics calculations produce correct values for known test data
8. Linear regression forecast returns sensible predictions

### Edge Case Tests (Must Have)
1. Login with empty username — rejected
2. Login with non-existent username — rejected
3. Stock update to negative number — handled (PRD says "allow negative with flag")
4. Order with zero items — prevented
5. Order with negative prices — prevented
6. Vendor rating outside 0-5 range — prevented
7. Expiration date in the past — flagged appropriately
8. Empty inventory — analytics page shows graceful empty states
9. `getDaysUntilExpiration` across timezone boundaries — correct

### Failure Case Tests (Must Have)
1. KV store unavailable — error boundary catches and shows fallback
2. Malformed data in KV store — JSON.parse doesn't crash the app
3. localStorage full — login gracefully fails
4. localStorage tampered — session invalidated (currently broken — see Blocker 4)

### Abuse Case Tests (Must Have)
1. User modifies localStorage role — server rejects privileged operations
2. Rapid-fire login attempts — rate-limited
3. XSS payload in vendor name/notes — properly escaped
4. Extremely long input values — handled without layout break
5. Concurrent order approvals — no race condition
6. Self-approval of own purchase order — prevented (PRD requirement)

### Regression Case Tests
1. Permission matrix: each of 5 roles x 10 permissions — correct access
2. Order state machine: all valid transitions tested, all invalid transitions rejected
3. Currency formatting for edge values: 0, negative, very large, fractional cents

### Rollback/Recovery Tests
1. Deploy — detect issue — rollback — verify previous version works
2. Database migration — failure — rollback migration — verify data intact

---

## 6. SECURITY AND RELIABILITY JUDGMENT

### Security: UNSAFE

| Aspect | Verdict | Evidence |
|--------|---------|----------|
| Authentication | **Broken** | Password not validated. Any password works. |
| Authorization | **Broken** | Client-side only. Trivially bypassed via DevTools. |
| Session management | **Broken** | Plaintext JSON in localStorage, no expiration, no signature. |
| Input validation | **Absent** | No server-side validation. Client-side forms have basic HTML5 `required` but no sanitization. |
| Rate limiting | **Absent** | No rate limiting anywhere. |
| Audit trail | **Absent** | No logging of who did what. |
| Secret handling | **N/A** | No secrets in the codebase (good), but also no secret management infrastructure. |
| CSRF protection | **Absent** | No tokens, no backend to protect. |
| Dependency vulnerabilities | **Unknown** | `npm ls` shows 19+ missing packages; `npm audit` cannot be run in current state. |

### Reliability: FRAGILE

| Aspect | Verdict | Evidence |
|--------|---------|----------|
| Data persistence | **Unreliable** | Browser IndexedDB — data loss on cache clear. |
| Error handling | **Minimal** | Top-level ErrorBoundary exists. No per-view error boundaries. No API error handling (no API exists). |
| Observability | **None** | No logging, no monitoring, no alerting, no health checks. `dd-tracer.js` is non-functional dead code. |
| Incident response | **None** | No runbook, no on-call, no escalation path, no status page. |
| Rollback capability | **None** | No deployment system, so no rollback system. |
| Backup/Recovery | **None** | Browser data cannot be backed up or restored. |

---

## 7. PRODUCTION HARDENING CHECKLIST

### Product
- [ ] Validate all user journeys with real restaurant operators
- [ ] Test empty states for every view
- [ ] Test error states for every data operation
- [ ] Verify mobile/responsive behavior
- [ ] Run accessibility audit (axe, Lighthouse)
- [ ] Add "data seeding" for first-run experience

### Code
- [ ] Replace all `useKV` with real API calls
- [ ] Implement backend API with proper authentication
- [ ] Replace `localStorage` session with signed JWT/httpOnly cookies
- [ ] Move all authorization to server-side
- [ ] Replace `generateId()` with UUID v4
- [ ] Replace `generateOrderNumber()` with database sequence
- [ ] Make tax rate configurable per location
- [ ] Remove `dd-tracer.js` (dead code)
- [ ] Wire feature flags from `.env` to actual code or remove them
- [ ] Implement code splitting for analytics/charts views

### QA
- [ ] Install test framework (Vitest + Playwright)
- [ ] Write unit tests for all `src/lib/` functions
- [ ] Write integration tests for auth flow
- [ ] Write E2E tests for critical paths (login, inventory CRUD, order approval chain)
- [ ] Achieve >70% code coverage
- [ ] Add tests to CI pipeline as a gate

### Security
- [ ] Implement real authentication (OAuth2/OIDC or bcrypt + JWT)
- [ ] Add server-side authorization middleware
- [ ] Implement rate limiting (login: 10/min, API: 100/min)
- [ ] Add CSRF protection
- [ ] Configure security headers (CSP, HSTS, X-Frame-Options)
- [ ] Run `npm audit` and fix all vulnerabilities
- [ ] Conduct penetration test
- [ ] Implement account lockout after 5 failed attempts
- [ ] Add MFA support for admin/owner roles

### Data
- [ ] Design and implement PostgreSQL schema
- [ ] Build migration scripts
- [ ] Implement automated daily backups
- [ ] Test backup restoration
- [ ] Add data validation at API layer
- [ ] Implement proper transaction boundaries for order operations

### Performance
- [ ] Implement lazy loading for analytics/charts views
- [ ] Reduce bundle size from 864KB to <500KB
- [ ] Add Brotli/Gzip compression
- [ ] Configure CDN for static assets
- [ ] Set cache headers appropriately
- [ ] Run Lighthouse and meet >90 performance score

### Observability
- [ ] Integrate Sentry for error tracking
- [ ] Add structured logging
- [ ] Implement health check endpoints
- [ ] Set up uptime monitoring
- [ ] Create operations dashboard
- [ ] Configure alerting (error rate, latency, uptime)

### Deployment
- [ ] Set up staging environment mirroring production
- [ ] Build CI/CD pipeline (build > lint > test > deploy)
- [ ] Implement automated rollback on failed health check
- [ ] Test rollback procedure end-to-end
- [ ] Document deployment runbook

### Rollback
- [ ] Keep last 3 deployments for instant rollback
- [ ] Test rollback in staging
- [ ] Document rollback procedure
- [ ] Practice rollback drill

### Documentation
- [ ] Write user manual per role
- [ ] Create admin operations guide
- [ ] Write incident response runbook
- [ ] Document API contracts (OpenAPI)
- [ ] Create troubleshooting guide

### Support Readiness
- [ ] Set up support email / ticketing
- [ ] Create canned responses for common issues
- [ ] Write internal troubleshooting guide
- [ ] Define escalation path
- [ ] Train support team on the system

### Launch-Day Command Center
- [ ] Define launch window
- [ ] Assign on-call engineers
- [ ] Prepare monitoring dashboard
- [ ] Have rollback ready
- [ ] Prepare customer communication templates
- [ ] Define go/no-go criteria

---

## 8. TOP 10 HIGHEST-LEVERAGE FIXES

| # | Fix | Risk Reduced | Effort |
|---|-----|-------------|--------|
| 1 | **Implement real authentication** (OAuth2 provider like Auth0/Clerk) | Eliminates complete auth bypass | 1-2 days with SaaS provider |
| 2 | **Build backend API + PostgreSQL database** | Eliminates data loss, enables multi-user, enables server-side auth | 2-4 weeks |
| 3 | **Move authorization to server-side** | Eliminates privilege escalation | 1 week (after backend exists) |
| 4 | **Add CI pipeline with build + lint + test gates** | Prevents broken code from reaching production | 1 day |
| 5 | **Write unit tests for permissions.ts and analytics.ts** | Verifies most critical business logic | 2-3 days |
| 6 | **Integrate Sentry for error tracking** | Provides visibility into production errors | 2 hours |
| 7 | **Replace `generateId()` with UUID v4** | Eliminates ID collision risk | 30 minutes |
| 8 | **Make tax rate configurable per location** | Prevents financial compliance issues | 1 hour |
| 9 | **Remove `dd-tracer.js`** (dead code, false confidence) | Eliminates misleading monitoring assumption | 5 minutes |
| 10 | **Add code splitting for analytics view** | Reduces initial bundle by ~30% | 1-2 hours |

---

## 9. LAUNCH RECOMMENDATION

### DO NOT LAUNCH

This is a prototype/demo built on GitHub Spark. It is suitable for demonstrations, stakeholder presentations, and UX validation. It is not suitable for any production deployment involving real data, real users, or real business operations.

**Minimum path to a limited beta**: 6-8 weeks of focused development to build a backend, implement real authentication, add a database, write tests, and set up basic infrastructure. After that, launch to a single location with closely monitored beta users.

**Path to full production**: 3-4 months including security hardening, performance optimization, load testing, accessibility audit, support preparation, and operational readiness.

---

## 10. BRUTAL TRUTH

**What will fail first**: Authentication. Anyone who visits the app and types "owner" with any password gets full admin access. This isn't a theoretical risk — it's the default behavior. The login page literally shows demo credentials with a note that says "any password" works.

**What the team is underestimating**: The gap between "working prototype" and "production system" is not a few fixes — it's an entire backend, an entire auth system, an entire test suite, an entire deployment pipeline, and an entire operations capability. The documentation suggests 6-8 weeks; this is optimistic unless the team is experienced and full-time.

**What will wake people up at 2 AM**: Nothing — because there is no monitoring, no alerting, no on-call rotation, and no incident response process. When things break (and they will), nobody will know until a restaurant manager calls to say their inventory disappeared because they cleared their browser cache. And then there will be no logs, no audit trail, no backup to restore from, and no rollback to perform.

**The most dangerous thing about this project**: It looks polished. The UI is professional, the code is clean, the documentation is thorough. This creates a dangerous confidence gap. Stakeholders who see the demo will think it's nearly ready. It is not. The surface quality masks the complete absence of production infrastructure underneath.

**The single sentence summary**: This is a beautifully rendered frontend with no backend, no security, no tests, no monitoring, and no data persistence — deploying it to production would be like driving a showroom car with no engine, no brakes, and no seatbelts.
