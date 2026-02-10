// Dense route following NYC streets: E 79th & 5th Ave → north on 5th Ave → E 82nd → Met Museum
// Each point is ~15-25 meters apart for smooth walking animation
const MOCK_ROUTE = [
    // Start: E 79th St & 5th Ave (Upper East Side)
    [40.78385, -73.95865],
    [40.78405, -73.95860],
    [40.78430, -73.95850],
    [40.78455, -73.95843],
    // Walking north on 5th Avenue (sidewalk along Central Park)
    [40.78480, -73.95835],
    [40.78510, -73.95825],
    [40.78540, -73.95815],
    [40.78570, -73.95805],
    [40.78600, -73.95795],
    [40.78630, -73.95785],
    [40.78660, -73.95775],
    [40.78690, -73.95765],
    [40.78720, -73.95755],
    // Passing E 80th St
    [40.78750, -73.95745],
    [40.78780, -73.95735],
    [40.78810, -73.95725],
    [40.78840, -73.95715],
    [40.78870, -73.95705],
    // Passing E 81st St
    [40.78900, -73.95695],
    [40.78930, -73.95685],
    [40.78960, -73.95675],
    [40.78990, -73.95665],
    [40.79020, -73.95655],
    // Approaching E 82nd St
    [40.79050, -73.95645],
    [40.79080, -73.95640],
    [40.79100, -73.95635],
    // Turning east on E 82nd St toward the Met Museum
    [40.79100, -73.95610],
    [40.79100, -73.95580],
    [40.79100, -73.95550],
    [40.79100, -73.95520],
    [40.79100, -73.95490],
    [40.79100, -73.95460],
    [40.79100, -73.95430],
    [40.79100, -73.95400],
    // Approaching the Metropolitan Museum of Art entrance
    [40.79102, -73.95370],
    [40.79105, -73.95340],
    [40.79108, -73.95310],
    [40.79110, -73.95290],
    // Arrival: The Metropolitan Museum of Art
    [40.79115, -73.95270],
    [40.79120, -73.95250]
];

// Location database — known destinations for the text input
const LOCATIONS = {
    'metropolitan museum': { lat: 40.79120, lng: -73.95250, name: 'The Metropolitan Museum of Art' },
    'met museum': { lat: 40.79120, lng: -73.95250, name: 'The Metropolitan Museum of Art' },
    'the met': { lat: 40.79120, lng: -73.95250, name: 'The Metropolitan Museum of Art' },
    'central park': { lat: 40.78500, lng: -73.96550, name: 'Central Park' },
    'community center': { lat: 40.79300, lng: -73.95100, name: 'East Side Community Center' },
    'pharmacy': { lat: 40.78250, lng: -73.95400, name: 'Oak Street Pharmacy' },
    'home': { lat: 40.78385, lng: -73.95865, name: 'Home — 123 Maple St' },
    'grocery': { lat: 40.78100, lng: -73.95700, name: 'Greenfield Grocery' },
    'park': { lat: 40.78500, lng: -73.96550, name: 'Central Park' },
    'library': { lat: 40.78580, lng: -73.95200, name: 'East 79th St Library' },
    'hospital': { lat: 40.79050, lng: -73.95300, name: 'Lenox Hill Hospital' },
    'church': { lat: 40.78680, lng: -73.96100, name: 'St. Ignatius Church' },
    'cafe': { lat: 40.78450, lng: -73.95600, name: 'Madison Ave Café' },
    'post office': { lat: 40.78300, lng: -73.95900, name: 'USPS Post Office' },
};

class PathGuardianApp {
    constructor() {
        this.role = localStorage.getItem('safeStepRole') || 'recipient';
        this.init();
    }

