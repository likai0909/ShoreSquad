/**
 * ShoreSquad - Main Application JavaScript
 * Features: Navigation, Smooth Scrolling, Weather API, Map Integration
 */

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initWeatherWidget();
    initEventListeners();
    loadUserPreferences();
    console.log('🌊 ShoreSquad initialized successfully!');
});

// ==================== NAVIGATION ====================
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', 
                navMenu.classList.contains('active'));
        });
    }
    
    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu?.contains(e.target) && !navToggle?.contains(e.target)) {
            navMenu?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Active nav link on scroll
    updateActiveNavLink();
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    
    // Header background on scroll
    updateHeaderBackground();
    window.addEventListener('scroll', throttle(updateHeaderBackground, 100));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function updateHeaderBackground() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== WEATHER WIDGET ====================
function initWeatherWidget() {
    const searchBtn = document.getElementById('weather-search-btn');
    const locationInput = document.getElementById('location-input');
    const weatherDisplay = document.getElementById('weather-display');
    
    if (searchBtn && locationInput) {
        searchBtn.addEventListener('click', () => {
            const location = locationInput.value.trim();
            if (location) {
                fetchWeather(location);
            } else {
                showWeatherError('Please enter a location');
            }
        });
        
        // Allow Enter key to trigger search
        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
    
    // Try to get user's location on load
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.log('Geolocation not available:', error);
                showWeatherPlaceholder();
            }
        );
    } else {
        showWeatherPlaceholder();
    }
}

