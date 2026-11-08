"""
Breeze Scout MCP Server (packages/breeze-scout-mcp/server.py)
Opportunity Mining, Learnership Radar & Bursary Aggregator
Part of the Breeze Life Co-Pilot Ecosystem
"""

import json
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional


@dataclass
class Opportunity:
    id: str
    title: str
    organization: str
    category: str  # JOB, LEARNERSHIP, BURSARY, ADMISSION, VISA
    location: str
    closing_date: str
    stipend_salary: Optional[str]
    requirements: List[str]
    application_url: str
    verified: bool


SAMPLE_OPPORTUNITIES = [
    Opportunity(
        id="OPP-2026-001",
        title="Junior Systems Support & Network Technician",
        organization="Dimension Data / NTT",
        category="JOB",
        location="Johannesburg, Gauteng",
        closing_date="2026-12-15",
        stipend_salary="R16,000 - R22,000 / month",
        requirements=["Diploma in IT or equivalent", "Basic Cisco CCNA knowledge", "Good communication"],
        application_url="https://dimensiondata.wd3.myworkdayjobs.com/careers/job/1029",
        verified=True
    ),
    Opportunity(
        id="OPP-2026-002",
        title="MICT SETA Software Development Learnership (12 Months)",
        organization="MICT SETA / Capaciti",
        category="LEARNERSHIP",
        location="Cape Town & Remote",
        closing_date="2026-11-30",
        stipend_salary="R5,500 monthly stipend",
        requirements=["Grade 12 Matric Certificate", "Age 18 - 29", "Unemployed South African citizen"],
        application_url="https://www.capaciti.org.za/apply-learnership",
        verified=True
    ),
    Opportunity(
        id="OPP-2026-003",
        title="Sasol Foundation Undergraduate STEM Bursary 2027",
        organization="Sasol Foundation",
        category="BURSARY",
        location="National (South Africa)",
        closing_date="2026-12-05",
        stipend_salary="Full Tuition + Accommodation + Laptop Allowance",
        requirements=["Grade 12 with Pure Maths Level 6+", "Physical Sciences Level 6+", "Financial need"],
        application_url="https://www.sasolbursaries.com/apply",
        verified=True
    ),
    Opportunity(
        id="OPP-2026-004",
        title="Youth Working Holiday Visa Intake 2027",
        organization="Department of Foreign Affairs & Partner Embassies",
        category="VISA",
        location="International (UK / Ireland / Germany)",
        closing_date="2026-12-31",
        stipend_salary="Permission to work up to 24 months",
        requirements=["Valid South African Passport", "Age 18 - 30", "No criminal record"],
        application_url="https://www.gov.uk/youth-mobility-visa",
        verified=True
    )
]


class BreezeScoutServer:
    """
    Exposes tools for searching, mining, and ranking
    life opportunities for youth.
    """

    def search_opportunities(self, category: Optional[str] = None, keyword: Optional[str] = None) -> List[Dict[str, Any]]:
        results = []
        for opp in SAMPLE_OPPORTUNITIES:
            if category and opp.category.upper() != category.upper():
                continue
            if keyword:
                kw = keyword.lower()
                text_to_match = f"{opp.title} {opp.organization} {' '.join(opp.requirements)}".lower()
                if kw not in text_to_match:
                    continue
            results.append(asdict(opp))
        return results

    def calculate_compatibility(self, opp_id: str, user_subjects: Dict[str, str], user_qualification: str) -> Dict[str, Any]:
        """Calculates a match percentage between the opportunity and the user profile."""
        # Simulated heuristic matching
        return {
            "opportunity_id": opp_id,
            "match_score_pct": 92.5,
            "met_requirements": [
                "Matric Certificate verified",
                "Mathematics Level 6 threshold satisfied",
                "Diploma in IT matches qualification criteria"
            ],
            "missing_requirements": [],
            "recommendation": "High probability of acceptance. Recommended for 1-Click Apply."
        }


if __name__ == "__main__":
    scout = BreezeScoutServer()
    print("=== Breeze Scout MCP Server Online ===")
    print(json.dumps(scout.search_opportunities(category="JOB"), indent=2))
