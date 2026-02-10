// Map Logic for PathGuardian (Leaflet.js — no API key needed)

class MapController {
    constructor(elementId) {
        this.map = null;
        this.marker = null;
        this.destMarker = null;
        this.routeLine = null;
        this.elementId = elementId;
        this.initMap();
    }

    initMap() {
        const defaultCenter = [40.78385, -73.95865];

        this.map = L.map(this.elementId).setView(defaultCenter, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

        // Custom user marker (blue dot)
        this.userIcon = L.divIcon({
            className: 'user-marker',
            html: '<div style="background:#4F46E5;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.5);"></div>',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });

        // Red destination marker
        this.destIcon = L.divIcon({
            className: 'dest-marker',
            html: '<div style="background:#EF4444;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 12px rgba(239,68,68,0.6);"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        this.marker = L.marker(defaultCenter, { icon: this.userIcon }).addTo(this.map);

        console.log('Map Initialized');
    }

    updateLocation(lat, lng) {
        if (this.marker) {
            this.marker.setLatLng([lat, lng]);
            this.map.panTo([lat, lng], { animate: true, duration: 0.5 });
        }
    }

    setDestination(lat, lng, label) {
        // Remove old destination marker
        if (this.destMarker) {
            this.map.removeLayer(this.destMarker);
        }

        this.destMarker = L.marker([lat, lng], { icon: this.destIcon }).addTo(this.map);

        // Add a tooltip with the destination name
        if (label) {
            this.destMarker.bindTooltip(label, {
                permanent: true,
                direction: 'top',
                offset: [0, -14],
                className: 'dest-tooltip'
            }).openTooltip();
        }
    }

    drawRoute(routePoints) {
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
        }

        this.routeLine = L.polyline(routePoints, {
            color: '#10B981',
            weight: 6,
            opacity: 0.8,
            dashArray: '10, 10'
        }).addTo(this.map);

        // Set destination marker at the end of the route
        const endPoint = routePoints[routePoints.length - 1];
        this.setDestination(endPoint[0], endPoint[1]);

        this.map.fitBounds(this.routeLine.getBounds(), { padding: [50, 50] });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('map')) {
        const mapController = new MapController('map');
        window.mapController = mapController;
    }
});
