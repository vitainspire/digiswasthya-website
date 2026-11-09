import re
import json
import os
import sys
from datetime import datetime
from urllib.parse import urlparse, parse_qs
from bs4 import BeautifulSoup

def clean_int(val_str: str) -> int:
    """Removes commas, spaces, and non-numeric chars to return integer."""
    if not val_str:
        return 0
    cleaned = re.sub(r"[^\d]", "", str(val_str))
    return int(cleaned) if cleaned else 0

# Verified Management Portal endpoint and its `headline` object (Stage 1).
HEADLINE_ENDPOINT = "/api/v1/management/reports/outreach-summary"
# (API field inside `headline`, website field inside `kpis`)
HEADLINE_FIELD_MAP = (
    ("patients_served", "total_patients"),
    ("teleconsultations", "total_teleconsultations"),
    ("health_camps", "total_camps"),
    ("doctors", "total_doctors"),
    ("partner_hospitals", "total_hospitals"),
)

def extract_headline_kpis(json_payloads) -> dict:
    """
    Reads the five headline metrics ONLY from the verified outreach-summary API response
    and validates them. Never falls back to page text or hardcoded defaults.
    Raises ValueError naming every missing or invalid field.
    """
    matches = [
        p for p in (json_payloads or [])
        if isinstance(p, dict)
        and HEADLINE_ENDPOINT in str(p.get("url", ""))
        and isinstance(p.get("data"), dict)
    ]
    if not matches:
        raise ValueError(
            f"[Agent 2 CRITICAL ERROR] The verified API response '{HEADLINE_ENDPOINT}' was not captured. "
            "Headline metrics were NOT extracted and no defaults were used."
        )

    # If the dashboard requested the endpoint more than once, use the most recent response.
    headline = matches[-1]["data"].get("headline")
    if not isinstance(headline, dict):
        raise ValueError(
            f"[Agent 2 CRITICAL ERROR] '{HEADLINE_ENDPOINT}' response has no 'headline' object. "
            "Headline metrics were NOT extracted and no defaults were used."
        )

    result = {}
    problems = []
    for api_key, kpi_key in HEADLINE_FIELD_MAP:
        if api_key not in headline:
            problems.append(f"headline.{api_key} is missing")
            continue
        value = headline[api_key]
        if value is None:
            problems.append(f"headline.{api_key} is null")
        elif isinstance(value, bool) or not isinstance(value, int):
            problems.append(f"headline.{api_key} is of type {type(value).__name__}, expected an integer")
        elif value < 0:
            problems.append(f"headline.{api_key} is negative")
        else:
            result[kpi_key] = value  # zero is valid

    if problems:
        raise ValueError(
            "[Agent 2 CRITICAL ERROR] Invalid headline metrics: " + "; ".join(problems) + ". "
            "Nothing was written and no defaults were used."
        )

    print(f"[Agent 2] Headline metrics validated from {HEADLINE_ENDPOINT} "
          f"({len(matches)} matching response(s); latest used).")
    return result

# ---------------------------------------------------------------------------
# Stage 2: growth, reach totals, and detailed district/village lists.
# These functions read ONLY the verified outreach-summary response, validate it
# strictly, and raise ValueError instead of inventing, defaulting or zero-filling.
# Error messages name fields and array positions only; they never print API values.
# ---------------------------------------------------------------------------
# (API field inside `headline`, website field inside `reach`)
HEADLINE_REACH_FIELD_MAP = (
    ("districts_covered", "districts"),
    ("villages_covered", "villages"),
)
# (API growth array, website field inside `growth[]`); each entry is {period, count}
GROWTH_ARRAY_MAP = (
    ("patients_growth", "patients"),
    ("consultations_growth", "teleconsultations"),
    ("camps_growth", "camps"),
)
# (API list of {label, count}, website list of {name, count} inside `reach`)
REACH_LIST_MAP = (
    ("districts", "district_list"),
    ("villages", "village_list"),
)
_MAX_REPORTED_PROBLEMS = 10

def _bad_count_reason(value):
    """Returns why `value` is not a valid non-negative integer, or None if it is valid (zero is valid)."""
    if value is None:
        return "is null"
    if isinstance(value, bool) or not isinstance(value, int):
        return f"is of type {type(value).__name__}, expected an integer"
    if value < 0:
        return "is negative"
    return None

