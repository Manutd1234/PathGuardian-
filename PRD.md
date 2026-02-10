# Product Requirements Document (PRD) — PathGuardian

## 1. Problem Statement

> **Women in Tech Hackathon — Problem Statement 1 (#19)**

Individuals with special needs face persistent barriers to mobility and daily independence due to limited access to inclusive technologies. Current assistive tools are fragmented — single-modality solutions like basic navigation aids fail to address the complex, multi-layered needs of users with disabilities. The lack of multimodal integration limits real-world effectiveness.

**PathGuardian** addresses these barriers by combining adaptive navigation, ambient environment sensing, real-time caregiver intelligence, and privacy-respecting design into a single cohesive platform.

---

## 2. Product Overview

PathGuardian eliminates the anxiety of "Where are you?" calls by providing context-aware location intelligence and navigation aids tailored for people with special needs and their caregivers. It empowers seniors and individuals with disabilities to navigate independently while keeping caregivers informed and reassured.

---

## 3. User Roles

| Role | Description | Primary Interface |
|------|-------------|-------------------|
| **Care Recipient** | Seniors or individuals with disabilities requiring simple, safe navigation | `navigation.html` |
| **Caregiver** | Family members or guardians monitoring safety and location | `dashboard.html` |

---

## 4. Feature 1: Adaptive Navigation & Location Intelligence

### 4.1. Adaptive Navigation (Care Recipient)

#### Interface
- High-contrast, large buttons (>44px touch targets)
- Senior-friendly design with Outfit font
- High-contrast mode toggle

#### Destination Input
- **Text Input**: Type any known location and press Enter
  - Fuzzy matching against 14 NYC landmarks
  - Supported: museum, cafe, pharmacy, hospital, park, library, grocery, church, home, community center, post office
- **Voice Command**: 🎤 button simulates speech recognition → auto-fills "The Metropolitan Museum of Art"
- **"Take Me Home"**: One-tap button to navigate to saved home address

#### Map & Navigation
- **Blue User Marker**: Current position with shadow
- **Red Destination Marker**: Appears at end destination with tooltip label
- **Route Polyline**: Green dashed line showing the planned path
- **Turn-by-Turn Overlay**: Directional guidance (Turn Left, Turn Right, Continue Straight)

#### Privacy
- **"Private Time" Toggle**: Pauses all location sharing temporarily
- Visual indicator changes (🔒 Private ↔ 🔓 Public)

#### Ambient Sound Environment Detection
- **Real Microphone Access**: Uses Web Audio API `getUserMedia`
- **FFT Frequency Analysis**: 256-point spectrum analysis
- **5 Environment Classifications**:

| Environment | Volume Range | Frequency Profile | Icon |
|------------|-------------|-------------------|------|
| Quiet Park | 0–30 dB | Low frequency dominant | 🌳 |
| Residential Street | 30–45 dB | Balanced | 🏘️ |
| Busy Street | 45–60 dB | Mid frequency dominant | 🚗 |
| Shopping Area | 55–70 dB | High frequency dominant | 🛍️ |
| Loud / Indoor Mall | 65–100 dB | High frequency dominant | 🏬 |

- **16-Bar Audio Visualizer**: Real-time spectrum display
- **Volume & Frequency Display**: dB level and frequency profile type

### 4.2. Location Intelligence (Caregiver Dashboard)

#### Live Tracking
- **Real-Time Map**: Leaflet.js with OpenStreetMap tiles
- **GPS Simulation**: 2-second interval, 1 waypoint per tick, ~40-point NYC street route
- **Adaptive Accuracy**: Indoor (3m via Wi-Fi) vs Outdoor (10m via GPS)

#### Status & Alerts
- **Status Card**: Color-coded indicator
  - 🟢 Safe / On the move / Arriving
  - 🟡 Stationary
  - 🔴 Off-Route Detected
- **Recent Activity Log**: Auto-updating feed of events

#### Multi-Person Alert Log (🔔)
- **4 Care Recipients**: Margaret (A), Robert (B), Helen (C), James (D)
- **16 Mock Alerts** spanning various severities
- **Person Filter Chips**: Color-coded avatar buttons for filtering
- **Severity Levels**:
  - 🔴 **High**: SOS pressed, fall detected, prolonged stationary
  - 🟡 **Medium**: Off-route deviation, unfamiliar area, missed check-in
  - 🟢 **Low**: Arrived at destination, battery low, privacy mode
  - 🔵 **Info**: Journey started, check-in replied, journey completed

#### Check-In System (👋)
- **Full-Screen Overlay**: Animated pop-in card with glassmorphism backdrop
- **Phase 1** (0–3s): 📡 pulsing icon + "Check-In Sent!" + "Waiting for response..."
- **Phase 2** (after 3s): 💬 icon + "Reply Received!" + Dad's message in large 1.8rem font
- **Dismiss**: OK button to close overlay

#### Journey History (🕒)
- **Full-Screen Panel**: Slide-up animation
- **14 Mock Entries**: Spanning 3 days (Today, Yesterday, 2 Days Ago)
- **Tab Filtering**: All / Journeys / Alerts
- **Timeline View**: Color-coded dots (green/blue/amber/red)
- **Metadata**: Duration and distance for journeys

### 4.3. Technical Logic & Algorithms

#### Intelligent Deviation Detection
Alert triggers when:
1. `distance_from_route > 0.3 * total_route_distance` (Spatial Deviation)
2. `time_elapsed > 1.5 * estimated_travel_time` (Temporal Deviation)

#### Proactive Alert System
- **Trusted Locations**: Geofenced areas that suppress false "Off-Route" alerts
- **Contextual Notifications**: "Dad is at the Park" instead of raw coordinates
- **Escalation Protocol**:
  - Level 1 (Deviation): Push notification to Caregiver
  - Level 2 (Stopped + Deviation): Distress Alert

#### Battery Optimization
- **Adaptive Polling**:
  - Moving (>1m/s): Update every 2 seconds
  - Stationary (<0.5m/s): Reduced frequency
- **Positioning Accuracy**:
  - Outdoor: GPS (10m accuracy)
  - Indoor: Wi-Fi/BLE (3m accuracy)

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Reduction in "Where are you?" calls | >60% |
| Successful arrival without deviation | >90% |
| Battery preservation vs constant tracking | >40% improvement |
| Caregiver response time to alerts | <30 seconds |
| User satisfaction (senior interface) | >4.5/5 |

---

## 6. Future Roadmap

| Phase | Feature |
|-------|---------|
| **Phase 2** | Real geocoding API (Nominatim), Geolocation API |
| **Phase 3** | TensorFlow.js ambient sound ML model |
| **Phase 4** | Push notifications, Service Workers |
| **Phase 5** | Multi-language, sign language integration |
| **Phase 6** | Haptic feedback, React Native mobile app |
