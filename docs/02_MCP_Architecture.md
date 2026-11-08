# 02: Model Context Protocol (MCP) Architecture Specification

## 1. What is Model Context Protocol (MCP)?
Model Context Protocol is an open standard introduced by Anthropic that standardizes how AI applications connect with external data sources, tools, and environments. 

Rather than hard-coding brittle integrations inside prompt wrappers, MCP introduces a clean **Client-Server Architecture**:
* **MCP Host:** The AI interface (e.g., Breeze Agent runtime).
* **MCP Client:** The protocol consumer that maintains 1:1 connections with MCP Servers.
* **MCP Server:** A lightweight, specialized program that exposes **Tools**, **Resources**, and **Prompts** via JSON-RPC 2.0 over `stdio` or `Server-Sent Events (SSE)`.

---

## 2. Breeze MCP Topology

```
+-------------------------------------------------------------------------+
|                              BREEZE CLIENT                              |
|                    (Mobile PWA / WhatsApp Bot Gateway)                  |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                           BREEZE ORCHESTRATOR                           |
|                  (Claude 3.5 Sonnet / Gemini 1.5 Flash)                 |
|                             [MCP HOST RUNTIME]                          |
+----+--------------------+--------------------+--------------------+-----+
     |                    |                    |                    |
     | (JSON-RPC)         | (JSON-RPC)         | (JSON-RPC)         | (JSON-RPC)
     v                    v                    v                    v
+----+-----------+  +----+-----------+  +----+-----------+  +----+-----------+
| breeze-vault   |  | breeze-scout   |  | breeze-apply   |  | breeze-shield  |
|  (MCP Server)  |  |  (MCP Server)  |  |  (MCP Server)  |  |  (MCP Server)  |
|                |  |                |  |                |  |                |
| - get_profile  |  | - hunt_jobs    |  | - scan_form    |  | - check_domain |
| - get_cv_data  |  | - hunt_bursary |  | - fill_inputs  |  | - verify_cipc  |
| - get_docs_path|  | - track_intakes|  | - submit_form  |  | - detect_scam  |
+----------------+  +----------------+  +----------------+  +----------------+
```

---

## 3. Protocol Definitions & Tools Specification

### A. `breeze-vault-mcp`
* **Purpose:** Provides secure, zero-knowledge read access to the user's local personal profile, identity documents, and academic history.
* **Tools Exposed:**
  ```json
  {
    "name": "get_full_profile",
    "description": "Retrieves the user's demographic, contact, and identity profile for form mapping.",
    "inputSchema": { "type": "object", "properties": {} }
  }
  ```
  ```json
  {
    "name": "get_document_attachment",
    "description": "Returns absolute local path of verified PDF documents (ID, Matric, CV).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "document_type": { "type": "string", "enum": ["NATIONAL_ID", "MATRIC_CERTIFICATE", "CV", "TRANSCRIPT"] }
      },
      "required": ["document_type"]
    }
  }
  ```

### B. `breeze-scout-mcp`
* **Purpose:** Queries live opportunities across jobs, learnerships, and bursaries.
* **Tools Exposed:**
  ```json
  {
    "name": "search_opportunities",
    "description": "Hunts for opportunities matching category, qualifications, and location.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "category": { "type": "string", "enum": ["JOB", "LEARNERSHIP", "BURSARY", "ADMISSION", "VISA"] },
        "keywords": { "type": "array", "items": { "type": "string" } },
        "location": { "type": "string" }
      },
      "required": ["category"]
    }
  }
  ```

### C. `breeze-shield-mcp`
* **Purpose:** Evaluates recruiters, URLs, and messages for fraudulent intent.
* **Tools Exposed:**
  ```json
  {
    "name": "inspect_opportunity_trust",
    "description": "Runs forensic legitimacy analysis on a company, URL, or recruitment message.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "url": { "type": "string" },
        "company_name": { "type": "string" },
        "message_body": { "type": "string" }
      }
    }
  }
  ```

---

## 4. Privacy & Zero-Knowledge Security
* All personal data residing in `breeze-vault-mcp` is stored on the user's local device, encrypted with AES-256 via SQLCipher.
* The orchestrator only queries the vault when a user grants explicit permission to apply for a verified opportunity.
* Raw user identity documents are never transmitted to third-party AI training pipelines.

