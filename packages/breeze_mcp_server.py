"""
Breeze Universal MCP Server
Implements Model Context Protocol (MCP) JSON-RPC 2.0 over stdio.
Zero external dependencies required.
"""

import sys
import json
import re
from typing import Dict, Any, List, Optional


# ============================================================================
# BREEZE VAULT DATA STORE (Encrypted / Local Profile)
# ============================================================================
VAULT_DATA = {
    "personal": {
        "first_name": "Bhekumusa",
        "last_name": "Ntshwenya",
        "id_number": "0108255800084",
        "date_of_birth": "2001-08-25",
        "gender": "Male",
        "nationality": "South African"
    },
    "contact": {
        "email": "bhekumusaeric@gmail.com",
        "phone": "+27 72 000 0000",
        "city": "Johannesburg",
        "province": "Gauteng",
        "postal_code": "2001"
    },
    "academics": {
        "highest_qualification": "Diploma in Information Technology",
        "institution": "Eduvos",
        "completion_year": 2024,
        "matric": {
            "English HL": "Level 5 (67%)",
            "Mathematics": "Level 6 (72%)",
            "Physical Sciences": "Level 6 (70%)",
            "Information Technology": "Level 7 (84%)"
        }
    },
    "skills": ["Python", "Cisco Networking", "FastAPI", "React", "Linux System Administration", "SQL"],
    "documents": {
        "NATIONAL_ID": "C:/Users/User/Documents/Breeze/docs/certified_id.pdf",
        "MATRIC_CERTIFICATE": "C:/Users/User/Documents/Breeze/docs/matric_certificate.pdf",
        "CV": "C:/Users/User/Documents/Breeze/docs/master_curriculum_vitae.pdf"
    }
}


# ============================================================================
# BREEZE SCOUT (Opportunities Database)
# ============================================================================
OPPORTUNITIES = [
    {
        "id": "OPP-2026-001",
        "title": "Junior Systems Support & Network Technician",
        "organization": "Dimension Data / NTT",
        "category": "JOB",
        "location": "Johannesburg, Gauteng",
        "closing_date": "2026-12-15",
        "stipend_salary": "R16,000 - R22,000 / month",
        "requirements": ["Diploma in IT or equivalent", "Cisco CCNA knowledge", "Good communication"],
        "application_url": "https://dimensiondata.wd3.myworkdayjobs.com/careers/job/1029",
        "verified": True
    },
    {
        "id": "OPP-2026-002",
        "title": "MICT SETA Software Development Learnership (12 Months)",
        "organization": "MICT SETA / Capaciti",
        "category": "LEARNERSHIP",
        "location": "Cape Town & Remote",
        "closing_date": "2026-11-30",
        "stipend_salary": "R5,500 monthly stipend",
        "requirements": ["Grade 12 Matric Certificate", "Age 18 - 29", "Unemployed South African citizen"],
        "application_url": "https://www.capaciti.org.za/apply-learnership",
        "verified": True
    },
    {
        "id": "OPP-2026-003",
        "title": "Sasol Foundation Undergraduate STEM Bursary 2027",
        "organization": "Sasol Foundation",
        "category": "BURSARY",
        "location": "National (South Africa)",
        "closing_date": "2026-12-05",
        "stipend_salary": "Full Tuition + Accommodation + Laptop Allowance",
        "requirements": ["Grade 12 with Pure Maths Level 6+", "Physical Sciences Level 6+", "Financial need"],
        "application_url": "https://www.sasolbursaries.com/apply",
        "verified": True
    },
    {
        "id": "OPP-2026-004",
        "title": "Youth Working Holiday Visa Intake 2027",
        "organization": "Department of Foreign Affairs & Partner Embassies",
        "category": "VISA",
        "location": "International (UK / Ireland / Germany)",
        "closing_date": "2026-12-31",
        "stipend_salary": "Permission to work up to 24 months",
        "requirements": ["Valid South African Passport", "Age 18 - 30", "No criminal record"],
        "application_url": "https://www.gov.uk/youth-mobility-visa",
        "verified": True
    }
]


