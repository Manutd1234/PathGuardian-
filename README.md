# PathGuardian 🛡️

**Adaptive Navigation & Location Intelligence for Individuals with Special Needs**

---

## Problem Statement

> **Women in Tech — Problem Statement 1 (#19)**

Individuals with special needs often face persistent barriers to communication, education, mobility, and daily independence due to limited access to inclusive technologies and support systems. These challenges are further intensified for people who rely on sign language, especially those using diverse sign language dialects, where existing solutions frequently fail to account for regional variations, non-standardized gestures, and contextual nuances. As a result, many individuals remain socially isolated, face difficulties accessing essential services, and experience reduced opportunities for learning, employment, and community participation.

Current assistive technologies often focus on single-modality solutions (e.g., speech-to-text, basic sign recognition, or simple navigation aids), which do not fully address the complex and multi-layered needs of users with disabilities. The fragmentation of these tools and the lack of multimodal integration limit their real-world effectiveness and scalability.

**PathGuardian** addresses this challenge by providing an **adaptive, multimodal navigation and location intelligence system** that combines vision (map-based guidance), audio (ambient environment detection), text (simplified UI), and AI-driven context awareness into a cohesive system. It adapts to individual needs — empowering seniors and individuals with disabilities to navigate independently while keeping caregivers informed and reassured.

---

## What PathGuardian Solves

| Challenge | How PathGuardian Addresses It |
|-----------|-------------------------------|
| **Mobility barriers** | Safety-first routing with landmark-based navigation, large UI, voice input |
| **Social isolation** | Enables independent outings with caregiver confidence |
| **Fragmented tools** | Single app combines navigation, tracking, alerts, check-ins, and ambient sensing |
| **Caregiver anxiety** | Real-time dashboard with proactive alerts and one-tap check-in |
| **Privacy concerns** | "Private Time" toggle lets users pause tracking when desired |
| **Battery drain** | Adaptive GPS polling — slower updates when stationary |
| **Environmental awareness** | Microphone-based ambient sound analysis detects surroundings (park, mall, street) |

---

## Key Features

### 🧭 Adaptive Navigation (Senior / Care Recipient)
- **Safety-First Routing** — Prioritizes sidewalks and well-lit areas over speed
- **Simplified Interface** — High-contrast, large buttons (>44px touch targets), senior-friendly
- **Voice Input** — Simulated voice command for destination entry
- **Text Destination Input** — Type any known location (museum, pharmacy, park, etc.) and press Enter
- **Red Destination Marker** — Visual red dot on the map showing the end destination
- **Turn-by-Turn Navigation** — Real-time directional guidance overlay
- **Privacy Controls** — "Private Time" toggle pauses location sharing
- **🎙️ Ambient Environment Detection** — Uses real microphone to analyze surroundings and classify environment (Quiet Park 🌳, Busy Street 🚗, Shopping Area 🛍️, etc.)

### 📊 Caregiver Dashboard
- **Live Map Tracking** — Real-time location with smooth GPS simulation
- **Proactive Alerts** — Deviation detection, arrival/departure notifications
- **🔔 Multi-Person Alert Log** — Consolidated alerts from multiple care recipients (Margaret, Robert, Helen, James) with severity filtering (High/Medium/Low/Info)
- **👋 Big Check-In Notification** — Full-screen animated overlay showing "Check-In Sent!" and the reply in large fonts
- **🕒 Journey History** — Timeline of past journeys and alerts with day grouping and filtering
- **One-Tap Check-In** — Send a gentle "Are you okay?" prompt

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | HTML5 (Semantic) |
| **Styling** | CSS3 (Custom Properties, Flexbox, Grid, Animations) |
| **Logic** | JavaScript ES6+ (Classes, Async/Await, Web APIs) |
| **Mapping** | Leaflet.js + OpenStreetMap (no API key required) |
| **Audio Analysis** | Web Audio API (FFT frequency analysis, real microphone) |
| **Fonts** | Google Fonts (Outfit) |
| **Simulation** | Custom GPS movement engine with adaptive polling |

---

## Project Structure

```
PathGuardian/
├── index.html           # Landing page — role selection
├── navigation.html      # Senior navigation interface
├── dashboard.html       # Caregiver monitoring dashboard
├── css/
│   └── style.css        # Global design system
├── js/
│   ├── app.js           # Core application logic + location database
│   ├── map.js           # Leaflet.js map controller (blue user + red destination markers)
│   ├── simulation.js    # GPS movement simulation engine
│   └── ambient.js       # Ambient sound environment analyzer (Web Audio API)
├── README.md            # This file
├── PRD.md               # Product Requirements Document
├── TASK.md              # Development task tracker
└── WORKFLOW.md          # Technical workflow & architecture
```

---

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Manutd1234/PathGuardian-.git
   cd PathGuardian-
   ```

2. **Open in browser:**
   - Open `index.html` in any modern browser (Chrome, Edge, Firefox)
   - No build step, no dependencies to install, no API keys needed

3. **Choose your role:**
   - 🧓 **Care Recipient** → Navigation interface with voice input, ambient detection
   - 👨‍👩‍👦 **Caregiver** → Dashboard with live tracking, alerts, history

4. **Test the destination input:**
   - Type `museum`, `pharmacy`, `cafe`, `hospital`, `park`, or `home` → Press Enter
   - A red destination dot appears on the map and navigation begins

5. **Test ambient sound detection:**
   - Click "Start Listening" on the navigation page
   - Allow microphone access — the panel shows your real environment classification

---

## Demo Walkthrough

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Open `index.html`, click "Care Recipient" | Opens navigation page |
| 2 | Type `cafe` in "Where to?" and press Enter | Red dot appears, route draws, simulation starts |
| 3 | Click "Start Listening" on environment panel | Microphone activates, shows environment (🌳/🚗/🛍️) |
| 4 | Go back, click "Caregiver" | Opens dashboard with live map |
| 5 | Click "👋 Check-In" | Big overlay: "Check-In Sent!" → 3s → "Reply Received!" |
| 6 | Click "⚙️ Alerts" | Alert log with 4 people, severity-coded, filterable |
| 7 | Click "🕒 History" | Journey history timeline grouped by day |

---

## Team

Built for the **Women in Tech Hackathon** — Problem Statement 1 (#19)

---

## License

MIT License — Free to use, modify, and distribute.
