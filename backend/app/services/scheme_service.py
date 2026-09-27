import os
import json
from typing import List, Dict, Any, Optional
from app.database.connection import db_manager
from app.models.scheme import SchemeModel, SearchFilterRequest, StudentProfile, EligibilityCheckResponse
from app.eligibility.engine import evaluate_all_schemes

class SchemeService:
    @staticmethod
    def load_states_master() -> List[Dict[str, Any]]:
        # Root data directory
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        states_file = os.path.join(base_dir, "..", "data", "states.json")
        if not os.path.exists(states_file):
            states_file = os.path.join(base_dir, "data", "states.json")
        if not os.path.exists(states_file):
            states_file = os.path.join(os.getcwd(), "data", "states.json")
        if os.path.exists(states_file):
            with open(states_file, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    @staticmethod
    async def get_filtered_schemes(filters: SearchFilterRequest) -> List[SchemeModel]:
        all_raw_schemes = await db_manager.get_all_schemes()
        filtered = []

        for item in all_raw_schemes:
            try:
                scheme = SchemeModel(**item)
            except Exception as e:
                continue

            # State & Govt level matching
            if filters.state:
                st_query = filters.state.strip().lower()
                is_central = scheme.government_level.lower() == "central"
                is_matching_state = scheme.state.strip().lower() == st_query
                if not (is_central or is_matching_state):
                    continue

            if filters.government_level:
                if scheme.government_level.lower() != filters.government_level.strip().lower():
                    continue

            # Education Level matching
            if filters.education_level:
                target_edu = filters.education_level.strip().lower()
                scheme_edus = [e.strip().lower() for e in scheme.education_level]

                if "class 10" in target_edu or "secondary" in target_edu:
                    if not any("class 10" in e or "secondary" in e or "class 9" in e for e in scheme_edus):
                        continue
                else:
                    if not any(target_edu in e for e in scheme_edus):
                        continue

            # Category matching
            if filters.category:
                cat_query = filters.category.strip().upper()
                scheme_cats = [c.upper() for c in scheme.social_category]
                if scheme_cats and "ALL" not in scheme_cats and "GENERAL" not in scheme_cats:
                    if cat_query not in scheme_cats:
                        continue

            # Gender matching
            if filters.gender and filters.gender.lower() not in ["all", "any"]:
                g_query = filters.gender.strip().capitalize()
                s_g = scheme.gender.strip().capitalize()
                if s_g not in ["All", "Any"] and s_g != g_query:
                    continue

            # Income limit check
            if filters.max_income is not None and (scheme.maximum_family_income or scheme.income_limit):
                try:
                    inc_limit = float(scheme.maximum_family_income or scheme.income_limit)
                    if filters.max_income > inc_limit:
                        continue
                except ValueError:
                    pass

            # PwD check
            if filters.is_pwd is True:
                if scheme.category.lower() != "disability" and not (scheme.disability_requirement and "disability" in scheme.disability_requirement.lower()):
                    pass  # open to PwD as well

            # Verification status filter
            if filters.verification_status:
                if scheme.verification_status.lower() != filters.verification_status.strip().lower():
                    continue

            # Search query text filter
            if filters.query:
                q = filters.query.strip().lower()
                searchable_text = f"{scheme.scheme_name} {scheme.department} {scheme.state} {' '.join(scheme.benefits)} {scheme.academic_requirement or ''}".lower()
                if q not in searchable_text:
                    continue

            filtered.append(scheme)

        return filtered

    @staticmethod
    async def get_schemes_for_state(state_name: str) -> List[SchemeModel]:
        return await SchemeService.get_filtered_schemes(SearchFilterRequest(state=state_name))

    @staticmethod
    async def get_scheme_by_id(scheme_id: str) -> Optional[SchemeModel]:
        raw = await db_manager.get_scheme_by_id(scheme_id)
        if raw:
            return SchemeModel(**raw)
        return None

    @staticmethod
    async def check_eligibility(profile: StudentProfile) -> EligibilityCheckResponse:
        filters = SearchFilterRequest(state=profile.state, education_level=profile.education_level)
        candidate_schemes = await SchemeService.get_filtered_schemes(filters)
        return evaluate_all_schemes(candidate_schemes, profile)
