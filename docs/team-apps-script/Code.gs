/**
 * Digiswasthya - Our Team: tell the website when the team Sheet changes.
 *
 * This script is bound to the team Google Sheet (Extensions > Apps Script). It sends a small, authenticated
 * "something changed" message to the website, which then re-reads the Sheet itself. The message carries NO sheet data.
 *
 * SETUP (full instructions: docs/team-apps-script/README.md)
 *   1. Paste this file into the Sheet's Apps Script project and save.
 *   2. Reload the Sheet. A "Website" menu appears.
 *   3. Website > Settings: enter the webhook address and the secret (the same value as TEAM_REFRESH_SECRET on the site).
 *   4. Website > Set up automatic updates (run once, and approve the permissions).
 *   5. Test with Website > Refresh Website Team Data.
 *
 * SECURITY
 *   - The address and secret are stored in Script Properties, never in this file. Never paste the secret into the code.
 *   - The secret is never logged or shown. Logs contain only "success/failure", an HTTP status code and the event kind.
 *   - People who can edit the Sheet can also open this script and read its Script Properties. The secret only lets
 *     someone ask the website to refresh itself (nothing else), but rotate it if an editor leaves.
 *
 * LIMITATIONS
 *   - Installable onEdit does NOT fire for changes made through the Google Sheets API or by other scripts. onChange
 *     may fire for some of those, but that is not guaranteed. A later phase adds a reconciliation job that catches
 *     anything missed. Until then, use the manual menu item after bulk imports done by software.
 *   - The triggers run as the person who installed them. If that person loses access, they stop silently.
 *   - Each edit uses about DEBOUNCE_MS of trigger run time (it waits for the burst to finish). Apps Script has a daily
 *     run-time quota (about 90 minutes for personal accounts), which normal editing stays well below.
 */

// ---- Settings you may change ----
var DEBOUNCE_MS = 2500;      // wait this long after the last edit before notifying (merges bursts of edits)
var MAX_WAIT_MS = 30000;     // never delay a notification longer than this, even if edits keep coming
var RETRY_DELAYS_MS = [1000, 3000]; // waits before retrying a temporary failure (429, 5xx, network error)

// ---- Script Property names (values are set through the menu, not in this file) ----
var PROP_URL = 'WEBSITE_REFRESH_URL';
var PROP_SECRET = 'WEBSITE_REFRESH_SECRET';
var PROP_TAB = 'TEAM_TAB_NAME'; // optional: only react to edits on this tab (leave unset to react to every tab)
var PROP_SEQ = 'notifySeq';
var PROP_SENT_SEQ = 'notifySentSeq';
var PROP_FIRST_PENDING = 'notifyFirstPendingAt';
var PROP_LAST_RESULT = 'lastResult';

var HANDLERS = ['handleSheetEdit', 'handleSheetChange'];

/** Adds the "Website" menu. Runs automatically whenever the Sheet is opened (no permissions needed for a menu). */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Website')
    .addItem('Refresh Website Team Data', 'refreshWebsiteNow')
    .addSeparator()
    .addItem('Set up automatic updates (run once)', 'setupAutomaticUpdates')
    .addItem('Settings: webhook address and secret', 'configureWebhook')
    .addItem('Show status', 'showStatus')
    .addItem('Turn off automatic updates', 'removeAutomaticUpdates')
    .addToUi();
}

/* ------------------------------------------------------------------ */
/* Menu actions                                                       */
/* ------------------------------------------------------------------ */

/** Website > Refresh Website Team Data: tells the website to refresh now (also refreshes the photo list). */
function refreshWebsiteNow() {
  var ui = SpreadsheetApp.getUi();
  var result = sendNotification_('all', 'manual');
  if (result.ok) {
    ui.alert('The website has been told to refresh.\n\nThe new team data should appear within a few seconds. If it does not, wait a minute and reload the page.');
  } else {
    ui.alert('The website could not be notified.\n\n' + describeFailure_(result));
  }
}