def _bad_text_reason(value):
    """Returns why `value` is not a non-empty string, or None if it is valid."""
    if value is None:
        return "is null"
    if not isinstance(value, str):
        return f"is of type {type(value).__name__}, expected a string"
    if value.strip() == "":
        return "is empty"
    return None

def _raise_if_problems(title, problems):
    if problems:
        shown = problems[:_MAX_REPORTED_PROBLEMS]
        extra = len(problems) - len(shown)
        more = f" (+{extra} more)" if extra > 0 else ""
        raise ValueError(
            f"[Agent 2 CRITICAL ERROR] {title}: " + "; ".join(shown) + more + ". "
            "Nothing was written and no defaults were used."
        )

def _latest_outreach_data(json_payloads) -> dict:
    """Returns the data object of the most recent verified outreach-summary response (same rule as Stage 1)."""
    matches = [
        p for p in (json_payloads or [])
        if isinstance(p, dict)
        and HEADLINE_ENDPOINT in str(p.get("url", ""))
        and isinstance(p.get("data"), dict)
    ]
    if not matches:
        raise ValueError(
            f"[Agent 2 CRITICAL ERROR] The verified API response '{HEADLINE_ENDPOINT}' was not captured. "
            "Nothing was written and no defaults were used."
        )
    return matches[-1]["data"]

def extract_headline_reach(json_payloads) -> dict:
    """Validates headline.districts_covered / headline.villages_covered as non-negative integers."""
    headline = _latest_outreach_data(json_payloads).get("headline")
    if not isinstance(headline, dict):
        raise ValueError(
            f"[Agent 2 CRITICAL ERROR] '{HEADLINE_ENDPOINT}' response has no 'headline' object. "
            "Nothing was written and no defaults were used."
        )
    result = {}
    problems = []
    for api_key, reach_key in HEADLINE_REACH_FIELD_MAP:
        if api_key not in headline:
            problems.append(f"headline.{api_key} is missing")
            continue
        reason = _bad_count_reason(headline[api_key])
        if reason:
            problems.append(f"headline.{api_key} {reason}")
        else:
            result[reach_key] = headline[api_key]
    _raise_if_problems("Invalid headline reach totals", problems)
    return result

def extract_reach_lists(json_payloads) -> dict:
    """Validates and maps districts[]/villages[] ({label, count}) to district_list/village_list ({name, count})."""
    data = _latest_outreach_data(json_payloads)
    result = {}
    problems = []
    for api_key, out_key in REACH_LIST_MAP:
        entries = data.get(api_key)
        if entries is None:
            problems.append(f"{api_key} is missing or null")
            continue
        if not isinstance(entries, list):
            problems.append(f"{api_key} is of type {type(entries).__name__}, expected a list")
            continue
        items = []
        for i, entry in enumerate(entries):
            where = f"{api_key}[{i}]"
            if not isinstance(entry, dict):
                problems.append(f"{where} is of type {type(entry).__name__}, expected an object")
                continue
            ok = True
            if "label" not in entry:
                problems.append(f"{where}.label is missing")
                ok = False
            else:
                reason = _bad_text_reason(entry["label"])
                if reason:
                    problems.append(f"{where}.label {reason}")
                    ok = False
            if "count" not in entry:
                problems.append(f"{where}.count is missing")
                ok = False
            else:
                reason = _bad_count_reason(entry["count"])
                if reason:
                    problems.append(f"{where}.count {reason}")
                    ok = False
            if ok:
                items.append({"name": entry["label"], "count": entry["count"]})
        result[out_key] = items
    _raise_if_problems("Invalid district/village lists", problems)
    return result

