import os
import re
import sys
import json
import time
import requests
from urllib.parse import urlparse, parse_qs
from bs4 import BeautifulSoup

def load_dotenv():
    """Reads .env file locally and sets environment variables."""
    env_file = ".env"
    if os.path.exists(env_file):
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip('"').strip("'")
                    if k:
                        os.environ[k] = v

load_dotenv()

# The verified Management Portal endpoint that carries the dashboard data.
# Keep in sync with extractor_agent.HEADLINE_ENDPOINT (kept separate so this module stays standalone).
OUTREACH_ENDPOINT_PATH = "/api/v1/management/reports/outreach-summary"
OUTREACH_WAIT_SECONDS = 60   # maximum time to wait for a valid response after login
OUTREACH_POLL_MS = 250       # short polling step so Playwright can deliver events
_SAFE_QUERY_PARAMS = ("start_date", "end_date", "granularity", "center_status")  # allowlist for logging
# Reason recorded for a matching request that failed at the network level (no HTTP response exists for it).
# Shared by the requestfailed handler and the error summary so network failures are never counted as responses.
_NETWORK_FAILURE_REASON = "request failed at the network level"

# --- Portal All-Time report (Management Portal "Reset to all time" button) -----------------------------------------
# The dashboard first sends a request for its DEFAULT dated range. Clicking "Reset to all time" clears both date
# fields and sends a second request with NO start_date / end_date parameters. That second request is the one we want.
ALL_TIME_CONTROL_NAME = re.compile(r"^\s*reset to all time\s*$", re.I)
ALL_TIME_CONTROL_WAIT_SECONDS = 20    # how long to wait for the button to be uniquely present, visible and enabled
ALL_TIME_UI_WAIT_SECONDS = 5          # how long to wait for the date fields to clear after the click
ALL_TIME_RESPONSE_WAIT_SECONDS = 60   # how long to wait for the all-time response after the click
EXPECTED_CENTER_STATUS_LABEL = "Active centers"
# Read-only DOM snapshot (the same snippet that was used successfully against the real dashboard): the values of the
# visible date fields and, for each visible dropdown, its option texts and selected text. It changes nothing.
_FILTER_STATE_JS = """() => {
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width>0 && r.height>0 && s.visibility!=='hidden' && s.display!=='none'; };
  const out = {dates: [], selects: []};
  document.querySelectorAll('input[type="date"]').forEach(e => { if (vis(e)) out.dates.push(e.value || ''); });
  document.querySelectorAll('select').forEach(s => { if (vis(s)) out.selects.push({
      options: Array.from(s.options).slice(0,30).map(o => (o.text||'').trim().slice(0,40)),
      selected: ((s.options[s.selectedIndex]||{}).text||'').trim().slice(0,40)}); });
  return out;
}"""


class OutreachCaptureError(RuntimeError):
    """Raised when the required outreach-summary API response is missing or invalid."""


def _all_time_scope_problems(url: str) -> list:
    """
    Checks a request URL against the requested scope: Portal All-Time (NO start_date and NO end_date parameter at all,
    not even an empty one), active centres only, granularity by year. Returns the list of failed conditions (names only,
    never values); an empty list means the request matches the requested scope.
    """
    try:
        query = parse_qs(urlparse(url).query, keep_blank_values=True)
    except Exception:
        return ["request URL could not be parsed"]
    problems = []
    if "start_date" in query:
        problems.append("request has a start_date parameter")
    if "end_date" in query:
        problems.append("request has an end_date parameter")
    if query.get("center_status") != ["active"]:
        problems.append("center_status is not exactly 'active'")
    if query.get("granularity") != ["year"]:
        problems.append("granularity is not exactly 'year'")
    return problems