/** Website > Settings: stores the webhook address and the secret in Script Properties. The secret is never displayed again. */
function configureWebhook() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();

  var urlAnswer = ui.prompt('Webhook address',
    'Enter the full address, for example https://www.digiswasthya.org/api/team-refresh\n(use the exact final address of the site; redirects are not followed).',
    ui.ButtonSet.OK_CANCEL);
  if (urlAnswer.getSelectedButton() !== ui.Button.OK) return;
  var url = urlAnswer.getResponseText().trim();
  if (!/^https:\/\/[^\s]+$/.test(url)) {
    ui.alert('The address must start with https:// and contain no spaces. Nothing was saved.');
    return;
  }

  var secretAnswer = ui.prompt('Webhook secret',
    'Enter the secret (the same value as TEAM_REFRESH_SECRET on the website). Leave empty to keep the current secret.',
    ui.ButtonSet.OK_CANCEL);
  if (secretAnswer.getSelectedButton() !== ui.Button.OK) return;
  var secret = secretAnswer.getResponseText().trim();
  if (secret !== '' && secret.length < 24) {
    ui.alert('The secret must be at least 24 characters long. Nothing was saved.');
    return;
  }

  props.setProperty(PROP_URL, url);
  if (secret !== '') props.setProperty(PROP_SECRET, secret);
  ui.alert('Saved.\n\nWebhook address: ' + hostOf_(url) + '\nSecret: ' + (props.getProperty(PROP_SECRET) ? 'set' : 'NOT SET'));
}

/** Website > Set up automatic updates: installs the two installable triggers (replacing any earlier copies). */
function setupAutomaticUpdates() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty(PROP_URL) || !props.getProperty(PROP_SECRET)) {
    ui.alert('Please use Website > Settings first to enter the webhook address and the secret.');
    return;
  }
  removeTriggers_();
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('handleSheetEdit').forSpreadsheet(sheet).onEdit().create();
  ScriptApp.newTrigger('handleSheetChange').forSpreadsheet(sheet).onChange().create();
  ui.alert('Automatic updates are now on.\n\nEdits to cells, and inserted or deleted rows and columns, will notify the website. Test it with Website > Refresh Website Team Data.');
}

/** Website > Turn off automatic updates. */
function removeAutomaticUpdates() {
  var removed = removeTriggers_();
  SpreadsheetApp.getUi().alert('Automatic updates are off (' + removed + ' trigger(s) removed). The manual menu item still works.');
}

/** Website > Show status: safe information only (no secret). */
function showStatus() {
  var props = PropertiesService.getScriptProperties();
  var url = props.getProperty(PROP_URL);
  var installed = ScriptApp.getProjectTriggers().filter(function (t) { return HANDLERS.indexOf(t.getHandlerFunction()) !== -1; }).length;
  var last = props.getProperty(PROP_LAST_RESULT);
  var lines = [
    'Webhook address: ' + (url ? hostOf_(url) : 'NOT SET'),
    'Secret: ' + (props.getProperty(PROP_SECRET) ? 'set' : 'NOT SET'),
    'Automatic update triggers installed: ' + installed + ' of ' + HANDLERS.length,
    'Last notification: ' + (last ? last : 'none yet')
  ];
  SpreadsheetApp.getUi().alert(lines.join('\n'));
}

/* ------------------------------------------------------------------ */
/* Installable triggers                                               */
/* ------------------------------------------------------------------ */

/** Installable onEdit: a cell was edited (including ticked checkboxes and pastes). */
function handleSheetEdit(e) {
  try {
    var tab = PropertiesService.getScriptProperties().getProperty(PROP_TAB);
    if (tab && e && e.range && e.range.getSheet().getName() !== tab) return; // another tab: not the team directory
    notifyDebounced_('edit');
  } catch (err) {
    console.error('Edit handler failed: ' + safeMessage_(err));
  }
}

/** Installable onChange: rows or columns were inserted or deleted, or similar structural changes. */
function handleSheetChange(e) {
  try {
    if (e && e.changeType === 'FORMAT') return; // formatting only: nothing for the website to refresh
    notifyDebounced_('change-' + String((e && e.changeType) || 'other').toLowerCase());
  } catch (err) {
    console.error('Change handler failed: ' + safeMessage_(err));
  }
}

/* ------------------------------------------------------------------ */
/* Debouncing and sending                                             */
/* ------------------------------------------------------------------ */

/**
 * Merges bursts of events into one notification. Every event takes a sequence number, waits DEBOUNCE_MS, and only the
 * LAST event of a burst sends (or any event once MAX_WAIT_MS has passed since the burst began). If the lock cannot be
 * obtained, it simply sends, so an update is never lost because of debouncing.
 */
