# SDET Automation Test Suite

Automated test suite covering **UI** (Playwright) and **API** (Jest + Axios) testing, written in **TypeScript**.

| Area | Tool | Target |
|------|------|--------|
| UI Tests | Playwright | [SauceDemo](https://www.saucedemo.com/) |
| API Tests | Jest + Axios | [Reqres.in](https://reqres.in/) |

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- A free **ReqRes API key** (sign up at [app.reqres.in](https://app.reqres.in/signup))

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (Chromium by default)
npx playwright install chromium

# 3. (API tests) Create a .env file with your ReqRes API credentials
cp .env.example .env
# Edit .env and set REQRES_API_BASE_URL and REQRES_API_KEY (see .env.example).
# Get your API key from https://app.reqres.in.
```

---

## Configuration

- **UI tests:** `playwright.config.ts` (base URL, browser, timeouts).
- **API tests:** `jest.config.ts` (roots: `api-tests/`, test match: `**/*.test.ts`, timeout 15s). Both `REQRES_API_BASE_URL` and `REQRES_API_KEY` are required in `.env`; the test file loads them with `dotenv` and throws if either is missing.

---

## Running Tests

### UI Tests (Playwright)

```bash
# Run all UI tests (headless)
npm run test:ui

# Run with browser visible
npm run test:ui:headed

# Open the HTML report
npm run test:ui:report
```

### API Tests (Jest + Axios)

```bash
# Run all API tests
npm run test:api

# Verbose output
npm run test:api:verbose
```

### Run Everything

```bash
npm test
```

---

## Project Structure

```
├── playwright.config.ts          # Playwright config (UI tests)
├── jest.config.ts                # Jest config (API tests)
├── tsconfig.json                 # TypeScript compiler options
├── package.json                  # Dependencies and scripts
├── .env                          # API credentials (git-ignored)
├── .env.example                  # Template for .env setup
│
├── tests/
│   └── ui/                       # UI tests (Playwright)
│       ├── pages/                # Page Object Models
│       │   ├── LoginPage.ts
│       │   ├── ProductsPage.ts
│       │   ├── CartPage.ts
│       │   └── CheckoutPage.ts
│       ├── login-logout.spec.ts
│       ├── single-item-checkout.spec.ts
│       └── multiple-items-checkout.spec.ts
│
└── api-tests/                    # API tests (Jest + Axios)
    ├── setup.ts                  # Jest setup (dotenv, etc.)
    └── reqres-api.test.ts        # GET, POST, status codes, body fields
```

---

## Reporting

### Playwright (UI)

- **Terminal**: `list` reporter prints live pass/fail results.
- **HTML**: Generated in `playwright-report/`. Open with `npm run test:ui:report`.

### Jest (API)

- `default` reporter prints total, passed, and failed counts to the terminal.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Page Object Model** | Keeps selectors and actions isolated from test logic. |
| **data-test selectors** | Resilient to CSS changes; SauceDemo provides them. |
| **Headless by default** | Fast feedback for CI / pre-commit hooks. |
| **Axios + validateStatus** | Prevents Axios from throwing on 4xx/5xx; avoids circular-ref issues in Jest. |
| **Separate api-tests folder** | Keeps API tests decoupled with their own toolchain (Jest vs Playwright). |
| **dotenv for secrets** | API keys loaded from `.env`, never hardcoded. |