def extract_growth_trends(json_payloads) -> list:
    """
    Builds growth[] = [{year, patients, teleconsultations, camps}] from the three growth arrays.
    Entries are matched by `period` (never by array position). The arrays may cover DIFFERENT sets of periods
    (for example the portal omits years with no camps): the result has one entry per period found in any array,
    in first-seen order, and a value the API did not report for that period is stored as null (None), never as 0.
    Raises ValueError if any array is missing/malformed or a period repeats within an array. patients_growth and
    consultations_growth (the two series the website charts) must not be empty.
    """
    data = _latest_outreach_data(json_payloads)
    problems = []
    counts_by_array = {}   # api array name -> {period: count}
    period_order = []      # every period seen in any array, first-seen order

    for api_key, _field in GROWTH_ARRAY_MAP:
        entries = data.get(api_key)
        if entries is None:
            problems.append(f"{api_key} is missing or null")
            continue
        if not isinstance(entries, list):
            problems.append(f"{api_key} is of type {type(entries).__name__}, expected a list")
            continue
        by_period = {}
        for i, entry in enumerate(entries):
            where = f"{api_key}[{i}]"
            if not isinstance(entry, dict):
                problems.append(f"{where} is of type {type(entry).__name__}, expected an object")
                continue
            ok = True
            if "period" not in entry:
                problems.append(f"{where}.period is missing")
                ok = False
            else:
                reason = _bad_text_reason(entry["period"])
                if reason:
                    problems.append(f"{where}.period {reason}")
                    ok = False
            if "count" not in entry:
                problems.append(f"{where}.count is missing")
                ok = False
            else:
                reason = _bad_count_reason(entry["count"])
                if reason:
                    problems.append(f"{where}.count {reason}")
                    ok = False
            if not ok:
                continue
            period = entry["period"]
            if period in by_period:
                problems.append(f"{where}.period repeats an earlier entry in {api_key}")
                continue
            by_period[period] = entry["count"]
            if period not in period_order:
                period_order.append(period)
        counts_by_array[api_key] = by_period

    _raise_if_problems("Invalid growth data", problems)

    for series in ("patients_growth", "consultations_growth"):
        if not counts_by_array[series]:
            raise ValueError(
                f"[Agent 2 CRITICAL ERROR] {series} is empty, so no growth values are available for the website charts. "
                "Nothing was written and no defaults were used."
            )

    # One entry per period seen in any array. dict.get() gives None (null) for a value the API did not report;
    # it is never converted to 0. The website's chart code skips entries whose chart value is null.
    return [
        {
            "year": period,
            "patients": counts_by_array["patients_growth"].get(period),
            "teleconsultations": counts_by_array["consultations_growth"].get(period),
            "camps": counts_by_array["camps_growth"].get(period),
        }
        for period in period_order
    ]

# ---------------------------------------------------------------------------
# Stage 3B: departments, diseases, specialties, age groups, gender, new/follow-up,
# plus preservation of four additional API fields.
# Same verified-endpoint selection and strict validation as Stages 1 and 2.
# Labels are preserved EXACTLY as the API spells them and in the API's original order.
# Error messages never print counts.
# ---------------------------------------------------------------------------
# (API array of {label, count}, website output field, website field that holds the label)
DISTRIBUTION_MAP = (
    ("consultations_by_department", "departments", "department"),
    ("top_diseases", "top_diseases", "disease"),
    ("doctors_by_specialty", "doctor_specialties", "specialty"),
    ("age_distribution", "age_groups", "range"),
)
# Verified gender labels (matched case-insensitively and exactly) -> website gender_split key
GENDER_LABEL_MAP = {"male": "male", "female": "female", "other": "other"}
GENDER_REQUIRED_KEYS = ("male", "female")   # 'other' is optional: the API reports it for some periods only
NEW_VS_FOLLOWUP_KEYS = ("new_patients", "followup_patients", "unknown")
PATIENTS_SERVED_SPLIT_KEYS = ("existing", "new_at_health_centre", "new_at_camp")

def _read_label_count_list(data, api_key, allow_empty, problems):
    """
    Validates data[api_key] as a list of {label: non-empty string, count: non-negative integer}.
    Appends any problems to `problems`; returns [(label, count), ...] in API order, or None if invalid.
    """
    entries = data.get(api_key)
    if entries is None:
        problems.append(f"{api_key} is missing or null")
        return None
    if not isinstance(entries, list):
        problems.append(f"{api_key} is of type {type(entries).__name__}, expected a list")
        return None
    if not entries and not allow_empty:
        problems.append(f"{api_key} is empty")
        return None
    start = len(problems)
    items = []
    for i, entry in enumerate(entries):
        where = f"{api_key}[{i}]"
        if not isinstance(entry, dict):
            problems.append(f"{where} is of type {type(entry).__name__}, expected an object")
            continue
        ok = True
        if "label" not in entry:
            problems.append(f"{where}.label is missing")
            ok = False
        else:
            reason = _bad_text_reason(entry["label"])
            if reason:
                problems.append(f"{where}.label {reason}")
                ok = False
        if "count" not in entry:
            problems.append(f"{where}.count is missing")
            ok = False
        else:
            reason = _bad_count_reason(entry["count"])
            if reason:
                problems.append(f"{where}.count {reason}")
                ok = False
        if ok:
            items.append((entry["label"], entry["count"]))
    if len(problems) > start:
        return None
    return items

