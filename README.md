This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Our Team page: Google Sheets + Google Drive

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
