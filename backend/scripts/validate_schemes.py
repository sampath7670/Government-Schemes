import json
import os
import sys
from urllib.parse import urlparse

VALID_GOVT_LEVELS = {"Central", "State", "UT"}
VALID_VERIFICATION_STATUSES = {"Verified", "Needs Verification"}
VALID_EDUCATION_LEVELS = {
    "Class 9", "Class 10", "Secondary", "Class 11", "Class 12",
    "Degree", "B.Tech", "M.Tech", "Master's", "PG", "Research"
}

def is_valid_url(url: str) -> bool:
    if not url or not isinstance(url, str):
        return False
    try:
        result = urlparse(url)
        return all([result.scheme in ["http", "https"], result.netloc])
    except Exception:
        return False

def validate_scheme_records(schemes_filepath: str):
    if not os.path.exists(schemes_filepath):
        print(f"Error: File not found: {schemes_filepath}")
        return

    with open(schemes_filepath, "r", encoding="utf-8") as f:
        schemes = json.load(f)

    total_schemes = len(schemes)
    verified_count = 0
    needs_verification_count = 0
    invalid_count = 0
    duplicates_count = 0
    missing_sources = 0
    missing_eligibility = 0
    missing_documents = 0

    seen_ids = set()
    errors = []

    for idx, s in enumerate(schemes):
        scheme_id = s.get("scheme_id")
        scheme_name = s.get("scheme_name")
        govt_level = s.get("government_level")
        state = s.get("state")
        department = s.get("department")
        official_url = s.get("official_website")
        academic_year = s.get("academic_year")
        last_verified = s.get("last_verified")
        verification_status = s.get("verification_status")
        edu_levels = s.get("education_level", [])
        benefits = s.get("benefits", [])
        documents = s.get("required_documents", [])
        academic_req = s.get("academic_requirement")

        is_record_valid = True
        record_errors = []

        # Duplicate check
        if scheme_id:
            if scheme_id in seen_ids:
                duplicates_count += 1
                record_errors.append(f"Duplicate scheme_id '{scheme_id}'")
                is_record_valid = False
            else:
                seen_ids.add(scheme_id)
        else:
            record_errors.append("Missing scheme_id")
            is_record_valid = False

        # Name check
        if not scheme_name:
            record_errors.append("Missing scheme_name")
            is_record_valid = False

        # State check
        if not state:
            record_errors.append("Missing state")
            is_record_valid = False

        # Govt level check
        if not govt_level or govt_level not in VALID_GOVT_LEVELS:
            record_errors.append(f"Invalid government_level: '{govt_level}'")
            is_record_valid = False

        # Department check
        if not department:
            record_errors.append("Missing department")
            is_record_valid = False

        # Official URL check
        if not official_url or not is_valid_url(official_url):
            missing_sources += 1
            record_errors.append(f"Invalid or missing official_website: '{official_url}'")
            is_record_valid = False

        # Academic year check
        if not academic_year:
            record_errors.append("Missing academic_year")
            is_record_valid = False

        # Verification date check
        if not last_verified:
            record_errors.append("Missing last_verified date")
            is_record_valid = False

        # Verification status check
        if not verification_status or verification_status not in VALID_VERIFICATION_STATUSES:
            record_errors.append(f"Invalid verification_status: '{verification_status}'")
            is_record_valid = False

        # Education level check
        if not edu_levels or not isinstance(edu_levels, list):
            record_errors.append("Missing or invalid education_level list")
            is_record_valid = False
        else:
            invalid_edus = [lvl for lvl in edu_levels if lvl not in VALID_EDUCATION_LEVELS]
            if invalid_edus:
                record_errors.append(f"Invalid education levels: {invalid_edus}")
                is_record_valid = False

        # Eligibility check
        if not academic_req and not s.get("income_limit") and not s.get("social_category"):
            missing_eligibility += 1
            record_errors.append("Missing eligibility criteria")
            is_record_valid = False

        # Benefits check
        if not benefits or not isinstance(benefits, list):
            record_errors.append("Missing benefits list")
            is_record_valid = False

        # Documents check
        if not documents or not isinstance(documents, list):
            missing_documents += 1
            record_errors.append("Missing required_documents list")
            is_record_valid = False

        if verification_status == "Verified":
            verified_count += 1
        elif verification_status == "Needs Verification":
            needs_verification_count += 1

        if not is_record_valid:
            invalid_count += 1
            errors.append((scheme_id or f"Index {idx}", record_errors))

    print("==========================================")
    print("      GOVERNMENT SCHEMES VALIDATION       ")
    print("==========================================")
    print(f"Total Schemes:           {total_schemes}")
    print(f"Verified:                {verified_count}")
    print(f"Needs Verification:      {needs_verification_count}")
    print(f"Invalid:                 {invalid_count}")
    print(f"Duplicates:              {duplicates_count}")
    print(f"Missing Sources:         {missing_sources}")
    print(f"Missing Eligibility:     {missing_eligibility}")
    print(f"Missing Documents:       {missing_documents}")
    print("==========================================")

    if errors:
        print("\nValidation Errors Detail:")
        for sid, err_list in errors:
            print(f" - [{sid}]: {', '.join(err_list)}")
    else:
        print("\nAll schemes passed validation successfully!")

if __name__ == "__main__":
    filepath = sys.argv[1] if len(sys.argv) > 1 else os.path.join("data", "seed_schemes.json")
    validate_scheme_records(filepath)