async function fetchWeather(location) {
    const weatherDisplay = document.getElementById('weather-display');
    if (!weatherDisplay) return;
    
    weatherDisplay.innerHTML = '<div class="loading">🌤️ Loading weather data...</div>';
    
    // Note: In production, replace with actual weather API
    // Example: OpenWeatherMap API
    // const API_KEY = 'your-api-key';
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=imperial`;
    
    // Simulated weather data for demo
    setTimeout(() => {
        const mockWeatherData = {
            location: location,
            temperature: 72,
            condition: 'Sunny',
            humidity: 65,
            windSpeed: 8,
            icon: '☀️'
        };
        
        displayWeather(mockWeatherData);
    }, 1000);
}

async function fetchWeatherByCoords(lat, lon) {
    // Note: In production, use actual API with coordinates
    const mockWeatherData = {
        location: 'Your Location',
        temperature: 72,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 8,
        icon: '⛅'
    };
    
    displayWeather(mockWeatherData);
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weather-display');
    if (!weatherDisplay) return;
    
    weatherDisplay.innerHTML = `
        <div class="weather-info">
            <div class="weather-main">
                <div class="weather-icon">${data.icon}</div>
                <div class="weather-temp">${data.temperature}°F</div>
                <div class="weather-condition">${data.condition}</div>
            </div>
            <div class="weather-details">
                <div class="weather-detail">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${data.location}</span>
                </div>
                <div class="weather-detail">
                    <span class="detail-label">Humidity:</span>
                    <span class="detail-value">${data.humidity}%</span>
                </div>
                <div class="weather-detail">
                    <span class="detail-label">Wind Speed:</span>
                    <span class="detail-value">${data.windSpeed} mph</span>
                </div>
            </div>
        </div>
    `;
}

function showWeatherError(message) {
    const weatherDisplay = document.getElementById('weather-display');
    if (weatherDisplay) {
        weatherDisplay.innerHTML = `<div class="weather-error">❌ ${message}</div>`;
    }
}

function showWeatherPlaceholder() {
    const weatherDisplay = document.getElementById('weather-display');
    if (weatherDisplay) {
        weatherDisplay.innerHTML = '<div class="weather-placeholder">🌤️ Enter a location to check the weather</div>';
    }
}

// ==================== EVENT LISTENERS ====================
function initEventListeners() {
    // Button click handlers
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', handleCTAClick);
    });
    
    // Event card buttons
    const eventButtons = document.querySelectorAll('.event-card .btn');
    eventButtons.forEach(btn => {
        btn.addEventListener('click', handleEventJoin);
    });
    
    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta .btn, .nav-cta');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', handleSignup);
    });
    
    // Map interactions
    initMapInteractions();
    
    // Intersection Observer for scroll animations
    observeElements();
}

function handleCTAClick(e) {
    console.log('CTA clicked:', e.target.textContent);
    // In production, navigate to appropriate page or show modal
    alert('Feature coming soon! 🌊');
}

function handleEventJoin(e) {
    console.log('Join event clicked');
    // In production, show event details and registration form
    alert('Event registration coming soon! 🏖️');
}

function handleSignup(e) {
    console.log('Signup clicked');
    // In production, show signup modal or navigate to registration page
    alert('Squad signup coming soon! 👥');
}

// ==================== SCROLL ANIMATIONS ====================
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards, event cards, etc.
    const elementsToObserve = document.querySelectorAll(
        '.feature-card, .event-card, .hero-content, .hero-image'
    );
    
    elementsToObserve.forEach(el => observer.observe(el));
}

// ==================== LOCAL STORAGE ====================
function loadUserPreferences() {
    const preferences = localStorage.getItem('shoresquad_preferences');
    if (preferences) {
        const prefs = JSON.parse(preferences);
        console.log('Loaded user preferences:', prefs);
        // Apply saved preferences (e.g., theme, location)
    }
}

function saveUserPreferences(preferences) {
    localStorage.setItem('shoresquad_preferences', JSON.stringify(preferences));
    console.log('Preferences saved:', preferences);
}

// ==================== MAP INTERACTIONS ====================
function initMapInteractions() {
    // Map search functionality
    const mapSearchBtn = document.getElementById('map-search-btn');
    const mapSearchInput = document.getElementById('map-search');
    
    if (mapSearchBtn && mapSearchInput) {
        mapSearchBtn.addEventListener('click', () => {
            const searchTerm = mapSearchInput.value.trim();
            if (searchTerm) {
                handleMapSearch(searchTerm);
            }
        });
        
        mapSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                mapSearchBtn.click();
            }
        });
    }
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            handleMapFilter(filter);
        });
    });
    
    // Map event item interactions
    const mapEventItems = document.querySelectorAll('.map-event-item');
    mapEventItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn')) {
                highlightMapLocation(item.getAttribute('data-location'));
            }
        });
    });
    
    // Demo pin interactions
    const demoPins = document.querySelectorAll('.demo-pin');
    demoPins.forEach(pin => {
        pin.addEventListener('click', () => {
            const locationName = pin.querySelector('.pin-label').textContent;
            showLocationInfo(locationName);
        });
    });
}

function handleMapSearch(searchTerm) {
    console.log('Searching map for:', searchTerm);
    // In production, this would filter the map and event list
    const eventCount = document.getElementById('event-count');
    if (eventCount) {
        eventCount.textContent = `Searching for "${searchTerm}"...`;
        
        setTimeout(() => {
            eventCount.textContent = `2 events found near "${searchTerm}"`;
        }, 1000);
    }
}

function handleMapFilter(filter) {
    console.log('Filtering by:', filter);
    const eventCount = document.getElementById('event-count');
    
    // Simulate filtering
    const filterCounts = {
        'all': 3,
        'upcoming': 3,
        'today': 1,
        'near-me': 2
    };
    
    if (eventCount) {
        eventCount.textContent = `${filterCounts[filter] || 0} events found`;
    }
    
    // In production, this would filter the map markers and event list
}

function highlightMapLocation(location) {
    console.log('Highlighting location:', location);
    
    // Remove highlight from all pins
    const demoPins = document.querySelectorAll('.demo-pin');
    demoPins.forEach(pin => {
        pin.style.transform = '';
    });
    
    // Add visual feedback
    const mapEventItems = document.querySelectorAll('.map-event-item');
    mapEventItems.forEach(item => {
        if (item.getAttribute('data-location') === location) {
            item.style.backgroundColor = '#E0F2FE';
            setTimeout(() => {
                item.style.backgroundColor = '';
            }, 2000);
        }
    });
}

function showLocationInfo(locationName) {
    console.log('Showing info for:', locationName);
    alert(`📍 ${locationName}\n\nClick "View Details" on the event card to learn more!`);
}

// ==================== UTILITY FUNCTIONS ====================
/**
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

/**
 * Debounce function to delay execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Format date for display
 * @param {Date} date - Date object
 */
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// ==================== EXPORT FOR TESTING ====================
// Uncomment for module-based testing
// export { initNavigation, fetchWeather, throttle, debounce };
