# 01: Product Vision & Feature Scope
## Breeze: The Young Person's Life Starter Pack

---

## 1. The Core Philosophy
A young person stepping into adulthood faces a massive cliff of administrative complexity. At age 18 to 28, they must simultaneously navigate:
* Applying to universities, colleges, and TVETs.
* Securing funding, NSFAS, bursaries, and student loans.
* Getting their learner's and driver's license.
* Hunting for internships, graduate programs, and learnerships.
* Booking passport appointments, visa applications, and health screenings.
* Furnishing a student room or first flat on an ultra-tight budget.

**Breeze is designed as the ultimate "Life Starter Pack"**—a centralized, privacy-first companion that sits between the young person and the messy, fragmented internet.

---

## 2. Target User Personas

### Persona A: "The High School Leaver / Matriculant"
* **Name:** Lerato (18 years old)
* **Goal:** Needs to apply to 4 universities, 2 TVETs, and NSFAS.
* **Pain Point:** Has to create 7 accounts, upload certified copies of her ID and Grade 11/12 report cards repeatedly, and is anxious about missing admission cutoffs.
* **How Breeze Saves Her:** Lerato scans her report card and ID into `breeze-vault-mcp`. She selects 4 universities, and Breeze auto-fills all 4 portals in 3 minutes, tracks application statuses, and alerts her the moment NSFAS bursary windows open.

### Persona B: "The Unemployed Graduate / Job Hunter"
* **Name:** Sipho (23 years old)
* **Goal:** Looking for a junior developer or IT support role or a SETA learnership.
* **Pain Point:** Fills out 20 Workday job applications a week, receives rejection emails or no responses, and gets suspicious WhatsApp messages asking for R300 "interview medical check" fees.
* **How Breeze Saves Him:** Breeze's Radar monitors tech portals and learnership databases daily. Breeze's 1-Click Form Engine tailors his CV to match job requirements, auto-fills application forms, and its Scam Shield instantly alerts Sipho when a recruiter is fraudulent.

### Persona C: "The Bureaucracy Stranded"
* **Name:** David (21 years old)
* **Goal:** Needs to book a driver's license renewal and an international visa appointment for an exchange scholarship.
* **Pain Point:** eNatis and visa appointment portals show "No Slots Available" for months, with openings disappearing in 90 seconds.
* **How Breeze Saves Him:** Breeze runs a lightweight 24/7 sniper background worker. When an appointment slot opens in his chosen testing center, Breeze reserves it and sends a WhatsApp confirmation with a 1-tap payment link.

---

## 3. Comprehensive Feature Matrix

| Pillar | Sub-Feature | Description | Technical Implementation |
| :--- | :--- | :--- | :--- |
| **Radar** | **SETA Learnership Aggregator** | Scans all 21 SETAs in South Africa for active learnership intakes. | Web Crawler + Semantic Parser MCP |
| | **University Cutoff Radar** | Tracks registration windows across public universities & TVETs. | RSS / Scheduled Scraper MCP |
| | **Grant & Bursary Matcher** | Matches student demographics and academic marks against private bursary funds. | Vector Search / Embedding Matcher |
| | **Visa & Scholarship Watcher** | Tracks working holiday visas, Erasmus, DAAD, and Chevening scholarship deadlines. | Scheduled API Watcher |
| **1-Click Apply** | **Universal Form Field Mapper** | Intelligently identifies name, ID, phone, address, and academic inputs on any HTML form. | Computer Vision / DOM Analysis via LLM |
| | **Auto Document Attacher** | Uploads certified PDFs of ID, matric results, and CVs directly into file upload fields. | Headless Playwright Agent |
| | **Dynamic Cover Letter Generator** | Synthesizes user experience with job requirements to generate tailored, authentic cover letters. | Few-Shot LLM Prompt Engine |
| **Bookings** | **Driver's License Slot Sniper** | Monitors eNatis for driver's and learner's license appointment openings. | Periodic Headless Session Watcher |
| | **Home Affairs / Passport Sniper** | Watches BHA appointment system for smart ID and passport slots. | Slot Availability Poller |
| | **Visa Appointment Watcher** | Monitors VFS Global / embassy appointment calendars for cancellations. | Authenticated Session Keep-Alive Worker |
| **Shield** | **CIPC Company Verification** | Verifies company registration number, legal directors, and physical address. | South African CIPC API / Scraper |
| | **Domain Age & Fraud Check** | Checks domain registration date and checks fraud blacklists (ScamAdviser/Trustpilot). | WHOIS + Threat Intelligence MCP |
| | **Advance-Fee Scam Detector** | Scans messages/emails for fee demands (e.g. "Pay R200 for gate pass"). | NLP Intent & Red-Flag Classifier |
| **Deals** | **Student Tech Price Tracker** | Tracks laptops, phones, and peripherals across Takealot, Amazon SA, and Makro. | Price Scraping & History MCP |
| | **Unadvertised Student Discount Unlocker** | Catalogs student deals (Spotify, Apple Education, GitHub Student Pack). | Curated Resource Server |