def _filter_state_problems(state) -> list:
    """
    Checks the read-only dashboard snapshot after 'Reset to all time': exactly two visible date fields, both empty,
    and exactly one centre-status dropdown whose selection is 'Active centers'. Returns the failed conditions.
    """
    if not isinstance(state, dict):
        return ["filter state could not be read"]
    problems = []
    dates = state.get("dates")
    if not isinstance(dates, list) or len(dates) != 2:
        problems.append(f"expected exactly 2 visible date fields, found {len(dates) if isinstance(dates, list) else 'none'}")
    elif any(value != "" for value in dates):
        problems.append("a date field is not empty")
    selects = state.get("selects")
    centre = [s for s in (selects if isinstance(selects, list) else [])
              if isinstance(s, dict) and EXPECTED_CENTER_STATUS_LABEL in (s.get("options") or [])]
    if len(centre) != 1:
        problems.append(f"expected exactly 1 centre-status dropdown, found {len(centre)}")
    elif centre[0].get("selected") != EXPECTED_CENTER_STATUS_LABEL:
        problems.append(f"centre status is not '{EXPECTED_CENTER_STATUS_LABEL}'")
    return problems


def _safe_query_summary(url: str) -> dict:
    """Returns only the allowlisted query parameters of a URL (never the full URL)."""
    try:
        query = parse_qs(urlparse(url).query)
    except Exception:
        return {}
    return {name: query.get(name) for name in _SAFE_QUERY_PARAMS if name in query}


def _format_outreach_attempt(attempt: dict) -> str:
    """
    Formats one recorded attempt for the error text. Wording only: shows the HTTP status when one was recorded,
    uses a neutral label when the request number is unknown, and a neutral phrase when no reason was recorded
    (it never invents a reason or implies a network failure that was not recorded).
    """
    label = f"request #{attempt['number']}" if attempt["number"] is not None else "unidentified request"
    status = f"HTTP {attempt['status']}, " if attempt["status"] is not None else ""
    reason = attempt["reason"] if attempt["reason"] else "response handling did not complete normally"
    return f"{label}: {status}{reason}"


def _describe_outreach_failure(requests_seen: int, attempts: list) -> str:
    """Builds the timeout error text from safe diagnostics only (counts, statuses, reasons; no values)."""
    # Network failures are NOT HTTP responses. Everything else recorded is a response event; it is counted
    # once per request number (a response whose handling raised can leave two records for one request).
    network_failures = sum(1 for a in attempts if a["reason"] == _NETWORK_FAILURE_REASON)
    response_records = [a for a in attempts if a["reason"] != _NETWORK_FAILURE_REASON]
    responses_received = (len({a["number"] for a in response_records if a["number"] is not None})
                          + sum(1 for a in response_records if a["number"] is None))
    message = (
        f"[Agent 1 CRITICAL ERROR] No valid response from the required API endpoint '{OUTREACH_ENDPOINT_PATH}' "
        f"arrived within {OUTREACH_WAIT_SECONDS} seconds. "
        f"Requests observed: {requests_seen}; HTTP responses received: {responses_received}; "
        f"network failures: {network_failures}."
    )
    if not requests_seen:
        message += " No request to this endpoint was observed."
    elif not attempts:
        message += " The request(s) never received a response."
    else:
        shown = attempts[:10]
        more = f" (+{len(attempts) - len(shown)} more)" if len(attempts) > len(shown) else ""
        message += " Attempts: " + "; ".join(_format_outreach_attempt(a) for a in shown) + more + "."
    return message + " No other response was used."


def _describe_all_time_failure(requests_after_click: int, attempts_after_click: list, scope_mismatches: list) -> str:
    """
    Error text for: no valid response matching the All-Time scope arrived after 'Reset to all time' was clicked.
    Safe diagnostics only (counts, statuses, reasons, names of failed scope conditions; never values or URLs).
    """
    message = (
        f"[Agent 1 CRITICAL ERROR] No valid All-Time response from the required API endpoint '{OUTREACH_ENDPOINT_PATH}' "
        f"arrived within {ALL_TIME_RESPONSE_WAIT_SECONDS} seconds after 'Reset to all time' was clicked. "
        f"Requests made after the click: {requests_after_click}."
    )
    if not requests_after_click:
        message += " No request to this endpoint was made after the click."
    if attempts_after_click:
        shown = attempts_after_click[:10]
        more = f" (+{len(attempts_after_click) - len(shown)} more)" if len(attempts_after_click) > len(shown) else ""
        message += " Attempts: " + "; ".join(_format_outreach_attempt(a) for a in shown) + more + "."
    if scope_mismatches:
        message += " Valid responses that did NOT match the All-Time scope: " + "; ".join(
            f"request #{n}: " + ", ".join(problems) for n, problems in scope_mismatches[:10]) + "."
    return message + " The initial dated response and every other response were NOT used."


