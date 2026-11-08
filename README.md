# DigiSwasthya Website

The public website of the DigiSwasthya Foundation, a telemedicine and rural healthcare initiative. The site presents the organisation's work, accepts donations and enquiries, and publishes live impact figures on the **Our Impact** page. Those figures come from a Python data pipeline that reads the organisation's Management Portal.

## 1. Project Overview

- **Website:** a Next.js application with pages for About Us, Our Team, Network, Partner, Media, Health Tools, Marathon campaign, Donate, Contact Us, Our Impact, an admin area, and privacy, terms and unsubscribe pages. The interface is available in English and Hindi.
- **Server routes:** Next.js route handlers under `src/app/api` handle payments, forms, chat, media, the impact-data API and scheduled jobs.
- **Impact data pipeline:** Python scripts in `src/scripts/agents` log in to the Management Portal, extract the all-time impact report, and publish it to Firestore and to a local fallback file.

## 2. Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling and UI | Tailwind CSS 4, Framer Motion, Lucide icons, React Hook Form |
| Database | Firebase Firestore (web SDK for reading, Admin SDK for the media routes) |
| Payments | Razorpay |
| Email | Resend and Nodemailer |
| AI features | OpenAI SDK (chat and video summaries) |
| Other | pdf-lib (PDF generation) |
| Data pipeline | Python, Playwright, Firebase Admin SDK, optional Google Sheets (gspread) |

## 3. Prerequisites

- **Node.js 20.9 or newer** and **npm** (the repository contains a `package-lock.json`).
- **Python 3** with the packages listed in section 9 (only needed to run the data pipeline). The scheduled workflow uses Python 3.10.
- Firebase and third-party service accounts, only for the features you want to run locally.

## 4. Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file from the template (see section 5)
#    macOS / Linux:  cp .env.example .env.local
#    Windows (cmd):  copy .env.example .env.local
#    then edit .env.local and fill in your own values

# 3. Start the development server
npm run dev
```

Open <http://localhost:3000> in your browser.

## 5. Environment Configuration

- **`.env.example`** lists every environment variable the project reads. It contains **placeholders only**. Use it as the reference for what to configure. Never put real secrets in it.
- **`.env.local`** is used by the **website** (Next.js). Create it from `.env.example`.
- **`.env`** is used by the **Python pipeline**. The pipeline's loader reads only a file named `.env` in the folder where the script is run, so run it from the repository root (see section 9). Portal credentials can also be supplied as ordinary environment variables.
- All `.env*` files except `.env.example` are excluded by `.gitignore`. Do not commit them.
- Variables that start with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets in them.

Variable groups in `.env.example`: Firebase web app, general site settings (app URL, admin PIN, cron secret), Firebase Admin, Razorpay, email (Resend and SMTP), AI providers, and the data pipeline (portal login, Firebase safety check, Google credentials, Google Sheet).

## 6. Available Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

There is currently no automated test script.

## 7. Project Structure

```
.
├── .github/workflows/scraper.yml   Scheduled pipeline workflow (see section 10)
├── docs/                           Feature documentation
├── public/                         Static assets (images, videos, fonts)
├── src/
│   ├── app/                        Pages (App Router) and api/ route handlers
│   ├── components/                 UI components, grouped by feature
│   ├── context/                    Language context (English / Hindi)
│   ├── data/                       Site content, milestone logic and liveImpactStore.json
│   ├── hooks/                      useImpactData (loads the impact data)
│   ├── lib/                        Firebase, email, PDF, rate limiting, SEO helpers
│   ├── scripts/agents/             Python data pipeline
│   ├── translations/               en.json and hi.json
│   └── types/                      Shared TypeScript types
├── .env.example                    Environment variable template (placeholders only)
├── next.config.ts
├── package.json
└── vercel.json                     Scheduled job definition (see section 11)
```

## 8. Our Impact Data Architecture

```
Management Portal
      |  (Python pipeline: scrape -> extract)
      v
 +----+-----------------------------+
 |                                  |
 v                                  v
Firestore: impact_store/latest    src/data/liveImpactStore.json
 |                                  |
 +--------------+-------------------+
                v
        /api/impact/data   (Firestore first, then the JSON file, then static data)
                v
          Our Impact page
