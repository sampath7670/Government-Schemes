from typing import List, Optional, Union
from pydantic import BaseModel, Field

class SchemeModel(BaseModel):
    scheme_id: str
    scheme_name: str
    government_level: str  # "Central" | "State" | "UT"
    state: str
    department: str
    category: str
    education_level: List[str]
    student_type: List[str] = []
    gender: str = "All"
    social_category: List[str] = []
    income_limit: Optional[str] = None
    maximum_family_income: Optional[str] = None
    age_limit: Optional[str] = "None"
    school_requirement: Optional[str] = None
    academic_requirement: Optional[str] = None
    disability_requirement: Optional[str] = None
    minority_requirement: Optional[str] = None
    domicile_requirement: Optional[str] = None
    benefits: List[str] = []
    required_documents: List[str] = []
    application_process: List[str] = []
    application_mode: Optional[str] = None
    application_start_date: Optional[str] = None
    application_end_date: Optional[str] = None
    official_website: str
    official_document_url: Optional[str] = None
    source_title: Optional[str] = None
    source_date: Optional[str] = None
    last_verified: str
    academic_year: str
    status: str = "Active"  # Active | Closed | Discontinued | Unknown
    verification_status: str = "Verified"  # Verified | Needs Verification
    notes: Optional[str] = None

    # Extended structured fields
    minimum_qualification: Optional[str] = None
    minimum_marks: Optional[str] = None
    course_eligibility: List[str] = []
    institution_eligibility: List[str] = []
    scholarship_benefit: Optional[str] = None
    tuition_fee_benefit: Optional[str] = None
    maintenance_benefit: Optional[str] = None
    application_portal: Optional[str] = None
    rural_urban_requirement: Optional[str] = None
    residential_requirement: Optional[str] = None
    gender_requirement: Optional[str] = "All"
    other_requirements: List[str] = []

class StudentProfile(BaseModel):
    name: Optional[str] = "Student"
    age: Optional[int] = 15
    state: str = "Andhra Pradesh"
    district: Optional[str] = None
    education_level: str = "Class 10"
    class_name: Optional[str] = "Class 10"  # Currently studying Class 10 / Passed Class 10
    gender: str = "All"
    category: str = "General"  # SC / ST / OBC / EBC / DNT / Minority / General / EWS
    annual_income: Optional[float] = 150000.0
    school_type: Optional[str] = "Government"  # Government / Private / Aided
    is_government_school: Optional[bool] = True
    area_type: Optional[str] = "Rural"  # Rural / Urban
    is_pwd: Optional[bool] = False
    disability_status: Optional[str] = "No"  # Yes / No
    is_minority: Optional[bool] = False
    residential_status: Optional[str] = "Day Scholar"  # Day Scholar / Hostel
    academic_marks: Optional[float] = 75.0  # percentage
    course: Optional[str] = "Class 10 General"
    institution_type: Optional[str] = "School"

class SearchFilterRequest(BaseModel):
    state: Optional[str] = None
    government_level: Optional[str] = None  # Central | State | UT
    education_level: Optional[str] = None   # e.g., Class 10
    category: Optional[str] = None          # SC / ST / OBC etc.
    gender: Optional[str] = None            # All / Female / Male
    max_income: Optional[float] = None
    is_pwd: Optional[bool] = None
    verification_status: Optional[str] = None
    query: Optional[str] = None

class EligibilityResultItem(BaseModel):
    scheme: SchemeModel
    classification: str  # "Potentially Relevant" | "More Information Required" | "Not Matching"
    matching_reasons: List[str]
    missing_information: List[str]
    conflicts: List[str]
    disclaimer: str = "Based on the information you provided, you may meet the listed criteria. Final eligibility is determined by the relevant authority."

class EligibilityCheckResponse(BaseModel):
    student_profile: StudentProfile
    total_schemes_checked: int
    potentially_relevant: List[EligibilityResultItem]
    more_info_required: List[EligibilityResultItem]
    not_matching: List[EligibilityResultItem]
