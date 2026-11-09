# Our Team: automatic website updates from Google Sheets

This folder contains `Code.gs`, a small Google Apps Script that lives inside the team Google Sheet. When someone edits the Sheet, it sends an authenticated "something changed" message to the website. The website then re-reads the Sheet and Drive itself and rebuilds the Our Team page. **The message carries no Sheet data**, and the website never trusts anything in it.

```
Edit in the Sheet -> Apps Script trigger (waits ~2.5 s so bursts merge)
   -> POST https://<site>/api/team-refresh  (secret in the Authorization header)
   -> website marks its stored team data stale and rebuilds /our-team from the real Google data
   -> the page shows the new data (a few seconds after the last edit)
```

## Before you start

1. The website must be deployed with this feature (the `/api/team-refresh` endpoint).
2. Create a secret: a long random value of **at least 24 characters**. For example, in a terminal:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. On the website, set the environment variable **`TEAM_REFRESH_SECRET`** to that value (for Vercel: Project Settings, Environment Variables, for Production; mark it Sensitive) and redeploy. For local testing, put it in `.env.local`. If the variable is missing or shorter than 24 characters, the endpoint rejects every request.
4. Know the webhook address: your site address followed by `/api/team-refresh`. Use the **exact final address** of the site. The site's bare domain `https://digiswasthya.org` redirects (HTTP 308) to `https://www.digiswasthya.org`, and a redirected POST would lose the secret header, so use:

   ```
   https://www.digiswasthya.org/api/team-refresh
   ```

   (The script deliberately does not follow redirects and reports them as an error.)

## Setup, step by step

1. Open the team Google Sheet. Choose **Extensions > Apps Script**.
2. Delete the sample code, paste in the whole contents of `Code.gs`, and click **Save** (the disk icon).
3. Go back to the Sheet and **reload the page**. After a few seconds a new **Website** menu appears.
4. **Website > Settings: webhook address and secret.** Enter the address from above, then the secret. They are stored in the script's private Script Properties, not in the code.
   - Alternative: in the Apps Script editor open Project Settings (the gear icon), scroll to Script Properties and add `WEBSITE_REFRESH_URL` and `WEBSITE_REFRESH_SECRET`.
5. **Website > Set up automatic updates (run once).** Google asks you to authorise the script. You will see "Google hasn't verified this app". This is normal for a script you own: choose Advanced, then "Go to ... (unsafe)", and Allow. The permissions are: connect to an external service (to call the website), see the spreadsheet this script belongs to, show menus and alerts, and run triggers.
6. The script now has two installable triggers: **onEdit** (cell edits, pasted ranges and ticked checkboxes) and **onChange** (inserted or deleted rows and columns). Formatting-only changes are ignored.

## Test it

1. **Website > Refresh Website Team Data.** You should see "The website has been told to refresh". This also refreshes the stored photo list. Within a few seconds, reload the Our Team page on the site: it shows the current Sheet data.
2. Change a designation in the Sheet, wait about 5 seconds, and reload the site. The change appears.
3. **Website > Show status** shows (without revealing the secret) the webhook host, whether the secret is set, how many triggers are installed, and the result of the last notification.

If a test fails, the alert says why:

| Message | Meaning |
|---|---|
| HTTP 401 | The secret is wrong, or the website has no `TEAM_REFRESH_SECRET` (or a value shorter than 24 characters). |
| HTTP 404 | Wrong address, or the website has not been deployed with this feature yet. |
| Redirect (3xx) | Use the final address, for example the one starting with `https://www.`. |
| HTTP 429, 5xx or network error | The website is temporarily unavailable. The script retries twice (after 1 s and 3 s) and then gives up. |

## What happens when something is unavailable

- **Google (Sheets or Drive) is down or rate-limited when the website re-reads:** the website keeps showing the **last successfully loaded** team data. A failed, incomplete or invalid read never replaces it. The built-in static list is used only if no successful read has ever been stored.
- **The Sheet has a mistake** (for example a missing column, an unknown section name, or no valid rows): the same rule applies, and the website keeps the previous good data until the Sheet is valid again. Rows with an unknown section or a missing name are simply skipped.
- **The website or the webhook is unavailable:** the script retries temporary failures twice and then records the failure (see Show status). The website still catches up by itself, because its stored data is also refreshed when the page is rebuilt (at most every 5 minutes while the page is visited). Use the manual menu item once the site is back.
- **Many edits in a burst:** the script sends one notification after the burst settles (at most 30 seconds after it began), and the website merges overlapping notifications, so Google is read once per burst, not once per edit.

## Known limitations

- **Edits made through the Google Sheets API or by other scripts do not fire `onEdit`.** `onChange` may fire for some of them, but that is not guaranteed. After a bulk update done by software, use **Website > Refresh Website Team Data**. A later phase adds a scheduled reconciliation that will also catch anything missed.
- **Photos are not covered by this script.** Uploading, replacing, renaming or deleting a file in the Drive `Photos` folder does not fire a Sheet trigger. Use the manual menu item (it refreshes the photo list too), or wait for the next regular rebuild. Automatic photo notifications come in a later phase.
- **A narrow race:** if a change is made in the fraction of a second between the website starting to read the Sheet and storing the result, it can be missed until the next rebuild (a few minutes at most).
- **The triggers run as the person who installed them.** If that person loses access to the Sheet, the triggers stop silently. Check Show status now and then.
- **Run-time quota:** each edit uses about 3 seconds of trigger run time while it waits for the burst to finish. Apps Script limits total trigger run time per day (about 90 minutes for personal Google accounts), which ordinary editing stays far below.
- Open browser tabs do not update by themselves. Visitors see the new data when they open or reload the page.

## Security notes

- The secret lets someone **ask the website to refresh itself**, nothing more: it cannot read or write any data. Even so, treat it as a secret.
- People who can edit the Sheet can open this script and read its Script Properties, including the secret. Limit who can edit the Sheet, and **rotate the secret** if an editor leaves: change `TEAM_REFRESH_SECRET` on the website, redeploy, and enter the new value under Website > Settings.
- The script sends the secret only over HTTPS, never logs it, and never shows it again after you save it.
- The website compares the secret in constant time, rejects everything if it is not configured, limits request size, and returns no Google data or error details.
- To stop notifications: **Website > Turn off automatic updates**.

## Optional: restricting the script's permissions

If you edit the manifest (Project Settings > "Show appsscript.json manifest file in editor"), the script needs only these OAuth scopes:

```json
"oauthScopes": [
  "https://www.googleapis.com/auth/script.external_request",
  "https://www.googleapis.com/auth/spreadsheets.currentonly",
  "https://www.googleapis.com/auth/script.scriptapp",
  "https://www.googleapis.com/auth/script.container.ui"
]
```