def extract_distributions(json_payloads) -> dict:
    """
    Maps the four {label, count} arrays to the website contracts, preserving exact labels and order:
      consultations_by_department -> departments[{department, count}]
      top_diseases                -> top_diseases[{disease, count}]
      doctors_by_specialty        -> doctor_specialties[{specialty, count}]
      age_distribution            -> age_groups[{range, count}]
    No spelling correction, merging, or invented categories (e.g. no 'Not recorded').
    An empty list is rejected because the website would render an empty chart.
    """
    data = _latest_outreach_data(json_payloads)
    problems = []
    result = {}
    for api_key, out_key, label_field in DISTRIBUTION_MAP:
        items = _read_label_count_list(data, api_key, False, problems)
        if items is not None:
            result[out_key] = [{label_field: label, "count": count} for label, count in items]
    _raise_if_problems("Invalid distribution data", problems)
    return result

def extract_gender_split(json_payloads) -> dict:
    """
    gender_distribution -> {female, male, other}. Requires exactly one 'Male' and one 'Female'; an 'Other' entry is
    accepted (at most once). Labels are matched case-insensitively and exactly; any other or repeated label raises.
    Counts are preserved exactly as reported; they are never adjusted to make totals match.

    When the API reports 'Other', `other` is that real count. COMPATIBILITY VALUE: when the API does NOT report an
    'Other' entry, `other` is set to 0 purely because the website reads gender_split.other as a number (it divides by
    it, so a missing value would render NaN). That 0 is then NOT an observed API count.
    """
    data = _latest_outreach_data(json_payloads)
    problems = []
    items = _read_label_count_list(data, "gender_distribution", False, problems)
    _raise_if_problems("Invalid gender data", problems)

    found = {}
    for label, count in items:
        key = GENDER_LABEL_MAP.get(label.lower())
        if key is None:
            problems.append(f"gender_distribution has an unrecognised label {label[:40]!r} (only Male, Female and Other are supported)")
        elif key in found:
            problems.append(f"gender_distribution has more than one '{key}' entry")
        else:
            found[key] = count
    for key in GENDER_REQUIRED_KEYS:
        if key not in found:
            problems.append(f"gender_distribution has no '{key}' entry")
    _raise_if_problems("Invalid gender data", problems)

    # 'other' is the real reported count when present; otherwise the documented compatibility 0 (see docstring).
    return {"female": found["female"], "male": found["male"], "other": found.get("other", 0)}

def extract_patient_types(json_payloads) -> dict:
    """
    new_vs_followup -> {new, followUp, notCategorised, unknown}.
      new_patients      -> new
      followup_patients -> followUp
      unknown           -> unknown   (the real API value, preserved under its own name)

    COMPATIBILITY VALUE: the website reads patient_types.notCategorised as a number (it divides by it,
    so a missing value would render NaN). It has NOT been verified that the API's `unknown` means
    "not categorised", so that equivalence is deliberately NOT assumed: `notCategorised` is set to 0
    purely to satisfy the contract and is NOT an observed API count. `unknown` keeps the real value.
    """
    data = _latest_outreach_data(json_payloads)
    nvf = data.get("new_vs_followup")
    if not isinstance(nvf, dict):
        raise ValueError(
            "[Agent 2 CRITICAL ERROR] new_vs_followup is missing or not an object. "
            "Nothing was written and no defaults were used."
        )
    problems = []
    values = {}
    for key in NEW_VS_FOLLOWUP_KEYS:
        if key not in nvf:
            problems.append(f"new_vs_followup.{key} is missing")
            continue
        reason = _bad_count_reason(nvf[key])
        if reason:
            problems.append(f"new_vs_followup.{key} {reason}")
        else:
            values[key] = nvf[key]
    _raise_if_problems("Invalid new_vs_followup data", problems)

    return {
        "new": values["new_patients"],
        "followUp": values["followup_patients"],
        "notCategorised": 0,  # compatibility value, see docstring; NOT the API's `unknown`
        "unknown": values["unknown"],
    }