```

- **Primary source:** the Firestore document `impact_store/latest`. The API route reads it with the Firebase web SDK, so the Firestore security rules must allow the website to read that document.
- **Fallback:** if Firestore cannot be read or the document does not exist, `/api/impact/data` serves `src/data/liveImpactStore.json`. If that file is missing, it serves the static data in `src/data/impactData.ts`. The order is therefore **Firestore, then `liveImpactStore.json`, then the static fallback**.
- **`liveImpactStore.json`** is a committed snapshot written by the pipeline. It only changes when the pipeline is run and the result is committed.
- **Page loading:** the Our Impact page (via `useImpactData`) requests the API once per page load. Charts and cards read the returned data.
- `src/data/milestoneEngine.ts` also imports `liveImpactStore.json` directly.

## 9. Data Pipeline Setup and Execution

### What each script does (`src/scripts/agents/`)

| Script | Purpose |
|---|---|
| `scraper_agent.py` | Logs in to the Management Portal with Playwright, selects the "all time" report and captures the report data. It fails with a clear error instead of using wrong data. |
| `extractor_agent.py` | Validates the captured data and converts it into the website's data structure. |
| `firebase_sync.py` | Writes the result to Firestore (`impact_store/latest`), protected by a project safety check. |
| `sheets_sync.py` | Updates a Google Sheet when a service-account file is available, and writes a local CSV backup. |
| `pipeline.py` | Runs the steps in order. |

### Execution order

1. Scrape the portal.
2. Extract the data.
3. Overwrite `src/data/liveImpactStore.json`.
4. Upload to Firestore. If this step fails, the run fails and the Sheets step is skipped.
5. Sync to Google Sheets (if configured).

### Setup

The Python packages are currently installed by name only. **There is no `requirements.txt` and the versions are not pinned**, so installations may differ over time:

```bash
pip install playwright requests beautifulsoup4 gspread google-auth python-dotenv firebase-admin
playwright install chromium
```

Provide these through a `.env` file in the repository root or as environment variables (names are in `.env.example`):

- Portal login: `MANAGEMENT_PORTAL_URL`, `MANAGEMENT_PORTAL_EMAIL`, `MANAGEMENT_PORTAL_PASSWORD`.
- Firebase: `FIREBASE_EXPECTED_PROJECT_ID`, plus credentials supplied either as `FIREBASE_SERVICE_ACCOUNT_KEY` (the service-account JSON as text) or `GOOGLE_APPLICATION_CREDENTIALS` (path to a key file kept outside the repository).
- Optional: `GOOGLE_SHEET_ID` for the Google Sheets sync.

### Running

From the repository root:

```bash
python src/scripts/agents/pipeline.py
```

The command accepts an optional report URL argument. Running it **overwrites `src/data/liveImpactStore.json`** and writes to the configured Firestore project, so use a test project while developing.

### Firebase safety check

`firebase_sync.py` refuses to write unless `FIREBASE_EXPECTED_PROJECT_ID` is set, the credentials belong to that project, and the project is on an allow-list. The allow-list is **currently restricted to the configured test project**. It never falls back to default credentials. Using any other project requires a deliberate change in the code.

### Google Sheets

The sync updates a sheet only if a `google-service-account.json` file exists in the project root (it is git-ignored). Without it, the step is skipped, a local CSV backup is written to `src/data/google_sheet_backup.csv`, and the pipeline still completes.

## 10. Scheduled Automation and Current Status

`.github/workflows/scraper.yml` is set up to run the pipeline every Sunday at 00:00 UTC and can also be started manually from the GitHub Actions tab.

**This automation is not currently operational.** Known limitations:

- The workflow does not set `FIREBASE_EXPECTED_PROJECT_ID`, so the Firebase safety check blocks the upload step.
- The safety check currently allows only the configured test project.
- The workflow has no step that commits or publishes the regenerated `liveImpactStore.json`.
- Python dependencies are installed unpinned, and there is no `requirements.txt`.
- No Google Sheets credential file is provided in the workflow, so the Sheets sync would be skipped.

Until these are resolved, run the pipeline manually as described in section 9.

## 11. API Routes and Scheduled Jobs

Route handlers live in `src/app/api`:

| Area | Routes |
|---|---|
| Impact data | `impact/data` |
| Payments and donations | `create-order`, `create-donation`, `donate`, `verify-payment`, `webhook/razorpay` |
| Forms and email | `contact`, `join`, `unsubscribe` |
| AI features | `chat`, `summarize-video` |
| Media and admin | `admin/media`, `admin/verify-pin`, `media/image/[id]` |
| Scheduled and operational | `cron/weekly-email`, `scraper/run` |

**`POST /api/scraper/run`** runs `pipeline.py` from inside the server. It requires an `Authorization: Bearer <CRON_SECRET>` header, and returns 401 if `CRON_SECRET` is not configured. It only works where the Python runtime and the pipeline dependencies are installed on the server.

**Scheduled job (`vercel.json`):** `/api/cron/weekly-email` runs on the cron schedule `30 3 1 * *`, which is **monthly** (03:30 on the 1st of each month), despite the route's name. Set `CRON_SECRET` in every environment where the job or `/api/scraper/run` is used.

## 12. Documentation and Security

- `docs/AGENTIC_MILESTONE_FEATURE.md` describes the milestone celebration feature.
- Never commit secrets. `.gitignore` excludes `.env*` files (except `.env.example`), service-account and private-key files, Python environments, logs, local backups and generated review files.
- Keep service-account key files **outside** the repository and reference them by path.
- This README does not state which Firebase project the live website uses. Check the deployment's environment variables.
