# Breeze Mobile App — Qatar Airways Executive Edition ✈️

> **The World-Class Youth Career Concierge & 1-Click Boarding Pass Platform.**  
> Designed with the luxurious visual identity, whisper-quiet elegance, and tactile polish of the award-winning **Qatar Airways Mobile App**.

---

## 💎 Design Philosophy & Aesthetic System

Breeze Mobile brings the opulent refinement of Qatar Airways First Class and the Privilege Club to youth life navigation:

- **Signature Palette**:
  - **Oryx Burgundy** (`#5C0632` / `#3B021F`): The iconic royal maroon base.
  - **Champagne Gold** (`#C5A059` / `#D4AF37` / `#E5C378`): Metallic accents, active states, and ATS match highlights.
  - **Deep Obsidian** (`#0F1015` / `#181A22`): Ultra-deep luxury contrast background.
- **Flight Ticket Architecture**:
  - Opportunities are styled as **First Class Boarding Passes** with authentic perforated tear lines (`JHB ➔ DIMENSION DATA`).
  - 1-Click apply triggers an instant **Boarding Pass Issuance** flow.
- **Privilege Club Vault**:
  - Stored youth credentials (Matric, ID, Degree, CV) are presented on a digital **Platinum Privilege Club Card** with embossed metallic finish and barcode verification.
- **Border Security Scam Shield**:
  - Biometric-grade passport scanning to intercept advance-fee scams, unverified WhatsApp interviews, and fake uniform charges.
- **Qatar Duty Free Price Sniffer**:
  - Executive deal concierges comparing Takealot, Amazon SA, and Makro with 90-day market benchmarks.

---

## 📱 Quick Start

### 1. Prerequisites
Ensure you have Node.js 18+ installed on your computer.

### 2. Install Dependencies
```bash
cd apps/mobile
npm install
```

### 3. Start Expo Development Server
```bash
npx expo start
```

- **Run on your real phone**: Scan the QR code displayed in the terminal using the **Expo Go** app on your iPhone or Android.
- **Run in Android Emulator**: Press `a` in the terminal.
- **Run in iOS Simulator** (macOS): Press `i` in the terminal.
- **Run in Mobile Web Browser**: Press `w` in the terminal to launch the web version.

---

## 🔗 Connection to Breeze MCP REST Server
Breeze Mobile communicates directly with the local Breeze server running at `http://127.0.0.1:8765` (or `http://10.0.2.2:8765` inside Android Emulator), pulling live curated opportunities, live web mining, ATS scores, and booking slots.

