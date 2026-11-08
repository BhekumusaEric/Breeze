"""
Breeze Shield MCP Server (packages/breeze-shield-mcp/server.py)
Scam Detection, Domain Forensics & Recruiter Due-Diligence
Part of the Breeze Life Co-Pilot Ecosystem
"""

import json
import re
from typing import Dict, Any, List


class BreezeShieldServer:
    """
    Evaluates recruitment opportunities, URLs, and messages
    to protect young job seekers from advance-fee fraud and phishing.
    """

    RED_FLAG_PATTERNS = [
        (r"(pay|deposit|send)\s*(r\d+|\$\d+|money|fee|cash)", "Demands upfront payment/deposit"),
        (r"(uniform|medical|gate\s*pass|screening)\s*fee", "Advance-fee disguised as uniform or medical screening"),
        (r"whatsapp\s*(only|interview)", "Unverified interview conducted solely via WhatsApp chat"),
        (r"immediate\s*start\s*without\s*(interview|experience)", "Unrealistic instant hiring claim"),
        (r"(earn|make)\s*(r\d{4,5}|\$\d{3,4})\s*per\s*(day|week)\s*from\s*home", "Unrealistic salary bait / Ponzi scheme")
    ]

    FREE_EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"]

    def inspect_opportunity_trust(self, url: str = "", company_name: str = "", message_body: str = "", contact_email: str = "") -> Dict[str, Any]:
        risk_score = 0  # 0 to 100 (Higher means riskier)
        detected_flags: List[str] = []

        # 1. Check message body for Advance-Fee triggers
        text_to_scan = f"{company_name} {message_body}".lower()
        for pattern, explanation in self.RED_FLAG_PATTERNS:
            if re.search(pattern, text_to_scan):
                risk_score += 35
                detected_flags.append(f"CRITICAL: {explanation}")

        # 2. Check for free email domain impersonation
        if contact_email:
            domain = contact_email.split("@")[-1].lower() if "@" in contact_email else ""
            if domain in self.FREE_EMAIL_DOMAINS and len(company_name) > 3:
                # If they claim to be a major company but use @gmail.com
                risk_score += 30
                detected_flags.append(f"SUSPICIOUS: Recruiter uses free webmail (@{domain}) instead of corporate domain.")

        # 3. Check URL characteristics
        if url:
            if url.startswith("http://"):
                risk_score += 15
                detected_flags.append("WARNING: Insecure HTTP connection (no SSL encryption).")
            if any(free_host in url for free_host in [".tk", ".ml", ".ga", "blogspot.com", "wixsite.com"]):
                risk_score += 25
                detected_flags.append("SUSPICIOUS: Hosted on free/throwaway web domain.")

        # Calculate Trust Score (Inverted Risk)
        trust_score = max(100 - risk_score, 5)

        if trust_score >= 80:
            verdict = "VERIFIED LEGITIMATE (Low Risk)"
            recommendation = "Safe to proceed with application. No advance-fee triggers detected."
        elif trust_score >= 50:
            verdict = "CAUTION ADVISED (Moderate Risk)"
            recommendation = "Verify the recruiter independently via LinkedIn or the company's official careers site."
        else:
            verdict = "HIGH RISK / PROBABLE SCAM"
            recommendation = "DO NOT SEND MONEY OR DOCUMENTS. This posting exhibits classic patterns of advance-fee recruitment fraud."

        return {
            "trust_score": trust_score,
            "risk_score": risk_score,
            "verdict": verdict,
            "detected_red_flags": detected_flags,
            "safety_recommendation": recommendation
        }


if __name__ == "__main__":
    shield = BreezeShieldServer()
    print("=== Breeze Shield MCP Server Online ===")
    
    sample_scam = (
        "Congratulations! You are shortlisted for the Admin Clerk vacancy at Anglo American. "
        "Please bring R350 for uniform fee and medical screening before tomorrow morning. "
        "Contact HR via WhatsApp only on 0721234567."
    )
    
    result = shield.inspect_opportunity_trust(
        company_name="Anglo American",
        message_body=sample_scam,
        contact_email="angloamerican.recruitment@gmail.com"
    )
    print(json.dumps(result, indent=2))
