import asyncio
from app.database.connection import db_manager
from app.services.scheme_service import SchemeService
from app.models.scheme import SearchFilterRequest, StudentProfile

async def test_backend():
    print("Testing Backend Database & Services...")
    await db_manager.connect()

    states = SchemeService.load_states_master()
    print(f"Loaded {len(states)} states/UTs.")
    assert len(states) == 37, f"Expected 37 states/UTs, got {len(states)}"

    # Test State Filtering for Andhra Pradesh
    ap_schemes = await SchemeService.get_schemes_for_state("Andhra Pradesh")
    print(f"Found {len(ap_schemes)} schemes for Andhra Pradesh (including Central).")
    for s in ap_schemes:
        print(f" - [{s.government_level}] {s.scheme_name} (State: {s.state})")
        assert s.state == "Andhra Pradesh" or s.government_level == "Central"

    # Test State Filtering for Telangana
    ts_schemes = await SchemeService.get_schemes_for_state("Telangana")
    print(f"Found {len(ts_schemes)} schemes for Telangana (including Central).")
    for s in ts_schemes:
        assert s.state == "Telangana" or s.government_level == "Central"

    # Test Class 10 filtering
    c10_schemes = await SchemeService.get_filtered_schemes(SearchFilterRequest(education_level="Class 10"))
    print(f"Found {len(c10_schemes)} Class 10 schemes.")

    # Test Eligibility Check
    profile = StudentProfile(
        name="Anitha",
        state="Andhra Pradesh",
        education_level="Class 10",
        category="OBC",
        annual_income=150000.0,
        gender="Female"
    )
    elig_result = await SchemeService.check_eligibility(profile)
    print("\n--- Eligibility Check Result ---")
    print(f"Potentially Relevant: {len(elig_result.potentially_relevant)}")
    for item in elig_result.potentially_relevant:
        print(f"  * [POTENTIAL] {item.scheme.scheme_name}")
    print(f"More Info Required: {len(elig_result.more_info_required)}")
    for item in elig_result.more_info_required:
        print(f"  * [MORE INFO] {item.scheme.scheme_name}")
        print(f"    Missing: {item.missing_information}")
    print(f"Not Matching: {len(elig_result.not_matching)}")
    for item in elig_result.not_matching:
        print(f"  * [NOT MATCHING] {item.scheme.scheme_name}")
        print(f"    Conflicts: {item.conflicts}")

    print("\nAll backend unit tests passed successfully!")

if __name__ == "__main__":
    asyncio.run(test_backend())
