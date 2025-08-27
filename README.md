# SF Traffic Monitor 🚗

A modern, interactive web application for visualizing traffic data across San Francisco. Built with HTML5, CSS3, and JavaScript, featuring an interactive map powered by Leaflet.js.

## Features ✨

### 🗺️ Interactive Map
- **Leaflet.js Integration**: High-performance mapping with OpenStreetMap tiles
- **Real-time Traffic Visualization**: Color-coded roads based on congestion levels
- **Interactive Popups**: Click on roads to see detailed traffic information
- **Zoom & Pan Controls**: Full map navigation capabilities

### 📊 Traffic Data
- **Congestion Levels**: Color-coded from green (free flow) to red (severe congestion)
- **Road Types**: Highways, arterial roads, and local streets
- **Speed Information**: Real-time speed data for each road segment
- **Auto-refresh**: Updates every 5 minutes automatically

### 🎛️ Controls & Filters
- **Time Range Selection**: View data from 1 hour to 7 days
- **Road Type Filtering**: Filter by highway, arterial, or local roads
- **Speed Filtering**: Adjustable minimum speed threshold
- **Manual Refresh**: Refresh button for immediate data updates

### 📱 Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Modern UI**: Beautiful gradient backgrounds and glass-morphism effects
- **Accessibility**: Keyboard shortcuts and screen reader friendly

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for map tiles and traffic data

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. The application will automatically load and display the San Francisco traffic map

### Local Development
To run locally with a web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🎯 Usage Guide

### Basic Navigation
- **Zoom**: Use mouse wheel or +/- buttons
- **Pan**: Click and drag to move around the map
- **Click Roads**: Click on any road to see traffic details

### Controls
- **Refresh Button**: Manually update traffic data
- **Time Range**: Select different time periods for data
- **Road Type Filter**: Show only specific road types
- **Speed Filter**: Adjust minimum speed threshold

### Keyboard Shortcuts
- `Ctrl + R`: Refresh traffic data
- `Ctrl + 1`: Last hour view
- `Ctrl + 2`: Last 6 hours view
- `Ctrl + 3`: Last 24 hours view
- `Ctrl + 4`: Last 7 days view

## 🏗️ Architecture

### Frontend Technologies
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript ES6+**: Class-based architecture with modern async/await
- **Leaflet.js**: Interactive mapping library

### Data Structure
```javascript
{
  roads: [
    {
      name: "Road Name",
      type: "highway|arterial|local",
      coordinates: [[lat1, lng1], [lat2, lng2]],
      congestion: 0-100,
      speed: mph
    }
  ],
  timestamp: Date,
  summary: {
    averageSpeed: number,
    totalCongestion: number,
    activeRoutes: number
  }
}
```

### Key Components
- **SFTrafficMonitor Class**: Main application controller
- **Map Management**: Leaflet map initialization and control
- **Data Visualization**: Traffic layer rendering and updates
- **Filtering System**: Road type and speed filtering
- **Statistics Panel**: Real-time traffic metrics

## 🎨 Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- Update the color scheme in the CSS variables
- Adjust responsive breakpoints for different screen sizes

### Data Sources
- Replace mock data generation with real API calls
- Integrate with SFMTA, Google Maps, or other traffic APIs
- Add real-time data streaming capabilities

### Map Features
- Add additional map layers (satellite, terrain)
- Implement custom markers for traffic incidents
- Add routing and navigation features

## 🔧 API Integration

To integrate with real traffic APIs:

1. **SFMTA API**: San Francisco Municipal Transportation Agency
2. **Google Maps Traffic API**: Real-time traffic data
3. **OpenStreetMap Overpass API**: Road network data
4. **Waze Traffic API**: Crowdsourced traffic information

Example API integration:
```javascript
async loadRealTrafficData() {
    try {
        const response = await fetch('https://api.sfmta.com/traffic');
        const data = await response.json();
        this.displayTrafficData(data);
    } catch (error) {
        console.error('API Error:', error);
        this.showError('Failed to load real-time data');
    }
}
```

## 📱 Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Leaflet.js**: Open-source mapping library
- **OpenStreetMap**: Free map data and tiles
- **SFMTA**: San Francisco traffic data
- **Inter Font**: Beautiful typography by Google Fonts

## 📞 Support

For questions or issues:
- Create an issue in the GitHub repository
- Check the browser console for error messages
- Ensure all files are properly loaded

---

**Built with ❤️ for San Francisco commuters**