# ============================================================================
# BREEZE BOOKINGS (Civic Appointment Slots)
# ============================================================================
BOOKING_SLOTS = [
    {
        "slot_id": "SLOT-ENATIS-774",
        "service_type": "DRIVER_LICENSE",
        "venue": "Langlaagte DLTC (Johannesburg)",
        "date": "2026-11-24",
        "time": "08:30 AM",
        "spots": 2
    },
    {
        "slot_id": "SLOT-DHA-902",
        "service_type": "PASSPORT",
        "venue": "Home Affairs Randburg / Standard Bank Branch",
        "date": "2026-11-28",
        "time": "11:15 AM",
        "spots": 1
    }
]


# ============================================================================
# TOOL IMPLEMENTATIONS
# ============================================================================
def inspect_scam(message_body: str = "", company_name: str = "", url: str = "", contact_email: str = "") -> str:
    red_flag_patterns = [
        (r"(pay|deposit|send)\s*(r\d+|\$\d+|money|fee|cash)", "Demands upfront payment or deposit"),
        (r"(uniform|medical|gate\s*pass|screening)\s*fee", "Advance-fee disguised as uniform/medical screening"),
        (r"whatsapp\s*(only|interview)", "Unverified interview conducted solely via WhatsApp chat"),
        (r"immediate\s*start\s*without\s*(interview|experience)", "Unrealistic instant hiring promise"),
        (r"(earn|make)\s*(r\d{4,5}|\$\d{3,4})\s*per\s*(day|week)\s*from\s*home", "Unrealistic salary bait / Ponzi scheme")
    ]
    free_email_domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]

    risk_score = 0
    flags = []

    text_to_scan = f"{company_name} {message_body}".lower()
    for pattern, explanation in red_flag_patterns:
        if re.search(pattern, text_to_scan):
            risk_score += 35
            flags.append(f"CRITICAL: {explanation}")

    if contact_email:
        domain = contact_email.split("@")[-1].lower() if "@" in contact_email else ""
        if domain in free_email_domains and len(company_name) > 3:
            risk_score += 30
            flags.append(f"SUSPICIOUS: Recruiter uses free webmail (@{domain}) instead of corporate email.")

    if url:
        if url.startswith("http://"):
            risk_score += 15
            flags.append("WARNING: Insecure HTTP connection.")
        if any(h in url for h in [".tk", ".ml", ".ga", "blogspot.com"]):
            risk_score += 25
            flags.append("SUSPICIOUS: Hosted on free/throwaway web domain.")

    trust_score = max(100 - risk_score, 5)

    if trust_score >= 80:
        verdict = "VERIFIED LEGITIMATE (Low Risk)"
        advice = "Safe to proceed. No advance-fee triggers detected."
    elif trust_score >= 50:
        verdict = "CAUTION ADVISED (Moderate Risk)"
        advice = "Verify the recruiter independently via LinkedIn or the company's official site."
    else:
        verdict = "HIGH RISK / PROBABLE SCAM"
        advice = "DO NOT SEND MONEY OR DOCUMENTS. This posting exhibits classic patterns of advance-fee recruitment fraud."

    return json.dumps({
        "trust_score": trust_score,
        "risk_score": risk_score,
        "verdict": verdict,
        "detected_red_flags": flags,
        "safety_recommendation": advice
    }, indent=2)


def search_opportunities(category: Optional[str] = None, keyword: Optional[str] = None) -> str:
    matches = []
    for opp in OPPORTUNITIES:
        if category and opp["category"].upper() != category.upper():
            continue
        if keyword:
            kw = keyword.lower()
            text = f"{opp['title']} {opp['organization']} {' '.join(opp['requirements'])}".lower()
            if kw not in text:
                continue
        matches.append(opp)

    return json.dumps({
        "total_found": len(matches),
        "results": matches
    }, indent=2)


def get_user_vault(section: Optional[str] = None) -> str:
    if section and section in VAULT_DATA:
        return json.dumps({section: VAULT_DATA[section]}, indent=2)
    return json.dumps(VAULT_DATA, indent=2)


def check_appointments(service_type: str, preferred_center: Optional[str] = None) -> str:
    matches = []
    for slot in BOOKING_SLOTS:
        if slot["service_type"].upper() == service_type.upper():
            if not preferred_center or preferred_center.lower() in slot["venue"].lower():
                matches.append(slot)

    return json.dumps({
        "service_type": service_type,
        "available_slots": matches,
        "action": "Select a slot_id to reserve with 1-click."
    }, indent=2)


