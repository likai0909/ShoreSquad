# 🌊 ShoreSquad

> Rally your crew, track weather, and hit the next beach cleanup with our dope map app!

## 📋 Project Overview

**ShoreSquad** creates value by mobilizing young people to clean beaches, using weather and maps for easy planning and social features to make eco-action fun and connected.

## 🎨 Design System

### Color Palette
- **Primary Blue** (#0EA5E9) - Ocean/sky blue representing trust and environmental focus
- **Secondary Teal** (#14B8A6) - Beach water, fresh and youthful energy
- **Accent Coral** (#FB7185) - Sunset/coral warmth, call to action
- **Success Green** (#10B981) - Eco-friendly growth and positive impact
- **Neutral Sand** (#F5F5F4) - Clean, accessible background
- **Dark Navy** (#1E293B) - Text and contrast

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

## ✨ Features

- 🗺️ **Interactive Map** - Find cleanup events near you
- 🌤️ **Weather Tracking** - Check real-time weather conditions
- 👥 **Rally Your Crew** - Create and join events with friends
- 📊 **Track Impact** - Monitor progress and earn badges
- 📱 **Mobile-First Design** - Fully responsive across all devices
- ♿ **Accessible** - WCAG AA compliant

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code with Live Server extension (recommended)

### Installation

1. **Clone or download** this repository
2. **Open the project** in VS Code
3. **Enable AutoSave** (File > Auto Save) - highly recommended!
4. **Install Live Server** extension if not already installed
5. **Right-click** on `index.html` and select "Open with Live Server"

### Project Structure

```
ShoreSquad/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles and responsive design
├── js/
│   └── app.js          # JavaScript functionality
├── .vscode/
│   └── settings.json   # VS Code & Live Server config
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **Vanilla JavaScript** - Interactive features, no frameworks
- **Local Storage** - User preference persistence

## 🎯 Key JavaScript Features

- Smooth scrolling navigation
- Mobile-responsive hamburger menu
- Active nav link detection on scroll
- Weather API integration (ready for real API)
- Intersection Observer for scroll animations
- Throttle/debounce utilities for performance
- Local storage for user preferences

## 🎨 UX Design Principles

1. **Mobile-First** - Designed for small screens first
2. **High Contrast** - WCAG AA compliance for accessibility
3. **Touch-Friendly** - Minimum 44x44px touch targets
4. **Clear Hierarchy** - Generous whitespace and visual flow
5. **Progressive Disclosure** - Information revealed as needed
6. **Intuitive Icons** - Clear iconography with text labels
7. **Fast Performance** - Optimized load times under 3 seconds
8. **Keyboard Navigation** - Full accessibility support

## 🔧 Customization

### Adding a Real Weather API

1. Sign up for [OpenWeatherMap API](https://openweathermap.org/api)
2. Get your API key
3. Update `js/app.js` in the `fetchWeather()` function:

```javascript
const API_KEY = 'your-api-key-here';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=imperial`;
```

### Adding a Map

1. Choose a map provider (Leaflet, Mapbox, Google Maps)
2. Add the library CDN to `index.html`
3. Initialize the map in `js/app.js`

Example with Leaflet:
```html
<!-- In head section -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This is a learning project! Feel free to:
- Experiment with the code
- Add new features
- Improve the design
- Make it your own!

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

## 🎉 Have Fun!

Remember: There's no single "right" solution—craft it your way! Make ShoreSquad uniquely yours while learning web development fundamentals.

---

**Made with 🌊 for cleaner beaches**
