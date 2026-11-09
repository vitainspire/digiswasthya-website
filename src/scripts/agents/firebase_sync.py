import os
import sys
import json

# TESTING PHASE: the only Firebase project this script may ever write to.
# To use another project later, this list must be changed deliberately in code.
ALLOWED_PROJECT_IDS = {"digiswasthya-pipeline-test"}


class FirebaseSafetyError(Exception):
    """Raised when a safety check fails. Nothing has been written when this is raised."""


def _load_explicit_credentials() -> dict:
    """
    Reads the service-account JSON from an EXPLICIT source only, and returns it as a dict.
    Order: FIREBASE_SERVICE_ACCOUNT_KEY (JSON text), then GOOGLE_APPLICATION_CREDENTIALS (file path).
    Never falls back to default credentials. Never prints credential contents.
    """
    key_text = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
    key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if key_text:
        try:
            cred_dict = json.loads(key_text)
        except Exception as e:
            raise FirebaseSafetyError(
                f"FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON ({type(e).__name__}). Refusing to continue."
            )
    elif key_path:
        if not os.path.isfile(key_path):
            raise FirebaseSafetyError("GOOGLE_APPLICATION_CREDENTIALS does not point to an existing file. Refusing to continue.")
        try:
            with open(key_path, "r", encoding="utf-8") as f:
                cred_dict = json.load(f)
        except Exception as e:
            raise FirebaseSafetyError(
                f"The credentials file is not valid JSON ({type(e).__name__}). Refusing to continue."
            )
    else:
        raise FirebaseSafetyError(
            "No explicit credentials found (set FIREBASE_SERVICE_ACCOUNT_KEY or GOOGLE_APPLICATION_CREDENTIALS). "
            "Default credentials are not allowed. Refusing to continue."
        )

    if not isinstance(cred_dict, dict) or cred_dict.get("type") != "service_account":
        raise FirebaseSafetyError("The credentials are not a service-account key. Refusing to continue.")
    return cred_dict


def _get_expected_project_id() -> str:
    """Returns the expected project ID, or raises if it is missing or not allowed."""
    expected = (os.getenv("FIREBASE_EXPECTED_PROJECT_ID") or "").strip()
    if not expected:
        raise FirebaseSafetyError("FIREBASE_EXPECTED_PROJECT_ID is not set. Refusing to continue.")
    if expected not in ALLOWED_PROJECT_IDS:
        raise FirebaseSafetyError(
            f"FIREBASE_EXPECTED_PROJECT_ID '{expected}' is not an allowed project during the testing phase. Refusing to continue."
        )
    return expected


def sync_to_firebase_firestore(metrics_data: dict) -> bool:
    """
    Syncs the scraped impact metrics to Firebase Firestore collection 'impact_store' document 'latest'.

    SAFETY GUARD (testing phase): writes only if the credentials, the initialised app and the Firestore
    client all belong to the project named in FIREBASE_EXPECTED_PROJECT_ID, and that project is allowed.
    Returns True on success, False on any failure (nothing is written when a safety check fails).
    """
    print("[Firebase Sync] Connecting to Firebase Firestore...")

    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        # Check 1: expected project ID is set and allowed.
        expected_project = _get_expected_project_id()

        # Check 2: explicit credentials exist, are valid, and belong to the expected project (before any init).
        cred_dict = _load_explicit_credentials()
        key_project = cred_dict.get("project_id")
        if not key_project:
            raise FirebaseSafetyError("The credentials contain no project_id. Refusing to continue.")
        if key_project != expected_project:
            raise FirebaseSafetyError(
                f"Credentials belong to project '{key_project}', expected '{expected_project}'. Refusing to continue."
            )

        try:
            cred = credentials.Certificate(cred_dict)
        except Exception as e:
            raise FirebaseSafetyError(
                f"The service-account key could not be loaded ({type(e).__name__}). Refusing to continue."
            )
        if cred.project_id != expected_project:
            raise FirebaseSafetyError("Loaded credentials do not match the expected project. Refusing to continue.")

        # Check 3: initialise explicitly with the expected project ID (never default credentials).
        if firebase_admin._apps:
            # An app already exists in this process: it must already be the expected project.
            app = firebase_admin.get_app()
            if app.project_id != expected_project:
                raise FirebaseSafetyError(
                    "A Firebase app for a different project is already initialised. Refusing to continue."
                )
        else:
            app = firebase_admin.initialize_app(cred, {"projectId": expected_project})

        # Check 4: the Firestore client's real project must match, BEFORE any write.
        db = firestore.client(app)
        if db.project != expected_project:
            raise FirebaseSafetyError(
                f"Firestore client targets project '{db.project}', expected '{expected_project}'. Refusing to write."
            )

        # Write (same document path and data as before).
        doc_ref = db.collection("impact_store").document("latest")
        doc_ref.set(metrics_data)
        print("[Firebase Sync SUCCESS] Successfully updated Firebase Firestore document 'impact_store/latest'!")
        return True

    except FirebaseSafetyError as e:
        print(f"[Firebase Sync BLOCKED] {e} Nothing was written.")
        return False
    except Exception as e:
        print(f"[Firebase Sync Warning] Could not sync to Firebase: {e}")
        return False