def _read_type_matrix(data, api_key, problems):
    """
    Validates {columns: [string], rows: [{label, counts: {column: integer}, total: integer}]}.
    Returns a copy with the API's own structure, or None if invalid (problems are appended).
    """
    matrix = data.get(api_key)
    if matrix is None:
        problems.append(f"{api_key} is missing or null")
        return None
    if not isinstance(matrix, dict):
        problems.append(f"{api_key} is of type {type(matrix).__name__}, expected an object")
        return None
    start = len(problems)
    columns = matrix.get("columns")
    rows = matrix.get("rows")
    if not isinstance(columns, list):
        problems.append(f"{api_key}.columns is missing or not a list")
        columns = None
    else:
        for i, col in enumerate(columns):
            reason = _bad_text_reason(col)
            if reason:
                problems.append(f"{api_key}.columns[{i}] {reason}")
        if len(set(c for c in columns if isinstance(c, str))) != len([c for c in columns if isinstance(c, str)]):
            problems.append(f"{api_key}.columns contains a repeated label")
    if not isinstance(rows, list):
        problems.append(f"{api_key}.rows is missing or not a list")
        rows = None
    if columns is None or rows is None or len(problems) > start:
        return None

    out_rows = []
    for i, row in enumerate(rows):
        where = f"{api_key}.rows[{i}]"
        if not isinstance(row, dict):
            problems.append(f"{where} is of type {type(row).__name__}, expected an object")
            continue
        if "label" not in row:
            problems.append(f"{where}.label is missing")
        else:
            reason = _bad_text_reason(row["label"])
            if reason:
                problems.append(f"{where}.label {reason}")
        if "total" not in row:
            problems.append(f"{where}.total is missing")
        else:
            reason = _bad_count_reason(row["total"])
            if reason:
                problems.append(f"{where}.total {reason}")
        counts = row.get("counts")
        if not isinstance(counts, dict):
            problems.append(f"{where}.counts is missing or not an object")
            continue
        if set(counts.keys()) != set(columns):
            problems.append(f"{where}.counts keys do not match the columns")
        for col in columns:
            if col in counts:
                reason = _bad_count_reason(counts[col])
                if reason:
                    problems.append(f"{where}.counts[column {columns.index(col)}] {reason}")
        if len(problems) == start:
            out_rows.append({"label": row["label"], "counts": dict(counts), "total": row["total"]})
    if len(problems) > start:
        return None
    return {"columns": list(columns), "rows": out_rows}

def extract_additional_fields(json_payloads) -> dict:
    """
    Preserves four verified API fields that the website does not currently use, with their actual
    API structure: consultation_types, patients_served_split, consultations_by_type_gender,
    consultations_by_type_age. No renaming and no inferred relationships between them.

    Because nothing consumes these fields, a malformed one is NOT allowed to block the update of
    the data the website does show: it is skipped and a loud warning (names only, no values) is printed.
    """
    data = _latest_outreach_data(json_payloads)
    preserved = {}

    def skip(api_key, problems):
        shown = problems[:_MAX_REPORTED_PROBLEMS]
        more = f" (+{len(problems) - len(shown)} more)" if len(problems) > len(shown) else ""
        print(f"[Agent 2 WARNING] Optional API field '{api_key}' was NOT preserved (not used by the website): "
              + "; ".join(shown) + more)

    # consultation_types: list of {label, count}
    problems = []
    items = _read_label_count_list(data, "consultation_types", True, problems)
    if items is not None:
        preserved["consultation_types"] = [{"label": label, "count": count} for label, count in items]
    else:
        skip("consultation_types", problems)

    # patients_served_split: object with three verified integer keys
    problems = []
    split = data.get("patients_served_split")
    if not isinstance(split, dict):
        problems.append("patients_served_split is missing or not an object")
    else:
        for key in PATIENTS_SERVED_SPLIT_KEYS:
            if key not in split:
                problems.append(f"patients_served_split.{key} is missing")
            else:
                reason = _bad_count_reason(split[key])
                if reason:
                    problems.append(f"patients_served_split.{key} {reason}")
    if not problems:
        preserved["patients_served_split"] = {key: split[key] for key in PATIENTS_SERVED_SPLIT_KEYS}
    else:
        skip("patients_served_split", problems)

    # The two consultation matrices
    for api_key in ("consultations_by_type_gender", "consultations_by_type_age"):
        problems = []
        matrix = _read_type_matrix(data, api_key, problems)
        if matrix is not None:
            preserved[api_key] = matrix
        else:
            skip(api_key, problems)

    return preserved

