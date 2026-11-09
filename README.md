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

## 13. Our Team Page: Google Sheets + Google Drive

The Our Team page (`/our-team`) reads its people and photographs from Google instead of from code:

- A **Google Sheet** lists the team, one row per person.
- A **Google Drive** folder holds the photographs.
- The built-in list in `src/data/teamData.ts` is the **fallback**. If Google is not configured, cannot be reached, or returns no usable rows, the page shows that built-in list instead, so it keeps working.

The code that reads Google is `src/lib/teamDirectory.ts`. Photographs are delivered by the server route `src/app/api/team-photo/[fileId]/[version]/route.ts`.

> The chatbot's team information still comes from `src/data/teamData.ts`. It is not updated from the Sheet yet.

### The Google Sheet

The first row must contain these column headings (the reader finds columns by heading, so their order does not matter):

| Column | Meaning |
|---|---|
| `name` | Required. |
| `designation` | Required. For doctors, this decides the speciality group on the page (new designations appear under "Other Specialists"). |
| `section` | Required. Exactly one of: `Board of Directors`, `Core Team`, `Founding Team`, `Advisory Board`, `Doctors Onboard`, `On-Ground Team`. Rows with any other value are skipped. |
| `photo_filename` | Optional. The exact name of an image file in the Drive `Photos` folder (capital and small letters are treated alike). If blank, or if no such file exists, the card shows the person's initial letter. |
| `display_order` | A number. Within a section, people are shown in ascending order. A blank or non-numeric value places the person last, in sheet order. |
| `is_active` | **Must be `TRUE` for the person to appear.** A ticked checkbox counts as `TRUE`. Blank, `FALSE` and any other value hide the person. |

The sections always appear in the order listed above. The first tab of the Sheet is read, unless `GOOGLE_TEAM_SHEET_TAB` names another tab.

- **Add a person:** add a row and set `is_active` to `TRUE`. A new row with `is_active` blank stays hidden.
- **Change a designation or name:** edit the cell.
- **Hide a person:** set `is_active` to `FALSE`, or delete the row.
- **Reorder:** change `display_order`.

### The photographs in Google Drive

Photographs live in a folder named `Photos` inside the team's Google Drive parent folder. The reader also accepts one extra level (`Photos` / `Photos` / images), as long as the outer folder holds no images itself.

- Allowed formats: JPEG, PNG and WebP, up to 5 MB each.
- To change a photograph, replace the file's content in Drive (for example with "Manage versions"), or upload a new file and update `photo_filename`. If two files share a name, the most recently modified one is used.
- Each photograph's web address includes a fingerprint of its content, so a replaced photo is never shown from an old cache.
- The photo route only serves image files that are currently inside that configured `Photos` folder. It cannot be used to reach any other file in Drive.

### Setup

1. In Google Cloud, create a **service account**, enable the **Google Sheets API** and the **Google Drive API** for its project, and create a JSON key for it. Keep the key file outside this repository.
2. **Share with the service account as Viewer.** Open the Drive parent folder, choose Share, and add the service account's email address with the **Viewer** role. If the Sheet is inside that folder, it is covered. If it is somewhere else, share the Sheet itself with the service account as **Viewer** too.
3. Set these environment variables. The names and placeholders are in `.env.example`:

| Variable | Purpose |
|---|---|
| `GOOGLE_TEAM_SERVICE_ACCOUNT_KEY` | The service-account JSON, as text on one line. A secret. |
| `GOOGLE_TEAM_SHEET_ID` | The ID of the Google Sheet. |
| `GOOGLE_TEAM_DRIVE_FOLDER_ID` | The ID of the Drive parent folder that contains `Photos`. |
| `GOOGLE_TEAM_SHEET_TAB` | Optional. The tab name to read. Defaults to the first tab. |
| `TEAM_REFRESH_SECRET` | Optional. Only needed for automatic updates (see below). A long random secret of at least 24 characters. |

For local development, put them in `.env.local` and restart the development server. For a deployed site, add the same variables in the hosting platform's environment settings (on Vercel: Project Settings, Environment Variables) and redeploy.

### When changes appear

- The page uses Next.js time-based revalidation (`export const revalidate = 300`). A generated page is cached and reused. Once 300 seconds (five minutes) have passed since it was generated, the next visitor still receives the cached page, while Next.js regenerates a fresh one in the background. Visitors after that receive the new version. So a change in the Sheet or Drive appears after at least five minutes and once the page has been visited again. It is not instant.
- In development (`npm run dev`) pages are produced on each request, so changes show after a reload.
- Every successful read of the Sheet and Drive is kept as a "last good" snapshot in Next.js's shared server-side cache. If Google cannot be read when the page is generated, that last good snapshot keeps being shown. The built-in `src/data/teamData.ts` list is used only when no successful snapshot has ever been stored (for example, before the first successful read). A failed or incomplete read is never stored as a snapshot.

### Automatic updates from Google Sheets (Apps Script)

Without anything extra, changes appear within about five minutes (see above). To make **Sheet edits appear within seconds**, install the Google Apps Script in `docs/team-apps-script/` in the team Sheet. It sends an authenticated "something changed" message to `POST /api/team-refresh`. Step-by-step instructions, troubleshooting and limitations are in [`docs/team-apps-script/README.md`](docs/team-apps-script/README.md).

How it works:

1. An installable `onEdit` trigger (cell edits, pastes, ticked checkboxes) and `onChange` trigger (inserted or deleted rows and columns) fire in the Sheet. The script waits about 2.5 seconds so a burst of edits becomes one message, then sends it. A **Website > Refresh Website Team Data** menu item sends one on demand and also refreshes the stored photo list.
2. The endpoint accepts only `POST`, checks `Authorization: Bearer <TEAM_REFRESH_SECRET>` in constant time, and rejects everything if the secret is missing or shorter than 24 characters. Request bodies are limited to 2 KB. The message is only a **signal**: nothing in it is used as team data.
3. The endpoint marks the stored team data (cache tag `team-directory`, and `team-photos` for a manual refresh) as stale and asks for the page once, so it is rebuilt from the real Google data right away. Overlapping messages are merged, so one burst causes one re-read.
4. The rebuild applies the normal validation. The stored snapshot is replaced **only** after a complete, valid read; if Google fails or the Sheet is invalid, the last good snapshot keeps being shown.

The webhook address is your production site address followed by `/api/team-refresh`. Use the exact final address: `https://digiswasthya.org` redirects to `https://www.digiswasthya.org`, and a redirected POST would lose the secret header.

Limitations: Sheet edits made through the Google Sheets API do not fire `onEdit`; changes in the Drive `Photos` folder do not notify the website yet (use the manual menu item); open browser tabs do not update by themselves; and a scheduled reconciliation that catches anything missed is planned for a later phase. In the meantime the regular five-minute rebuild still applies as a backstop.

### Security

- The service-account key is **server-side only**. It must **never** be placed in a variable that starts with `NEXT_PUBLIC_`, because Next.js sends those to visitors' browsers. None of the variables above use that prefix.
- Never commit the key or `.env.local`, and never paste the key into code, issues or chat. Keep the key file outside the repository.
- The code asks Google for read-only access only, and the service account only needs the **Viewer** role.
- Anyone who can edit the Sheet or the `Photos` folder can change what the public website shows. Restrict editing access accordingly.