def _describe_unresolved_outreach(unresolved: list, requests_seen: int, attempts: list) -> str:
    """
    Error text for: a valid response exists, but earlier-numbered request(s) were still unresolved at the
    deadline, so first-valid-by-request-order selection cannot be guaranteed. Safe diagnostics only.
    """
    shown = unresolved[:10]
    more = f" (+{len(unresolved) - len(shown)} more)" if len(unresolved) > len(shown) else ""
    return (
        f"[Agent 1 CRITICAL ERROR] A valid response from the required API endpoint '{OUTREACH_ENDPOINT_PATH}' was received, "
        f"but earlier request(s) {', '.join('#' + str(n) for n in shown)}{more} were still unresolved after "
        f"{OUTREACH_WAIT_SECONDS} seconds (no response and no network failure was reported). "
        f"First-valid-response-by-request-order selection could not be guaranteed. "
        f"Requests observed: {requests_seen}; responses or failures recorded: {len(attempts)}. No response was used."
    )


def fetch_report_html(target_url: str, username: str = None, password: str = None) -> dict:
    """
    Agent 1: Web-Scraper & API Interceptor Agent
    1. Authenticates at target portal via Playwright.
    2. Listens to API responses to intercept live JSON payloads.
    3. Automates hover/tap interactions over dynamic charts to reveal hidden tooltips.
    4. Extracts embedded window state (__NEXT_DATA__ / __INITIAL_STATE__).
    """
    print(f"[Agent 1] Target Portal URL: {target_url}")

    is_valid_auth = (
        username 
        and password 
        and username.lower() != 'none' 
        and 'your-email' not in username.lower()
        and 'your-secure-password' not in password.lower()
    )

    captured_api_payloads = []

    if not is_valid_auth:
        print("[Agent 1] No valid live credentials provided. Checking local/sample sources...")
        fallback_file = "public/sample-report.html"
        html_text = ""
        if target_url and target_url.startswith("http"):
            try:
                response = requests.get(target_url, timeout=15)
                response.raise_for_status()
                html_text = response.text
            except Exception:
                pass
        
        if not html_text and os.path.exists(fallback_file):
            with open(fallback_file, "r", encoding="utf-8") as f:
                html_text = f.read()
        
        return {
            "html": html_text or "<html><body><h1>DigiSwasthya Portal Sync</h1></body></html>",
            "json_payloads": []
        }

    # Authenticated Portal Flow via Playwright with API Interception & Hover Automation
    try:
        import importlib
        playwright_sync = importlib.import_module("playwright.sync_api")
        sync_playwright = getattr(playwright_sync, "sync_playwright")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()

            # Listener: Intercept live API responses & log errors
            page.on("console", lambda msg: print(f"[Browser Console] {msg.type}: {msg.text}"))
            page.on("requestfailed", lambda req: print(f"[Browser Request Failed] {req.url} - {req.failure}"))

            def handle_response(response):
                try:
                    content_type = response.headers.get("content-type", "")
                    if "application/json" in content_type and response.status == 200:
                        data = response.json()
                        captured_api_payloads.append({
                            "url": response.url,
                            "data": data
                        })
                except Exception:
                    pass

            page.on("response", handle_response)

            # Dedicated capture of the REQUIRED endpoint (exact path, HTTP 200, JSON object with a top-level
            # 'headline' object). Independent of the generic listener above, which is left unchanged.
            outreach_request_numbers = {}   # id(request) -> request number (order in which requests were made)
            outreach_request_refs = []      # keeps request objects alive so id() values cannot be reused
            outreach_attempts = []          # safe diagnostics for every matching response
            outreach_valid = []             # valid candidates: {"number", "url", "data"}
            outreach_resolved = set()       # request numbers that completed (response handled OR network failure)

            def handle_outreach_request(request):
                try:
                    if urlparse(request.url).path == OUTREACH_ENDPOINT_PATH and id(request) not in outreach_request_numbers:
                        outreach_request_refs.append(request)
                        outreach_request_numbers[id(request)] = len(outreach_request_numbers) + 1
                except Exception:
                    pass

            def handle_outreach_response(response):
                number = None  # set once the request is identified; used by the `finally` below
                try:
                    if urlparse(response.url).path != OUTREACH_ENDPOINT_PATH:
                        return
                    request = response.request
                    if id(request) not in outreach_request_numbers:
                        outreach_request_refs.append(request)
                        outreach_request_numbers[id(request)] = len(outreach_request_numbers) + 1
                    number = outreach_request_numbers[id(request)]
                    status = response.status
                    attempt = {"number": number, "status": status, "reason": None}
                    outreach_attempts.append(attempt)
                    if status != 200:
                        attempt["reason"] = "status is not 200"
                        return
                    if "application/json" not in response.headers.get("content-type", ""):
                        attempt["reason"] = "content type is not JSON"
                        return
                    try:
                        data = response.json()
                    except Exception:
                        attempt["reason"] = "body is not valid JSON"
                        return
                    if not isinstance(data, dict):
                        attempt["reason"] = f"body is of type {type(data).__name__}, expected an object"
                    elif not isinstance(data.get("headline"), dict):
                        attempt["reason"] = "body has no top-level 'headline' object"
                    else:
                        outreach_valid.append({"number": number, "url": response.url, "data": data})
                except Exception as outreach_err:
                    outreach_attempts.append({"number": number, "status": None,
                                              "reason": f"unexpected error while reading response ({type(outreach_err).__name__})"})
                finally:
                    # Every handling path (valid, invalid, early return, exception) resolves the request,
                    # so a handler problem can never leave it permanently unresolved.
                    if number is not None:
                        outreach_resolved.add(number)

            def handle_outreach_requestfailed(request):
                # A matching request that failed at the network level will never get a response: it is resolved.
                # Only a safe reason is recorded (no URL, no error text).
                try:
                    if urlparse(request.url).path != OUTREACH_ENDPOINT_PATH:
                        return
                    number = outreach_request_numbers.get(id(request))
                    if number is None:
                        return
                    if number not in outreach_resolved:
                        outreach_attempts.append({"number": number, "status": None,
                                                  "reason": _NETWORK_FAILURE_REASON})
                    outreach_resolved.add(number)
                except Exception:
                    pass

            def outreach_blocking_requests():
                """Numbers of matching requests that are lower than the lowest valid response but still unresolved."""
                if not outreach_valid:
                    return []
                lowest_valid = min(candidate["number"] for candidate in outreach_valid)
                return sorted(n for n in outreach_request_numbers.values()
                              if n < lowest_valid and n not in outreach_resolved)

            page.on("request", handle_outreach_request)
            page.on("response", handle_outreach_response)
            page.on("requestfailed", handle_outreach_requestfailed)

            print(f"[Agent 1] Authenticating at {target_url} with user '{username}'...")
            page.goto(target_url, wait_until="networkidle")

            # Click Management Portal or Admin Login if landing screen is shown
            try:
                if page.get_by_text("Management Portal").first.is_visible():
                    page.get_by_text("Management Portal").first.click()
                    page.wait_for_timeout(1000)
                elif page.get_by_text("Administrator Login").first.is_visible():
                    page.get_by_text("Administrator Login").first.click()
                    page.wait_for_timeout(1000)
            except Exception:
                pass
            
            # Fill login inputs and wait until login actually completes
            try:
                email_input = page.locator("input[type='email'], input[name='email'], input[type='text'], input[name='username']").first
                if not email_input.is_visible():
                    raise Exception("Login form email input not found on page — may already be logged in or wrong URL.")
                email_input.fill(username)
                page.locator("input[type='password'], input[name='password']").first.fill(password)
                page.locator("button[type='submit'], input[type='submit']").first.click()
                # Wait until URL changes away from /login — this is the reliable proof login completed
                print("[Agent 1] Credentials submitted. Waiting for login to complete...")
                page.wait_for_url(lambda url: "/login" not in url, timeout=30000)
                print(f"[Agent 1] Login successful! Now at: {page.url}")
            except Exception as login_err:
                print(f"[Agent 1 CRITICAL ERROR] Login failed: {login_err}")
                page.screenshot(path="portal_debug.png", full_page=True)
                raise  # Re-raise so pipeline fails loudly — no fake success

            # Portal lands DIRECTLY on Outreach & Impact after login — no tab navigation needed

            # Step 1: Wait for the REQUIRED API response. The dashboard requests its data automatically after
            # login (observed to happen AFTER networkidle has already returned), so neither networkidle nor a
            # fixed sleep is used as proof. We poll with short waits (which let Playwright deliver events)
            # until a valid response from the exact endpoint exists, or the time limit is reached.
            print(f"[Agent 1] Waiting up to {OUTREACH_WAIT_SECONDS}s for a valid response from the required endpoint...")
            outreach_deadline = time.monotonic() + OUTREACH_WAIT_SECONDS
            # Stop only when a valid response exists AND every earlier-numbered matching request has resolved
            # (responded or failed). Otherwise a lower-numbered valid response could still arrive and must win.
            while time.monotonic() < outreach_deadline:
                if outreach_valid and not outreach_blocking_requests():
                    break
                page.wait_for_timeout(OUTREACH_POLL_MS)
            if not outreach_valid:
                raise OutreachCaptureError(
                    _describe_outreach_failure(len(outreach_request_numbers), outreach_attempts)
                )
            unresolved_requests = outreach_blocking_requests()
            if unresolved_requests:
                raise OutreachCaptureError(
                    _describe_unresolved_outreach(unresolved_requests, len(outreach_request_numbers), outreach_attempts)
                )
            print("[Agent 1] A valid response from the required endpoint has been received "
                  "and no earlier-numbered request is unresolved (the dashboard has loaded).")

            # Step 1b: select the portal's explicit All-Time report. The response received above belongs to the
            # dashboard's DEFAULT dated range and is never used. Click 'Reset to all time' exactly once (never
            # forced, never retried), confirm the filter state, then capture the request it triggers.
            reset_control = None
            control_deadline = time.monotonic() + ALL_TIME_CONTROL_WAIT_SECONDS
            while time.monotonic() < control_deadline:
                reset_locator = page.get_by_role("button", name=ALL_TIME_CONTROL_NAME)
                if reset_locator.count() == 1 and reset_locator.first.is_visible() and reset_locator.first.is_enabled():
                    reset_control = reset_locator.first
                    break
                page.wait_for_timeout(OUTREACH_POLL_MS)
            if reset_control is None:
                raise OutreachCaptureError(
                    "[Agent 1 CRITICAL ERROR] The 'Reset to all time' button was not found exactly once, visible and "
                    f"enabled within {ALL_TIME_CONTROL_WAIT_SECONDS} seconds. The initial dated response was NOT used."
                )
            reset_baseline = len(outreach_request_numbers)   # requests numbered after this belong to the reset
            try:
                reset_control.click(timeout=5000)
            except Exception as reset_err:
                raise OutreachCaptureError(
                    f"[Agent 1 CRITICAL ERROR] 'Reset to all time' could not be clicked ({type(reset_err).__name__}); "
                    "it was not retried. The initial dated response was NOT used."
                )
            print("[Agent 1] Clicked 'Reset to all time' once.")

            # Confirm: both date fields empty and the centre status is 'Active centers'.
            ui_deadline = time.monotonic() + ALL_TIME_UI_WAIT_SECONDS
            while True:
                ui_problems = _filter_state_problems(page.evaluate(_FILTER_STATE_JS))
                if not ui_problems or time.monotonic() >= ui_deadline:
                    break
                page.wait_for_timeout(OUTREACH_POLL_MS)
            if ui_problems:
                raise OutreachCaptureError(
                    "[Agent 1 CRITICAL ERROR] The filter state after 'Reset to all time' is not as required: "
                    + "; ".join(ui_problems) + ". The initial dated response was NOT used."
                )
            print("[Agent 1] Confirmed: both date fields are empty and the centre status is 'Active centers'.")

            # Wait for the response that matches the requested All-Time scope: a valid response to a request made
            # AFTER the click, with no start_date/end_date parameter, center_status=active and granularity=year.
            def all_time_candidates():
                return [c for c in outreach_valid
                        if c["number"] > reset_baseline and not _all_time_scope_problems(c["url"])]

            def all_time_blocking(candidates):
                """Requests made after the click, numbered below the lowest candidate, that are still unresolved."""
                if not candidates:
                    return []
                lowest = min(c["number"] for c in candidates)
                return sorted(n for n in outreach_request_numbers.values()
                              if reset_baseline < n < lowest and n not in outreach_resolved)

            print(f"[Agent 1] Waiting up to {ALL_TIME_RESPONSE_WAIT_SECONDS}s for the All-Time response...")
            all_time_deadline = time.monotonic() + ALL_TIME_RESPONSE_WAIT_SECONDS
            while time.monotonic() < all_time_deadline:
                candidates = all_time_candidates()
                if candidates and not all_time_blocking(candidates):
                    break
                page.wait_for_timeout(OUTREACH_POLL_MS)
            candidates = all_time_candidates()
            if not candidates:
                mismatch_info = [(c["number"], _all_time_scope_problems(c["url"]))
                                 for c in outreach_valid
                                 if c["number"] > reset_baseline and _all_time_scope_problems(c["url"])]
                mismatch_numbers = {n for n, _ in mismatch_info}
                attempts_after_click = [a for a in outreach_attempts
                                        if a["number"] is not None and a["number"] > reset_baseline
                                        and a["number"] not in mismatch_numbers]
                requests_after_click = sum(1 for n in outreach_request_numbers.values() if n > reset_baseline)
                raise OutreachCaptureError(
                    _describe_all_time_failure(requests_after_click, attempts_after_click, mismatch_info)
                )
            blocking_after_click = all_time_blocking(candidates)
            if blocking_after_click:
                raise OutreachCaptureError(
                    _describe_unresolved_outreach(blocking_after_click, len(outreach_request_numbers), outreach_attempts)
                )
            # If several requests match the scope, the earliest-numbered one wins (request order, not arrival order).
            selected_outreach = min(candidates, key=lambda candidate: candidate["number"])
            print(f"[Agent 1] All-Time response received: request #{selected_outreach['number']} "
                  f"(no date parameters, center_status=active, granularity=year).")

            # Step 2: Apply button — READ-ONLY inspection. It is never clicked (and never force-clicked):
            # the data loads without it, and what changing filters + Apply does has not been established.
            try:
                apply_locator = page.get_by_role("button", name="Apply")
                apply_count = apply_locator.count()
                if apply_count == 0:
                    print("[Agent 1] Apply button: no matching button on the page (not needed; data loads automatically).")
                else:
                    any_enabled = False
                    for apply_index in range(apply_count):
                        apply_item = apply_locator.nth(apply_index)
                        apply_visible = apply_item.is_visible()
                        apply_enabled = apply_item.is_enabled()
                        any_enabled = any_enabled or (apply_visible and apply_enabled)
                        print(f"[Agent 1] Apply button #{apply_index}: visible={apply_visible}, enabled={apply_enabled}")
                    if apply_count > 1:
                        print(f"[Agent 1 Note] {apply_count} buttons match 'Apply'; the target would be ambiguous.")
                    if any_enabled:
                        print("[Agent 1] Apply is enabled but was NOT clicked: its behavior remains unverified.")
                    else:
                        print("[Agent 1] Apply is not clickable (disabled or hidden); skipped. It is never clicked.")
            except Exception as apply_err:
                print(f"[Agent 1 Note] Apply button inspection skipped ({type(apply_err).__name__}).")

            # Step 3: Final wait for all charts and tooltips to fully render
            page.wait_for_timeout(3000)
            print(f"[Agent 1] Page ready. Captured {len(captured_api_payloads)} API payloads so far.")
            print("[Agent 1] Dashboard fully ready for scraping.")

            # Save screenshot for exact visual inspection
            page.screenshot(path="portal_debug.png", full_page=True)
            print("[Agent 1] Debug screenshot saved to portal_debug.png")

            # Automate Hover Actions over Interactive Chart Elements
            try:
                chart_elements = page.locator("rect, circle, path, canvas, .recharts-rectangle, .apexcharts-series, .bar, .chart-point").all()
                print(f"[Agent 1] Found {len(chart_elements)} interactive chart elements. Triggering hover events...")
                for el in chart_elements[:40]: # Hover first 40 chart elements to reveal hidden tooltips
                    try:
                        if el.is_visible():
                            el.hover(timeout=300)
                            page.wait_for_timeout(50)
                    except Exception:
                        pass
            except Exception as hover_err:
                print(f"[Agent 1 Hover Note] {hover_err}")

            # Extract window.__NEXT_DATA__ or embedded state if available
            embedded_state = None
            try:
                embedded_state = page.evaluate("() => window.__NEXT_DATA__ || window.__INITIAL_STATE__ || null")
                if embedded_state:
                    captured_api_payloads.append({
                        "url": "window.__NEXT_DATA__",
                        "data": embedded_state
                    })
            except Exception:
                pass

            html_content = page.content()
            browser.close()
            print(f"[Agent 1] Playwright successfully scraped portal ({len(html_content)} bytes HTML, {len(captured_api_payloads)} API payloads).")
            # DEBUG: Print every captured payload URL and its top-level keys so extractor can be verified
            for idx, p in enumerate(captured_api_payloads):
                p_data = p.get("data", {})
                if isinstance(p_data, dict):
                    keys = list(p_data.keys())[:15]
                elif isinstance(p_data, list):
                    keys = f"[list, {len(p_data)} items]"
                else:
                    keys = type(p_data).__name__
                print(f"  [Payload {idx}] URL: {p.get('url','?')[:80]} | keys: {keys}")
            # The All-Time response was selected above (by requested scope, then request order). Report what was
            # ignored (for example the dashboard's initial dated response), using allowlisted parameters only.
            extra_valid = [c for c in outreach_valid if c is not selected_outreach]
            print(f"[Agent 1] Selected required API response: request #{selected_outreach['number']} "
                  f"(valid responses observed: {len(outreach_valid)}).")
            if extra_valid:
                print(f"[Agent 1] {len(extra_valid)} other valid response(s) from the required endpoint were not used. "
                      f"Selected request #{selected_outreach['number']} params: {_safe_query_summary(selected_outreach['url'])}; "
                      f"not used: " + "; ".join(
                          f"request #{c['number']} params: {_safe_query_summary(c['url'])}" for c in extra_valid[:5]))
            return {
                "html": html_content,
                "json_payloads": captured_api_payloads,
                "outreach_summary": {
                    "url": selected_outreach["url"],
                    "data": selected_outreach["data"],
                    "request_number": selected_outreach["number"]
                }
            }

    except OutreachCaptureError:
        # A missing/invalid required API response must fail clearly. Do NOT swallow it and fall through
        # to the requests-based fallback below.
        raise
    except Exception as e:
        print(f"[Agent 1 Warning] Playwright execution failed: {e}. Falling back to requests Session auth...")
        session = requests.Session()
        try:
            session.post(target_url, data={"username": username, "email": username, "password": password}, timeout=15)
            resp = session.get(target_url, timeout=15)
            return {
                "html": resp.text,
                "json_payloads": []
            }
        except Exception as req_err:
            print(f"[Agent 1 Error] Session auth failed: {req_err}")
            return {
                "html": "<html><body><h1>DigiSwasthya Live Sync</h1></body></html>",
                "json_payloads": []
            }

if __name__ == "__main__":
    portal_url = os.getenv("MANAGEMENT_PORTAL_URL", "http://localhost:3000/sample-report.html")
    portal_user = os.getenv("MANAGEMENT_PORTAL_EMAIL", os.getenv("DIGISWASTHYA_PORTAL_USER", "none"))
    portal_pass = os.getenv("MANAGEMENT_PORTAL_PASSWORD", os.getenv("DIGISWASTHYA_PORTAL_PASS", "none"))

    if len(sys.argv) > 1:
        portal_url = sys.argv[1]

    result = fetch_report_html(portal_url, portal_user, portal_pass)
    with open("scraped_report_temp.html", "w", encoding="utf-8") as f:
        f.write(result["html"])
    with open("scraped_report_temp.json", "w", encoding="utf-8") as f:
        json.dump(result["json_payloads"], f, indent=2)
    print("[Agent 1 Completed] Scraped HTML and API payloads saved to temp files.")