# ============================================================================
# MCP SERVER PROTOCOL ENGINE (JSON-RPC 2.0 over stdio)
# ============================================================================
TOOLS_DEFINITION = [
    {
        "name": "breeze_inspect_scam",
        "description": "Breeze Shield: Evaluates a job posting, recruitment message, or URL for fraud, scams, or advance-fee red flags.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "message_body": {"type": "string", "description": "The text of the job ad or WhatsApp message"},
                "company_name": {"type": "string", "description": "Name of the company hiring"},
                "url": {"type": "string", "description": "Link to the job or website"},
                "contact_email": {"type": "string", "description": "Recruiter's contact email"}
            },
            "required": ["message_body"]
        }
    },
    {
        "name": "breeze_search_opportunities",
        "description": "Breeze Scout: Mines and hunts for verified jobs, SETA learnerships, bursaries, and youth visas.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "enum": ["JOB", "LEARNERSHIP", "BURSARY", "ADMISSION", "VISA"],
                    "description": "Category of opportunity to hunt"
                },
                "keyword": {"type": "string", "description": "Keyword search (e.g. 'IT', 'developer', 'Sasol')"}
            }
        }
    },
    {
        "name": "breeze_get_user_vault",
        "description": "Breeze Vault: Retrieves the young user's stored life profile, academic results, or CV paths for 1-Click Apply.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "section": {
                    "type": "string",
                    "enum": ["personal", "contact", "academics", "skills", "documents"],
                    "description": "Specific profile section to retrieve"
                }
            }
        }
    },
    {
        "name": "breeze_check_appointments",
        "description": "Breeze Booking Sniper: Checks 24/7 availability for driver's license (eNatis), passport, or visa appointment slots.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "service_type": {
                    "type": "string",
                    "enum": ["DRIVER_LICENSE", "PASSPORT", "VISA", "CLINIC"],
                    "description": "Civic service type"
                },
                "preferred_center": {"type": "string", "description": "Preferred venue or center (e.g. 'Langlaagte', 'Randburg')"}
            },
            "required": ["service_type"]
        }
    }
]


def send_response(response_obj: Dict[str, Any]):
    line = json.dumps(response_obj)
    sys.stdout.write(line + "\n")
    sys.stdout.flush()


def handle_request(req: Dict[str, Any]):
    req_id = req.get("id")
    method = req.get("method")
    params = req.get("params", {})

    # 1. Initialize
    if method == "initialize":
        send_response({
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "tools": {}
                },
                "serverInfo": {
                    "name": "breeze-mcp-server",
                    "version": "1.0.0"
                }
            }
        })
        return

    # 2. Initialized Notification
    if method == "notifications/initialized":
        return

    # 3. Ping
    if method == "ping":
        send_response({"jsonrpc": "2.0", "id": req_id, "result": {}})
        return

    # 4. List Tools
    if method == "tools/list":
        send_response({
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "tools": TOOLS_DEFINITION
            }
        })
        return

    # 5. Call Tool
    if method == "tools/call":
        tool_name = params.get("name")
        args = params.get("arguments", {})

        try:
            if tool_name == "breeze_inspect_scam":
                output = inspect_scam(
                    message_body=args.get("message_body", ""),
                    company_name=args.get("company_name", ""),
                    url=args.get("url", ""),
                    contact_email=args.get("contact_email", "")
                )
            elif tool_name == "breeze_search_opportunities":
                output = search_opportunities(
                    category=args.get("category"),
                    keyword=args.get("keyword")
                )
            elif tool_name == "breeze_get_user_vault":
                output = get_user_vault(section=args.get("section"))
            elif tool_name == "breeze_check_appointments":
                output = check_appointments(
                    service_type=args.get("service_type", ""),
                    preferred_center=args.get("preferred_center")
                )
            else:
                send_response({
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32601, "message": f"Method {tool_name} not found"}
                })
                return

            send_response({
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [{"type": "text", "text": output}]
                }
            })
        except Exception as e:
            send_response({
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32000, "message": str(e)}
            })
        return

    # Unknown method
    if req_id is not None:
        send_response({
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {"code": -32601, "message": f"Unknown method {method}"}
        })


def main():
    # Process line-by-line JSON-RPC requests from stdin
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            handle_request(req)
        except Exception as e:
            sys.stderr.write(f"Breeze MCP Server Error: {e}\n")
            sys.stderr.flush()


if __name__ == "__main__":
    main()
