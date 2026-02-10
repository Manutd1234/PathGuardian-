// GPS Simulation Engine for PathGuardian
// Provides smooth, realistic movement along a route

class GPSSimulator {
    constructor() {
        this.currentPos = [40.78385, -73.95865]; // Start: E 79th & 5th Ave
        this.isMoving = false;
        this.speed = 0;        // m/s (simulated)
        this.accuracy = 10;    // meters
        this.callbacks = [];
        this.routePath = [];
        this.progressIndex = 0;
        this.interpolationProgress = 0; // 0-1 between current and next waypoint
        this.animFrameId = null;
        this.lastTickTime = 0;
    }

    startSimulation(route) {
        this.stopSimulation(); // Clean up any existing run
        this.routePath = route;
        this.isMoving = true;
        this.progressIndex = 0;
        this.interpolationProgress = 0;
        this.speed = 1.2;
        this.accuracy = 10;
        this.currentPos = [...route[0]];
        this.tick();
    }

    tick() {
        if (!this.isMoving) return;

        this.moveStep();
        this.notifyUpdate();

        // Indoor/Outdoor accuracy simulation
        const totalPts = this.routePath.length;
        if (this.progressIndex < 3 || this.progressIndex > totalPts - 4) {
            this.accuracy = 3; // Indoor (Wi-Fi)
        } else {
            this.accuracy = 10; // Outdoor GPS
        }

        // Update every 2 seconds — smooth and gentle on the browser
        this.timerId = setTimeout(() => this.tick(), 2000);
    }

    moveStep() {
        if (this.progressIndex >= this.routePath.length - 1) {
            this.stopSimulation();
            console.log("Arrived at destination");
            return;
        }

        // Random pause: ~10% chance to stay in place this tick
        if (Math.random() < 0.10) {
            this.speed = 0;
            return;
        }

        this.speed = 1.2;

        // Advance 1 waypoint per tick (~20-30m per 2s ≈ slow walking pace)
        this.progressIndex = Math.min(this.progressIndex + 1, this.routePath.length - 1);
        this.currentPos = [...this.routePath[this.progressIndex]];
    }

    stopSimulation() {
        this.isMoving = false;
        this.speed = 0;
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }

    onUpdate(callback) {
        this.callbacks.push(callback);
    }

    notifyUpdate() {
        const data = {
            lat: this.currentPos[0],
            lng: this.currentPos[1],
            speed: this.speed,
            accuracy: this.accuracy,
            timestamp: new Date()
        };
        this.callbacks.forEach(cb => cb(data));
    }
}

// Global instance
window.gpsSim = new GPSSimulator();