    init() {
        console.log('PathGuardian App Initialized (Role: ' + this.role + ')');

        // Listen for Simulation Updates
        if (window.gpsSim) {
            window.gpsSim.onUpdate((data) => {
                this.handleLocationUpdate(data);
            });
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Destination text input — Enter key to search
        const destInput = document.querySelector('#destInput');
        if (destInput) {
            destInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = destInput.value.trim();
                    if (query) this.resolveDestination(query);
                }
            });
        }

        // Voice Input Mock
        const voiceBtn = document.querySelector('.voice-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                const input = document.querySelector('#destInput');
                input.value = "Listening...";
                setTimeout(() => {
                    input.value = "The Metropolitan Museum of Art";
                    this.resolveDestination(input.value);
                }, 1500);
            });
        }

        // Private Time Toggle
        const privateBtn = document.querySelector('#privateTimeBtn');
        if (privateBtn) {
            privateBtn.addEventListener('click', () => this.togglePrivateMode(privateBtn));
        }
    }

    resolveDestination(query) {
        const q = query.toLowerCase();
        let match = null;

        // Fuzzy match: check if query contains any known location keyword
        for (const [key, loc] of Object.entries(LOCATIONS)) {
            if (q.includes(key) || key.includes(q)) {
                match = loc;
                break;
            }
        }

        if (!match) {
            // Default to Met Museum if no match
            match = LOCATIONS['metropolitan museum'];
            console.log('Location not found, defaulting to Met Museum');
        }

        const input = document.querySelector('#destInput');
        if (input) input.value = match.name;

        // Show red destination marker
        if (window.mapController) {
            window.mapController.setDestination(match.lat, match.lng, match.name);
        }

        // Start route
        this.planRoute();
    }

    togglePrivateMode(btn) {
        this.isPrivate = !this.isPrivate;
        if (this.isPrivate) {
            btn.innerText = "🔓 Public";
            btn.style.background = "#EF4444";
            btn.style.color = "white";
            if (window.gpsSim) window.gpsSim.stopSimulation();
            alert("Privacy Mode Enabled: Location sharing paused.");
        } else {
            btn.innerText = "🔒 Private";
            btn.style.background = "";
            btn.style.color = "";
            alert("Privacy Mode Disabled: Location sharing resumed.");
            if (this.isOnRoute && window.gpsSim) window.gpsSim.startSimulation(MOCK_ROUTE);
        }
    }

    planRoute() {
        console.log("Planning Safe Route...");
        this.isOnRoute = true;
        // Mock API Call delay
        if (window.mapController) {
            window.mapController.drawRoute(MOCK_ROUTE);
            window.gpsSim.startSimulation(MOCK_ROUTE);

            // Show Navigation Instruction
            const navPanel = document.getElementById('turnInstruction');
            if (navPanel) navPanel.style.display = 'flex';
        }
    }

    handleLocationUpdate(data) {
        if (this.isPrivate) return; // Don't update if private

        console.log("Location Update:", data);
        if (window.mapController) {
            window.mapController.updateLocation(data.lat, data.lng);
        }

        // Dashboard Update
        this.updateDashboardStatus(data); // Will only work if on dashboard page with those elements

        // Mock Turn Updates
        const navPanel = document.getElementById('turnInstruction');
        if (navPanel && Math.random() > 0.7) {
            // Randomly switch instructions for demo
            const turns = ["Turn Left", "Turn Right", "Continue Straight"];
            const turn = turns[Math.floor(Math.random() * turns.length)];
            navPanel.querySelector('h3').innerText = turn;
            navPanel.querySelector('p').innerText = `in ${Math.floor(Math.random() * 100)} meters`;
        }
    }

    navigateHome() {
        alert("Navigating Home: 123 Maple Street");
        this.planRoute();
    }

    triggerSOS() {
        alert("SOS Triggered! Notifying Caregiver...");
        document.querySelector('.sos-btn').style.background = "red";
        document.querySelector('.sos-btn').innerText = "ALERT SENT!";
    }

    // ===== CHECK-IN OVERLAY =====
    triggerCheckIn() {
        const overlay = document.getElementById('checkinOverlay');
        const icon = document.getElementById('checkinIcon');
        const title = document.getElementById('checkinTitle');
        const subtitle = document.getElementById('checkinSubtitle');
        const reply = document.getElementById('checkinReply');
        const dismiss = document.getElementById('checkinDismiss');

        if (!overlay) return;

        // Reset state
        icon.textContent = '📡';
        title.textContent = 'Check-In Sent!';
        subtitle.textContent = 'Waiting for response...';
        reply.classList.remove('visible');
        reply.textContent = '';
        dismiss.classList.remove('visible');

        // Show overlay
        overlay.classList.add('active');

        // After 3 seconds, show the reply
        setTimeout(() => {
            icon.textContent = '💬';
            icon.style.animation = 'none'; // stop pulse
            void icon.offsetWidth; // trigger reflow
            icon.style.animation = 'popIn 0.4s ease-out';

            title.textContent = 'Reply Received!';
            subtitle.textContent = 'Dad says:';
            reply.textContent = '"I\'m doing great! Just finished my walk. 😊"';
            reply.classList.add('visible');
            dismiss.classList.add('visible');
        }, 3000);

        // Dismiss handler
        dismiss.onclick = () => {
            overlay.classList.remove('active');
            icon.style.animation = 'pulse 1.5s ease-in-out infinite'; // restore pulse
        };
    }

    // Caregiver Logic
    initCaregiverDashboard() {
        // Build mock data
        this.journeyHistory = this.generateMockHistory();
        this.alertLog = this.generateMockAlerts();

        // Wire up action buttons
        const checkInBtns = document.querySelectorAll('.action-btn');
        checkInBtns.forEach(btn => {
            if (btn.innerText.includes('Check-In')) {
                btn.addEventListener('click', () => this.triggerCheckIn());
            }
            if (btn.innerText.includes('History')) {
                btn.addEventListener('click', () => this.openHistory());
            }
            if (btn.innerText.includes('Alerts')) {
                btn.addEventListener('click', () => this.openAlerts());
            }
        });

        // History close + tabs
        const closeBtn = document.getElementById('historyCloseBtn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeHistory());

        document.querySelectorAll('.history-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.renderHistory(e.target.dataset.filter);
            });
        });

        // Alerts close + person filters
        const alertsClose = document.getElementById('alertsCloseBtn');
        if (alertsClose) alertsClose.addEventListener('click', () => this.closeAlerts());

        document.querySelectorAll('.person-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const btn = e.target.closest('.person-chip');
                document.querySelectorAll('.person-chip').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                this.renderAlerts(btn.dataset.person);
            });
        });
    }

    // ===== ALERTS SYSTEM =====
    generateMockAlerts() {
        const now = new Date();
        const ago = (h, m = 0) => {
            const d = new Date(now);
            d.setHours(d.getHours() - h, d.getMinutes() - m);
            return d;
        };

        return [
            // Margaret (Person A) - purple
            { person: 'A', name: 'Margaret', severity: 'high', title: 'SOS Button Pressed', desc: 'Margaret pressed the emergency button near Central Park West.', time: ago(0, 12), avatarClass: 'avatar-a' },
            { person: 'A', name: 'Margaret', severity: 'medium', title: 'Off-Route Deviation', desc: 'Deviated 120m from planned route on 5th Avenue.', time: ago(0, 35), avatarClass: 'avatar-a' },
            { person: 'A', name: 'Margaret', severity: 'low', title: 'Arrived at Community Center', desc: 'Successfully reached trusted destination.', time: ago(1, 20), avatarClass: 'avatar-a' },
            { person: 'A', name: 'Margaret', severity: 'info', title: 'Journey Started', desc: 'Left home heading to Community Center.', time: ago(1, 45), avatarClass: 'avatar-a' },

            // Robert (Person B) - pink
            { person: 'B', name: 'Robert', severity: 'high', title: 'Stationary for 15 Minutes', desc: 'Robert has not moved from an unfamiliar location on Main St.', time: ago(0, 20), avatarClass: 'avatar-b' },
            { person: 'B', name: 'Robert', severity: 'medium', title: 'Entered Unfamiliar Area', desc: 'Detected in an area outside normal travel patterns.', time: ago(0, 50), avatarClass: 'avatar-b' },
            { person: 'B', name: 'Robert', severity: 'info', title: 'Check-In Replied', desc: 'Robert responded: "I\'m fine, just resting at the bench."', time: ago(1, 5), avatarClass: 'avatar-b' },
            { person: 'B', name: 'Robert', severity: 'low', title: 'Battery Low (15%)', desc: 'Device battery is below 20%. Tracking may stop soon.', time: ago(2, 0), avatarClass: 'avatar-b' },

            // Helen (Person C) - amber
            { person: 'C', name: 'Helen', severity: 'medium', title: 'Missed Morning Check-In', desc: 'Helen did not respond to the 9:00 AM check-in request.', time: ago(3, 0), avatarClass: 'avatar-c' },
            { person: 'C', name: 'Helen', severity: 'low', title: 'Arrived at Pharmacy', desc: 'Reached trusted location: Oak Street Pharmacy.', time: ago(4, 10), avatarClass: 'avatar-c' },
            { person: 'C', name: 'Helen', severity: 'info', title: 'Journey Completed', desc: 'Returned home from pharmacy in 22 minutes.', time: ago(4, 35), avatarClass: 'avatar-c' },
            { person: 'C', name: 'Helen', severity: 'low', title: 'Privacy Mode Activated', desc: 'Helen turned on Private Mode at 2:15 PM.', time: ago(5, 0), avatarClass: 'avatar-c' },

            // James (Person D) - green
            { person: 'D', name: 'James', severity: 'high', title: 'Fall Detected', desc: 'Accelerometer pattern suggests a possible fall near Elm Park.', time: ago(0, 5), avatarClass: 'avatar-d' },
            { person: 'D', name: 'James', severity: 'info', title: 'Check-In Replied', desc: 'James responded: "I tripped but I\'m okay."', time: ago(0, 8), avatarClass: 'avatar-d' },
            { person: 'D', name: 'James', severity: 'medium', title: 'Walking Speed Unusually Slow', desc: 'Average speed 0.3 m/s compared to usual 1.1 m/s.', time: ago(1, 0), avatarClass: 'avatar-d' },
            { person: 'D', name: 'James', severity: 'low', title: 'Arrived Home', desc: 'Successfully returned home. Total travel: 35 min.', time: ago(2, 30), avatarClass: 'avatar-d' },
        ];
    }

    openAlerts() {
        const panel = document.getElementById('alertsPanel');
        if (panel) {
            panel.classList.add('active');
            document.querySelectorAll('.person-chip').forEach(c => c.classList.remove('active'));
            document.querySelector('.person-chip[data-person="all"]').classList.add('active');
            this.renderAlerts('all');
        }
    }

    closeAlerts() {
        const panel = document.getElementById('alertsPanel');
        if (panel) panel.classList.remove('active');
    }

    renderAlerts(personFilter = 'all') {
        const list = document.getElementById('alertsList');
        if (!list) return;

        let entries = this.alertLog || [];
        if (personFilter !== 'all') {
            entries = entries.filter(e => e.person === personFilter);
        }

        // Sort by time (newest first)
        entries.sort((a, b) => b.time - a.time);

        let html = '';
        entries.forEach(item => {
            const timeStr = item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = item.time.toLocaleDateString([], { month: 'short', day: 'numeric' });

            html += `
                <div class="alert-card severity-${item.severity}">
                    <div class="card-avatar ${item.avatarClass}">${item.person}</div>
                    <div class="alert-card-body">
                        <div class="card-title">${item.title}</div>
                        <div class="card-desc">${item.desc}</div>
                        <div class="alert-card-meta">
                            <span>${item.name}</span>
                            <span>${dateStr}, ${timeStr}</span>
                            <span class="severity-badge ${item.severity}">${item.severity}</span>
                        </div>
                    </div>
                </div>`;
        });

        if (entries.length === 0) {
            html = '<p style="text-align:center; color:var(--text-light); margin-top:40px;">No alerts for this person.</p>';
        }

        list.innerHTML = html;
    }

    generateMockHistory() {
        const now = new Date();
        const h = (hoursAgo, minAgo = 0) => {
            const d = new Date(now);
            d.setHours(d.getHours() - hoursAgo, d.getMinutes() - minAgo);
            return d;
        };
        return [
            // Today
            { type: 'journey', title: 'Home → Community Center', duration: '18 min', distance: '0.9 mi', time: h(0, 45), dot: 'green', day: 'today' },
            { type: 'alert', title: '⚠️ Slight deviation on Oak St', duration: null, distance: null, time: h(1, 10), dot: 'amber', day: 'today' },
            { type: 'journey', title: 'Community Center → Park', duration: '12 min', distance: '0.5 mi', time: h(2), dot: 'green', day: 'today' },
            { type: 'alert', title: '✅ Arrived at Park (Trusted Location)', duration: null, distance: null, time: h(2, 12), dot: 'blue', day: 'today' },
            { type: 'journey', title: 'Park → Home', duration: '22 min', distance: '1.1 mi', time: h(3), dot: 'green', day: 'today' },
            { type: 'alert', title: '✅ Arrived Home safely', duration: null, distance: null, time: h(3, 22), dot: 'green', day: 'today' },
            // Yesterday
            { type: 'journey', title: 'Home → Pharmacy', duration: '10 min', distance: '0.4 mi', time: h(25), dot: 'green', day: 'yesterday' },
            { type: 'journey', title: 'Pharmacy → Community Center', duration: '15 min', distance: '0.7 mi', time: h(26), dot: 'green', day: 'yesterday' },
            { type: 'alert', title: '🔴 Stopped for 8 min on Main St', duration: null, distance: null, time: h(26, 20), dot: 'red', day: 'yesterday' },
            { type: 'alert', title: '✅ Resumed movement', duration: null, distance: null, time: h(26, 28), dot: 'blue', day: 'yesterday' },
            { type: 'journey', title: 'Community Center → Home', duration: '20 min', distance: '0.9 mi', time: h(28), dot: 'green', day: 'yesterday' },
            // 2 days ago
            { type: 'journey', title: 'Home → Museum', duration: '25 min', distance: '1.3 mi', time: h(50), dot: 'green', day: '2 days ago' },
            { type: 'alert', title: '⚠️ Off-route detected near 5th Ave', duration: null, distance: null, time: h(50, 15), dot: 'amber', day: '2 days ago' },
            { type: 'journey', title: 'Museum → Home', duration: '28 min', distance: '1.3 mi', time: h(53), dot: 'green', day: '2 days ago' },
        ];
    }

    openHistory() {
        const panel = document.getElementById('historyPanel');
        if (panel) {
            panel.classList.add('active');
            // Reset to "All" tab
            document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
            document.querySelector('.history-tab[data-filter="all"]').classList.add('active');
            this.renderHistory('all');
        }
    }

    closeHistory() {
        const panel = document.getElementById('historyPanel');
        if (panel) panel.classList.remove('active');
    }

    renderHistory(filter = 'all') {
        const list = document.getElementById('historyList');
        if (!list) return;

        let entries = this.journeyHistory || [];
        if (filter === 'journeys') entries = entries.filter(e => e.type === 'journey');
        if (filter === 'alerts') entries = entries.filter(e => e.type === 'alert');

        // Group by day
        const groups = {};
        entries.forEach(e => {
            if (!groups[e.day]) groups[e.day] = [];
            groups[e.day].push(e);
        });

        let html = '';
        for (const [day, items] of Object.entries(groups)) {
            html += `<div class="history-day">`;
            html += `<div class="history-day-label">${day.charAt(0).toUpperCase() + day.slice(1)}</div>`;
            items.forEach(item => {
                const timeStr = item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const meta = item.type === 'journey'
                    ? `<span>⏱ ${item.duration}</span><span>📍 ${item.distance}</span>`
                    : '';
                html += `
                    <div class="history-entry">
                        <div class="history-dot ${item.dot}"></div>
                        <div class="history-details">
                            <div class="title">${item.title}</div>
                            <div class="meta">${meta}</div>
                        </div>
                        <div class="history-time">${timeStr}</div>
                    </div>`;
            });
            html += `</div>`;
        }

        list.innerHTML = html;
    }

    updateDashboardStatus(data) {
        const statusTitle = document.getElementById('statusText');
        const statusIndicator = document.querySelector('.status-indicator');

        if (!statusTitle) return;

        // Geofencing / Journey Intent Logic
        const distToDest = Math.abs(data.lat - MOCK_ROUTE[MOCK_ROUTE.length - 1][0]) + Math.abs(data.lng - MOCK_ROUTE[MOCK_ROUTE.length - 1][1]);
        const distToStart = Math.abs(data.lat - MOCK_ROUTE[0][0]) + Math.abs(data.lng - MOCK_ROUTE[0][1]);

        let status = "Unknown";
        let color = "#10B981"; // Green

        if (distToDest < 0.002) {
            status = "Arriving at Museum";
        } else if (distToStart < 0.002) {
            status = "Leaving Home";
        } else if (data.speed > 0.5) {
            status = "On the move - Heading to Museum";
        } else {
            status = "Stationary";
            color = "#F59E0B"; // Amber
        }

        // Deviation Detection (Mock)
        // Simple check: if lat is too far from route logic (omitted for simple proto, using random)
        if (Math.random() > 0.95) {
            status = "⚠️ Off-Route Detected";
            color = "#EF4444"; // Red
            this.logActivity("⚠️ Deviation Detected", "warning");
        }

        statusTitle.innerText = status;
        statusIndicator.style.background = color;
        statusIndicator.style.boxShadow = `0 0 0 4px ${color}33`; // 20% opacity hex
    }

    logActivity(msg, type = 'info') {
        const log = document.getElementById('activityLog');
        if (!log) return;

        const div = document.createElement('div');
        div.className = `alert-item ${type}`;
        div.innerHTML = `<span>${type === 'warning' ? '⚠️' : 'ℹ️'}</span> ${msg} (${new Date().toLocaleTimeString()})`;
        log.prepend(div);
    }
}

const app = new PathGuardianApp();

// Auto-start simulation for Dashboard Demo
if (window.location.href.includes('dashboard.html')) {
    setTimeout(() => {
        if (window.gpsSim) window.gpsSim.startSimulation(MOCK_ROUTE);
        app.initCaregiverDashboard();
    }, 1000);
}

