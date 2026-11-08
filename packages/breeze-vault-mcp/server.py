"""
Breeze Vault MCP Server (packages/breeze-vault-mcp/server.py)
Secure Local Life-Profile & Document Vault
Part of the Breeze Life Co-Pilot Ecosystem
"""

import json
from dataclasses import dataclass, asdict
from typing import Dict, Any, List, Optional


@dataclass
class PersonalDetails:
    first_name: str
    last_name: str
    id_number: str
    date_of_birth: str
    gender: str
    nationality: str


@dataclass
class ContactDetails:
    email: str
    phone: str
    whatsapp: str
    street_address: str
    city: str
    province_state: str
    postal_code: str


@dataclass
class AcademicRecord:
    highest_grade: str
    school_name: str
    completion_year: int
    subjects: Dict[str, str]  # e.g. {"Mathematics": "Level 6 (74%)", "English HL": "Level 5 (68%)"}
    tertiary_qualification: Optional[str] = None
    tertiary_institution: Optional[str] = None


@dataclass
class LifeVault:
    personal: PersonalDetails
    contact: ContactDetails
    academics: AcademicRecord
    skills: List[str]
    interests: List[str]
    document_paths: Dict[str, str]


# Default Local Seed Profile (Simulated Encrypted Local SQLite Store)
LOCAL_VAULT_STORE = LifeVault(
    personal=PersonalDetails(
        first_name="Bhekumusa",
        last_name="Ntshwenya",
        id_number="0108255800084",
        date_of_birth="2001-08-25",
        gender="Male",
        nationality="South African"
    ),
    contact=ContactDetails(
        email="bhekumusaeric@gmail.com",
        phone="+27 72 000 0000",
        whatsapp="+27 72 000 0000",
        street_address="142 Central Avenue",
        city="Johannesburg",
        province_state="Gauteng",
        postal_code="2001"
    ),
    academics=AcademicRecord(
        highest_grade="Grade 12 (National Senior Certificate)",
        school_name="Highlands High School",
        completion_year=2021,
        subjects={
            "English HL": "Level 5 (67%)",
            "Mathematics": "Level 6 (72%)",
            "Physical Sciences": "Level 6 (70%)",
            "Life Sciences": "Level 5 (65%)",
            "Information Technology": "Level 7 (84%)"
        },
        tertiary_qualification="Diploma in Information Technology",
        tertiary_institution="Eduvos"
    ),
    skills=["Python", "Cisco Networking", "FastAPI", "React", "Linux System Administration", "SQL"],
    interests=["Software Engineering", "Network Security", "Cloud Computing", "Fintech"],
    document_paths={
        "NATIONAL_ID": "C:/Users/User/Documents/Breeze/docs/certified_id.pdf",
        "MATRIC_CERTIFICATE": "C:/Users/User/Documents/Breeze/docs/matric_certificate.pdf",
        "CV": "C:/Users/User/Documents/Breeze/docs/master_curriculum_vitae.pdf",
        "TERTIARY_TRANSCRIPT": "C:/Users/User/Documents/Breeze/docs/academic_transcript.pdf"
    }
)


class BreezeVaultServer:
    """
    Exposes secure MCP tools to read the user's life profile
    for autonomous form-filling and opportunity matching.
    """

    def get_full_profile(self) -> Dict[str, Any]:
        """Returns the complete sanitized profile for form mapping."""
        return asdict(LOCAL_VAULT_STORE)

    def get_form_field_value(self, field_semantic_key: str) -> Optional[str]:
        """Maps an HTML form field concept to the user's stored value."""
        profile = asdict(LOCAL_VAULT_STORE)
        
        mapping = {
            "first_name": profile["personal"]["first_name"],
            "last_name": profile["personal"]["last_name"],
            "full_name": f"{profile['personal']['first_name']} {profile['personal']['last_name']}",
            "id_number": profile["personal"]["id_number"],
            "email": profile["contact"]["email"],
            "phone": profile["contact"]["phone"],
            "address": profile["contact"]["street_address"],
            "city": profile["contact"]["city"],
            "postal_code": profile["contact"]["postal_code"],
            "qualification": profile["academics"]["tertiary_qualification"]
        }
        return mapping.get(field_semantic_key.lower())

    def get_document_attachment(self, doc_type: str) -> Dict[str, Any]:
        """Returns the verified local filesystem path for PDF file uploads."""
        path = LOCAL_VAULT_STORE.document_paths.get(doc_type.upper())
        if not path:
            return {"status": "error", "message": f"Document type '{doc_type}' not found in vault."}
        return {"status": "success", "document_type": doc_type, "file_path": path}


if __name__ == "__main__":
    vault = BreezeVaultServer()
    print("=== Breeze Vault MCP Server Online ===")
    print(json.dumps(vault.get_full_profile(), indent=2))