# ---------------------------------------------------------------------------
# Reporting period (additive `period` object): which dates/granularity the response covers.
# start_date, end_date and granularity come from the response BODY; center_status is only available
# in the request URL's query string. Conflicts between URL and body fail clearly. Nothing is defaulted
# or invented. Error messages never print the values.
# ---------------------------------------------------------------------------
_ISO_DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")

def _valid_iso_date(value) -> bool:
    """True only for a real calendar date written exactly as YYYY-MM-DD."""
    if not isinstance(value, str) or not _ISO_DATE_PATTERN.match(value):
        return False
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        return False
    return True

def extract_reporting_period(json_payloads) -> dict:
    """
    Returns {type, start_date, end_date, granularity, center_status} for the selected outreach-summary response.

    Two kinds of period are supported:
      * "date_range"       : both body dates are real YYYY-MM-DD calendar dates (validated as before).
      * "portal_all_time"  : both body dates are null (the portal's explicit All-Time report). This is accepted ONLY
                             when the original request URL is known and carries NO start_date/end_date parameter.
                             The dates stay null: no start date is invented.
    One date null and the other set, a URL/body conflict, or an unknown URL for a null-date body all fail.
    center_status is None when the URL does not carry it (no default is invented).
    """
    data = _latest_outreach_data(json_payloads)
    # Find the URL of that same response by identity (no second selection rule).
    url = next((p.get("url") for p in reversed(json_payloads or [])
                if isinstance(p, dict) and p.get("data") is data), "")
    try:
        query = parse_qs(urlparse(str(url)).query, keep_blank_values=True)
    except Exception:
        query = {}

    problems = []
    period_type = None

    missing_dates = [f for f in ("start_date", "end_date") if f not in data]
    for field in missing_dates:
        problems.append(f"{field} is missing from the response body")
    if not missing_dates:
        start_value, end_value = data["start_date"], data["end_date"]
        if start_value is None and end_value is None:
            # Portal All-Time: only valid if the request itself carried no date parameters.
            period_type = "portal_all_time"
            if not url:
                problems.append("the request URL is unavailable, so a null-date (All-Time) response cannot be confirmed")
            elif "start_date" in query or "end_date" in query:
                problems.append("the response body has null dates but the request URL carries date parameters")
        elif start_value is None or end_value is None:
            problems.append("one of start_date/end_date is null and the other is not")
        else:
            period_type = "date_range"
            for field in ("start_date", "end_date"):
                if not _valid_iso_date(data[field]):
                    problems.append(f"{field} in the response body is not a valid YYYY-MM-DD calendar date")
    if "granularity" not in data:
        problems.append("granularity is missing from the response body")
    else:
        reason = _bad_text_reason(data["granularity"])
        if reason:
            problems.append(f"granularity in the response body {reason}")

    # URL values must agree with the body; they are never silently reconciled.
    for field in ("start_date", "end_date", "granularity"):
        url_values = query.get(field)
        if not url_values:
            continue
        if len(url_values) > 1:
            problems.append(f"{field} appears more than once in the request URL")
        elif field in data and isinstance(data[field], str) and url_values[0] != data[field]:
            problems.append(f"{field} in the request URL conflicts with the response body")

    center_status = None
    center_values = query.get("center_status")
    if center_values:
        if len(center_values) > 1:
            problems.append("center_status appears more than once in the request URL")
        elif center_values[0].strip() == "":
            problems.append("center_status in the request URL is empty")
        else:
            center_status = center_values[0]

    _raise_if_problems("Invalid reporting period", problems)

    return {
        "type": period_type,
        "start_date": data["start_date"],
        "end_date": data["end_date"],
        "granularity": data["granularity"],
        "center_status": center_status,
    }

