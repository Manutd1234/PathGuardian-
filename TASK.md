# PathGuardian — Development Task Tracker

## Feature 1: Adaptive Navigation & Location Intelligence

### 🏗️ Foundation
- [x] Project scaffolding (HTML/CSS/JS structure)
- [x] Design system with CSS custom properties
- [x] Google Fonts (Outfit) integration
- [x] Responsive layout with Flexbox/Grid
- [x] Leaflet.js map integration (replaced Google Maps — no API key needed)

### 🧭 Senior Navigation Interface (`navigation.html`)
- [x] High-contrast UI with large touch targets (>44px)
- [x] "Where to?" destination text input with **Enter key** support
- [x] Location database with 14 NYC landmarks (fuzzy matching)
- [x] Voice input mock (🎤 button fills "The Metropolitan Museum of Art")
- [x] Red destination dot marker on map with tooltip label
- [x] Turn-by-turn navigation overlay with directional guidance
- [x] "Take Me Home" one-tap button
- [x] "Private Time" toggle (pauses location sharing)
- [x] SOS Emergency button
- [x] High-contrast mode support

### 🎙️ Ambient Sound Environment Detection
- [x] Web Audio API microphone access (`getUserMedia`)
- [x] FFT frequency analysis (256-point)
- [x] Volume (dB) calculation from RMS
- [x] Frequency band classification (low/mid/high)
- [x] 5 environment profiles:
  - 🌳 Quiet Park (0-30 dB, low freq)
  - 🏘️ Residential Street (30-45 dB, balanced)
  - 🚗 Busy Street (45-60 dB, mid freq)
  - 🛍️ Shopping Area (55-70 dB, high freq)
  - 🏬 Loud Indoor Mall (65-100 dB, high freq)
- [x] Real-time 16-bar audio visualizer
- [x] Start/Stop toggle button
- [x] Color-coded display matching detected environment

### 📊 Caregiver Dashboard (`dashboard.html`)
- [x] Live map view with real-time tracking
- [x] Status indicator card (Safe/On the move/Stationary/Off-route)
- [x] GPS simulation engine with smooth movement
  - [x] 2-second tick interval, 1 waypoint per tick
  - [x] Dense ~40-point NYC street route
  - [x] 10% random pause chance (simulates stopping)
  - [x] Indoor/Outdoor accuracy switching
- [x] Deviation detection with visual alerts
- [x] Recent activity log (auto-updating)

### 🔔 Multi-Person Alert Log
- [x] Full-screen alerts overlay panel
- [x] 4 care recipients: Margaret (A), Robert (B), Helen (C), James (D)
- [x] 16 mock alerts with varying severities
- [x] Person-based filter chips with colored avatars
- [x] Severity color coding: 🔴 High · 🟡 Medium · 🟢 Low · 🔵 Info
- [x] Border-left color + background tinting per severity

### 👋 Check-In System
- [x] Full-screen animated notification overlay
- [x] Glassmorphism backdrop blur
- [x] Pulsing 📡 icon with "Check-In Sent!" title
- [x] 3-second delay, then 💬 "Reply Received!" with big font message
- [x] OK dismiss button
- [x] Replaces browser `alert()` for premium UX

### 🕒 Journey History
- [x] Full-screen history panel with slide-up animation
- [x] 14 mock entries spanning 3 days
- [x] Tab filtering (All / Journeys / Alerts)
- [x] Day grouping (Today / Yesterday / 2 Days Ago)
- [x] Color-coded timeline dots (green/blue/amber/red)
- [x] Duration and distance metadata for journeys

---

## Documentation
- [x] README.md — Problem statement, features, getting started
- [x] PRD.md — Product requirements document
- [x] TASK.md — This file
- [x] WORKFLOW.md — Technical workflow and architecture
- [x] Push to GitHub

---

## Future Work (Feature 2 & Beyond)
- [ ] Real geocoding API integration (Nominatim or similar)
- [ ] TensorFlow.js for ML-based ambient sound classification
- [ ] Real GPS tracking via Geolocation API
- [ ] Push notifications via Service Workers
- [ ] Multi-language support / sign language integration
- [ ] Haptic feedback for navigation turns
- [ ] Caregiver mobile app (React Native)
