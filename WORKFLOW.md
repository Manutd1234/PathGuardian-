# PathGuardian — Technical Workflow & Architecture

## Technology Stack Overview

```
┌──────────────────────────────────────────────────────┐
│                   PathGuardian                        │
├──────────────┬───────────────┬───────────────────────┤
│  Frontend    │  Mapping      │  Audio Analysis       │
│  HTML5/CSS3  │  Leaflet.js   │  Web Audio API        │
│  JavaScript  │  OpenStreet   │  FFT / getUserMedia   │
│  ES6+       │  Map Tiles    │  Real-time Spectrum    │
├──────────────┴───────────────┴───────────────────────┤
│              Simulation Engine                        │
│    GPS Movement · Adaptive Polling · Geofencing      │
├──────────────────────────────────────────────────────┤
│              Design System                            │
│  CSS Custom Properties · Outfit Font · Animations    │
└──────────────────────────────────────────────────────┘
```

---

## Architecture Diagram

```
User opens index.html
        │
        ├── "Care Recipient" ──► navigation.html
        │                            │
        │                    ┌───────┴────────┐
        │                    │                │
        │              map.js (Leaflet)   ambient.js
        │              - Blue user dot    - Mic access
        │              - Red dest dot     - FFT analysis
        │              - Route polyline   - Environment ID
        │                    │                │
        │                    └───────┬────────┘
        │                            │
        │                        app.js
        │                    - Location DB (14 places)
        │                    - Destination resolver
        │                    - Voice input mock
        │                    - Privacy toggle
        │                    - SOS handler
        │
        └── "Caregiver" ──► dashboard.html
                                 │
                         ┌───────┴────────┐
                         │                │
                   map.js (Leaflet)   simulation.js
                   - Live tracking    - 2s tick interval
                   - Route display    - Walk simulation
                   - Smooth pan       - Random pauses
                         │                │
                         └───────┬────────┘
                                 │
                             app.js
                         - Alert Log (4 people)
                         - Check-In overlay
                         - Journey History
                         - Deviation detection
                         - Dashboard status
```

---

## File-by-File Breakdown

### `index.html` — Landing Page
- Role selection screen (Care Recipient vs Caregiver)
- Stores role in `localStorage`
- Routes to `navigation.html` or `dashboard.html`

### `navigation.html` — Senior Navigation
- **Input**: Text input + voice button for destination entry
- **Map**: Leaflet map with user marker (blue) and destination marker (red)
- **Turn-by-Turn**: Overlay with directional guidance
- **Ambient Panel**: Real-time microphone analysis with 16-bar visualizer
- **Controls**: "Take Me Home" and SOS Emergency buttons
- **Privacy**: "Private Time" toggle

### `dashboard.html` — Caregiver Dashboard
- **Map**: Live tracking with GPS simulation
- **Status Card**: Current status with color indicator
- **Action Grid**: Live Track, History, Check-In, Alerts buttons
- **History Panel**: Full-screen journey timeline (14 entries, 3 days)
- **Alerts Panel**: Multi-person alert log (4 people, 16 alerts)
- **Check-In Overlay**: Animated notification with reply simulation

### `css/style.css` — Design System
- CSS Custom Properties for theming
- Glass-panel morphism effects
- Responsive typography
- Button and card component styles
- High-contrast mode support

### `js/app.js` — Core Application Logic
- `MOCK_ROUTE[]` — 40-point NYC street route
- `LOCATIONS{}` — 14 location database entries
- `PathGuardianApp` class:
  - Destination resolution with fuzzy matching
  - GPS simulation event handling
  - Dashboard status updates
  - Alert log generation and rendering
  - Check-in overlay system
  - Journey history management

### `js/map.js` — Map Controller
- `MapController` class:
  - Leaflet.js initialization with OpenStreetMap tiles
  - Blue user marker with shadow
  - Red destination marker with tooltip label
  - Route polyline (green dashed)
  - Smooth animated panning

### `js/simulation.js` — GPS Simulation
- `GPSSimulator` class:
  - 2-second tick interval
  - 1 waypoint advancement per tick
  - 10% random pause chance
  - Indoor/Outdoor accuracy switching
  - Callback-based location updates

### `js/ambient.js` — Ambient Sound Analyzer
- `AmbientSoundAnalyzer` class:
  - `getUserMedia` microphone access
  - 256-point FFT with `AnalyserNode`
  - Volume dB calculation from RMS
  - 3-band frequency analysis (low/mid/high)
  - 5 environment classification profiles
  - 16-bar visualization data output
  - 2-second analysis interval

---

## Development Workflow

### Prerequisites
- A modern web browser (Chrome 80+, Edge 80+, Firefox 75+)
- No build tools, no Node.js, no package manager required
- No API keys needed (uses OpenStreetMap free tiles)

### Running Locally
```bash
# Option 1: Simply open the file
open index.html

# Option 2: Use any HTTP server
npx http-server . -p 8080
python -m http.server 8080
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Leaflet.js** over Google Maps | No API key required, instant setup, open-source |
| **Vanilla JS** over React/Vue | Minimal complexity, no build step, hackathon speed |
| **CSS Custom Properties** | Consistent theming, easy high-contrast mode switching |
| **Web Audio API** for ambient | Real browser API, no ML model download required |
| **Dense waypoint routes** | Prevents markers from jumping across water/buildings |
| **setTimeout** over requestAnimationFrame** | 2s polling is sufficient; 60fps was overkill and CPU-heavy |
| **Mock location database** | Simulates geocoding without requiring external API |

### Browser APIs Used
- `navigator.mediaDevices.getUserMedia()` — Microphone access
- `AudioContext` / `AnalyserNode` — FFT audio analysis
- `localStorage` — Role persistence
- `L.map()` (Leaflet) — Map rendering
- `setTimeout` — Non-blocking simulation ticks

---

## Data Flow

```
1. User types "cafe" → Enter key
2. resolveDestination("cafe")
3. Fuzzy match → LOCATIONS['cafe'] → { lat, lng, name }
4. mapController.setDestination(lat, lng, "Madison Ave Café")
   → Red dot marker + tooltip on map
5. planRoute()
   → mapController.drawRoute(MOCK_ROUTE)  → green dashed polyline
   → gpsSim.startSimulation(MOCK_ROUTE)   → 2s tick loop begins
6. Every 2s: gpsSim.tick()
   → moveStep() advances 1 waypoint
   → notifyUpdate() fires callback
   → app.handleLocationUpdate()
   → mapController.updateLocation() → blue dot moves
   → updateDashboardStatus() → status text changes
```