function notifyDebounced_(reason) {
  var props = PropertiesService.getScriptProperties();
  var lock = LockService.getScriptLock();
  var mySeq;
  try {
    lock.waitLock(10000);
    try {
      mySeq = Number(props.getProperty(PROP_SEQ) || 0) + 1;
      props.setProperty(PROP_SEQ, String(mySeq));
      if (!props.getProperty(PROP_FIRST_PENDING)) props.setProperty(PROP_FIRST_PENDING, String(Date.now()));
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    sendNotification_('team', reason);
    return;
  }

  Utilities.sleep(DEBOUNCE_MS);

  var shouldSend = false;
  try {
    lock.waitLock(10000);
    try {
      var latest = Number(props.getProperty(PROP_SEQ) || 0);
      var sentSeq = Number(props.getProperty(PROP_SENT_SEQ) || 0);
      var waited = Date.now() - Number(props.getProperty(PROP_FIRST_PENDING) || Date.now());
      if (sentSeq < latest && (latest === mySeq || waited >= MAX_WAIT_MS)) {
        shouldSend = true;
        props.setProperty(PROP_SENT_SEQ, String(latest));
        props.deleteProperty(PROP_FIRST_PENDING);
      }
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    shouldSend = true;
  }
  if (shouldSend) sendNotification_('team', reason);
}

/**
 * Sends the authenticated POST. Retries temporary failures (429, 5xx, network errors) a couple of times; gives up
 * immediately on problems that retrying cannot fix (wrong secret, wrong address, redirects).
 * Returns { ok, code }. Never logs the secret.
 */
function sendNotification_(scope, reason) {
  var props = PropertiesService.getScriptProperties();
  var url = props.getProperty(PROP_URL);
  var secret = props.getProperty(PROP_SECRET);
  if (!url || !secret) {
    return recordResult_({ ok: false, code: 'not-configured' }, reason);
  }
  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + secret },
    payload: JSON.stringify({ source: 'google-sheet', event: String(reason).slice(0, 32), scope: scope, at: new Date().toISOString() }),
    muteHttpExceptions: true,
    followRedirects: false // a redirected POST would lose the secret header; use the final address instead
  };

  var result = { ok: false, code: 'unknown' };
  for (var attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    var code;
    try {
      code = UrlFetchApp.fetch(url, options).getResponseCode();
    } catch (err) {
      code = 'network-error';
    }
    if (code === 200 || code === 202) { result = { ok: true, code: code }; break; }
    result = { ok: false, code: code };
    var temporary = code === 'network-error' || code === 429 || (typeof code === 'number' && code >= 500);
    if (!temporary || attempt === RETRY_DELAYS_MS.length) break;
    Utilities.sleep(RETRY_DELAYS_MS[attempt]);
  }
  return recordResult_(result, reason);
}

function recordResult_(result, reason) {
  var text = (result.ok ? 'success' : 'FAILED') + ' (HTTP ' + result.code + ', ' + reason + ') at ' + new Date().toISOString();
  PropertiesService.getScriptProperties().setProperty(PROP_LAST_RESULT, text);
  console.log('Website notification: ' + text); // safe: no secret, no sheet data
  return result;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function describeFailure_(result) {
  var code = result.code;
  if (code === 'not-configured') return 'The webhook address or secret is not set. Use Website > Settings.';
  if (code === 401) return 'The website rejected the secret (HTTP 401). Check that it matches TEAM_REFRESH_SECRET on the website and that the website has that variable set.';
  if (code === 404) return 'The address was not found (HTTP 404). Check the webhook address, and that the website has been deployed with this feature.';
  if (code === 405 || code === 400 || code === 413) return 'The website did not accept the request (HTTP ' + code + '). Check the webhook address.';
  if (typeof code === 'number' && code >= 300 && code < 400) return 'The address redirects (HTTP ' + code + '). Use the final address of the site, for example the one starting with https://www.';
  if (code === 429 || code === 'network-error' || (typeof code === 'number' && code >= 500)) return 'The website is temporarily unavailable (' + code + '). Try again in a minute. The page will also pick up the change by itself later.';
  return 'Unexpected response: ' + code + '.';
}

function removeTriggers_() {
  var removed = 0;
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (HANDLERS.indexOf(t.getHandlerFunction()) !== -1) {
      ScriptApp.deleteTrigger(t);
      removed++;
    }
  });
  return removed;
}

function hostOf_(url) {
  var m = /^https?:\/\/([^\/?#]+)/.exec(url);
  return m ? m[1] : '(invalid address)';
}

function safeMessage_(err) {
  return String((err && err.message) || err).slice(0, 120); // short, and never contains the secret
}
