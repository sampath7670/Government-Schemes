from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models.scheme import SchemeModel, SearchFilterRequest, StudentProfile, EligibilityCheckResponse
from app.services.scheme_service import SchemeService

router = APIRouter(prefix="/api", tags=["Government Schemes"])

@router.get("/states")
async def get_states():
    """Return list of all 28 States, 8 Union Territories, and Central Government."""
    return SchemeService.load_states_master()

@router.get("/schemes", response_model=List[SchemeModel])
async def get_schemes(
    state: Optional[str] = Query(None, description="State name, e.g., 'Andhra Pradesh'"),
    government_level: Optional[str] = Query(None, description="Government level: Central, State, UT"),
    education_level: Optional[str] = Query(None, description="Education level, e.g., 'Class 10'"),
    category: Optional[str] = Query(None, description="Social category: SC, ST, OBC, EBC, General"),
    gender: Optional[str] = Query(None, description="Gender: All, Female, Male"),
    verification_status: Optional[str] = Query(None, description="Verification status: Verified, Needs Verification"),
    query: Optional[str] = Query(None, description="Free text search query")
):
    """Fetch schemes matching specified criteria."""
    filters = SearchFilterRequest(
        state=state,
        government_level=government_level,
        education_level=education_level,
        category=category,
        gender=gender,
        verification_status=verification_status,
        query=query
    )
    return await SchemeService.get_filtered_schemes(filters)

@router.get("/schemes/state/{state}", response_model=List[SchemeModel])
async def get_schemes_by_state(state: str):
    """Fetch schemes applicable to a specific State or Union Territory (includes Central schemes)."""
    return await SchemeService.get_schemes_for_state(state)

@router.get("/schemes/{scheme_id}", response_model=SchemeModel)
async def get_scheme_by_id(scheme_id: str):
    """Fetch individual scheme detail by scheme_id."""
    scheme = await SchemeService.get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail=f"Scheme '{scheme_id}' not found")
    return scheme

@router.post("/schemes/search", response_model=List[SchemeModel])
async def search_schemes(filters: SearchFilterRequest):
    """Advanced search & filter endpoint."""
    return await SchemeService.get_filtered_schemes(filters)

@router.post("/eligibility/check", response_model=EligibilityCheckResponse)
async def check_eligibility(profile: StudentProfile):
    """Evaluate student profile against schemes and return Potentially Relevant, More Information Required, or Not Matching."""
    return await SchemeService.check_eligibility(profile)

@router.get("/sources")
async def get_sources():
    """Return registry of official government scheme sources and verification metadata."""
    schemes = await SchemeService.get_filtered_schemes(SearchFilterRequest())
    sources = []
    for s in schemes:
        sources.append({
            "scheme_id": s.scheme_id,
            "scheme_name": s.scheme_name,
            "government_level": s.government_level,
            "state": s.state,
            "department": s.department,
            "official_website": s.official_website,
            "official_document_url": s.official_document_url,
            "source_title": s.source_title,
            "source_date": s.source_date,
            "last_verified": s.last_verified,
            "academic_year": s.academic_year,
            "verification_status": s.verification_status
        })
    return sources
