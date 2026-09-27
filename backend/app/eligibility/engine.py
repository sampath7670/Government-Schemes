from typing import Dict, Any, List
from app.models.scheme import StudentProfile, SchemeModel, EligibilityResultItem, EligibilityCheckResponse

DISCLAIMER_TEXT = (
    "Based on the information you provided, you may meet the listed criteria. "
    "Final eligibility is determined by the relevant authority."
)

def evaluate_scheme_for_student(scheme: SchemeModel, profile: StudentProfile) -> EligibilityResultItem:
    matching_reasons = []
    missing_info = []
    conflicts = []

    # 1. State / Jurisdiction Check (Central schemes apply to all states)
    if scheme.government_level == "Central":
        matching_reasons.append(f"Central Government scheme applicable across all States/UTs including {profile.state}.")
    else:
        # State or UT scheme
        if scheme.state.strip().lower() == profile.state.strip().lower():
            matching_reasons.append(f"State scheme matches your selected state ({profile.state}).")
        else:
            conflicts.append(f"Scheme is restricted to residents of {scheme.state}, but your profile state is {profile.state}.")

    # 2. Education Level Check
    profile_edu = profile.education_level.strip().lower()
    scheme_edus = [e.strip().lower() for e in scheme.education_level]

    # Map class 10 variations
    is_class_10_profile = "class 10" in profile_edu or "secondary" in profile_edu
    is_class_10_scheme = any("class 10" in e or "secondary" in e or "class 9" in e for e in scheme_edus)

    if is_class_10_profile:
        if is_class_10_scheme:
            matching_reasons.append("Applicable for Class 10 / Secondary education level.")
        else:
            conflicts.append(f"Scheme is for higher education level ({', '.join(scheme.education_level)}), not Class 10.")
    else:
        if any(profile_edu in e for e in scheme_edus):
            matching_reasons.append(f"Matches your education level ({profile.education_level}).")
        else:
            conflicts.append(f"Scheme target education levels ({', '.join(scheme.education_level)}) do not match profile level ({profile.education_level}).")

    # 3. Social Category Check
    profile_cat = profile.category.strip().upper()
    if not scheme.social_category or "ALL" in [c.upper() for c in scheme.social_category] or "GENERAL" in [c.upper() for c in scheme.social_category]:
        matching_reasons.append(f"Open to all social categories including {profile.category}.")
    else:
        scheme_cats = [c.upper() for c in scheme.social_category]
        if profile_cat in scheme_cats:
            matching_reasons.append(f"Matches your social category ({profile.category}).")
        else:
            conflicts.append(f"Scheme requires category in {', '.join(scheme.social_category)}, but profile is {profile.category}.")

    # 4. Gender Check
    profile_gender = profile.gender.strip().capitalize()
    scheme_gender = scheme.gender.strip().capitalize()
    if scheme_gender in ["All", "Any"] or scheme_gender == profile_gender:
        matching_reasons.append(f"Gender criteria satisfied ({scheme.gender}).")
    else:
        conflicts.append(f"Scheme is for {scheme.gender} students, but profile gender is {profile.gender}.")

    # 5. Income Limit Check
    if profile.annual_income is not None:
        if scheme.maximum_family_income or scheme.income_limit:
            inc_limit_str = scheme.maximum_family_income or scheme.income_limit
            try:
                max_income = float(inc_limit_str)
                if profile.annual_income <= max_income:
                    matching_reasons.append(f"Annual family income (₹{profile.annual_income:,.0f}) is within limit (₹{max_income:,.0f}).")
                else:
                    conflicts.append(f"Annual family income (₹{profile.annual_income:,.0f}) exceeds scheme limit (₹{max_income:,.0f}).")
            except ValueError:
                missing_info.append(f"Scheme income limit '{inc_limit_str}' requires manual review.")
        else:
            matching_reasons.append("No specific family income limit specified for this scheme.")
    else:
        missing_info.append("Family income not specified in profile.")

    # 6. Disability Check
    disability_req = (scheme.disability_requirement or "").lower()
    is_disability_mandatory = (scheme.category.lower() == "disability") or ("mandatory" in disability_req and "not mandatory" not in disability_req)
    if is_disability_mandatory:
        if profile.is_pwd or (profile.disability_status and profile.disability_status.lower() in ["yes", "pwd", "true"]):
            matching_reasons.append("Matches PwD / Disability status requirement.")
        else:
            conflicts.append("Scheme requires benchmark disability status (PwD).")

    # Determine Classification
    if len(conflicts) > 0:
        classification = "Not Matching"
    elif len(missing_info) > 0:
        classification = "More Information Required"
    else:
        classification = "Potentially Relevant"

    return EligibilityResultItem(
        scheme=scheme,
        classification=classification,
        matching_reasons=matching_reasons,
        missing_information=missing_info,
        conflicts=conflicts,
        disclaimer=DISCLAIMER_TEXT
    )

def evaluate_all_schemes(schemes: List[SchemeModel], profile: StudentProfile) -> EligibilityCheckResponse:
    potentially_relevant = []
    more_info_required = []
    not_matching = []

    for s in schemes:
        result = evaluate_scheme_for_student(s, profile)
        if result.classification == "Potentially Relevant":
            potentially_relevant.append(result)
        elif result.classification == "More Information Required":
            more_info_required.append(result)
        else:
            not_matching.append(result)

    return EligibilityCheckResponse(
        student_profile=profile,
        total_schemes_checked=len(schemes),
        potentially_relevant=potentially_relevant,
        more_info_required=more_info_required,
        not_matching=not_matching
    )
