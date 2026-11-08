# 05: Automated Bookings & Bureaucracy Sniper (`breeze-booking-mcp`)

## 1. Problem Statement
Securing appointment slots for essential civic and government services is a major barrier for youth:
* **Driver's & Learner's Licenses (eNatis):** Testing slots disappear in seconds or open at unpredictable hours.
* **Smart IDs & Passports (Home Affairs):** Branch calendars show fully booked statuses for 6+ months.
* **Visa Interviews (VFS Global / Embassies):** Youth accepted into exchange programs or foreign internships miss cutoff dates due to lack of interview appointment slots.

---

## 2. The 24/7 Sniper Architecture

```mermaid
flowchart TD
    User([User: Selects Preferred Testing Centers & Date Range]) --> Vault[breeze-vault-mcp]
    Vault --> Sniper[breeze-booking-mcp Worker]
    
    subgraph "Continuous Headless Poller"
        Sniper --> Poller[Poller Worker Loop]
        Poller -->|Check Slot Availability| Portal[Target Appointment System]
        Portal -->>|No Slots| Poller
        Portal -->>|Slot Available!| SnipeLock[Execute Rapid Hold / Slot Reservation]
    end

    SnipeLock --> Notifier[Breeze WhatsApp Notifier]
    Notifier --> UserPhone([WhatsApp: Alert Sent with 15-Minute Expiry])
    UserPhone -->|User taps 'Confirm'| Finalize[Finalize Booking Confirmation]
```

---

## 3. Supported Appointment Systems

| Service | Target Platform | Polling Strategy | Sniping SLA |
| :--- | :--- | :--- | :--- |
| **Learner's & Driver's License** | eNatis / RTMC (South Africa) | Periodic randomized polling (jittered to avoid rate-limits) | Reserve within 4 seconds of slot release |
| **Passports & Smart IDs** | BHA Appointment System | Checks early morning cancellations across user's top 3 branches | Reserve within 8 seconds |
| **International Visas** | VFS Global / TLScontact | Authenticated session keep-alive with automated CAPTCHA alerts | Instant provisional hold |
| **Clinic / Primary Healthcare** | Local municipal clinic booking apps | Daily batch check | Scheduled automatically |

---

## 4. Ethical & Fair Usage Safeguards
* **Anti-Scalping Rule:** Breeze strictly reserves appointments under the authenticated legal identity of the student user. It cannot be used by middlemen or brokers to hoard and resell slots.
* **One Booking per Service:** The system enforces a strict rule of 1 active booking per civic service per user.
