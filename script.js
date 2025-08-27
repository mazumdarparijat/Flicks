// SF Traffic Monitor - Main Application
class SFTrafficMonitor {
    constructor() {
        this.map = null;
        this.trafficLayers = new Map();
        this.currentData = null;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.initializeMap();
        this.setupEventListeners();
        this.loadTrafficData();
        this.startAutoRefresh();
    }

    initializeMap() {
        // Initialize Leaflet map centered on San Francisco
        this.map = L.map('map').setView([37.7749, -122.4194], 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Add custom map controls
        this.addMapControls();
    }

    addMapControls() {
        // Add zoom control
        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);

        // Add scale control
        L.control.scale({
            position: 'bottomleft',
            metric: true,
            imperial: true
        }).addTo(this.map);
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadTrafficData();
        });

        // Time range selector
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.updateTimeRange(e.target.value);
        });

        // Road type filter
        document.getElementById('roadType').addEventListener('change', (e) => {
            this.filterByRoadType(e.target.value);
        });

        // Speed filter
        const speedSlider = document.getElementById('minSpeed');
        const speedValue = document.getElementById('minSpeedValue');
        
        speedSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            speedValue.textContent = value;
            this.filterBySpeed(value);
        });

        // Map click events
        this.map.on('click', (e) => {
            this.handleMapClick(e);
        });
    }

    async loadTrafficData() {
        if (this.isLoading) return;
        
        this.setLoading(true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Generate mock traffic data for San Francisco
            const trafficData = this.generateMockTrafficData();
            this.currentData = trafficData;
            
            this.displayTrafficData(trafficData);
            this.updateStatistics(trafficData);
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading traffic data:', error);
            this.hideLoading();
            this.showError('Failed to load traffic data. Please try again.');
        }
    }

    generateMockTrafficData() {
        const roads = [
            // Major highways
            { name: 'US-101', type: 'highway', coordinates: [[37.7849, -122.4094], [37.7649, -122.4294]], congestion: Math.random() * 100 },
            { name: 'I-280', type: 'highway', coordinates: [[37.7849, -122.4094], [37.7549, -122.4194]], congestion: Math.random() * 100 },
            { name: 'I-80', type: 'highway', coordinates: [[37.7949, -122.4094], [37.7749, -122.3994]], congestion: Math.random() * 100 },
            
            // Arterial roads
            { name: 'Market St', type: 'arterial', coordinates: [[37.7849, -122.4094], [37.7649, -122.4094]], congestion: Math.random() * 100 },
            { name: 'Geary Blvd', type: 'arterial', coordinates: [[37.7849, -122.4094], [37.7749, -122.4194]], congestion: Math.random() * 100 },
            { name: 'Van Ness Ave', type: 'arterial', coordinates: [[37.7849, -122.4094], [37.7649, -122.4194]], congestion: Math.random() * 100 },
            
            // Local streets
            { name: 'Mission St', type: 'local', coordinates: [[37.7849, -122.4094], [37.7649, -122.4094]], congestion: Math.random() * 100 },
            { name: 'Howard St', type: 'local', coordinates: [[37.7849, -122.4094], [37.7649, -122.4094]], congestion: Math.random() * 100 },
            { name: 'Folsom St', type: 'local', coordinates: [[37.7849, -122.4094], [37.7649, -122.4094]], congestion: Math.random() * 100 }
        ];

        // Generate additional random road segments
        for (let i = 0; i < 20; i++) {
            const startLat = 37.7649 + (Math.random() - 0.5) * 0.04;
            const startLng = -122.4294 + (Math.random() - 0.5) * 0.04;
            const endLat = startLat + (Math.random() - 0.5) * 0.02;
            const endLng = startLng + (Math.random() - 0.5) * 0.02;
            
            const roadTypes = ['highway', 'arterial', 'local'];
            const type = roadTypes[Math.floor(Math.random() * roadTypes.length)];
            
            roads.push({
                name: `Road ${i + 1}`,
                type: type,
                coordinates: [[startLat, startLng], [endLat, endLng]],
                congestion: Math.random() * 100,
                speed: 20 + Math.random() * 50
            });
        }

        return {
            roads: roads,
            timestamp: new Date(),
            summary: {
                averageSpeed: 35 + Math.random() * 20,
                totalCongestion: roads.reduce((sum, road) => sum + road.congestion, 0) / roads.length,
                activeRoutes: roads.length
            }
        };
    }

    displayTrafficData(data) {
        // Clear existing traffic layers
        this.clearTrafficLayers();
        
        data.roads.forEach(road => {
            const color = this.getCongestionColor(road.congestion);
            const weight = this.getRoadWeight(road.type);
            
            const polyline = L.polyline(road.coordinates, {
                color: color,
                weight: weight,
                opacity: 0.8
            }).addTo(this.map);
            
            // Add popup with road information
            const popupContent = `
                <div class="road-popup">
                    <h4>${road.name}</h4>
                    <p><strong>Type:</strong> ${road.type}</p>
                    <p><strong>Congestion:</strong> ${road.congestion.toFixed(1)}%</p>
                    <p><strong>Speed:</strong> ${road.speed ? road.speed.toFixed(1) + ' mph' : 'N/A'}</p>
                </div>
            `;
            
            polyline.bindPopup(popupContent);
            
            // Store reference to layer
            this.trafficLayers.set(road.name, {
                layer: polyline,
                data: road
            });
        });
    }

    getCongestionColor(congestion) {
        if (congestion < 20) return '#48bb78'; // Green - Free flow
        if (congestion < 60) return '#ecc94b'; // Yellow - Moderate
        if (congestion < 80) return '#ed8936'; // Orange - Heavy
        return '#f56565'; // Red - Severe
    }

    getRoadWeight(type) {
        switch (type) {
            case 'highway': return 6;
            case 'arterial': return 4;
            case 'local': return 2;
            default: return 3;
        }
    }

    updateStatistics(data) {
        document.getElementById('avgSpeed').textContent = `${data.summary.averageSpeed.toFixed(1)} mph`;
        document.getElementById('congestionLevel').textContent = `${data.summary.totalCongestion.toFixed(1)}%`;
        document.getElementById('activeRoutes').textContent = data.summary.activeRoutes;
        document.getElementById('lastUpdated').textContent = data.timestamp.toLocaleTimeString();
    }

    clearTrafficLayers() {
        this.trafficLayers.forEach(layerInfo => {
            this.map.removeLayer(layerInfo.layer);
        });
        this.trafficLayers.clear();
    }

    filterByRoadType(roadType) {
        if (roadType === 'all') {
            this.trafficLayers.forEach(layerInfo => {
                this.map.addLayer(layerInfo.layer);
            });
        } else {
            this.trafficLayers.forEach(layerInfo => {
                if (layerInfo.data.type === roadType) {
                    this.map.addLayer(layerInfo.layer);
                } else {
                    this.map.removeLayer(layerInfo.layer);
                }
            });
        }
    }

    filterBySpeed(minSpeed) {
        this.trafficLayers.forEach(layerInfo => {
            if (layerInfo.data.speed && layerInfo.data.speed >= minSpeed) {
                this.map.addLayer(layerInfo.layer);
            } else {
                this.map.removeLayer(layerInfo.layer);
            }
        });
    }

    updateTimeRange(timeRange) {
        // Simulate loading different time ranges
        this.loadTrafficData();
    }

    handleMapClick(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        // Find nearby roads
        const nearbyRoads = this.findNearbyRoads(lat, lng);
        
        if (nearbyRoads.length > 0) {
            const road = nearbyRoads[0];
            const popup = L.popup()
                .setLatLng(e.latlng)
                .setContent(`
                    <div class="click-popup">
                        <h4>Nearby Road: ${road.name}</h4>
                        <p>Congestion: ${road.congestion.toFixed(1)}%</p>
                        <p>Type: ${road.type}</p>
                    </div>
                `)
                .openOn(this.map);
        }
    }

    findNearbyRoads(lat, lng) {
        const nearby = [];
        
        this.trafficLayers.forEach(layerInfo => {
            const road = layerInfo.data;
            const distance = this.calculateDistance(lat, lng, road.coordinates[0][0], road.coordinates[0][1]);
            
            if (distance < 0.01) { // Within ~1km
                nearby.push(road);
            }
        });
        
        return nearby.sort((a, b) => a.congestion - b.congestion);
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    setLoading(loading) {
        this.isLoading = loading;
        const overlay = document.querySelector('.map-overlay');
        
        if (loading) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    hideLoading() {
        this.setLoading(false);
    }

    showError(message) {
        // Create and show error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
                <button class="error-close">×</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f56565;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.error-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    startAutoRefresh() {
        // Auto-refresh every 5 minutes
        setInterval(() => {
            this.loadTrafficData();
        }, 5 * 60 * 1000);
    }
}

// Add custom CSS for popups and notifications
const customStyles = document.createElement('style');
customStyles.textContent = `
    .road-popup h4 {
        margin: 0 0 10px 0;
        color: #2d3748;
        font-size: 1.1rem;
    }
    
    .road-popup p {
        margin: 5px 0;
        color: #718096;
    }
    
    .click-popup h4 {
        margin: 0 0 10px 0;
        color: #2d3748;
    }
    
    .click-popup p {
        margin: 5px 0;
        color: #718096;
    }
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .error-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

document.head.appendChild(customStyles);

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SFTrafficMonitor();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'r':
                    e.preventDefault();
                    document.getElementById('refreshBtn').click();
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                    e.preventDefault();
                    const timeRanges = ['1h', '6h', '24h', '7d'];
                    const index = parseInt(e.key) - 1;
                    if (timeRanges[index]) {
                        document.getElementById('timeRange').value = timeRanges[index];
                        document.getElementById('timeRange').dispatchEvent(new Event('change'));
                    }
                    break;
            }
        }
    });

    // Add tooltips for keyboard shortcuts
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.title = 'Refresh data (Ctrl+R)';
    
    const timeRange = document.getElementById('timeRange');
    timeRange.title = 'Time range (Ctrl+1-4)';
});