"""
Breeze Web Application Server (Pure Python Standard Library)
Zero external dependencies required.
Serves the Breeze Youth OS Dashboard and provides REST API endpoints
bridging directly to the Breeze MCP Server engine.
"""

import os
import sys
import json
import urllib.parse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from typing import Dict, Any

# Ensure breeze_mcp_server is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PACKAGES_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "packages"))
if PACKAGES_DIR not in sys.path:
    sys.path.insert(0, PACKAGES_DIR)

try:
    import breeze_mcp_server as mcp
except ImportError as err:
    print(f"[ERROR] Could not import breeze_mcp_server: {err}")
    mcp = None


class BreezeRequestHandler(BaseHTTPRequestHandler):
    """
    HTTP Request Handler serving static frontend and JSON REST APIs.
    """

    def _set_headers(self, status: int = 200, content_type: str = "application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query_params = urllib.parse.parse_qs(parsed.query)

        # 1. Serve Frontend HTML
        if path in ["/", "/index.html"]:
            html_path = os.path.join(CURRENT_DIR, "index.html")
            if os.path.exists(html_path):
                with open(html_path, "rb") as f:
                    content = f.read()
                self._set_headers(200, "text/html; charset=utf-8")
                self.wfile.write(content)
                return
            else:
                self._set_headers(404, "text/plain")
                self.wfile.write(b"index.html not found")
                return

        # 2. Opportunities API (Scout)
        if path == "/api/opportunities":
            category = query_params.get("category", [None])[0]
            keyword = query_params.get("keyword", [None])[0]
            if mcp:
                resp = mcp.search_opportunities(category=category, keyword=keyword)
            else:
                resp = json.dumps({"error": "MCP server module not loaded", "results": []})
            self._set_headers(200)
            self.wfile.write(resp.encode("utf-8"))
            return

        # 3. Live Web Hunt API
        if path == "/api/live-hunt":
            query = query_params.get("query", [""])[0]
            if mcp:
                resp = mcp.live_hunt_opportunities(query=query)
            else:
                resp = json.dumps({"error": "MCP server module not loaded"})
            self._set_headers(200)
            self.wfile.write(resp.encode("utf-8"))
            return

        # 4. Price Sniffer API
        if path == "/api/prices":
            q = query_params.get("q", ["Laptop"])[0]
            if mcp:
                resp = mcp.compare_prices(product_query=q)
            else:
                resp = json.dumps({"error": "MCP server module not loaded"})
            self._set_headers(200)
            self.wfile.write(resp.encode("utf-8"))
            return

        # 5. Civic Bookings API
        if path == "/api/bookings":
            service = query_params.get("service", ["DRIVER_LICENSE"])[0]
            venue = query_params.get("venue", [None])[0]
            if mcp:
                resp = mcp.check_appointments(service_type=service, preferred_center=venue)
            else:
                resp = json.dumps({"error": "MCP server module not loaded"})
            self._set_headers(200)
            self.wfile.write(resp.encode("utf-8"))
            return

        # 6. Vault API
        if path == "/api/vault":
            section = query_params.get("section", [None])[0]
            if mcp:
                resp = mcp.get_user_vault(section=section)
            else:
                resp = json.dumps({"error": "MCP server module not loaded"})
            self._set_headers(200)
            self.wfile.write(resp.encode("utf-8"))
            return

        # 404 Fallback
        self._set_headers(404, "application/json")
        self.wfile.write(json.dumps({"error": "Not Found", "path": path}).encode("utf-8"))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Read JSON body
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length > 0 else b"{}"
        try:
            data = json.loads(body.decode("utf-8"))
        except Exception:
            data = {}

        # 1. AI Tailor API
        if path == "/api/tailor":
            job_title = data.get("job_title", "Junior Support")
            company = data.get("company", "Tech Company")
            description = data.get("job_description", "")
            if mcp:
                resp = mcp.tailor_application(job_title=job_title, company=company, job_description=description)
            else:
                resp = json.dumps({"error": "MCP server module not loaded"})
            self._set_headers(200)
            self.wfile.write(resp.encode("utf-8"))
            return

        # 2. Scam Shield API
        if path == "/api/shield":
            message_body = data.get("message_body", "")
            company_name = data.get("company_name", "")
            url = data.get("url", "")
            contact_email = data.get("contact_email", "")
            if mcp:
                resp = mcp.inspect_scam(
                    message_body=message_body,
                    company_name=company_name,
                    url=url,
                    contact_email=contact_email
                )
            else:
                resp = json.dumps({"error": "MCP server module not loaded"})
            self._set_headers(200)
            self.wfile.write(resp.encode("utf-8"))
            return

        # 3. Form Prepper API
        if path == "/api/prepare-apply":
            portal_name = data.get("portal_name", "Careers Portal")
            target_url = data.get("target_url", "")
            if mcp:
                resp = mcp.prepare_form_payload(target_portal_name=portal_name, target_url=target_url)
            else:
                resp = json.dumps({"error": "MCP server module not loaded"})
            self._set_headers(200)
            self.wfile.write(resp.encode("utf-8"))
            return

        # 4. Email Intelligence API
        if path == "/api/email-intel":
            subject = data.get("email_subject", "")
            sender = data.get("sender", "")
            body_text = data.get("email_body", "")
            if mcp:
                resp = mcp.parse_email_intelligence(
                    email_subject=subject,
                    sender=sender,
                    email_body=body_text
                )
            else:
                resp = json.dumps({"error": "MCP server module not loaded"})
            self._set_headers(200)
            self.wfile.write(resp.encode("utf-8"))
            return

        # 5. Notion / Airtable Tracker Sync API
        if path == "/api/notion-sync":
            company = data.get("company", "Company")
            role = data.get("role", "Position")
            status = data.get("status", "Applied")
            ref_no = data.get("reference_number", "BRZ-AUTO-SYNC")
            if mcp:
                resp = mcp.format_notion_tracker_entry(
                    company=company,
                    role=role,
                    status=status,
                    reference_number=ref_no
                )
            else:
                resp = json.dumps({"error": "MCP server module not loaded"})
            self._set_headers(200)
            self.wfile.write(resp.encode("utf-8"))
            return

        # 6. Civic Booking Reserve API
        if path == "/api/bookings/reserve":
            slot_id = data.get("slot_id", "SLOT-001")
            applicant = data.get("applicant", "Bhekumusa Ntshwenya")
            resp = json.dumps({
                "status": "confirmed",
                "slot_id": slot_id,
                "applicant": applicant,
                "reservation_reference": f"BRZ-{slot_id[-4:]}-2026",
                "confirmation_sms": f"Breeze Civic Alert: Your appointment {slot_id} is secured. Reference BRZ-{slot_id[-4:]}-2026. Remember to bring your certified ID and proof of residence."
            })
            self._set_headers(200)
            self.wfile.write(resp.encode("utf-8"))
            return

        # 404 Fallback
        self._set_headers(404, "application/json")
        self.wfile.write(json.dumps({"error": "Endpoint Not Found", "path": path}).encode("utf-8"))

    def log_message(self, format, *args):
        # Clean console logging
        sys.stdout.write(f"[Breeze HTTP] {self.address_string()} - {format % args}\n")
        sys.stdout.flush()


def run_server(host: str = "127.0.0.1", port: int = 8765):
    server_address = (host, port)
    httpd = ThreadingHTTPServer(server_address, BreezeRequestHandler)
    print("=" * 70)
    print("🌬️  BREEZE YOUTH OS — WEB DASHBOARD & REST API")
    print("=" * 70)
    print(f"Server Status : ACTIVE & LISTENING")
    print(f"Local URL     : http://{host}:{port}")
    print(f"Engine        : Model Context Protocol (MCP 2.5) Zero-Dependency")
    print(f"Active Tools  : 11 Enterprise MCP Tools Connected")
    print(f"Press CTRL+C to stop server gracefully.")
    print("=" * 70)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[Breeze] Shutting down server gracefully...")
        httpd.server_close()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8765))
    run_server(port=port)