def extract_16_metrics(scraped_input) -> dict:
    """
    Agent 2: Dynamic Data Extractor Agent
    Parses raw HTML and API JSON payloads intercepted from DigiSwasthya Management Portal.
    Extracts dynamic department lists, disease lists, district reach, demographics, growth trends, and KPI Cards.
    """
    print("[Agent 2] Extracting live metrics from portal HTML and API payloads...")

    html_content = ""
    json_payloads = []
    outreach_summary = None

    if isinstance(scraped_input, dict):
        html_content = scraped_input.get("html", "")
        json_payloads = scraped_input.get("json_payloads", [])
        outreach_summary = scraped_input.get("outreach_summary")
    else:
        html_content = str(scraped_input)

    # If the scraper supplied the response it selected, use ONLY that response for all extraction below
    # (other captured responses are not searched). Without it (e.g. standalone extractor mode reading
    # saved temp files) the previous behavior is kept: the latest matching response in json_payloads.
    if outreach_summary is not None:
        if (not isinstance(outreach_summary, dict)
                or not isinstance(outreach_summary.get("url"), str)
                or not isinstance(outreach_summary.get("data"), dict)):
            raise ValueError(
                "[Agent 2 CRITICAL ERROR] 'outreach_summary' from the scraper is malformed "
                "(expected an object with a string 'url' and an object 'data'). "
                "Nothing was written and no defaults were used."
            )
        extraction_payloads = [{"url": outreach_summary["url"], "data": outreach_summary["data"]}]
        print(f"[Agent 2] Using the response selected by the scraper "
              f"(request #{outreach_summary.get('request_number', '?')}); other captured responses are not searched.")
    else:
        extraction_payloads = json_payloads

    soup = BeautifulSoup(html_content, "html.parser")
    text_content = soup.get_text()

    # Default Datasets matching latest management portal figures
    # NOTE: the five headline metrics (patients, teleconsultations, camps, doctors, hospitals)
    # intentionally have NO defaults; they come only from the validated API headline (Stage 1).
    # Stage 3B: departments, diseases, specialties, age groups, gender and patient types likewise have
    # NO defaults; they come only from the validated API response (see extract_distributions and friends).
    # Stage 2: growth, reach totals and district/village lists intentionally have NO defaults;
    # they come only from the validated API response (see extract_growth_trends and friends).

    # Track if we found real live data from the portal (not hardcoded defaults)
    live_data_found = False

    # Comprehensive set of keys that indicate a live portal data payload
    LIVE_DATA_KEYS = {
        "headline", "consultations_by_department", "summary", "outreach_summary",
        "outreach", "impact", "stats", "kpis", "kpi", "overview", "totals",
        "total_patients", "patients_served", "patientsServed", "patientCount",
        "departments", "by_department", "departmentBreakdown", "consultationsByDepartment",
        "top_diseases", "diseases", "topDiseases", "diagnoses",
        "age_distribution", "ageDistribution", "age_groups", "ageGroups",
        "gender_distribution", "genderDistribution",
        "districts", "district_reach", "districtReach",
        "patients_growth", "patientsGrowth", "growth_trends", "growthTrends",
        "doctors_by_specialty", "doctorsBySpecialty", "specialties",
        "new_vs_followup", "newVsFollowup",
    }

    # DEBUG: Log all captured payload URLs and their top-level keys
    print(f"[Agent 2] Processing {len(json_payloads)} captured API payloads:")
    for i, p in enumerate(json_payloads):
        p_data = p.get("data", {})
        p_keys = list(p_data.keys()) if isinstance(p_data, dict) else f"[{type(p_data).__name__}]"
        print(f"  [Payload {i}] {p.get('url', '?')[:80]} | keys: {p_keys}")

    # Parse Intercepted API JSON Payloads (only the selected response when the scraper supplied one)
    for payload in extraction_payloads:
        data_obj = payload.get("data", {})
        if isinstance(data_obj, dict):
            if any(k in data_obj for k in LIVE_DATA_KEYS):
                print(f"[Agent 2] Live portal API data detected! URL: {payload.get('url', '?')[:60]}")
                print(f"[Agent 2] Payload top-level keys: {list(data_obj.keys())}")
                live_data_found = True

                # 1. KPI Headline — try all common field name variants
                hl = {}
                for kpi_key in ["headline", "summary", "stats", "kpis", "kpi", "overview", "totals"]:
                    val = data_obj.get(kpi_key)
                    if isinstance(val, dict) and val:
                        hl = val
                        break
                # Also check if KPI values are at the root level
                if not hl and any(k in data_obj for k in ["patients_served", "total_patients", "patientsServed"]):
                    hl = data_obj
                # The five headline metrics are no longer guessed here; see extract_headline_kpis().

                # 2-5. Departments, diseases, specialties and age groups are no longer guessed here;
                # see extract_distributions() (Stage 3B).

                # 6-7. Gender split and new/follow-up patient types are no longer guessed here;
                # see extract_gender_split() and extract_patient_types() (Stage 3B).

                # 8-10. Growth trends, district/village lists and reach totals are no longer guessed here;
                # see extract_growth_trends(), extract_reach_lists() and extract_headline_reach() (Stage 2).

    # CRITICAL GUARD: If no live API data was intercepted from the portal,
    # the scraper likely failed to login or reach the dashboard.
    # Raise an error to prevent stale/hardcoded data from being written to Firebase.
    if not live_data_found:
        raise ValueError(
            "[Agent 2 CRITICAL ERROR] No live API data was captured from the portal.\n"
            "The scraper likely failed to login or the portal did not return JSON API data.\n"
            "Pipeline aborted — Firebase will NOT be updated with stale/hardcoded data."
        )

    # Stage 1: the five headline metrics come ONLY from the validated API headline.
    # Page text (HTML) is no longer used to read or override them.
    headline_kpis = extract_headline_kpis(extraction_payloads)

    # Stage 2: growth, reach totals and detailed lists, all from the validated API response.
    # Any problem raises before anything is written (see pipeline.py write order).
    reach_totals = extract_headline_reach(extraction_payloads)
    reach_lists = extract_reach_lists(extraction_payloads)
    growth_trends = extract_growth_trends(extraction_payloads)

    # Stage 3B: distributions, gender, patient types (required), plus four optional extra API fields.
    # Required-data problems raise before anything is written; the optional fields only warn.
    distributions = extract_distributions(extraction_payloads)
    gender_split = extract_gender_split(extraction_payloads)
    patient_types = extract_patient_types(extraction_payloads)
    additional_fields = extract_additional_fields(extraction_payloads)

    # Reporting period (additive): dates and granularity the response covers; fails on conflicts.
    reporting_period = extract_reporting_period(extraction_payloads)

    extracted_payload = {
        "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "period": reporting_period,
        "metrics_count": 16,
        "kpis": {
            "total_patients": headline_kpis["total_patients"],
            "total_teleconsultations": headline_kpis["total_teleconsultations"],
            "total_camps": headline_kpis["total_camps"],
            "total_doctors": headline_kpis["total_doctors"],
            "total_hospitals": headline_kpis["total_hospitals"]
        },
        "growth": growth_trends,
        "departments": distributions["departments"],
        "top_diseases": distributions["top_diseases"],
        "doctor_specialties": distributions["doctor_specialties"],
        "demographics": {
            "age_groups": distributions["age_groups"],
            "patient_types": patient_types,
            "gender_split": gender_split
        },
        "reach": {
            "districts": reach_totals["districts"],
            "villages": reach_totals["villages"],
            "district_list": reach_lists["district_list"],
            "village_list": reach_lists["village_list"]
        }
    }

    # Additional verified API fields, preserved under their API names (not used by the website yet).
    extracted_payload.update(additional_fields)

    print(f"[Agent 2 Extracted] Total Patients: {extracted_payload['kpis']['total_patients']}, Departments: {len(distributions['departments'])}, Districts: {len(reach_lists['district_list'])}")
    return extracted_payload

if __name__ == "__main__":
    filepath = sys.argv[1] if len(sys.argv) > 1 else "scraped_report_temp.html"
    json_path = "scraped_report_temp.json"
    
    html_data = ""
    json_payloads = []

    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            html_data = f.read()

    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                json_payloads = json.load(f)
        except Exception:
            pass

    data = extract_16_metrics({ "html": html_data, "json_payloads": json_payloads })
    out_file = "extracted_16_metrics.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"[Agent 2 Completed] Extracted JSON written to {out_file}")
